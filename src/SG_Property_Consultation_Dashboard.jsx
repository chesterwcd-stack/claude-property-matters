import { useState, useMemo, useEffect } from "react";
import { DEFAULTS, calcBSD, calcABSD, calcMonthlyMortgage, calcRemainingLoan, solveIRR, fmt, calcSSD, calcCPFTotalRefund, calcNetProceeds, calcHoldPeriodSweep, calcRequiredExitPrice, calcExitPrice, calcExitEquity, deriveProjectMetrics, computeBadges, computeMoatScores } from "./sg-property-engine";

// ════════════════════════════════════════════════════════════
// PROJECT DATABASE (from Phase 3 master)
// ════════════════════════════════════════════════════════════

const PROJECTS = [
  { id:1, name:"Rivercove Residences", priority:"PRIMARY", district:"D19", area:"Sengkang", type:"Post-MOP EC", beds:"3BR/2BA", sqft:"904-958", budgetMin:1350000, budgetMax:1430000, psfAvg:1615, rent:3800, tenure:"99yr", mrt:"Tongkang LRT → Sengkang NEL", age:"~6yr (TOP 2020)", bearCAGR:0.02, baseCAGR:0.04, bullCAGR:0.06, tag:"Capital Gain Play", annualTransactions:85, schoolTier:3, districtIncomeTier:4, unitCount:620, landSizeHa:4.2, exitAudienceRating:4, nearMillionHDB:true, hdbTownMopOver1k:true, rentalDemandRating:4,
    thesis:"Freshly MOP'd Oct 2025. EC-to-private price gap fully intact. Waterfront on Punggol Reservoir. Hundred Palms trajectory is the template.",
    catalysts:["EC price discovery phase","Waterfront reservoir facing","PDD adjacency","School cluster"], risks:["LRT dependency (not direct MRT)","D19 supply pipeline","3.0% yield = higher carry"], targetUnit:"Mid-floor 5F-10F, reservoir/greenery facing, 3BR Type A 904 sqft. Max $1,580 psf." },
  { id:2, name:"The Antares", priority:"PRIMARY", district:"D14", area:"Mattar", type:"Private Resale", beds:"2BR/2BA", sqft:"657-732", budgetMin:1350000, budgetMax:1400000, psfAvg:2067, rent:4200, tenure:"99yr", mrt:"Mattar DTL (1 min sheltered)", age:"~4yr (TOP 2022)", bearCAGR:0.015, baseCAGR:0.035, bullCAGR:0.05, tag:"Yield & Carry Minimiser", annualTransactions:142, schoolTier:1, districtIncomeTier:5, unitCount:380, landSizeHa:2.1, exitAudienceRating:5, nearMillionHDB:true, hdbTownMopOver1k:false, rentalDemandRating:5,
    thesis:"Highest yield on shortlist. Sheltered 1-min walk to Mattar MRT DTL. Three macro catalysts converge: Bidadari, Paya Lebar, Geylang rezoning.",
    catalysts:["Mattar MRT DTL direct","Paya Lebar Regional Centre","Bidadari transformation","Geylang rezoning"], risks:["Small unit 657 sqft","Story partially priced at $2,067 psf","Limited capital gain vs EC"], targetUnit:"657 sqft 2BR mid-high floor, quiet-facing. ~$1.35-1.38M." },
  { id:3, name:"ECO at Bedok", priority:"SECONDARY", district:"D16", area:"Bedok South", type:"Private Resale", beds:"2BR/2BA", sqft:"700-850", budgetMin:1080000, budgetMax:1340000, psfAvg:1549, rent:3900, tenure:"99yr", mrt:"Tanah Merah EWL + Bedok South TEL", age:"~13yr (TOP 2013)", bearCAGR:0.02, baseCAGR:0.038, bullCAGR:0.05, tag:"Yield + TEL Catalyst", annualTransactions:95, schoolTier:2, districtIncomeTier:3, unitCount:450, landSizeHa:3.5, exitAudienceRating:4, nearMillionHDB:false, hdbTownMopOver1k:true, rentalDemandRating:4,
    thesis:"Most material finding. TEL Bedok South confirmed 2026 — dual-line access. D16 PSF rose 44.4% (2020-2025). Best yield-per-dollar.",
    catalysts:["TEL Bedok South 2026","Dual-line MRT","Mature estate","HDB upgrader pool"], risks:["13yr old at purchase","Buyer financing may tighten","Lower capital gain ceiling"], targetUnit:"2BR 667-850 sqft, mid-floor, park facing. Buy below $1,550 psf." },
  { id:4, name:"Treasure at Tampines", priority:"SECONDARY", district:"D18", area:"Tampines", type:"Private Resale", beds:"2BR/2BA", sqft:"~700", budgetMin:1190000, budgetMax:1270000, psfAvg:1700, rent:3600, tenure:"99yr", mrt:"Tampines EWL/DTL (10 min)", age:"~3yr (TOP 2023)", bearCAGR:0.015, baseCAGR:0.035, bullCAGR:0.045, tag:"Liquidity & Mainstream", annualTransactions:170, schoolTier:2, districtIncomeTier:4, unitCount:620, landSizeHa:2.8, exitAudienceRating:5, nearMillionHDB:true, hdbTownMopOver1k:true, rentalDemandRating:5,
    thesis:"Deepest resale liquidity — 170 units transacted 2025. Changi Business Park tenant base. Broad buyer pool.",
    catalysts:["Highest liquidity","Changi Biz Park","Tampines Regional Hub","Newer 2023"], risks:["2,200 units competition","10-min MRT walk","Yield below best"], targetUnit:"2BR mid-floor, pool/greenery facing. Stack critical." },
  { id:5, name:"The Florence Residences", priority:"SECONDARY", district:"D19", area:"Hougang/Kovan", type:"Private Resale", beds:"2BR/2BA", sqft:"~700", budgetMin:1200000, budgetMax:1400000, psfAvg:1800, rent:3500, tenure:"99yr", mrt:"Hougang NEL (walk)", age:"~4yr (TOP 2022)", bearCAGR:0.015, baseCAGR:0.035, bullCAGR:0.05, tag:"D19 Private Alt", annualTransactions:78, schoolTier:2, districtIncomeTier:4, unitCount:580, landSizeHa:3.8, exitAudienceRating:4, nearMillionHDB:true, hdbTownMopOver1k:false, rentalDemandRating:4,
    thesis:"Newer private in D19 with Hougang MRT NEL direct. Same district demand as Rivercove without EC price discovery.",
    catalysts:["D19 demand","Hougang NEL direct","Newer 2022","CRL future"], risks:["1,410 units competition","No EC catalyst","Lower yield"], targetUnit:"2BR mid-floor, well-facing. Budget $1.20-1.38M." },
  { id:6, name:"Wandervale EC", priority:"MONITOR", district:"D23", area:"Choa Chu Kang", type:"Post-MOP EC", beds:"3BR/2BA", sqft:"950-1100", budgetMin:1250000, budgetMax:1400000, psfAvg:1375, rent:3500, tenure:"99yr", mrt:"CCK NSL (10 min)", age:"~7yr (MOP 2023)", bearCAGR:0.015, baseCAGR:0.03, bullCAGR:0.04, tag:"Value EC / JLD", annualTransactions:42, schoolTier:3, districtIncomeTier:2, unitCount:420, landSizeHa:2.9, exitAudienceRating:2, nearMillionHDB:false, hdbTownMopOver1k:false, rentalDemandRating:2,
    thesis:"Lower-profile post-MOP EC with NSL to JLD. Less competitive buying = negotiation room.",
    catalysts:["NSL → JLD","EC value gap","Negotiable entry","Family 3BR"], risks:["JLD 10yr story","Weak rental submarket","Limited tenant pool"], targetUnit:"3BR 950+ sqft, mid-floor, greenery. Below $1,380 psf." },
  { id:7, name:"Twin Fountains / Bellewoods", priority:"MONITOR", district:"D25", area:"Woodlands", type:"Post-MOP EC", beds:"3BR/2BA", sqft:"1100-1250", budgetMin:1200000, budgetMax:1450000, psfAvg:1325, rent:3800, tenure:"99yr", mrt:"Admiralty NSL + Woodlands TEL", age:"~9yr (TOP 2016)", bearCAGR:0.015, baseCAGR:0.03, bullCAGR:0.045, tag:"Yield + Privatisation", annualTransactions:38, schoolTier:2, districtIncomeTier:2, unitCount:480, landSizeHa:4.1, exitAudienceRating:2, nearMillionHDB:false, hdbTownMopOver1k:false, rentalDemandRating:3,
    thesis:"Highest yield ~3.5-4.0%. Twin Fountains privatises 2026. RTS Link end-2026. New EC benchmarks $1,800+ psf create gap.",
    catalysts:["Privatisation 2026","RTS Link","New EC benchmarks","Woodlands transformation"], risks:["Suppressed D25 ceiling","Thin exit pool","9yr aging","RTS timing"], targetUnit:"3BR 1,100+ sqft, mid-floor. Below $1,300 psf." },
  { id:8, name:"Piermont Grand", priority:"MONITOR", district:"D19", area:"Punggol", type:"Post-MOP EC", beds:"3BR/2BA", sqft:"840+", budgetMin:1430000, budgetMax:1500000, psfAvg:1735, rent:3600, tenure:"99yr", mrt:"Sumang LRT → Punggol NEL", age:"~3yr (TOP 2023)", bearCAGR:0.02, baseCAGR:0.04, bullCAGR:0.06, tag:"PDD Play (Budget Stretch)", annualTransactions:68, schoolTier:2, districtIncomeTier:4, unitCount:550, landSizeHa:3.6, exitAudienceRating:3, nearMillionHDB:true, hdbTownMopOver1k:false, rentalDemandRating:3,
    thesis:"Best physical product in Punggol — waterway-fronting, PDD adjacent, CDL. First PDD hotel confirmed 2026-27.",
    catalysts:["PDD hotel 2026-27","Waterway premium","SIT campus","CDL quality"], risks:["Above $1.4M budget","LRT dependency","Punggol supply","Narrow pool"], targetUnit:"3BR 840 sqft, waterway facing. Only at/below $1,700 psf." },
  { id:9, name:"Rivelle Tampines EC", priority:"CONDITIONAL", district:"D18", area:"Tampines West", type:"New EC Launch", beds:"2BR/3BR", sqft:"TBD", budgetMin:1300000, budgetMax:1580000, psfAvg:1796, rent:0, tenure:"99yr", mrt:"Tampines West DTL", age:"New (TOP ~2029)", bearCAGR:0.03, baseCAGR:0.045, bullCAGR:0.06, tag:"EC First-Mover", annualTransactions:0, schoolTier:2, districtIncomeTier:4, unitCount:580, landSizeHa:3.2, exitAudienceRating:4, nearMillionHDB:false, hdbTownMopOver1k:false, rentalDemandRating:4,
    thesis:"First-mover EC play — buy at launch, hold through MOP, exit as privatised condo. Same thesis as Hundred Palms.",
    catalysts:["EC-to-private gap","CRL Tampines North","Tampines West emerging","First large dev"], risks:["5yr MOP lock-in","EC eligibility","TOP 2029-30","Budget tight 3BR"], targetUnit:"Only if EC eligible. 2BR for budget control." },
  { id:10, name:"The Botany at Dairy Farm", priority:"SPECULATIVE", district:"D23", area:"Dairy Farm", type:"Near-TOP Subsale", beds:"2BR/2BA", sqft:"650-750", budgetMin:1200000, budgetMax:1380000, psfAvg:1950, rent:3000, tenure:"99yr", mrt:"Hillview DTL (walk)", age:"New (TOP 2027)", bearCAGR:0.01, baseCAGR:0.025, bullCAGR:0.04, tag:"Lifestyle / Speculative", annualTransactions:32, schoolTier:3, districtIncomeTier:2, unitCount:240, landSizeHa:1.5, exitAudienceRating:2, nearMillionHDB:false, hdbTownMopOver1k:false, rentalDemandRating:2,
    thesis:"Near-TOP subsale near nature. Dairy Farm differentiated. Investment thesis weak; lifestyle thesis strong.",
    catalysts:["Subsale discount","Nature differentiation","Hillview DTL","Near-TOP"], risks:["Narrow tenant pool","D23 supply glut","Limited liquidity","Speculative"], targetUnit:"Only if below $1,800 psf. Not core investment." },
];

