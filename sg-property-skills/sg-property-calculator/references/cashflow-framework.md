# Cash Flow Projection Framework

## Monthly Outflows

### 1. Mortgage Payment (Principal + Interest)

Calculated using amortisation formula from mortgage-models.md.

**Example:** $600,000 loan at 5.0% for 25 years = $3,503/month

This is the most substantial monthly outflow and is often split between:
- **Cash payment:** portion you pay from pocket
- **CPF contribution:** portion deducted from CPF OA (if mortgage package allows)

### 2. Maintenance and Conservancy Fees

Depends on property type:

**HDB Flat:**
- Monthly conservancy: $50–$120 (depends on block size, age, location)
- Includes common corridor maintenance, lift, void deck, compound

**Executive Condominium (EC):**
- Monthly conservancy: $150–$400
- Includes common areas, security, landscaping, gym/facilities (if applicable)

**Private Condo:**
- Monthly conservancy: $250–$800+ (varies widely)
- Size matters: 1,200 sqft unit vs 3,000 sqft penthouse can differ by 3x
- Inclusions: common facilities, security, maintenance, staff
- Luxury condos (resort facilities, concierge): can exceed $1,000/month

**Landed Property (House, Shophouse):**
- No conservancy (you own common areas)
- But: own responsibility for maintenance (roof, external walls, drains)
- Budget: $200–$500/month allowance for repairs and painting

### 3. Property Tax (Annual, not Monthly, but Include in Projections)

Singapore property tax is annual and depends on **Annual Value (AV)** and **property usage** (owner-occupied vs non-owner-occupied).

#### Owner-Occupied Property

Progressive tiered tax on AV:

| AV Range | Rate |
|----------|------|
| $0–$8,000 | 0% |
| $8,001–$30,000 | 4% |
| $30,001–$40,000 | 5% |
| $40,001–$55,000 | 6% |
| $55,001–$70,000 | 7% |
| $70,001–$100,000 | 8% |
| Over $100,000 | 10% |

**Interpretation:** Only the amount in each bracket is taxed at that rate (progressive, not flat).

**Worked example: Owner-occupied flat with AV $60,000**

```
AV: $60,000

Tax on $0–$8,000:        $8,000 × 0% = $0
Tax on $8,001–$30,000:   $22,000 × 4% = $880
Tax on $30,001–$40,000:  $10,000 × 5% = $500
Tax on $40,001–$55,000:  $15,000 × 6% = $900
Tax on $55,001–$60,000:  $5,000 × 7% = $350
─────────────────────────────────────
Total annual property tax: $2,630
Monthly equivalent: $219
```

#### Non-Owner-Occupied (Rented) Property

Much higher tax rate; tiered differently:

| AV Range | Rate |
|----------|------|
| $0–$30,000 | 12% |
| $30,001–$45,000 | 20% |
| Over $45,000 | up to 36% |

**Worked example: Same flat rented out, AV $60,000**

```
Tax on $0–$30,000:       $30,000 × 12% = $3,600
Tax on $30,001–$45,000:  $15,000 × 20% = $3,000
Tax on $45,001–$60,000:  $15,000 × 28% = $4,200
─────────────────────────────────────
Total annual property tax: $10,800
Monthly equivalent: $900
```

**Comparison:** Rented property tax is 4x higher due to progressive rates. This makes owner-occupancy financially superior (after accounting for owner-occupation exemption).

**AV Determination:**
- Land Authority (LA) determines AV annually based on comparable rental rates and property condition
- AV may change year-to-year (typically by ±5–10%)
- Can appeal AV if believe it's overstated (complex process; consult property tax advisor)

### 4. Fire Insurance (Compulsory by Bank)

**Mandatory requirement from mortgage lender.**

- Coverage: Protects building structure against fire and allied perils (windstorm, explosion, flood, etc.)
- Typical cost: $120–$250/year for a flat (varies by value, age, location)
- Paid once annually (some packages allow monthly deduction from CPF)
- Minimum coverage: Bank may require full replacement value

**Estimate:** Budget $150/year or **$12.50/month** for projection.

### 5. Home Insurance (Optional but Recommended)

**Voluntary coverage for contents and liability.**

Typical cost: $200–$500/year depending on sum assured and building type.

Coverage typically includes:
- Theft
- Accidental damage (broken furniture, flooring damage)
- Public liability (injury to visitors; you are liable)
- Alternative accommodation if property becomes uninhabitable

