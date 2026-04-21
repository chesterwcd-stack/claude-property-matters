# Mortgage Comparison Framework

## Loan Types Available in Singapore

### 1. Fixed Rate Loans

A fixed interest rate for a **lock-in period** (typically 2–3 years), after which the rate may adjust or remain fixed depending on the package.

**Characteristics:**
- **Lock-in period:** 2–3 years (fixed rate applies)
- **Initial rate:** Often 0.2–0.5% higher than floating to compensate for rate certainty
- **After lock-in:** Rate may be fixed for further terms, or convert to floating
- **Prepayment penalty:** 1.5% of outstanding balance if repaid before lock-in ends
- **Refinancing penalty:** 1.5% if refinancing to another lender within lock-in period

**Best for:**
- Borrowers seeking certainty in monthly payments during initial years
- Expected interest rate rises
- Short holding periods (3–5 years) where prepayment penalty is acceptable
- Risk-averse households that cannot absorb payment spikes

**Worked Example: Fixed Rate Package**
```
Loan amount: $600,000
Tenure: 25 years (300 months)
Fixed rate (lock-in 3 years): 3.5% p.a.
After lock-in: convert to floating at SORA + 1.85% spread

Year 1–3 (fixed at 3.5%):
  Monthly payment = $3,080

Year 4+ (floating at SORA + 1.85%, assume SORA 3.5%):
  New rate = 3.5% + 1.85% = 5.35% p.a.
  Remaining loan: ~$553,000
  New monthly payment = $3,290
  Jump: +$210/month

Total interest over 25 years:
  Years 1–3: $3,080 × 36 − ($600,000 − $553,000) = $73,400
  Years 4–25: ~$465,000
  Total interest: ~$538,400
```

### 2. Floating Rate Loans (SORA-Pegged)

Interest rate is pegged to **SORA (Secured Overnight Rates Average)** plus a **bank spread**, adjusting quarterly or monthly.

**Characteristics:**
- **Base rate:** SORA (official benchmarked rate)
- **Spread:** Bank's margin (typically 1.5–2.0% p.a.)
- **Total rate:** SORA + spread
- **Reset frequency:** Quarterly (most common) or monthly
- **No lock-in period:** Can refinance or repay without penalty immediately
- **Prepayment:** Generally allowed without penalty (check terms)

**Current Context (2024):**
- SORA averages ~3.5–4.0% p.a. (varies with market)
- Typical spread: 1.5–1.85%
- Effective rate: 5.0–5.85% p.a.

**Best for:**
- Long holding periods (10+ years) where uncertainty can be absorbed
- Borrowers confident rates will fall or remain stable
- Flexibility to refinance quickly if rates spike
- Interest-sensitive borrowers (every rate adjustment matters)

**Worked Example: Floating Rate (SORA-Pegged)**
```
Loan amount: $600,000
Tenure: 25 years (300 months)
SORA + spread: 3.5% + 1.85% = 5.35% p.a. (initial)

Year 1–2 (SORA stable at 3.5%):
  Monthly payment = $3,290

Year 3 (SORA rises to 4.0%):
  New rate = 4.0% + 1.85% = 5.85%
  Remaining loan: ~$523,000
  New monthly payment = $3,440
  Jump: +$150/month

Year 4 (SORA falls to 3.2%):
  New rate = 3.2% + 1.85% = 5.05%
  New monthly payment = $3,120
  Drop: −$320/month

Total interest over 25 years:
  Average rate ~5.2% = ~$520,000 (approx)
```

### 3. Board Rate Loans (Discouraged)

Interest rate set by the bank's internal board, not pegged to SORA or any published benchmark. **Avoid if possible** — lacks transparency and tends to be less competitive.

**Characteristics:**
- Opaque rate setting
- Difficult to benchmark against market
- Often higher than SORA-pegged + spread
- Hard to refinance when rates drop

**Not recommended for home purchases.**

### 4. HDB Concessionary Loan (HDB Properties Only)

A direct loan from HDB (Housing Development Board), available only for HDB property purchases and refinancing.

**Characteristics:**
- **Fixed rate:** 2.6% p.a. (as of 2024)
- **Rate peg:** CPF Ordinary Account Interest (2.5%) + 0.1%
- **Tenure:** Up to 25 years
- **LTV:** Up to 80% (higher than bank loans)
- **Age limit:** Borrower age + tenure ≤ 65
- **No prepayment penalty:** Can repay anytime without penalty
- **No lock-in:** Refinance to bank anytime without penalty