const PRIO_COLORS = {
  PRIMARY: { bg:"#E8F1FA", accent:"#1A73E8", badge:"#0F4C81", text:"#0F4C81" },
  SECONDARY: { bg:"#E8F5E9", accent:"#2E7D32", badge:"#2E7D32", text:"#1B5E20" },
  MONITOR: { bg:"#FFF8E1", accent:"#F57F17", badge:"#F57F17", text:"#5F370E" },
  CONDITIONAL: { bg:"#F3E5F5", accent:"#7B1FA2", badge:"#7B1FA2", text:"#4A148C" },
  SPECULATIVE: { bg:"#FEF2F2", accent:"#C62828", badge:"#C62828", text:"#7F1D1D" },
};
const PRIO_ORDER = ["PRIMARY","SECONDARY","MONITOR","CONDITIONAL","SPECULATIVE"];

// ════════════════════════════════════════════════════════════
// FORMAT HELPERS (aliases for engine fmt)
// ════════════════════════════════════════════════════════════
const f$ = fmt.currency;
const f$k = fmt.currencyK;
const f$m = fmt.currencyM;
const fPct = fmt.percent;
const fCarry = fmt.monthlyCarry;

// ════════════════════════════════════════════════════════════
// DEFAULT CLIENT PROFILE (sample data from intake)
// ════════════════════════════════════════════════════════════
const DEFAULT_PROFILE = {
  name: "Sample Client", residency: "SC", age: 35, ageBracketA: "<=35",
  grossIncomeA: 10000, grossIncomeB: 0, additionalIncome: 4500, ageBracketB: "<=35",
  existingCommitments: 0,
  cpfOA_A: 120000, cpfOA_B: 0, cashSavings: 200000, otherLiquid: 50000, giftSupport: 0,
  currentProperty: { owns: true, type: "HDB 4-Room", district: "D19 Sengkang", marketValue: 650000, outstandingMortgage: 180000, monthlyMortgage: 1200, originalPrice: 400000, yearPurchased: 2015 },
  goals: { primaryGoal: "Sell HDB → Buy Condo", riskTolerance: "Balanced", holdingHorizon: "4-6", purpose: "Own Stay + Investment", budgetCeiling: 1400000, carryTolerance: 2000, targetIRR: 0.10 },
  monthlyExpenses: 5000, maintenance: 380, propertyTax: 350, utilities: 350,
};

// ════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ════════════════════════════════════════════════════════════
const fonts = { mono: "'SF Mono', 'Fira Code', 'Consolas', monospace", serif: "Georgia, 'Times New Roman', serif", sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };

function Card({ children, style }) { return <div style={{ background:"#fff", border:"1px solid #E0E0E0", borderRadius:8, overflow:"hidden", ...style }}>{children}</div>; }
function Badge({ text, color, bg }) { return <span style={{ background:bg||"#eee", color:color||"#333", fontSize:10, fontWeight:700, letterSpacing:1, padding:"3px 10px", borderRadius:3, fontFamily:fonts.mono, textTransform:"uppercase" }}>{text}</span>; }
function Metric({ label, value, sub, accent, large }) {
  return <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
    <span style={{ fontSize:10, color:"#888", fontFamily:fonts.mono, letterSpacing:0.5, textTransform:"uppercase" }}>{label}</span>
    <span style={{ fontSize:large?18:14, fontWeight:700, color:accent||"#1A1A2E", fontFamily:fonts.mono }}>{value}</span>
    {sub && <span style={{ fontSize:10, color:"#999", fontFamily:fonts.mono }}>{sub}</span>}
  </div>;
}
function SectionHeader({ children }) { return <div style={{ fontSize:11, fontWeight:700, color:"#0F4C81", fontFamily:fonts.mono, letterSpacing:1.5, textTransform:"uppercase", padding:"12px 0 6px", borderBottom:"2px solid #E8F1FA" }}>{children}</div>; }
function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position:"relative", display:"inline-flex", alignItems:"center", marginLeft:5, verticalAlign:"middle" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ fontSize:9, color:"#90A4AE", cursor:"help", border:"1px solid #B0BEC5", borderRadius:"50%", width:14, height:14, display:"inline-flex", alignItems:"center", justifyContent:"center", fontWeight:700, lineHeight:1, userSelect:"none" }}>i</span>
      {show && (
        <div style={{ position:"absolute", left:"calc(100% + 8px)", top:"50%", transform:"translateY(-50%)", zIndex:200, background:"#1A1A2E", color:"#E0E0E0", fontSize:10, fontFamily:fonts.sans, padding:"8px 10px", borderRadius:4, width:250, lineHeight:1.6, pointerEvents:"none", boxShadow:"0 4px 12px rgba(0,0,0,0.4)" }}>
          {text}
        </div>
      )}
    </span>
  );
}
function InputRow({ label, value, onChange, type = "number", note, options, comma = false }) {
  const inputStyle = { flex:"0 0 180px", padding:"6px 8px", border:"1px solid #D0E4F5", borderRadius:4, fontSize:12, fontFamily:fonts.mono, color:"#0000FF", background:"#F0F7FF" };
  return <div style={{ display:"flex", alignItems:"center", gap:12, padding:"6px 0", borderBottom:"1px solid #F5F5F5" }}>
    <span style={{ flex:"0 0 240px", fontSize:12, color:"#444", fontFamily:fonts.sans }}>{label}</span>
    {options ? (
      <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputStyle }}>
        {options.map(o => <option key={typeof o === "object" ? o.value : o} value={typeof o === "object" ? o.value : o}>{typeof o === "object" ? o.label : o}</option>)}
      </select>
    ) : comma ? (
      <input type="text" value={value === "" || value == null ? "" : Number(value).toLocaleString("en-SG")} onChange={e => onChange(Number(e.target.value.replace(/,/g, "")) || 0)}
        style={{ ...inputStyle, textAlign: "right" }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
        style={{ ...inputStyle, textAlign: type === "number" ? "right" : "left" }} />
    )}
    {note && <span style={{ fontSize:10, color:"#999", fontFamily:fonts.sans, flex:1 }}>{note}</span>}
  </div>;
}

// ════════════════════════════════════════════════════════════
// TAB 1: CLIENT PROFILE
// ════════════════════════════════════════════════════════════
function ProfileTab({ profile, setProfile }) {
  const u = (path, val) => {
    setProfile(p => {
      const np = JSON.parse(JSON.stringify(p));
      const parts = path.split("."); let obj = np;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = val; return np;
    });
  };
  const cpf = DEFAULTS.cpfRates[profile.ageBracketA] || DEFAULTS.cpfRates["<=35"];
  const cpfOAmonthly = profile.grossIncomeA * cpf.total * cpf.oaRatio;
  const netTakeHome = profile.grossIncomeA * (1 - cpf.employee) + (profile.grossIncomeB > 0 ? profile.grossIncomeB * (1 - (DEFAULTS.cpfRates[profile.ageBracketB]||cpf).employee) : 0) + profile.additionalIncome;
  const totalGross = profile.grossIncomeA + profile.grossIncomeB;
  // Sale proceeds: subtract agent commission AND CPF refund on current property
  const cpfRefundOnCurrentProperty = profile.currentProperty.owns && profile.currentProperty.yearPurchased ? calcCPFTotalRefund(profile.currentProperty.cpfUsed || profile.cpfOA_A * 0.4, 2026 - profile.currentProperty.yearPurchased).totalRefund : 0;
  const saleProceeds = profile.currentProperty.owns ? profile.currentProperty.marketValue - profile.currentProperty.outstandingMortgage - profile.currentProperty.marketValue * 0.02 - cpfRefundOnCurrentProperty : 0;
  const totalFunds = profile.cpfOA_A + profile.cpfOA_B + profile.cashSavings + profile.otherLiquid + profile.giftSupport + Math.max(0, saleProceeds);
  const maxPrice = totalGross > 0 ? Math.round(((totalGross * 0.55 - profile.existingCommitments) / 0.004774 / 0.75) / 10000) * 10000 : 0;
  const tdsrHeadroom = totalGross * 0.55 - profile.existingCommitments;

  return <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
    {/* Summary Cards */}
    <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:12 }}>
      <Card style={{ padding:16, borderLeft:"4px solid #1A73E8" }}><Metric label="Max Affordable Price" value={f$m(maxPrice)} sub="At 55% TDSR stress test" accent="#1A73E8" large /></Card>
      <Card style={{ padding:16, borderLeft:"4px solid #2E7D32" }}><Metric label="Total Funds Available" value={f$k(totalFunds)} sub={`Incl. ${f$k(saleProceeds)} sale proceeds`} accent="#2E7D32" large /></Card>
      <Card style={{ padding:16, borderLeft:"4px solid #F57F17" }}><Metric label="TDSR Headroom" value={f$(tdsrHeadroom)+"/mo"} sub="Additional mortgage capacity" accent="#F57F17" large /></Card>
      <Card style={{ padding:16, borderLeft:`4px solid ${profile.goals.budgetCeiling <= maxPrice ? "#2E7D32" : "#C62828"}` }}><Metric label="Budget vs Max" value={f$m(profile.goals.budgetCeiling)} sub={profile.goals.budgetCeiling <= maxPrice ? "Within affordable range" : "Exceeds max affordable"} accent={profile.goals.budgetCeiling <= maxPrice ? "#2E7D32" : "#C62828"} large /></Card>
    </div>

    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
      {/* Left: Identity & Income */}
      <Card style={{ padding:16 }}>
        <SectionHeader>Client Identity & Income</SectionHeader>
        <InputRow label="Client Name" value={profile.name} onChange={v=>u("name",v)} type="text" />
        <InputRow label="Residency" value={profile.residency} onChange={v=>u("residency",v)} options={["SC","PR","Foreigner"]} />
        <InputRow label="Age Bracket (Primary)" value={profile.ageBracketA} onChange={v=>u("ageBracketA",v)} options={Object.keys(DEFAULTS.cpfRates)} />
        <InputRow label="Gross Monthly Income (A)" value={profile.grossIncomeA} onChange={v=>u("grossIncomeA",v)} comma note={`Net: ${f$(profile.grossIncomeA*(1-cpf.employee))}`} />
        <InputRow label="Co-Borrower Income (B)" value={profile.grossIncomeB} onChange={v=>u("grossIncomeB",v)} comma note="0 if single buyer" />
        <InputRow label="Additional Income" value={profile.additionalIncome} onChange={v=>u("additionalIncome",v)} comma note="Excl. from TDSR" />
        <InputRow label="Existing Commitments" value={profile.existingCommitments} onChange={v=>u("existingCommitments",v)} comma note="Car/personal loans" />
        <div style={{ padding:"10px 0", borderTop:"1px solid #E8E8E8", marginTop:8, display:"flex", gap:20 }}>
          <Metric label="CPF OA Monthly" value={f$(cpfOAmonthly)} accent="#008000" />
          <Metric label="Net Household Income" value={f$(netTakeHome)} accent="#333" />
          <Metric label="Total Gross (TDSR)" value={f$(totalGross)} accent="#333" />
        </div>
      </Card>

      {/* Right: Current Property & Funds */}
      <Card style={{ padding:16 }}>
        <SectionHeader>Current Property & Available Funds</SectionHeader>
        <InputRow label="Currently Owns Property" type="text" value={profile.currentProperty.owns ? "Yes" : "No"} onChange={v=>u("currentProperty.owns",v==="Yes")} options={["Yes","No"]} />
        {profile.currentProperty.owns && <>
          <InputRow label="Property Type" value={profile.currentProperty.type} onChange={v=>u("currentProperty.type",v)} type="text" />
          <InputRow label="Est. Market Value" value={profile.currentProperty.marketValue} onChange={v=>u("currentProperty.marketValue",v)} comma />
          <InputRow label="Outstanding Mortgage" value={profile.currentProperty.outstandingMortgage} onChange={v=>u("currentProperty.outstandingMortgage",v)} comma />
          <div style={{ padding:"6px 0", fontSize:12, color:"#2E7D32", fontFamily:fonts.mono, fontWeight:600 }}>Net Equity: {f$(profile.currentProperty.marketValue - profile.currentProperty.outstandingMortgage)} | Sale Proceeds: {f$(saleProceeds)}</div>
        </>}
        <div style={{ height:8 }} />
        <InputRow label="CPF OA Balance (Primary)" value={profile.cpfOA_A} onChange={v=>u("cpfOA_A",v)} comma />
        <InputRow label="CPF OA Balance (Co-Buyer)" value={profile.cpfOA_B} onChange={v=>u("cpfOA_B",v)} comma />
        <InputRow label="Cash Savings" value={profile.cashSavings} onChange={v=>u("cashSavings",v)} comma />
        <InputRow label="Other Liquid Assets" value={profile.otherLiquid} onChange={v=>u("otherLiquid",v)} comma />
        <div style={{ padding:"10px 0", borderTop:"1px solid #E8E8E8", marginTop:8, fontSize:13, fontWeight:700, fontFamily:fonts.mono, color:"#0F4C81" }}>
          Total Funds: {f$(totalFunds)}
        </div>
      </Card>
    </div>

    {/* Goals */}
    <Card style={{ padding:16 }}>
      <SectionHeader>Goals & Preferences</SectionHeader>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        <InputRow label="Primary Goal" value={profile.goals.primaryGoal} onChange={v=>u("goals.primaryGoal",v)} options={["Sell HDB → Buy Condo","Buy 1st Investment (SC)","Status Quo vs Upgrade","Sell 1 → Buy 2","HDB to HDB"]} />
        <InputRow label="Risk Tolerance" value={profile.goals.riskTolerance} onChange={v=>u("goals.riskTolerance",v)} options={["Conservative","Balanced","Aggressive"]} />
        <InputRow label="Purpose" value={profile.goals.purpose} onChange={v=>u("goals.purpose",v)} options={["Own Stay","Pure Investment (Rental)","Own Stay + Investment"]} />
        <InputRow label="Budget Ceiling ($)" value={profile.goals.budgetCeiling} onChange={v=>u("goals.budgetCeiling",v)} comma />
        <InputRow label="Carry Tolerance ($/mo)" value={profile.goals.carryTolerance} onChange={v=>u("goals.carryTolerance",v)} comma />
        <InputRow label="Target IRR (%)" value={profile.goals.targetIRR*100} onChange={v=>u("goals.targetIRR",v/100)} note="As whole number" />
      </div>
    </Card>
  </div>;
}

