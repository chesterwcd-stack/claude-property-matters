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
  mortgageRate: 0.015, stressTestRate: 0.04, investmentRate: 0.038,
  loanTenure: 30, ltv1st: 0.75, ltv2nd: 0.45, ltvHDB: 0.80,
  absd: { SC: [0, 0.20, 0.35], PR: [0.05, 0.30, 0.35], Foreigner: [0.60, 0.60, 0.60] },
  legalFees: 3800, renoFurnishing: 20000, agentCommBuy: 0, agentCommSell: 0.01,
  occupancyRate: 0.90, avPctOfRent: 0.85, propTaxRateNROC: 0.11, propTaxRateOOC: 0.04,
  maintenanceMthly: 380, annualRentalGrowth: 0.02,
  bearCAGR: 0.02, baseCAGR: 0.04, bullCAGR: 0.06,
  targetIRR: 0.10, minHoldYears: 4, maxHoldYears: 6,
  cpfRates: {
    '<=35': { total: 0.37, employee: 0.20, oaRatio: 0.6217 },
    '36-45': { total: 0.37, employee: 0.20, oaRatio: 0.5677 },
    '46-50': { total: 0.37, employee: 0.20, oaRatio: 0.5136 },
    '51-55': { total: 0.37, employee: 0.20, oaRatio: 0.4055 },
    '56-60': { total: 0.325, employee: 0.15, oaRatio: 0.3872 },
    '61-65': { total: 0.22, employee: 0.095, oaRatio: 0.1592 },
    '66-70': { total: 0.165, employee: 0.075, oaRatio: 0.08 },
  },
};

export function calcBSD(price) {
  if (price <= 0) return 0;
  const brackets = [
    { limit: 180000, rate: 0.01 }, { limit: 180000, rate: 0.02 }, { limit: 640000, rate: 0.03 },
    { limit: 500000, rate: 0.04 }, { limit: 1500000, rate: 0.05 }, { limit: Infinity, rate: 0.06 },
  ];
  let remaining = price, bsd = 0;
  for (const { limit, rate } of brackets) {
    const taxable = Math.min(remaining, limit);
    bsd += taxable * rate; remaining -= taxable; if (remaining <= 0) break;
  }
  return Math.round(bsd);
}

export function calcABSD(price, residency = 'SC', propertyCount = 0) {
  const rates = DEFAULTS.absd[residency] || DEFAULTS.absd.SC;
  return Math.round(price * rates[Math.min(propertyCount, 2)]);
}

