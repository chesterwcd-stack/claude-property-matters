# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Singapore Property Consultation System** — a multi-phase tool that guides clients through property purchase decisions by combining financial modeling, market analysis, and strategic consulting. The system integrates spreadsheet data, real-time property listings, and a React dashboard powered by a JavaScript calculation engine.

## Architecture

### Core Components

1. **Calculation Engine** (`sg-property-engine.js`)
   - Single-source-of-truth for all financial calculations
   - Exports functions and defaults consumed by dashboard and reports
   - Every formula must match the Excel templates (`Prop_Calculator_v2`, `SG_Investment_Property_Analyser_v2`)
   - Handles: stamp duty (BSD/ABSD/SSD), mortgage calculations, TDSR/MSR validation, CPF planning, cash flow projections, IRR/NPV analysis
   - **Critical constraint**: Calculations are validated against Excel models — changes must be tested against source templates

2. **React Dashboard** (`SG_Property_Consultation_Dashboard.jsx`)
   - Client intake form and consultation interface
   - Project database with 8 investment properties (hardcoded with detailed theses)
   - Real-time scenario modeling using inline calculation logic
   - Outputs client profiles and consultation data

3. **Knowledge Base** (`sg-property-skills/`)
   - Four specialized domains:
     - `sg-property-calculator/`: Financial frameworks, affordability, mortgage models, stamp duty, cash flow
     - `sg-property-analyser/`: Market analysis, area research, project unit analysis, data sources
     - `sg-property-advisor/`: Buyer profiles, transaction playbook, regulations, property types
     - `sg-retirement-property/`: Retirement timelines, exit strategies, asset growth, portfolio balance
   - Each domain has a `SKILL.md` (overview) and `references/` subdirectory (detailed guides)
   - Designed to be queried as expertise domains by Claude

4. **Data Scraper** (`SheetB_PropertyGuru_Scraper.py`)
   - Pulls live PropertyGuru listings filtered by district, price, property type, TOP year
   - Outputs to Excel (ready-to-paste into Sheet B) and JSON (for dashboard loading)
   - Parameters at top of file: adjust `SEARCH_PARAMS` before each run

5. **Data Schema** (`client_schema.json`)
   - Data contract for all client profiles, property data, and calculations
   - Defines every field: type, source (client/advisor/derived), example values
   - Client fields: identity, income, commitments, current property, funds, affordability, goals, preferences

### Data Flow

```
Client Intake (Sheet A) 
  ↓
Affordability Check (Engine: TDSR/MSR/CPF validation)
  ↓
Project Shortlisting (Dashboard: cross-reference affordability vs project budgets)
  ↓
Scenario Modeling (Dashboard: hold/sell timing, appreciation scenarios, upgrade paths)
  ↓
Report Generation (Phase 6/7: client recommendations + financial projections)
```

## Planning & Execution Strategy

### Model Selection

**Planning Phase** — Use Sonnet or Opus depending on task scope:
- **Sonnet (claude-sonnet-4-6)**: Medium-complexity planning tasks
  - Single-component changes (e.g., update one calculation function)
  - Straightforward feature additions (e.g., add a property to the database)
  - Localized bug fixes with clear scope
- **Opus (claude-opus-4-7)**: Complex planning tasks
  - Multi-component architectural changes (e.g., refactor calculation engine + dashboard sync)
  - Integration challenges (e.g., connecting new scraper output to dashboard)
  - Tasks requiring deep trade-off analysis across multiple subsystems
  - When in doubt, ask the user for guidance on complexity level

**Execution Phase** — Use Haiku or Sonnet depending on task complexity:
- **Haiku (claude-haiku-4-5)**: Straightforward execution
  - Executing clear, scoped tasks from a plan
  - Simple file edits and command runs
  - Well-defined calculations or UI tweaks
- **Sonnet (claude-sonnet-4-6)**: Complex execution
  - Multi-step refactors requiring careful code reasoning
  - Debugging unforeseen issues during implementation
  - Tasks requiring iteration or cross-file impact analysis

