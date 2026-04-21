// ============================================================
// SG PROPERTY CONSULTATION ENGINE v1.0
// ============================================================
// Phase 2: Core Calculation Engine
// Phase 4: Scenario Comparison Engine
//
// All Singapore property financial calculations in one module.
// Designed to be imported by React dashboard (Phase 5).
// Every formula matches the Excel models (Prop_Calculator_v2
// and SG_Investment_Property_Analyser_v2).
// ============================================================

// ────────────────────────────────────────────────────────────
// SECTION 1: GLOBAL DEFAULTS
// ────────────────────────────────────────────────────────────
export const DEFAULTS = {
  // Financing
  mortgageRate: 0.015,       // Current 3yr fixed
  stressTestRate: 0.04,      // MAS stress test rate for TDSR
  investmentRate: 0.038,     // Expected avg rate over hold period
  loanTenure: 30,            // Years
  ltv1st: 0.75,              // 1st property LTV
  ltv2nd: 0.45,              // 2nd property LTV (with outstanding loan)
  ltvHDB: 0.80,              // HDB loan LTV

  // ABSD rates (Apr 2023 onwards)
  absd: {
    SC:       [0, 0.20, 0.35],    // 1st, 2nd, 3rd+
    PR:       [0.05, 0.30, 0.35],
    Foreigner: [0.60, 0.60, 0.60],
  },

  // Acquisition costs
  legalFees: 3800,
  renoFurnishing: 20000,     // For investment (rental-ready)
  agentCommBuy: 0,           // Buyer pays 0%
  agentCommSell: 0.01,       // 1% on exit

  // Rental & tax
  occupancyRate: 0.90,
  avPctOfRent: 0.85,
  propTaxRateNROC: 0.11,     // Non-owner-occupied
  propTaxRateOOC: 0.04,      // Owner-occupied (lower)
  annualRentalGrowth: 0.02,
  maintenanceMthly: 380,     // Default MCST estimate

  // Appreciation defaults
  bearCAGR: 0.02,
  baseCAGR: 0.04,
  bullCAGR: 0.06,

  // Investor targets
  targetIRR: 0.10,
  minHoldYears: 4,
  maxHoldYears: 6,

  // CPF reference
  cpfRates: {
    '<=35':  { total: 0.37, employee: 0.20, oaRatio: 0.6217 },
    '36-45': { total: 0.37, employee: 0.20, oaRatio: 0.5677 },
    '46-50': { total: 0.37, employee: 0.20, oaRatio: 0.5136 },
    '51-55': { total: 0.37, employee: 0.20, oaRatio: 0.4055 },
    '56-60': { total: 0.325, employee: 0.15, oaRatio: 0.3872 },
    '61-65': { total: 0.22, employee: 0.095, oaRatio: 0.1592 },
    '66-70': { total: 0.165, employee: 0.075, oaRatio: 0.08 },
  },
};


// ────────────────────────────────────────────────────────────
// SECTION 2: CORE FINANCIAL CALCULATIONS
// ────────────────────────────────────────────────────────────

/**
 * Buyer's Stamp Duty — tiered IRAS schedule
 * Brackets: 1% on first $180K, 2% next $180K, 3% next $640K,
 *           4% next $500K, 5% next $1.5M, 6% above $3M
 */
export function calcBSD(price) {
  if (price <= 0) return 0;
  const brackets = [
    { limit: 180000, rate: 0.01 },
    { limit: 180000, rate: 0.02 },
    { limit: 640000, rate: 0.03 },
    { limit: 500000, rate: 0.04 },
    { limit: 1500000, rate: 0.05 },
    { limit: Infinity, rate: 0.06 },
  ];
  let remaining = price;
  let bsd = 0;
  for (const { limit, rate } of brackets) {
    const taxable = Math.min(remaining, limit);
    bsd += taxable * rate;
    remaining -= taxable;
    if (remaining <= 0) break;
  }
  return Math.round(bsd);
}

/**
 * Additional Buyer's Stamp Duty
 * @param {number} price - Purchase price
 * @param {string} residency - 'SC' | 'PR' | 'Foreigner'
 * @param {number} propertyCount - Number of properties already owned (0-based before this purchase)
 */
export function calcABSD(price, residency = 'SC', propertyCount = 0) {
  const rates = DEFAULTS.absd[residency] || DEFAULTS.absd.SC;
  const idx = Math.min(propertyCount, 2); // 0=1st, 1=2nd, 2=3rd+
  return Math.round(price * rates[idx]);
}

/**
 * Monthly mortgage payment (PMT formula)
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (e.g. 0.038)
 * @param {number} years - Loan tenure in years
 * @returns {number} Monthly payment (positive number)
 */