export function calcMonthlyMortgage(principal, annualRate, years = 30) {
  if (principal <= 0) return 0; if (annualRate <= 0) return principal / (years * 12);
  const r = annualRate / 12, n = years * 12;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function calcTDSR(grossMonthlyIncome, monthlyMortgage, existingCommitments = 0) {
  const totalDebt = monthlyMortgage + existingCommitments;
  const ratio = grossMonthlyIncome > 0 ? totalDebt / grossMonthlyIncome : 1;
  const limit = 0.55;
  return {
    ratio, ratioPercent: (ratio * 100).toFixed(1), passes: ratio <= limit,
    headroom: Math.max(0, grossMonthlyIncome * limit - totalDebt),
    maxAdditionalMortgage: Math.max(0, grossMonthlyIncome * limit - existingCommitments),
  };
}

export function calcSSD(price, holdMonths) {
  if (price <= 0 || holdMonths >= 36) return 0;
  let rate = 0;
  if (holdMonths < 12) rate = 0.12; else if (holdMonths < 24) rate = 0.08; else if (holdMonths < 36) rate = 0.04;
  return Math.round(price * rate);
}

export function calcCPFAccruedInterest(cpfUsed, holdYears) {
  if (cpfUsed <= 0 || holdYears <= 0) return 0;
  const accrued = cpfUsed * (Math.pow(1.025, holdYears) - 1);
  return Math.round(accrued);
}

export function calcMSR(grossMonthlyIncome, monthlyMortgage) {
  const ratio = grossMonthlyIncome > 0 ? monthlyMortgage / grossMonthlyIncome : 1;
  const limit = 0.30;
  return {
    ratio, ratioPercent: (ratio * 100).toFixed(1), passes: ratio <= limit,
    headroom: Math.max(0, grossMonthlyIncome * limit - monthlyMortgage),
    maxMortgage: Math.max(0, grossMonthlyIncome * limit),
  };
}

export function calcMaxAffordablePrice(grossIncome, existingCommitments = 0, opts = {}) {
  const stressRate = opts.stressTestRate || DEFAULTS.stressTestRate;
  const tenure = opts.loanTenure || DEFAULTS.loanTenure;
  const ltv = opts.ltv || DEFAULTS.ltv1st;
  const maxMortgagePayment = grossIncome * 0.55 - existingCommitments;
  if (maxMortgagePayment <= 0) return 0;
  const r = stressRate / 12, n = tenure * 12;
  const maxLoan = maxMortgagePayment * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
  return Math.round(maxLoan / ltv / 10000) * 10000;
}

export function calcCPFOA(grossIncome, ageBracket = '<=35') {
  const rates = DEFAULTS.cpfRates[ageBracket] || DEFAULTS.cpfRates['<=35'];
  return grossIncome * rates.total * rates.oaRatio;
}

export function calcNetTakeHome(grossIncome, ageBracket = '<=35') {
  const rates = DEFAULTS.cpfRates[ageBracket] || DEFAULTS.cpfRates['<=35'];
  return grossIncome * (1 - rates.employee);
}

export function calcRemainingLoan(principal, annualRate, tenureYears, yearsElapsed) {
  if (principal <= 0) return 0;
  if (annualRate <= 0) return principal * (1 - yearsElapsed / tenureYears);
  const r = annualRate / 12, n = tenureYears * 12, p = yearsElapsed * 12;
  return Math.max(0, principal * (Math.pow(1 + r, n) - Math.pow(1 + r, p)) / (Math.pow(1 + r, n) - 1));
}

export function calcExitEquity({
  exitPrice, remainingLoan, agentComm = DEFAULTS.agentCommSell,
  holdMonths = null, cpfRefund = 0, ssdRate = null,
}) {
  const commission = exitPrice * agentComm;
  const ssd = holdMonths !== null ? calcSSD(exitPrice, holdMonths) : (ssdRate !== null ? (exitPrice * ssdRate) : 0);
  return exitPrice - remainingLoan - commission - ssd - cpfRefund;
}

export function calcGrossYield(purchasePrice, monthlyRent) {
  if (purchasePrice <= 0 || monthlyRent <= 0) return 0;
  return (monthlyRent * 12) / purchasePrice;
}

export function calcExitPrice(purchasePrice, cagr, years) {
  return purchasePrice * Math.pow(1 + cagr, years);
}

export function solveIRR(cashflows, guess = 0.08) {
  let rate = guess;
  for (let i = 0; i < 100; i++) {
    let npv = 0, d = 0;
    for (let t = 0; t < cashflows.length; t++) {
      npv += cashflows[t] / Math.pow(1 + rate, t);
      if (t > 0) d -= t * cashflows[t] / Math.pow(1 + rate, t + 1);
    }
    if (Math.abs(d) < 1e-12) break;
    const nr = rate - npv / d;
    if (Math.abs(nr - rate) < 1e-7) return nr;
    rate = nr;
  }
  return rate;
}

export function calcEquityIRR({ upfrontCash, annualCarry, exitEquity, holdingYears, rentalGrowth = DEFAULTS.annualRentalGrowth }) {
  const cashflows = [-upfrontCash];
  for (let yr = 1; yr <= holdingYears; yr++) {
    const yearCarry = annualCarry * Math.pow(1 + rentalGrowth, yr - 1);
    cashflows.push(yearCarry);
  }
  cashflows[cashflows.length - 1] += exitEquity;
  return solveIRR(cashflows);
}

// ────────────────────────────────────────────────────────────
// SECTION 9: EXIT POTENTIAL ANALYSIS ENGINE (Phase 3)
// ────────────────────────────────────────────────────────────

export function calcCPFTotalRefund(cpfPrincipalUsed, holdYears) {
  if (cpfPrincipalUsed <= 0 || holdYears <= 0) return { principal: 0, accruedInterest: 0, totalRefund: 0 };
  const cpfRate = 0.025;
  const accruedInterest = Math.round(cpfPrincipalUsed * (Math.pow(1 + cpfRate, holdYears) - 1));
  return {
    principal: cpfPrincipalUsed,
    accruedInterest,
    totalRefund: cpfPrincipalUsed + accruedInterest,
  };
}

export function calcNetProceeds({
  salePrice, outstandingLoan, holdMonths, cpfPrincipalUsed = 0, holdYears = null,
  agentCommRate = DEFAULTS.agentCommSell, legalFeesSale = 2500,
}) {
  const effectiveHoldYears = holdYears ?? holdMonths / 12;
  const agentComm = Math.round(salePrice * agentCommRate);
  const ssd = calcSSD(salePrice, holdMonths);
  const cpfRefund = calcCPFTotalRefund(cpfPrincipalUsed, effectiveHoldYears);
  const grossProceeds = salePrice - agentComm - ssd - legalFeesSale;
  const afterLoan = grossProceeds - outstandingLoan;
  const netCashToSeller = afterLoan - cpfRefund.totalRefund;

  return {
    salePrice, agentComm, ssd, legalFeesSale, grossProceeds, outstandingLoan, afterLoan,
    cpfRefund, netCashToSeller, ssdActive: ssd > 0,
    ssdRateApplied: holdMonths < 12 ? 0.12 : holdMonths < 24 ? 0.08 : holdMonths < 36 ? 0.04 : 0,
  };
}

export function calcHoldPeriodSweep({
  purchasePrice, upfrontCash, loanAmount, mortgageRate, loanTenure,
  monthlyCarry, cagr, cpfPrincipalUsed = 0,
  agentCommRate = DEFAULTS.agentCommSell, rentalGrowth = DEFAULTS.annualRentalGrowth,
  minMonths = 12, maxMonths = 84, stepMonths = 6,
}) {
  const results = [];
  for (let m = minMonths; m <= maxMonths; m += stepMonths) {
    const yrs = m / 12;
    const exitPrice = calcExitPrice(purchasePrice, cagr, yrs);
    const remLoan = calcRemainingLoan(loanAmount, mortgageRate, loanTenure, yrs);
    const proceeds = calcNetProceeds({
      salePrice: exitPrice, outstandingLoan: remLoan, holdMonths: m,
      cpfPrincipalUsed, holdYears: yrs, agentCommRate,
    });

    const cashflows = [-upfrontCash];
    for (let yr = 1; yr <= Math.floor(yrs); yr++) {
      cashflows.push(monthlyCarry * 12 * Math.pow(1 + rentalGrowth, yr - 1));
    }
    const partialYear = yrs - Math.floor(yrs);
    if (partialYear > 0) {
      cashflows.push(monthlyCarry * 12 * partialYear);
    }
    cashflows[cashflows.length - 1] += proceeds.netCashToSeller;

    let irr = null;
    try { irr = solveIRR(cashflows); } catch {}

    results.push({
      holdMonths: m, holdYears: yrs, exitPrice: Math.round(exitPrice),
      ssd: proceeds.ssd, netCashToSeller: Math.round(proceeds.netCashToSeller),
      cpfRefundTotal: proceeds.cpfRefund.totalRefund,
      irr, irrPercent: irr !== null ? (irr * 100).toFixed(1) : null, ssdActive: proceeds.ssdActive,
    });
  }
  return results;
}

export function calcRequiredExitPrice({
  upfrontCash, loanAmount, mortgageRate, loanTenure,
  monthlyCarry, holdYears, cpfPrincipalUsed = 0,
  purchasePrice, targetIRR = 0.10,
  agentCommRate = DEFAULTS.agentCommSell, rentalGrowth = DEFAULTS.annualRentalGrowth,
}) {
  const holdMonths = Math.round(holdYears * 12);

  function computeIRRatPrice(exitPrice) {
    const remLoan = calcRemainingLoan(loanAmount, mortgageRate, loanTenure, holdYears);
    const proceeds = calcNetProceeds({
      salePrice: exitPrice, outstandingLoan: remLoan, holdMonths, cpfPrincipalUsed, holdYears, agentCommRate,
    });
    const cashflows = [-upfrontCash];
    for (let yr = 1; yr <= holdYears; yr++) {
      cashflows.push(monthlyCarry * 12 * Math.pow(1 + rentalGrowth, yr - 1));
    }
    cashflows[cashflows.length - 1] += proceeds.netCashToSeller;
    try { return solveIRR(cashflows); } catch { return -1; }
  }

  let lo = purchasePrice * 0.5, hi = purchasePrice * 3.0;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const irr = computeIRRatPrice(mid);
    if (Math.abs(irr - targetIRR) < 1e-5) { lo = hi = mid; break; }
    if (irr < targetIRR) lo = mid; else hi = mid;
  }
  const requiredExitPrice = Math.round((lo + hi) / 2);
  const impliedCAGR = Math.pow(requiredExitPrice / purchasePrice, 1 / holdYears) - 1;

  return {
    requiredExitPrice, impliedCAGR, impliedCAGRPercent: (impliedCAGR * 100).toFixed(2), targetIRR,
  };
}