**Estimate:** Budget $300/year or **$25/month** for projection if house-proud; omit if willing to self-insure.

### 6. Home Improvement and Maintenance Reserve (Optional)

For owned properties, budget a maintenance allowance for:
- Air-con servicing: $100–$150/year
- Plumbing and electrical repairs: $300–$500/year
- Painting and touch-ups: $200–$400/year (every 5–7 years)
- Appliance repairs: $200–$400/year

**Typical guidance:** Budget 0.5–1% of property value annually.

**For a $1,500,000 property:** $7,500–$15,000/year ($625–$1,250/month).

For owner-occupants: critical to budget this.
For investors: deductible against rental income (keep receipts).

---

## Monthly Inflows (If Property is Tenanted)

### Gross Rental Income

Determined by current market rent for comparable properties in the area.

**Example:**
- 4-room HDB flat in Hougang: $2,800–$3,200/month
- 3-bedroom condo in Kallang: $3,500–$4,500/month
- Landed 5-bedroom in Thomson: $6,000–$8,000/month

Rental rates vary by:
- **Location:** Prime (CBD, East Coast) commands 20–30% premium
- **Condition:** Renovated, modern units fetch 10–15% more
- **Tenant profile:** Expat families > local families > students
- **Lease term:** 3-year leases command slight premium over 1-year

### Rental Agent Commission

If using a rental agent to find tenants:

**Commission structure (most common):**
- One month's rent for 2-year lease (e.g., $3,000 for $3,000 flat)
- Half month's rent for 1-year lease
- Payable at start of tenancy

**Impact on cash flow (annualised):**
```
Example: $3,000/month rent, 2-year lease with agent

Commission per lease: $3,000
Effective cost per month (spread over 24 months): $3,000 ÷ 24 = $125/month
```

**Comparison: Self-managed vs agent-managed**
- Self-managed: Save commission but handle tenant screening, repairs, complaints
- Agent-managed: Pay commission but outsource hassles

Most investors find agent cost worthwhile.

### Vacancy Allowance

It is unrealistic to assume 100% occupancy. Budget for:
- Between tenancies (1–2 months turnover): 4–8% annual vacancy
- Problem tenancies, legal disputes: additional risk

**Conservative assumption:** 1 month vacancy per year out of 12 = 8.3% vacancy allowance.

**Example:**
```
Gross monthly rent:        $3,000
Annual gross:              $36,000
Vacancy loss (1 month):   −$3,000
Effective gross:           $33,000
Monthly effective gross:   $33,000 ÷ 12 = $2,750
```

### Net Rental Income Calculation

```
Gross monthly rental:           $3,000
Less: Vacancy allowance (1/12): −$250
Less: Agent commission:         −$125
Less: Maintenance provision:    −$300
─────────────────────────────────────
Net monthly rental income:      $2,325
```

**Maintenance provision:** Reserve 10% of rent for ongoing repairs, damage, turnover costs.

---

## Property Tax Rates Reference

### Owner-Occupied Summary

For budgeting purposes, rough estimates:

| AV (Estimated) | Estimated Property Tax | Monthly Equivalent |
|---|---|---|
| $15,000 | $600 | $50 |
| $30,000 | $1,470 | $122 |
| $45,000 | $2,570 | $214 |
| $60,000 | $3,630 | $302 |
| $80,000 | $5,270 | $439 |
| $100,000 | $7,270 | $606 |

**Relationship to property value:**
- HDB flat ($500,000–$800,000 price): AV typically $30,000–$50,000 → annual tax $1,500–$2,600
- Condo ($1,000,000–$2,000,000 price): AV typically $50,000–$100,000 → annual tax $2,600–$7,300

As a quick approximation: **Property tax ≈ 0.3–0.5% of property price for owner-occupied.**

### Non-Owner-Occupied Summary

| AV | Estimated Tax | Monthly Equivalent |
|---|---|---|
| $30,000 | $3,600 | $300 |
| $50,000 | $8,200 | $683 |
| $80,000 | $15,800 | $1,317 |

Much steeper; use 1.5–2% of property price as rough guideline.

---

## Holding Cost Calculation

### Total Annual Holding Cost (Owner-Occupied)