**Best for:**
- First-time HDB buyers
- Conservative borrowers valuing certainty
- Borrowers who want to avoid bank lending criteria
- Long tenure holders (25 years at 2.6% is excellent)

**Comparison with Bank Loan:**

| Feature | HDB Concessionary | Bank Floating (SORA+) |
|---------|------------------|----------------------|
| Rate | 2.6% (fixed) | 5.0–5.85% (variable) |
| Tenure | Up to 25 years | Up to 30 years |
| LTV | 80% | 75% |
| Prepayment penalty | None | Usually none |
| Flexibility | Low (fixed only) | High (resets quarterly) |
| Best case (rates drop) | Locked at 2.6% | Saves on interest |
| Worst case (rates rise) | Protected at 2.6% | Exposed to increase |

---

## Mortgage Comparison Methodology

When comparing two loan offers, the deciding factor is **total interest cost over planned holding period**, not just the monthly payment.

### Step 1: Establish Holding Period

Determine how long you plan to own the property:
- Owner-occupied, no sale planned: Use 25–30 years
- Owner-occupied with eventual upgrade: Use 10–15 years
- Investment property with liquidity goal: Use 5–10 years
- Flexible timeline: Run analysis for multiple scenarios

### Step 2: Calculate Total Interest Cost for Each Loan

**Formula for fixed-rate loan:**
```
Total interest = (Monthly payment × Number of months) − Original loan amount
```

**Formula for floating-rate loan (with rate changes):**
```
Total interest = Sum of interest portions in each reset period − Original loan amount
```

This requires projecting future SORA rates. Conservative approach: assume SORA rises 1% from current levels.

### Step 3: Quantify Lock-In and Refinancing Costs

**Fixed-rate loan penalty cost:**
- If refinancing before lock-in ends: 1.5% of outstanding balance
- Plus legal costs: ~$2,000–$3,000

**Floating-rate loan costs:**
- No prepayment penalty (most packages)
- Refinancing legal cost: ~$2,000–$3,000 (if switching banks)

### Step 4: Factor in Free Repricing and Conversion Rights

**Free repricing:** Ability to switch the interest rate formula (e.g., from fixed to floating) **once** without legal costs and penalty.

**Free conversion:** (Rarer) Switch from fixed to floating or vice versa at no cost.

- If fixed-rate package includes free conversion after lock-in, value is high (insurance against rising rates)
- If floating-rate package includes free repricing to a new SORA spread, less valuable (SORA changes independently)

### Worked Example: Fixed vs Floating Comparison

**Scenario:**
- Loan: $600,000
- Tenure: 25 years
- Holding period: 10 years (plan to sell and upgrade)
- Fixed offer: 3.5% for 3 years, then convert to floating at SORA + 1.85%
- Floating offer: SORA + 1.75% from day 1
- Assumption: SORA current = 3.5%, will average 4.0% over next 10 years

**Fixed Rate Loan (3.5% for 3 years, then SORA + 1.85%):**

| Period | Rate | Months | Monthly Payment | Period Interest | Outstanding Balance (End) |
|--------|------|--------|-----------------|-----------------|---------------------------|
| Years 1–3 | 3.5% | 36 | $3,080 | $50,880 | $548,000 |
| Years 4–10 | 5.85% | 84 | $3,440 | $186,560 | $480,000 |
| (At sale, year 10) | – | – | – | – | $480,000 |
| **Total interest (10 years):** | | | | **$237,440** | |
| Refinancing penalty (if any at year 3): | – | | | ~$0 (after lock-in) | |
| **Total cost of loan (10 years):** | | | | **$237,440** | |

**Floating Rate Loan (SORA + 1.75% throughout):**

| Period | Rate | Months | Monthly Payment | Period Interest | Outstanding Balance (End) |
|--------|------|--------|-----------------|-----------------|---------------------------|
| Years 1–2 | 5.25% | 24 | $3,260 | $38,240 | $568,000 |
| Years 3–5 | 5.75% | 36 | $3,360 | $54,960 | $532,000 |
| Years 6–10 | 5.75% | 60 | $3,360 | $134,400 | $480,000 |
| **Total interest (10 years):** | | | | **$227,600** | |
| Refinancing cost: | – | | | ~$0 (no penalty) | |
| **Total cost of loan (10 years):** | | | | **$227,600** | |

