import { useState, useMemo, useEffect, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, LineChart, Line
} from "recharts";
import {
  LayoutDashboard, Wallet, List, Target, Lightbulb,
  Bell, Shield, Eye, Plus, Edit2, Trash2, Download, FileText,
  Search, X, ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, ChevronRight, Bot,
  ChevronLeft, ChevronDown, Sun, Moon, Sparkles, Zap,
  Flag, Upload, Calendar, Send, RefreshCw, PiggyBank, Flame, Clock
} from "lucide-react";

/* ─── Config ──────────────────────────────────────────────────────────────── */
const CAT = {
  Income:        { clr:"#39ff14", bg:"rgba(57,255,20,.13)",    icon:"💼", grad:"linear-gradient(135deg,#39ff14,#00ff88)" },
  Housing:       { clr:"#00d4ff", bg:"rgba(0,212,255,.13)",    icon:"🏠", grad:"linear-gradient(135deg,#00d4ff,#7b2fff)" },
  Food:          { clr:"#ff6b35", bg:"rgba(255,107,53,.13)",   icon:"🍔", grad:"linear-gradient(135deg,#ff6b35,#ff0080)" },
  Transport:     { clr:"#bf5fff", bg:"rgba(191,95,255,.13)",   icon:"🚗", grad:"linear-gradient(135deg,#bf5fff,#00d4ff)" },
  Entertainment: { clr:"#ff2d78", bg:"rgba(255,45,120,.13)",   icon:"🎬", grad:"linear-gradient(135deg,#ff2d78,#ff6b35)" },
  Health:        { clr:"#00ffcc", bg:"rgba(0,255,204,.13)",    icon:"💊", grad:"linear-gradient(135deg,#00ffcc,#00d4ff)" },
  Utilities:     { clr:"#ffe600", bg:"rgba(255,230,0,.13)",    icon:"⚡", grad:"linear-gradient(135deg,#ffe600,#ff6b35)" },
  Shopping:      { clr:"#ff0080", bg:"rgba(255,0,128,.13)",    icon:"🛒", grad:"linear-gradient(135deg,#ff0080,#bf5fff)" },
};
const CATS = Object.keys(CAT);
const MONTHS = [{l:"Jan",n:1},{l:"Feb",n:2},{l:"Mar",n:3},{l:"Apr",n:4},{l:"May",n:5},{l:"Jun",n:6}];
const DEFAULT_BUDGETS = { Housing:18000,Food:6000,Transport:3000,Entertainment:2000,Health:3000,Utilities:2000,Shopping:8000 };

/* ─── Seed ────────────────────────────────────────────────────────────────── */
const SEED = [
  {id:1,date:"2026-01-03",description:"Monthly Salary",category:"Income",type:"income",amount:95000,recurring:true},
  {id:2,date:"2026-01-05",description:"Apartment Rent",category:"Housing",type:"expense",amount:18000,recurring:true},
  {id:3,date:"2026-01-07",description:"Swiggy Orders",category:"Food",type:"expense",amount:1850,recurring:false},
  {id:4,date:"2026-01-09",description:"Metro Card Recharge",category:"Transport",type:"expense",amount:500,recurring:false},
  {id:5,date:"2026-01-12",description:"Netflix Subscription",category:"Entertainment",type:"expense",amount:649,recurring:true},
  {id:6,date:"2026-01-15",description:"Freelance Project",category:"Income",type:"income",amount:24000,recurring:false},
  {id:7,date:"2026-01-18",description:"Gym Membership",category:"Health",type:"expense",amount:2500,recurring:true},
  {id:8,date:"2026-01-20",description:"Electricity Bill",category:"Utilities",type:"expense",amount:1200,recurring:true},
  {id:9,date:"2026-01-22",description:"Amazon Shopping",category:"Shopping",type:"expense",amount:3400,recurring:false},
  {id:10,date:"2026-01-25",description:"Dinner with Friends",category:"Food",type:"expense",amount:2100,recurring:false},
  {id:11,date:"2026-01-28",description:"Dividend Income",category:"Income",type:"income",amount:6500,recurring:false},
  {id:12,date:"2026-02-01",description:"Monthly Salary",category:"Income",type:"income",amount:95000,recurring:true},
  {id:13,date:"2026-02-03",description:"Apartment Rent",category:"Housing",type:"expense",amount:18000,recurring:true},
  {id:14,date:"2026-02-06",description:"Grocery Shopping",category:"Food",type:"expense",amount:3200,recurring:false},
  {id:15,date:"2026-02-08",description:"Uber Rides",category:"Transport",type:"expense",amount:1100,recurring:false},
  {id:16,date:"2026-02-10",description:"Movie Tickets",category:"Entertainment",type:"expense",amount:800,recurring:false},
  {id:17,date:"2026-02-14",description:"Valentine's Dinner",category:"Food",type:"expense",amount:4500,recurring:false},
  {id:18,date:"2026-02-16",description:"Consulting Fees",category:"Income",type:"income",amount:15000,recurring:false},
  {id:19,date:"2026-02-19",description:"Phone Bill",category:"Utilities",type:"expense",amount:699,recurring:true},
  {id:20,date:"2026-02-22",description:"Medical Checkup",category:"Health",type:"expense",amount:1800,recurring:false},
  {id:21,date:"2026-02-25",description:"Myntra Clothing",category:"Shopping",type:"expense",amount:5600,recurring:false},
  {id:22,date:"2026-02-27",description:"Interest Income",category:"Income",type:"income",amount:3200,recurring:true},
  {id:23,date:"2026-03-01",description:"Monthly Salary",category:"Income",type:"income",amount:95000,recurring:true},
  {id:24,date:"2026-03-04",description:"Apartment Rent",category:"Housing",type:"expense",amount:18000,recurring:true},
  {id:25,date:"2026-03-06",description:"Zomato Orders",category:"Food",type:"expense",amount:2800,recurring:false},
  {id:26,date:"2026-03-10",description:"Flight Tickets",category:"Transport",type:"expense",amount:12000,recurring:false},
  {id:27,date:"2026-03-12",description:"Spotify Premium",category:"Entertainment",type:"expense",amount:119,recurring:true},
  {id:28,date:"2026-03-15",description:"Freelance Design",category:"Income",type:"income",amount:32000,recurring:false},
  {id:29,date:"2026-03-18",description:"Water Bill",category:"Utilities",type:"expense",amount:450,recurring:true},
  {id:30,date:"2026-03-20",description:"Pharmacy",category:"Health",type:"expense",amount:950,recurring:false},
  {id:31,date:"2026-03-24",description:"Apple Store",category:"Shopping",type:"expense",amount:8900,recurring:false},
  {id:32,date:"2026-03-28",description:"Bonus Payment",category:"Income",type:"income",amount:20000,recurring:false},
  {id:33,date:"2026-04-01",description:"Monthly Salary",category:"Income",type:"income",amount:95000,recurring:true},
  {id:34,date:"2026-04-03",description:"Apartment Rent",category:"Housing",type:"expense",amount:18000,recurring:true},
  {id:35,date:"2026-04-06",description:"Restaurant Meals",category:"Food",type:"expense",amount:3200,recurring:false},
  {id:36,date:"2026-04-09",description:"Auto Fuel",category:"Transport",type:"expense",amount:2500,recurring:false},
  {id:37,date:"2026-04-12",description:"Amazon Prime",category:"Entertainment",type:"expense",amount:149,recurring:true},
  {id:38,date:"2026-04-15",description:"Freelance Writing",category:"Income",type:"income",amount:18000,recurring:false},
  {id:39,date:"2026-04-18",description:"Internet Bill",category:"Utilities",type:"expense",amount:799,recurring:true},
  {id:40,date:"2026-04-21",description:"Yoga Classes",category:"Health",type:"expense",amount:1500,recurring:false},
  {id:41,date:"2026-04-24",description:"Fashion Shopping",category:"Shopping",type:"expense",amount:4200,recurring:false},
  {id:42,date:"2026-04-27",description:"Stock Dividend",category:"Income",type:"income",amount:4500,recurring:false},
  {id:43,date:"2026-05-01",description:"Monthly Salary",category:"Income",type:"income",amount:95000,recurring:true},
  {id:44,date:"2026-05-03",description:"Apartment Rent",category:"Housing",type:"expense",amount:18000,recurring:true},
  {id:45,date:"2026-05-06",description:"Food Delivery",category:"Food",type:"expense",amount:2100,recurring:false},
  {id:46,date:"2026-05-09",description:"Bus Pass",category:"Transport",type:"expense",amount:800,recurring:true},
  {id:47,date:"2026-05-12",description:"Netflix",category:"Entertainment",type:"expense",amount:649,recurring:true},
  {id:48,date:"2026-05-15",description:"Side Project",category:"Income",type:"income",amount:12000,recurring:false},
  {id:49,date:"2026-05-18",description:"Gas Bill",category:"Utilities",type:"expense",amount:950,recurring:true},
  {id:50,date:"2026-05-21",description:"Gym Fees",category:"Health",type:"expense",amount:2000,recurring:false},
  {id:51,date:"2026-05-24",description:"Online Shopping",category:"Shopping",type:"expense",amount:3800,recurring:false},
  {id:52,date:"2026-05-27",description:"Rental Income",category:"Income",type:"income",amount:8000,recurring:false},
  {id:53,date:"2026-06-01",description:"Monthly Salary",category:"Income",type:"income",amount:95000,recurring:true},
  {id:54,date:"2026-06-03",description:"Apartment Rent",category:"Housing",type:"expense",amount:18000,recurring:true},
  {id:55,date:"2026-06-06",description:"Groceries",category:"Food",type:"expense",amount:4500,recurring:false},
  {id:56,date:"2026-06-09",description:"Taxi Rides",category:"Transport",type:"expense",amount:1800,recurring:false},
  {id:57,date:"2026-06-12",description:"Concert Tickets",category:"Entertainment",type:"expense",amount:2500,recurring:false},
  {id:58,date:"2026-06-15",description:"Consulting",category:"Income",type:"income",amount:25000,recurring:false},
  {id:59,date:"2026-06-18",description:"Water Bill",category:"Utilities",type:"expense",amount:600,recurring:true},
  {id:60,date:"2026-06-21",description:"Doctor Visit",category:"Health",type:"expense",amount:1200,recurring:false},
  {id:61,date:"2026-06-24",description:"Clothing Store",category:"Shopping",type:"expense",amount:5500,recurring:false},
  {id:62,date:"2026-06-27",description:"Investment Returns",category:"Income",type:"income",amount:6500,recurring:false},
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmt  = n => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmtK = n => n>=100000?`₹${(n/100000).toFixed(1)}L`:n>=1000?`₹${(n/1000).toFixed(1)}K`:`₹${n}`;
const fmtD = d => new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"2-digit"});
const pct  = (a,b) => b>0?((a/b)*100).toFixed(1):"0.0";
const clamp= (v,lo,hi)=>Math.max(lo,Math.min(hi,v));

/* ─── Animated Counter ───────────────────────────────────────────────────── */
function useCounter(target,dur=900){
  const [v,setV]=useState(0);
  const r=useRef(null);
  useEffect(()=>{
    const t0=performance.now();
    const run=t=>{const p=clamp((t-t0)/dur,0,1);setV(Math.round(p*target));if(p<1)r.current=requestAnimationFrame(run);};
    r.current=requestAnimationFrame(run);
    return()=>cancelAnimationFrame(r.current);
  },[target]);
  return v;
}

/* ─── Tooltip ────────────────────────────────────────────────────────────── */
function Tip({active,payload,label}){
  if(!active||!payload?.length)return null;
  return(
    <div style={{background:"rgba(2,6,23,.96)",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,padding:"10px 14px",boxShadow:"0 20px 40px rgba(0,0,0,.5)"}}>
      <div style={{fontSize:10,color:"#64748b",marginBottom:5,textTransform:"uppercase",letterSpacing:".8px"}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:600,color:p.color||"#e2e8f0",marginTop:2,display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:p.color,display:"inline-block"}}/>
          {p.name}: {fmt(p.value)}
        </div>
      ))}
    </div>
  );
}

/* ─── Health Gauge ───────────────────────────────────────────────────────── */
function HealthGauge({score}){
  const r=44,circ=2*Math.PI*r;
  const clr=score>=75?"#4ade80":score>=50?"#fbbf24":"#f87171";
  const lbl=score>=75?"Excellent":score>=60?"Good":score>=40?"Fair":"Poor";
  return(
    <svg width={120} height={120} viewBox="0 0 120 120">
      <circle cx={60} cy={60} r={r} fill="none" stroke="rgba(255,255,255,.05)" strokeWidth={11} strokeDasharray={`${circ*.75} ${circ*.25}`} strokeDashoffset={circ*.125} strokeLinecap="round" transform="rotate(135,60,60)"/>
      <circle cx={60} cy={60} r={r} fill="none" stroke={clr} strokeWidth={11} strokeDasharray={`${(score/100)*circ*.75} ${circ}`} strokeDashoffset={circ*.125} strokeLinecap="round" transform="rotate(135,60,60)" style={{transition:"stroke-dasharray 1.2s ease",filter:`drop-shadow(0 0 6px ${clr})`}}/>
      <text x={60} y={56} textAnchor="middle" fill="white" fontSize={22} fontWeight={700} fontFamily="'JetBrains Mono',monospace">{score}</text>
      <text x={60} y={72} textAnchor="middle" fill={clr} fontSize={9} fontWeight={700} fontFamily="'DM Sans',sans-serif" letterSpacing={1}>{lbl.toUpperCase()}</text>
    </svg>
  );
}

const PER_PAGE = 10;