**Context Window Management**:
- Compact the conversation before executing a plan to free up context
- When context approaches **70% capacity**: pause work, save progress, compact the conversation via /gsd-pause-work or manual summary, then resume with a fresh window
- This keeps the system responsive and preserves token budget for the actual work
- Document checkpoint progress in a brief summary before compacting

### Workflow

1. **Plan Phase**: Use Sonnet/Opus to design the approach, ask clarifying questions if needed
2. **Compact**: Summarize the plan and agreed approach in 2–3 bullet points
3. **Execute**: Switch to Haiku/Sonnet and work through the plan step-by-step
4. **Monitor Context**: If approaching 70%, pause → save → compact → resume fresh
5. **Verify**: After execution, test against requirements and critical constraints

## Development Commands

### Scraper (Python)
```bash
# Install dependencies once
pip install requests beautifulsoup4 openpyxl

# Run scraper to refresh Sheet B data
python SheetB_PropertyGuru_Scraper.py
# Outputs: SheetB_Scraped_Results.xlsx and .json
```

**Before each run**: Edit `SEARCH_PARAMS` in the script (districts, budget, bedrooms, tenure, TOP year filters). Results are appended/updated in Sheet B for advisor review.

### Dashboard (React)
```bash
# No build process currently — component is standalone JSX
# To integrate: copy SG_Property_Consultation_Dashboard.jsx into React app
# Requires: sg-property-engine.js in same directory or imported via module
```

### Engine (JavaScript)
The calculation engine is plain JavaScript with no external dependencies. Import it:
```javascript
import { DEFAULTS, calcBSD, calcABSD, calcPMT, calcTDSR, solveIRR } from './sg-property-engine.js';
```

## Critical Calculation Rules

### Affordability (TDSR/MSR)
- **TDSR** (Total Debt Service Ratio): Max 55% of gross income for private properties
- **MSR** (Mortgage Service Ratio): Max 30% for HDB/EC
- Always stress-test at +2% rate and -20% income
- Client must retain 6–12 months liquid buffer after all obligations (non-negotiable)
- CPF accrued interest (2.5% p.a.) must be refunded on sale