```
Mortgage payments:              $42,036 (from $3,503/month)
Conservancy:                    $2,400 ($200/month HDB)
Property tax (AV $60k):         $2,630
Fire insurance:                 $150
Home insurance:                 $300
Maintenance reserve:            $3,600
─────────────────────────────────────
Total annual holding cost:      $51,116
Monthly holding cost:           $4,260
```

### Net Holding Cost (If Property is Rented Out)

```
Total annual holding cost:      $51,116

Less: Net rental income
  Gross rent: $36,000
  Vacancy & commission & maintenance: −$8,250
  Net rental income:             $27,750

Property tax (non-owner-occupied): $10,800 (replaces $2,630)
─────────────────────────────────────
Net holding cost:
  ($51,116 − $2,630 + $10,800) − $27,750 = $31,536/year
  Monthly net holding cost: $2,628
```

**Interpretation:** Renting covers some costs but not all. Landlord bears ~$2,600/month shortfall in this example.

---

## CPF vs Cash Optimisation

When paying a mortgage, you can use a combination of **CPF OA** and **cash**.

### Using CPF OA for Mortgage

**Advantages:**
- Reduces cash outlay, preserves liquid reserves for emergencies
- "Forced savings" — CPF cannot be withdrawn until retirement
- CPF OA interest (2.5% p.a.) is competitive with bonds, but lower than growth stocks

**Disadvantages:**
- Accrued interest (2.5% p.a. compounded) must be refunded upon sale
- Reduces flexibility (once used, cannot "un-use" for other needs)
- At age 55+, Basic Retirement Sum must be set aside first

### Using Cash for Mortgage

**Advantages:**
- Avoids 2.5% accrued interest liability
- Full liquidity and flexibility
- If you have high-yield investments (6%+ returns), better to invest cash than lock into CPF's 2.5%

**Disadvantages:**
- Depletes emergency reserves immediately
- Higher monthly cash outlay from pocket
- No forced savings component

### Decision Framework

**Optimal split depends on:**

1. **Investment return expectation on cash**
   - If you believe you can invest at 5%+: use less CPF (the opportunity cost is high)
   - If you plan to hold cash in savings (0.5% interest): use more CPF (2.5% in CPF beats 0.5% savings)

2. **Age and CPF SA accrual**
   - Under age 45: CPF SA interest is higher; less efficient to put OA toward mortgage
   - Age 45+: CPF SA drops to 4% (from 5%), making CPF OA comparisons closer
   - Age 55+: Must reserve BRS; less OA available

3. **Planned holding period**
   - Short holding (3–5 years): Use more cash (avoid 2.5% interest accumulation on CPF)
   - Long holding (20+ years): CPF OA makes sense (forced savings discipline)

### Worked Example: CPF vs Cash Decision

**Scenario:**
- Age: 35, both partners employed
- CPF OA balance (joint): $200,000
- Cash savings: $100,000
- Planned mortgage: $600,000 over 25 years at 5.0% = $3,503/month
- Planned holding period: 15 years

**Option A: Use maximum CPF (CPF covers 60%, cash 40%)**

```
CPF contribution to mortgage: $2,102/month
Cash contribution to mortgage: $1,401/month

After 15 years:
  CPF used: $2,102 × 180 months = $378,360
  CPF accrued interest at 2.5%: $378,360 × [(1.025)^15 − 1] = $133,000
  Total CPF refund due: $378,360 + $133,000 = $511,360

Cash outlay over 15 years: $1,401 × 180 = $252,180
```

**Option B: Use moderate CPF (CPF covers 40%, cash 60%)**

```
CPF contribution to mortgage: $1,401/month
Cash contribution to mortgage: $2,102/month

After 15 years:
  CPF used: $1,401 × 180 months = $252,180
  CPF accrued interest at 2.5%: $252,180 × [(1.025)^15 − 1] = $88,500
  Total CPF refund due: $252,180 + $88,500 = $340,680

Cash outlay over 15 years: $2,102 × 180 = $378,360
```

**Comparison:**

| Option | Total CPF Due | Total Cash Paid | Liquid Reserves Remaining (Year 15) |
|--------|---|---|---|
| A (60% CPF) | $511,360 | $252,180 | Very low (~$0) |
| B (40% CPF) | $340,680 | $378,360 | Moderate ($50,000+) |

**Analysis:**
- Option A reduces cash outlay but leaves household with zero reserves by year 15 (risky)
- Option B preserves some cash buffer and is more conservative
- The CPF interest cost ($133k vs $88k) is offset by liquidity value of cash reserves