export function calcMonthlyMortgage(principal, annualRate, years = 30) {
  if (principal <= 0) return 0;
  if (annualRate <= 0) return principal / (years * 12);
  const r = annualRate / 12;
  const n = years * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/**
 * TDSR check — Total Debt Servicing Ratio
 * MAS limit: 55% of gross monthly income
 * @returns {{ ratio, passes, headroom, maxAdditionalMortgage }}
 */
export function calcTDSR(grossMonthlyIncome, monthlyMortgage, existingCommitments = 0) {
  const totalDebt = monthlyMortgage + existingCommitments;
  const ratio = grossMonthlyIncome > 0 ? totalDebt / grossMonthlyIncome : 1;
  const limit = 0.55;
  return {
    ratio,
    ratioPercent: (ratio * 100).toFixed(1),
    passes: ratio <= limit,
    headroom: Math.max(0, grossMonthlyIncome * limit - totalDebt),
    maxAdditionalMortgage: Math.max(0, grossMonthlyIncome * limit - existingCommitments),
  };
}

/**
 * Seller's Stamp Duty (SSD) — IRAS schedule
 * Applies only when holding period is less than 3 years
 * 12% if sold within 1 year, 8% within 2 years, 4% within 3 years
 * @param {number} price - Sale price
 * @param {number} holdMonths - Hold period in months
 * @returns {number} SSD amount
 */
export function calcSSD(price, holdMonths) {
  if (price <= 0 || holdMonths >= 36) return 0; // No SSD after 3 years
  let rate = 0;
  if (holdMonths < 12) rate = 0.12;      // First year: 12%
  else if (holdMonths < 24) rate = 0.08; // Second year: 8%
  else if (holdMonths < 36) rate = 0.04; // Third year: 4%
  return Math.round(price * rate);
}

/**
 * CPF Accrued Interest Refund
 * CPF balances used for downpayment earn 2.5% p.a. compound interest
 * Must be refunded to CPF upon sale
 * @param {number} cpfUsed - Total CPF OA used for purchase/mortgage
 * @param {number} holdYears - Holding period in years
 * @returns {number} Accrued interest owed to CPF
 */
export function calcCPFAccruedInterest(cpfUsed, holdYears) {
  if (cpfUsed <= 0 || holdYears <= 0) return 0;
  const cpfRate = 0.025; // 2.5% p.a.
  const accrued = cpfUsed * (Math.pow(1 + cpfRate, holdYears) - 1);
  return Math.round(accrued);
}

/**
 * MSR check — Mortgage Service Ratio for HDB/EC purchases
 * MAS limit: 30% of gross monthly income
 * @param {number} grossMonthlyIncome
 * @param {number} monthlyMortgage
 * @returns {{ ratio, passes, headroom, maxMortgage }}
 */
export function calcMSR(grossMonthlyIncome, monthlyMortgage) {
  const ratio = grossMonthlyIncome > 0 ? monthlyMortgage / grossMonthlyIncome : 1;
  const limit = 0.30;
  return {
    ratio,
    ratioPercent: (ratio * 100).toFixed(1),
    passes: ratio <= limit,
    headroom: Math.max(0, grossMonthlyIncome * limit - monthlyMortgage),
    maxMortgage: Math.max(0, grossMonthlyIncome * limit),
  };
}

/**
 * Max affordable purchase price estimate
 * Uses stress test rate for TDSR calculation
 */
export function calcMaxAffordablePrice(grossIncome, existingCommitments = 0, opts = {}) {
  const stressRate = opts.stressTestRate || DEFAULTS.stressTestRate;
  const tenure = opts.loanTenure || DEFAULTS.loanTenure;
  const ltv = opts.ltv || DEFAULTS.ltv1st;

  const maxMortgagePayment = grossIncome * 0.55 - existingCommitments;
  if (maxMortgagePayment <= 0) return 0;

  // Reverse PMT: principal = payment * [(1+r)^n - 1] / [r * (1+r)^n]
  const r = stressRate / 12;
  const n = tenure * 12;
  const maxLoan = maxMortgagePayment * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
  const maxPrice = maxLoan / ltv;

  return Math.round(maxPrice / 10000) * 10000; // Round to nearest $10K
}

/**
 * CPF OA monthly contribution for mortgage
 */
export function calcCPFOA(grossIncome, ageBracket = '<=35') {
  const rates = DEFAULTS.cpfRates[ageBracket] || DEFAULTS.cpfRates['<=35'];
  // CPF OA = gross × total CPF rate × OA allocation ratio
  return grossIncome * rates.total * rates.oaRatio;
}

/**
 * Net take-home pay after employee CPF
 */
export function calcNetTakeHome(grossIncome, ageBracket = '<=35') {
  const rates = DEFAULTS.cpfRates[ageBracket] || DEFAULTS.cpfRates['<=35'];
  return grossIncome * (1 - rates.employee);
}


// ────────────────────────────────────────────────────────────
// SECTION 3: PROPERTY ACQUISITION MODEL
// ────────────────────────────────────────────────────────────

/**
 * Full acquisition cost breakdown
 * @param {object} params
 * @returns {object} Complete cost breakdown
 */
export function calcAcquisition({
  purchasePrice,
  residency = 'SC',
  propertyCount = 0,
  legalFees = DEFAULTS.legalFees,
  renoFurnishing = 0,
  ltv = DEFAULTS.ltv1st,
}) {
  const bsd = calcBSD(purchasePrice);
  const absd = calcABSD(purchasePrice, residency, propertyCount);
  const downpayment = purchasePrice * (1 - ltv);
  const otpPayment = purchasePrice * 0.05; // 5% OTP
  const loanAmount = purchasePrice * ltv;

  const totalUpfront = downpayment + bsd + absd + legalFees + renoFurnishing;
  const totalCost = purchasePrice + bsd + absd + legalFees + renoFurnishing;

  return {
    purchasePrice,
    bsd,
    absd,
    legalFees,
    renoFurnishing,
    downpayment,
    otpPayment,
    loanAmount,
    totalUpfront,
    totalCost,
    ltv,
  };
}


// ────────────────────────────────────────────────────────────
// SECTION 4: MONTHLY CASHFLOW MODEL
// ────────────────────────────────────────────────────────────

/**
 * Monthly cashflow calculation — owner-occupied scenario
 */
export function calcMonthlyCashflowOwnerOcc({
  loanAmount,
  mortgageRate = DEFAULTS.mortgageRate,
  loanTenure = DEFAULTS.loanTenure,
  grossIncomeA,
  grossIncomeB = 0,
  ageBracketA = '<=35',
  ageBracketB = '<=35',
  additionalIncome = 0,
  monthlyExpenses = 5000,
  maintenance = DEFAULTS.maintenanceMthly,
  propertyTax = 350,
  utilities = 350,
  existingCommitments = 0,
}) {
  const mortgage = calcMonthlyMortgage(loanAmount, mortgageRate, loanTenure);
  const cpfOA_A = calcCPFOA(grossIncomeA, ageBracketA);
  const cpfOA_B = grossIncomeB > 0 ? calcCPFOA(grossIncomeB, ageBracketB) : 0;
  const totalCPFOA = cpfOA_A + cpfOA_B;

  const netTakeHomeA = calcNetTakeHome(grossIncomeA, ageBracketA);
  const netTakeHomeB = grossIncomeB > 0 ? calcNetTakeHome(grossIncomeB, ageBracketB) : 0;
  const totalNetIncome = netTakeHomeA + netTakeHomeB + additionalIncome;
  const totalGrossIncome = grossIncomeA + grossIncomeB;

  const mortgageCash = Math.max(0, mortgage - totalCPFOA);
  const totalPropertyCosts = maintenance + propertyTax + utilities;
  const monthlyOutflow = mortgageCash + monthlyExpenses + totalPropertyCosts + existingCommitments;
  const monthlySurplus = totalNetIncome - monthlyOutflow;

  const tdsr = calcTDSR(totalGrossIncome, mortgage, existingCommitments);

  // Stress test: 2-year buffer if primary buyer loses income
  const monthlyWithoutA = (netTakeHomeB + additionalIncome) - (mortgageCash + monthlyExpenses + totalPropertyCosts);
  const twoYearBuffer = monthlyWithoutA < 0 ? Math.abs(monthlyWithoutA) * 24 : 0;

  return {
    mortgage,
    cpfOA_A,
    cpfOA_B,
    totalCPFOA,
    mortgageCash,
    mortgageCashPercent: totalGrossIncome > 0 ? mortgageCash / totalGrossIncome : 0,
    totalNetIncome,
    totalGrossIncome,
    monthlyExpenses,
    totalPropertyCosts,
    monthlyOutflow,
    monthlySurplus,
    existingCommitments,
    tdsr,
    twoYearBuffer,
    breakEvenIncome: mortgageCash + monthlyExpenses + totalPropertyCosts + existingCommitments,
  };
}

/**
 * Monthly cashflow calculation — investment (rental) scenario
 */
export function calcMonthlyCashflowInvestment({
  loanAmount,
  mortgageRate = DEFAULTS.investmentRate,
  loanTenure = DEFAULTS.loanTenure,
  monthlyRent,
  occupancyRate = DEFAULTS.occupancyRate,
  maintenance = DEFAULTS.maintenanceMthly,
  isOwnerOccupied = false,
}) {
  const mortgage = calcMonthlyMortgage(loanAmount, mortgageRate, loanTenure);
  const adjRent = monthlyRent * occupancyRate;

  // Property tax: AV = rent * 12 * 85%, tax = AV * rate
  const annualRent = monthlyRent * 12;
  const av = annualRent * DEFAULTS.avPctOfRent;
  const taxRate = isOwnerOccupied ? DEFAULTS.propTaxRateOOC : DEFAULTS.propTaxRateNROC;
  const monthlyPropTax = (av * taxRate) / 12;

  const netMonthlyCarry = adjRent - mortgage - maintenance - monthlyPropTax;
  const annualCarry = netMonthlyCarry * 12;

  // Break-even rent: rent needed for zero carry
  // rent * occupancy - mortgage - maintenance - (rent * 12 * avPct * taxRate / 12) = 0
  // rent * (occupancy - avPct * taxRate) = mortgage + maintenance
  const effectiveRentFactor = occupancyRate - (DEFAULTS.avPctOfRent * taxRate);
  const breakEvenRent = effectiveRentFactor > 0 ? (mortgage + maintenance) / effectiveRentFactor : Infinity;

  return {
    mortgage,
    grossRent: monthlyRent,
    adjRent,
    maintenance,
    monthlyPropTax,
    netMonthlyCarry,
    annualCarry,
    breakEvenRent: Math.round(breakEvenRent),
    isPositiveCarry: netMonthlyCarry >= 0,
  };
}


// ────────────────────────────────────────────────────────────
// SECTION 5: INVESTMENT RETURN MODEL (IRR / EXIT)
// ────────────────────────────────────────────────────────────

/**
 * Gross rental yield
 */
export function calcGrossYield(purchasePrice, monthlyRent) {
  if (purchasePrice <= 0 || monthlyRent <= 0) return 0;
  return (monthlyRent * 12) / purchasePrice;
}

/**
 * Exit price at a given CAGR over N years
 */
export function calcExitPrice(purchasePrice, cagr, years) {
  return purchasePrice * Math.pow(1 + cagr, years);
}

/**
 * Remaining loan balance after N years of payments
 */
export function calcRemainingLoan(principal, annualRate, tenureYears, yearsElapsed) {
  if (principal <= 0) return 0;
  if (annualRate <= 0) return principal * (1 - yearsElapsed / tenureYears);
  const r = annualRate / 12;
  const n = tenureYears * 12;
  const p = yearsElapsed * 12; // payments made
  const balance = principal * (Math.pow(1 + r, n) - Math.pow(1 + r, p)) / (Math.pow(1 + r, n) - 1);
  return Math.max(0, balance);
}

/**
 * Exit equity after sale
 * Exit Price - Remaining Loan - Agent Commission - SSD (if applicable) - CPF Refund
 */
export function calcExitEquity({
  exitPrice,
  remainingLoan,
  agentComm = DEFAULTS.agentCommSell,
  holdMonths = null,  // If provided, calculates SSD automatically
  cpfRefund = 0,      // CPF accrued interest owed to CPF
  ssdRate = null,     // Deprecated — use holdMonths instead
}) {
  const commission = exitPrice * agentComm;
  // Calculate SSD: either from holdMonths or from explicit ssdRate (for backward compat)
  const ssd = holdMonths !== null ? calcSSD(exitPrice, holdMonths) :
              ssdRate !== null ? (exitPrice * ssdRate) : 0;
  return exitPrice - remainingLoan - commission - ssd - cpfRefund;
}

/**
 * Equity IRR calculation
 * Cash flows: -upfrontCash at t=0, -annualCarry each year, +exitEquity at t=exitYear
 * Uses Newton's method to solve for IRR
 */
export function calcEquityIRR({
  upfrontCash,         // Total cash invested at purchase (positive number)
  annualCarry,         // Net annual cashflow from rental (negative = top-up)
  exitEquity,          // Net equity received at exit (after loan, commission)
  holdingYears,
  rentalGrowth = DEFAULTS.annualRentalGrowth,
}) {
  // Build cashflow array
  const cashflows = [-upfrontCash];
  for (let yr = 1; yr <= holdingYears; yr++) {
    // Carry grows with rental growth each year
    const yearCarry = annualCarry * Math.pow(1 + rentalGrowth, yr - 1);
    cashflows.push(yearCarry);
  }
  // Add exit equity to final year
  cashflows[cashflows.length - 1] += exitEquity;

  return solveIRR(cashflows);
}

/**
 * Newton's method IRR solver
 */
function solveIRR(cashflows, guess = 0.08, maxIter = 100, tol = 1e-7) {
  let rate = guess;
  for (let i = 0; i < maxIter; i++) {
    let npv = 0;
    let dnpv = 0;
    for (let t = 0; t < cashflows.length; t++) {
      const pv = cashflows[t] / Math.pow(1 + rate, t);
      npv += pv;
      if (t > 0) {
        dnpv -= t * cashflows[t] / Math.pow(1 + rate, t + 1);
      }
    }
    if (Math.abs(dnpv) < 1e-12) break;
    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < tol) return newRate;
    rate = newRate;
  }
  return rate;
}

