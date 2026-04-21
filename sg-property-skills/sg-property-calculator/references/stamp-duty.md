# Stamp Duty Calculation Reference

## Buyer's Stamp Duty (BSD)

BSD is a progressive tax on the purchase price of the property. It is **non-negotiable and must be paid at completion**.

### BSD Tiered Formula

Apply the following rates to the purchase price, calculating the tax on each tranche:

| Purchase Price Range | Rate | Calculation |
|----------------------|------|-------------|
| $0–$180,000 | 1% | $180,000 × 1% |
| $180,001–$360,000 | 2% | $180,000 × 2% |
| $360,001–$1,000,000 | 3% | $640,000 × 3% |
| $1,000,001–$1,500,000 | 4% | $500,000 × 4% |
| $1,500,001–$3,000,000 | 5% | $1,500,000 × 5% |
| Above $3,000,000 | 6% | Remainder × 6% |

### Worked Example: $2,000,000 Property

```
Purchase price: $2,000,000

Tier 1: $0–$180,000
  Amount: $180,000
  Tax: $180,000 × 1% = $1,800

Tier 2: $180,001–$360,000
  Amount: $180,000
  Tax: $180,000 × 2% = $3,600

Tier 3: $360,001–$1,000,000
  Amount: $640,000
  Tax: $640,000 × 3% = $19,200

Tier 4: $1,000,001–$1,500,000
  Amount: $500,000
  Tax: $500,000 × 4% = $20,000

Tier 5: $1,500,001–$2,000,000
  Amount: $500,000
  Tax: $500,000 × 5% = $25,000

─────────────────────────────
Total BSD: $69,600
Effective BSD rate: 3.48%
```

### BSD on Different Property Types

- **Completed private property (flat, house, shophouse):** Full BSD applies
- **Unfinished flat (under construction):** BSD applies on purchase price
- **HDB property:** No BSD (HDB is subsidised housing)
- **Executive Condominium (EC, first time):** No BSD (first 5 years of ownership; BSD applies if sold within 5-year window)
- **EC (after 5 years):** Full BSD applies as if private property
- **Land:** BSD applies

---

## Additional Buyer's Stamp Duty (ABSD)

ABSD is an **additional layer** on top of BSD, designed to cool property markets and manage citizenship/permanent resident ownership concentration. **Rates as of 2024** (these have changed multiple times; always verify with lawyer).

### ABSD Rates by Citizenship and Property Count

#### Singapore Citizens (SC)

| Property Count | Rate |
|---|---|
| 1st property | 0% |
| 2nd property | 20% |
| 3rd and subsequent | 30% |

#### Singapore Permanent Residents (PR)

| Property Count | Rate |
|---|---|
| 1st property | 5% |
| 2nd property | 30% |
| 3rd and subsequent | 35% |

#### Foreigners (Non-Citizen, Non-PR)

| Property Count | Rate |
|---|---|
| All properties | 60% |

#### Entities and Trusts (Corp Purchase)

- Companies, partnerships, limited liability partnerships: **65%** on all properties
- Trusts: **65%** on all properties
- Exception: licensed housing developers, 35% (but an additional 5% is non-remissible)

### ABSD Remission for Married Couples

A married couple may qualify for **ABSD remission** (exemption) under these conditions:

**Eligibility:**
1. Both purchasers are Singapore Citizens OR one is SC and one is PR
2. Purchasing as a married couple (joint names on title deed)
3. At least one of you is a first-time property buyer
4. The property is intended for owner-occupation

**Effect:**
- ABSD that would ordinarily apply is **forgiven**
- BSD still applies
- Must apply within a specified timeframe after purchase; typically processed via Inland Revenue Authority of Singapore (IRAS)

### Worked Example: ABSD for Second Property (SC Couple)

```
Purchase price: $2,000,000
Citizenship: Singapore Citizens (SC)
Property count: 2nd property

BSD (calculated as above): $69,600

ABSD at 20% (2nd property):
  ABSD = ($2,000,000) × 20% = $400,000

Total stamp duty (BSD + ABSD): $470,600
```

**If couple qualifies for ABSD remission:**
```
Total stamp duty (BSD only): $69,600
Savings from remission: $400,000
```

### ABSD Remission Worked Example

```
Scenario: First-time buyer couple (one SC, one PR) buying $1,500,000 flat

Purchase price: $1,500,000
Citizenship: SC + PR (married)
Property count: 1st property for at least one

BSD (tiered): $34,600
  Tier 1 ($180k): $1,800
  Tier 2 ($180k): $3,600
  Tier 3 ($640k): $19,200
  Tier 4 ($500k): $20,000

ABSD at 5% (PR, 1st property):
  ABSD = $1,500,000 × 5% = $75,000

Total stamp duty (before remission): $109,600

Remission applied: $75,000 (ABSD waived)
Total stamp duty (after remission): $34,600
Effective savings: $75,000
```

---

## Seller's Stamp Duty (SSD) — Private Property

SSD applies to the **seller** and is determined by how long the property has been held. It **does not apply to HDB properties** (HDB has its own resale rules).

### SSD by Holding Period

| Holding Period | Rate |
|---|---|
| Within 1 year of purchase | 12% |
| Within 2 years of purchase | 8% |
| Within 3 years of purchase | 4% |
| 3 years or more | 0% |

### Interpretation

