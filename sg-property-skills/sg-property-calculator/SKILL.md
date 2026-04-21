---
name: sg-property-calculator
description: Singapore property financial modelling — affordability checks, TDSR/MSR calculations, mortgage comparison, cash flow projections, stamp duty computation, CPF usage planning, and scenario analysis. Use this skill when anyone needs to crunch numbers for a Singapore property purchase, compare loan packages, stress-test affordability, calculate stamp duties (BSD/ABSD), model holding costs, project cash flow, or run what-if scenarios on property transactions. Also triggers on questions about how much someone can borrow, whether they can afford a property, or comparing financial outcomes of different options.
---

## Purpose

This skill handles the quantitative side of Singapore property decisions. Every framework produces actual numbers — not just principles, but calculations you can use to make decisions.

## Core Calculation Modules

### 1. Affordability Assessment
→ `references/affordability-framework.md`

Determines maximum loan quantum, downpayment requirements, and stress-tested affordability. Calculates TDSR (55% threshold) and MSR (30% for HDB/EC), derives maximum loan and property price, accounts for CPF usage and the non-negotiable "sleep well at night" liquid buffer.

### 2. Stamp Duty Calculator
→ `references/stamp-duty.md`

Computes Buyer's Stamp Duty (BSD) using tiered formula, Additional Buyer's Stamp Duty (ABSD) by citizenship and property count, Seller's Stamp Duty (SSD) by holding period, and total upfront costs including legal, valuation, and agent fees.

### 3. Mortgage Comparison
→ `references/mortgage-models.md`

Analyzes fixed vs floating rate loans, calculates total interest cost over planned holding period, identifies break-even SORA rates, assesses lock-in penalties, and builds refinancing decision framework.

### 4. Cash Flow Projection
→ `references/cashflow-framework.md`

Models monthly and annual cash flow including mortgage, conservancy, property tax, insurance, and rental income (if applicable). Shows CPF vs cash optimisation and calculates net holding cost.

### 5. Scenario Modeller
Integrated into analysis approach. Builds hold vs sell timing analysis, appreciation scenarios (base/bull/bear), dual-property scenarios, and upgrade pathway financial comparisons.

## Calculation Principles

- **Conservative base case:** Always use conservative assumptions initially
- **Stress testing required:** Recalculate at rates +1% and +2%, income -10% and -20%, worst case is +2% rate with -20% income
- **All costs included:** Mortgage, maintenance, property tax, insurance, agent fees, legal, renovation
- **Total cost of ownership:** Show both monthly cash flow AND lifetime cost impact
- **Sleep well at night buffer:** After all obligations, household must retain minimum 6 months expenses (12 months for single-income) in liquid reserves — this is non-negotiable affordability
- **CPF accrued interest:** 2.5% p.a. compounded on all CPF used; must be refunded upon sale

## Output Standards

When producing calculations:
- Show all assumptions clearly (rates, income, tenure, CPF amounts)
- Present base case, stress case (rate +2%, income -20%), and best case
- Use tables for side-by-side comparisons
- State clearly what is included and excluded
- For affordability: give "maximum comfortable purchase price" accounting for buffer, not just theoretical TDSR maximum
- Worked examples with real numbers, not just formulas

## Scripts

Reference `scripts/` directory for executable modules:
- `affordability_calc.py` — run affordability analysis with stress testing
- `mortgage_compare.py` — compare mortgage packages and total interest cost
- `scenario_modeller.py` — build multi-scenario analysis (hold/sell/upgrade)
- `cashflow_projection.py` — monthly and annual cash flow projection
- `stamp_duty_calc.py` — BSD and ABSD calculator with upfront cost breakdown