/**
 * Full investment analysis for a single project
 * Combines acquisition, cashflow, and exit models
 */
export function analyzeInvestment({
  purchasePrice,
  monthlyRent = 0,  // Support both rent and monthlyRent field names
  rent = 0,
  residency = 'SC',
  propertyCount = 0,
  mortgageRate = DEFAULTS.investmentRate,
  loanTenure = DEFAULTS.loanTenure,
  ltv = DEFAULTS.ltv1st,
  maintenance = DEFAULTS.maintenanceMthly,
  renoFurnishing = 0,
  bearCAGR = DEFAULTS.bearCAGR,
  baseCAGR = DEFAULTS.baseCAGR,
  bullCAGR = DEFAULTS.bullCAGR,
  holdingYears = 5,
  cpfUsed = 0,  // CPF OA used for downpayment
}) {
  const actualRent = monthlyRent || rent; // Support both field names

  const acq = calcAcquisition({
    purchasePrice,
    residency,
    propertyCount,
    renoFurnishing,
    ltv,
  });

  const cashflow = calcMonthlyCashflowInvestment({
    loanAmount: acq.loanAmount,
    mortgageRate,
    loanTenure,
    monthlyRent: actualRent,
    maintenance,
  });

  const grossYield = calcGrossYield(purchasePrice, actualRent);
  const remainingLoan = calcRemainingLoan(acq.loanAmount, mortgageRate, loanTenure, holdingYears);
  const cpfRefund = calcCPFAccruedInterest(cpfUsed, holdingYears);
  const holdMonths = Math.round(holdingYears * 12);

  // Three exit scenarios
  const scenarios = {};
  for (const [label, cagr] of [['bear', bearCAGR], ['base', baseCAGR], ['bull', bullCAGR]]) {
    const exitPrice = calcExitPrice(purchasePrice, cagr, holdingYears);
    const exitEquity = calcExitEquity({
      exitPrice,
      remainingLoan,
      holdMonths,
      cpfRefund,
    });

    let irr = null;
    try {
      irr = calcEquityIRR({
        upfrontCash: acq.totalUpfront,
        annualCarry: cashflow.annualCarry,
        exitEquity,
        holdingYears,
      });
    } catch { irr = null; }

    scenarios[label] = {
      cagr,
      exitPrice: Math.round(exitPrice),
      exitEquity: Math.round(exitEquity),
      irr,
      irrPercent: irr !== null ? (irr * 100).toFixed(1) : 'N/A',
    };
  }

  return {
    acquisition: acq,
    cashflow,
    grossYield,
    grossYieldPercent: (grossYield * 100).toFixed(1),
    remainingLoan: Math.round(remainingLoan),
    cpfRefund,
    holdingYears,
    scenarios,
  };
}