- If you buy on 1 Jan 2024 and sell on 31 Dec 2024 (within 12 months): 12% SSD applies
- If you buy on 1 Jan 2024 and sell on 2 Jan 2026 (24+ months): 8% SSD applies
- If you buy on 1 Jan 2024 and sell on 2 Jan 2027 (36+ months): 0% SSD (no tax)

### SSD Calculation Example

```
Purchase price: $1,500,000
Sale price: $1,650,000 (after 2 years)
Holding period: 2 years → 8% SSD applies

SSD = $1,650,000 × 8% = $132,000
```

**Impact:** The seller nets $1,650,000 − $132,000 = $1,518,000 (before mortgage payoff and agent commission).

### SSD Does Not Apply To

- HDB properties (sold or exchanged after HDB loan tenure, no SSD)
- Properties held 3+ years
- Properties transferred via gift (though gift duty may apply in specific cases)

---

## Total Upfront Cost Calculation

When calculating the true cost of purchase, include all of the following:

### 1. Purchase Price
- Agreed sale price with seller

### 2. Stamp Duties
- **Buyer's Stamp Duty (BSD):** tiered formula on purchase price
- **Additional Buyer's Stamp Duty (ABSD):** depends on citizenship, PR status, property count, and remission eligibility

**Total stamp duty = BSD + ABSD** (before any remission)

### 3. Legal Fees
- Lawyer's conveyancing fees: typically **$2,500–$4,000** depending on property value and complexity
- Can be paid from CPF if property purchase funded partially or fully with CPF
- Covers: preparation of documents, Land Title search, completion arrangements

### 4. Valuation Fee
- Bank-mandated property valuation (for mortgage): typically **$300–$500**
- Can be paid from CPF OA
- Non-refundable (belongs to bank)

### 5. Agent Commission (if applicable)
- **For buyer using buyer's agent:** typically 1% of purchase price (though less common in Singapore; usually seller pays)
- **For seller:** typically 2% of sale price (shared between listing and selling agents)
- **Note:** Agent commission on purchase does NOT apply unless explicitly using a buyer's agent. In Singapore, the seller typically pays the agent.

### 6. Loan Processing and Arrangement Fees
- Bank loan processing fee: **$0–$2,000** (varies by bank; some waive)
- Loan arrangement fee (if refinancing): **0.5–1% of loan amount**
- Can sometimes be paid from CPF or added to loan amount (check with bank)

### 7. Caveat and Land Title Registration
- Caveat registration (lodging of interest): **~$20–50** (minimal)
- Land Registry fees for transfer: included in legal fees typically

### 8. Fire Insurance
- Compulsory fire and perils insurance (required by bank): typically **$100–250/year**
- First year premium usually paid upfront at completion
- Can be paid from CPF OA

### 9. Home Insurance (Optional but Recommended)
- Comprehensive home insurance (optional): **$200–500/year** depending on sum assured
- Covers theft, accidental damage, public liability
- Recommended for first-time buyers

### 10. Loan Lock-in Penalty (If Refinancing Existing Loan)
- If paying off existing mortgage early: penalty typically **1.5% of outstanding balance**
- Legal costs for refinancing: **$1,500–$2,500**
- Only applies if refinancing or selling property with existing loan

### Total Upfront Cost Template

```
Purchase price:                          $2,000,000

Stamp duties:
  Buyer's Stamp Duty (BSD):                $69,600
  ABSD (2nd property, SC, 20%):           $400,000
  Total stamp duty:                       $469,600

Professional fees:
  Legal conveyancing:                       $3,500
  Property valuation:                         $500
  Caveat registration:                         $30
  Subtotal:                                 $4,030

Insurance and loan:
  Fire insurance (1 year):                    $150
  Loan arrangement fee (0.5%):             $9,750
  Subtotal:                                 $9,900

Estimate of total upfront costs:        $483,530
─────────────────────────────────────────────────
Downpayment required (25% cash + CPF):   $500,000
Shortfall for other costs:                $16,470
(This must come from cash buffer or be paid separately)

Effective total cost for purchase:     $2,483,530
```

---

## ABSD Rate Change History and Future Risk

**Important note:** ABSD rates have been adjusted multiple times:
- Introduced in December 2011 (first time)
- Increased in December 2012 (for 2nd and 3rd properties)
- Reformed in January 2018 (removed investor category, restructured)
- Adjusted in 2020, 2022, 2023, 2024

**Best practice:** Always verify current ABSD rates with your lawyer **at the time of purchase** and budget conservatively. If rates have dropped by purchase date, the savings flow to you.

---

## SSD as a Planning Tool for Investors

For investors considering short holding periods:

```
Example: Buy at $1,500,000, expect sale at $1,600,000 after 18 months

Sale price: $1,600,000
SSD at 8% (within 2 years): $128,000
Agent commission (2%): $32,000
Legal costs: $2,000
─────────────────────────────
Total selling costs: $162,000

Net proceeds (before mortgage): $1,600,000 − $162,000 = $1,438,000
Purchase cost (downpayment + costs): ~$450,000
Net profit: $1,438,000 − $1,500,000 + $150,000 = $88,000 (approx)
Return on cash deployed: ~19.6%

Assessment: Short-hold does not pay after SSD and selling costs.
Holding 3+ years (zero SSD) is significantly more profitable.
```

---

## Stamp Duty Not Deductible for Tax Purposes

A critical point for investors: stamp duties (BSD, ABSD, SSD) **cannot be deducted against rental income** for income tax purposes. They are capital expenses and are only recovered when the property is sold.