// Helpers for exit potential scoring

export function parseMRTDistance(mrtText = '') {
  if (!mrtText) return 1000;
  const text = mrtText.toLowerCase();
  if (text.includes('1 min') || text.includes('sheltered')) return 80;
  if (text.includes('2 min') || text.includes('walk')) return 150;
  if (text.includes('5 min')) return 350;
  if (text.includes('10 min')) return 700;
  if (text.includes('direct') || text.includes('dtl') || text.includes('nel') || text.includes('ewl')) return 150;
  return 700;
}

export function getRegionType(district = '') {
  const d = parseInt(district.replace('D', ''));
  if ([9, 10, 11].includes(d)) return 'CCR';
  if ([1, 2, 3, 4, 7, 8, 12, 13, 14, 15].includes(d)) return 'RCR';
  if ([5, 6, 16, 17].includes(d)) return 'OCR-fringe';
  return 'OCR-deep';
}

export function deriveProjectMetrics(p = {}) {
  const ageMatch = (p.age || '').match(/(\d+)yr/);
  const ageYears = ageMatch ? parseInt(ageMatch[1]) : 5;
  const isFH = (p.tenure || '').toUpperCase().includes('FH');
  const tenureMatch = (p.tenure || '').match(/(\d+)/);
  const tenureYears = isFH ? 999 : (tenureMatch ? parseInt(tenureMatch[1]) : 99);
  const remainingLease = tenureYears === 999 ? 999 : tenureYears - ageYears;
  const mrtDistanceM = parseMRTDistance(p.mrt);
  const mrtBand = mrtDistanceM < 100 ? 5 : mrtDistanceM < 350 ? 4 : mrtDistanceM < 500 ? 3 : mrtDistanceM < 1000 ? 2 : 1;
  const regionType = getRegionType(p.district);
  const density = p.unitCount && p.landSizeHa ? p.unitCount / p.landSizeHa : null;
  const leaseDecayScore = remainingLease >= 80 ? 5 : remainingLease >= 70 ? 4 : remainingLease >= 60 ? 3 : remainingLease >= 50 ? 2 : 1;

  return { ageYears, tenureYears, remainingLease, mrtDistanceM, mrtBand, regionType, density, leaseDecayScore };
}