// ────────────────────────────────────────────────────────────
// SECTION 6: SCENARIO COMPARISON ENGINE (Phase 4)
// ────────────────────────────────────────────────────────────

/**
 * Client profile shape — expected input from intake form
 */
/*
  clientProfile = {
    name, residency, age, ageBracket,
    grossIncomeA, grossIncomeB, additionalIncome,
    ageBracketA, ageBracketB,
    existingCommitments,
    cpfOA_A, cpfOA_B, cashSavings, otherLiquid, giftSupport,
    currentProperty: {
      owns: true/false, type, district, marketValue,
      outstandingMortgage, monthlyMortgage, originalPrice, yearPurchased,
      tenure, remainingLease, mopFulfilled
    },
    goals: {
      primaryGoal, riskTolerance, holdingHorizon, purpose,
      preferredDistricts, typePreference, sizeRequirement,
      budgetCeiling, carryTolerance, targetIRR,
    }
  }
*/

/**
 * Scenario A: Status Quo — do nothing, stay in current property
 */
export function scenarioStatusQuo(profile, years = 5) {
  const cp = profile.currentProperty;
  if (!cp || !cp.owns) return null;

  const currentEquity = cp.marketValue - cp.outstandingMortgage;
  const remainingLoan = calcRemainingLoan(
    cp.outstandingMortgage, DEFAULTS.mortgageRate, DEFAULTS.loanTenure,
    years
  );

  // Conservative appreciation for existing property
  const cagr = cp.type?.includes('HDB') ? 0.02 : 0.03;
  const futureValue = calcExitPrice(cp.marketValue, cagr, years);
  const futureEquity = futureValue - remainingLoan;
  const equityGain = futureEquity - currentEquity;

  // Opportunity cost: what if they deployed current equity at target IRR
  const opportunityCostGain = currentEquity * (Math.pow(1 + (profile.goals?.targetIRR || 0.06), years) - 1);

  return {
    scenarioName: 'Status Quo',
    description: `Stay in current ${cp.type} at ${cp.district}. No transaction costs, no disruption.`,
    upfrontCash: 0,
    monthlyMortgage: cp.monthlyMortgage || 0,
    monthlyCarry: 0, // No change from current
    currentEquity,
    futureValue: Math.round(futureValue),
    futureEquity: Math.round(futureEquity),
    equityGain: Math.round(equityGain),
    cagr,
    opportunityCostGain: Math.round(opportunityCostGain),
    netAdvantage: Math.round(equityGain - opportunityCostGain),
    risks: ['Property appreciation may underperform', 'Opportunity cost of locked equity', 'No diversification'],
    advantages: ['No transaction costs', 'No disruption', 'Familiar environment', 'No ABSD/BSD exposure'],
  };
}