**Analysis:**
- Fixed loan (10-year holding): $237,440 total interest
- Floating loan (10-year holding): $227,600 total interest
- **Difference:** Floating saves $9,840 over 10 years
- **Average saving per month:** ~$82

**Conclusion:** For a 10-year horizon, floating is marginally cheaper because SORA stays relatively elevated. However, if rates spike suddenly in year 4, fixed provides certainty. The $82/month difference is narrow; **risk tolerance** (not just rate) should drive the decision.

### Break-Even Analysis: SORA Rate

At what SORA level does fixed become cheaper than floating?

**Setup:**
- Fixed: 3.5% for 3 years, then convert to floating at 5.35% (SORA 3.5% + 1.85%)
- Floating: SORA + 1.75%
- Break-even SORA (after year 3): Find the rate where total interest cost is equal

**Calculation:**
- Floating rate breaks even when: SORA + 1.75% = 5.35%
- Solving: SORA = 3.6%

**Interpretation:** If SORA remains above 3.6% after year 3, fixed at 5.35% is better. If SORA falls below 3.6%, floating is better. Currently SORA is ~3.5%, so break-even is very close.

**Rule of thumb:** If you believe SORA will average above 4.0% over your holding period, fixed is attractive. If you think SORA will fall or stay below 4.0%, floating is better.

---

## Key Loan Terms to Scrutinise

### 1. Lock-In Period and Penalty

- **Lock-in duration:** 2–3 years is standard; longer = more inflexible
- **Penalty amount:** Typically 1.5% of outstanding balance; some banks offer declining penalties (1.2% in year 2, 0.5% in year 3)
- **Early repayment without penalty:** Check if you can make lump-sum payments beyond the monthly amount penalty-free (most banks allow up to 15% of original loan amount per year)

### 2. Clawback on Legal Subsidy

Some banks offer **free legal fees** during the lock-in period, but claw back (reverse) this subsidy if you refinance or repay early within 2–3 years.

**Example clawback:**
```
Legal subsidy offered: $4,000
Clawback if refinance within 2 years: $4,000
Net cost if refinancing: Legal fees ($3,000) + Clawback ($4,000) = $7,000
```

Always factor in clawback when comparing fixed-rate offers.

### 3. Free Repricing vs Free Conversion

**Free repricing:**
- Typically offered once per loan tenure
- Switch to a new SORA spread at no cost (e.g., from SORA + 1.85% to SORA + 1.70%)
- Valuable if the bank's spread is non-competitive
- Note: SORA itself does not change at repricing; only the spread

**Free conversion:**
- Switch from fixed to floating (or vice versa) at no cost
- Rarer; highly valuable
- Offers insurance against rate movements

**Value comparison:**
- Free repricing (fixed to floating): High value if you want rate flexibility after lock-in
- Free repricing (floating to fixed): Moderate value if rates are expected to fall
- Free conversion: High value in uncertain rate environment

### 4. Partial Prepayment Flexibility

Check the terms for lump-sum repayments:
- **No penalty lump-sum:** Up to X% of original loan per year (usually 15%)
- **Penalty-free after lock-in:** Some packages allow free repayment after lock-in expires

**Value:** Critical for borrowers expecting bonuses, inheritance, or sale proceeds.

### 5. Interest Offset Account

Some packages include an **interest offset account** (or balance offset): your savings account balance can be used to offset interest calculations without losing access to the savings.

**Example:**
```
Loan balance: $600,000
Savings in offset account: $50,000
Interest calculated on: $600,000 − $50,000 = $550,000
```

**Value:** Significant if you maintain a large cash buffer. Can reduce interest cost by $1,000–$3,000/year.

---

## Refinancing Decision Framework

Refinancing is the act of repaying an existing loan with a new loan (usually from a different lender or package).

### When Refinancing Makes Sense

**Situation 1: Rate Drop**
- Current loan rate: 5.5%
- New rate available: 4.8%
- Difference: 0.7% p.a.
- Remaining loan tenure: 20 years

```
Annual interest saving: $600,000 × 0.7% = $4,200/year

Refinancing costs:
  Penalty (1.5% of loan): $9,000
  Legal fees: $2,500
  Total cost: $11,500

Break-even: $11,500 ÷ $4,200/year = 2.7 years

Decision: Refinance if planning to hold for 3+ years.
Savings after break-even: $4,200/year × (remaining tenure − 2.7 years)
```

