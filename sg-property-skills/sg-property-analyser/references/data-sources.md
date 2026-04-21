# Data Sources for Singapore Property Analysis

Comprehensive property analysis requires multiple data sources. Each source has specific strengths, limitations, and costs.

---

## URA REALIS (Real Estate Information System)

**What it is:** Official transaction database run by Urban Redevelopment Authority. Records every property transaction in Singapore.

**Best for:** Definitive transaction history, price verification, project-level volume, comprehensive caveats data.

**Free tier:** Limited free access (project summary data, estate trends)

**Paid tier:** Full REALIS subscription (~$600-1,200/year per user) unlocks:
- Complete transaction history by project, unit type, floor level
- Caveat data (transactions in progress)
- Price indices by district/segment
- Project-level volume analytics

**How to access:**
- Visit URA portal (ura.gov.sg)
- Subscribe for professional or academic access
- Log in to query databases

**Key strengths:**
- Authoritative data (source of truth)
- Granular detail (can filter by unit type, floor level, tenure)
- Complete coverage (no property escapes REALIS)
- Historical depth (10+ years available)

**Limitations:**
- Expensive (subscription model; not accessible to casual users)
- Data lag (transactions recorded after completion; caveat data shows pending sales)
- Requires skill to interpret (raw data format; needs analysis)
- Complex UI (steep learning curve for new users)

**Usage example:**
- Query: "All 3BR resale transactions in Novena planning area, past 12 months"
- Result: 45 transactions showing price, unit location, floor level, date
- Analysis: Calculate PSF average, identify outliers, benchmark your target unit

---

## URA Space and Master Plan

**What it is:** Official urban planning data. Shows zoning, plot ratios, development guide plans, transformation areas.

**Best for:** Understanding area potential, identifying future supply pipeline, zoning implications.

**Cost:** Free

**How to access:**
- Visit URA Space online (data.ura.gov.sg)
- Download Master Plan maps and DGP (Development Guide Plans) for your planning area
- Also accessible via interactive maps on URA website

**Key data available:**
- Master Plan zoning (residential, commercial, industrial, parks, white sites)
- Plot ratios and development density allowances
- Transformation area delineations
- Future development sites (white sites)
- Conservation area boundaries
- Traffic corridors, utility reserves

**Key strengths:**
- Authoritative planning data
- Free access
- Forward-looking (shows planned development zones)
- Detailed down to individual plots

**Limitations:**
- Static snapshots (updated every 5 years; between updates, data can lag reality)
- Requires interpretation skill (zoning symbols, plot ratios not self-evident)
- Doesn't show phasing timelines (a white site on DGP may develop in 2025 or 2035)
- Doesn't guarantee development (zoning permits development; doesn't mandate it)

**Usage example:**
- Query: "What's zoned in front of my target unit?"
- Check: DGP for your precinct. Frontage shows low-rise shop/industrial → likely to be rezoned and redeveloped in future
- Implication: Don't pay "open view" premium for unit facing future development

---

## data.gov.sg

**What it is:** Singapore government open data portal. Includes HDB and public housing statistics.

**Best for:** HDB resale transaction data, public housing statistics, supply pipeline for BTO projects.

**Cost:** Free

**How to access:**
- Visit data.gov.sg
- Search for "HDB resale" or "public housing"
- Download datasets (CSV, JSON formats)

**Key data available:**
- HDB resale transaction history (address, price, unit type, transaction date)
- BTO launch schedules and unit counts
- HDB grant information
- Public housing stock statistics

**Key strengths:**
- Free and open
- Reliable government data
- BTO pipeline transparency
- Long historical record (20+ years)

**Limitations:**
- HDB-only (no private condo data)
- Limited detail (address and price; less granular than REALIS)
- Bulk data format (requires Excel/Python to analyse; not user-friendly)
- Lag (updates quarterly)

**Usage example:**
- Query: "HDB resale prices in Tengah planning area, 2024"
- Result: 200+ transactions showing HDB type, price, date
- Analysis: Track HDB price trends as proxy for area demand; compare to private prices

---

## 99.co

**What it is:** Property portal aggregating listings from agents and developers. Includes active listings, transacted properties, rental data.

**Best for:** Current listing data, recent transaction history, area guides, rental comparisons.

**Free tier:**
- Browse current listings
- Search by district/price
- Area guides (articles on neighbourhoods)
- Limited past transaction history (6-12 months)

**Paid tier:** Premium membership (~$50-150/year)
- Extended transaction history (3-5 years)
- Advanced search filters
- Valuation estimates
- Rental analytics