/**
 * Scenario B: Sell current → Buy 1 (Upgrade)
 * Covers: HDB → Condo, HDB → bigger HDB, Condo → bigger Condo
 */
export function scenarioSellBuy1(profile, targetProperty, opts = {}) {
  const cp = profile.currentProperty;
  const isUpgrade = true;

  // Step 1: Sale proceeds from current property
  const saleProceeds = cp.owns
    ? cp.marketValue - cp.outstandingMortgage - (cp.marketValue * DEFAULTS.agentCommSell)
    : 0;

  // Step 2: Total available funds
  const totalFunds = (profile.cpfOA_A || 0) + (profile.cpfOA_B || 0) +
    (profile.cashSavings || 0) + (profile.otherLiquid || 0) +
    (profile.giftSupport || 0) + saleProceeds;

  // Step 3: Acquisition cost for target
  // After selling, property count drops by 1 for ABSD purposes
  const effectivePropertyCount = Math.max(0, (cp.owns ? 1 : 0) - 1 + (opts.keepCurrent ? 1 : 0));
  const targetLTV = effectivePropertyCount === 0 ? DEFAULTS.ltv1st : DEFAULTS.ltv2nd;

  const acq = calcAcquisition({
    purchasePrice: targetProperty.purchasePrice,
    residency: profile.residency,
    propertyCount: effectivePropertyCount,
    ltv: targetLTV,
    renoFurnishing: opts.renoFurnishing || 0,
  });

  // Step 4: Surplus / shortfall
  const surplus = totalFunds - acq.totalUpfront;

  // Step 5: Monthly cashflow in new property
  const cashflowResult = calcMonthlyCashflowOwnerOcc({
    loanAmount: acq.loanAmount,
    mortgageRate: opts.mortgageRate || DEFAULTS.mortgageRate,
    loanTenure: opts.loanTenure || DEFAULTS.loanTenure,
    grossIncomeA: profile.grossIncomeA,
    grossIncomeB: profile.grossIncomeB || 0,
    ageBracketA: profile.ageBracketA || '<=35',
    ageBracketB: profile.ageBracketB || '<=35',
    additionalIncome: profile.additionalIncome || 0,
    monthlyExpenses: opts.monthlyExpenses || 5000,
    maintenance: opts.maintenance || DEFAULTS.maintenanceMthly,
    propertyTax: opts.propertyTax || 350,
    utilities: opts.utilities || 350,
    existingCommitments: profile.existingCommitments || 0,
  });

  // Step 6: Exit equity at target holding period
  const holdYears = opts.holdingYears || 5;
  const exitCagr = opts.baseCAGR || DEFAULTS.baseCAGR;
  const exitPrice = calcExitPrice(targetProperty.purchasePrice, exitCagr, holdYears);
  const remLoan = calcRemainingLoan(acq.loanAmount, opts.mortgageRate || DEFAULTS.mortgageRate, opts.loanTenure || DEFAULTS.loanTenure, holdYears);
  const exitEquity = calcExitEquity({ exitPrice, remainingLoan: remLoan });

  return {
    scenarioName: cp.owns ? `Sell ${cp.type} → Buy ${targetProperty.type || 'New Property'}` : 'Purchase New Property',
    description: `Sell current property, purchase ${targetProperty.name || 'target'} at $${(targetProperty.purchasePrice/1e6).toFixed(2)}M`,
    saleProceeds: Math.round(saleProceeds),
    totalFundsAvailable: Math.round(totalFunds),
    acquisition: acq,
    surplus: Math.round(surplus),
    isFundsSufficient: surplus >= 0,
    cashflow: cashflowResult,
    exit: {
      holdYears,
      cagr: exitCagr,
      exitPrice: Math.round(exitPrice),
      remainingLoan: Math.round(remLoan),
      exitEquity: Math.round(exitEquity),
    },
    risks: [
      surplus < 0 ? `Funding shortfall of $${Math.abs(Math.round(surplus)).toLocaleString()}` : null,
      !cashflowResult.tdsr.passes ? `TDSR breach at ${cashflowResult.tdsr.ratioPercent}%` : null,
      cashflowResult.monthlySurplus < 0 ? `Negative monthly cashflow: -$${Math.abs(Math.round(cashflowResult.monthlySurplus)).toLocaleString()}/mo` : null,
      cashflowResult.twoYearBuffer > totalFunds * 0.3 ? 'Emergency buffer requires significant reserve' : null,
    ].filter(Boolean),
    advantages: [
      surplus > 100000 ? `$${Math.round(surplus/1000)}K surplus after purchase` : null,
      cashflowResult.tdsr.passes ? `TDSR comfortable at ${cashflowResult.tdsr.ratioPercent}%` : null,
      cashflowResult.monthlySurplus > 0 ? `Positive monthly cashflow: +$${Math.round(cashflowResult.monthlySurplus).toLocaleString()}/mo` : null,
      acq.absd === 0 ? 'Zero ABSD — first property advantage' : null,
    ].filter(Boolean),
  };
}