### Stamp Duty
- **BSD** (Buyer's Stamp Duty): Tiered on property price (1% / 2% / 3% / 4% / 5% / 6%)
- **ABSD** (Additional Buyer's Stamp Duty): Varies by residency (SC / PR / Foreigner) and property count
  - SCs: 0% (1st), 20% (2nd), 35% (3rd+)
  - PRs: 5% (1st), 30% (2nd), 35% (3rd+)
  - Foreigners: 60% (all)
- **SSD** (Seller's Stamp Duty): Decreases by holding period (varies)
- All included in total acquisition/exit costs

### CPF & Age Brackets
- CPF contribution rates and OA/MA ratios are age-bracket dependent
- Ranges: ≤35, 36–45, 46–50, 51–55, 56–60, 61–65, 66–70
- Maps to in `DEFAULTS.cpfRates` — matches MAS/CPF Board rates

### Loan Calculations
- Monthly payment (PMT): Standard amortization formula (principal, rate, tenure)
- Remaining loan after N years: Derived from amortization schedule
- Break-even refinancing rate: Compare cumulative interest cost at different rates
- Default assumption: 30-year tenure, 1.5% mortgage rate (3yr fixed), 4% MAS stress-test rate

### Property Appreciation
- Three scenarios: bear (2%), base (4%), bull (6%) CAGR
- Exit value = purchase price × (1 + CAGR)^years
- Net proceeds = exit value − sale costs (2% agent commission) − remaining loan

## Key File Locations & Updates

| Phase | File | Owner | Contents |
|-------|------|-------|----------|
| 1 | `Phase1_Client_Intake_Template.xlsx` | Advisor | Intake form template |
| 3 | `Phase3_Project_Database_Master.xlsx` | Advisor | All candidate projects (manual entry) |
| Sheet A | `SheetA_Client_Intake.xlsx` | Client | Completed intake form |
| Sheet A | `SheetA_Master_Tracker.xlsx` | Advisor | Client pipeline (meta fields) |
| Sheet B | `SheetB_Scraped_Results.xlsx` | Scraper | Live listings (refresh with Python) |
| 6/7 | `Phase6_Client_Report_Template.xlsx` / `.pdf` | Engine | Report template & sample output |
| - | `client_schema.json` | Data contract | Defines all fields and types |
| - | `sg-property-engine.js` | Core logic | Financial calculations |
| - | `SG_Property_Consultation_Dashboard.jsx` | UI/UX | React dashboard (standalone JSX) |
| - | `SheetB_PropertyGuru_Scraper.py` | Data | Web scraper for PropertyGuru |

## Common Modifications

### Add a New Property to the Database
1. Open `SG_Property_Consultation_Dashboard.jsx`
2. Locate the `PROJECTS` array (around line 58–80+)
3. Add a new entry with: id, name, priority, district, area, type, beds, sqft, budget range, PSF, expected rent, tenure, MRT access, age/TOP, CAGR assumptions, thesis, catalysts, risks, target unit
4. Dashboard will immediately reflect the new option in project lists

### Update Financial Defaults (e.g., mortgage rates, CPF brackets)
1. Edit `DEFAULTS` object in `sg-property-engine.js` (lines 16–67)
2. Update React dashboard's inline `DEFAULTS` (lines 7–24 in `.jsx`) to match
3. **Test against Excel templates** to ensure consistency
4. Re-run any existing client calculations to see impact

### Update Stamp Duty or Tax Rules
1. Modify `calcBSD()`, `calcABSD()`, or `calcSSD()` in `sg-property-engine.js`
2. Update corresponding inline functions in React dashboard if used
3. Verify against IRAS/HDB official schedules (as of date)
4. Test with sample transactions

### Refresh Property Listings (Sheet B)
1. Edit `SEARCH_PARAMS` in `SheetB_PropertyGuru_Scraper.py` (districts, budget, bedrooms, tenure, TOP year filters)
2. Run: `python SheetB_PropertyGuru_Scraper.py`
3. Review output in console and `SheetB_Scraped_Results.xlsx`
4. Cross-check prices against live PropertyGuru listings
5. Paste results into `Phase3_Project_Database_Master.xlsx` for advisor evaluation

## Important Constraints

- **Excel alignment**: All calculations in `sg-property-engine.js` must match Excel template formulas exactly
- **CPF complexity**: Age bracket is mandatory input; affects contribution rate, OA ratio, monthly inflow, and refund liability
- **TDSR validation**: Non-negotiable gating check for affordability; stress-test is mandatory
- **Rental assumption**: Default occupancy 90%, collection ratio 85%, annual rental growth 2%
- **Acquisition costs**: BSD, ABSD, legal fees (~3,800), valuation, reno/furnishing (if investment), agent commission on exit (1%)
- **PropertyGuru scraper**: Falls back to template if blocking detected; always verify scraped prices against live listings
- **Client data consistency**: All intake fields must map to `client_schema.json` — no field can be added without schema update

## Testing Recommendations

1. **Manual affordability test**: Create a sample client profile (mock income, CPF, commitments), run TDSR check, verify stress-test (rate +2%, income −20%) is tighter than base
2. **Stamp duty regression**: Test BSD brackets at key thresholds ($180K, $360K, $1M, $1.5M, $3M) against IRAS calculator
3. **Dashboard scenario**: Load an actual intake client, run project shortlisting, toggle appreciation scenarios, verify cash flow changes propagate
4. **Scraper validation**: Run scraper on a small district (e.g., D19 only), manually spot-check 3–5 listings against PropertyGuru

## Resources

- **MAS/HDB Rules**: TDSR (55%), MSR (30%), max age 65 at mortgage end
- **CPF**: Contribution rates by age, OA balances, refund liability post-sale
- **Stamp Duty**: IRAS official schedules (update as rates change)
- **Regulations**: Refer to `sg-property-skills/sg-property-advisor/references/regulations.md`
- **Market Data**: Refer to `sg-property-skills/sg-property-analyser/references/` for district/area context