**How to access:**
- Visit 99.co Singapore
- Browse or register for free tier
- Upgrade to premium for advanced features

**Key data available:**
- Current listings (condo, HDB, landed) with photos, floor plans, agent details
- Completed transaction data (price, date, unit location)
- Rental listings and historical rents
- Area profiles (demographics, amenities, schools)
- Valuation estimates (AI-powered, should be taken as rough guide only)

**Key strengths:**
- Easy to use (consumer-friendly interface)
- Visual data (photos, floor plans, 3D tours)
- Transacted prices (shows what actually sold, not just asking prices)
- Comprehensive coverage

**Limitations:**
- Data crowdiness (many agents list; variable accuracy of descriptions)
- Valuation estimates are algorithmic (not always reliable; meant as ballpark)
- Limited REALIS integration (not official transactions, sometimes misses old deals)
- Agent bias (some agents exaggerate features to attract interest)

**Usage example:**
- Search: "3BR condos in Novena, $1.5M-$2M range"
- Review: Listing photos, floor plans, agent contact
- Cross-reference: Completed transactions to see what comparable units sold for
- Validate: Use REALIS to verify prices if available

---

## PropertyGuru

**What it is:** Major property portal. Listings, market reports, transacted data, new launch info.

**Best for:** New launch information, market reports, transaction data, comprehensive property search.

**Free tier:**
- Browse listings
- Search by area/price
- Market reports (published articles)
- Limited transacted property data

**Paid tier:** Premium access (~$50-200+/year depending on features)
- Extended transaction history
- Advanced analytics
- Developer dashboards
- Investment tools

**How to access:**
- Visit propertyguru.com.sg
- Register for account
- Browse free tier or subscribe for premium

**Key data available:**
- Current listings across property types
- New launch announcements and details (floor plans, prices, developer info)
- Market reports (price trends, supply/demand analysis)
- Transaction data (completed sales by project)
- Valuation tools (estimate prices)
- Rent trends

**Key strengths:**
- Excellent new launch coverage (announcements, pricing, phases)
- Detailed market reports (analyst-written, data-driven)
- Clean interface (easier navigation than some competitors)
- Comprehensive listings (good coverage of market)

**Limitations:**
- Paid features somewhat expensive for casual users
- Valuation tools are estimate-based (should not be gospel)
- Some reports are behind paywall
- Transaction data can lag by months

**Usage example:**
- Search: "New launches in Jurong, 2025-2026"
- Review: Details on each project, pricing, phases, timeline
- Read: Market report on Jurong region trends
- Cross-check: Transacted prices from previous launches in area

---

## EdgeProp

**What it is:** Property analytics and research platform. Focused on investment metrics, profitability analysis, gain/loss tracking.

**Best for:** Investment analysis, profitability tracking, capital gains analysis, developer sales data.

**Paid model:** Subscription-based. Premium tier required for most advanced features.

**How to access:**
- Visit EdgeProp.sg
- Free access to basic articles and data
- Premium subscription for full analytics

**Key data available:**
- Profit/loss analysis (how much did property owners gain/lose, by project)
- Developer transaction data
- Volume and price trends by project
- Capital appreciation analysis
- Investment metrics (ROI, rental yield potential)

**Key strengths:**
- Investment-focused (directly addresses investor concerns)
- Profit/loss transparency (shows real gains/losses by cohort)
- Developer sales data (how many units sold per launch)
- Detailed analytics (not just raw data; interpreted insights)

**Limitations:**
- Expensive (subscription model; price varies by access tier)
- Data sometimes lags
- Some analyses are EdgeProp opinion (not pure data)
- Small user base (less community-driven than 99.co/PropertyGuru)

**Usage example:**
- Query: "Profitability of 2015 purchases in Novena"
- Result: Average gain/loss for cohort of Novena buyers (e.g., "Median +18% total return over 8 years")
- Analysis: Informs expected appreciation trajectory for new purchases

---

## SRX (formerly StreetSine)

**What it is:** Professional property data platform. X-Value (automated valuations), indices, rental analytics.

**Best for:** Automated valuations (sanity checks), price indices, rental data, professional-grade analytics.

**Paid model:** SRX membership or X-Value subscription.

**How to access:**
- Visit SRX.com.sg
- Register for SRX membership or X-Value subscription
- Some data accessible free; premium features require fee

**Key data available:**
- X-Value automated valuation (AI-estimated property values by address)
- Price indices by district and property type
- Rental analytics (rental yields, market rents)
- Transaction volumes
- Price trends

**Key strengths:**
- Professional-grade tool (used by real estate professionals)
- X-Value is sophisticated (uses machine learning; generally accurate)
- Rental analytics are comprehensive
- Indices are reliable