/**
 * Scenario C: Buy 1st Investment Property (no current property sale)
 * For SC first-time buyer — no ABSD
 */
export function scenarioBuyInvestment(profile, targetProperty, opts = {}) {
  const totalFunds = (profile.cpfOA_A || 0) + (profile.cpfOA_B || 0) +
    (profile.cashSavings || 0) + (profile.otherLiquid || 0) +
    (profile.giftSupport || 0);

  const acq = calcAcquisition({
    purchasePrice: targetProperty.purchasePrice,
    residency: profile.residency,
    propertyCount: 0, // First property
    ltv: DEFAULTS.ltv1st,
    renoFurnishing: opts.renoFurnishing || DEFAULTS.renoFurnishing,
  });

  const surplus = totalFunds - acq.totalUpfront;

  const investResult = analyzeInvestment({
    purchasePrice: targetProperty.purchasePrice,
    monthlyRent: targetProperty.monthlyRent || targetProperty.rent || 0,
    residency: profile.residency,
    propertyCount: 0,
    mortgageRate: opts.mortgageRate || DEFAULTS.investmentRate,
    renoFurnishing: opts.renoFurnishing || DEFAULTS.renoFurnishing,
    bearCAGR: targetProperty.bearCAGR || DEFAULTS.bearCAGR,
    baseCAGR: targetProperty.baseCAGR || DEFAULTS.baseCAGR,
    bullCAGR: targetProperty.bullCAGR || DEFAULTS.bullCAGR,
    holdingYears: opts.holdingYears || 5,
    cpfUsed: opts.cpfUsed || 0,
  });

  // TDSR check (need to add investment mortgage to existing commitments)
  const totalGross = profile.grossIncomeA + (profile.grossIncomeB || 0);
  const investMortgage = investResult.cashflow.mortgage;
  const tdsr = calcTDSR(totalGross, investMortgage, profile.existingCommitments || 0);

  return {
    scenarioName: 'Buy Investment Property (1st Property SC)',
    description: `Purchase ${targetProperty.name || 'investment property'} at $${(targetProperty.purchasePrice/1e6).toFixed(2)}M — zero ABSD`,
    totalFundsAvailable: Math.round(totalFunds),
    acquisition: acq,
    surplus: Math.round(surplus),
    isFundsSufficient: surplus >= 0,
    investment: investResult,
    tdsr,
    absdSavings: calcABSD(targetProperty.purchasePrice, profile.residency, 1), // What a 2nd-property buyer would pay
    risks: [
      surplus < 0 ? `Funding shortfall of $${Math.abs(Math.round(surplus)).toLocaleString()}` : null,
      !tdsr.passes ? `TDSR breach at ${tdsr.ratioPercent}%` : null,
      investResult.cashflow.netMonthlyCarry < -2000 ? `Heavy carry: $${Math.abs(Math.round(investResult.cashflow.netMonthlyCarry)).toLocaleString()}/mo top-up` : null,
    ].filter(Boolean),
    advantages: [
      'Zero ABSD as first property Singapore Citizen',
      `ABSD savings vs 2nd-property buyer: $${calcABSD(targetProperty.purchasePrice, profile.residency, 1).toLocaleString()}`,
      investResult.scenarios.base.irr > 0.07 ? `Base IRR of ${investResult.scenarios.base.irrPercent}% meets threshold` : null,
    ].filter(Boolean),
  };
}

/**
 * Scenario D: Sell 1 → Buy 2
 * Sell current property, buy two properties (ABSD on second)
 */