// ════════════════════════════════════════════════════════════
// TAB 2: SCENARIO COMPARISON
// ════════════════════════════════════════════════════════════
function ScenarioTab({ profile }) {
  const [selectedInvProject, setSelectedInvProject] = useState(1);
  const cp = profile.currentProperty;
  const totalGross = profile.grossIncomeA + profile.grossIncomeB;
  const cpf = DEFAULTS.cpfRates[profile.ageBracketA] || DEFAULTS.cpfRates["<=35"];
  const cpfOAmonthly = profile.grossIncomeA * cpf.total * cpf.oaRatio;
  const saleProceeds = cp.owns ? cp.marketValue - cp.outstandingMortgage - cp.marketValue * 0.02 : 0;
  const totalFunds = profile.cpfOA_A + profile.cpfOA_B + profile.cashSavings + profile.otherLiquid + profile.giftSupport + Math.max(0, saleProceeds);

  const scenarios = useMemo(() => {
    const results = [];
    // Scenario A: Status Quo
    if (cp.owns) {
      const cagr = cp.type?.includes("HDB") ? 0.02 : 0.03;
      const futVal = cp.marketValue * Math.pow(1 + cagr, 5);
      const currEq = cp.marketValue - cp.outstandingMortgage;
      results.push({ name:"Status Quo", desc:`Stay in current ${cp.type}`, color:"#78909C",
        metrics: [
          { l:"Current Equity", v:f$(currEq) },
          { l:"Est. Value (5yr)", v:f$(futVal) },
          { l:"Equity Growth", v:f$(futVal - cp.outstandingMortgage - currEq) },
          { l:"Monthly Change", v:"$0" },
          { l:"Upfront Cash", v:"$0" },
          { l:"Risk", v:"Low" },
        ],
        pros:["No transaction costs","No disruption","Familiar"], cons:["Locked equity","Opportunity cost","No diversification"] });
    }
    // Scenario B: Sell → Buy Condo (at budget ceiling)
    const upgradePrice = profile.goals.budgetCeiling;
    const upgBsd = calcBSD(upgradePrice);
    const upgAbsd = calcABSD(upgradePrice, profile.residency, 0);
    const upgDown = upgradePrice * 0.25;
    const upgUpfront = upgDown + upgBsd + upgAbsd + DEFAULTS.legalFees;
    const upgLoan = upgradePrice * 0.75;
    const upgMtg = calcMonthlyMortgage(upgLoan, DEFAULTS.mortgageRate);
    const upgMtgCash = Math.max(0, upgMtg - cpfOAmonthly);
    const upgTDSR = upgMtg / totalGross;
    const upgSurplus = totalFunds - upgUpfront;
    const upgExit5 = upgradePrice * Math.pow(1 + 0.04, 5);
    const upgRemLoan5 = calcRemainingLoan(upgLoan, DEFAULTS.mortgageRate, 30, 5);
    results.push({ name:"Sell → Buy Condo", desc:`Upgrade to ${f$m(upgradePrice)} private`, color:"#1A73E8",
      metrics: [
        { l:"Purchase Price", v:f$m(upgradePrice) },
        { l:"Upfront Cash", v:f$k(upgUpfront) },
        { l:"Surplus/Shortfall", v:f$k(upgSurplus), warn:upgSurplus<0 },
        { l:"Monthly Mortgage", v:f$(upgMtg) },
        { l:"Cash Outlay/mo", v:f$(upgMtgCash) },
        { l:"TDSR", v:fPct(upgTDSR), warn:upgTDSR>0.55 },
      ],
      pros: [upgSurplus>0&&`${f$k(upgSurplus)} surplus`, upgTDSR<=0.55&&`TDSR ${fPct(upgTDSR)} passes`, upgAbsd===0&&"Zero ABSD"].filter(Boolean),
      cons: [upgSurplus<0&&`${f$k(Math.abs(upgSurplus))} shortfall`, upgTDSR>0.55&&"TDSR breach", `${f$(upgMtgCash)}/mo cash outlay`].filter(Boolean) });

    // Scenario C: Buy 1st Investment (dynamic — user selects project)
    const invProject = PROJECTS.find(p => p.id === selectedInvProject) || PROJECTS[1];
    const invPrice = (invProject.budgetMin + invProject.budgetMax) / 2;
    const invBsd = calcBSD(invPrice);
    const invLoan = invPrice * 0.75;
    const invUpfront = invPrice * 0.25 + invBsd + DEFAULTS.legalFees + DEFAULTS.renoFurnishing;
    const invMtg = calcMonthlyMortgage(invLoan, DEFAULTS.investmentRate);
    const invCarry = invProject.rent * DEFAULTS.occupancyRate - invMtg - DEFAULTS.maintenanceMthly - invProject.rent * DEFAULTS.avPctOfRent * DEFAULTS.propTaxRateNROC;
    const invFunds = profile.cpfOA_A + profile.cpfOA_B + profile.cashSavings + profile.otherLiquid;
    const invSurplus = invFunds - invUpfront;
    const invTDSR = (invMtg + profile.existingCommitments + (cp.monthlyMortgage||0)) / totalGross;
    results.push({ name:"Buy Investment (SC)", desc:`${invProject.name} at ${f$m(invPrice)} — zero ABSD`, color:"#2E7D32",
      isInvestmentScenario: true,
      selectedProjectId: selectedInvProject,
      metrics: [
        { l:"Purchase Price", v:f$m(invPrice) },
        { l:"Upfront Cash", v:f$k(invUpfront) },
        { l:"Surplus/Shortfall", v:f$k(invSurplus), warn:invSurplus<0 },
        { l:"Monthly Carry", v:fCarry(invCarry), warn:invCarry<-2000 },
        { l:"Gross Yield", v:fPct(invProject.rent*12/invPrice) },
        { l:"TDSR (incl existing)", v:fPct(invTDSR), warn:invTDSR>0.55 },
      ],
      pros: ["Zero ABSD — first property SC", `ABSD saving vs 2nd buyer: ${f$(calcABSD(invPrice,"SC",1))}`, invCarry>-1500&&"Manageable carry"].filter(Boolean),
      cons: [invSurplus<0&&"Funding shortfall", `${fCarry(invCarry)} negative carry`, invTDSR>0.55&&"TDSR breach"].filter(Boolean) });

    // Scenario D: Sell 1 → Buy 2 (if client owns property and is SC/PR)
    if (cp.owns && (profile.residency === "SC" || profile.residency === "PR")) {
      const prop1Price = profile.goals.budgetCeiling * 0.6; // 60% of budget for first property
      const prop2Price = profile.goals.budgetCeiling * 0.4; // 40% for second
      const p1Bsd = calcBSD(prop1Price);
      const p2Bsd = calcBSD(prop2Price);
      const p2Absd = calcABSD(prop2Price, profile.residency, 1); // 2nd property ABSD
      const p1Loan = prop1Price * 0.45; // 2nd property LTV is 45%
      const p2Loan = prop2Price * 0.45;
      const p1Mtg = calcMonthlyMortgage(p1Loan, DEFAULTS.investmentRate);
      const p2Mtg = calcMonthlyMortgage(p2Loan, DEFAULTS.investmentRate);
      const totalNewMtg = p1Mtg + p2Mtg;
      const p1Upfront = prop1Price * 0.55 + p1Bsd + DEFAULTS.legalFees;
      const p2Upfront = prop2Price * 0.55 + p2Bsd + p2Absd + DEFAULTS.legalFees;
      const totalUpfront = p1Upfront + p2Upfront;
      const s1b2Surplus = totalFunds - totalUpfront;
      const s1b2TDSR = (totalNewMtg + profile.existingCommitments) / totalGross;
      results.push({ name:"Sell 1 → Buy 2", desc:`Sell current, buy two properties`, color:"#E67E22",
        metrics: [
          { l:"Total Purchase", v:f$m(prop1Price + prop2Price) },
          { l:"Total Upfront", v:f$k(totalUpfront) },
          { l:"Surplus/Shortfall", v:f$k(s1b2Surplus), warn:s1b2Surplus<0 },
          { l:"Combined Mortgage", v:f$(totalNewMtg) },
          { l:"Total ABSD (2nd prop)", v:f$(p2Absd) },
          { l:"TDSR (both mortgages)", v:fPct(s1b2TDSR), warn:s1b2TDSR>0.55 },
        ],
        pros: [s1b2Surplus>0&&"Funds sufficient", s1b2TDSR<=0.55&&"TDSR passes", "Diversification"].filter(Boolean),
        cons: [s1b2Surplus<0&&"Funding shortfall", s1b2TDSR>0.55&&"TDSR breach", `ABSD cost: ${f$(p2Absd)}`].filter(Boolean) });
    }

    // Scenario E: HDB → HDB (if client currently owns HDB)
    if (cp.owns && cp.type?.includes("HDB")) {
      const newHdbPrice = profile.goals.budgetCeiling;
      const hdbLoan = newHdbPrice * DEFAULTS.ltvHDB; // HDB LTV is 80%
      const hdbBsd = calcBSD(newHdbPrice);
      const hdbUpfront = newHdbPrice * 0.2 + hdbBsd + DEFAULTS.legalFees;
      const hdbMtgBank = calcMonthlyMortgage(hdbLoan * 0.5, DEFAULTS.mortgageRate, 25); // Assume 50% via bank
      const hdbMtgCpf = (hdbLoan * 0.5) / (25 * 12); // 50% via CPF monthly (no interest)
      const hdbTDSR = hdbMtgBank / totalGross;
      const hdbSurplus = totalFunds - hdbUpfront;
      results.push({ name:"HDB → HDB", desc:`Upgrade within HDB (HDB loan + bank)`, color:"#16A085",
        metrics: [
          { l:"New HDB Price", v:f$m(newHdbPrice) },
          { l:"Upfront Cash", v:f$k(hdbUpfront) },
          { l:"Surplus/Shortfall", v:f$k(hdbSurplus), warn:hdbSurplus<0 },
          { l:"Bank Mortgage/mo", v:f$(hdbMtgBank) },
          { l:"CPF Monthly", v:f$(hdbMtgCpf) },
          { l:"TDSR (bank only)", v:fPct(hdbTDSR), warn:hdbTDSR>0.55 },
        ],
        pros: ["HDB loan rates lower", "CPF usage allowed", "No ABSD"].filter(Boolean),
        cons: [hdbSurplus<0&&"Funding shortfall", hdbTDSR>0.55&&"TDSR breach", `Seller's stamp duty applicable`].filter(Boolean) });
    }

    return results;
  }, [profile, selectedInvProject]);

  return <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
    <div style={{ padding:"12px 16px", background:"#FFF8E1", borderRadius:8, border:"1px solid #FFE082", fontSize:11, color:"#795548", fontFamily:fonts.mono }}>
      Scenarios use the client profile inputs from Tab 1. Change inputs there to see how scenarios update in real time.
      All mortgage calculations use {fPct(DEFAULTS.mortgageRate)} current fixed rate. TDSR stress-tested at {fPct(DEFAULTS.stressTestRate)}.
    </div>

    {/* Investment Project Selector (for Scenario C) */}
    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", padding:"8px 12px", background:"#F5F5F5", borderRadius:6 }}>
      <span style={{ fontSize:11, color:"#666", fontFamily:fonts.mono, fontWeight:600 }}>Investment Property:</span>
      <select value={selectedInvProject} onChange={(e) => setSelectedInvProject(Number(e.target.value))}
        style={{ padding:"6px 10px", fontSize:11, border:"1px solid #D0D0D0", borderRadius:4, fontFamily:fonts.mono, cursor:"pointer" }}>
        {PROJECTS.map(p => (
          <option key={p.id} value={p.id}>{p.name} (#{p.id})</option>
        ))}
      </select>
    </div>

    <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(scenarios.length, 3)}, 1fr)`, gap:16, gridAutoFlow:"dense" }}>
      {scenarios.map((s, i) => (
        <Card key={i} style={{ borderTop:`4px solid ${s.color}`, gridColumn: i >= 3 ? `span 1` : `auto` }}>
          <div style={{ padding:"16px 16px 12px", borderBottom:"1px solid #F0F0F0" }}>
            <div style={{ fontSize:15, fontWeight:700, color:s.color, fontFamily:fonts.sans }}>{s.name}</div>
            <div style={{ fontSize:11, color:"#666", fontFamily:fonts.sans, marginTop:2 }}>{s.desc}</div>
          </div>
          <div style={{ padding:16, display:"flex", flexDirection:"column", gap:10 }}>
            {s.metrics.map((m, j) => (
              <div key={j} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"4px 0", borderBottom:"1px solid #FAFAFA" }}>
                <span style={{ fontSize:11, color:"#666", fontFamily:fonts.mono }}>{m.l}</span>
                <span style={{ fontSize:12, fontWeight:700, color:m.warn?"#C62828":"#1A1A2E", fontFamily:fonts.mono }}>{m.v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding:"0 16px 12px" }}>
            {s.pros && s.pros.length > 0 && <div style={{ marginBottom:8 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#2E7D32", fontFamily:fonts.mono, letterSpacing:1, marginBottom:4 }}>ADVANTAGES</div>
              {s.pros.map((p, j) => <div key={j} style={{ fontSize:11, color:"#333", fontFamily:fonts.sans, padding:"2px 0" }}>+ {p}</div>)}
            </div>}
            {s.cons && s.cons.length > 0 && <div>
              <div style={{ fontSize:10, fontWeight:700, color:"#C62828", fontFamily:fonts.mono, letterSpacing:1, marginBottom:4 }}>RISKS / TRADE-OFFS</div>
              {s.cons.map((c, j) => <div key={j} style={{ fontSize:11, color:"#333", fontFamily:fonts.sans, padding:"2px 0" }}>- {c}</div>)}
            </div>}
          </div>
        </Card>
      ))}
    </div>
  </div>;
}

// ════════════════════════════════════════════════════════════
// TAB 3: PROPERTY SHORTLIST
// ════════════════════════════════════════════════════════════
function ShortlistTab({ profile }) {
  const [filter, setFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("priority");
  const [expanded, setExpanded] = useState(new Set([1, 2]));

  const enriched = useMemo(() => {
    const budget = profile.goals.budgetCeiling;
    return PROJECTS.map(p => {
      const mid = (p.budgetMin + p.budgetMax) / 2;
      const loan = mid * DEFAULTS.ltv1st;
      const mortgage = calcMonthlyMortgage(loan, DEFAULTS.investmentRate);
      const grossYield = p.rent > 0 ? (p.rent * 12) / mid : null;
      const carry = p.rent > 0 ? p.rent * DEFAULTS.occupancyRate - mortgage - DEFAULTS.maintenanceMthly - p.rent * DEFAULTS.avPctOfRent * DEFAULTS.propTaxRateNROC : null;
      const baseExit = mid * Math.pow(1 + p.baseCAGR, 5);
      const bullExit = mid * Math.pow(1 + p.bullCAGR, 5);
      const remLoan = calcRemainingLoan(loan, DEFAULTS.investmentRate, 30, 5);
      // Simple IRR estimate
      const upfront = mid * 0.25 + calcBSD(mid) + DEFAULTS.legalFees + DEFAULTS.renoFurnishing;
      const annCarry = carry ? carry * 12 : 0;
      let baseIRR = null;
      try {
        const baseProceeds = calcNetProceeds({ salePrice: baseExit, outstandingLoan: remLoan, holdMonths: 60, cpfPrincipalUsed: mid * 0.25 * 0.5, holdYears: 5 });
        baseIRR = solveIRR([-upfront, annCarry, annCarry, annCarry, annCarry, annCarry + baseProceeds.netCashToSeller]);
      } catch {}
      let bullIRR = null;
      try {
        const bullProceeds = calcNetProceeds({ salePrice: bullExit, outstandingLoan: remLoan, holdMonths: 60, cpfPrincipalUsed: mid * 0.25 * 0.5, holdYears: 5 });
        bullIRR = solveIRR([-upfront, annCarry, annCarry, annCarry, annCarry, annCarry + bullProceeds.netCashToSeller]);
      } catch {}
      const derived = deriveProjectMetrics(p);
      const moat = computeMoatScores(p, derived);
      const badges = computeBadges(p, derived);
      return { ...p, _mid: mid, _loan: loan, _mortgage: mortgage, _grossYield: grossYield, _carry: carry, _baseExit: baseExit, _bullExit: bullExit, _baseIRR: baseIRR, _bullIRR: bullIRR, _withinBudget: p.budgetMin <= budget, _moatScore: moat.composite, _badges: badges };
    });
  }, [profile]);

  const filtered = enriched
    .filter(p => filter === "ALL" || p.priority === filter)
    .sort((a, b) => {
      if (sortBy === "priority") return PRIO_ORDER.indexOf(a.priority) - PRIO_ORDER.indexOf(b.priority);
      if (sortBy === "yield") return (b._grossYield || 0) - (a._grossYield || 0);
      if (sortBy === "carry") return (b._carry || -99999) - (a._carry || -99999);
      if (sortBy === "budget") return a.budgetMin - b.budgetMin;
      return 0;
    });

  const toggle = id => { const n = new Set(expanded); n.has(id) ? n.delete(id) : n.add(id); setExpanded(n); };

  return <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
    {/* Controls */}
    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
      <span style={{ fontSize:10, color:"#888", fontFamily:fonts.mono, letterSpacing:1 }}>FILTER:</span>
      {["ALL",...PRIO_ORDER].map(p => (
        <button key={p} onClick={()=>setFilter(p)} style={{ padding:"4px 12px", border:`1px solid ${filter===p?"#0F4C81":"#D0D0D0"}`, borderRadius:4, background:filter===p?"#0F4C81":"#fff", color:filter===p?"#fff":"#555", fontSize:10, fontFamily:fonts.mono, cursor:"pointer", fontWeight:filter===p?700:400 }}>{p}</button>
      ))}
      <span style={{ marginLeft:16, fontSize:10, color:"#888", fontFamily:fonts.mono, letterSpacing:1 }}>SORT:</span>
      {[{v:"priority",l:"Priority"},{v:"yield",l:"Yield"},{v:"carry",l:"Carry"},{v:"budget",l:"Budget"}].map(s => (
        <button key={s.v} onClick={()=>setSortBy(s.v)} style={{ padding:"4px 10px", border:`1px solid ${sortBy===s.v?"#0F4C81":"#D0D0D0"}`, borderRadius:4, background:sortBy===s.v?"#0F4C81":"#fff", color:sortBy===s.v?"#fff":"#555", fontSize:10, fontFamily:fonts.mono, cursor:"pointer", fontWeight:sortBy===s.v?700:400 }}>{s.l}</button>
      ))}
      <span style={{ marginLeft:"auto", fontSize:10, color:"#888", fontFamily:fonts.mono }}>Client budget: {f$m(profile.goals.budgetCeiling)} | Showing {filtered.length} of {PROJECTS.length}</span>
    </div>

    {/* Summary Table */}
    <Card>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
          <thead><tr style={{ background:"#F7F8FA" }}>
            {["#","Project","Dist","Type","Budget Range","Yield","Carry/mo","Base IRR","Bull IRR","MOAT Score","Exit Badges","Priority"].map(h => (
              <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontSize:10, color:"#888", fontFamily:fonts.mono, fontWeight:600, borderBottom:"1px solid #E0E0E0", whiteSpace:"nowrap" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map((p, i) => {
              const c = PRIO_COLORS[p.priority];
              const moatColor = p._moatScore >= 40 ? "#2E7D32" : p._moatScore >= 30 ? "#E65100" : "#C62828";
              return <tr key={p.id} style={{ background:i%2===0?"#fff":"#FAFAFA", opacity:p._withinBudget?1:0.5 }}>
                <td style={{ padding:"8px 10px", fontFamily:fonts.mono, color:"#888" }}>{p.id}</td>
                <td style={{ padding:"8px 10px", fontWeight:600, whiteSpace:"nowrap" }}>{p.name}</td>
                <td style={{ padding:"8px 10px", fontFamily:fonts.mono, color:"#555" }}>{p.district}</td>
                <td style={{ padding:"8px 10px", color:"#555", whiteSpace:"nowrap", fontSize:10 }}>{p.type}</td>
                <td style={{ padding:"8px 10px", fontFamily:fonts.mono, whiteSpace:"nowrap" }}>{f$m(p.budgetMin)}-{f$m(p.budgetMax)}</td>
                <td style={{ padding:"8px 10px", fontFamily:fonts.mono, fontWeight:700, color:p._grossYield>=0.037?"#2E7D32":p._grossYield>=0.034?"#E65100":"#555" }}>{p._grossYield ? fPct(p._grossYield) : "TBD"}</td>
                <td style={{ padding:"8px 10px", fontFamily:fonts.mono, color:"#C62828", fontSize:10 }}>{fCarry(p._carry)}</td>
                <td style={{ padding:"8px 10px", fontFamily:fonts.mono }}>{p._baseIRR!=null?fPct(p._baseIRR):"-"}</td>
                <td style={{ padding:"8px 10px", fontFamily:fonts.mono, color:"#1B5E20", fontWeight:600 }}>{p._bullIRR!=null?fPct(p._bullIRR):"-"}</td>
                <td style={{ padding:"4px 8px", fontFamily:fonts.mono, fontWeight:700, color:moatColor, background: moatColor === "#2E7D32" ? "#E8F5E9" : moatColor === "#E65100" ? "#FFF3E0" : "#FEF2F2", borderRadius:3, textAlign:"center" }}>{p._moatScore}/50</td>
                <td style={{ padding:"8px 10px", display:"flex", gap:2, fontSize:10 }}>
                  <span style={{ color: p._badges.under1kmMRT ? "#2E7D32" : "#C62828" }}>⬤</span>
                  <span style={{ color: p._badges.under10yrOld ? "#2E7D32" : "#C62828" }}>⬤</span>
                  <span style={{ color: p._badges.nearMillionHDB ? "#2E7D32" : "#C62828" }}>⬤</span>
                  <span style={{ color: p._badges.fiftyPlusDeals ? "#2E7D32" : "#C62828" }}>⬤</span>
                  <span style={{ color: p._badges.top20School ? "#2E7D32" : "#C62828" }}>⬤</span>
                  <span style={{ color: p._badges.hdbMopOver1k ? "#2E7D32" : "#C62828" }}>⬤</span>
                </td>
                <td style={{ padding:"8px 10px" }}><Badge text={p.priority} color="#fff" bg={c.badge} /></td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    </Card>

    {/* Project Cards */}
    {filtered.map(p => {
      const c = PRIO_COLORS[p.priority];
      const isExp = expanded.has(p.id);
      return <Card key={p.id} style={{ borderLeft:`4px solid ${c.accent}`, opacity:p._withinBudget?1:0.6 }}>
        <div onClick={()=>toggle(p.id)} style={{ padding:"14px 16px", cursor:"pointer", background:isExp?c.bg:"#fff", display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:c.accent, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, fontFamily:fonts.mono, flexShrink:0 }}>{p.id}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:3 }}>
              <Badge text={p.priority} color="#fff" bg={c.badge} />
              <Badge text={p.tag} color="#555" bg="#F0F0F0" />
              {!p._withinBudget && <Badge text="OVER BUDGET" color="#fff" bg="#C62828" />}
            </div>
            <div style={{ fontSize:14, fontWeight:700, color:"#1A1A2E", fontFamily:fonts.sans }}>{p.name}</div>
            <div style={{ fontSize:11, color:"#666", fontFamily:fonts.mono }}>{p.district} · {p.area} · {p.type} · {p.beds}</div>
          </div>
          <div style={{ display:"flex", gap:20, flexShrink:0 }}>
            <Metric label="Budget" value={`${f$m(p.budgetMin)}-${f$m(p.budgetMax)}`} accent={c.accent} />
            <Metric label="Yield" value={p._grossYield ? fPct(p._grossYield) : "TBD"} accent={p._grossYield>=0.037?"#2E7D32":"#666"} />
            <Metric label="Carry" value={fCarry(p._carry)} accent="#C62828" />
            <Metric label="Base IRR" value={p._baseIRR!=null?fPct(p._baseIRR):"-"} accent={c.text} />
          </div>
          <span style={{ fontSize:14, color:c.accent, fontWeight:700, marginLeft:8 }}>{isExp?"▲":"▼"}</span>
        </div>
        {isExp && <div style={{ padding:"0 16px 16px", borderTop:`1px solid ${c.bg}` }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(130px, 1fr))", gap:10, padding:"14px 0", borderBottom:"1px solid #F0F0F0" }}>
            {[
              {l:"Size",v:p.sqft+" sqft"},{l:"Avg PSF",v:f$(p.psfAvg)},{l:"Tenure",v:p.tenure},{l:"MRT",v:p.mrt},{l:"Age",v:p.age},
              {l:"Monthly Rent",v:p.rent>0?f$(p.rent):"TBD"},{l:"Mortgage/mo",v:f$(p._mortgage)},{l:"Base Exit (5yr)",v:f$(p._baseExit)},{l:"Bull Exit (5yr)",v:f$(p._bullExit)},
            ].map(m => <Metric key={m.l} label={m.l} value={m.v} />)}
          </div>
          <div style={{ padding:"12px 0", borderBottom:"1px solid #F0F0F0" }}>
            <div style={{ fontSize:10, fontWeight:700, color:c.accent, fontFamily:fonts.mono, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Investment Thesis</div>
            <p style={{ fontSize:12, color:"#333", lineHeight:1.65, margin:0, fontFamily:fonts.serif }}>{p.thesis}</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, padding:"12px 0", borderBottom:"1px solid #F0F0F0" }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:"#2E7D32", fontFamily:fonts.mono, letterSpacing:1, marginBottom:6 }}>CATALYSTS</div>
              {p.catalysts.map(c2 => <div key={c2} style={{ fontSize:11, color:"#333", fontFamily:fonts.serif, padding:"2px 0" }}>+ {c2}</div>)}
            </div>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:"#C62828", fontFamily:fonts.mono, letterSpacing:1, marginBottom:6 }}>RISKS</div>
              {p.risks.map(r => <div key={r} style={{ fontSize:11, color:"#333", fontFamily:fonts.serif, padding:"2px 0" }}>- {r}</div>)}
            </div>
          </div>
          <div style={{ padding:"12px 0 0" }}>
            <div style={{ fontSize:10, fontWeight:700, color:c.accent, fontFamily:fonts.mono, letterSpacing:1, marginBottom:4 }}>TARGET UNIT SPEC</div>
            <div style={{ fontSize:11, color:"#555", fontFamily:fonts.mono, background:c.bg, padding:"8px 12px", borderRadius:4 }}>{p.targetUnit}</div>
          </div>
        </div>}
      </Card>;
    })}
  </div>;
}

// ════════════════════════════════════════════════════════════
// TAB 4: DEEP DIVE
// ════════════════════════════════════════════════════════════
function DeepDiveTab({ profile }) {
  const [selectedId, setSelectedId] = useState(1);
  const [rentOverride, setRentOverride] = useState(null);
  const [maintenanceOverride, setMaintenanceOverride] = useState(null);
  const [exitPriceOverride, setExitPriceOverride] = useState(null);
  const [propertyMode, setPropertyMode] = useState("1");
  const [investmentPropertyRate, setInvestmentPropertyRate] = useState(DEFAULTS.investmentRate);
  const [currentPropertyRate, setCurrentPropertyRate] = useState(DEFAULTS.mortgageRate);
  const [currentPropertyMortgage, setCurrentPropertyMortgage] = useState(null);
  const [cpfPrimaryAlloc, setCpfPrimaryAlloc] = useState(null);
  const [cpfSecondaryAlloc, setCpfSecondaryAlloc] = useState(0);
  const [monthlyExpensesOverride, setMonthlyExpensesOverride] = useState(null);
  const [propertyTaxOverride, setPropertyTaxOverride] = useState(null);
  const [maintenanceFeeOverride, setMaintenanceFeeOverride] = useState(null);
  const [utilitiesOverride, setUtilitiesOverride] = useState(null);
  const project = PROJECTS.find(p => p.id === selectedId) || PROJECTS[0];
  const mid = (project.budgetMin + project.budgetMax) / 2;

  useEffect(() => {
    setRentOverride(null); setMaintenanceOverride(null); setExitPriceOverride(null);
    setPropertyMode("1"); setInvestmentPropertyRate(DEFAULTS.investmentRate); setCurrentPropertyMortgage(null);
  }, [selectedId]);

  const analysis = useMemo(() => {
    const price = mid;
    const bsd = calcBSD(price);
    const absd = calcABSD(price, profile.residency, 0);
    const absdRate = (DEFAULTS.absd[profile.residency] || DEFAULTS.absd.SC)[0];
    const legalFees = DEFAULTS.legalFees;
    const reno = DEFAULTS.renoFurnishing;
    const downpayment = price * 0.25;
    const loan = price * 0.75;
    const upfront = downpayment + bsd + absd + legalFees + reno;
    const mortgage = calcMonthlyMortgage(loan, DEFAULTS.investmentRate);
    const effectiveRent = rentOverride ?? project.rent;
    const effectiveMaintenance = maintenanceOverride ?? DEFAULTS.maintenanceMthly;
    const mortgageAtRate = calcMonthlyMortgage(loan, investmentPropertyRate);
    const mortgageAtStressTest = calcMonthlyMortgage(loan, DEFAULTS.stressTestRate);
    const adjRent = effectiveRent * DEFAULTS.occupancyRate;
    const propTax = effectiveRent * DEFAULTS.avPctOfRent * DEFAULTS.propTaxRateNROC;
    const carry = effectiveRent > 0 ? adjRent - mortgageAtRate - effectiveMaintenance - propTax : null;
    const grossYield = effectiveRent > 0 ? (effectiveRent * 12) / price : 0;
    const remLoan5 = calcRemainingLoan(loan, investmentPropertyRate, 30, 5);

    const scenarios = {};
    for (const [label, cagr] of [["bear", project.bearCAGR], ["base", project.baseCAGR], ["bull", project.bullCAGR]]) {
      const exitPrice = price * Math.pow(1 + cagr, 5);
      const proceeds = calcNetProceeds({
        salePrice: exitPrice, outstandingLoan: remLoan5, holdMonths: 60,
        cpfPrincipalUsed: downpayment * 0.5, holdYears: 5,
      });
      const exitEquity = proceeds.netCashToSeller;
      const annCarry = carry ? carry * 12 : 0;
      let irr = null;
      try { irr = solveIRR([-upfront, annCarry, annCarry, annCarry, annCarry, annCarry + exitEquity]); } catch {}
      scenarios[label] = { cagr, exitPrice, exitEquity, irr };
    }

    return { price, bsd, absd, absdRate, legalFees, reno, downpayment, loan, upfront, mortgage: mortgageAtRate, mortgageAtStressTest, effectiveRent, effectiveMaintenance, adjRent, propTax, carry, grossYield, remLoan5, scenarios };
  }, [selectedId, profile, mid, project, rentOverride, maintenanceOverride, investmentPropertyRate];

  return <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
    {/* Project Selector */}
    <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
      <span style={{ fontSize:10, color:"#888", fontFamily:fonts.mono, letterSpacing:1 }}>SELECT PROJECT:</span>
      {PROJECTS.filter(p=>p.priority==="PRIMARY"||p.priority==="SECONDARY").map(p => (
        <button key={p.id} onClick={()=>setSelectedId(p.id)} style={{ padding:"6px 14px", border:`1px solid ${selectedId===p.id?"#0F4C81":"#D0D0D0"}`, borderRadius:4, background:selectedId===p.id?"#0F4C81":"#fff", color:selectedId===p.id?"#fff":"#333", fontSize:11, fontFamily:fonts.sans, cursor:"pointer", fontWeight:selectedId===p.id?700:400 }}>
          {p.name}
        </button>
      ))}
      <select onChange={e=>setSelectedId(Number(e.target.value))} value={selectedId} style={{ padding:"6px 8px", border:"1px solid #D0D0D0", borderRadius:4, fontSize:11, fontFamily:fonts.sans }}>
        {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.id}. {p.name} ({p.priority})</option>)}
      </select>
    </div>

    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
      {/* Acquisition */}
      <Card style={{ padding:16 }}>
        <SectionHeader>Acquisition Cost Breakdown</SectionHeader>
        {[
          ["Purchase Price (midpoint)", f$(analysis.price), null, null],
          ["Buyer Stamp Duty (BSD)", f$(analysis.bsd), null, "Tiered: 1% on first $180K · 2% next $180K · 3% next $640K · 4% next $500K · 5% next $1.5M · 6% above $3M"],
          ["ABSD", f$(analysis.absd), analysis.absd===0?`Zero — ${profile.residency} 1st property`:null,
            `SC: 0% (1st), 20% (2nd), 35% (3rd+)\nPR: 5% (1st), 30% (2nd), 35% (3rd+)\nForeigner: 60% on all\n\nUsing: ${profile.residency} · 1st purchase assumed · Rate applied: ${(analysis.absdRate*100).toFixed(0)}%`],
          ["Legal Fees", f$(analysis.legalFees), null, "Estimated conveyancing fees. Actual varies by lawyer. Typically $2,500–$3,800."],
          ["Reno & Furnishing", f$(analysis.reno), null, "Estimated costs to furnish for rental. Adjust via project data if actual quote available."],
          ["Downpayment (25%)", f$(analysis.downpayment), null, "MAS rules: minimum 25% for 1st private property. At least 5% must be cash; balance can be CPF OA."],
        ].map(([l,v,n,tip]) => (
          <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:"1px solid #F5F5F5" }}>
            <span style={{ fontSize:12, color:"#444", fontFamily:fonts.sans, display:"flex", alignItems:"center" }}>{l}{tip && <Tooltip text={tip} />}</span>
            <div style={{ textAlign:"right" }}>
              <span style={{ fontSize:12, fontWeight:600, fontFamily:fonts.mono }}>{v}</span>
              {n && <span style={{ fontSize:10, color:"#2E7D32", marginLeft:8 }}>{n}</span>}
            </div>
          </div>
        ))}
        <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderTop:"2px solid #0F4C81", marginTop:4 }}>
          <span style={{ fontSize:13, fontWeight:700, color:"#0F4C81" }}>TOTAL UPFRONT CASH</span>
          <span style={{ fontSize:13, fontWeight:700, fontFamily:fonts.mono, color:"#0F4C81" }}>{f$(analysis.upfront)}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", padding:"6px 0" }}>
          <span style={{ fontSize:12, color:"#555" }}>Loan Amount (75% LTV)</span>
          <span style={{ fontSize:12, fontFamily:fonts.mono, fontWeight:600 }}>{f$(analysis.loan)}</span>
        </div>
      </Card>

      {/* Monthly Cashflow */}
      <Card style={{ padding:16 }}>
        <SectionHeader>Monthly Cash Flow (Year 1)</SectionHeader>
        {/* Gross Monthly Rent — editable */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:"1px solid #F5F5F5" }}>
          <span style={{ fontSize:12, color:"#444", fontFamily:fonts.sans, display:"flex", alignItems:"center" }}>
            Gross Monthly Rent
            <Tooltip text={`Market rent estimate from project data. 90% occupancy rate applied (${fPct(DEFAULTS.occupancyRate)} of ${f$(analysis.effectiveRent)} = ${f$(analysis.adjRent)} effective). Edit the value to model different rental assumptions.`} />
          </span>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <input type="text" value={rentOverride !== null ? Number(rentOverride).toLocaleString("en-SG") : (analysis.effectiveRent > 0 ? Number(analysis.effectiveRent).toLocaleString("en-SG") : "")}
              onChange={e => setRentOverride(Number(e.target.value.replace(/,/g,"")) || 0)}
              placeholder={f$(project.rent)}
              style={{ width:90, padding:"4px 6px", border:"1px solid #D0E4F5", borderRadius:4, fontSize:11, fontFamily:fonts.mono, color:"#2E7D32", background: rentOverride !== null ? "#E8F5E9" : "#F8FFF8", textAlign:"right" }} />
            {rentOverride !== null && <button onClick={() => setRentOverride(null)} style={{ fontSize:10, color:"#C62828", background:"none", border:"none", cursor:"pointer", padding:0 }}>✕</button>}
          </div>
        </div>
        {/* Occupancy-adjusted */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:"1px solid #F5F5F5" }}>
          <span style={{ fontSize:12, color:"#999", fontFamily:fonts.sans, paddingLeft:10 }}>Occupancy-Adjusted (90%)</span>
          <span style={{ fontSize:12, fontWeight:600, fontFamily:fonts.mono, color:"#2E7D32" }}>{f$(analysis.adjRent)}</span>
        </div>
        {/* Mortgage */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:"1px solid #F5F5F5" }}>
          <span style={{ fontSize:12, color:"#444", fontFamily:fonts.sans, display:"flex", alignItems:"center" }}>
            Monthly Mortgage (P+I)
            <Tooltip text={`Principal + interest at ${(DEFAULTS.investmentRate*100).toFixed(1)}% p.a. over 30 years.\nLoan: ${f$(analysis.loan)} (75% LTV)\nStress test at ${(DEFAULTS.stressTestRate*100).toFixed(0)}% would be ${f$(calcMonthlyMortgage(analysis.loan, DEFAULTS.stressTestRate))}/mo`} />
          </span>
          <span style={{ fontSize:12, fontWeight:600, fontFamily:fonts.mono, color:"#C62828" }}>-{f$(analysis.mortgage)}</span>
        </div>
        {/* Maintenance — editable */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:"1px solid #F5F5F5" }}>
          <span style={{ fontSize:12, color:"#444", fontFamily:fonts.sans, display:"flex", alignItems:"center" }}>
            Maintenance (est.)
            <Tooltip text={`Monthly maintenance fee. Default: $${DEFAULTS.maintenanceMthly} (estimated). Varies by project size, age, and unit type. Edit to use actual figure.`} />
          </span>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <input type="text" value={maintenanceOverride !== null ? Number(maintenanceOverride).toLocaleString("en-SG") : Number(analysis.effectiveMaintenance).toLocaleString("en-SG")}
              onChange={e => setMaintenanceOverride(Number(e.target.value.replace(/,/g,"")) || 0)}
              style={{ width:90, padding:"4px 6px", border:"1px solid #D0E4F5", borderRadius:4, fontSize:11, fontFamily:fonts.mono, color:"#C62828", background: maintenanceOverride !== null ? "#FEF2F2" : "#FFF8F8", textAlign:"right" }} />
            {maintenanceOverride !== null && <button onClick={() => setMaintenanceOverride(null)} style={{ fontSize:10, color:"#C62828", background:"none", border:"none", cursor:"pointer", padding:0 }}>✕</button>}
          </div>
        </div>
        {/* Property Tax */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:"1px solid #F5F5F5" }}>
          <span style={{ fontSize:12, color:"#444", fontFamily:fonts.sans, display:"flex", alignItems:"center" }}>
            Property Tax (NROC)
            <Tooltip text={`Non-owner-occupier residential tax:\nAnnual Value = Gross Rent × ${(DEFAULTS.avPctOfRent*100).toFixed(0)}% = $${Math.round(analysis.effectiveRent*DEFAULTS.avPctOfRent*12).toLocaleString()}/yr\nTax = AV × ${(DEFAULTS.propTaxRateNROC*100).toFixed(0)}% NROC rate\n= ${f$(analysis.propTax)}/mo`} />
          </span>
          <span style={{ fontSize:12, fontWeight:600, fontFamily:fonts.mono, color:"#C62828" }}>-{f$(analysis.propTax)}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderTop:"2px solid " + (analysis.carry >= 0 ? "#2E7D32" : "#C62828"), marginTop:4 }}>
          <span style={{ fontSize:13, fontWeight:700, color:analysis.carry >= 0 ? "#2E7D32" : "#C62828" }}>NET MONTHLY CARRY</span>
          <span style={{ fontSize:13, fontWeight:700, fontFamily:fonts.mono, color:analysis.carry >= 0 ? "#2E7D32" : "#C62828" }}>{fCarry(analysis.carry)}</span>
        </div>
        <div style={{ padding:"10px 0", display:"flex", gap:20, flexWrap:"wrap" }}>
          <Metric label="Gross Yield" value={fPct(analysis.grossYield)} accent={analysis.grossYield >= 0.037 ? "#2E7D32" : "#E65100"} />
          <Metric label="Annual Carry" value={analysis.carry != null ? f$(analysis.carry * 12) : "-"} accent="#C62828" />
          <Metric label="5yr Carry Reserve" value={analysis.carry != null ? f$(Math.abs(analysis.carry) * 12 * 5) : "-"} accent="#555" />
        </div>
        {/* Rainy Day Fund */}
        {(() => {
          const rainyDay = (profile.monthlyExpenses + analysis.mortgage) * 24;
          return (
            <div style={{ marginTop:8, padding:"10px 12px", background:"#FFF8E1", borderRadius:6, border:"1px solid #FFE082" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:11, color:"#795548", fontFamily:fonts.sans, display:"flex", alignItems:"center" }}>
                  <span style={{ fontWeight:700, marginRight:4 }}>Rainy Day Fund Required</span>
                  <Tooltip text={`2-year income-loss buffer:\n(Monthly expenses $${profile.monthlyExpenses.toLocaleString()} + Mortgage ${f$(analysis.mortgage)}) × 24 months\n= ${f$(rainyDay)}\n\nThis is the minimum cash reserve the buyer should hold in accessible savings after all upfront costs are paid.`} />
                </span>
                <span style={{ fontSize:14, fontWeight:700, fontFamily:fonts.mono, color:"#E65100" }}>{f$(rainyDay)}</span>
              </div>
              <div style={{ fontSize:10, color:"#795548", marginTop:4 }}>
                Living expenses ${profile.monthlyExpenses.toLocaleString()}/mo + mortgage {f$(analysis.mortgage)}/mo × 24 months
              </div>
            </div>
          );
        })()}
      </Card>
    </div>

    {/* Household Cash Position */}
    <Card style={{ padding:16 }}>
      <SectionHeader>Household Cash Position</SectionHeader>
      <div style={{ display:"flex", gap:16, alignItems:"center", padding:"8px 0 12px", borderBottom:"1px solid #F0F0F0" }}>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <span style={{ fontSize:10, color:"#666", fontFamily:fonts.mono, fontWeight:600 }}>MODE:</span>
          <button onClick={() => setPropertyMode("1")} style={{ padding:"4px 10px", border:`1px solid ${propertyMode==="1"?"#0F4C81":"#D0D0D0"}`, borderRadius:4, background:propertyMode==="1"?"#0F4C81":"#fff", color:propertyMode==="1"?"#fff":"#333", fontSize:10, fontFamily:fonts.sans, cursor:"pointer", fontWeight:propertyMode==="1"?600:400 }}>1 Property</button>
          <button onClick={() => setPropertyMode("2")} style={{ padding:"4px 10px", border:`1px solid ${propertyMode==="2"?"#0F4C81":"#D0D0D0"}`, borderRadius:4, background:propertyMode==="2"?"#0F4C81":"#fff", color:propertyMode==="2"?"#fff":"#333", fontSize:10, fontFamily:fonts.sans, cursor:"pointer", fontWeight:propertyMode==="2"?600:400 }}>Dual Property</button>
        </div>
        <span style={{ fontSize:10, color:"#999", fontFamily:fonts.sans, marginLeft:"auto" }}>Income shown as: Primary Only | Full Household (columns below)</span>
      </div>

      {/* Inputs Section */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, padding:"12px 0", borderBottom:"1px solid #F0F0F0", marginBottom:12 }}>
        {/* Col 1: Mortgage Rates */}
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:"#0F4C81", letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>Mortgage Rates</div>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0" }}>
            <span style={{ fontSize:11, color:"#555", fontFamily:fonts.sans, flex:1 }}>This Property Rate</span>
            <input type="number" step="0.01" min="0" max="10" value={investmentPropertyRate*100} onChange={e => setInvestmentPropertyRate(Number(e.target.value)/100)} style={{ width:70, padding:"4px 6px", border:"1px solid #D0E4F5", borderRadius:4, fontSize:10, fontFamily:fonts.mono, color:"#1A73E8", textAlign:"right" }} />
            <span style={{ fontSize:10, color:"#666" }}>%</span>
          </div>
          <div style={{ fontSize:9, color:"#999", padding:"2px 0 6px" }}>Stress test (4%): {f$(calcMonthlyMortgage(analysis.loan, 0.04))}/mo</div>
          {propertyMode==="2" && (
            <>
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 0" }}>
                <span style={{ fontSize:11, color:"#555", fontFamily:fonts.sans, flex:1 }}>Current Property Rate</span>
                <input type="number" step="0.01" min="0" max="10" value={currentPropertyRate*100} onChange={e => setCurrentPropertyRate(Number(e.target.value)/100)} style={{ width:70, padding:"4px 6px", border:"1px solid #D0E4F5", borderRadius:4, fontSize:10, fontFamily:fonts.mono, color:"#1A73E8", textAlign:"right" }} />
                <span style={{ fontSize:10, color:"#666" }}>%</span>
              </div>
              <div style={{ fontSize:9, color:"#999", padding:"2px 0 6px" }}>Stress test (4%): {currentPropertyMortgage ? f$(calcMonthlyMortgage(currentPropertyMortgage, 0.04)) : "—"}/mo</div>
            </>
          )}
        </div>

        {/* Col 2: CPF & Expenses */}
        <div>
          <div style={{ fontSize:10, fontWeight:700, color:"#0F4C81", letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>CPF & Living Expenses</div>
          <div style={{ fontSize:9, color:"#666", padding:"4px 0", borderBottom:"1px solid #F0F0F0", marginBottom:6 }}>
            <div>Primary CPF: {f$((cpfPrimaryAlloc ?? (profile.grossIncomeA * (DEFAULTS.cpfRates[profile.ageBracketA]?.total||0.37) * (DEFAULTS.cpfRates[profile.ageBracketA]?.oaRatio||0.62))))}</div>
            {profile.grossIncomeB > 0 && <div>Secondary CPF: {f$((cpfSecondaryAlloc ?? 0))}</div>}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0" }}>
            <span style={{ fontSize:10, color:"#555", fontFamily:fonts.sans, flex:1 }}>Monthly Expenses</span>
            <input type="text" value={monthlyExpensesOverride !== null ? Number(monthlyExpensesOverride).toLocaleString("en-SG") : Number(profile.monthlyExpenses).toLocaleString("en-SG")} onChange={e => setMonthlyExpensesOverride(Number(e.target.value.replace(/,/g,"")) || 0)} style={{ width:85, padding:"4px 6px", border:"1px solid #D0E4F5", borderRadius:4, fontSize:10, fontFamily:fonts.mono, color:"#C62828", background:monthlyExpensesOverride !== null?"#FEF2F2":"#FFF8F8", textAlign:"right" }} />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0" }}>
            <span style={{ fontSize:10, color:"#555", fontFamily:fonts.sans, flex:1 }}>Property Tax</span>
            <input type="text" value={propertyTaxOverride !== null ? Number(propertyTaxOverride).toLocaleString("en-SG") : Number(profile.propertyTax).toLocaleString("en-SG")} onChange={e => setPropertyTaxOverride(Number(e.target.value.replace(/,/g,"")) || 0)} style={{ width:85, padding:"4px 6px", border:"1px solid #D0E4F5", borderRadius:4, fontSize:10, fontFamily:fonts.mono, color:"#C62828", background:propertyTaxOverride !== null?"#FEF2F2":"#FFF8F8", textAlign:"right" }} />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0" }}>
            <span style={{ fontSize:10, color:"#555", fontFamily:fonts.sans, flex:1 }}>Maintenance</span>
            <input type="text" value={maintenanceFeeOverride !== null ? Number(maintenanceFeeOverride).toLocaleString("en-SG") : Number(profile.maintenance).toLocaleString("en-SG")} onChange={e => setMaintenanceFeeOverride(Number(e.target.value.replace(/,/g,"")) || 0)} style={{ width:85, padding:"4px 6px", border:"1px solid #D0E4F5", borderRadius:4, fontSize:10, fontFamily:fonts.mono, color:"#C62828", background:maintenanceFeeOverride !== null?"#FEF2F2":"#FFF8F8", textAlign:"right" }} />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0" }}>
            <span style={{ fontSize:10, color:"#555", fontFamily:fonts.sans, flex:1 }}>Utilities</span>
            <input type="text" value={utilitiesOverride !== null ? Number(utilitiesOverride).toLocaleString("en-SG") : Number(profile.utilities).toLocaleString("en-SG")} onChange={e => setUtilitiesOverride(Number(e.target.value.replace(/,/g,"")) || 0)} style={{ width:85, padding:"4px 6px", border:"1px solid #D0E4F5", borderRadius:4, fontSize:10, fontFamily:fonts.mono, color:"#C62828", background:utilitiesOverride !== null?"#FEF2F2":"#FFF8F8", textAlign:"right" }} />
          </div>
        </div>
      </div>

      {/* Waterfall Calculation - displayed as 2 columns */}
      {(() => {
        const primaryIncome = profile.grossIncomeA;
        const secondaryIncome = profile.grossIncomeB || 0;
        const primaryCpf = DEFAULTS.cpfRates[profile.ageBracketA]?.employee || 0.20;
        const secondaryCpf = profile.ageBracketB ? (DEFAULTS.cpfRates[profile.ageBracketB]?.employee || 0.20) : 0;
        const primaryNetTakeHome = primaryIncome * (1 - primaryCpf);
        const secondaryNetTakeHome = secondaryIncome * (1 - secondaryCpf);
        const householdNetTakeHome = primaryNetTakeHome + secondaryNetTakeHome;

        const mortgagePayment = analysis.mortgage;
        const mortgageStressTest = analysis.mortgageAtStressTest;
        const cpfToMortgage = cpfPrimaryAlloc !== null ? cpfPrimaryAlloc : (primaryIncome * (DEFAULTS.cpfRates[profile.ageBracketA]?.total || 0.37) * (DEFAULTS.cpfRates[profile.ageBracketA]?.oaRatio || 0.62));
        const cpfSecondary = cpfSecondaryAlloc || 0;
        const totalCpfOffset = cpfToMortgage + cpfSecondary;
        const cashMortgageOutlay = Math.max(0, mortgagePayment - totalCpfOffset);

        const monthlyExpenses = monthlyExpensesOverride !== null ? monthlyExpensesOverride : profile.monthlyExpenses;
        const propertyTax = propertyTaxOverride !== null ? propertyTaxOverride : profile.propertyTax;
        const maintenanceFee = maintenanceFeeOverride !== null ? maintenanceFeeOverride : profile.maintenance;
        const utilities = utilitiesOverride !== null ? utilitiesOverride : profile.utilities;
        const totalExpenses = monthlyExpenses + propertyTax + maintenanceFee + utilities + profile.existingCommitments;

        const primaryRemaining = primaryNetTakeHome - cashMortgageOutlay - totalExpenses;
        const householdRemaining = householdNetTakeHome - cashMortgageOutlay - totalExpenses;

        const primaryTdsr = mortgagePayment / primaryIncome;
        const primaryTdsrStress = mortgageStressTest / primaryIncome;
        const householdTdsr = mortgagePayment / (householdNetTakeHome || 1);
        const householdTdsrStress = mortgageStressTest / (householdNetTakeHome || 1);

        return (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
            {/* Column 1: Primary Only */}
            <div style={{ borderRight:"1px solid #E0E0E0", paddingRight:16 }}>
              <div style={{ fontSize:10, fontWeight:700, color:"#0F4C81", letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>Primary Earner Only</div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11, color:"#555" }}>
                <span>Gross Monthly</span>
                <span style={{ fontWeight:600, fontFamily:fonts.mono }}>{f$(primaryIncome)}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11, color:"#999" }}>
                <span>CPF Deduction ({(primaryCpf*100).toFixed(0)}%)</span>
                <span style={{ fontWeight:600, fontFamily:fonts.mono }}>-{f$(primaryIncome * primaryCpf)}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0 8px", fontSize:11, color:"#333", borderBottom:"1px solid #F0F0F0", fontWeight:600 }}>
                <span>Net Take-Home</span>
                <span style={{ fontFamily:fonts.mono }}>{f$(primaryNetTakeHome)}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11, color:"#555" }}>
                <span>Mortgage (P+I) @ {(investmentPropertyRate*100).toFixed(2)}%</span>
                <span style={{ fontWeight:600, fontFamily:fonts.mono }}>({f$(mortgagePayment)})</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:9, color:"#999" }}>
                <span style={{paddingLeft:10}}>Stress test @ 4%</span>
                <span style={{ fontFamily:fonts.mono }}>({f$(mortgageStressTest)})</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11, color:"#555" }}>
                <span>Less CPF to Mortgage</span>
                <span style={{ fontWeight:600, fontFamily:fonts.mono, color:"#2E7D32" }}>+{f$(totalCpfOffset)}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0 8px", fontSize:11, color:"#333", borderBottom:"1px solid #F0F0F0", fontWeight:600 }}>
                <span>Cash Mortgage Outlay</span>
                <span style={{ fontFamily:fonts.mono, color:"#C62828" }}>({f$(cashMortgageOutlay)})</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:10, color:"#666" }}>
                <span>TDSR (actual)</span>
                <span style={{ fontWeight:700, fontFamily:fonts.mono, color:primaryTdsr<=0.55?"#2E7D32":"#C62828" }}>{fPct(primaryTdsr)} {primaryTdsr<=0.55?"✓":"✗"}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0 8px", fontSize:10, color:"#666", borderBottom:"1px solid #F0F0F0" }}>
                <span>TDSR (stress @ 4%)</span>
                <span style={{ fontWeight:700, fontFamily:fonts.mono, color:primaryTdsrStress<=0.55?"#2E7D32":"#C62828" }}>{fPct(primaryTdsrStress)} {primaryTdsrStress<=0.55?"✓":"✗"}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11 }}>
                <span style={{color:"#555"}}>Less Monthly Expenses</span>
                <span style={{ fontWeight:600, fontFamily:fonts.mono, color:"#C62828" }}>({f$(monthlyExpenses)})</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:10, color:"#666" }}>
                <span>Property Tax · Maintenance · Utilities · Commitments</span>
                <span style={{ fontFamily:fonts.mono }}>({f$(propertyTax + maintenanceFee + utilities + profile.existingCommitments)})</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", fontSize:12, fontWeight:700, color:primaryRemaining>=0?"#2E7D32":"#C62828", borderTop:"2px solid #0F4C81", marginTop:4 }}>
                <span>NET REMAINING</span>
                <span style={{ fontFamily:fonts.mono }}>{fCarry(primaryRemaining)}</span>
              </div>
              {primaryRemaining < 0 && (
                <>
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11, color:"#E65100", fontWeight:700 }}>
                    <span>1-Year Buffer Needed</span>
                    <span style={{ fontFamily:fonts.mono }}>{f$(Math.abs(primaryRemaining) * 12)}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11, color:"#E65100", fontWeight:700 }}>
                    <span>2-Year Buffer Needed</span>
                    <span style={{ fontFamily:fonts.mono }}>{f$(Math.abs(primaryRemaining) * 24)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Column 2: Full Household */}
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:"#0F4C81", letterSpacing:1, marginBottom:8, textTransform:"uppercase" }}>Full Household</div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11, color:"#555" }}>
                <span>Gross Monthly (Both)</span>
                <span style={{ fontWeight:600, fontFamily:fonts.mono }}>{f$(primaryIncome + secondaryIncome)}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11, color:"#999" }}>
                <span>CPF Deductions</span>
                <span style={{ fontWeight:600, fontFamily:fonts.mono }}>-{f$(primaryIncome * primaryCpf + secondaryIncome * secondaryCpf)}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0 8px", fontSize:11, color:"#333", borderBottom:"1px solid #F0F0F0", fontWeight:600 }}>
                <span>Net Take-Home</span>
                <span style={{ fontFamily:fonts.mono }}>{f$(householdNetTakeHome)}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11, color:"#555" }}>
                <span>Mortgage (P+I) @ {(investmentPropertyRate*100).toFixed(2)}%</span>
                <span style={{ fontWeight:600, fontFamily:fonts.mono }}>({f$(mortgagePayment)})</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:9, color:"#999" }}>
                <span style={{paddingLeft:10}}>Stress test @ 4%</span>
                <span style={{ fontFamily:fonts.mono }}>({f$(mortgageStressTest)})</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11, color:"#555" }}>
                <span>Less CPF Offsets (Both)</span>
                <span style={{ fontWeight:600, fontFamily:fonts.mono, color:"#2E7D32" }}>+{f$(totalCpfOffset)}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0 8px", fontSize:11, color:"#333", borderBottom:"1px solid #F0F0F0", fontWeight:600 }}>
                <span>Cash Mortgage Outlay</span>
                <span style={{ fontFamily:fonts.mono, color:"#C62828" }}>({f$(cashMortgageOutlay)})</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:10, color:"#666" }}>
                <span>TDSR (actual)</span>
                <span style={{ fontWeight:700, fontFamily:fonts.mono, color:householdTdsr<=0.55?"#2E7D32":"#C62828" }}>{fPct(householdTdsr)} {householdTdsr<=0.55?"✓":"✗"}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0 8px", fontSize:10, color:"#666", borderBottom:"1px solid #F0F0F0" }}>
                <span>TDSR (stress @ 4%)</span>
                <span style={{ fontWeight:700, fontFamily:fonts.mono, color:householdTdsrStress<=0.55?"#2E7D32":"#C62828" }}>{fPct(householdTdsrStress)} {householdTdsrStress<=0.55?"✓":"✗"}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11 }}>
                <span style={{color:"#555"}}>Less Monthly Expenses</span>
                <span style={{ fontWeight:600, fontFamily:fonts.mono, color:"#C62828" }}>({f$(monthlyExpenses)})</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:10, color:"#666" }}>
                <span>Property Tax · Maintenance · Utilities · Commitments</span>
                <span style={{ fontFamily:fonts.mono }}>({f$(propertyTax + maintenanceFee + utilities + profile.existingCommitments)})</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", fontSize:12, fontWeight:700, color:householdRemaining>=0?"#2E7D32":"#C62828", borderTop:"2px solid #0F4C81", marginTop:4 }}>
                <span>NET REMAINING</span>
                <span style={{ fontFamily:fonts.mono }}>{fCarry(householdRemaining)}</span>
              </div>
              {householdRemaining < 0 && (
                <>
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11, color:"#E65100", fontWeight:700 }}>
                    <span>1-Year Buffer Needed</span>
                    <span style={{ fontFamily:fonts.mono }}>{f$(Math.abs(householdRemaining) * 12)}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:11, color:"#E65100", fontWeight:700 }}>
                    <span>2-Year Buffer Needed</span>
                    <span style={{ fontFamily:fonts.mono }}>{f$(Math.abs(householdRemaining) * 24)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })()}
    </Card>

    {/* Exit Scenarios */}
    <Card style={{ padding:16 }}>
      <SectionHeader>Exit Scenarios (Year 5) — Bear / Base / Bull</SectionHeader>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:16, marginTop:8 }}>
        {[["Bear","#78909C"],["Base","#1A73E8"],["Bull","#2E7D32"]].map(([label, color]) => {
          const s = analysis.scenarios[label.toLowerCase()];
          if (!s) return null;
          const meetsTarget = s.irr != null && s.irr >= (profile.goals.targetIRR || 0.10);
          return <div key={label} style={{ padding:14, background:label==="Base"?"#F0F7FF":"#FAFAFA", borderRadius:6, border:`1px solid ${label==="Base"?"#D0E4F5":"#E8E8E8"}` }}>
            <div style={{ fontSize:12, fontWeight:700, color, fontFamily:fonts.mono, letterSpacing:1, marginBottom:8 }}>{label.toUpperCase()} CASE — CAGR {fPct(s.cagr)}</div>
            {[
              ["Exit Price", f$(s.exitPrice)],
              ["Remaining Loan", f$(analysis.remLoan5)],
              ["Exit Equity", f$(s.exitEquity)],
              ["Equity IRR", s.irr != null ? fPct(s.irr) : "N/A"],
            ].map(([l,v]) => (
              <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0" }}>
                <span style={{ fontSize:11, color:"#666", fontFamily:fonts.mono }}>{l}</span>
                <span style={{ fontSize:11, fontWeight:700, fontFamily:fonts.mono, color:l==="Equity IRR"?color:"#1A1A2E" }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:8, padding:"6px 8px", borderRadius:4, background:meetsTarget?"#E8F5E9":"#FEF2F2", fontSize:10, fontWeight:700, fontFamily:fonts.mono, color:meetsTarget?"#2E7D32":"#C62828", textAlign:"center" }}>
              {meetsTarget ? `Meets ${fPct(profile.goals.targetIRR)} target` : `Below ${fPct(profile.goals.targetIRR)} target`}
            </div>
          </div>;
        })}
      </div>
    </Card>

    {/* Net Proceeds Waterfall */}
    <Card style={{ padding:16 }}>
      <SectionHeader>Net Proceeds Waterfall (Base Case, Year 5)</SectionHeader>
      <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0 10px", borderBottom:"1px solid #F0F0F0", marginBottom:4 }}>
        <span style={{ fontSize:11, color:"#666", fontFamily:fonts.sans }}>Gross Exit Price Override</span>
        <Tooltip text={`Override the base-case exit price for modelling purposes. Default uses base CAGR (${(project.baseCAGR*100).toFixed(0)}% p.a.) applied to purchase price over 5 years. Clear (✕) to revert to CAGR-derived price.`} />
        <input type="text" value={exitPriceOverride !== null ? Number(exitPriceOverride).toLocaleString("en-SG") : ""}
          onChange={e => setExitPriceOverride(Number(e.target.value.replace(/,/g,"")) || null)}
          placeholder={f$(analysis.scenarios.base.exitPrice)}
          style={{ width:110, padding:"4px 6px", border:"1px solid #D0E4F5", borderRadius:4, fontSize:11, fontFamily:fonts.mono, color:"#1A73E8", background: exitPriceOverride !== null ? "#E8F0FE" : "#F8FBFF", textAlign:"right" }} />
        {exitPriceOverride !== null && <button onClick={() => setExitPriceOverride(null)} style={{ fontSize:10, color:"#C62828", background:"none", border:"none", cursor:"pointer", padding:0 }}>✕</button>}
      </div>
      {(() => {
        const s = analysis.scenarios.base;
        const effectiveExitPrice = exitPriceOverride ?? s.exitPrice;
        const proc = calcNetProceeds({ salePrice: effectiveExitPrice, outstandingLoan: analysis.remLoan5, holdMonths: 60, cpfPrincipalUsed: analysis.downpayment * 0.5, holdYears: 5 });
        return [
          ["Gross Sale Price", proc.salePrice, "#1A73E8"],
          ["Agent Comm (1%)", -proc.agentComm, "#C62828"],
          ["SSD / Exit Tax", -proc.ssd, proc.ssd === 0 ? "#2E7D32" : "#C62828"],
          ["Legal Fees", -proc.legalFeesSale, "#C62828"],
          ["Gross Proceeds", proc.grossProceeds, "#555"],
          ["Remaining Loan", -proc.outstandingLoan, "#C62828"],
          ["After Loan", proc.afterLoan, "#555"],
          ["CPF Refund (Prin+Int)", -proc.cpfRefund.totalRefund, "#C62828"],
          ["NET CASH TO SELLER", proc.netCashToSeller, "#0F4C81"],
        ].map(([l, v, col], i) => (
          <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom: i === 8 ? "2px solid #0F4C81" : "1px solid #F5F5F5" }}>
            <span style={{ fontSize: i === 8 ? 12 : 11, fontWeight: i === 8 ? 700 : 400, color:"#444", fontFamily:fonts.sans }}>{l}</span>
            <span style={{ fontSize: i === 8 ? 13 : 11, fontWeight: i === 8 ? 700 : 600, fontFamily:fonts.mono, color: col || "#1A1A2E" }}>{f$(v)}</span>
          </div>
        ));
      })()}
    </Card>

    {/* Hold Period Sweep */}
    <Card style={{ padding:16 }}>
      <SectionHeader>Hold Period IRR Sweep (Base CAGR {fPct(project.baseCAGR)})</SectionHeader>
      {(() => {
        const sweep = calcHoldPeriodSweep({
          purchasePrice: analysis.price, upfrontCash: analysis.upfront, loanAmount: analysis.loan,
          mortgageRate: DEFAULTS.investmentRate, loanTenure: 30, monthlyCarry: analysis.carry || 0,
          cagr: project.baseCAGR, cpfPrincipalUsed: analysis.downpayment * 0.5,
        });
        const targetIRR = profile.goals.targetIRR || 0.10;
        return <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", fontSize:10, borderCollapse:"collapse", fontFamily:fonts.mono }}>
            <thead><tr style={{ background:"#F0F7FF" }}>
              {["Hold","Exit $","Net Cash","SSD","IRR","Target?"].map(h => (
                <th key={h} style={{ padding:"6px 8px", textAlign:"right", fontSize:9, color:"#666", fontWeight:600, borderBottom:"1px solid #D0E4F5" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {sweep.map((row, i) => {
                const ssdCliff = row.holdMonths === 36;
                const meetsTarget = row.irr != null && row.irr >= targetIRR;
                return <tr key={row.holdMonths} style={{ background: ssdCliff ? "#FFFDE7" : i % 2 === 0 ? "#fff" : "#F7F8FA" }}>
                  <td style={{ padding:"4px 8px", textAlign:"right", color:"#555" }}>{row.holdYears.toFixed(0)}yr</td>
                  <td style={{ padding:"4px 8px", textAlign:"right", color:"#1A73E8", fontWeight:600 }}>{f$m(row.exitPrice)}</td>
                  <td style={{ padding:"4px 8px", textAlign:"right", color:"#2E7D32", fontWeight:600 }}>{f$k(row.netCashToSeller)}</td>
                  <td style={{ padding:"4px 8px", textAlign:"right", color: row.ssdActive ? "#C62828" : "#888" }}>{row.ssd > 0 ? fPct(row.ssdRateApplied) : "—"}</td>
                  <td style={{ padding:"4px 8px", textAlign:"right", color:"#1A1A2E", fontWeight:700 }}>{row.irrPercent ? `${row.irrPercent}%` : "—"}</td>
                  <td style={{ padding:"4px 8px", textAlign:"center", color: meetsTarget ? "#2E7D32" : "#C62828" }}>{meetsTarget ? "✓" : "✗"}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>;
      })()}
    </Card>

    {/* MOAT Score Summary */}
    <Card style={{ padding:16 }}>
      <SectionHeader>Exit Potential Scoring (MOAT Framework)</SectionHeader>
      {(() => {
        const derived = deriveProjectMetrics(project);
        const moat = computeMoatScores(project, derived);
        const badges = computeBadges(project, derived);
        return <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:"#0F4C81", letterSpacing:1, marginBottom:8 }}>MOAT DIMENSIONS (1–5 scale)</div>
            {Object.entries(moat).filter(([k]) => k !== 'composite').map(([k, v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"4px 0", borderBottom:"1px solid #F5F5F5" }}>
                <span style={{ fontSize:11, color:"#666", fontFamily:fonts.sans }}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span style={{ fontSize:11, fontWeight:700, fontFamily:fonts.mono, color: v >= 4 ? "#2E7D32" : v >= 3 ? "#E65100" : "#C62828", background: v >= 4 ? "#E8F5E9" : v >= 3 ? "#FFF3E0" : "#FEF2F2", padding:"2px 6px", borderRadius:3 }}>{v}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderTop:"2px solid #0F4C81", marginTop:4, fontWeight:700 }}>
              <span style={{ fontSize:11, color:"#0F4C81" }}>COMPOSITE</span>
              <span style={{ fontSize:12, fontFamily:fonts.mono, color:"#0F4C81" }}>{moat.composite}/50</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:"#0F4C81", letterSpacing:1, marginBottom:8 }}>PRE-SCREENING BADGES</div>
            {[
              ["<1km MRT", badges.under1kmMRT],
              ["<10yr old", badges.under10yrOld],
              ["$1M+ HDB nearby", badges.nearMillionHDB],
              ["50+ deals/yr", badges.fiftyPlusDeals],
              ["Top 20 schools", badges.top20School],
              ["HDB MOP 1k+", badges.hdbMopOver1k],
            ].map(([l, p]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0", borderBottom:"1px solid #F5F5F5" }}>
                <span style={{ fontSize:11, color:"#666", fontFamily:fonts.sans, flex:1 }}>{l}</span>
                <span style={{ fontSize:14, color: p ? "#2E7D32" : "#C62828", fontWeight:700 }}>{p ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>
        </div>;
      })()}
    </Card>
  </div>;
}

// ════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ════════════════════════════════════════════════════════════
const TABS = [
  { id: "profile", label: "Profile", icon: "1" },
  { id: "scenarios", label: "Scenarios", icon: "2" },
  { id: "shortlist", label: "Shortlist", icon: "3" },
  { id: "deepdive", label: "Deep Dive", icon: "4" },
];

export default function ConsultationDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  return (
    <div style={{ fontFamily:fonts.sans, background:"#F4F5F7", minHeight:"100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width:4px; height:4px; } ::-webkit-scrollbar-thumb { background:#CBD5E0; border-radius:4px; }
        input:focus, select:focus { outline:none; border-color:#1A73E8 !important; }
      `}</style>

      {/* Header */}
      <div style={{ background:"#0F1923", padding:"20px 28px 16px", borderBottom:"3px solid #1A73E8" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:10, color:"#64B5F6", letterSpacing:3, textTransform:"uppercase", fontFamily:fonts.mono, marginBottom:4 }}>Singapore Residential Property · Consultation System 2026</div>
            <h1 style={{ fontSize:22, fontWeight:700, color:"#fff", fontFamily:fonts.sans, margin:0 }}>Property Consultation Dashboard</h1>
            <div style={{ fontSize:11, color:"#90A4AE", fontFamily:fonts.mono, marginTop:4 }}>Client: {profile.name} · {profile.goals.primaryGoal} · Budget {f$m(profile.goals.budgetCeiling)}</div>
          </div>
          <div style={{ display:"flex", gap:4 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
                padding:"8px 18px", border:"none", borderRadius:"6px 6px 0 0", cursor:"pointer", fontFamily:fonts.sans, fontSize:12, fontWeight:activeTab===t.id?700:400,
                background:activeTab===t.id?"#F4F5F7":"transparent", color:activeTab===t.id?"#0F1923":"#90A4AE",
              }}>
                <span style={{ fontSize:10, fontFamily:fonts.mono, marginRight:4, opacity:0.6 }}>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Carry Warning Banner */}
      <div style={{ background:"#FFF8E1", borderBottom:"1px solid #FFE082", padding:"6px 28px", fontSize:10, color:"#795548", fontFamily:fonts.mono }}>
        All yields are gross (pre-maintenance, tax, vacancy). Investment carry uses {fPct(DEFAULTS.investmentRate)} rate. Own-stay mortgage uses {fPct(DEFAULTS.mortgageRate)} current fixed. TDSR stress-tested at {fPct(DEFAULTS.stressTestRate)}.
      </div>

      {/* Content */}
      <div style={{ padding:"20px 28px 40px" }}>
        {activeTab === "profile" && <ProfileTab profile={profile} setProfile={setProfile} />}
        {activeTab === "scenarios" && <ScenarioTab profile={profile} />}
        {activeTab === "shortlist" && <ShortlistTab profile={profile} />}
        {activeTab === "deepdive" && <DeepDiveTab profile={profile} />}
      </div>
    </div>
  );
}