/* ─── CSS ────────────────────────────────────────────────────────────────── */
const getCSS = (isDark) => `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{width:100%;max-width:100%;margin:0;padding:0}

:root{
  --bg:${isDark?"#04050f":"#f0eeff"};
  --surf:${isDark?"#080a1a":"#ffffff"};
  --card:${isDark?"#0b0d20":"#ffffff"};
  --card2:${isDark?"#0f1128":"#f5f0ff"};
  --hov:${isDark?"#141630":"#ede8ff"};
  --b0:${isDark?"rgba(180,140,255,.06)":"rgba(120,80,255,.07)"};
  --b1:${isDark?"rgba(180,140,255,.12)":"rgba(120,80,255,.14)"};
  --b2:${isDark?"rgba(180,140,255,.25)":"rgba(120,80,255,.28)"};

  /* Neon Palette */
  --neon-pink:#ff2d78;
  --neon-cyan:#00d4ff;
  --neon-green:#39ff14;
  --neon-purple:#bf5fff;
  --neon-gold:#ffe600;
  --neon-orange:#ff6b35;
  --neon-teal:#00ffcc;
  --neon-blue:#2979ff;

  --primary:var(--neon-purple);
  --success:var(--neon-green);
  --danger:var(--neon-pink);
  --warning:var(--neon-gold);
  --accent:var(--neon-cyan);

  --tx:${isDark?"#eae6ff":"#12082a"};
  --su:${isDark?"#9d8ec8":"#6b5a9a"};
  --mu:${isDark?"#4a3d70":"#b8aed8"};
  --fn:'DM Sans',sans-serif;
  --fm:'JetBrains Mono',monospace;
  --fd:'Syne',sans-serif;
  --r:10px;--r2:14px;--r3:18px;
}

@keyframes aurora{
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@keyframes sparkle{
  0%,100%{opacity:0;transform:scale(0) rotate(0deg)}
  50%{opacity:1;transform:scale(1) rotate(180deg)}
}
@keyframes glow-pulse{
  0%,100%{opacity:.6}
  50%{opacity:1}
}
@keyframes float{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-6px)}
}
@keyframes shimmer{
  0%{background-position:-200% center}
  100%{background-position:200% center}
}

html,body{
  background:var(--bg);
  font-family:var(--fn);
  color:var(--tx);
  overflow-x:hidden;
  min-height:100vh;
  width:100%;
  max-width:100%;
  margin:0;
  padding:0;
  position:relative;
}
html::before{
  content:'';
  position:fixed;inset:0;
  background:
    radial-gradient(ellipse 60% 40% at 20% 0%,${isDark?"rgba(191,95,255,.18)":"rgba(191,95,255,.08)"} 0%,transparent 70%),
    radial-gradient(ellipse 50% 35% at 80% 10%,${isDark?"rgba(0,212,255,.14)":"rgba(0,212,255,.07)"} 0%,transparent 70%),
    radial-gradient(ellipse 40% 30% at 50% 100%,${isDark?"rgba(255,45,120,.12)":"rgba(255,45,120,.06)"} 0%,transparent 70%),
    radial-gradient(ellipse 35% 25% at 5% 80%,${isDark?"rgba(57,255,20,.08)":"rgba(57,255,20,.04)"} 0%,transparent 70%);
  pointer-events:none;z-index:0;
  animation:aurora 20s ease infinite;
  background-size:400% 400%;
}

* { transition:background-color .25s ease,color .25s ease,border-color .25s ease; }

.app{display:flex;min-height:100vh;width:100%;max-width:100%;position:relative;z-index:1;overflow:hidden}

/* ── SIDEBAR ── */
.sb{
  width:240px;flex-shrink:0;flex-grow:0;
  background:${isDark?"rgba(8,10,26,0.96)":"rgba(255,252,255,0.97)"};
  border-right:1px solid var(--b1);
  display:flex;flex-direction:column;
  position:sticky;top:0;height:100vh;
  backdrop-filter:blur(24px);
  z-index:200;
  box-shadow:4px 0 30px rgba(191,95,255,.08);
}
.sb.min{width:64px;flex-shrink:0;flex-grow:0}

.sb-logo{
  display:flex;align-items:center;gap:12px;
  padding:20px 18px;
  border-bottom:1px solid var(--b1);
  position:relative;
}
.sb-logo::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--neon-purple),var(--neon-cyan),transparent);
  opacity:.6;
}
.sb-icon{
  width:38px;height:38px;border-radius:10px;
  background:linear-gradient(135deg,#bf5fff,#00d4ff);
  display:flex;align-items:center;justify-content:center;
  font-size:18px;flex-shrink:0;
  box-shadow:0 4px 16px rgba(191,95,255,.5),0 0 24px rgba(0,212,255,.2);
}
.sb-name{font-family:var(--fd);font-size:19px;font-weight:800;letter-spacing:-.5px;white-space:nowrap}
.sb-name em{
  background:linear-gradient(90deg,#bf5fff,#00d4ff,#39ff14);
  background-size:200%;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  font-style:normal;
  animation:shimmer 3s linear infinite;
}

.sb-nav{flex:1;padding:14px 10px;overflow-y:auto;display:flex;flex-direction:column;gap:3px}
.sn{
  display:flex;align-items:center;gap:10px;
  padding:10px 12px;border-radius:10px;
  cursor:pointer;border:none;background:none;
  color:var(--su);font-family:var(--fn);font-size:13px;font-weight:500;
  width:100%;text-align:left;white-space:nowrap;
  position:relative;overflow:hidden;
}
.sn:hover{color:var(--tx);transform:translateX(3px)}
.sn.on{
  background:linear-gradient(135deg,rgba(191,95,255,.15),rgba(0,212,255,.08));
  color:#bf5fff;font-weight:700;
  border:1px solid rgba(191,95,255,.25);
  text-shadow:0 0 12px rgba(191,95,255,.4);
  box-shadow:inset 0 0 20px rgba(191,95,255,.05),0 2px 12px rgba(191,95,255,.15);
}
.sn.on::before{
  content:'';position:absolute;left:0;top:20%;height:60%;width:2px;
  background:linear-gradient(180deg,#bf5fff,#00d4ff);
  border-radius:2px;
  box-shadow:0 0 8px #bf5fff;
}
.sni{flex-shrink:0;width:15px;height:15px}

.sb-btm{padding:12px 10px;border-top:1px solid var(--b1);display:flex;flex-direction:column;gap:8px;position:relative}
.sb-btm::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--neon-pink),var(--neon-purple),transparent);
  opacity:.5;
}
.hs-mini{
  display:flex;align-items:center;gap:10px;
  padding:10px 12px;border-radius:10px;
  background:linear-gradient(135deg,rgba(191,95,255,.08),rgba(0,212,255,.05));
  border:1px solid rgba(191,95,255,.2);
  overflow:hidden;cursor:default;
}
.sb-mini{
  display:flex;align-items:center;justify-content:center;
  padding:8px;background:var(--b0);
  border:1px solid var(--b1);border-radius:10px;
  color:var(--mu);cursor:pointer;width:100%;
}
.sb-mini:hover{background:var(--hov);color:var(--tx)}

/* ── MAIN ── */
.ma{flex:1;display:flex;flex-direction:column;min-width:0;width:0;overflow:hidden}

/* ── HEADER ── */
.hdr{
  display:flex;align-items:center;justify-content:space-between;
  padding:13px 24px;
  background:${isDark?"rgba(8,10,26,0.94)":"rgba(255,252,255,0.94)"};
  border-bottom:1px solid var(--b1);
  gap:12px;flex-shrink:0;
  position:sticky;top:0;z-index:100;
  backdrop-filter:blur(24px);
  box-shadow:0 2px 20px rgba(191,95,255,.06);
  width:100%;
  box-sizing:border-box;
}
.hdr::after{
  content:'';position:absolute;bottom:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(191,95,255,.5),rgba(0,212,255,.5),rgba(57,255,20,.3),transparent);
  opacity:.7;
}
.hdr-l .ht{font-family:var(--fd);font-size:18px;font-weight:800;letter-spacing:-.4px;
  background:linear-gradient(90deg,var(--tx),#bf5fff);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.hdr-l .hs{font-size:11px;color:var(--su);margin-top:2px}
.hdr-r{display:flex;align-items:center;gap:8px}

.bell{
  position:relative;width:36px;height:36px;border-radius:10px;
  background:var(--b0);border:1px solid var(--b1);
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;color:var(--su);
}
.bell:hover{border-color:rgba(191,95,255,.5);color:#bf5fff;box-shadow:0 0 12px rgba(191,95,255,.2)}
.bell.has{color:var(--neon-gold);border-color:rgba(255,230,0,.4);box-shadow:0 0 12px rgba(255,230,0,.15)}
.nbadge{
  position:absolute;top:-4px;right:-4px;
  width:16px;height:16px;border-radius:50%;
  background:linear-gradient(135deg,#ff2d78,#ff6b35);
  font-size:9px;font-weight:700;
  display:flex;align-items:center;justify-content:center;color:#fff;
  font-family:var(--fm);
  box-shadow:0 0 10px rgba(255,45,120,.6);
  border:2px solid var(--surf);
}

.hb{
  display:flex;align-items:center;gap:6px;
  padding:7px 13px;border-radius:10px;
  border:1px solid var(--b1);background:var(--b0);
  color:var(--su);font-size:11.5px;font-family:var(--fn);font-weight:600;
  cursor:pointer;white-space:nowrap;
}
.hb:hover{border-color:rgba(191,95,255,.45);color:#bf5fff;background:rgba(191,95,255,.07);box-shadow:0 0 12px rgba(191,95,255,.15)}

.time-toggle{
  display:flex;gap:2px;padding:3px;
  background:var(--b0);border-radius:10px;border:1px solid var(--b1);
}
.time-btn{
  padding:6px 12px;border-radius:8px;border:none;
  background:none;color:var(--su);font-size:11px;font-weight:500;
  cursor:pointer;white-space:nowrap;font-family:var(--fn);
}
.time-btn.active{
  background:linear-gradient(135deg,#bf5fff,#00d4ff);
  color:#fff;font-weight:700;
  box-shadow:0 2px 12px rgba(191,95,255,.4);
}
.time-btn:hover:not(.active){color:var(--tx)}

.rp{
  display:flex;align-items:center;gap:5px;
  padding:7px 12px;border-radius:10px;font-size:11.5px;font-weight:700;
  cursor:pointer;border:1px solid;font-family:var(--fn);
}
.rp.admin{
  background:linear-gradient(135deg,rgba(191,95,255,.12),rgba(0,212,255,.08));
  color:#bf5fff;border-color:rgba(191,95,255,.3);
  box-shadow:0 0 10px rgba(191,95,255,.1);
}
.rp.viewer{background:var(--b0);color:var(--su);border-color:var(--b1)}
.rp:hover{filter:brightness(1.15);transform:translateY(-1px)}

/* Notification Dropdown */
.ndrop{
  position:absolute;top:calc(100% + 8px);right:0;width:300px;
  background:var(--card);border:1px solid rgba(191,95,255,.25);border-radius:14px;
  overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.5),0 0 30px rgba(191,95,255,.1);z-index:9999;
}
.nd-hd{padding:10px 14px;font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--su);border-bottom:1px solid var(--b1);background:linear-gradient(135deg,rgba(191,95,255,.08),rgba(0,212,255,.05))}
.ni{display:flex;align-items:flex-start;gap:10px;padding:14px;border-bottom:1px solid var(--b0);cursor:pointer;position:relative}
.ni:hover{background:rgba(191,95,255,.05)}
.ni:last-child{border-bottom:none}
.ni-ic{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ni-title{font-size:12px;font-weight:700;color:var(--tx);margin-bottom:2px}
.ni-msg{font-size:11px;color:var(--su);line-height:1.4}
.ni-badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:10px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-top:5px}
.ni-dismiss{position:absolute;top:8px;right:8px;width:18px;height:18px;border-radius:5px;display:flex;align-items:center;justify-content:center;background:var(--b0);border:none;color:var(--mu);cursor:pointer;opacity:0}
.ni:hover .ni-dismiss{opacity:1}
.nd-acts{padding:8px 14px;border-top:1px solid var(--b1);display:flex;gap:6px}
.nd-act{flex:1;padding:6px;border-radius:8px;border:1px solid var(--b1);background:var(--b0);color:var(--su);font-size:10px;font-weight:600;cursor:pointer;text-align:center}
.nd-act:hover{border-color:rgba(191,95,255,.4);color:#bf5fff}
.nd-empty{padding:32px 20px;text-align:center}
.nd-ei{width:44px;height:44px;border-radius:12px;background:rgba(57,255,20,.1);display:flex;align-items:center;justify-content:center;margin:0 auto 10px;color:#39ff14;box-shadow:0 0 16px rgba(57,255,20,.2)}

/* Report dropdown */
.rdrop{position:absolute;top:calc(100% + 8px);right:0;width:200px;background:var(--card2);border:1px solid rgba(191,95,255,.25);border-radius:14px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.5),0 0 20px rgba(191,95,255,.08);z-index:300}
.rd-hd{padding:10px 14px;font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--su);border-bottom:1px solid var(--b1);background:linear-gradient(135deg,rgba(191,95,255,.08),transparent)}
.rd-opt{display:flex;align-items:center;gap:8px;padding:9px 14px;font-size:12px;color:var(--tx);cursor:pointer;border-bottom:1px solid var(--b0)}
.rd-opt:hover{background:rgba(191,95,255,.06);color:#bf5fff}
.rd-opt:last-child{border-bottom:none}

/* Viewer banner */
.vb{display:flex;align-items:center;gap:6px;padding:8px 24px;background:linear-gradient(90deg,rgba(191,95,255,.08),rgba(0,212,255,.05));border-bottom:1px solid rgba(191,95,255,.15);font-size:11px;color:#bf5fff;font-weight:600}

/* ── CONTENT ── */
.cnt{padding:0;overflow-y:auto;overflow-x:hidden;flex:1;width:100%;max-width:100%}

/* ── STAT CARDS ── */
.scs{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:24px;padding-bottom:24px}
.sc{
  border-radius:16px;padding:20px;
  position:relative;overflow:hidden;
  cursor:default;
  transition:transform .3s ease,box-shadow .3s ease;
  border:1px solid;
}
.sc:hover{transform:translateY(-4px) scale(1.015)}

/* Shimmer sweep on hover */
.sc::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.08) 50%,transparent 60%);
  transform:translateX(-100%);transition:transform .5s ease;z-index:2;
}
.sc:hover::before{transform:translateX(100%)}

/* Prismatic noise texture */
.sc::after{
  content:'';position:absolute;inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  pointer-events:none;opacity:.7;z-index:1;
}

/* Glow orb in top-right */
.sc-orb{
  position:absolute;top:-30px;right:-30px;
  width:100px;height:100px;border-radius:50%;
  filter:blur(30px);opacity:.4;z-index:0;
  animation:glow-pulse 3s ease-in-out infinite;
}

.sc-ic{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:19px;margin-bottom:14px;background:rgba(255,255,255,.18);backdrop-filter:blur(10px);position:relative;z-index:3;border:1px solid rgba(255,255,255,.2)}
.sc-lb{font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:6px;position:relative;z-index:3}
.sc-vl{font-family:var(--fm);font-size:25px;font-weight:700;letter-spacing:-1px;line-height:1;margin-bottom:10px;color:#fff;position:relative;z-index:3;text-shadow:0 2px 8px rgba(0,0,0,.2)}
.sc-nt{font-size:10px;color:rgba(255,255,255,.5);position:relative;z-index:3}
.sc-trend{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px;margin-top:8px;position:relative;z-index:3}
.sc-trend.up{background:rgba(57,255,20,.2);color:#39ff14;border:1px solid rgba(57,255,20,.3);text-shadow:0 0 8px rgba(57,255,20,.5)}
.sc-trend.down{background:rgba(255,45,120,.2);color:#ff2d78;border:1px solid rgba(255,45,120,.3);text-shadow:0 0 8px rgba(255,45,120,.5)}

/* Card Themes — every card a unique hue on the color wheel */

/* 1. BALANCE — Electric Blue → Indigo */
.sc.balance{
  background:linear-gradient(135deg,#00057a 0%,#0033cc 45%,#3300cc 80%,#1a0066 100%);
  border-color:rgba(51,100,255,.6);
  box-shadow:0 8px 32px rgba(0,60,255,.35),inset 0 1px 0 rgba(120,160,255,.25);
}
.sc.balance .sc-orb{background:#2255ff}
.sc.balance:hover{box-shadow:0 20px 60px rgba(0,60,255,.55),0 0 50px rgba(80,100,255,.2)}

/* 2. INCOME — Neon Lime → Emerald Green */
.sc.income{
  background:linear-gradient(135deg,#003300 0%,#006600 40%,#009933 75%,#003322 100%);
  border-color:rgba(57,255,20,.5);
  box-shadow:0 8px 32px rgba(0,180,0,.3),inset 0 1px 0 rgba(80,255,80,.2);
}
.sc.income .sc-orb{background:#39ff14}
.sc.income:hover{box-shadow:0 20px 60px rgba(0,200,0,.45),0 0 50px rgba(57,255,20,.2)}

/* 3. EXPENSE — Crimson Red → Hot Rose */
.sc.expense{
  background:linear-gradient(135deg,#5a0000 0%,#aa0022 40%,#cc0044 75%,#660011 100%);
  border-color:rgba(255,20,60,.55);
  box-shadow:0 8px 32px rgba(220,0,40,.3),inset 0 1px 0 rgba(255,80,100,.2);
}
.sc.expense .sc-orb{background:#ff1440}
.sc.expense:hover{box-shadow:0 20px 60px rgba(220,0,40,.5),0 0 50px rgba(255,20,60,.2)}

/* 4. SAVINGS — Solar Gold → Amber */
.sc.savings{
  background:linear-gradient(135deg,#4a2800 0%,#8a4c00 40%,#cc7700 75%,#3d2000 100%);
  border-color:rgba(255,180,0,.55);
  box-shadow:0 8px 32px rgba(200,130,0,.3),inset 0 1px 0 rgba(255,210,60,.2);
}
.sc.savings .sc-orb{background:#ffaa00}
.sc.savings:hover{box-shadow:0 20px 60px rgba(200,140,0,.5),0 0 50px rgba(255,190,0,.2)}

/* 5. DAILY — Electric Violet → Deep Magenta */
.sc.daily{
  background:linear-gradient(135deg,#2d0050 0%,#6600aa 40%,#aa00cc 75%,#1a002e 100%);
  border-color:rgba(180,0,255,.55);
  box-shadow:0 8px 32px rgba(140,0,220,.3),inset 0 1px 0 rgba(210,80,255,.2);
}
.sc.daily .sc-orb{background:#bb00ff}
.sc.daily:hover{box-shadow:0 20px 60px rgba(150,0,240,.5),0 0 50px rgba(180,0,255,.2)}

/* 6. BUDGET — Volcanic Orange → Rust */
.sc.budget{
  background:linear-gradient(135deg,#4a1400 0%,#993300 40%,#cc5500 75%,#331000 100%);
  border-color:rgba(255,100,30,.55);
  box-shadow:0 8px 32px rgba(200,70,0,.3),inset 0 1px 0 rgba(255,140,60,.2);
}
.sc.budget .sc-orb{background:#ff6600}
.sc.budget:hover{box-shadow:0 20px 60px rgba(210,80,0,.5),0 0 50px rgba(255,110,30,.2)}

/* 7. RECURRING — Aqua Cyan → Ocean Blue */
.sc.recurring{
  background:linear-gradient(135deg,#001a33 0%,#004488 40%,#0077cc 75%,#001122 100%);
  border-color:rgba(0,190,255,.55);
  box-shadow:0 8px 32px rgba(0,140,220,.3),inset 0 1px 0 rgba(0,220,255,.2);
}
.sc.recurring .sc-orb{background:#00bbff}
.sc.recurring:hover{box-shadow:0 20px 60px rgba(0,150,230,.5),0 0 50px rgba(0,200,255,.2)}

/* 8. HEALTH — Mint Teal → Seafoam */
.sc.health{
  background:linear-gradient(135deg,#001a18 0%,#004a3a 40%,#007a5a 75%,#001510 100%);
  border-color:rgba(0,255,190,.45);
  box-shadow:0 8px 32px rgba(0,190,150,.25),inset 0 1px 0 rgba(0,255,200,.2);
}
.sc.health .sc-orb{background:#00ffcc}
.sc.health:hover{box-shadow:0 20px 60px rgba(0,200,160,.4),0 0 50px rgba(0,255,190,.15)}

/* 9. DANGER — Neon Pink → Deep Fuchsia */
.sc.danger{
  background:linear-gradient(135deg,#3d0030 0%,#880055 40%,#cc0077 75%,#220018 100%);
  border-color:rgba(255,0,140,.55);
  box-shadow:0 8px 32px rgba(220,0,120,.3),inset 0 1px 0 rgba(255,60,180,.2);
}
.sc.danger .sc-orb{background:#ff0088}
.sc.danger:hover{box-shadow:0 20px 60px rgba(230,0,130,.5),0 0 50px rgba(255,0,140,.2)}

/* ── CHART CONTAINERS ── */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:0 24px 24px}
.g3{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:0 24px 24px}
.g1{padding:0 24px 24px}

.cc{
  background:${isDark?"linear-gradient(135deg,rgba(11,13,32,0.95),rgba(14,16,38,0.95))":"linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,244,255,0.98))"};
  border:1px solid var(--b1);border-radius:16px;
  padding:20px;height:100%;
  position:relative;overflow:hidden;
}
.cc:hover{border-color:rgba(191,95,255,.35);box-shadow:0 8px 32px rgba(191,95,255,.12)}
.cc::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,#bf5fff,#00d4ff,#39ff14,transparent);
  opacity:0;transition:opacity .3s;
}
.cc:hover::before{opacity:1}

.cc-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.cc-tt{font-size:11px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--tx)}
.cc-bj{
  font-family:var(--fm);font-size:10px;font-weight:700;
  padding:4px 10px;border-radius:12px;
  background:linear-gradient(135deg,rgba(255,230,0,.12),rgba(255,107,53,.08));
  color:#ffe600;border:1px solid rgba(255,230,0,.25);
}

/* ── RECENT ACTIVITY ── */
.ra{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--b0)}
.ra:last-child{border:none}
.ra-ic{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.ra-mid{flex:1;min-width:0}
.ra-nm{font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ra-ct{font-size:10px;color:var(--mu);margin-top:1px}
.ra-am{font-family:var(--fm);font-size:12.5px;font-weight:700;flex-shrink:0}

/* Pie legend */
.pl{display:flex;flex-direction:column;gap:6px;margin-top:12px}
.pl-r{display:flex;align-items:center;gap:8px;font-size:11.5px;padding:3px 0}
.pl-d{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.pl-n{color:var(--su);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pl-p{font-family:var(--fm);color:var(--mu);font-size:10px;margin-right:2px}
.pl-v{font-family:var(--fm);color:var(--tx);font-weight:700;font-size:11.5px}

/* ── TRANSACTIONS ── */
.tc{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;align-items:center}
.ts{
  display:flex;align-items:center;
  background:${isDark?"rgba(11,13,32,.9)":"rgba(255,255,255,.9)"};
  border:1px solid var(--b1);border-radius:10px;
  padding:0 12px;gap:7px;flex:1;min-width:180px;
}
.ts:focus-within{border-color:rgba(191,95,255,.5);box-shadow:0 0 12px rgba(191,95,255,.15)}
.ts input{background:none;border:none;outline:none;color:var(--tx);font-family:var(--fn);font-size:12.5px;padding:9px 0;width:100%}
.ts input::placeholder{color:var(--mu)}
.tse{
  background:${isDark?"rgba(11,13,32,.9)":"rgba(255,255,255,.9)"};
  border:1px solid var(--b1);border-radius:10px;
  padding:8px 11px;color:var(--tx);font-family:var(--fn);font-size:12px;
  cursor:pointer;outline:none;
}
.tse:focus{border-color:rgba(191,95,255,.5)}
.tse option{background:var(--card2)}
.add{
  display:flex;align-items:center;gap:6px;
  padding:9px 16px;
  background:linear-gradient(135deg,#bf5fff,#00d4ff);
  color:#fff;font-family:var(--fn);font-size:12px;font-weight:700;
  border:none;border-radius:10px;cursor:pointer;
  box-shadow:0 4px 16px rgba(191,95,255,.4),0 0 24px rgba(0,212,255,.15);
  white-space:nowrap;
}
.add:hover{transform:translateY(-1px);box-shadow:0 8px 28px rgba(191,95,255,.55),0 0 32px rgba(0,212,255,.2)}

.chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.chip{
  display:flex;align-items:center;gap:4px;
  padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;
  cursor:pointer;border:1px solid var(--b1);background:var(--b0);color:var(--su);
}
.chip:hover{border-color:rgba(191,95,255,.4);color:#bf5fff}
.chip.on{color:#fff;border-color:transparent}

.tst{display:flex;gap:16px;margin-bottom:10px;font-size:11px;color:var(--su);flex-wrap:wrap;align-items:center}
.tst strong{color:var(--tx);font-family:var(--fm)}

.tw{
  background:${isDark?"rgba(11,13,32,.95)":"rgba(255,255,255,.95)"};
  border:1px solid var(--b1);border-radius:14px;overflow:hidden;margin-bottom:12px;
}
.tb{width:100%;border-collapse:collapse}
.tb th{text-align:left;padding:10px 16px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--mu);background:var(--b0);border-bottom:1px solid var(--b1);cursor:pointer;user-select:none;white-space:nowrap}
.tb th:hover{color:#bf5fff}
.tr{transition:background .12s}
.tr:hover{background:rgba(191,95,255,.04)}
.tr td{padding:11px 16px;font-size:12.5px;border-bottom:1px solid var(--b0);vertical-align:middle}
.tr:last-child td{border:none}
.td-ds{font-weight:600;display:flex;align-items:center;gap:6px}
.td-rc{width:5px;height:5px;border-radius:50%;background:#bf5fff;flex-shrink:0;box-shadow:0 0 6px #bf5fff}
.td-dt{font-family:var(--fm);font-size:10px;color:var(--mu)}
.cp{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:10.5px;font-weight:700}
.ta{font-family:var(--fm);font-weight:700;font-size:13px}
.tac{display:flex;gap:4px;opacity:0}
.tr:hover .tac{opacity:1}
.ab{width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:7px;border:none;cursor:pointer}
.ab.ed{background:rgba(191,95,255,.12);color:#bf5fff}
.ab.dl{background:rgba(255,45,120,.12);color:#ff2d78}
.ab:hover{filter:brightness(1.3);transform:scale(1.1)}

.pag{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:4px}
.pi{font-size:11px;color:var(--mu)}
.pbs{display:flex;align-items:center;gap:3px}
.pb{width:30px;height:30px;border-radius:8px;border:1px solid var(--b1);background:var(--b0);color:var(--su);font-size:11.5px;font-family:var(--fm);cursor:pointer;display:flex;align-items:center;justify-content:center}
.pb:hover{border-color:rgba(191,95,255,.4);color:#bf5fff}
.pb.on{background:linear-gradient(135deg,#bf5fff,#00d4ff);border-color:transparent;color:#fff;font-weight:700;box-shadow:0 2px 10px rgba(191,95,255,.4)}
.pb:disabled{opacity:.3;cursor:default}

.emp{text-align:center;padding:56px 20px}
.emp-ic{width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,rgba(191,95,255,.12),rgba(0,212,255,.08));border:1px solid rgba(191,95,255,.2);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:24px}
.emp-t{font-size:14px;font-weight:600;color:var(--su);margin-bottom:4px}
.emp-s{font-size:12px;color:var(--mu)}

/* ── BUDGET ── */
.bg{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-bottom:18px}
.bc{
  background:${isDark?"rgba(11,13,32,.95)":"rgba(255,255,255,.95)"};
  border:1px solid var(--b1);border-radius:14px;padding:18px;
}
.bc:hover{border-color:rgba(191,95,255,.35);transform:translateY(-2px);box-shadow:0 8px 28px rgba(191,95,255,.12)}
.bc-tp{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.bc-ca{display:flex;align-items:center;gap:9px}
.bc-ni{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px}
.bc-nm{font-size:13.5px;font-weight:700}
.bc-st{font-size:10px;font-weight:700;letter-spacing:.5px;padding:3px 8px;border-radius:20px}
.ok{background:rgba(57,255,20,.1);color:#39ff14;border:1px solid rgba(57,255,20,.2);text-shadow:0 0 8px rgba(57,255,20,.4)}
.wn{background:rgba(255,230,0,.1);color:#ffe600;border:1px solid rgba(255,230,0,.2);text-shadow:0 0 8px rgba(255,230,0,.4)}
.ov{background:rgba(255,45,120,.1);color:#ff2d78;border:1px solid rgba(255,45,120,.2);text-shadow:0 0 8px rgba(255,45,120,.4)}
.bb{height:7px;background:var(--b1);border-radius:4px;overflow:hidden;margin-bottom:8px;position:relative}
.bf{height:100%;border-radius:4px;transition:width 1s ease;position:relative}
.bf::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 60%,rgba(255,255,255,.3));border-radius:4px}
.bns{display:flex;justify-content:space-between;font-size:11.5px}
.bs{font-family:var(--fm);font-weight:700}
.bt{font-family:var(--fm);color:var(--mu)}
.be{display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:12px;border-top:1px solid var(--b0)}
.bsl{flex:1;-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;background:var(--b1);outline:none;cursor:pointer}
.bsl::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,#bf5fff,#00d4ff);border:2px solid var(--bg);cursor:pointer;box-shadow:0 0 8px rgba(191,95,255,.5)}
.bv{width:72px;background:var(--b0);border:1px solid var(--b1);border-radius:8px;padding:5px 8px;color:var(--tx);font-family:var(--fm);font-size:11px;text-align:right;outline:none}
.bv:focus{border-color:rgba(191,95,255,.5);box-shadow:0 0 8px rgba(191,95,255,.2)}

/* ── INSIGHTS ── */
.hs-sec{display:grid;grid-template-columns:auto 1fr;gap:24px;align-items:center;
  background:${isDark?"linear-gradient(135deg,rgba(11,13,32,.98),rgba(20,10,40,.8))":"linear-gradient(135deg,rgba(255,255,255,.98),rgba(248,240,255,.8))"};
  border:1px solid rgba(191,95,255,.25);border-radius:16px;padding:22px;margin-bottom:18px;
  box-shadow:0 4px 24px rgba(191,95,255,.1);
}
.hf{display:flex;flex-direction:column;gap:13px}
.hf-r{display:flex;align-items:center;gap:12px}
.hf-lb{font-size:11.5px;color:var(--su);width:145px;flex-shrink:0}
.hf-bg{flex:1;height:6px;background:var(--b1);border-radius:3px;overflow:hidden}
.hf-fl{height:100%;border-radius:3px;transition:width 1.1s ease}
.hf-pt{font-family:var(--fm);font-size:11px;min-width:36px;text-align:right;font-weight:700}
.hf-nt{font-size:10px;color:var(--mu);min-width:150px}
.pb2{height:5px;background:var(--b1);border-radius:3px;overflow:hidden}
.pf2{height:100%;border-radius:3px}

/* ── SMART INSIGHT TIPS ── */
.tips-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:18px}
.tip-card{
  border-radius:14px;padding:18px;
  display:flex;flex-direction:column;gap:9px;
  position:relative;overflow:hidden;
  border:1px solid rgba(191,95,255,.2);
  background:${isDark?"linear-gradient(135deg,rgba(14,8,32,.95),rgba(8,14,32,.95))":"linear-gradient(135deg,rgba(250,248,255,.98),rgba(240,248,255,.98))"};
}
.tip-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,#bf5fff,#00d4ff,#39ff14);
}
.tip-card:hover{border-color:rgba(191,95,255,.4);box-shadow:0 6px 24px rgba(191,95,255,.15),0 0 40px rgba(0,212,255,.05)}
.tip-ic{
  width:34px;height:34px;border-radius:9px;
  background:linear-gradient(135deg,rgba(191,95,255,.2),rgba(0,212,255,.1));
  border:1px solid rgba(191,95,255,.3);
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 12px rgba(191,95,255,.2);
  font-size:16px;
}
.tip-tt{font-size:12.5px;font-weight:700;color:var(--tx)}
.tip-bd{font-size:11px;color:var(--su);line-height:1.5}
.tip-tag{
  display:inline-flex;align-items:center;padding:2px 9px;border-radius:8px;
  font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;
  background:linear-gradient(135deg,rgba(191,95,255,.12),rgba(0,212,255,.08));
  color:#bf5fff;border:1px solid rgba(191,95,255,.2);
}

/* ── MODAL ── */
.mbk{position:fixed;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(10px);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px}
.mdl{
  background:${isDark?"linear-gradient(135deg,#0b0d24,#0f1128)":"linear-gradient(135deg,#ffffff,#f8f4ff)"};
  border:1px solid rgba(191,95,255,.3);border-radius:20px;padding:26px;
  width:100%;max-width:440px;
  box-shadow:0 40px 80px rgba(0,0,0,.6),0 0 40px rgba(191,95,255,.15);
  animation:mi .18s ease;
  position:relative;overflow:hidden;
}
.mdl::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,#bf5fff,#00d4ff,#39ff14,transparent);
}
@keyframes mi{from{opacity:0;transform:scale(.95) translateY(10px)}to{opacity:1;transform:scale(1)}}
.m-tt{font-family:var(--fd);font-size:17px;font-weight:800;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between;
  background:linear-gradient(90deg,var(--tx),#bf5fff);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.m-fd{margin-bottom:13px}
.m-lb{display:block;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--su);margin-bottom:5px}
.m-ip{width:100%;background:var(--b0);border:1px solid var(--b1);border-radius:10px;padding:10px 13px;color:var(--tx);font-family:var(--fn);font-size:13px;outline:none}
.m-ip:focus{border-color:rgba(191,95,255,.5);box-shadow:0 0 0 3px rgba(191,95,255,.1)}
.m-ip option{background:var(--card2)}
.tto{display:grid;grid-template-columns:1fr 1fr;gap:5px;background:var(--b0);border:1px solid var(--b1);border-radius:10px;padding:4px}
.ttb{padding:9px;border-radius:8px;border:none;font-family:var(--fn);font-size:12px;font-weight:700;cursor:pointer;background:none;color:var(--mu)}
.ttb.oi{background:linear-gradient(135deg,rgba(57,255,20,.15),rgba(0,255,204,.1));color:#39ff14;border:1px solid rgba(57,255,20,.2);text-shadow:0 0 8px rgba(57,255,20,.4)}
.ttb.oe{background:linear-gradient(135deg,rgba(255,45,120,.15),rgba(255,107,53,.1));color:#ff2d78;border:1px solid rgba(255,45,120,.2);text-shadow:0 0 8px rgba(255,45,120,.4)}
.m-ck{display:flex;align-items:center;gap:9px;padding:10px 13px;background:var(--b0);border:1px solid var(--b1);border-radius:10px;cursor:pointer;font-size:12.5px;color:var(--su)}
.m-ck:hover{border-color:rgba(191,95,255,.4);color:#bf5fff}
.m-ck input{width:14px;height:14px;accent-color:#bf5fff;cursor:pointer}
.m-ac{display:flex;gap:9px;margin-top:18px}
.m-cn{flex:1;padding:11px;background:var(--b0);border:1px solid var(--b1);border-radius:10px;color:var(--su);font-family:var(--fn);font-size:13px;font-weight:600;cursor:pointer}
.m-cn:hover{border-color:rgba(191,95,255,.4);color:#bf5fff}
.m-sb{
  flex:2;padding:11px;border:none;border-radius:10px;
  background:linear-gradient(135deg,#bf5fff,#00d4ff);
  color:#fff;font-family:var(--fn);font-size:13px;font-weight:800;cursor:pointer;
  box-shadow:0 4px 16px rgba(191,95,255,.45),0 0 24px rgba(0,212,255,.2);
}
.m-sb:hover{filter:brightness(1.08);transform:translateY(-1px);box-shadow:0 8px 28px rgba(191,95,255,.55)}

/* Misc */
.fi{animation:fi .25s ease}
@keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(191,95,255,.3);border-radius:2px}
::-webkit-scrollbar-thumb:hover{background:rgba(191,95,255,.5)}
.rel{position:relative}

/* Responsive */
@media(max-width:1200px){.scs{grid-template-columns:repeat(2,1fr)}.g2{grid-template-columns:1fr}.tips-row{grid-template-columns:1fr 1fr}}
@media(max-width:900px){.sb{display:none}.scs{grid-template-columns:1fr 1fr}.ma{width:100%}}
@media(max-width:620px){.scs{grid-template-columns:1fr}.hdr{padding:10px 14px}.g2,.g3,.g1{padding:0 14px 14px}.scs{padding:14px}.tips-row{grid-template-columns:1fr}}

/* ── AI ADVISOR ── */
.ai-wrap{display:flex;flex-direction:column;height:calc(100vh - 120px);padding:0 24px 24px;gap:16px}
.ai-chat{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;padding:20px;background:${isDark?"rgba(11,13,32,.95)":"rgba(255,255,255,.95)"};border:1px solid var(--b1);border-radius:16px;min-height:0}
.ai-msg{display:flex;gap:10px;align-items:flex-start;animation:fi .2s ease}
.ai-msg.user{flex-direction:row-reverse}
.ai-avatar{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px}
.ai-avatar.bot{background:linear-gradient(135deg,#bf5fff,#00d4ff);box-shadow:0 0 12px rgba(191,95,255,.4)}
.ai-avatar.usr{background:linear-gradient(135deg,#ff6b35,#ff2d78);box-shadow:0 0 12px rgba(255,107,53,.4)}
.ai-bubble{max-width:75%;padding:12px 16px;border-radius:14px;font-size:12.5px;line-height:1.6;position:relative}
.ai-bubble.bot{background:${isDark?"rgba(191,95,255,.1)":"rgba(191,95,255,.08)"};border:1px solid rgba(191,95,255,.2);color:var(--tx);border-top-left-radius:4px}
.ai-bubble.usr{background:linear-gradient(135deg,rgba(0,212,255,.15),rgba(191,95,255,.1));border:1px solid rgba(0,212,255,.25);color:var(--tx);border-top-right-radius:4px}
.ai-time{font-size:9px;color:var(--mu);margin-top:4px;opacity:.7}
.ai-input-row{display:flex;gap:10px;align-items:flex-end}
.ai-input{flex:1;background:${isDark?"rgba(11,13,32,.95)":"rgba(255,255,255,.95)"};border:1px solid var(--b1);border-radius:12px;padding:12px 16px;color:var(--tx);font-family:var(--fn);font-size:13px;outline:none;resize:none;line-height:1.5;max-height:120px;min-height:44px}
.ai-input:focus{border-color:rgba(191,95,255,.5);box-shadow:0 0 12px rgba(191,95,255,.12)}
.ai-send{width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,#bf5fff,#00d4ff);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;box-shadow:0 4px 14px rgba(191,95,255,.4)}
.ai-send:hover{filter:brightness(1.1);transform:translateY(-1px)}
.ai-send:disabled{opacity:.4;cursor:default;transform:none}
.ai-chips-row{display:flex;gap:6px;flex-wrap:wrap;padding:0 0 2px}
.ai-chip{padding:6px 14px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid rgba(191,95,255,.3);background:rgba(191,95,255,.08);color:#bf5fff;white-space:nowrap}
.ai-chip:hover{background:rgba(191,95,255,.16);border-color:rgba(191,95,255,.5)}
.ai-typing{display:flex;align-items:center;gap:4px;padding:4px 0}
.ai-dot{width:6px;height:6px;border-radius:50%;background:#bf5fff;animation:typing 1.4s infinite}
.ai-dot:nth-child(2){animation-delay:.2s}
.ai-dot:nth-child(3){animation-delay:.4s}
@keyframes typing{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}
.ai-stats-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:0 24px 16px}
.ai-stat{background:${isDark?"rgba(11,13,32,.95)":"rgba(255,255,255,.95)"};border:1px solid var(--b1);border-radius:12px;padding:14px;text-align:center}
.ai-stat-v{font-family:var(--fm);font-size:18px;font-weight:700;margin-bottom:3px}
.ai-stat-l{font-size:10px;color:var(--su);text-transform:uppercase;letter-spacing:.6px;font-weight:600}

/* ── GOALS ── */
.goals-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;padding:0 24px 24px}
.goal-card{background:${isDark?"rgba(11,13,32,.95)":"rgba(255,255,255,.95)"};border:1px solid var(--b1);border-radius:16px;padding:20px;position:relative;overflow:hidden;transition:all .25s}
.goal-card:hover{border-color:rgba(191,95,255,.35);transform:translateY(-3px);box-shadow:0 10px 32px rgba(191,95,255,.12)}
.goal-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:16px 16px 0 0}
.goal-top{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px}
.goal-ic{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.goal-actions{display:flex;gap:6px;opacity:0;transition:opacity .2s}
.goal-card:hover .goal-actions{opacity:1}
.goal-name{font-size:15px;font-weight:700;margin-bottom:3px}
.goal-deadline{font-size:10.5px;color:var(--su);display:flex;align-items:center;gap:4px}
.goal-amounts{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px}
.goal-curr{font-family:var(--fm);font-size:20px;font-weight:700}
.goal-tgt{font-family:var(--fm);font-size:11.5px;color:var(--su)}
.goal-bar{height:8px;background:var(--b1);border-radius:4px;overflow:hidden;margin-bottom:8px}
.goal-fill{height:100%;border-radius:4px;transition:width 1s ease;position:relative}
.goal-fill::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 50%,rgba(255,255,255,.25));border-radius:4px}
.goal-pct{font-family:var(--fm);font-size:10px;color:var(--mu);margin-bottom:14px}
.goal-contrib{display:flex;gap:8px;align-items:center;margin-top:2px}
.goal-inp{flex:1;background:var(--b0);border:1px solid var(--b1);border-radius:8px;padding:7px 10px;color:var(--tx);font-family:var(--fm);font-size:12px;outline:none}
.goal-inp:focus{border-color:rgba(191,95,255,.5)}
.goal-add-btn{padding:7px 14px;border-radius:8px;background:linear-gradient(135deg,#bf5fff,#00d4ff);border:none;color:#fff;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap;box-shadow:0 3px 10px rgba(191,95,255,.3)}
.goal-add-btn:hover{filter:brightness(1.1);transform:translateY(-1px)}
.goal-completed{display:flex;align-items:center;gap:6px;padding:8px 12px;background:rgba(57,255,20,.1);border:1px solid rgba(57,255,20,.25);border-radius:8px;font-size:11.5px;font-weight:700;color:#39ff14;margin-top:4px}
.new-goal-btn{display:flex;align-items:center;justify-content:center;gap:8px;background:var(--b0);border:2px dashed var(--b2);border-radius:16px;padding:32px 20px;cursor:pointer;color:var(--su);font-size:13px;font-weight:600;transition:all .2s;min-height:180px}
.new-goal-btn:hover{border-color:rgba(191,95,255,.4);color:#bf5fff;background:rgba(191,95,255,.05)}

/* Goal Modal extra */
.gm-colors{display:flex;gap:8px;flex-wrap:wrap}
.gm-color{width:28px;height:28px;border-radius:8px;cursor:pointer;border:2px solid transparent;transition:all .15s;flex-shrink:0}
.gm-color.sel{border-color:#fff;transform:scale(1.15);box-shadow:0 0 10px rgba(255,255,255,.3)}

/* ── CSV IMPORT ── */
.csv-drop{border:2px dashed rgba(191,95,255,.35);border-radius:14px;padding:40px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(191,95,255,.04)}
.csv-drop:hover,.csv-drop.drag{border-color:rgba(191,95,255,.7);background:rgba(191,95,255,.09);box-shadow:0 0 20px rgba(191,95,255,.1)}
.csv-preview{background:${isDark?"rgba(11,13,32,.95)":"rgba(255,255,255,.95)"};border:1px solid var(--b1);border-radius:12px;overflow:hidden;max-height:260px;overflow-y:auto;margin-top:14px}

/* ── HEATMAP ── */
.heatmap-wrap{padding:8px 0}
.heatmap-grid{display:flex;gap:3px;overflow-x:auto;padding-bottom:4px}
.heatmap-col{display:flex;flex-direction:column;gap:3px}
.heatmap-cell{width:14px;height:14px;border-radius:3px;flex-shrink:0;transition:transform .1s}
.heatmap-cell:hover{transform:scale(1.4);z-index:10;position:relative}
.heatmap-months{display:flex;gap:0;margin-bottom:6px;font-size:9px;color:var(--mu);font-weight:600;letter-spacing:.5px}
.heatmap-days{display:flex;flex-direction:column;gap:3px;margin-right:6px;font-size:9px;color:var(--mu)}

/* ── FORECAST ── */
.forecast-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:0 24px 24px}
.fc-card{background:${isDark?"rgba(11,13,32,.95)":"rgba(255,255,255,.95)"};border:1px solid var(--b1);border-radius:14px;padding:18px;position:relative;overflow:hidden}
.fc-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.fc-label{font-size:10px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:var(--mu);margin-bottom:8px;display:flex;align-items:center;gap:6px}
.fc-value{font-family:var(--fm);font-size:22px;font-weight:700;margin-bottom:4px}
.fc-note{font-size:11px;color:var(--su);line-height:1.5}
.fc-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:8px;font-size:10px;font-weight:700;margin-top:8px}

/* ── BILL CALENDAR ── */
.bill-list{display:flex;flex-direction:column;gap:8px}
.bill-row{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--b0);border:1px solid var(--b1);border-radius:12px;transition:all .2s}
.bill-row:hover{border-color:rgba(191,95,255,.3);background:rgba(191,95,255,.05)}
.bill-ic{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.bill-due{font-family:var(--fm);font-size:10px;color:var(--mu)}
.bill-days{padding:3px 8px;border-radius:8px;font-size:10px;font-weight:700;font-family:var(--fm)}
.bill-days.soon{background:rgba(255,107,53,.15);color:#ff6b35;border:1px solid rgba(255,107,53,.25)}
.bill-days.urgent{background:rgba(255,45,120,.15);color:#ff2d78;border:1px solid rgba(255,45,120,.25)}
.bill-days.ok{background:rgba(57,255,20,.1);color:#39ff14;border:1px solid rgba(57,255,20,.2)}
`;