export function scenarioSell1Buy2(profile, property1, property2, opts = {}) {
  const cp = profile.currentProperty;
  const saleProceeds = cp.owns
    ? cp.marketValue - cp.outstandingMortgage - (cp.marketValue * DEFAULTS.agentCommSell)
    : 0;

  const totalFunds = (profile.cpfOA_A || 0) + (profile.cpfOA_B || 0) +
    (profile.cashSavings || 0) + (profile.otherLiquid || 0) +
    (profile.giftSupport || 0) + saleProceeds;

  // Property 1: no ABSD (replacing sold property)
  const acq1 = calcAcquisition({
    purchasePrice: property1.purchasePrice,
    residency: profile.residency,
    propertyCount: 0,
    ltv: DEFAULTS.ltv1st,
  });

  // Property 2: ABSD applies (second property)
  const acq2 = calcAcquisition({
    purchasePrice: property2.purchasePrice,
    residency: profile.residency,
    propertyCount: 1,
    ltv: DEFAULTS.ltv2nd, // Lower LTV for 2nd property with outstanding loan
  });

  const totalUpfront = acq1.totalUpfront + acq2.totalUpfront;
  const surplus = totalFunds - totalUpfront;

  // Combined monthly burden
  const mortgage1 = calcMonthlyMortgage(acq1.loanAmount, opts.mortgageRate || DEFAULTS.mortgageRate);
  const mortgage2 = calcMonthlyMortgage(acq2.loanAmount, opts.mortgageRate || DEFAULTS.mortgageRate);
  const totalGross = profile.grossIncomeA + (profile.grossIncomeB || 0);
  const tdsr = calcTDSR(totalGross, mortgage1 + mortgage2, profile.existingCommitments || 0);

  return {
    scenarioName: 'Sell 1 → Buy 2',
    description: `Sell current property. Buy ${property1.name || 'Property 1'} + ${property2.name || 'Property 2'}`,
    saleProceeds: Math.round(saleProceeds),
    totalFundsAvailable: Math.round(totalFunds),
    property1: { ...acq1, monthlyMortgage: Math.round(mortgage1) },
    property2: { ...acq2, monthlyMortgage: Math.round(mortgage2), absdAmount: acq2.absd },
    totalUpfront: Math.round(totalUpfront),
    surplus: Math.round(surplus),
    isFundsSufficient: surplus >= 0,
    combinedMonthlyMortgage: Math.round(mortgage1 + mortgage2),
    tdsr,
    risks: [
      surplus < 0 ? `Funding shortfall of $${Math.abs(Math.round(surplus)).toLocaleString()}` : null,
      !tdsr.passes ? `TDSR breach at ${tdsr.ratioPercent}% — this scenario likely not viable` : null,
      `ABSD on 2nd property: $${acq2.absd.toLocaleString()}`,
      '2nd property at 45% LTV = 55% downpayment required',
      'Combined monthly mortgage burden is significant',
    ].filter(Boolean),
    advantages: [
      'Portfolio diversification across two properties',
      'Can allocate one for own-stay, one for investment',
      surplus > 0 ? `$${Math.round(surplus/1000)}K surplus after both purchases` : null,
    ].filter(Boolean),
  };
}

/**
 * Scenario E: Sell HDB → Buy another HDB
 */
export function scenarioHDBtoHDB(profile, targetHDB, opts = {}) {
  // HDB purchase: different rules
  // - No ABSD for HDB (only applies to private)
  // - HDB loan at 2.6% / max 80% LTV, OR bank loan at market rate / 75% LTV
  // - Must sell existing HDB first (no concurrent ownership for subsidised)

  const cp = profile.currentProperty;
  const saleProceeds = cp.owns
    ? cp.marketValue - cp.outstandingMortgage - (cp.marketValue * 0.01) // Lower commission for HDB
    : 0;

  // CPF refund: accrued interest on CPF used for current property
  // Simplified estimate — user should verify actual amount with CPF Board
  const cpfRefundEstimate = opts.cpfRefundAmount || 0;

  const totalFunds = (profile.cpfOA_A || 0) + (profile.cpfOA_B || 0) +
    (profile.cashSavings || 0) + (profile.otherLiquid || 0) +
    saleProceeds - cpfRefundEstimate; // CPF refund goes back to OA, reduces deployable cash

  const useHDBLoan = opts.useHDBLoan || false;
  const ltv = useHDBLoan ? 0.80 : 0.75;
  const rate = useHDBLoan ? 0.026 : (opts.mortgageRate || DEFAULTS.mortgageRate);

  const bsd = calcBSD(targetHDB.purchasePrice);
  const downpayment = targetHDB.purchasePrice * (1 - ltv);
  const loanAmount = targetHDB.purchasePrice * ltv;
  const totalUpfront = downpayment + bsd + (opts.legalFees || 3000);
  const surplus = totalFunds - totalUpfront;

  const mortgage = calcMonthlyMortgage(loanAmount, rate, opts.loanTenure || 25);
  const totalGross = profile.grossIncomeA + (profile.grossIncomeB || 0);
  const tdsr = calcTDSR(totalGross, mortgage, profile.existingCommitments || 0);

  return {
    scenarioName: `Sell HDB → Buy ${targetHDB.type || 'HDB'}`,
    description: `Sell current HDB, purchase ${targetHDB.name || 'target HDB'} at $${(targetHDB.purchasePrice/1e6).toFixed(2)}M in ${targetHDB.district || 'target district'}`,
    saleProceeds: Math.round(saleProceeds),
    cpfRefundEstimate,
    totalFundsAvailable: Math.round(totalFunds),
    purchasePrice: targetHDB.purchasePrice,
    bsd,
    absd: 0,  // No ABSD for HDB
    downpayment: Math.round(downpayment),
    loanAmount: Math.round(loanAmount),
    loanType: useHDBLoan ? 'HDB Loan (2.6%)' : `Bank Loan (${(rate*100).toFixed(2)}%)`,
    totalUpfront: Math.round(totalUpfront),
    surplus: Math.round(surplus),
    isFundsSufficient: surplus >= 0,
    monthlyMortgage: Math.round(mortgage),
    tdsr,
    risks: [
      surplus < 0 ? `Funding shortfall of $${Math.abs(Math.round(surplus)).toLocaleString()}` : null,
      !tdsr.passes ? `TDSR breach at ${tdsr.ratioPercent}%` : null,
      'Must sell existing HDB before buying (no concurrent ownership for subsidised)',
      cpfRefundEstimate > 0 ? `CPF refund of $${cpfRefundEstimate.toLocaleString()} reduces deployable funds` : null,
      'Resale HDB lease decay affects long-term value',
    ].filter(Boolean),
    advantages: [
      'Zero ABSD for HDB purchase',
      useHDBLoan ? 'HDB loan at 2.6% with 80% LTV' : null,
      'Lower entry price point than private',
      'Stable demand in mature estates',
      surplus > 50000 ? `$${Math.round(surplus/1000)}K surplus for renovation/buffer` : null,
    ].filter(Boolean),
  };
}