**Recommendation for this couple:** Use 50/50 split — CPF covers half, cash covers half. Strikes balance between forced savings and emergency liquidity.

### General Guidance

**Conservative rule of thumb:**
- Use CPF to cover 40–60% of mortgage (especially important in years 1–5 when cash buffer matters most)
- Preserve minimum 12 months expenses in cash at all times
- After year 5, if income is stable and reserves are solid, increase CPF contribution to 70–80%

---

## Cash Flow Projection Template

### Sample 2-Year Month-by-Month Projection

```
Property: 4-room HDB, $500,000 purchase, owner-occupied
Mortgage: $400,000 at 5% for 25 years
Monthly mortgage (principal + interest): $2,403

Assumptions:
  Conservancy: $120
  Property tax: $25 (monthly equivalent of $300/year)
  Fire insurance: $12.50
  Home insurance: $25
  Maintenance reserve: $150
  CPF contribution: $1,500/month
  Cash contribution: $903/month
```

| Month | Mortgage (CPF) | Mortgage (Cash) | Conservancy | Utilities | Property Tax | Insurance | Maintenance | Total Cash Needed | Cumulative |
|-------|---|---|---|---|---|---|---|---|---|
| 1 | $1,500 | $903 | $120 | $200 | $25 | $37.50 | $150 | $1,436 | $1,436 |
| 2 | $1,500 | $903 | $120 | $200 | $25 | $37.50 | $150 | $1,436 | $2,872 |
| 3 | $1,500 | $903 | $120 | $200 | $25 | $37.50 | $150 | $1,436 | $4,308 |
| 4 | $1,500 | $903 | $120 | $200 | $25 | $37.50 | $150 | $1,436 | $5,744 |
| 5 | $1,500 | $903 | $120 | $200 | $25 | $37.50 | $150 | $1,436 | $7,180 |
| 6 | $1,500 | $903 | $120 | $200 | $25 | $37.50 | $150 | $1,436 | $8,616 |
| ... (months 7–24 same pattern) | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 24 | $1,500 | $903 | $120 | $200 | $25 | $37.50 | $150 | $1,436 | $34,464 |

**Conclusion:** Over 24 months, household needs $34,464 in cash from pocket (or $1,436/month). If household income is $6,000/month net after tax and living expenses, this is sustainable.

### Annual Projection for 10 Years

| Year | Mortgage (Cash) | Conservancy | Property Tax | Insurance | Maintenance | Annual Cash | Cumulative | Remaining Loan |
|---|---|---|---|---|---|---|---|---|
| 1 | $10,836 | $1,440 | $300 | $75 | $1,800 | $14,451 | $14,451 | $395,000 |
| 2 | $10,836 | $1,440 | $300 | $75 | $1,800 | $14,451 | $28,902 | $390,000 |
| 3 | $10,836 | $1,440 | $300 | $75 | $1,800 | $14,451 | $43,353 | $385,000 |
| 5 | $10,836 | $1,440 | $300 | $75 | $1,800 | $14,451 | $72,255 | $375,000 |
| 10 | $10,836 | $1,440 | $300 | $75 | $1,800 | $14,451 | $144,510 | $350,000 |

**Key insight:** Cash requirement remains constant (~$14.5k/year in this example) because principal and interest are fixed across the amortisation period. However, actual interest paid decreases annually (principal portion increases), meaning equity accumulation accelerates.

---

## "Sleep Well at Night" Buffer Validation

Before finalizing a property purchase, project cash flow for year 1 and validate:

```
Monthly cash requirement:              $1,436
Annual cash requirement:              $17,232
Liquid reserves needed (12 months):   $20,664

Current liquid reserves:
  Cash savings:                       $100,000
  CPF MA + SA (not used):             $80,000
  Investment accounts:                $20,000
  Total available:                   $200,000

Assessment:
  ✓ Liquid reserves ($200,000) >> Buffer needed ($20,664)
  ✓ Ratio: 9.7x coverage — very comfortable
  ✓ Proceed with purchase
```

If reserves are only $30,000 (buffer need: $20,664), the ratio is 1.45x — too tight. Risk of forced asset sale in emergency.

**Decision:** Only proceed if liquid reserves exceed 2x annual cash requirement minimum; 3x+ is comfortable.