export function computeBadges(p = {}, derived = {}) {
  return {
    under1kmMRT: derived.mrtBand >= 2,
    under10yrOld: derived.ageYears < 10,
    nearMillionHDB: p.nearMillionHDB === true,
    fiftyPlusDeals: (p.annualTransactions || 0) >= 50,
    top20School: p.schoolTier === 1,
    hdbMopOver1k: p.hdbTownMopOver1k === true,
  };
}

export function computeMoatScores(p = {}, derived = {}) {
  const scores = {
    quantumAccessibility: (p.budgetMin && p.budgetMin < 1500000) ? 4 : 3,
    leaseDecayRisk: derived.leaseDecayScore || 3,
    mrtProximity: derived.mrtBand || 3,
    schoolTierPremium: p.schoolTier ? (6 - p.schoolTier) : 2,
    districtIncomeT: p.districtIncomeTier || 3,
    regionClass: derived.regionType === 'CCR' ? 5 : derived.regionType === 'RCR' ? 4 : derived.regionType === 'OCR-fringe' ? 3 : 2,
    siteDensity: derived.density ? (derived.density < 60 ? 5 : derived.density < 120 ? 4 : derived.density < 200 ? 3 : 2) : 3,
    exitAudience: p.exitAudienceRating || 3,
    rentalDemand: p.rentalDemandRating || 3,
    volumeEffect: (p.annualTransactions || 0) > 120 ? 5 : (p.annualTransactions || 0) >= 60 ? 4 : (p.annualTransactions || 0) >= 30 ? 3 : (p.annualTransactions || 0) >= 10 ? 2 : 1,
  };
  const composite = Object.values(scores).reduce((a, b) => a + b, 0);
  return { ...scores, composite };
}

export const fmt = {
  currency: (n) => n != null ? `$${Math.round(n).toLocaleString('en-SG')}` : '-',
  currencyK: (n) => n != null ? `$${Math.round(n/1000)}K` : '-',
  currencyM: (n) => n != null ? `$${(n/1e6).toFixed(2)}M` : '-',
  percent: (n) => n != null ? `${(n * 100).toFixed(1)}%` : '-',
  percentInt: (n) => n != null ? `${Math.round(n * 100)}%` : '-',
  monthlyCarry: (n) => { if (n == null) return '-'; return n >= 0 ? `+$${Math.round(n).toLocaleString()}/mo` : `-$${Math.abs(Math.round(n)).toLocaleString()}/mo`; },
};