/**
 * Master scenario comparison — runs all applicable scenarios for a client
 * Returns an array of scenario results, sorted by recommendation
 */
export function compareScenarios(profile, targetProperties = {}) {
  const results = [];

  // Always run Status Quo if client owns property
  const statusQuo = scenarioStatusQuo(profile);
  if (statusQuo) results.push(statusQuo);

  // Sell → Buy 1 (upgrade to condo or better HDB)
  if (targetProperties.upgrade) {
    results.push(scenarioSellBuy1(profile, targetProperties.upgrade));
  }

  // Buy 1st Investment
  if (targetProperties.investment) {
    results.push(scenarioBuyInvestment(profile, targetProperties.investment));
  }

  // HDB to HDB
  if (targetProperties.hdb) {
    results.push(scenarioHDBtoHDB(profile, targetProperties.hdb));
  }

  // Sell 1 Buy 2
  if (targetProperties.sell1buy2) {
    const { property1, property2 } = targetProperties.sell1buy2;
    results.push(scenarioSell1Buy2(profile, property1, property2));
  }

  return results;
}


// ────────────────────────────────────────────────────────────
// SECTION 7: SHORTLIST FILTERING ENGINE
// ────────────────────────────────────────────────────────────

/**
 * Filter project database against client profile constraints
 * @param {Array} projects - Array of project objects from database
 * @param {Object} profile - Client profile from intake
 * @returns {Array} Filtered and annotated projects
 */
export function filterProjects(projects, profile) {
  const budget = profile.goals?.budgetCeiling || Infinity;
  const carryTolerance = profile.goals?.carryTolerance || Infinity;
  const preferredDistricts = profile.goals?.preferredDistricts
    ? profile.goals.preferredDistricts.split(',').map(d => d.trim().toUpperCase())
    : [];

  return projects
    .map(p => {
      const midPrice = (p.budgetMin + p.budgetMax) / 2;
      const withinBudget = p.budgetMin <= budget;
      const districtMatch = preferredDistricts.length === 0 ||
        preferredDistricts.some(d => (p.district || '').toUpperCase().includes(d));

      // Calculate client-specific metrics
      const ltv = (profile.currentProperty?.owns && profile.goals?.primaryGoal !== 'Sell HDB → Buy Condo')
        ? DEFAULTS.ltv2nd : DEFAULTS.ltv1st;
      const loanAmount = midPrice * ltv;
      const mortgage = calcMonthlyMortgage(loanAmount, DEFAULTS.investmentRate);
      const actualRent = p.rent || p.monthlyRent || 0;  // Support both field names
      const carry = actualRent > 0
        ? actualRent * DEFAULTS.occupancyRate - mortgage - DEFAULTS.maintenanceMthly -
          (actualRent * DEFAULTS.avPctOfRent * DEFAULTS.propTaxRateNROC)
        : null;
      const withinCarry = carry === null || Math.abs(carry) <= carryTolerance;

      const grossYield = actualRent > 0 ? (actualRent * 12) / midPrice : 0;

      // Eligibility: budget + carry + residency (for EC, no foreigners)
      const isEC = (p.type || '').includes('EC');
      const isForeigner = profile.residency === 'Foreigner';
      const ecNotEligible = isEC && isForeigner; // Foreigners cannot buy EC
      const eligible = withinBudget && withinCarry && !ecNotEligible;

      return {
        ...p,
        _clientMetrics: {
          midPrice,
          loanAmount: Math.round(loanAmount),
          monthlyMortgage: Math.round(mortgage),
          monthlyCarry: carry !== null ? Math.round(carry) : null,
          grossYield,
          grossYieldPercent: (grossYield * 100).toFixed(1),
          withinBudget,
          withinCarry,
          districtMatch,
          ecNotEligible,
          eligible,
        },
      };
    })
    .sort((a, b) => {
      // Sort: eligible first, then by priority tier, then by yield
      const prioOrder = { PRIMARY: 0, SECONDARY: 1, MONITOR: 2, CONDITIONAL: 3, SPECULATIVE: 4 };
      if (a._clientMetrics.eligible !== b._clientMetrics.eligible) {
        return a._clientMetrics.eligible ? -1 : 1;
      }
      const prioDiff = (prioOrder[a.priority] || 5) - (prioOrder[b.priority] || 5);
      if (prioDiff !== 0) return prioDiff;
      return (b._clientMetrics.grossYield || 0) - (a._clientMetrics.grossYield || 0);
    });
}


// ────────────────────────────────────────────────────────────
// SECTION 8: UTILITY / FORMATTING HELPERS
// ────────────────────────────────────────────────────────────

export const fmt = {
  currency: (n) => n != null ? `$${Math.round(n).toLocaleString('en-SG')}` : '-',
  currencyK: (n) => n != null ? `$${Math.round(n/1000)}K` : '-',
  currencyM: (n) => n != null ? `$${(n/1e6).toFixed(2)}M` : '-',
  percent: (n) => n != null ? `${(n * 100).toFixed(1)}%` : '-',
  percentInt: (n) => n != null ? `${Math.round(n * 100)}%` : '-',
  monthlyCarry: (n) => {
    if (n == null) return '-';
    return n >= 0 ? `+$${Math.round(n).toLocaleString()}/mo` : `-$${Math.abs(Math.round(n)).toLocaleString()}/mo`;
  },
};