export default function App(){
  const [txns,setTxns]       = useState(SEED);
  const [tab,setTab]         = useState("overview");
  const [role,setRole]       = useState("admin");
  const [mini,setMini]       = useState(false);
  const [q,setQ]             = useState("");
  const [fType,setFType]     = useState("all");
  const [sort,setSort]       = useState("date-desc");
  const [chipCat,setChipCat] = useState(null);
  const [page,setPage]       = useState(1);
  const [modal,setModal]     = useState(false);
  const [editing,setEd]      = useState(null);
  const [showN,setShowN]     = useState(false);
  const [dismissed,setDismissed] = useState(new Set());
  const [budgets,setBudgets] = useState(DEFAULT_BUDGETS);
  const [form,setForm]       = useState({date:"",description:"",category:"Food",type:"expense",amount:"",recurring:false});
  const [darkMode,setDarkMode] = useState(true);
  const [reportMenu,setReportMenu] = useState(false);
  const [timeView,setTimeView] = useState("monthly");
  const [pieMonth,setPieMonth] = useState(3);
  const nRef = useRef(null);
  const rRef = useRef(null);

  /* ── Goals state ── */
  const GOAL_COLORS = ["#bf5fff","#00d4ff","#39ff14","#ff2d78","#ffe600","#ff6b35","#00ffcc","#2255ff","#ff0088"];
  const [goals,setGoals] = useState([
    {id:1,name:"Emergency Fund",target:300000,current:185000,deadline:"2026-12-31",icon:"🛡️",color:"#bf5fff"},
    {id:2,name:"Vacation to Goa",target:80000,current:32000,deadline:"2026-11-15",icon:"🏖️",color:"#00d4ff"},
    {id:3,name:"New Laptop",target:120000,current:120000,deadline:"2026-06-01",icon:"💻",color:"#39ff14"},
    {id:4,name:"Wedding Fund",target:500000,current:75000,deadline:"2027-03-01",icon:"💍",color:"#ff2d78"},
  ]);
  const [goalModal,setGoalModal] = useState(false);
  const [editGoal,setEditGoal] = useState(null);
  const [goalForm,setGoalForm] = useState({name:"",target:"",current:"",deadline:"",icon:"🎯",color:"#bf5fff"});
  const [contribAmts,setContribAmts] = useState({});

  /* ── AI Advisor state ── */
  const [aiMessages,setAiMessages] = useState([
    {role:"assistant",content:"Hi! 👋 I'm your AI Financial Advisor. I can analyze your spending patterns, suggest savings strategies, and answer any finance questions. What would you like to know?",time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
  ]);
  const [aiInput,setAiInput] = useState("");
  const [aiLoading,setAiLoading] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(()=>{
    const h=e=>{
      if(nRef.current&&!nRef.current.contains(e.target))setShowN(false);
      if(rRef.current&&!rRef.current.contains(e.target))setReportMenu(false);
    };
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[]);

  /* ── Derived ── */
  const sum=useMemo(()=>{
    const inc=txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
    const exp=txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
    return{inc,exp,bal:inc-exp,sav:inc-exp};
  },[txns]);

  const monthly=useMemo(()=>MONTHS.map(({l,n})=>{
    const mt=txns.filter(t=>new Date(t.date).getMonth()+1===n);
    const inc=mt.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
    const exp=mt.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
    return{month:l,inc,exp,net:inc-exp};
  }),[txns]);

  const catData=useMemo(()=>{
    const m={};
    txns.filter(t=>t.type==="expense"&&new Date(t.date).getMonth()===pieMonth)
      .forEach(t=>{m[t.category]=(m[t.category]||0)+t.amount;});
    const total=Object.values(m).reduce((s,v)=>s+v,0);
    return Object.entries(m).sort((a,b)=>b[1]-a[1])
      .map(([name,value])=>({name,value,percentage:((value/total)*100).toFixed(1)}));
  },[txns,pieMonth]);

  const catSpend=useMemo(()=>{
    const m={};
    txns.filter(t=>t.type==="expense").forEach(t=>{m[t.category]=(m[t.category]||0)+t.amount;});
    return m;
  },[txns]);

  const health=useMemo(()=>{
    const savRate=sum.inc>0?(sum.bal/sum.inc)*100:0;
    const savPts=savRate>=30?40:savRate>=20?30:savRate>=10?20:10;
    const cats=Object.keys(budgets);
    const inB=cats.filter(c=>!catSpend[c]||catSpend[c]<=budgets[c]).length;
    const budPts=Math.round((inB/Math.max(cats.length,1))*40);
    const srcCount=txns.filter(t=>t.type==="income").map(t=>t.category).filter((v,i,a)=>a.indexOf(v)===i).length;
    const divPts=srcCount>=2?20:10;
    return{total:savPts+budPts+divPts,savPts,budPts,divPts,savRate:savRate.toFixed(1)};
  },[sum,catSpend,budgets,txns]);

  const notifications=useMemo(()=>{
    const a=[];
    Object.entries(budgets).forEach(([cat,budget])=>{
      const spent=catSpend[cat]||0,p=spent/budget;
      const key=`${cat}-${Math.round(spent)}-${budget}`;
      if(p>1&&!dismissed.has(key)) a.push({type:"danger",cat,msg:`Over budget by ${fmt(spent-budget)}`,key});
      else if(p>0.8&&!dismissed.has(key)) a.push({type:"warning",cat,msg:`${Math.round(p*100)}% of budget used`,key});
    });
    return a;
  },[catSpend,budgets,dismissed]);

  const filtered=useMemo(()=>{
    let r=[...txns];
    const qs=(q||"").trim().toLowerCase();
    if(qs) r=r.filter(t=>t.description.toLowerCase().includes(qs)||t.category.toLowerCase().includes(qs));
    if(chipCat) r=r.filter(t=>t.category===chipCat);
    if(fType!=="all") r=r.filter(t=>t.type===fType);
    const sorters={"date-desc":(a,b)=>new Date(b.date)-new Date(a.date),"date-asc":(a,b)=>new Date(a.date)-new Date(b.date),"amount-desc":(a,b)=>b.amount-a.amount,"amount-asc":(a,b)=>a.amount-b.amount};
    return[...r].sort(sorters[sort]);
  },[txns,q,fType,sort,chipCat]);

  const totalPages=Math.max(1,Math.ceil(filtered.length/PER_PAGE));
  const paged=filtered.slice((page-1)*PER_PAGE,page*PER_PAGE);
  const allCats=useMemo(()=>[...new Set(txns.map(t=>t.category))].sort(),[txns]);
  const recent5=useMemo(()=>[...txns].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5),[txns]);

  const totalBud=Object.values(budgets).reduce((s,v)=>s+v,0);
  const totalSp=Object.entries(catSpend).filter(([k])=>budgets[k]).reduce((s,[,v])=>s+v,0);
  const budUtil=totalBud>0?Math.min((totalSp/totalBud)*100,100):0;

  /* animated counters */
  const cBal=useCounter(sum.bal);
  const cInc=useCounter(sum.inc);
  const cExp=useCounter(sum.exp);
  const cSav=useCounter(sum.sav);

  /* handlers */
  const openAdd=()=>{setEd(null);setForm({date:"",description:"",category:"Food",type:"expense",amount:"",recurring:false});setModal(true);};
  const openEdit=t=>{setEd(t);setForm({date:t.date,description:t.description,category:t.category,type:t.type,amount:String(t.amount),recurring:!!t.recurring});setModal(true);};
  const save=()=>{const amt=parseFloat(form.amount);if(!form.date||!form.description||isNaN(amt)||amt<=0)return;if(editing)setTxns(p=>p.map(t=>t.id===editing.id?{...form,id:t.id,amount:amt}:t));else setTxns(p=>[{...form,id:Date.now(),amount:amt},...p]);setModal(false);setPage(1);};
  const del=id=>setTxns(p=>p.filter(t=>t.id!==id));
  const fv=k=>v=>setForm(p=>({...p,[k]:v}));
  const xport=()=>{const csv="Date,Description,Category,Type,Amount,Recurring\n"+txns.map(t=>`${t.date},"${t.description}",${t.category},${t.type},${t.amount},${t.recurring}`).join("\n");const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="fintrack-transactions.csv";a.click();URL.revokeObjectURL(url);};

  const generateReport=(period)=>{
    let f=[...txns];const now=new Date();const today=now.toISOString().split("T")[0];
    const ranges={week:7,month:30,quarter:90,year:365};
    const days=ranges[period]||30;
    const ago=new Date(now.getTime()-days*24*60*60*1000);
    f=txns.filter(t=>new Date(t.date)>=ago);
    const inc=f.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
    const exp=f.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
    const data={period,dateRange:`${ago.toISOString().split("T")[0]} to ${today}`,summary:{transactions:f.length,income:inc,expenses:exp,net:inc-exp,savingsRate:`${inc>0?((inc-exp)/inc*100).toFixed(1):0}%`},transactions:f};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`fintrack_${period}_${today}.json`;a.click();URL.revokeObjectURL(url);
    setReportMenu(false);
  };

  const onChip=cat=>{setChipCat(c=>c===cat?null:cat);setPage(1);};

  /* ── AI Advisor ── */
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:"smooth"});},[aiMessages,aiLoading]);

  const buildFinancialContext=()=>{
    const topCats=Object.entries(catSpend).sort((a,b)=>b[1]-a[1]);
    const overBudget=Object.entries(budgets).filter(([k,v])=>(catSpend[k]||0)>v);
    const underBudget=Object.entries(budgets).filter(([k,v])=>(catSpend[k]||0)<=v);
    const recExpenses=txns.filter(t=>t.recurring&&t.type==="expense");
    const recIncome=txns.filter(t=>t.recurring&&t.type==="income");
    const monthlyBreakdown=MONTHS.map(({l,n})=>{
      const mt=txns.filter(t=>new Date(t.date).getMonth()+1===n);
      const inc=mt.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
      const exp=mt.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
      return`  ${l}: Income ₹${inc.toLocaleString("en-IN")}, Expenses ₹${exp.toLocaleString("en-IN")}, Net ₹${(inc-exp).toLocaleString("en-IN")}`;
    }).join("\n");
    const recentTxns=[...txns].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,15)
      .map(t=>`  ${t.date} | ${t.type==="income"?"Income":"Expense"} | ${t.category} | ${t.description} | ₹${t.amount.toLocaleString("en-IN")}`).join("\n");
    const goalsSummary=goals.map(g=>`  ${g.name}: ₹${g.current.toLocaleString("en-IN")} of ₹${g.target.toLocaleString("en-IN")} (${Math.round((g.current/g.target)*100)}%) — deadline ${g.deadline}`).join("\n");

    return `You are a personal AI Financial Advisor for a FinTrack app user. You have full access to their financial data below. Answer ONLY based on this real data. Be specific, cite actual numbers from their data, and give actionable advice. Use ₹ for currency (Indian Rupees).

═══════════════════════════════════════
USER FINANCIAL PROFILE (Jan–Jun 2026)
═══════════════════════════════════════

📊 OVERALL SUMMARY:
• Total Income: ₹${sum.inc.toLocaleString("en-IN")}
• Total Expenses: ₹${sum.exp.toLocaleString("en-IN")}
• Net Savings: ₹${sum.bal.toLocaleString("en-IN")}
• Savings Rate: ${health.savRate}%
• Financial Health Score: ${health.total}/100 (${health.total>=75?"Excellent":health.total>=60?"Good":health.total>=40?"Fair":"Poor"})
• Avg Monthly Income: ₹${Math.round(sum.inc/6).toLocaleString("en-IN")}
• Avg Monthly Expense: ₹${Math.round(sum.exp/6).toLocaleString("en-IN")}

📅 MONTH-BY-MONTH BREAKDOWN:
${monthlyBreakdown}

💸 CATEGORY SPENDING (all-time):
${topCats.map(([cat,amt])=>{
  const bud=budgets[cat];
  const pct=bud?Math.round((amt/bud)*100):null;
  return`  ${cat}: ₹${amt.toLocaleString("en-IN")}${bud?` (budget ₹${bud.toLocaleString("en-IN")}, ${pct}% used${pct>100?" — OVER BUDGET":""})`:""}`;
}).join("\n")}

🚨 OVER-BUDGET CATEGORIES (${overBudget.length}):
${overBudget.length?overBudget.map(([k,v])=>`  ${k}: spent ₹${(catSpend[k]||0).toLocaleString("en-IN")} vs budget ₹${v.toLocaleString("en-IN")} (over by ₹${((catSpend[k]||0)-v).toLocaleString("en-IN")})`).join("\n"):"  None — all categories within budget!"}

✅ WITHIN-BUDGET CATEGORIES (${underBudget.length}):
${underBudget.map(([k,v])=>`  ${k}: ₹${(catSpend[k]||0).toLocaleString("en-IN")} of ₹${v.toLocaleString("en-IN")}`).join("\n")}

🔄 RECURRING EXPENSES (${recExpenses.length} items):
${recExpenses.map(t=>`  ${t.description} (${t.category}): ₹${t.amount.toLocaleString("en-IN")}/month`).join("\n")}
  Total recurring monthly: ₹${recExpenses.reduce((s,t)=>s+t.amount,0).toLocaleString("en-IN")}

💼 INCOME SOURCES:
${[...txns.filter(t=>t.type==="income")].reduce((acc,t)=>{acc[t.description]=(acc[t.description]||0)+t.amount;return acc;},{})}
${Object.entries(txns.filter(t=>t.type==="income").reduce((acc,t)=>{acc[t.description]=(acc[t.description]||0)+t.amount;return acc;},{})).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([d,a])=>`  ${d}: ₹${a.toLocaleString("en-IN")}`).join("\n")}

🎯 SAVINGS GOALS (${goals.length} total):
${goalsSummary||"  No goals set yet"}
  Total saved toward goals: ₹${goals.reduce((s,g)=>s+g.current,0).toLocaleString("en-IN")} of ₹${goals.reduce((s,g)=>s+g.target,0).toLocaleString("en-IN")}

📋 RECENT 15 TRANSACTIONS:
${recentTxns}

═══════════════════════════════════════
INSTRUCTIONS:
• Always reference the user's ACTUAL numbers when answering
• Be specific: "Your Housing spend of ₹1,08,000 is exactly on budget" not "you spend a lot on housing"
• Give 2-3 concrete, actionable recommendations
• If asked about a category, pull exact figures from the data above
• Keep responses conversational and under 200 words unless detail is requested
• Format numbers with ₹ and Indian number system (lakhs/thousands)`;
  };

  const sendAiMessage=async()=>{
    const txt=aiInput.trim();
    if(!txt||aiLoading)return;
    const now=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    // Capture the new user message before state update
    const userMsg={role:"user",content:txt,time:now};
    setAiMessages(prev=>[...prev,userMsg]);
    setAiInput("");
    setAiLoading(true);

    try{
      // Build financial context and generate local AI response
      const ctx=buildFinancialContext();
      const aiResponse=generateLocalAiResponse(txt,ctx);
      
      setAiMessages(prev=>[...prev,{
        role:"assistant",
        content:aiResponse,
        time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})
      }]);
    }catch(err){
      console.error("AI error:",err);
      setAiMessages(prev=>[...prev,{
        role:"assistant",
        content:`Sorry, I encountered an error. Please try again.`,
        time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})
      }]);
    }
    setAiLoading(false);
  };

  // Local AI response generator
  const generateLocalAiResponse=(userQuery,financialContext)=>{
    const query=userQuery.toLowerCase();
    
    // Extract key financial data from context
    const totalIncome=sum.inc;
    const totalExpenses=sum.exp;
    const savingsRate=health.savRate;
    const healthScore=health.total;
    
    // Analyze spending patterns
    const topCategories=Object.entries(catSpend).sort((a,b)=>b[1]-a[1]).slice(0,3);
    const overBudget=Object.entries(budgets).filter(([k,v])=>(catSpend[k]||0)>v);
    
    // Generate responses based on query type
    if(query.includes("overspend")||query.includes("spending")){
      if(overBudget.length>0){
        return `You're overspending in ${overBudget.length} categories. Your top overspending category is ${overBudget[0][0]} where you've spent Rs.${(catSpend[overBudget[0][0]]||0).toLocaleString("en-IN")} against a budget of Rs.${overBudget[0][1].toLocaleString("en-IN")}. Consider cutting back on ${topCategories[0][0]} which is your highest expense at Rs.${topCategories[0][1].toLocaleString("en-IN")}.`;
      } else {
        return `Great news! You're within budget in all categories. Your highest spending is ${topCategories[0][0]} at Rs.${topCategories[0][1].toLocaleString("en-IN")}, which is ${budgets[topCategories[0][0]]?`within your budget of Rs.${budgets[topCategories[0][0]].toLocaleString("en-IN")}`:`a category to monitor`}.`;
      }
    }
    
    if(query.includes("savings")||query.includes("save")){
      if(savingsRate<20){
        return `Your current savings rate is ${savingsRate}%, which is below the recommended 20%. To improve this, try reducing your ${topCategories[0][0]} expenses by Rs.${Math.round((totalExpenses*0.2-totalExpenses*savingsRate/100)/12).toLocaleString("en-IN")}/month or look for ways to increase your income.`;
      } else {
        return `Excellent! Your savings rate is ${savingsRate}%, which is healthy. Consider investing your surplus of Rs.${Math.round(totalExpenses*(savingsRate-20)/100).toLocaleString("en-IN")} for better returns.`;
      }
    }
    
    if(query.includes("subscription")||query.includes("cut")){
      const recurring=txns.filter(t=>t.recurring&&t.type==="expense");
      if(recurring.length>0){
        const highRecurring=recurring.filter(t=>t.amount>1000).sort((a,b)=>b.amount-a.amount);
        return `You have ${recurring.length} recurring expenses totaling Rs.${recurring.reduce((s,t)=>s+t.amount,0).toLocaleString("en-IN")}/month. Consider reviewing ${highRecurring[0]?.description||'your subscriptions'} which costs Rs.${highRecurring[0]?.amount.toLocaleString("en-IN")||'0'}/month.`;
      } else {
        return `I don't see any recurring subscriptions in your data. Review your monthly expenses for any services you could cancel.`;
      }
    }
    
    if(query.includes("budget")||query.includes("plan")){
      return `Based on your income of Rs.${totalIncome.toLocaleString("en-IN")} and expenses of Rs.${totalExpenses.toLocaleString("en-IN")}, here's a suggested budget: ${topCategories.map(([cat,amt],i)=>`${cat}: Rs.${Math.round(amt*0.9).toLocaleString("en-IN")}`).join(", ")}. This would increase your savings to ${Math.round((totalIncome-totalExpenses*0.9)/totalIncome*100)}%.`;
    }
    
    if(query.includes("goal")||query.includes("track")){
      if(goals.length>0){
        const onTrack=goals.filter(g=>g.current/g.target>=0.5);
        return `You have ${goals.length} goals. ${onTrack.length} are on track (${Math.round(onTrack.length/goals.length*100)}%). Focus on ${goals.find(g=>g.current/g.target<0.5)?.name||'your goals'} by increasing monthly contributions by Rs.${Math.round((goals.find(g=>g.current/g.target<0.5)?.target-goals.find(g=>g.current/g.target<0.5)?.current)/6).toLocaleString("en-IN")}.`;
      } else {
        return `You haven't set any financial goals yet. Consider setting goals for emergency fund, retirement, or major purchases.`;
      }
    }
    
    if(query.includes("compare")||query.includes("average")){
      return `Your spending pattern shows ${topCategories[0][0]} as your biggest expense at Rs.${topCategories[0][1].toLocaleString("en-IN")}. Your savings rate of ${savingsRate}% is ${savingsRate>=20?"above":"below"} the recommended 20%. Consider this when planning your budget.`;
    }
    
    // Default response
    return `Based on your financial data: Your income is Rs.${totalIncome.toLocaleString("en-IN")}, expenses are Rs.${totalExpenses.toLocaleString("en-IN")}, with a ${healthScore}/100 health score. Your top expense category is ${topCategories[0][0]} at Rs.${topCategories[0][1].toLocaleString("en-IN")}. What specific aspect would you like me to analyze?`;
  };

  const AI_PROMPTS=["Where am I overspending?","How can I improve my savings rate?","Which subscriptions should I cut?","Give me a monthly budget plan","Am I on track for my goals?","How does my spending compare to averages?"];

  /* ── Goals ── */
  const openGoalModal=(g=null)=>{
    setEditGoal(g);
    setGoalForm(g?{name:g.name,target:String(g.target),current:String(g.current),deadline:g.deadline,icon:g.icon,color:g.color}:{name:"",target:"",current:"0",deadline:"",icon:"🎯",color:"#bf5fff"});
    setGoalModal(true);
  };
  const saveGoal=()=>{
    const t=parseFloat(goalForm.target),c=parseFloat(goalForm.current)||0;
    if(!goalForm.name||isNaN(t)||t<=0||!goalForm.deadline)return;
    if(editGoal) setGoals(p=>p.map(g=>g.id===editGoal.id?{...g,...goalForm,target:t,current:c}:g));
    else setGoals(p=>[...p,{id:Date.now(),...goalForm,target:t,current:c}]);
    setGoalModal(false);
  };
  const contributeToGoal=(id)=>{
    const amt=parseFloat(contribAmts[id]||0);
    if(isNaN(amt)||amt<=0)return;
    setGoals(p=>p.map(g=>g.id===id?{...g,current:Math.min(g.current+amt,g.target)}:g));
    setContribAmts(p=>({...p,[id]:""}));
  };
  const deleteGoal=id=>setGoals(p=>p.filter(g=>g.id!==id));
  const daysLeft=deadline=>{
    const d=Math.ceil((new Date(deadline)-new Date())/(1000*60*60*24));
    return d;
  };

  /* ── CSV Import ── */
  const handleCSV=(file)=>{
    if(!file)return;
    const reader=new FileReader();
    reader.onload=e=>{
      const lines=e.target.result.split("\n").filter(l=>l.trim());
      const rows=lines.slice(1);
      const newTxns=rows.map((row,i)=>{
        const cols=row.match(/(".*?"|[^,]+)/g)||[];
        const clean=s=>(s||"").replace(/^"|"$/g,"").trim();
        const date=clean(cols[0]);
        const desc=clean(cols[1]);
        const cat=CATS.includes(clean(cols[2]))?clean(cols[2]):"Food";
        const type=clean(cols[3])==="income"?"income":"expense";
        const amt=parseFloat(clean(cols[4]))||0;
        if(!date||!desc||amt<=0)return null;
        return{id:Date.now()+i,date,description:desc,category:cat,type,amount:amt,recurring:false};
      }).filter(Boolean);
      if(newTxns.length>0){
        setTxns(p=>[...newTxns,...p]);
        alert(`✅ Imported ${newTxns.length} transactions successfully!`);
      }else{
        alert("No valid transactions found. Make sure your CSV has columns: Date, Description, Category, Type, Amount");
      }
    };
    reader.readAsText(file);
  };

  /* ── Forecast ── */
  const forecast=useMemo(()=>{
    const months=monthly.filter(m=>m.exp>0);
    if(months.length<2)return{income:0,expense:0,savings:0};
    const avgInc=months.reduce((s,m)=>s+m.inc,0)/months.length;
    const avgExp=months.reduce((s,m)=>s+m.exp,0)/months.length;
    const trend=months.length>=3?(months[months.length-1].exp-months[0].exp)/(months.length-1)*0.1:0;
    const projExp=Math.max(0,avgExp+trend);
    return{income:Math.round(avgInc),expense:Math.round(projExp),savings:Math.round(avgInc-projExp)};
  },[monthly]);

  /* ── Heatmap ── */
  const heatmapData=useMemo(()=>{
    const map={};
    txns.filter(t=>t.type==="expense").forEach(t=>{map[t.date]=(map[t.date]||0)+t.amount;});
    return map;
  },[txns]);
  const heatmapMax=Math.max(1,...Object.values(heatmapData));

  /* ── Upcoming bills ── */
  const upcomingBills=useMemo(()=>{
    const today=new Date();
    return txns.filter(t=>t.recurring&&t.type==="expense")
      .map(t=>{
        const lastDate=new Date(t.date);
        const nextDate=new Date(lastDate);
        nextDate.setMonth(nextDate.getMonth()+1);
        while(nextDate<today) nextDate.setMonth(nextDate.getMonth()+1);
        const days=Math.ceil((nextDate-today)/(1000*60*60*24));
        return{...t,nextDate:nextDate.toISOString().split("T")[0],daysUntil:days};
      })
      .sort((a,b)=>a.daysUntil-b.daysUntil)
      .slice(0,8);
  },[txns]);

  /* ── AI TIPS ── */
  const aiTips=useMemo(()=>{
    const tips=[];
    const topCat=catData[0];
    if(topCat) tips.push({icon:"🔥",title:`High ${topCat.name} Spend`,body:`You've spent ${fmt(topCat.value)} on ${topCat.name} — ${topCat.percentage}% of your expenses. Consider setting a stricter limit.`,tag:"Spending Alert"});
    const savRate=parseFloat(health.savRate);
    if(savRate<20) tips.push({icon:"💡",title:"Boost Your Savings",body:`Your current savings rate is ${health.savRate}%. Financial experts recommend saving at least 20% of income.`,tag:"Savings Tip"});
    else tips.push({icon:"🌟",title:"Savings on Track",body:`Great job! You're saving ${health.savRate}% of your income. Keep up this momentum.`,tag:"On Track"});
    const overBudget=Object.entries(budgets).filter(([k,v])=>(catSpend[k]||0)>v);
    if(overBudget.length) tips.push({icon:"⚠️",title:`${overBudget.length} Budget${overBudget.length>1?"s":""} Exceeded`,body:`${overBudget.map(([k])=>k).join(", ")} ${overBudget.length>1?"are":"is"} over budget. Review your spending to get back on track.`,tag:"Budget Warning"});
    else tips.push({icon:"✅",title:"All Budgets Clear",body:"You're within budget for all categories this period. Excellent financial discipline!",tag:"Budget Health"});
    return tips.slice(0,3);
  },[catData,health,budgets,catSpend]);

  /* ── NAV ── */
  const navItems=[
    {id:"overview",icon:<LayoutDashboard className="sni"/>,label:"Overview"},
    {id:"wallet",icon:<Wallet className="sni"/>,label:"Wallet"},
    {id:"transactions",icon:<List className="sni"/>,label:"Transactions"},
    {id:"budget",icon:<Target className="sni"/>,label:"Budget Goals"},
    {id:"insights",icon:<Lightbulb className="sni"/>,label:"Insights"},
    {id:"goals",icon:<Flag className="sni"/>,label:"Goals"},
    {id:"advisor",icon:<Bot className="sni"/>,label:"AI Advisor"},
  ];
  const tabMeta={overview:"Overview",wallet:"Wallet",transactions:"Transactions",budget:"Budget Goals",insights:"Insights",goals:"Savings Goals",advisor:"AI Financial Advisor"};
  const tabSub={overview:"Your complete financial picture",wallet:"Spending & recurring breakdown",transactions:"All transactions & history",budget:"Set & track spending limits",insights:"Analytics & health score",goals:"Track your financial goals",advisor:"Get personalized AI insights"};

  const getChartData=()=>{
    if(timeView==="weekly") return[
      {label:"Week 1",income:95000,expense:45000},{label:"Week 2",income:24000,expense:32000},
      {label:"Week 3",income:15000,expense:28000},{label:"Week 4",income:32000,expense:35000},
      {label:"Week 5",income:20000,expense:22000},{label:"Week 6",income:6500,expense:18000},
    ];
    if(timeView==="monthly") return monthly.map(m=>({label:m.month,income:m.inc,expense:m.exp}));
    const yr=new Date().getFullYear();
    return[0,1,2,3].map(i=>({label:String(yr-3+i),income:1200000+(i*180000),expense:980000+(i*120000)}));
  };

  /* ── VIEWS ── */
  const vOverview=()=>{
    const chartData=getChartData();
    return(
      <div className="fi">
        {/* Hero stats */}
        <div className="scs">
          {[
            {lb:"Net Balance",val:fmt(cBal),cls:"balance",ic:"💰",note:"Total funds available",trend:{type:sum.bal>=0?"up":"down",value:sum.bal>=0?"+12.4%":"-3.1%"}},
            {lb:"Total Income",val:fmt(cInc),cls:"income",ic:"📈",note:"All income sources",trend:{type:"up",value:"+8.2%"}},
            {lb:"Total Expenses",val:fmt(cExp),cls:"expense",ic:"💳",note:"All spending",trend:{type:"down",value:"-4.7%"}},
            {lb:"Net Savings",val:fmt(cSav),cls:"savings",ic:"🎯",note:`${health.savRate}% savings rate`,trend:{type:sum.sav>=0?"up":"down",value:`${health.savRate}%`}},
          ].map((c,i)=>(
            <div key={i} className={`sc ${c.cls}`}>
              <div className="sc-ic">{c.ic}</div>
              <div className="sc-lb">{c.lb}</div>
              <div className="sc-vl">{c.val}</div>
              <div className="sc-nt">{c.note}</div>
              <div className={`sc-trend ${c.trend.type}`}>
                {c.trend.type==="up"?<TrendingUp size={10}/>:<TrendingDown size={10}/>}
                {c.trend.value}
              </div>
            </div>
          ))}
        </div>

        {/* AI Tips */}
        <div className="g1">
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <div style={{width:28,height:28,borderRadius:8,background:"rgba(99,102,241,.15)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--primary)"}}><Zap size={14}/></div>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:".6px",textTransform:"uppercase",color:"var(--primary)"}}>Smart Insights</span>
          </div>
          <div className="tips-row">
            {aiTips.map((t,i)=>(
              <div key={i} className="tip-card">
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div className="tip-ic"><span style={{fontSize:14}}>{t.icon}</span></div>
                  <div className="tip-tag">{t.tag}</div>
                </div>
                <div className="tip-tt">{t.title}</div>
                <div className="tip-bd">{t.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast Next Month */}
        <div style={{padding:"0 24px 4px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <div style={{width:28,height:28,borderRadius:8,background:"rgba(255,230,0,.12)",display:"flex",alignItems:"center",justifyContent:"center",color:"#ffe600"}}><Flame size={14}/></div>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:".6px",textTransform:"uppercase",color:"#ffe600"}}>Next Month Forecast</span>
            <span style={{fontSize:10,color:"var(--mu)",fontWeight:500}}>Based on your 6-month average</span>
          </div>
        </div>
        <div className="forecast-strip">
          {[
            {label:"Projected Income",value:fmt(forecast.income),note:"Based on avg monthly inflows",color:"#39ff14",icon:"📈",trend:"up"},
            {label:"Projected Expenses",value:fmt(forecast.expense),note:"Includes trend adjustment",color:"#ff2d78",icon:"💳",trend:forecast.expense>forecast.income?"down":"up"},
            {label:"Projected Savings",value:fmt(forecast.savings),note:`${forecast.income>0?((forecast.savings/forecast.income)*100).toFixed(1):0}% projected savings rate`,color:forecast.savings>=0?"#ffe600":"#ff2d78",icon:"🎯",trend:forecast.savings>=0?"up":"down"},
          ].map((f,i)=>(
            <div key={i} className="fc-card">
              <div className="fc-card" style={{padding:0,background:"none",border:"none"}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${f.color},transparent)`}}/>
              </div>
              <div className="fc-label">
                <span style={{fontSize:16}}>{f.icon}</span>
                {f.label}
              </div>
              <div className="fc-value" style={{color:f.color}}>{f.value}</div>
              <div className="fc-note">{f.note}</div>
              <div className="fc-badge" style={{background:`${f.color}18`,color:f.color,border:`1px solid ${f.color}30`}}>
                {f.trend==="up"?<TrendingUp size={10}/>:<TrendingDown size={10}/>}
                {f.trend==="up"?"Positive":"Watch out"}
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="g2">
          <div className="cc">
            <div className="cc-hd">
              <span className="cc-tt">Income vs Expenses</span>
              <span className="cc-bj">{timeView==="weekly"?"6 Weeks":timeView==="monthly"?"6 Months":"4 Years"}</span>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={chartData} margin={{top:6,right:6,left:0,bottom:0}}>
                <defs>
                  <linearGradient id="gI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" vertical={false}/>
                <XAxis dataKey="label" tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={fmtK}/>
                <Tooltip content={<Tip/>}/>
                <Area type="monotone" dataKey="income" name="Income" stroke="#4ade80" strokeWidth={2} fill="url(#gI)"/>
                <Area type="monotone" dataKey="expense" name="Expense" stroke="#f87171" strokeWidth={2} fill="url(#gE)"/>
              </AreaChart>
            </ResponsiveContainer>
            <div style={{display:"flex",gap:16,marginTop:10,justifyContent:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"var(--su)"}}><div style={{width:8,height:8,borderRadius:"50%",background:"#4ade80"}}/> Income</div>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"var(--su)"}}><div style={{width:8,height:8,borderRadius:"50%",background:"#f87171"}}/> Expense</div>
            </div>
          </div>

          <div className="cc">
            <div className="cc-hd">
              <span className="cc-tt">Category Breakdown</span>
              <select value={pieMonth} onChange={e=>setPieMonth(Number(e.target.value))}
                style={{background:"var(--b0)",border:"1px solid var(--b1)",borderRadius:8,padding:"4px 8px",color:"var(--tx)",fontSize:10,fontFamily:"var(--fn)",outline:"none"}}>
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i)=><option key={i} value={i}>{m}</option>)}
              </select>
            </div>
            {catData.length===0?(
              <div className="emp"><div className="emp-ic">📊</div><div className="emp-t">No expense data</div><div className="emp-s">for this month</div></div>
            ):(
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={catData} cx="50%" cy="50%" innerRadius={52} outerRadius={75} paddingAngle={4} dataKey="value">
                      {catData.map((entry,i)=>(
                        <Cell key={i} fill={CAT[entry.name]?.clr||"#64748b"} strokeWidth={0}/>
                      ))}
                    </Pie>
                    <Tooltip content={<Tip/>}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pl">
                  {catData.slice(0,5).map((c,i)=>(
                    <div key={i} className="pl-r">
                      <div className="pl-d" style={{background:CAT[c.name]?.clr||"#64748b"}}/>
                      <span className="pl-n">{c.name}</span>
                      <span className="pl-p">{c.percentage}%</span>
                      <span className="pl-v">{fmt(c.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="g2">
          <div className="cc">
            <div className="cc-hd"><span className="cc-tt">Monthly Bar</span><span className="cc-bj">H1 2026</span></div>
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={monthly} margin={{top:6,right:6,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" vertical={false}/>
                <XAxis dataKey="month" tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={fmtK}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="inc" name="Income" fill="#4ade80" radius={[6,6,0,0]}/>
                <Bar dataKey="exp" name="Expense" fill="#f87171" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="cc">
            <div className="cc-hd"><span className="cc-tt">Net Savings Trend</span><span className="cc-bj">H1 2026</span></div>
            <ResponsiveContainer width="100%" height={190}>
              <LineChart data={monthly} margin={{top:6,right:6,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.05)" vertical={false}/>
                <XAxis dataKey="month" tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#475569",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={fmtK}/>
                <Tooltip content={<Tip/>}/>
                <Line type="monotone" dataKey="net" name="Net" stroke="#a78bfa" strokeWidth={2.5} dot={{fill:"#a78bfa",r:5,strokeWidth:0}} activeDot={{r:7}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="g1">
          <div className="cc">
            <div className="cc-hd">
              <span className="cc-tt">Recent Activity</span>
              <span className="cc-bj">Latest 5</span>
            </div>
            {recent5.map(t=>(
              <div key={t.id} className="ra">
                <div className="ra-ic" style={{background:CAT[t.category]?.bg||"rgba(100,116,139,.12)"}}>{CAT[t.category]?.icon||"💳"}</div>
                <div className="ra-mid">
                  <div className="ra-nm">{t.description}</div>
                  <div className="ra-ct">{fmtD(t.date)} · {t.category}{t.recurring?" · 🔄":""}</div>
                </div>
                <div className="ra-am" style={{color:t.type==="income"?"#4ade80":"var(--tx)"}}>{t.type==="income"?"+":"−"}{fmt(t.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const vWallet=()=>{
    const avgDaily=(sum.exp/180).toFixed(0);
    const bestM=[...monthly].sort((a,b)=>b.net-a.net)[0];
    const recList=txns.filter(t=>t.recurring);
    return(
      <div className="fi">
        <div className="scs">
          {[
            {lb:"Avg Daily Spend",val:fmt(parseFloat(avgDaily)),cls:"daily",ic:"📅",note:"Based on 6-month data"},
            {lb:"Best Month Net",val:fmt(bestM?.net||0),cls:"budget",ic:"🏆",note:`${bestM?.month||"—"} 2026`},
            {lb:"Recurring Count",val:String(recList.length),cls:"recurring",ic:"🔄",note:"Auto-tagged entries"},
            {lb:"Income Sources",val:String(txns.filter(t=>t.type==="income").map(t=>t.description).filter((v,i,a)=>a.indexOf(v)===i).length),cls:"health",ic:"💡",note:"Unique sources"},
          ].map((c,i)=>(
            <div key={i} className={`sc ${c.cls}`}>
              <div className="sc-ic">{c.ic}</div>
              <div className="sc-lb">{c.lb}</div>
              <div className="sc-vl">{c.val}</div>
              <div className="sc-nt">{c.note}</div>
            </div>
          ))}
        </div>

        <div className="g1">
          <div className="cc" style={{marginBottom:16}}>
            <div className="cc-hd"><span className="cc-tt">Category Spending Analysis</span><span className="cc-bj">All Time</span></div>
            <div className="tw" style={{margin:0}}>
              <table className="tb">
                <thead><tr><th>Category</th><th>Entries</th><th>Avg / txn</th><th>Budget</th><th style={{textAlign:"right"}}>Total</th><th style={{minWidth:140}}>Share</th></tr></thead>
                <tbody>
                  {catData.map((c,i)=>{
                    const allTime=txns.filter(t=>t.category===c.name&&t.type==="expense");
                    const total=allTime.reduce((s,t)=>s+t.amount,0);
                    const count=allTime.length;
                    const avg=count>0?Math.round(total/count):0;
                    const bud=budgets[c.name];
                    const allTimeTotal=Object.values(catSpend).reduce((s,v)=>s+v,0);
                    return(
                      <tr key={i} className="tr">
                        <td><span className="cp" style={{background:CAT[c.name]?.bg,color:CAT[c.name]?.clr}}>{CAT[c.name]?.icon} {c.name}</span></td>
                        <td style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--su)"}}>{count}</td>
                        <td style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--su)"}}>{fmt(avg)}</td>
                        <td style={{fontFamily:"var(--fm)",fontSize:11,color:bud?((catSpend[c.name]||0)>bud?"var(--danger)":(catSpend[c.name]||0)>bud*.8?"var(--warning)":"#4ade80"):"var(--mu)"}}>{bud?fmt(bud):"—"}</td>
                        <td style={{textAlign:"right",fontFamily:"var(--fm)",fontWeight:700,fontSize:13}}>{fmt(total)}</td>
                        <td>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <div className="pb2" style={{flex:1}}><div className="pf2" style={{width:`${(total/Math.max(1,...Object.values(catSpend)))*100}%`,background:CAT[c.name]?.clr}}/></div>
                            <span style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--mu)",minWidth:32,textAlign:"right"}}>{((total/Math.max(1,sum.exp))*100).toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="g1">
          <div className="cc">
            <div className="cc-hd"><span className="cc-tt">Recurring Transactions</span><div style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#4ade80"}}><div style={{width:5,height:5,borderRadius:"50%",background:"#4ade80",boxShadow:"0 0 6px #4ade80"}}/> Live</div></div>
            {recList.length===0?(
              <div className="emp"><div className="emp-ic">🔄</div><div className="emp-t">No recurring transactions</div></div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
                {recList.map(t=>(
                  <div key={t.id} style={{background:"var(--b0)",border:"1px solid var(--b1)",borderRadius:10,padding:"12px",display:"flex",alignItems:"center",gap:10}}>
                    <div style={{fontSize:18,flexShrink:0}}>{CAT[t.category]?.icon||"💳"}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12.5,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.description}</div>
                      <div style={{fontSize:10,color:"var(--mu)",marginTop:2}}>{t.category}</div>
                    </div>
                    <div style={{fontFamily:"var(--fm)",fontSize:12,fontWeight:700,color:t.type==="income"?"#4ade80":"var(--tx)",flexShrink:0}}>{t.type==="income"?"+":"−"}{fmt(t.amount)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Bills Calendar */}
        <div className="g1">
          <div className="cc">
            <div className="cc-hd">
              <span className="cc-tt">📅 Upcoming Bill Due Dates</span>
              <span className="cc-bj">Next 30 days</span>
            </div>
            <div className="bill-list">
              {upcomingBills.length===0?(
                <div className="emp"><div className="emp-ic">🎉</div><div className="emp-t">No upcoming bills</div></div>
              ):upcomingBills.map((b,i)=>{
                const urgency=b.daysUntil<=3?"urgent":b.daysUntil<=14?"soon":"ok";
                return(
                  <div key={i} className="bill-row">
                    <div className="bill-ic" style={{background:CAT[b.category]?.bg}}>{CAT[b.category]?.icon}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12.5,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{b.description}</div>
                      <div className="bill-due">Due: {new Date(b.nextDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</div>
                    </div>
                    <div style={{fontFamily:"var(--fm)",fontSize:13,fontWeight:700,marginRight:8}}>{fmt(b.amount)}</div>
                    <div className={`bill-days ${urgency}`}>
                      {b.daysUntil===0?"Today":b.daysUntil===1?"Tomorrow":`${b.daysUntil}d`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const vTransactions=()=>{
    const fInc=filtered.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
    const fExp=filtered.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
    return(
      <div className="fi" style={{padding:"24px"}}>
        <div className="tc">
          <div className="ts">
            <Search size={13} color="var(--mu)"/>
            <input placeholder="Search by name or category…" value={q} onChange={e=>{setQ(e.target.value);setPage(1);}}/>
            {q&&<button style={{background:"none",border:"none",cursor:"pointer",color:"var(--mu)",display:"flex",padding:0}} onClick={()=>{setQ("");setPage(1);}}><X size={12}/></button>}
          </div>
          <select className="tse" value={fType} onChange={e=>{setFType(e.target.value);setPage(1);}}>
            <option value="all">All Types</option><option value="income">Income</option><option value="expense">Expense</option>
          </select>
          <select className="tse" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="date-desc">Newest First</option><option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option><option value="amount-asc">Lowest Amount</option>
          </select>
          {role==="admin"&&<button className="add" onClick={openAdd}><Plus size={13}/>Add Transaction</button>}
        </div>

        <div className="chips">
          <div className="chip" style={!chipCat?{background:"var(--primary)",borderColor:"var(--primary)",color:"#fff"}:{}} onClick={()=>{setChipCat(null);setPage(1);}}>All</div>
          {allCats.map(c=>(
            <div key={c} className="chip" style={chipCat===c?{background:CAT[c]?.clr,borderColor:"transparent",color:"#fff"}:{}} onClick={()=>onChip(c)}>
              {CAT[c]?.icon} {c}
            </div>
          ))}
        </div>

        <div className="tst">
          <span>Showing <strong>{filtered.length}</strong> of {txns.length}</span>
          <span style={{display:"flex",alignItems:"center",gap:4,color:"#4ade80"}}><TrendingUp size={11}/>{fmt(fInc)}</span>
          <span style={{display:"flex",alignItems:"center",gap:4,color:"var(--danger)"}}><TrendingDown size={11}/>{fmt(fExp)}</span>
          <span>Net: <strong style={{color:fInc-fExp>=0?"#4ade80":"var(--danger)"}}>{fmt(fInc-fExp)}</strong></span>
        </div>

        <div className="tw">
          {paged.length===0?(
            <div className="emp"><div className="emp-ic">🔍</div><div className="emp-t">No transactions found</div><div className="emp-s">Try clearing search or filters</div></div>
          ):(
            <table className="tb">
              <thead>
                <tr>
                  <th>Description</th><th>Date</th><th>Category</th><th>Type</th>
                  <th style={{textAlign:"right"}}>Amount</th>
                  {role==="admin"&&<th style={{width:70}}/>}
                </tr>
              </thead>
              <tbody>
                {paged.map(t=>(
                  <tr key={t.id} className="tr">
                    <td>
                      <div className="td-ds">
                        {t.recurring&&<div className="td-rc" title="Recurring"/>}
                        {t.description}
                      </div>
                    </td>
                    <td><div className="td-dt">{fmtD(t.date)}</div></td>
                    <td><span className="cp" style={{background:CAT[t.category]?.bg,color:CAT[t.category]?.clr}}>{CAT[t.category]?.icon} {t.category}</span></td>
                    <td>
                      <span style={{fontSize:10,fontWeight:700,display:"flex",alignItems:"center",gap:3,color:t.type==="income"?"#4ade80":"var(--danger)"}}>
                        {t.type==="income"?<TrendingUp size={10}/>:<TrendingDown size={10}/>}
                        {t.type==="income"?"INCOME":"EXPENSE"}
                      </span>
                    </td>
                    <td style={{textAlign:"right"}}>
                      <span className="ta" style={{color:t.type==="income"?"#4ade80":"var(--tx)"}}>
                        {t.type==="income"?"+":"−"}{fmt(t.amount)}
                      </span>
                    </td>
                    {role==="admin"&&(
                      <td>
                        <div className="tac">
                          <button className="ab ed" onClick={()=>openEdit(t)}><Edit2 size={11}/></button>
                          <button className="ab dl" onClick={()=>del(t.id)}><Trash2 size={11}/></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages>1&&(
          <div className="pag">
            <div className="pi">Page {page} of {totalPages} · {filtered.length} results</div>
            <div className="pbs">
              <button className="pb" disabled={page<=1} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={12}/></button>
              {Array.from({length:totalPages},(_,i)=>i+1)
                .filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1)
                .reduce((acc,p,i,arr)=>{if(i>0&&p-arr[i-1]>1)acc.push("…");acc.push(p);return acc;},[])
                .map((p,i)=>typeof p==="string"
                  ?<span key={i} style={{padding:"0 4px",fontSize:12,color:"var(--mu)"}}>…</span>
                  :<button key={i} className={`pb${page===p?" on":""}`} onClick={()=>setPage(p)}>{p}</button>
                )}
              <button className="pb" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}><ChevronRight size={12}/></button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const vBudget=()=>{
    const overC=Object.entries(budgets).filter(([k,v])=>(catSpend[k]||0)>v).length;
    const safeC=Object.entries(budgets).filter(([k,v])=>(catSpend[k]||0)<=v*0.8).length;
    return(
      <div className="fi">
        <div className="scs">
          {[
            {lb:"Total Budget",v:fmt(totalBud),cls:"budget",ic:"💰",note:"Monthly limit"},
            {lb:"Total Spent",v:fmt(totalSp),cls:"expense",ic:"💳",note:totalSp>totalBud?"Over budget!":"On track"},
            {lb:"Over Budget",v:`${overC} cats`,cls:"danger",ic:"⚠️",note:"Need attention"},
            {lb:"On Track",v:`${safeC} cats`,cls:"health",ic:"✅",note:"Good progress"},
          ].map((c,i)=>(
            <div key={i} className={`sc ${c.cls}`}>
              <div className="sc-ic">{c.ic}</div>
              <div className="sc-lb">{c.lb}</div>
              <div className="sc-vl">{c.v}</div>
              <div className="sc-nt">{c.note}</div>
            </div>
          ))}
        </div>

        <div className="g1">
          <div className="cc" style={{marginBottom:16}}>
            <div className="cc-hd"><span className="cc-tt">Overall Budget Utilization</span><span className="cc-bj">{budUtil.toFixed(1)}% used</span></div>
            <div style={{height:10,background:"var(--b1)",borderRadius:5,overflow:"hidden",marginBottom:8}}>
              <div style={{height:"100%",width:`${budUtil}%`,background:budUtil>=100?"var(--danger)":budUtil>=80?"var(--warning)":"#4ade80",borderRadius:5,transition:"width 1.2s ease",boxShadow:budUtil>=100?"0 0 10px var(--danger)":budUtil>=80?"0 0 10px var(--warning)":"0 0 10px #4ade80"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--mu)",fontFamily:"var(--fm)"}}>
              <span>₹0</span>
              <span style={{color:budUtil>=100?"var(--danger)":budUtil>=80?"var(--warning)":"#4ade80",fontWeight:700}}>{fmt(totalSp)} spent</span>
              <span>{fmt(totalBud)}</span>
            </div>
            {role!=="admin"&&(
              <div style={{marginTop:12,padding:"8px 12px",background:"rgba(99,102,241,.07)",borderRadius:10,fontSize:11,color:"var(--primary)",border:"1px solid rgba(99,102,241,.15)"}}>
                Switch to Admin to edit budget limits
              </div>
            )}
          </div>
        </div>

        <div style={{padding:"0 24px 24px"}}>
          <div className="bg">
            {Object.entries(budgets).map(([cat,budget])=>{
              const spent=catSpend[cat]||0,p=Math.min((spent/budget)*100,100);
              const over=spent>budget,warn=!over&&p>=80;
              const bc=over?"var(--danger)":warn?"var(--warning)":CAT[cat]?.clr||"#4ade80";
              return(
                <div key={cat} className="bc">
                  <div className="bc-tp">
                    <div className="bc-ca">
                      <div className="bc-ni" style={{background:CAT[cat]?.bg}}>{CAT[cat]?.icon||"💳"}</div>
                      <div className="bc-nm">{cat}</div>
                    </div>
                    <div className={`bc-st ${over?"ov":warn?"wn":"ok"}`}>{over?"OVER":warn?"WARN":"OK"}</div>
                  </div>
                  <div className="bb"><div className="bf" style={{width:`${p}%`,background:bc,boxShadow:`0 0 8px ${bc}40`}}/></div>
                  <div className="bns">
                    <span className="bs" style={{color:bc}}>{fmt(spent)}</span>
                    <span className="bt">/ {fmt(budget)}</span>
                  </div>
                  {role==="admin"&&(
                    <div className="be">
                      <input type="range" className="bsl" min={0} max={50000} step={500} value={budget}
                        onChange={e=>setBudgets(pr=>({...pr,[cat]:parseInt(e.target.value)||0}))}/>
                      <input type="number" className="bv" value={budget} min={0}
                        onChange={e=>setBudgets(pr=>({...pr,[cat]:Math.max(0,parseInt(e.target.value)||0)}))}/>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const vInsights=()=>{
    const avgExp=monthly.filter(m=>m.exp>0).reduce((s,m)=>s+m.exp,0)/Math.max(monthly.filter(m=>m.exp>0).length,1);
    const best=[...monthly].sort((a,b)=>b.net-a.net)[0];
    return(
      <div className="fi">
        <div style={{padding:"24px 24px 0"}}>
          <div className="hs-sec">
            <HealthGauge score={health.total}/>
            <div style={{flex:1}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:".8px",textTransform:"uppercase",color:"var(--su)",marginBottom:14}}>Score Breakdown</div>
              <div className="hf">
                {[
                  {lb:"Savings Rate",pts:health.savPts,max:40,nt:`${health.savRate}% of income`,clr:"#4ade80"},
                  {lb:"Budget Adherence",pts:health.budPts,max:40,nt:`${Math.round(health.budPts/40*100)}% categories on track`,clr:"var(--warning)"},
                  {lb:"Income Diversity",pts:health.divPts,max:20,nt:`${txns.filter(t=>t.type==="income").map(t=>t.category).filter((v,i,a)=>a.indexOf(v)===i).length} source(s)`,clr:"var(--accent)"},
                ].map((f,i)=>(
                  <div key={i} className="hf-r">
                    <div className="hf-lb">{f.lb}</div>
                    <div className="hf-bg"><div className="hf-fl" style={{width:`${(f.pts/f.max)*100}%`,background:f.clr,boxShadow:`0 0 6px ${f.clr}`}}/></div>
                    <div className="hf-pt" style={{color:f.clr}}>{f.pts}/{f.max}</div>
                    <div className="hf-nt">{f.nt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="scs">
          {[
            {ic:"🏆",lb:"Top Spending Category",vl:catData[0]?.name||"—",sb:`${fmt(catData[0]?.value||0)} total`,cls:"expense"},
            {ic:"💰",lb:"Savings Rate",vl:`${health.savRate}%`,sb:`${fmt(sum.bal)} saved total`,cls:"income"},
            {ic:"📊",lb:"Avg Monthly Expense",vl:fmtK(Math.round(avgExp)),sb:"Per month H1 2026",cls:"budget"},
            {ic:"🌟",lb:"Best Month",vl:best?.month||"—",sb:`${fmt(best?.net||0)} net`,cls:"daily"},
          ].map((c,i)=>(
            <div key={i} className={`sc ${c.cls}`}>
              <div className="sc-ic">{c.ic}</div>
              <div className="sc-lb">{c.lb}</div>
              <div className="sc-vl">{c.vl}</div>
              <div className="sc-nt">{c.sb}</div>
            </div>
          ))}
        </div>

        <div className="g1">
          <div className="cc">
            <div className="cc-hd"><span className="cc-tt">Spending Rank by Category</span><span className="cc-bj">All Time</span></div>
            {catData.map((c,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:"1px solid var(--b0)"}}>
                <div style={{width:22,height:22,borderRadius:7,background:"var(--b0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontFamily:"var(--fm)",color:"var(--mu)",fontWeight:700,flexShrink:0}}>#{i+1}</div>
                <div style={{fontSize:16,flexShrink:0}}>{CAT[c.name]?.icon||"💳"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12.5,fontWeight:600}}>{c.name}</span>
                    <span style={{fontFamily:"var(--fm)",fontSize:12.5,fontWeight:700}}>{fmt(c.value)}</span>
                  </div>
                  <div className="pb2"><div className="pf2" style={{width:`${(c.value/catData[0].value)*100}%`,background:CAT[c.name]?.clr}}/></div>
                </div>
                <span style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--mu)",minWidth:36,textAlign:"right"}}>{c.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spending Heatmap */}
        <div className="g1">
          <div className="cc">
            <div className="cc-hd">
              <span className="cc-tt">Daily Spending Heatmap</span>
              <span className="cc-bj">Jan–Jun 2026</span>
            </div>
            <div style={{overflowX:"auto"}}>
              {(()=>{
                const months=["Jan","Feb","Mar","Apr","May","Jun"];
                const startDate=new Date("2026-01-01");
                const allDays=[];
                for(let d=new Date(startDate);d<=new Date("2026-06-30");d.setDate(d.getDate()+1)){
                  allDays.push(d.toISOString().split("T")[0]);
                }
                // group by week
                const startDow=startDate.getDay();
                const cells=[];
                for(let i=0;i<startDow;i++) cells.push(null);
                allDays.forEach(d=>cells.push(d));
                const weeks=[];
                for(let i=0;i<cells.length;i+=7) weeks.push(cells.slice(i,i+7));
                const dayLabels=["S","M","T","W","T","F","S"];
                return(
                  <div style={{display:"flex",gap:0}}>
                    <div style={{display:"flex",flexDirection:"column",gap:3,marginRight:6,paddingTop:20}}>
                      {dayLabels.map((d,i)=><div key={i} style={{height:14,fontSize:9,color:"var(--mu)",lineHeight:"14px",fontWeight:600}}>{i%2===1?d:""}</div>)}
                    </div>
                    <div style={{flex:1,overflowX:"auto"}}>
                      <div style={{display:"flex",gap:0,marginBottom:4}}>
                        {months.map((m,mi)=>{
                          const mStart=new Date(2026,mi,1);
                          const dow=mStart.getDay();
                          const weekIdx=Math.floor((Math.floor((mStart-startDate)/(86400000))+startDow)/7);
                          return<div key={m} style={{position:"absolute",left:`${weekIdx*17}px`,fontSize:9,color:"var(--mu)",fontWeight:700}}>{m}</div>;
                        })}
                        <div style={{height:14,position:"relative",width:`${weeks.length*17}px`}}>
                          {months.map((m,mi)=>{
                            const mStart=new Date(2026,mi,1);
                            const weekIdx=Math.floor((Math.floor((mStart-startDate)/(86400000))+startDow)/7);
                            return<span key={m} style={{position:"absolute",left:`${weekIdx*17}px`,fontSize:9,color:"var(--mu)",fontWeight:700,letterSpacing:.4}}>{m}</span>;
                          })}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:3}}>
                        {weeks.map((week,wi)=>(
                          <div key={wi} style={{display:"flex",flexDirection:"column",gap:3}}>
                            {week.map((day,di)=>{
                              if(!day) return<div key={di} style={{width:14,height:14}}/>;
                              const amt=heatmapData[day]||0;
                              const intensity=amt/heatmapMax;
                              const alpha=amt===0?0.05:0.15+intensity*0.85;
                              const color=amt===0?"rgba(180,140,255,.06)":`rgba(191,95,255,${alpha})`;
                              return(
                                <div key={di} title={`${day}: ${amt>0?fmt(amt):"No spending"}`}
                                  style={{width:14,height:14,borderRadius:3,background:color,border:`1px solid rgba(191,95,255,${alpha*.4})`,cursor:"default",transition:"transform .1s",boxShadow:amt>0?`0 0 ${intensity*8}px rgba(191,95,255,${intensity*.4})`:""}}
                                  onMouseEnter={e=>e.target.style.transform="scale(1.5)"}
                                  onMouseLeave={e=>e.target.style.transform="scale(1)"}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:14,flexShrink:0}}>
                      <span style={{fontSize:9,color:"var(--mu)"}}>Less</span>
                      {[0.05,0.25,0.5,0.75,1].map((v,i)=>(
                        <div key={i} style={{width:12,height:12,borderRadius:3,background:`rgba(191,95,255,${v===0.05?0.06:0.15+v*0.85})`}}/>
                      ))}
                      <span style={{fontSize:9,color:"var(--mu)"}}>More</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────
     GOALS VIEW
  ──────────────────────────────────────────── */
  const vGoals=()=>{
    const totalGoalTarget=goals.reduce((s,g)=>s+g.target,0);
    const totalGoalCurrent=goals.reduce((s,g)=>s+g.current,0);
    const completed=goals.filter(g=>g.current>=g.target).length;
    return(
      <div className="fi">
        <div className="scs">
          {[
            {lb:"Total Goals",v:String(goals.length),cls:"balance",ic:"🎯",note:"Active targets"},
            {lb:"Total Saved",v:fmt(totalGoalCurrent),cls:"income",ic:"💰",note:`of ${fmt(totalGoalTarget)} target`},
            {lb:"Completed",v:String(completed),cls:"health",ic:"✅",note:"Goals achieved"},
            {lb:"Overall Progress",v:`${totalGoalTarget>0?Math.round((totalGoalCurrent/totalGoalTarget)*100):0}%`,cls:"savings",ic:"📊",note:"Across all goals"},
          ].map((c,i)=>(
            <div key={i} className={`sc ${c.cls}`}>
              <div className="sc-ic">{c.ic}</div>
              <div className="sc-lb">{c.lb}</div>
              <div className="sc-vl">{c.v}</div>
              <div className="sc-nt">{c.note}</div>
            </div>
          ))}
        </div>

        {/* CSV Import strip */}
        <div style={{padding:"0 24px 20px",display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1,padding:"12px 16px",background:"var(--b0)",border:"1px solid var(--b1)",borderRadius:12,display:"flex",alignItems:"center",gap:10,fontSize:12,color:"var(--su)"}}>
            <Upload size={14} color="#bf5fff"/>
            <span>Import transactions from your bank — </span>
            <input ref={fileInputRef} type="file" accept=".csv" style={{display:"none"}} onChange={e=>handleCSV(e.target.files[0])}/>
            <button onClick={()=>fileInputRef.current?.click()} style={{background:"linear-gradient(135deg,#bf5fff,#00d4ff)",border:"none",borderRadius:8,padding:"5px 14px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",boxShadow:"0 3px 10px rgba(191,95,255,.3)"}}>
              Upload CSV
            </button>
            <span style={{fontSize:10,color:"var(--mu)"}}>Format: Date, Description, Category, Type, Amount</span>
          </div>
        </div>

        <div className="goals-grid">
          {goals.map(g=>{
            const pct=Math.min((g.current/g.target)*100,100);
            const done=g.current>=g.target;
            const days=daysLeft(g.deadline);
            const urgency=days<=7?"urgent":days<=30?"soon":"ok";
            return(
              <div key={g.id} className="goal-card" style={{borderTop:`2px solid ${g.color}`}}>
                <div className="goal-top">
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <div className="goal-ic" style={{background:`${g.color}18`,border:`1px solid ${g.color}30`}}>{g.icon}</div>
                    <div>
                      <div className="goal-name">{g.name}</div>
                      <div className="goal-deadline">
                        <Calendar size={10}/>
                        {new Date(g.deadline).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                        {" · "}
                        <span style={{color:urgency==="urgent"?"#ff2d78":urgency==="soon"?"#ff6b35":"#39ff14",fontWeight:700}}>
                          {days>0?`${days}d left`:"Past due"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {role==="admin"&&(
                    <div className="goal-actions">
                      <button className="ab ed" onClick={()=>openGoalModal(g)}><Edit2 size={11}/></button>
                      <button className="ab dl" onClick={()=>deleteGoal(g.id)}><Trash2 size={11}/></button>
                    </div>
                  )}
                </div>

                <div className="goal-amounts">
                  <div className="goal-curr" style={{color:g.color}}>{fmt(g.current)}</div>
                  <div className="goal-tgt">of {fmt(g.target)}</div>
                </div>

                <div className="goal-bar">
                  <div className="goal-fill" style={{width:`${pct}%`,background:`linear-gradient(90deg,${g.color},${g.color}cc)`}}/>
                </div>
                <div className="goal-pct" style={{color:g.color}}>{pct.toFixed(1)}% complete · {fmt(g.target-g.current)} remaining</div>

                {done?(
                  <div className="goal-completed"><CheckCircle size={14}/> Goal Achieved! 🎉</div>
                ):role==="admin"&&(
                  <div className="goal-contrib">
                    <input className="goal-inp" type="number" placeholder="Contribute ₹" value={contribAmts[g.id]||""} onChange={e=>setContribAmts(p=>({...p,[g.id]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&contributeToGoal(g.id)}/>
                    <button className="goal-add-btn" onClick={()=>contributeToGoal(g.id)}>Add ₹</button>
                  </div>
                )}
              </div>
            );
          })}
          {role==="admin"&&(
            <div className="new-goal-btn" onClick={()=>openGoalModal()}>
              <Plus size={20} color="#bf5fff"/>
              <span>Add New Goal</span>
            </div>
          )}
        </div>

        {/* Goal Modal */}
        {goalModal&&(
          <div className="mbk" onClick={e=>e.target===e.currentTarget&&setGoalModal(false)}>
            <div className="mdl">
              <div className="m-tt">
                {editGoal?"Edit Goal":"New Goal"}
                <button style={{background:"none",border:"none",color:"var(--su)",cursor:"pointer",display:"flex",padding:0}} onClick={()=>setGoalModal(false)}><X size={14}/></button>
              </div>
              <div className="m-fd"><label className="m-lb">Goal Name</label><input className="m-ip" placeholder="e.g. Emergency Fund" value={goalForm.name} onChange={e=>setGoalForm(p=>({...p,name:e.target.value}))}/></div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div className="m-fd"><label className="m-lb">Target (₹)</label><input className="m-ip" type="number" placeholder="100000" value={goalForm.target} onChange={e=>setGoalForm(p=>({...p,target:e.target.value}))}/></div>
                <div className="m-fd"><label className="m-lb">Saved So Far (₹)</label><input className="m-ip" type="number" placeholder="0" value={goalForm.current} onChange={e=>setGoalForm(p=>({...p,current:e.target.value}))}/></div>
              </div>
              <div className="m-fd"><label className="m-lb">Target Date</label><input className="m-ip" type="date" value={goalForm.deadline} onChange={e=>setGoalForm(p=>({...p,deadline:e.target.value}))}/></div>
              <div className="m-fd"><label className="m-lb">Icon</label><input className="m-ip" value={goalForm.icon} onChange={e=>setGoalForm(p=>({...p,icon:e.target.value}))} style={{fontSize:20,textAlign:"center"}}/></div>
              <div className="m-fd">
                <label className="m-lb">Color</label>
                <div className="gm-colors">
                  {GOAL_COLORS.map(c=>(
                    <div key={c} className={`gm-color${goalForm.color===c?" sel":""}`} style={{background:c}} onClick={()=>setGoalForm(p=>({...p,color:c}))}/>
                  ))}
                </div>
              </div>
              <div className="m-ac">
                <button className="m-cn" onClick={()=>setGoalModal(false)}>Cancel</button>
                <button className="m-sb" onClick={saveGoal}>{editGoal?"Save Changes":"Create Goal"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ─────────────────────────────────────────────
     AI ADVISOR VIEW
  ──────────────────────────────────────────── */
  const vAdvisor=()=>(
    <div className="fi">
      {/* Summary stats for context */}
      <div className="ai-stats-strip">
        {[
          {label:"Monthly Income",value:fmt(Math.round(sum.inc/6)),color:"#39ff14"},
          {label:"Monthly Expense",value:fmt(Math.round(sum.exp/6)),color:"#ff2d78"},
          {label:"Savings Rate",value:`${health.savRate}%`,color:"#ffe600"},
          {label:"Health Score",value:`${health.total}/100`,color:"#bf5fff"},
        ].map((s,i)=>(
          <div key={i} className="ai-stat">
            <div className="ai-stat-v" style={{color:s.color}}>{s.value}</div>
            <div className="ai-stat-l">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="ai-wrap">
        {/* Quick prompt chips */}
        <div className="ai-chips-row">
          {AI_PROMPTS.map((p,i)=>(
            <div key={i} className="ai-chip" onClick={()=>{setAiInput(p);}}>
              {p}
            </div>
          ))}
        </div>

        {/* Chat window */}
        <div className="ai-chat">
          {aiMessages.map((m,i)=>(
            <div key={i} className={`ai-msg ${m.role==="user"?"user":"bot"}`}>
              <div className={`ai-avatar ${m.role==="user"?"usr":"bot"}`}>
                {m.role==="user"?"👤":"🤖"}
              </div>
              <div>
                <div className={`ai-bubble ${m.role==="user"?"usr":"bot"}`}>
                  {m.content}
                </div>
                <div className="ai-time" style={{textAlign:m.role==="user"?"right":"left"}}>{m.time}</div>
              </div>
            </div>
          ))}
          {aiLoading&&(
            <div className="ai-msg bot">
              <div className="ai-avatar bot">🤖</div>
              <div className="ai-bubble bot">
                <div className="ai-typing">
                  <div className="ai-dot"/><div className="ai-dot"/><div className="ai-dot"/>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef}/>
        </div>

        {/* Input */}
        <div className="ai-input-row">
          <textarea
            className="ai-input"
            placeholder="Ask about your spending, savings, budget tips…"
            value={aiInput}
            rows={1}
            onChange={e=>setAiInput(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendAiMessage();}}}
          />
          <button className="ai-send" disabled={!aiInput.trim()||aiLoading} onClick={sendAiMessage}>
            {aiLoading?<RefreshCw size={16} style={{animation:"spin 1s linear infinite"}}/>:<Send size={16}/>}
          </button>
        </div>
        <div style={{fontSize:10,color:"var(--mu)",textAlign:"center",marginTop:-4}}>
          Powered by Claude AI · Press Enter to send · Shift+Enter for new line
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return(
    <div className="app">
      <style>{getCSS(darkMode)}</style>

      {/* ── SIDEBAR ── */}
      <aside className={`sb${mini?" min":""}`}>
        <div className="sb-logo">
          <div className="sb-icon">💰</div>
          {!mini&&<div className="sb-name">Fin<em>Track</em></div>}
        </div>
        <nav className="sb-nav">
          {navItems.map(n=>(
            <button key={n.id} className={`sn${tab===n.id?" on":""}`} onClick={()=>setTab(n.id)} title={mini?n.label:""}>
              {n.icon}
              {!mini&&<span style={{flex:1}}>{n.label}</span>}
              {!mini&&n.id==="budget"&&notifications.length>0&&(
                <span style={{background:"var(--danger)",color:"#fff",fontSize:9,fontWeight:700,width:16,height:16,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 6px rgba(248,113,113,.4)"}}>{notifications.length}</span>
              )}
              {!mini&&n.id===tab&&<ChevronRight size={10} style={{opacity:.4}}/>}
            </button>
          ))}
        </nav>
        <div className="sb-btm">
          {!mini&&(
            <div className="hs-mini">
              <svg width={32} height={32} viewBox="0 0 32 32">
                <circle cx={16} cy={16} r={12} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={3}/>
                <circle cx={16} cy={16} r={12} fill="none"
                  stroke={health.total>=75?"#4ade80":health.total>=50?"#fbbf24":"#f87171"}
                  strokeWidth={3}
                  strokeDasharray={`${(health.total/100)*75.4} 75.4`}
                  strokeLinecap="round"
                  transform="rotate(-90,16,16)"
                  style={{transition:"stroke-dasharray 1s ease"}}/>
              </svg>
              <div style={{overflow:"hidden"}}>
                <div style={{fontSize:9,color:"var(--mu)",letterSpacing:".5px",textTransform:"uppercase",marginBottom:2}}>Health Score</div>
                <div style={{fontFamily:"var(--fm)",fontSize:14,fontWeight:700,color:health.total>=75?"#4ade80":health.total>=50?"#fbbf24":"#f87171"}}>{health.total}<span style={{fontSize:10,color:"var(--mu)"}}>/100</span></div>
              </div>
            </div>
          )}
          <button className="sb-mini" onClick={()=>setMini(m=>!m)} title={mini?"Expand":"Collapse"}>
            {mini?<ChevronRight size={14}/>:<ChevronLeft size={14}/>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="ma">
        <header className="hdr">
          <div className="hdr-l">
            <div className="ht">{tabMeta[tab]}</div>
            <div className="hs">{tabSub[tab]}</div>
          </div>
          <div className="hdr-r">
            {/* Bell */}
            <div className="rel" ref={nRef}>
              <button className={`bell${notifications.length>0?" has":""}`} onClick={()=>setShowN(s=>!s)}>
                <Bell size={14}/>
                {notifications.length>0&&<div className="nbadge">{notifications.length}</div>}
              </button>
              {showN&&(
                <div className="ndrop">
                  <div className="nd-hd">{notifications.length===0?"All Clear":"Alerts · "+notifications.length}</div>
                  {notifications.length===0?(
                    <div className="nd-empty">
                      <div className="nd-ei"><CheckCircle size={20}/></div>
                      <div style={{fontSize:13,fontWeight:600,marginBottom:4}}>You're all clear!</div>
                      <div style={{fontSize:11,color:"var(--su)"}}>All budgets are on track.</div>
                    </div>
                  ):(
                    <>
                      <div style={{maxHeight:280,overflowY:"auto"}}>
                        {notifications.map(n=>(
                          <div key={n.key} className="ni">
                            <div className="ni-ic" style={{background:n.type==="danger"?"rgba(248,113,113,.1)":"rgba(251,191,36,.1)",color:n.type==="danger"?"var(--danger)":"var(--warning)"}}>
                              <AlertTriangle size={15}/>
                            </div>
                            <div style={{flex:1}}>
                              <div className="ni-title">{n.cat}</div>
                              <div className="ni-msg">{n.msg}</div>
                              <div className="ni-badge" style={{background:n.type==="danger"?"rgba(248,113,113,.1)":"rgba(251,191,36,.1)",color:n.type==="danger"?"var(--danger)":"var(--warning)"}}>
                                {n.type==="danger"?"High":"Medium"} Priority
                              </div>
                            </div>
                            <button className="ni-dismiss" onClick={e=>{e.stopPropagation();setDismissed(p=>new Set([...p,n.key]));}}><X size={11}/></button>
                          </div>
                        ))}
                      </div>
                      <div className="nd-acts">
                        <button className="nd-act" onClick={()=>setDismissed(p=>new Set([...p,...notifications.map(n=>n.key)]))}>Dismiss All</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Time Toggle */}
            <div className="time-toggle">
              {["weekly","monthly","yearly"].map(v=>(
                <button key={v} className={`time-btn${timeView===v?" active":""}`} onClick={()=>setTimeView(v)}>
                  {v.charAt(0).toUpperCase()+v.slice(1)}
                </button>
              ))}
            </div>

            {/* Export CSV */}
            <button className="hb" onClick={xport}><Download size={12}/>Export</button>

            {/* Dark mode */}
            <button className="hb" onClick={()=>setDarkMode(!darkMode)}>
              {darkMode?<Sun size={12}/>:<Moon size={12}/>}
              {darkMode?"Light":"Dark"}
            </button>

            {/* Reports */}
            <div className="rel" ref={rRef}>
              <button className="hb" onClick={()=>setReportMenu(!reportMenu)}>
                <FileText size={12}/>Reports<ChevronDown size={10}/>
              </button>
              {reportMenu&&(
                <div className="rdrop">
                  <div className="rd-hd">Generate Report</div>
                  {[["week","📅 Weekly"],["month","📊 Monthly"],["quarter","📈 Quarterly"],["year","📋 Annual"]].map(([p,l])=>(
                    <div key={p} className="rd-opt" onClick={()=>generateReport(p)}>{l}</div>
                  ))}
                  <div className="rd-hd">Export Data</div>
                  <div className="rd-opt" onClick={xport}>📄 Export CSV</div>
                </div>
              )}
            </div>

            {/* Role */}
            <button className={`rp ${role}`} onClick={()=>setRole(r=>r==="admin"?"viewer":"admin")}>
              {role==="admin"?<Shield size={11}/>:<Eye size={11}/>}
              {role==="admin"?"Admin":"Viewer"}
              <ChevronDown size={9}/>
            </button>
          </div>
        </header>

        {role==="viewer"&&(
          <div className="vb"><Eye size={12}/>Read-only mode — switch to Admin to manage transactions</div>
        )}

        <div className="cnt">
          {tab==="overview"    &&vOverview()}
          {tab==="wallet"      &&vWallet()}
          {tab==="transactions"&&vTransactions()}
          {tab==="budget"      &&vBudget()}
          {tab==="insights"    &&vInsights()}
          {tab==="goals"       &&vGoals()}
          {tab==="advisor"     &&vAdvisor()}
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal&&(
        <div className="mbk" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="mdl">
            <div className="m-tt">
              {editing?"Edit Transaction":"New Transaction"}
              <button style={{background:"none",border:"none",color:"var(--su)",cursor:"pointer",display:"flex",padding:0}} onClick={()=>setModal(false)}><X size={14}/></button>
            </div>
            <div className="m-fd"><label className="m-lb">Date</label><input className="m-ip" type="date" value={form.date} onChange={e=>fv("date")(e.target.value)}/></div>
            <div className="m-fd"><label className="m-lb">Description</label><input className="m-ip" placeholder="e.g. Monthly Salary" value={form.description} onChange={e=>fv("description")(e.target.value)}/></div>
            <div className="m-fd">
              <label className="m-lb">Type</label>
              <div className="tto">
                <button className={`ttb${form.type==="expense"?" oe":""}`} onClick={()=>fv("type")("expense")}>↓ Expense</button>
                <button className={`ttb${form.type==="income"?" oi":""}`}  onClick={()=>fv("type")("income")}>↑ Income</button>
              </div>
            </div>
            <div className="m-fd"><label className="m-lb">Category</label><select className="m-ip" value={form.category} onChange={e=>fv("category")(e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="m-fd"><label className="m-lb">Amount (₹)</label><input className="m-ip" type="number" placeholder="0" min="0" value={form.amount} onChange={e=>fv("amount")(e.target.value)}/></div>
            <div className="m-fd">
              <label className="m-ck" onClick={()=>fv("recurring")(!form.recurring)}>
                <input type="checkbox" checked={form.recurring} readOnly onClick={e=>e.stopPropagation()}/>
                Mark as recurring transaction
              </label>
            </div>
            <div className="m-ac">
              <button className="m-cn" onClick={()=>setModal(false)}>Cancel</button>
              <button className="m-sb" onClick={save}>{editing?"Save Changes":"Add Transaction"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}