**Limitations:**
- X-Value is estimate only (should validate with real transaction data)
- Somewhat expensive
- Learning curve for new users
- Less consumer-friendly than 99.co/PropertyGuru

**Usage example:**
- Use X-Value to estimate fair value of a property by address
- Compare: X-Value estimate to asking price (if asking price is 15% above X-Value, likely overpriced)
- Cross-reference: With REALIS or PropertyGuru transacted prices to validate

---

## Stacked Homes

**What it is:** Editorial platform. Property guides, project reviews, data-driven articles, analysis.

**Best for:** Project-level deep dives, neighbourhood guides, educational content, comparative analysis.

**Cost:** Free (article-based; monetised via affiliate links and advertising)

**How to access:**
- Visit stackedhomes.com
- Browse articles by category (projects, neighbourhoods, analysis)
- No paywall; all content accessible

**Key content available:**
- Project reviews (comprehensive analysis of specific condos/developments)
- Neighbourhood guides (districts, amenities, transport, price trends)
- Data-driven analysis articles (e.g., "Is this district expensive?" with supporting data)
- Comparison articles (project A vs B vs C)
- Historical case studies

**Key strengths:**
- High-quality editorial (thoughtful, data-backed analysis)
- Accessible (free, consumer-friendly writing)
- Practical focus (addresses actual buyer/investor concerns)
- Comprehensive project coverage