**Situation 2: Shifting from Fixed to Floating**
- Current loan: Fixed at 5.5% for remaining 10 years
- New floating offer: SORA + 1.6% (current rate 5.1%)
- Difference: 0.4% p.a.

```
Annual interest saving: $600,000 × 0.4% = $2,400/year
Refinancing costs: $11,500
Break-even: $11,500 ÷ $2,400 = 4.8 years

Decision: Refinance if confident SORA will not spike and holding 5+ years.
Risk: If SORA spikes 1% immediately, break-even extends to 9+ years.
```

### Refinancing Decision Rule

```
Net benefit = (Annual interest saving × Remaining tenure in years) − Refinancing costs

If net benefit > $0 and remaining tenure > 2 years: CONSIDER refinancing
If net benefit > $5,000 and remaining tenure > 3 years: RECOMMENDED
If net benefit < $0: DO NOT refinance
```

### When NOT to Refinance

- Remaining tenure < 3 years (too short to recover costs)
- Penalty is very high relative to savings
- Rate difference < 0.5% (too small to justify costs)
- You have a locked-in rate below current market (unlikely to improve)
- You plan to sell within 1–2 years

---

## Monthly Payment Calculation

Standard amortisation formula for monthly mortgage payment:

```
Monthly payment = Principal × [r(1+r)^n] / [(1+r)^n − 1]

Where:
  Principal = Loan amount
  r = Monthly interest rate (annual rate ÷ 12)
  n = Number of payments (tenure in years × 12)
```

### Worked Example: $600,000 Loan at 5.0% for 25 Years

```
Principal = $600,000
Annual rate = 5.0%
Monthly rate (r) = 5.0% ÷ 12 = 0.4167% = 0.004167
Tenure = 25 years
Number of payments (n) = 25 × 12 = 300

Monthly payment = 600,000 × [0.004167(1.004167)^300] / [(1.004167)^300 − 1]
                = 600,000 × [0.004167 × 3.4868] / [2.4868]
                = 600,000 × [0.01453 / 2.4868]
                = 600,000 × 0.005839
                = $3,503
```

**Verification by amortisation schedule (first 3 months):**

| Month | Opening Balance | Interest (5% ÷ 12) | Principal | Closing Balance |
|-------|-----------------|-------------------|-----------|-----------------|
| 1 | $600,000 | $2,500 | $1,003 | $598,997 |
| 2 | $598,997 | $2,496 | $1,007 | $597,990 |
| 3 | $597,990 | $2,491 | $1,012 | $596,978 |

**Key insight:** Early months are heavily interest-loaded. At month 1, 71% is interest ($2,500 interest, $1,003 principal). At month 300, nearly 100% is principal.

### Interest vs Principal Split Over Time

For the $600,000 loan above:

| Year | Total Payment | Interest Portion | Principal Portion | Loan Balance |
|------|---------------|-----------------|------------------|--------------|
| 1 | $42,036 | $29,621 | $12,415 | $587,585 |
| 5 | $42,036 | $27,314 | $14,722 | $553,621 |
| 10 | $42,036 | $23,341 | $18,695 | $489,753 |
| 15 | $42,036 | $17,826 | $24,210 | $399,841 |
| 20 | $42,036 | $10,207 | $31,829 | $271,084 |
| 25 | $42,036 | $1,005 | $41,031 | $0 |

**Total interest paid over 25 years:** $251,084

This demonstrates the importance of early prepayment — every extra dollar paid early eliminates a full 25-year compound interest tail.

---

## Refinancing Lock-In Penalty Calculator

If you want to refinance but are within lock-in, here's the cost:

```
Total refinancing cost = Lock-in penalty + Legal fees − Free value offered

Lock-in penalty = Outstanding loan balance × 1.5% (typical)
Legal fees = $2,000–$3,000
Free value (new bank may offer subsidy, offset, etc.) = −$0 to −$4,000

Net cost = Gross cost − Free value

Example:
  Outstanding balance: $550,000
  Penalty: $550,000 × 1.5% = $8,250
  Legal fee: $2,500
  New bank offer (legal subsidy): −$3,000
  Net cost: $8,250 + $2,500 − $3,000 = $7,750
```

Only refinance if **net savings over remaining tenure exceed net cost** by a comfortable margin (at least $5,000).
