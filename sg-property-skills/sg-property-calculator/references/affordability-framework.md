# Affordability Assessment Framework

## TDSR (Total Debt Service Ratio) Calculation

### The 55% Threshold

Maximum monthly mortgage payment is constrained by TDSR regulation:

**Max Monthly Mortgage = (Gross Monthly Income × 55%) − Existing Monthly Obligations**

### What Counts as Debt Obligations

Include ALL of the following:
- Existing mortgage payments
- Car loans (principal + interest portion)
- Credit card minimum payments (or 5% of outstanding balance if higher)
- Student loans (PTSL, overseas education loans)
- Personal loans
- Home improvement loans
- Payday/salary advance loans
- Any BankruptcyAct obligations

Do NOT include:
- Income tax
- CPF contributions (these are paid separately)
- Utilities or living expenses
- Rental payments (unless you're also claiming rental income)

### Income Documentation

**For salaried employees:**
- Use latest 12 months average gross salary (including bonuses, allowances, commissions as documented)
- Supported by: latest 3 months payslips, latest NOA (Notice of Assessment)

**For variable income (commission, bonus-dependent):**
- Use average of past 12 months OR latest NOA, whichever is LOWER
- Supported by: last 12 months payslips and latest NOA
- Banks typically apply hair-cut: accept 70-80% of declared variable income

**For self-employed:**
- Use average of latest 2 years NOA
- Supported by: audited accounts and latest NOA
- Banks apply 70-80% of net profit

**For business owners (shareholding):**
- Use 80% of net profit from latest 2 years (averaged)
- Must have at least 30% shareholding
- Include director fees if documented

**For joint applications (married couple):**
- Add both gross incomes
- Liabilities are combined

### Interest Rate for Stress Test

For TDSR calculation with variable rate loans, use **4.0% p.a.** as the medium-term interest rate for the test. This is the internal bank benchmark (as of 2024) and is more conservative than SIBOR/SORA averages.

**Example TDSR Calculation:**

| Item | Amount |
|------|--------|
| Gross monthly income | $8,000 |
| Existing car loan | $800 |
| Existing personal loan | $300 |
| Total existing obligations | $1,100 |
| Maximum allowed debt service (55% of gross) | $4,400 |
| Maximum available for mortgage | $4,400 − $1,100 = **$3,300** |

---

## MSR (Mortgage Service Ratio) Calculation

### The 30% Threshold

Applies ONLY to HDB and EC (Executive Condominium) loans. This is a separate, stricter constraint.

**Max Monthly Mortgage Payment = Gross Monthly Income × 30%**

### Application Rules

- MSR is calculated on the **new mortgage only** (unlike TDSR which includes all debt)
- Applies to: HDB bank loans, HDB direct concessionary loans, bank loans for ECs
- For private property: no MSR (TDSR applies only)
- For HDB resale or new EC purchase: both TDSR and MSR apply; the **lower** is the binding constraint

### Example MSR Constraint

| Item | Amount |
|------|--------|
| Gross monthly income | $8,000 |
| 30% of gross income | **$2,400** |
| Maximum mortgage payment under MSR | **$2,400** |

*Note: If TDSR allows $3,300 but MSR allows only $2,400, the monthly mortgage payment is capped at $2,400.*

---

## Maximum Loan Quantum Derivation

Once maximum monthly payment is established (via TDSR or MSR), derive the maximum loan amount.

### Formula: Present Value of Annuity

```
Max Loan = Monthly Payment × [1 − (1 + r)^(−n)] / r
```

Where:
- `Monthly Payment` = derived from TDSR or MSR constraint
- `r` = monthly interest rate (annual rate ÷ 12)
- `n` = number of months (tenure in years × 12)

### Standard Loan Parameters

**Bank Loans (Private Property):**
- Tenure: up to 30 years
- Lock-in period: typically 2–3 years
- Age limit: borrower age + loan tenure ≤ 65 (for 75% LTV) or ≤ 75 (for reduced LTV)
- For age 50+: tenure reduced to (65 − borrower age) to keep sum ≤ 65

**HDB Concessionary Loan:**
- Tenure: up to 25 years
- Fixed rate: 2.6% p.a. (pegged to CPF OA interest + 0.1%)
- Age limit: borrower age + tenure ≤ 65
- Loan amount: up to 80% LTV (no age-related reduction)

**HDB Bank Loan:**
- Tenure: up to 25 years
- Age limit: borrower age + tenure ≤ 65
- LTV: depends on type and count (see next section)

### Example: Maximum Loan Derivation

**Scenario:** Monthly payment allowed = $3,300, tenure 25 years, interest rate 4.5% p.a.

```
r = 4.5% ÷ 12 = 0.375% = 0.00375 per month
n = 25 × 12 = 300 months

Max Loan = 3,300 × [1 − (1.00375)^(−300)] / 0.00375
         = 3,300 × [1 − 0.3102] / 0.00375
         = 3,300 × 0.6898 / 0.00375
         = 3,300 × 183.94
         = $607,000 (approx)
```

---

## LTV (Loan-to-Value) and Downpayment Requirements

Downpayment must be split between **cash** and **CPF**.

### First Property (No Existing Residential Loan)

| Scenario | LTV | Minimum Cash | Remaining |
|----------|-----|--------------|-----------|
| Purchasing | 75% | 5% | 20% (cash or CPF) |

**Interpretation:**
- Bank lends 75% of property value
- Must pay 5% in cash upfront (caveat registration, legal, agent commission)
- Remaining 20% can be cash or CPF OA withdrawal

### First Property (With Existing Residential Loan)

| Scenario | LTV | Minimum Cash | Remaining |
|----------|-----|--------------|-----------|
| Purchasing while holding first | 45% | 25% | 30% (cash or CPF) |

**Interpretation:**
- Bank lends only 45% of property value
- Must pay minimum 25% in cash
- Remaining 30% can be cash or CPF

### Second and Subsequent Properties

| Scenario | LTV | Minimum Cash | Remaining |
|----------|-----|--------------|-----------|
| Second property | 45% | 25% | 30% (cash or CPF) |
| Third+ property | 45% | 25% | 30% (cash or CPF) |

### Lease Length Adjustment

For properties with **remaining lease < 75 years**, LTV is reduced:

| Remaining Lease | LTV Reduction | Effective LTV (First Property) |
|-----------------|---------------|-------------------------------|
| 50–75 years | −5% | 70% |
| 40–50 years | −10% | 65% |
| 30–40 years | −15% | 60% |
| <30 years | −20% | 55% |

---

## CPF Usage Planning

### What CPF OA Can Cover

CPF Ordinary Account (OA) can be withdrawn for:
- Property purchase price (paid to seller's lawyer)
- Stamp duties (BSD, ABSD, SSD if applicable)
- Legal fees
- Valuation fee
- Mortgage payments (ongoing, to reduce cash outlay)
- Mortgage insurance premium (if required)

CPF cannot cover: agent commission, renovation, home insurance, moving costs.

### Valuation Limit (VL) for Resale Property

For resale properties:
```
VL = Lower of (Purchase Price, Property Valuation)
```

Banks will use the property valuation for mortgage purposes. If valuation is lower than purchase price, CPF withdrawal is capped at valuation (not purchase price).

### Withdrawal Limit (WL)

Withdrawal limit for CPF use is:
```
WL = VL − (CPF grants received, if any)
```

If you received any grant (e.g., HDB housing grants, First-Time Buyer Enhancement Scheme), that amount is deducted from the withdrawal limit.

### Accrued Interest on CPF Used

**This is critical:** All CPF withdrawn for property is treated as a loan from your CPF account, accruing interest at **2.5% p.a. compounded annually**.

**Upon sale of the property:**
- Sale proceeds pay off the mortgage
- Remaining proceeds are used to refund CPF OA (original amount + accrued 2.5% interest)
- Any surplus goes to you

**Impact on Net Proceeds:**

Example: Purchased 10 years ago, used $200,000 CPF.

```
CPF owed back = $200,000 × (1.025)^10
              = $200,000 × 1.2800
              = $256,048

Sale proceeds (after mortgage and taxes):  $600,000
Less: CPF refund                          ($256,048)
Net proceeds to you                        $343,952
```

The accrued interest grows significantly over long holding periods. **This is not a hidden cost — it is legitimate compound interest on money held in your CPF account.**

### CPF Usage at Age 55+

At age 55, you must set aside a **Basic Retirement Sum (BRS)** in your CPF OA before using it for property:

- BRS (2024): $26,000 for most; $43,500 for self-employed
- BRS indexed annually

If your CPF OA balance is below BRS, you cannot use OA for property (unless granted exemption). Excess above BRS can be used.

---

## Stress Testing: Three Scenarios

Run affordability through all three scenarios to understand downside risk.

### Scenario 1: Base Case
**Assumptions:**
- Current gross income
- Current interest rate (or latest 1-year rate for variable loans)
- Current debt obligations
- Standard 25-year tenure

**Output:** Comfortable affordability at current conditions.

### Scenario 2: Rate Stress (+2%)
**Assumptions:**
- Same income as base case
- Interest rate = current rate + 2.0%
- Same debt obligations
- Recalculate maximum monthly mortgage and loan quantum

**Output:** Affordability if interest rates spike by 200 basis points.

### Scenario 3: Income Stress (−20%)
**Assumptions:**
- Gross income reduced by 20% (job loss, career change, commission cut)
- Interest rate = current rate + 1.0% (moderate rise)
- Same debt obligations increase (e.g., car loan still exists)
- Recalculate maximum monthly mortgage and loan quantum

**Output:** Affordability if income drops significantly.

### Scenario 4: Combined Worst Case (+2% rate, −20% income)
**Assumptions:**
- Gross income reduced by 20%
- Interest rate = current rate + 2.0%
- Same debt obligations
- Recalculate maximum monthly mortgage and loan quantum

**Output:** Worst-case affordability.

### Presentation Table

| Metric | Base Case | Rate +2% | Income −20% | Worst Case |
|--------|-----------|----------|------------|-----------|
| Gross monthly income | $8,000 | $8,000 | $6,400 | $6,400 |
| Interest rate | 4.0% | 6.0% | 5.0% | 6.0% |
| Max monthly mortgage | $3,300 | $2,950 | $2,640 | $2,360 |
| Max loan @ 25yr tenure | $607,000 | $543,000 | $486,000 | $434,000 |
| Max property price (75% LTV) | $809,000 | $724,000 | $648,000 | $579,000 |
| Remaining liquid buffer | Sufficient | Tight | Very tight | Inadequate |

---

## The "Sleep Well at Night" Buffer

This is the non-negotiable affordability test. After all monthly obligations — mortgage, conservancy, property tax, insurance, and living expenses — the household must retain liquid reserves sufficient to cover 6–12 months of total expenses.

### Calculation

1. Calculate total monthly expenditure:
   ```
   Total monthly = Mortgage + Conservancy + Property tax + Insurance + Living expenses
   ```

2. Define required buffer:
   - **Minimum:** 6 months × total monthly = liquid reserves required
   - **Recommended:** 12 months (especially for single-income households)

3. Check available liquid reserves:
   - Cash on hand after downpayment
   - Investments not tied up in property
   - Emergency funds
   - CPF in other accounts (SA, MA) not used for property

4. Decision rule:
   ```
   If liquid reserves < 6 months expenses, property is UNAFFORDABLE.
   If liquid reserves < 12 months expenses AND single income, property is RISKY.
   If liquid reserves ≥ 12 months expenses, property is COMFORTABLE.
   ```

### Example: Buffer Assessment

**Scenario:** Couple earning $8,000 + $6,000 = $14,000 gross per month.

```
Monthly expenses:
  Mortgage (principal + interest):    $3,300
  Conservancy:                         $300
  Property tax:                        $200
  Fire insurance:                      $150
  Home insurance:                      $150
  Living expenses (food, utilities):  $3,500
  ─────────────────────────────────
  Total monthly                       $7,600

Minimum buffer requirement (6 months):
  $7,600 × 6 = $45,600

Recommended buffer (12 months):
  $7,600 × 12 = $91,200

Available liquid reserves after downpayment:
  Cash savings:          $100,000
  CPF MA (untouched):    $50,000
  Emergency fund:        $20,000
  ─────────────────────────────────
  Total liquid:          $170,000

Assessment:
  ✓ Exceeds minimum buffer ($45,600)
  ✓ Exceeds recommended buffer ($91,200)
  ✓ Property is COMFORTABLE
```

**Decision:** Proceed. Even in income stress (−20%, down to $11,200 gross), the couple can sustain 9+ months on liquid reserves.

---

## Summary: Affordability Decision Tree

1. **Calculate TDSR max payment** (55% of gross less existing obligations)
2. **If HDB/EC, also calculate MSR** (30% of gross); use the LOWER
3. **Derive maximum loan quantum** from max payment (tenure, interest rate)
4. **Apply LTV constraint** → maximum property price
5. **Determine downpayment split** (cash vs CPF)
6. **Run three stress scenarios** (rate +2%, income −20%, worst case)
7. **Calculate liquid buffer required** (6–12 months total expenses)
8. **Decision:**
   - If buffer < 6 months: UNAFFORDABLE
   - If buffer 6–12 months AND dual income: PROCEED WITH CAUTION
   - If buffer 6–12 months AND single income: RISKY
   - If buffer > 12 months: COMFORTABLE
   - If property passes stress scenarios and buffer is adequate: RECOMMENDED