**Limitations:**
- Not a data platform (articles, not raw data; editorial can have bias)
- Less deep than REALIS for specific transactions
- Updated periodically (not real-time)
- Limited to published articles (can't query specific projects outside coverage)

**Usage example:**
- Search: "Novena Condo A review"
- Read: Project strengths, weaknesses, location analysis, price trends, rental potential
- Extract: Key data points (maintenance fees, transaction volume, developer reputation)
- Validate: Against REALIS and other sources before deciding

---

## RealSmart.sg

**What it is:** Property investment analytics platform. Focused on tracking property performance, investment metrics, estate analysis.

**Best for:** Investment tracking, ROI analysis, neighbourhood performance, portfolio management.

**Paid model:** Subscription-based. Free tier with limited features.

**How to access:**
- Visit realsmart.sg
- Register for account
- Access free tier or subscribe for premium analytics

**Key data available:**
- Property valuation tracking (record purchase price, track current value)
- ROI and rental yield calculations
- Profit/loss tracking
- Estate performance metrics (how is your district performing vs market)
- Neighbourhood analytics

**Key strengths:**
- Investment-focused (addresses investor portfolio needs)
- Tracking and dashboards (manage multiple properties)
- Performance comparisons (how does your property perform vs similar properties)
- Accessible UI

**Limitations:**
- Relies on user input (data quality depends on how accurately owners input data)
- Valuation estimates are proprietary (should cross-check with REALIS/SRX)
- Smaller platform (less data density than major portals)

**Usage example:**
- Input: Purchase price and date of your property
- Dashboard: Shows estimated current value, assumed ROI, rental yield potential
- Compare: Your neighbourhood performance vs Singapore average
- Track: Monitor property appreciation over time

---

## HDB InfoWEB

**What it is:** Official HDB information portal. BTO launches, resale info, grants, eligibility, procedures.

**Best for:** HDB-specific information, BTO launch announcements, grant eligibility, resale procedures.

**Cost:** Free

**How to access:**
- Visit HDB's official website (hdb.gov.sg)
- Browse InfoWEB section for launches, transactions, grants
- Can request HDB statistics and reports

**Key data available:**
- BTO launch announcements and details (unit counts, planning areas, target TOP, balloting details)
- HDB resale transaction procedures
- Grant eligibility and amounts
- HDB statistics (stock, supply pipeline)
- Eligibility checks for various schemes

**Key strengths:**
- Official source (no ambiguity on HDB rules/eligibility)
- BTO transparency (knows exact units launching and timelines)
- Direct information (no intermediary bias)

**Limitations:**
- Limited to HDB (no private condo data)
- Not designed for price analysis (focuses on logistics, not valuation)
- Lag (launches announced in batches; not real-time market)

**Usage example:**
- Check: HDB BTO launch schedule for next 12 months
- Identify: Upcoming supply in your target planning area
- Assess: How many units launching in next 2 years (supply pressure analysis)
- Evaluate: Whether this supply impacts your private property purchase decision

---

## OneMap (SLA)

**What it is:** National mapping and geospatial information portal. Interactive map with facility query tools.

**Best for:** School proximity checking, amenity location mapping, distance calculations, neighbourhood geography.

**Cost:** Free

**How to access:**
- Visit onemap.gov.sg
- Enter property address or coordinates
- Use tools to query nearby facilities

**Key tools:**
- Facility search (schools, clinics, hawkers, parks, MRT stations, etc.)
- Distance calculator (measure distance from property to specific location)
- Layers (view schools, medical, transport, planning areas)
- Draw tools (create circles/polygons for distance bands)

**Key strengths:**
- Authoritative (government mapping data)
- Free and easy to use
- Comprehensive facility database
- Accurate distance/proximity information

**Limitations:**
- Facility database can have outdated information (check against Google Maps for verification)
- No property transaction or price data
- Limited to Singapore geography (can't extend queries beyond SG borders)

**Usage example:**
- Search: "Nanyang Primary School"
- Draw: 1km radius circle from school
- Query: "How many residential units fall within this circle?"
- Assess: School proximity benefit for neighbourhood analysis

---

## MAS (Monetary Authority of Singapore)

**What it is:** Central bank of Singapore. Financial regulations, interest rates, lending standards.

**Best for:** Understanding mortgage regulations (TDSR, LTV), interest rate environments, financing constraints.

**Cost:** Free (public information)

**How to access:**
- Visit MAS website (mas.gov.sg)
- Browse regulatory guidelines, financial statistics
- Reference lending requirements and restrictions

**Key data available:**
- TDSR (Total Debt Service Ratio) rules and limits
- LTV (Loan-to-Value) requirements by property type
- Interest rate data (base rates, mortgage rates)
- Banking statistics
- Consumer credit guidelines

**Key strengths:**
- Authoritative (regulatory source)
- Up-to-date (reflects current lending environment)
- Comprehensive (all lending rules compiled)

**Limitations:**
- Technical language (regulatory documents, not consumer-friendly)
- Doesn't include individual bank rates (each bank sets own spread)
- Doesn't predict future rate movements

**Usage example:**
- Reference: Current TDSR = 60% for owner-occupants
- Calculate: Max mortgage capacity for household with $12k income
- Understand: Why certain properties are or aren't financeable given loan-to-value restrictions
- Plan: Down payment and financing strategy around these constraints

---

## Squarefoot Research

**What it is:** Property research boutique. Regional analysis, price indices, supply/demand reports.

**Best for:** High-level trend analysis, regional price indices, supply pipeline overviews.

**Cost:** Mix of free (articles) and paid (detailed reports)

**How to access:**
- Visit Squarefoot website
- Browse free articles and indices
- Subscribe or purchase detailed research reports

**Key data available:**
- Regional price indices (CCR, RCR, OCR breakdown)
- Quarterly price trend reports
- Supply pipeline analysis
- Rental market analysis
- Developer market share data

**Key strengths:**
- Quality research (seasoned analysts)
- Broad regional view (useful for macro understanding)
- Readable format (not raw data; explained insights)

**Limitations:**
- Limited free content (most detailed reports are paid)
- Limited project-level detail (focuses on regional trends, not individual condos)
- Expensive for detailed reports

**Usage example:**
- Read: "OCR Price Index Q4 2025" report (free summary)
- Understand: Broad OCR appreciation trends
- Benchmark: Where is Jurong/Punggol positioned relative to rest of OCR
- Inform: Area selection decision

---

## Accessing the Stack: Recommended Approach

For different user profiles, here's a recommended data access stack:

**Casual homebuyer (budget-conscious):**
1. 99.co (free tier) — browse listings, recent transactions
2. OneMap — check schools, amenities, distance
3. Google Maps — neighbourhood feel, street view
4. Stacked Homes articles — read project/neighbourhood analysis
5. HDB InfoWEB — if considering HDB

Cost: Free

**Serious homebuyer/upgrader:**
1. 99.co (premium tier) — extended transaction history
2. PropertyGuru (free tier, or premium for new launches)
3. SRX X-Value — sanity-check valuations
4. OneMap — comprehensive amenity/school mapping
5. Stacked Homes — project deep dives
6. REALIS (if willing to invest $600/year) — definitive transaction data

Cost: $500-1,200/year for all sources

**Property investor:**
1. REALIS (subscription) — core data source for transaction history, volume, trends
2. EdgeProp (premium) — profitability analysis, ROI tracking
3. RealSmart (premium) — portfolio tracking, performance metrics
4. SRX (subscription) — X-Value, indices, validation
5. PropertyGuru/99.co — current market monitoring
6. Stacked Homes — market intelligence, comparisons

Cost: $2,000-4,000/year for professional-grade stack

