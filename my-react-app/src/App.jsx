import { useState, useMemo, useEffect, useRef } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, LineChart, Line
} from "recharts";
import {
  LayoutDashboard, Wallet, List, Target, Lightbulb,
  Bell, Shield, Eye, Plus, Edit2, Trash2, Download, FileText,
  Search, X, ArrowUpRight, ArrowDownRight,
  AlertTriangle, CheckCircle, ChevronRight,
  ChevronLeft, ChevronDown, Minus, Sun, Moon
} from "lucide-react";

/* ─── Config ──────────────────────────────────────────────────────────────── */
const CAT = {
  Income:        { clr:"#22C55E", bg:"rgba(34,197,94,.12)",   icon:"💼" },
  Housing:       { clr:"#60A5FA", bg:"rgba(96,165,250,.12)",  icon:"🏠" },
  Food:          { clr:"#FB923C", bg:"rgba(251,146,60,.12)",   icon:"🍔" },
  Transport:     { clr:"#A78BFA", bg:"rgba(167,139,250,.12)", icon:"🚗" },
  Entertainment: { clr:"#F472B6", bg:"rgba(244,114,182,.12)", icon:"🎬" },
  Health:        { clr:"#2DD4BF", bg:"rgba(45,212,191,.12)",  icon:"💊" },
  Utilities:     { clr:"#FACC15", bg:"rgba(250,204,21,.12)",   icon:"⚡" },
  Shopping:      { clr:"#F87171", bg:"rgba(248,113,113,.12)",  icon:"🛒" },
};
const CATS = Object.keys(CAT);
const MONTHS = [{l:"Jan",n:1},{l:"Feb",n:2},{l:"Mar",n:3},{l:"Apr",n:4},{l:"May",n:5},{l:"Jun",n:6}];
const DEFAULT_BUDGETS = { Housing:18000,Food:6000,Transport:3000,Entertainment:2000,Health:3000,Utilities:2000,Shopping:8000 };

/* ─── Seed Data ───────────────────────────────────────────────────────────── */
const SEED = [
  {id:1, date:"2026-01-03",description:"Monthly Salary",       category:"Income",        type:"income",  amount:95000,recurring:true},
  {id:2, date:"2026-01-05",description:"Apartment Rent",       category:"Housing",       type:"expense", amount:18000,recurring:true},
  {id:3, date:"2026-01-07",description:"Swiggy Orders",        category:"Food",          type:"expense", amount:1850, recurring:false},
  {id:4, date:"2026-01-09",description:"Metro Card Recharge",  category:"Transport",     type:"expense", amount:500,  recurring:false},
  {id:5, date:"2026-01-12",description:"Netflix Subscription", category:"Entertainment", type:"expense", amount:649,  recurring:true},
  {id:6, date:"2026-01-15",description:"Freelance Project",    category:"Income",        type:"income",  amount:24000,recurring:false},
  {id:7, date:"2026-01-18",description:"Gym Membership",       category:"Health",        type:"expense", amount:2500, recurring:true},
  {id:8, date:"2026-01-20",description:"Electricity Bill",     category:"Utilities",     type:"expense", amount:1200, recurring:true},
  {id:9, date:"2026-01-22",description:"Amazon Shopping",      category:"Shopping",      type:"expense", amount:3400, recurring:false},
  {id:10,date:"2026-01-25",description:"Dinner with Friends",  category:"Food",          type:"expense", amount:2100, recurring:false},
  {id:11,date:"2026-01-28",description:"Dividend Income",      category:"Income",        type:"income",  amount:6500, recurring:false},
  {id:12,date:"2026-02-01",description:"Monthly Salary",       category:"Income",        type:"income",  amount:95000,recurring:true},
  {id:13,date:"2026-02-03",description:"Apartment Rent",       category:"Housing",       type:"expense", amount:18000,recurring:true},
  {id:14,date:"2026-02-06",description:"Grocery Shopping",     category:"Food",          type:"expense", amount:3200, recurring:false},
  {id:15,date:"2026-02-08",description:"Uber Rides",           category:"Transport",     type:"expense", amount:1100, recurring:false},
  {id:16,date:"2026-02-10",description:"Movie Tickets",        category:"Entertainment", type:"expense", amount:800,  recurring:false},
  {id:17,date:"2026-02-14",description:"Valentine's Dinner",   category:"Food",          type:"expense", amount:4500, recurring:false},
  {id:18,date:"2026-02-16",description:"Consulting Fees",      category:"Income",        type:"income",  amount:15000,recurring:false},
  {id:19,date:"2026-02-19",description:"Phone Bill",           category:"Utilities",     type:"expense", amount:699,  recurring:true},
  {id:20,date:"2026-02-22",description:"Medical Checkup",      category:"Health",        type:"expense", amount:1800, recurring:false},
  {id:21,date:"2026-02-25",description:"Myntra Clothing",      category:"Shopping",      type:"expense", amount:5600, recurring:false},
  {id:22,date:"2026-02-27",description:"Interest Income",      category:"Income",        type:"income",  amount:3200, recurring:true},
  {id:23,date:"2026-03-01",description:"Monthly Salary",       category:"Income",        type:"income",  amount:95000,recurring:true},
  {id:24,date:"2026-03-04",description:"Apartment Rent",       category:"Housing",       type:"expense", amount:18000,recurring:true},
  {id:25,date:"2026-03-06",description:"Zomato Orders",        category:"Food",          type:"expense", amount:2800, recurring:false},
  {id:26,date:"2026-03-10",description:"Flight Tickets",       category:"Transport",     type:"expense", amount:12000,recurring:false},
  {id:27,date:"2026-03-12",description:"Spotify Premium",      category:"Entertainment", type:"expense", amount:119,  recurring:true},
  {id:28,date:"2026-03-15",description:"Freelance Design",     category:"Income",        type:"income",  amount:32000,recurring:false},
  {id:29,date:"2026-03-18",description:"Water Bill",           category:"Utilities",     type:"expense", amount:450,  recurring:true},
  {id:30,date:"2026-03-20",description:"Pharmacy",             category:"Health",        type:"expense", amount:950,  recurring:false},
  {id:31,date:"2026-03-24",description:"Apple Store",          category:"Shopping",      type:"expense", amount:8900, recurring:false},
  {id:32,date:"2026-03-28",description:"Bonus Payment",        category:"Income",        type:"income",  amount:20000,recurring:false},
  {id:33,date:"2026-04-01",description:"Monthly Salary",       category:"Income",        type:"income",  amount:95000,recurring:true},
  {id:34,date:"2026-04-03",description:"Apartment Rent",       category:"Housing",       type:"expense", amount:18000,recurring:true},
  {id:35,date:"2026-04-06",description:"Restaurant Meals",      category:"Food",          type:"expense", amount:3200, recurring:false},
  {id:36,date:"2026-04-09",description:"Auto Fuel",            category:"Transport",     type:"expense", amount:2500, recurring:false},
  {id:37,date:"2026-04-12",description:"Amazon Prime",         category:"Entertainment", type:"expense", amount:149,  recurring:true},
  {id:38,date:"2026-04-15",description:"Freelance Writing",    category:"Income",        type:"income",  amount:18000,recurring:false},
  {id:39,date:"2026-04-18",description:"Internet Bill",        category:"Utilities",     type:"expense", amount:799,  recurring:true},
  {id:40,date:"2026-04-21",description:"Yoga Classes",         category:"Health",        type:"expense", amount:1500, recurring:false},
  {id:41,date:"2026-04-24",description:"Fashion Shopping",      category:"Shopping",      type:"expense", amount:4200, recurring:false},
  {id:42,date:"2026-04-27",description:"Stock Dividend",        category:"Income",        type:"income",  amount:4500, recurring:false},
  {id:43,date:"2026-05-01",description:"Monthly Salary",       category:"Income",        type:"income",  amount:95000,recurring:true},
  {id:44,date:"2026-05-03",description:"Apartment Rent",       category:"Housing",       type:"expense", amount:18000,recurring:true},
  {id:45,date:"2026-05-06",description:"Food Delivery",        category:"Food",          type:"expense", amount:2100, recurring:false},
  {id:46,date:"2026-05-09",description:"Bus Pass",             category:"Transport",     type:"expense", amount:800,  recurring:true},
  {id:47,date:"2026-05-12",description:"Netflix",              category:"Entertainment", type:"expense", amount:649,  recurring:true},
  {id:48,date:"2026-05-15",description:"Side Project",         category:"Income",        type:"income",  amount:12000,recurring:false},
  {id:49,date:"2026-05-18",description:"Gas Bill",             category:"Utilities",     type:"expense", amount:950,  recurring:true},
  {id:50,date:"2026-05-21",description:"Gym Fees",             category:"Health",        type:"expense", amount:2000, recurring:false},
  {id:51,date:"2026-05-24",description:"Online Shopping",      category:"Shopping",      type:"expense", amount:3800, recurring:false},
  {id:52,date:"2026-05-27",description:"Rental Income",        category:"Income",        type:"income",  amount:8000, recurring:false},
  {id:53,date:"2026-06-01",description:"Monthly Salary",       category:"Income",        type:"income",  amount:95000,recurring:true},
  {id:54,date:"2026-06-03",description:"Apartment Rent",       category:"Housing",       type:"expense", amount:18000,recurring:true},
  {id:55,date:"2026-06-06",description:"Groceries",            category:"Food",          type:"expense", amount:4500, recurring:false},
  {id:56,date:"2026-06-09",description:"Taxi Rides",           category:"Transport",     type:"expense", amount:1800, recurring:false},
  {id:57,date:"2026-06-12",description:"Concert Tickets",       category:"Entertainment", type:"expense", amount:2500, recurring:false},
  {id:58,date:"2026-06-15",description:"Consulting",            category:"Income",        type:"income",  amount:25000,recurring:false},
  {id:59,date:"2026-06-18",description:"Water Bill",           category:"Utilities",     type:"expense", amount:600,  recurring:true},
  {id:60,date:"2026-06-21",description:"Doctor Visit",         category:"Health",        type:"expense", amount:1200, recurring:false},
  {id:61,date:"2026-06-24",description:"Clothing Store",       category:"Shopping",      type:"expense", amount:5500, recurring:false},
  {id:62,date:"2026-06-27",description:"Investment Returns",   category:"Income",        type:"income",  amount:6500, recurring:false},
  {id:63,date:"2026-07-01",description:"Monthly Salary",       category:"Income",        type:"income",  amount:95000,recurring:true},
  {id:64,date:"2026-07-03",description:"Apartment Rent",       category:"Housing",       type:"expense", amount:18000,recurring:true},
  {id:65,date:"2026-07-06",description:"Restaurant",           category:"Food",          type:"expense", amount:2800, recurring:false},
  {id:66,date:"2026-07-09",description:"Metro Pass",           category:"Transport",     type:"expense", amount:1200, recurring:true},
  {id:67,date:"2026-07-12",description:"Streaming Services",   category:"Entertainment", type:"expense", amount:399,  recurring:true},
  {id:68,date:"2026-07-15",description:"Design Work",          category:"Income",        type:"income",  amount:22000,recurring:false},
  {id:69,date:"2026-07-18",description:"Electricity",          category:"Utilities",     type:"expense", amount:1500, recurring:true},
  {id:70,date:"2026-07-21",description:"Fitness Club",         category:"Health",        type:"expense", amount:1800, recurring:false},
  {id:71,date:"2026-07-24",description:"Electronics",          category:"Shopping",      type:"expense", amount:7200, recurring:false},
  {id:72,date:"2026-07-27",description:"Freelance Project",    category:"Income",        type:"income",  amount:15000,recurring:false},
  {id:73,date:"2026-08-01",description:"Monthly Salary",       category:"Income",        type:"income",  amount:95000,recurring:true},
  {id:74,date:"2026-08-03",description:"Apartment Rent",       category:"Housing",       type:"expense", amount:18000,recurring:true},
  {id:75,date:"2026-08-06",description:"Food Orders",          category:"Food",          type:"expense", amount:3500, recurring:false},
  {id:76,date:"2026-08-09",description:"Car Maintenance",       category:"Transport",     type:"expense", amount:3200, recurring:false},
  {id:77,date:"2026-08-12",description:"Movie Streaming",       category:"Entertainment", type:"expense", amount:499,  recurring:true},
  {id:78,date:"2026-08-15",description:"Web Development",      category:"Income",        type:"income",  amount:28000,recurring:false},
  {id:79,date:"2026-08-18",description:"Phone Bill",           category:"Utilities",     type:"expense", amount:899,  recurring:true},
  {id:80,date:"2026-08-21",description:"Health Insurance",      category:"Health",        type:"expense", amount:2500, recurring:true},
  {id:81,date:"2026-08-24",description:"Home Decor",           category:"Shopping",      type:"expense", amount:4500, recurring:false},
  {id:82,date:"2026-08-27",description:"Dividend Income",      category:"Income",        type:"income",  amount:3500, recurring:false},
  {id:83,date:"2026-09-01",description:"Monthly Salary",       category:"Income",        type:"income",  amount:95000,recurring:true},
  {id:84,date:"2026-09-03",description:"Apartment Rent",       category:"Housing",       type:"expense", amount:18000,recurring:true},
  {id:85,date:"2026-09-06",description:"Dining Out",           category:"Food",          type:"expense", amount:2200, recurring:false},
  {id:86,date:"2026-09-09",description:"Public Transport",     category:"Transport",     type:"expense", amount:1500, recurring:false},
  {id:87,date:"2026-09-12",description:"Gaming Subscription",   category:"Entertainment", type:"expense", amount:299,  recurring:true},
  {id:88,date:"2026-09-15",description:"Marketing Work",       category:"Income",        type:"income",  amount:18000,recurring:false},
  {id:89,date:"2026-09-18",description:"Cable TV",             category:"Utilities",     type:"expense", amount:599,  recurring:true},
  {id:90,date:"2026-09-21",description:"Dental Checkup",        category:"Health",        type:"expense", amount:800,  recurring:false},
  {id:91,date:"2026-09-24",description:"Fashion Items",         category:"Shopping",      type:"expense", amount:3200, recurring:false},
  {id:92,date:"2026-09-27",description:"Rental Income",        category:"Income",        type:"income",  amount:6000, recurring:false},
  {id:93,date:"2026-10-01",description:"Monthly Salary",       category:"Income",        type:"income",  amount:95000,recurring:true},
  {id:94,date:"2026-10-03",description:"Apartment Rent",       category:"Housing",       type:"expense", amount:18000,recurring:true},
  {id:95,date:"2026-10-06",description:"Coffee Shops",         category:"Food",          type:"expense", amount:1800, recurring:false},
  {id:96,date:"2026-10-09",description:"Bike Rental",          category:"Transport",     type:"expense", amount:900,  recurring:false},
  {id:97,date:"2026-10-12",description:"Music Streaming",       category:"Entertainment", type:"expense", amount:199,  recurring:true},
  {id:98,date:"2026-10-15",description:"Content Creation",     category:"Income",        type:"income",  amount:20000,recurring:false},
  {id:99,date:"2026-10-18",description:"Heating Bill",         category:"Utilities",     type:"expense", amount:1200, recurring:true},
  {id:100,date:"2026-10-21",description:"Pharmacy",             category:"Health",        type:"expense", amount:650,  recurring:false},
  {id:101,date:"2026-10-24",description:"Winter Clothes",        category:"Shopping",      type:"expense", amount:4800, recurring:false},
  {id:102,date:"2026-10-27",description:"Bonus Income",         category:"Income",        type:"income",  amount:8000, recurring:false},
  {id:103,date:"2026-11-01",description:"Monthly Salary",       category:"Income",        type:"income",  amount:95000,recurring:true},
  {id:104,date:"2026-11-03",description:"Apartment Rent",       category:"Housing",       type:"expense", amount:18000,recurring:true},
  {id:105,date:"2026-11-06",description:"Fast Food",            category:"Food",          type:"expense", amount:2500, recurring:false},
  {id:106,date:"2026-11-09",description:"Train Tickets",         category:"Transport",     type:"expense", amount:2200, recurring:false},
  {id:107,date:"2026-11-12",description:"Video Games",          category:"Entertainment", type:"expense", amount:399,  recurring:false},
  {id:108,date:"2026-11-15",description:"Photography Work",     category:"Income",        type:"income",  amount:16000,recurring:false},
  {id:109,date:"2026-11-18",description:"Internet Bill",        category:"Utilities",     type:"expense", amount:799,  recurring:true},
  {id:110,date:"2026-11-21",description:"Eye Checkup",          category:"Health",        type:"expense", amount:900,  recurring:false},
  {id:111,date:"2026-11-24",description:"Black Friday",         category:"Shopping",      type:"expense", amount:8500, recurring:false},
  {id:112,date:"2026-11-27",description:"Consulting Fee",       category:"Income",        type:"income",  amount:12000,recurring:false},
  {id:113,date:"2026-12-01",description:"Monthly Salary",       category:"Income",        type:"income",  amount:95000,recurring:true},
  {id:114,date:"2026-12-03",description:"Apartment Rent",       category:"Housing",       type:"expense", amount:18000,recurring:true},
  {id:115,date:"2026-12-06",description:"Holiday Meals",         category:"Food",          type:"expense", amount:4200, recurring:false},
  {id:116,date:"2026-12-09",description:"Airport Transfer",     category:"Transport",     type:"expense", amount:3500, recurring:false},
  {id:117,date:"2026-12-12",description:"Christmas Gifts",       category:"Entertainment", type:"expense", amount:3500, recurring:false},
  {id:118,date:"2026-12-15",description:"Year-end Bonus",        category:"Income",        type:"income",  amount:30000,recurring:false},
  {id:119,date:"2026-12-18",description:"Winter Utilities",      category:"Utilities",     type:"expense", amount:2000, recurring:true},
  {id:120,date:"2026-12-21",description:"Health Checkup",        category:"Health",        type:"expense", amount:1500, recurring:false},
  {id:121,date:"2026-12-24",description:"Christmas Shopping",    category:"Shopping",      type:"expense", amount:12000,recurring:false},
  {id:122,date:"2026-12-27",description:"Year-end Dividend",     category:"Income",        type:"income",  amount:10000,recurring:false},
];

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmt  = n => `₹${Math.round(n).toLocaleString("en-IN")}`;
const fmtK = n => n>=100000?`₹${(n/100000).toFixed(1)}L`:n>=1000?`₹${(n/1000).toFixed(0)}K`:`₹${n}`;
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

/* ─── Sparkline ──────────────────────────────────────────────────────────── */
function Spark({data,color,width=80,height=30}){
  if(!data||data.length<2)return null;
  const mn=Math.min(...data),mx=Math.max(...data),rng=mx-mn||1;
  const pts=data.map((v,i)=>[i*(width/(data.length-1)),height-(((v-mn)/rng)*(height-6)+3)]);
  const d="M"+pts.map(p=>p.join(",")).join(" L");
  const area=d+` L${pts.at(-1)[0]},${height} L${pts[0][0]},${height} Z`;
  const gid=`sg${color.slice(1)}`;
  return(
    <svg width={width} height={height} style={{overflow:"visible",flexShrink:0}}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.25}/><stop offset="100%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
      <path d={area} fill={`url(#${gid})`}/>
      <path d={d} stroke={color} strokeWidth={1.8} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={pts.at(-1)[0]} cy={pts.at(-1)[1]} r={3.5} fill={color} stroke="#060B18" strokeWidth={1.5}/>
    </svg>
  );
}

/* ─── Health Gauge ───────────────────────────────────────────────────────── */
function HealthGauge({score}){
  const r=44,circ=2*Math.PI*r;
  const clr=score>=75?"#22c55e":score>=50?"#f59e0b":"#ef4444";
  const lbl=score>=75?"Excellent":score>=60?"Good":score>=40?"Fair":"Poor";
  return(
    <svg width={120} height={120} viewBox="0 0 120 120">
      <circle cx={60} cy={60} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={11} strokeDasharray={`${circ*.75} ${circ*.25}`} strokeDashoffset={circ*.125} strokeLinecap="round" transform="rotate(135,60,60)"/>
      <circle cx={60} cy={60} r={r} fill="none" stroke={clr} strokeWidth={11} strokeDasharray={`${(score/100)*circ*.75} ${circ}`} strokeDashoffset={circ*.125} strokeLinecap="round" transform="rotate(135,60,60)" style={{transition:"stroke-dasharray 1.2s ease"}}/>
      <text x={60} y={56} textAnchor="middle" fill="white" fontSize={22} fontWeight={700} fontFamily="'JetBrains Mono',monospace">{score}</text>
      <text x={60} y={72} textAnchor="middle" fill={clr} fontSize={9.5} fontWeight={700} fontFamily="'DM Sans',sans-serif" letterSpacing={1}>{lbl.toUpperCase()}</text>
    </svg>
  );
}

/* ─── Tooltip ────────────────────────────────────────────────────────────── */
function Tip({active,payload,label}){
  if(!active||!payload?.length)return null;
  return(
    <div style={{background:"rgba(8,16,36,.97)",border:"1px solid rgba(255,255,255,.1)",borderRadius:10,padding:"10px 14px"}}>
      <div style={{fontSize:10,color:"#8BA0B8",marginBottom:5,textTransform:"uppercase",letterSpacing:".8px"}}>{label}</div>
      {payload.map((p,i)=><div key={i} style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:600,color:p.color||"#E2EBF0",marginTop:2}}>{p.name}: {fmt(p.value)}</div>)}
    </div>
  );
}

/* ─── CSS ────────────────────────────────────────────────────────────────── */
const getCSS = (isDark) => `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* Smooth theme transitions */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

:root{
  --bg:${isDark?"#020617":"#f8fafc"};
  --surf:${isDark?"#030712":"#ffffff"};
  --card:${isDark?"#0f172a":"#ffffff"};
  --card2:${isDark?"#1e293b":"#f1f5f9"};
  --hov:${isDark?"#1e293b":"#f8fafc"};
  --b0:${isDark?"rgba(255,255,255,.08)":"rgba(0,0,0,.06)"};
  --b1:${isDark?"rgba(255,255,255,.15)":"rgba(0,0,0,.09)"};
  --b2:${isDark?"rgba(255,255,255,.25)":"rgba(0,0,0,.13)"};
  
  /* Modern Color System */
  --primary:#3b82f6;
  --success:#22c55e;
  --danger:#ef4444;
  --warning:#f59e0b;
  --accent:#8b5cf6;
  
  --tx:${isDark?"#f1f5f9":"#1e293b"};
  --su:${isDark?"#94a3b8":"#64748b"};
  --mu:${isDark?"#64748b":"#94a3b8"};
  --fn:'DM Sans',sans-serif;--fm:'JetBrains Mono',monospace;
  --r:12px;--r2:16px;--r3:20px;
}
html,body{background:linear-gradient(135deg,var(--bg) 0%,var(--surf) 100%);font-family:var(--fn);color:var(--tx);overflow-x:hidden;min-height:100vh}
.app{display:flex;min-height:100vh}

/* ── SIDEBAR ── */
.sb{width:250px;flex-shrink:0;background:var(--surf);border-right:1px solid var(--b1);display:flex;flex-direction:column;padding:0;position:sticky;top:0;height:100vh}
.sb.min{width:68px}
.sb-logo{display:flex;align-items:center;gap:12px;padding:20px 20px 20px;border-bottom:1px solid var(--b1)}
.sb-icon{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--primary),#2563eb);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.sb-name{font-size:18px;font-weight:700;letter-spacing:-.4px;white-space:nowrap;overflow:hidden}
.sb-name em{color:var(--primary);font-style:normal}
.sb-nav{flex:1;padding:16px 16px;overflow-y:auto}
.sn{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:12px;cursor:pointer;border:none;background:none;color:var(--su);font-family:var(--fn);font-size:14px;font-weight:500;width:100%;text-align:left;white-space:nowrap;margin-bottom:4px;transition:all .2s ease}
.sn:hover{background:var(--hov);color:var(--tx);transform:translateX(2px)}
.sn.on{background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(59,130,246,0.05));color:var(--primary);font-weight:600;box-shadow:0 2px 8px rgba(59,130,246,0.1)}
.sni{flex-shrink:0;width:15px;height:15px}
.sb-btm{padding:12px 10px;border-top:1px solid var(--b1)}
.hs-mini{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;background:var(--b0);cursor:default;overflow:hidden;margin-bottom:8px}
.sb-mini{display:flex;align-items:center;justify-content:center;padding:7px;background:none;border:none;color:var(--mu);cursor:pointer;width:100%;border-radius:7px;transition:all .15s}
.sb-mini:hover{background:var(--hov);color:var(--tx)}

/* ── MAIN ── */
.ma{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden}

/* ── HEADER ── */
.hdr{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:var(--surf);border-bottom:1px solid var(--b1);gap:16px;flex-shrink:0;position:sticky;top:0;z-index:100}
.hdr-l .ht{font-size:20px;font-weight:700;letter-spacing:-.3px}
.hdr-l .hs{font-size:12px;color:var(--su);margin-top:2px}
.hdr-r{display:flex;align-items:center;gap:12px}
.bell{position:relative;width:40px;height:40px;border-radius:12px;background:var(--b0);border:1px solid var(--b1);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s ease;color:var(--su);box-shadow:0 2px 4px rgba(0,0,0,0.05)}
.bell:hover{border-color:var(--b2);color:var(--tx);transform:translateY(-1px);box-shadow:0 4px 8px rgba(0,0,0,0.1)}
.bell.has{color:var(--warning)}
.nbadge{position:absolute;top:-4px;right:-4px;width:18px;height:18px;border-radius:50%;background:var(--danger);font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--fm);box-shadow:0 2px 4px rgba(239,68,68,0.3)}
.hb{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:12px;border:1px solid var(--b1);background:var(--b0);color:var(--su);font-size:12px;font-family:var(--fn);font-weight:600;cursor:pointer;transition:all .2s ease;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.05)}
.hb:hover{border-color:var(--b2);color:var(--tx);transform:translateY(-1px);box-shadow:0 4px 8px rgba(0,0,0,0.1)}

/* Time view toggle buttons */
.time-toggle{display:flex;gap:6px;padding:4px;background:var(--b0);border-radius:10px;border:1px solid var(--b1);box-shadow:0 2px 4px rgba(0,0,0,0.02)}
.time-btn{padding:8px 14px;border-radius:8px;border:none;background:none;color:var(--su);font-size:11px;font-weight:500;cursor:pointer;transition:all .2s ease;white-space:nowrap}
.time-btn.active{background:var(--card);color:var(--tx);box-shadow:0 2px 6px rgba(0,0,0,0.08);font-weight:600}
.time-btn:hover:not(.active){color:var(--tx);background:var(--hov)}
.ni-tx{font-size:11.5px;color:var(--su);line-height:1.5}
.ni-tx strong{color:var(--tx);display:block;margin-bottom:1px;font-size:12px}

/* Notification Dropdown */
.ndrop{position:absolute;top:calc(100% + 8px);right:0;width:320px;background:var(--card);border:1px solid var(--b1);border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.55);z-index:99999;max-height:400px}
.nd-hd{padding:12px 16px;font-size:11px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--su);border-bottom:1px solid var(--b1);background:var(--card2)}

/* Modern Notification Cards */
.ni{display:flex;align-items:flex-start;gap:12px;padding:16px;border-bottom:1px solid var(--b0);transition:all .2s ease;cursor:pointer;position:relative}
.ni:hover{background:var(--hov)}
.ni:last-child{border-bottom:none}
.ni-ic{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ni-content{flex:1;min-width:0}
.ni-title{font-size:12px;font-weight:600;color:var(--tx);margin-bottom:2px;line-height:1.3}
.ni-message{font-size:11px;color:var(--su);line-height:1.4}
.ni-severity{display:inline-flex;align-items:center;padding:2px 8px;border-radius:12px;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-top:6px}
.ni-severity.high{background:rgba(239,68,68,0.1);color:#ef4444}
.ni-severity.medium{background:rgba(245,158,11,0.1);color:#f59e0b}
.ni-severity.low{background:rgba(34,197,94,0.1);color:#22c55e}
.ni-dismiss{position:absolute;top:8px;right:8px;width:20px;height:20px;border-radius:6px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.1);color:var(--su);cursor:pointer;opacity:0;transition:all .2s ease}
.ni:hover .ni-dismiss{opacity:1}
.ni-dismiss:hover{background:rgba(255,255,255,0.2);color:var(--tx)}

/* Notification Actions */
.nd-actions{padding:8px 16px;border-top:1px solid var(--b1);display:flex;gap:8px}
.nd-action{flex:1;padding:6px 12px;border-radius:8px;border:1px solid var(--b1);background:var(--b0);color:var(--su);font-size:10px;font-weight:500;cursor:pointer;transition:all .2s ease;text-align:center}
.nd-action:hover{border-color:var(--b2);color:var(--tx);background:var(--hov)}

/* Empty State */
.nd-empty{padding:40px 20px;text-align:center}
.nd-empty-icon{width:48px;height:48px;border-radius:12px;background:rgba(34,197,94,0.1);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;color:#22c55e}
.nd-empty-title{font-size:13px;font-weight:600;color:var(--tx);margin-bottom:4px}
.nd-empty-message{font-size:11px;color:var(--su);line-height:1.4}
.rp{display:flex;align-items:center;gap:5px;padding:7px 13px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.5px;cursor:pointer;transition:all .16s;border:1px solid;font-family:var(--fn)}
.rp.admin{background:rgba(245,166,35,.1);color:var(--gold);border-color:rgba(245,166,35,.25)}
.rp.viewer{background:rgba(96,165,250,.1);color:var(--bl);border-color:rgba(96,165,250,.2)}
.rp:hover{filter:brightness(1.12);transform:translateY(-1px)}
.hb{display:flex;align-items:center;gap:5px;padding:7px 13px;border-radius:9px;border:1px solid var(--b1);background:var(--b0);color:var(--su);font-size:11px;font-family:var(--fn);font-weight:600;cursor:pointer;transition:all .16s;white-space:nowrap}
.hb:hover{border-color:var(--b2);color:var(--tx)}

/* Responsive Design */
@media (max-width: 1200px) {
  .scs{grid-template-columns:repeat(2,1fr)}
  .g2{grid-template-columns:1fr}
  .g3{grid-template-columns:1fr}
}

@media (max-width: 768px) {
  .cnt{padding:12px}
  .scs{grid-template-columns:1fr;gap:12px}
  .sc{padding:16px}
  .sc-vl{font-size:20px}
  .g2{grid-template-columns:1fr;gap:12px}
  .g3{grid-template-columns:1fr;gap:12px}
  .cc{padding:16px}
  .hdr{padding:12px 16px}
  .hdr-r{gap:8px}
  .time-toggle{gap:4px}
  .time-btn{padding:6px 10px;font-size:10px}
  .hb{padding:8px 12px;font-size:11px}
  .sb{width:200px}
  .sb.min{width:60px}
}

@media (max-width: 480px) {
  .cnt{padding:8px}
  .scs{gap:8px;margin-bottom:16px}
  .sc{padding:12px}
  .sc-vl{font-size:18px}
  .sc-ic{width:32px;height:32px;font-size:16px}
  .g2{gap:8px;margin-bottom:16px}
  .g3{gap:8px;margin-bottom:16px}
  .cc{padding:12px}
  .hdr{padding:8px 12px}
  .hdr-r{gap:6px}
  .time-btn{padding:5px 8px;font-size:9px}
  .hb{padding:6px 10px;font-size:10px}
  .sb{width:60px}
  .sb-nav{padding:8px}
  .sn{padding:8px 12px;font-size:12px}
  .sb-logo{padding:12px}
}
.vb{display:flex;align-items:center;gap:4px;padding:4px 8px;background:rgba(96,165,250,.07);border:none;font-size:10px;color:var(--bl);font-weight:600}

/* report dropdown */
.rdrop{position:absolute;top:calc(100% + 8px);right:0;width:220px;background:var(--card2);border:1px solid var(--b2);border-radius:14px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.55);z-index:300}
.rd-hd{padding:11px 15px;font-size:10px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:var(--su);border-bottom:1px solid var(--b1)}
.rd-opt{display:flex;align-items:center;gap:8px;padding:10px 15px;font-size:11px;color:var(--tx);cursor:pointer;transition:background .15s;border-bottom:1px solid var(--b0)}
.rd-opt:hover{background:var(--hov)}
.rd-opt:last-child{border-bottom:none}
.rd-opt:active{transform:scale(0.98)}

/* ── CONTENT ── */
.cnt{padding:0;overflow-y:auto;flex:1;max-width:100%;width:100%}

/* ── SUMMARY CARDS ── */
.scs{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin:20px;margin-bottom:24px}
.sc{background:var(--card);border:1px solid var(--b1);border-radius:16px;padding:16px;position:relative;overflow:hidden;transition:all .3s ease;box-shadow:0 4px 20px rgba(0,0,0,0.08);min-height:160px}
.sc:hover{transform:translateY(-4px) scale(1.02);box-shadow:0 12px 40px rgba(0,0,0,0.15)}
.sc-ic{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:12px;position:relative;z-index:2;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.2)}
.sc-lb{font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;color:rgba(255,255,255,0.8);margin-bottom:8px}
.sc-vl{font-family:var(--fm);font-size:32px;font-weight:700;letter-spacing:-1px;line-height:1;margin-bottom:8px;color:rgba(255,255,255,0.95);text-shadow:0 2px 4px rgba(0,0,0,0.1)}
.sc-nt{font-size:10px;color:rgba(255,255,255,0.7)}

/* Trend indicators */
.sc-trend{position:absolute;top:16px;right:16px;display:flex;align-items:center;gap:4px;font-size:10px;font-weight:600;padding:4px 8px;border-radius:6px;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px)}
.sc-trend.up{color:#22c55e}
.sc-trend.down{color:#ef4444}
.sc-trend-arrow{font-size:8px}

/* Live indicator */
.sc::before{content:'';position:absolute;top:12px;right:12px;width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 12px #22c55e;animation:pulse 2s infinite;z-index:3}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(1.2)}}

/* Pattern overlay with sparkle effects */
.sc::after{content:'';position:absolute;bottom:-20%;left:-20%;width:140%;height:140%;background:conic-gradient(from 45deg, transparent, rgba(255,255,255,0.15), transparent);opacity:0.8;pointer-events:none;animation:rotate 20s linear infinite}

/* Sparkle particles */
.sc .sparkle{position:absolute;top:-50%;right:-50%;width:200%;height:200%;background:radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.1) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 30%);opacity:1;pointer-events:none;animation:sparkle 3s ease-in-out infinite}

/* Enhanced glow effects */
.sc:hover::before{opacity:1.2}
.sc:hover::after{opacity:1}

/* Animated counter */
.sc-vl{animation:countUp 1.5s ease-out forwards}
@keyframes countUp{
  from{opacity:0;transform:translateY(20px)}
  to{opacity:1;transform:translateY(0)}
}

/* Tooltip */
.sc{position:relative}
.sc-tooltip{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);background:rgba(0,0,0,0.9);color:white;padding:8px 12px;border-radius:6px;font-size:11px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity 0.3s ease;z-index:10}
.sc:hover .sc-tooltip{opacity:1}
@keyframes sparkle{
  0%,100%{opacity:0.8;transform:scale(1)}
  50%{opacity:1;transform:scale(1.1)}
}

.sc::before{animation:sparkle 3s ease-in-out infinite}

/* Fade-in animation */
.sc{animation:fadeInUp 0.6s ease-out forwards;opacity:0}
.sc:nth-child(1){animation-delay:0.1s}
.sc:nth-child(2){animation-delay:0.2s}
.sc:nth-child(3){animation-delay:0.3s}
.sc:nth-child(4){animation-delay:0.4s}

@keyframes fadeInUp{
  from{
    opacity:0;
    transform:translateY(30px);
  }
  to{
    opacity:1;
    transform:translateY(0);
  }
}

@keyframes rotate{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

/* Balance Card - Deep Purple to Electric Blue */
.sc.balance{background:linear-gradient(135deg,#4c1d95 0%,#2563eb 50%,#0891b2 100%);border:1px solid rgba(76,29,149,0.5)}
.sc.balance .sc-ic{background:rgba(255,255,255,0.25);color:#fff}
.sc.balance:hover{box-shadow:0 16px 50px rgba(76,29,149,0.4);border-color:rgba(76,29,149,0.7)}

/* Income Card - Deep Green to Cyan */
.sc.income{background:linear-gradient(135deg,#059669 0%,#0891b2 50%,#06b6d4 100%);border:1px solid rgba(5,150,105,0.5)}
.sc.income .sc-ic{background:rgba(255,255,255,0.25);color:#fff}
.sc.income:hover{box-shadow:0 16px 50px rgba(5,150,105,0.4);border-color:rgba(5,150,105,0.7)}

/* Expense Card - Deep Pink to Crimson */
.sc.expense{background:linear-gradient(135deg,#be185d 0%,#dc2626 50%,#b91c1c 100%);border:1px solid rgba(190,24,93,0.5)}
.sc.expense .sc-ic{background:rgba(255,255,255,0.25);color:#fff}
.sc.expense:hover{box-shadow:0 16px 50px rgba(190,24,93,0.4);border-color:rgba(190,24,93,0.7)}

/* Savings Card - Deep Orange to Gold */
.sc.savings{background:linear-gradient(135deg,#c2410c 0%,#d97706 50%,#ca8a04 100%);border:1px solid rgba(194,65,12,0.5)}
.sc.savings .sc-ic{background:rgba(255,255,255,0.25);color:#fff}
.sc.savings:hover{box-shadow:0 16px 50px rgba(194,65,12,0.4);border-color:rgba(194,65,12,0.7)}

/* Wallet Card Colors */
.sc.daily{background:linear-gradient(135deg,#4338ca 0%,#7c3aed 50%,#9333ea 100%);border:1px solid rgba(67,56,202,0.5)}
.sc.daily .sc-ic{background:rgba(255,255,255,0.25);color:#fff}
.sc.daily:hover{box-shadow:0 16px 50px rgba(67,56,202,0.4);border-color:rgba(67,56,202,0.7)}

.sc.budget{background:linear-gradient(135deg,#b45309 0%,#ea580c 50%,#f59e0b 100%);border:1px solid rgba(180,83,9,0.5)}
.sc.budget .sc-ic{background:rgba(255,255,255,0.25);color:#fff}
.sc.budget:hover{box-shadow:0 16px 50px rgba(180,83,9,0.4);border-color:rgba(180,83,9,0.7)}

.sc.recurring{background:linear-gradient(135deg,#86198f 0%,#a21caf 50%,#c026d3 100%);border:1px solid rgba(134,25,143,0.5)}
.sc.recurring .sc-ic{background:rgba(255,255,255,0.25);color:#fff}
.sc.recurring:hover{box-shadow:0 16px 50px rgba(134,25,143,0.4);border-color:rgba(134,25,143,0.7)}

.sc.health{background:linear-gradient(135deg,#047857 0%,#059669 50%,#10b981 100%);border:1px solid rgba(4,120,87,0.5)}
.sc.health .sc-ic{background:rgba(255,255,255,0.25);color:#fff}
.sc.health:hover{box-shadow:0 16px 50px rgba(4,120,87,0.4);border-color:rgba(4,120,87,0.7)}

/* Danger Card - Deep Red to Magenta */
.sc.danger{background:linear-gradient(135deg,#991b1b 0%,#dc2626 50%,#e11d48 100%);border:1px solid rgba(153,27,27,0.5)}
.sc.danger .sc-ic{background:rgba(255,255,255,0.25);color:#fff}
.sc.danger:hover{box-shadow:0 16px 50px rgba(153,27,27,0.4);border-color:rgba(153,27,27,0.7)}

/* ── CHART CONTAINERS ── */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px;margin-bottom:24px}
.g3{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px;margin-bottom:24px}
.cc{background:var(--card);border:1px solid var(--b1);border-radius:16px;padding:20px;transition:all .3s ease;height:100%;box-shadow:0 4px 20px rgba(0,0,0,0.08);position:relative;overflow:hidden}
.cc:hover{border-color:var(--b2);box-shadow:0 8px 30px rgba(0,0,0,0.15);transform:translateY(-2px)}
.cc-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
.cc-tt{font-size:12px;font-weight:600;letter-spacing:.4px;text-transform:uppercase;color:var(--tx)}
.cc-bj{font-family:var(--fm);font-size:10px;color:var(--warning);background:rgba(245,158,11,0.1);padding:5px 10px;border-radius:16px;font-weight:600}
.leg{display:flex;align-items:center;gap:12px}
.leg-i{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--su)}
.leg-d{width:6px;height:6px;border-radius:50%}

/* Chart glow effects */
.cc::before{content:'';position:absolute;top:0;left:0;width:100%;height:2px;background:linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent);opacity:0;transition:opacity 0.3s ease}
.cc:hover::before{opacity:1}

/* Real-time data indicator */
.cc::after{content:'';position:absolute;top:12px;right:12px;width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;opacity:0;transition:opacity 0.3s ease}
.cc:hover::after{opacity:1}

/* pie legend */
.pl{display:flex;flex-direction:column;gap:5px;margin-top:10px;max-height:200px;overflow-y:auto}
.pl-r{display:flex;align-items:center;gap:6px;font-size:11px}
.pl-d{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.pl-n{color:var(--su);flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pl-p{font-family:var(--fm);color:var(--mu);font-size:10px;margin-right:3px}
.pl-v{font-family:var(--fm);color:var(--tx);font-weight:600;font-size:11px}

/* recent */
.ra{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--b0)}
.ra:last-child{border:none}
.ra-ic{width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.ra-mid{flex:1;min-width:0}
.ra-nm{font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ra-ct{font-size:10px;color:var(--mu);margin-top:1px}
.ra-am{font-family:var(--fm);font-size:12px;font-weight:600;flex-shrink:0}

/* ── TRANSACTIONS ── */
.tc{display:flex;gap:9px;margin-bottom:11px;flex-wrap:wrap;align-items:center}
.ts{display:flex;align-items:center;background:var(--card);border:1px solid var(--b1);border-radius:10px;padding:0 12px;gap:7px;flex:1;min-width:180px;transition:border-color .2s}
.ts:focus-within{border-color:var(--gold)}
.ts input{background:none;border:none;outline:none;color:var(--tx);font-family:var(--fn);font-size:12px;padding:10px 0;width:100%}
.ts input::placeholder{color:var(--mu)}
.tse{background:var(--card);border:1px solid var(--b1);border-radius:10px;padding:8px 11px;color:var(--tx);font-family:var(--fn);font-size:12px;cursor:pointer;outline:none;transition:border-color .2s}
.tse:focus{border-color:var(--gold)}
.tse option{background:var(--card2)}
.add{display:flex;align-items:center;gap:6px;padding:9px 16px;background:linear-gradient(135deg,#F5A623,#C97A08);color:#000;font-family:var(--fn);font-size:12px;font-weight:700;border:none;border-radius:10px;cursor:pointer;transition:all .18s;box-shadow:0 4px 16px rgba(245,166,35,.2);white-space:nowrap}
.add:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(245,166,35,.35)}
.chips{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:12px}
.chip{display:flex;align-items:center;gap:4px;padding:5px 11px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer;transition:all .16s;border:1px solid var(--b1);background:var(--b0);color:var(--su)}
.chip:hover{border-color:var(--b2);color:var(--tx)}
.chip.on{color:#000;border-color:transparent}
.tst{display:flex;gap:18px;margin-bottom:9px;font-size:11px;color:var(--su);flex-wrap:wrap}
.tst strong{color:var(--tx);font-family:var(--fm)}
.tw{background:var(--card);border:1px solid var(--b1);border-radius:var(--r2);overflow:hidden;margin-bottom:13px}
.tb{width:100%;border-collapse:collapse}
.tb th{text-align:left;padding:10px 16px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--mu);background:rgba(255,255,255,.02);border-bottom:1px solid var(--b1);cursor:pointer;user-select:none;transition:color .15s;white-space:nowrap}
.tb th:hover,.tb th.on{color:var(--gold)}
.tr{transition:background .12s}
.tr:hover{background:var(--hov)}
.tr td{padding:11px 16px;font-size:12px;border-bottom:1px solid var(--b0);vertical-align:middle}
.tr:last-child td{border:none}
.td-ds{font-weight:600;display:flex;align-items:center;gap:5px}
.td-rc{width:5px;height:5px;border-radius:50%;background:var(--teal);flex-shrink:0}
.td-dt{font-family:var(--fm);font-size:10px;color:var(--mu)}
.cp{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:20px;font-size:10px;font-weight:600}
.ta{font-family:var(--fm);font-weight:600;font-size:13px}
.tac{display:flex;gap:4px;opacity:0;transition:opacity .15s}
.tr:hover .tac{opacity:1}
.ab{width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:6px;border:none;cursor:pointer;transition:all .15s}
.ab.ed{background:rgba(96,165,250,.14);color:var(--bl)}
.ab.dl{background:rgba(239,68,68,.14);color:var(--re)}
.ab:hover{filter:brightness(1.3);transform:scale(1.1)}
.pag{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap}
.pi{font-size:11px;color:var(--mu)}
.pbs{display:flex;align-items:center;gap:3px}
.pb{width:30px;height:30px;border-radius:7px;border:1px solid var(--b1);background:var(--b0);color:var(--su);font-size:12px;font-family:var(--fm);cursor:pointer;transition:all .15s;display:flex;align-items:center;justify-content:center}
.pb:hover{border-color:var(--b2);color:var(--tx)}
.pb.on{background:rgba(245,166,35,.15);border-color:rgba(245,166,35,.35);color:var(--gold);font-weight:700}
.pb:disabled{opacity:.3;cursor:default}
.emp{text-align:center;padding:56px 20px}
.emp-ic{width:56px;height:56px;border-radius:14px;background:var(--b0);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:24px}
.emp-t{font-size:14px;font-weight:600;color:var(--su);margin-bottom:4px}
.emp-s{font-size:12px;color:var(--mu)}

/* ── BUDGET ── */
.bg{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:13px;margin-bottom:18px}
.bc{background:var(--card);border:1px solid var(--b1);border-radius:var(--r2);padding:16px;transition:all .2s}
.bc:hover{border-color:var(--b2);transform:translateY(-1px)}
.bc-tp{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.bc-ca{display:flex;align-items:center;gap:8px}
.bc-ni{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px}
.bc-nm{font-size:13px;font-weight:600}
.bc-st{font-size:10px;font-weight:700;letter-spacing:.5px;padding:3px 7px;border-radius:20px}
.ok{background:rgba(34,197,94,.1);color:#22C55E}
.wn{background:rgba(251,191,36,.1);color:var(--am)}
.ov{background:rgba(239,68,68,.1);color:var(--re)}
.bb{height:5px;background:var(--b1);border-radius:3px;overflow:hidden;margin-bottom:7px}
.bf{height:100%;border-radius:3px;transition:width 1s ease}
.bns{display:flex;justify-content:space-between;font-size:11px}
.bs{font-family:var(--fm);font-weight:600}
.bt{font-family:var(--fm);color:var(--mu)}
.be{display:flex;align-items:center;gap:7px;margin-top:9px;padding-top:9px;border-top:1px solid var(--b0)}
.bsl{flex:1;-webkit-appearance:none;appearance:none;height:3px;border-radius:2px;background:var(--b1);outline:none;cursor:pointer}
.bsl::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;border-radius:50%;background:var(--gold);border:2px solid var(--bg);cursor:pointer;transition:transform .15s}
.bsl::-webkit-slider-thumb:hover{transform:scale(1.25)}
.bv{width:68px;background:var(--b0);border:1px solid var(--b1);border-radius:6px;padding:4px 6px;color:var(--tx);font-family:var(--fm);font-size:11px;text-align:right;outline:none;transition:border-color .2s}
.bv:focus{border-color:var(--gold)}
.bsum{background:var(--card);border:1px solid var(--b1);border-radius:var(--r2);padding:18px;margin-bottom:18px;display:grid;grid-template-columns:repeat(4,1fr);gap:14px;text-align:center}
.bs-v{font-family:var(--fm);font-size:20px;font-weight:600;margin-bottom:3px}
.bs-l{font-size:10px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:var(--mu)}

/* ── INSIGHTS ── */
.ig{display:grid;grid-template-columns:repeat(auto-fit,minmax(195px,1fr));gap:13px;margin-bottom:16px}
.ic{background:var(--card);border:1px solid var(--b1);border-radius:var(--r2);padding:17px;transition:all .2s;position:relative;overflow:hidden}
.ic:hover{transform:translateY(-2px);border-color:var(--b2)}
.ic-gl{position:absolute;width:70px;height:70px;border-radius:50%;top:-15px;right:-15px;filter:blur(25px);opacity:.13}
.ic-lb{font-size:10px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:var(--mu);margin-bottom:5px}
.ic-vl{font-family:var(--fm);font-size:20px;font-weight:600;line-height:1.1;margin-bottom:4px}
.ic-sb{font-size:11px;color:var(--su);line-height:1.5}
.hs-sec{display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:center;background:var(--card);border:1px solid var(--b1);border-radius:var(--r2);padding:20px;margin-bottom:16px}
.hf{display:flex;flex-direction:column;gap:11px}
.hf-r{display:flex;align-items:center;gap:10px}
.hf-lb{font-size:11.5px;color:var(--su);width:140px;flex-shrink:0}
.hf-bg{flex:1;height:4px;background:var(--b1);border-radius:2px;overflow:hidden}
.hf-fl{height:100%;border-radius:2px;transition:width 1.1s ease}
.hf-pt{font-family:var(--fm);font-size:11px;color:var(--tx);min-width:35px;text-align:right}
.hf-nt{font-size:10px;color:var(--mu);min-width:160px}
.pb2{height:3px;background:var(--b1);border-radius:2px;overflow:hidden}
.pf2{height:100%;border-radius:2px;transition:width .8s ease}

/* ── MODAL ── */
.mbk{position:fixed;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(6px);z-index:500;display:flex;align-items:center;justify-content:center;padding:20px}
.mdl{background:var(--card2);border:1px solid var(--b2);border-radius:var(--r3);padding:24px;width:100%;max-width:450px;box-shadow:0 28px 70px rgba(0,0,0,.6);animation:mi .18s ease}
@keyframes mi{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1)}}
.m-tt{font-size:16px;font-weight:700;margin-bottom:18px;display:flex;align-items:center;justify-content:space-between}
.m-fd{margin-bottom:13px}
.m-lb{display:block;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--su);margin-bottom:6px}
.m-ip{width:100%;background:var(--surf);border:1px solid var(--b1);border-radius:9px;padding:10px 13px;color:var(--tx);font-family:var(--fn);font-size:13px;outline:none;transition:border-color .2s}
.m-ip:focus{border-color:var(--gold)}
.m-ip option{background:var(--card2)}
.tto{display:grid;grid-template-columns:1fr 1fr;gap:5px;background:var(--surf);border:1px solid var(--b1);border-radius:9px;padding:4px}
.ttb{padding:8px;border-radius:7px;border:none;font-family:var(--fn);font-size:12px;font-weight:700;cursor:pointer;transition:all .18s;background:none;color:var(--mu)}
.ttb.oi{background:rgba(34,197,94,.18);color:var(--gr)}
.ttb.oe{background:rgba(239,68,68,.18);color:var(--re)}
.m-ck{display:flex;align-items:center;gap:8px;padding:10px 13px;background:var(--surf);border:1px solid var(--b1);border-radius:9px;cursor:pointer;font-size:12px;color:var(--su);transition:border-color .2s}
.m-ck:hover{border-color:var(--b2);color:var(--tx)}
.m-ck input{width:14px;height:14px;accent-color:var(--teal);cursor:pointer}
.m-ac{display:flex;gap:9px;margin-top:18px}
.m-cn{flex:1;padding:11px;background:var(--surf);border:1px solid var(--b1);border-radius:9px;color:var(--su);font-family:var(--fn);font-size:13px;font-weight:600;cursor:pointer;transition:all .16s}
.m-cn:hover{border-color:var(--b2);color:var(--tx)}
.m-sb{flex:2;padding:11px;background:linear-gradient(135deg,#F5A623,#C97A08);border:none;border-radius:9px;color:#000;font-family:var(--fn);font-size:13px;font-weight:800;cursor:pointer;transition:all .16s}
.m-sb:hover{filter:brightness(1.07);transform:translateY(-1px)}

/* MISC */
.fi{animation:fi .2s ease}
@keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--b2);border-radius:2px}
.rel{position:relative}

/* RESPONSIVE */
@media(max-width:1200px){.scs{grid-template-columns:repeat(2,1fr)}.g2{grid-template-columns:1fr}}
@media(max-width:900px){.sb{display:none}.scs{grid-template-columns:1fr 1fr}.bsum{grid-template-columns:1fr 1fr}}
@media(max-width:620px){.scs{grid-template-columns:1fr}.cnt{padding:14px 14px}.hdr{padding:12px 14px}.bsum{grid-template-columns:1fr}}
`;

const PER_PAGE = 8;

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
  const [dismissedNotifications, setDismissedNotifications] = useState(new Set());
  const [budgets,setBudgets] = useState(DEFAULT_BUDGETS);
  const [form,setForm]       = useState({date:"",description:"",category:"Food",type:"expense",amount:"",recurring:false});
  const [darkMode,setDarkMode] = useState(() => {
  const saved = localStorage.getItem('dashboard-theme');
  return saved ? saved === 'dark' : true;
});
const [reportMenu,setReportMenu] = useState(false);
const [timeView,setTimeView] = useState('weekly');
const [yearRange,setYearRange] = useState(4); // How many years to show
const [pieChartMonth,setPieChartMonth] = useState(new Date().getMonth()); // Which month for pie chart
const nRef = useRef(null);

// Theme persistence effect
useEffect(() => {
  localStorage.setItem('dashboard-theme', darkMode ? 'dark' : 'light');
}, [darkMode]);

  useEffect(()=>{
    const h=e=>{
      if(nRef.current&&!nRef.current.contains(e.target))setShowN(false);
      if(!e.target.closest('.rel')&&reportMenu)setReportMenu(false);
    };
    document.addEventListener("mousedown",h);
    return()=>document.removeEventListener("mousedown",h);
  },[reportMenu]);

  /* ── Derived ── */
  const sum=useMemo(()=>{
    const inc=txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
    const exp=txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
    return{inc,exp,bal:inc-exp};
  },[txns]);

  const monthly=useMemo(()=>MONTHS.map(({l,n})=>{
    const mt=txns.filter(t=>new Date(t.date).getMonth()+1===n);
    const inc=mt.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
    const exp=mt.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
    return{month:l,inc,exp,net:inc-exp};
  }),[txns]);

  const trend=useMemo(()=>{let r=0;return monthly.map(m=>{r+=m.net;return{month:m.month,balance:r};});},[monthly]);

  const catData=useMemo(()=>{
    const m={};
    // Filter transactions by selected month, type expense, and only show past/present months
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    txns.filter(t=>{
      const transactionDate = new Date(t.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth();
      
      return t.type==="expense" && 
             transactionMonth===pieChartMonth && 
             (transactionYear < currentYear || (transactionYear === currentYear && transactionMonth <= currentMonth));
    }).forEach(t=>{m[t.category]=(m[t.category]||0)+t.amount;});
    
    return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({name,value}));
  },[txns, pieChartMonth]);

  const catSpend=useMemo(()=>{
    const m={};
    txns.filter(t=>t.type==="expense").forEach(t=>{m[t.category]=(m[t.category]||0)+t.amount;});
    return m;
  },[txns]);

  const momTrend=useMemo(()=>{
    const m2=monthly[1]||{},m1=monthly[0]||{};
    return{
      incChg:m1.inc>0?((m2.inc-m1.inc)/m1.inc*100).toFixed(1):0,
      expChg:m1.exp>0?((m2.exp-m1.exp)/m1.exp*100).toFixed(1):0,
      balChg:Math.abs(m1.net)>0?((m2.net-m1.net)/Math.abs(m1.net)*100).toFixed(1):0,
    };
  },[monthly]);

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
      const notificationKey = `${cat}-${spent}-${budget}`;
      if(p>1 && !dismissedNotifications.has(notificationKey)) {
        a.push({type:"danger",cat,msg:`Over budget by ${fmt(spent-budget)}`,key:notificationKey});
      }
      else if(p>0.8 && !dismissedNotifications.has(notificationKey)) {
        a.push({type:"warning",cat,msg:`${Math.round(p*100)}% of budget used`,key:notificationKey});
      }
    });
    return a;
  },[catSpend,budgets,dismissedNotifications]);

  // Notification handlers
  const dismissNotification = (notificationKey) => {
    setDismissedNotifications(prev => new Set([...prev, notificationKey]));
  };

  const dismissAllNotifications = () => {
    const currentKeys = notifications.map(n => n.key);
    setDismissedNotifications(prev => new Set([...prev, ...currentKeys]));
  };

  const markAllAsRead = () => {
    // For this demo, marking as read is same as dismissing
    const currentKeys = notifications.map(n => n.key);
    setDismissedNotifications(prev => new Set([...prev, ...currentKeys]));
  };

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

  const spINC=monthly.filter(m=>m.inc>0).map(m=>m.inc);
  const spEXP=monthly.filter(m=>m.exp>0).map(m=>m.exp);
  const spBAL=trend.map(m=>m.balance);
  const spSAV=monthly.map(m=>m.inc>0?Math.round((m.net/m.inc)*100):0);

  const totalBud=Object.values(budgets).reduce((s,v)=>s+v,0);
  const totalSp=Object.entries(catSpend).filter(([k])=>budgets[k]).reduce((s,[,v])=>s+v,0);
  const budUtil=totalBud>0?Math.min((totalSp/totalBud)*100,100):0;

  /* handlers */
  const openAdd =()=>{setEd(null);setForm({date:"",description:"",category:"Food",type:"expense",amount:"",recurring:false});setModal(true);};
  const openEdit=t=>{setEd(t);setForm({date:t.date,description:t.description,category:t.category,type:t.type,amount:String(t.amount),recurring:!!t.recurring});setModal(true);};
  const save=()=>{const amt=parseFloat(form.amount);if(!form.date||!form.description||isNaN(amt)||amt<=0)return;if(editing)setTxns(p=>p.map(t=>t.id===editing.id?{...form,id:t.id,amount:amt}:t));else setTxns(p=>[{...form,id:Date.now(),amount:amt},...p]);setModal(false);setPage(1);};
  const del=id=>setTxns(p=>p.filter(t=>t.id!==id));
  const fv=k=>v=>setForm(p=>({...p,[k]:v}));
  const xport=()=>{const csv="Date,Description,Category,Type,Amount,Recurring\n"+txns.map(t=>`${t.date},"${t.description}",${t.category},${t.type},${t.amount},${t.recurring}`).join("\n");const blob=new Blob([csv],{type:"text/csv"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="transactions.csv";a.click();URL.revokeObjectURL(url);};

  const generateReport = (period) => {
    let filtered = [...txns];
    let title = "";
    let dateRange = "";
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    switch(period) {
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = txns.filter(t => new Date(t.date) >= weekAgo);
        title = "Weekly Financial Report";
        dateRange = `${weekAgo.toISOString().split('T')[0]} to ${today}`;
        break;
      case "month":
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        filtered = txns.filter(t => new Date(t.date) >= monthAgo);
        title = "Monthly Financial Report";
        dateRange = `${monthAgo.toISOString().split('T')[0]} to ${today}`;
        break;
      case "quarter":
        const quarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        filtered = txns.filter(t => new Date(t.date) >= quarterAgo);
        title = "Quarterly Financial Report";
        dateRange = `${quarterAgo.toISOString().split('T')[0]} to ${today}`;
        break;
      case "year":
        const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        filtered = txns.filter(t => new Date(t.date) >= yearAgo);
        title = "Annual Financial Report";
        dateRange = `${yearAgo.toISOString().split('T')[0]} to ${today}`;
        break;
      case "custom":
        // For now, use last 30 days as custom
        const customAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = txns.filter(t => new Date(t.date) >= customAgo);
        title = "Custom Period Report";
        dateRange = `${customAgo.toISOString().split('T')[0]} to ${today}`;
        break;
    }
    
    const income = filtered.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = filtered.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const net = income - expenses;
    const savingsRate = income > 0 ? ((net / income) * 100).toFixed(1) : 0;
    
    const reportData = {
      title,
      period,
      dateRange,
      summary: {
        totalTransactions: filtered.length,
        totalIncome: income,
        totalExpenses: expenses,
        netSavings: net,
        savingsRate: `${savingsRate}%`,
        averageDailyExpense: expenses / Math.max(1, Math.ceil((new Date(filtered[filtered.length - 1]?.date) - new Date(filtered[0]?.date)) / (1000 * 60 * 60 * 24)))
      },
      categoryBreakdown: CATS.map(cat => {
        const catExpenses = filtered.filter(t => t.category === cat && t.type === "expense");
        const total = catExpenses.reduce((s, t) => s + t.amount, 0);
        return {
          category: cat,
          total,
          count: catExpenses.length,
          percentage: expenses > 0 ? ((total / expenses) * 100).toFixed(1) : 0
        };
      }).filter(c => c.total > 0).sort((a, b) => b.total - a.total),
      transactions: filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    };
    
    // Create and download JSON report
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    // Show success message
    alert(`${title} generated successfully!\nPeriod: ${dateRange}\nTotal Transactions: ${filtered.length}\nNet Savings: ₹${net.toLocaleString('en-IN')}`);
  };

  const exportData = (format) => {
    switch(format) {
      case "csv":
        xport();
        break;
      case "excel":
        // For Excel export, we'll create a CSV that can be opened in Excel
        const excelData = "Date,Description,Category,Type,Amount,Recurring,Tags\n" + 
          txns.map(t => `${t.date},"${t.description}",${t.category},${t.type},${t.amount},${t.recurring},"${(t.tags || []).join(';')}"`).join("\n");
        const blob = new Blob([excelData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fintrack_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        break;
      case "pdf":
        // For PDF, we'll create a simple text report
        const pdfContent = generateTextReport();
        const pdfBlob = new Blob([pdfContent], { type: 'text/plain' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const pdfA = document.createElement('a');
        pdfA.href = pdfUrl;
        pdfA.download = `fintrack_report_${new Date().toISOString().split('T')[0]}.txt`;
        pdfA.click();
        URL.revokeObjectURL(pdfUrl);
        break;
      case "json":
        const jsonData = JSON.stringify({
          summary: sum,
          monthly: monthly,
          transactions: txns,
          budgets: budgets,
          health: health,
          exportDate: new Date().toISOString()
        }, null, 2);
        const jsonBlob = new Blob([jsonData], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonA = document.createElement('a');
        jsonA.href = jsonUrl;
        jsonA.download = `fintrack_complete_export_${new Date().toISOString().split('T')[0]}.json`;
        jsonA.click();
        URL.revokeObjectURL(jsonUrl);
        break;
    }
  };

  const generateTextReport = () => {
    const report = `
FINTRACK FINANCIAL REPORT
========================
Generated: ${new Date().toLocaleDateString('en-IN')}
Period: Q1 2026

SUMMARY
-------
Total Balance: ₹${sum.bal.toLocaleString('en-IN')}
Total Income: ₹${sum.inc.toLocaleString('en-IN')}
Total Expenses: ₹${sum.exp.toLocaleString('en-IN')}
Net Savings: ₹${sum.bal.toLocaleString('en-IN')}
Savings Rate: ${((sum.bal / sum.inc) * 100).toFixed(1)}%

MONTHLY BREAKDOWN
------------------
${monthly.map(m => `${m.month}: Income ₹${m.inc.toLocaleString('en-IN')}, Expenses ₹${m.exp.toLocaleString('en-IN')}, Net ₹${m.net.toLocaleString('en-IN')}`).join('\n')}

CATEGORY BREAKDOWN
------------------
${catData.map(c => `${c.name}: ₹${c.value.toLocaleString('en-IN')} (${c.percentage}%)`).join('\n')}

BUDGET STATUS
-------------
${Object.entries(budgets).map(([cat, budget]) => {
  const spent = catSpend[cat] || 0;
  const status = spent > budget ? 'OVER' : spent <= budget * 0.8 ? 'ON TRACK' : 'WARNING';
  return `${cat}: ₹${spent.toLocaleString('en-IN')} / ₹${budget.toLocaleString('en-IN')} (${status})`;
}).join('\n')}

HEALTH SCORE: ${health.total}/100
========================
`;
    return report;
  };

  const onChip=cat=>{setChipCat(c=>c===cat?null:cat);setPage(1);};

  /* animated total counter */
  const cBal=useCounter(sum.bal);
  const cInc=useCounter(sum.inc);
  const cExp=useCounter(sum.exp);

  /* ── NAV ── */
  const navItems=[
    {id:"overview",    icon:<LayoutDashboard className="sni"/>, label:"Overview"},
    {id:"wallet",      icon:<Wallet className="sni"/>,          label:"Wallet"},
    {id:"transactions",icon:<List className="sni"/>,            label:"Transactions"},
    {id:"budget",      icon:<Target className="sni"/>,          label:"Budget Goals"},
    {id:"insights",    icon:<Lightbulb className="sni"/>,       label:"Insights"},
  ];

  const tabMeta={overview:"Overview",wallet:"Wallet",transactions:"Transactions",budget:"Budget Goals",insights:"Insights"};
  const tabSub={overview:"Your financial snapshot",wallet:"Spending breakdown & recurring",transactions:"All transactions & history",budget:"Set & track spending limits",insights:"Analytics & health score"};

  /* ── VIEWS ── */

  const vOverview=()=>{
    // Dynamic data based on time view
    const getChartData = () => {
      switch(timeView) {
        case 'weekly':
          return [
            {week:"Week 1",income:95000,expense:45000,balance:50000},
            {week:"Week 2",income:24000,expense:32000,balance:-8000},
            {week:"Week 3",income:15000,expense:28000,balance:-13000},
            {week:"Week 4",income:32000,expense:35000,balance:-3000},
            {week:"Week 5",income:20000,expense:22000,balance:-2000},
            {week:"Week 6",income:6500,expense:18000,balance:-11500},
          ];
        case 'monthly':
          return monthly.map(m=>({week:m.month,income:m.inc,expense:m.exp}));
        case 'yearly':
          const currentYear = new Date().getFullYear();
          const years = [];
          for (let i = yearRange - 1; i >= 0; i--) {
            years.push({
              year: String(currentYear - i),
              income: 1200000 + (i * 250000),
              expense: 980000 + (i * 140000),
              balance: 220000 + (i * 110000)
            });
          }
          return years;
        default:
          return [];
      }
    };
    const chartData = getChartData();
    const dataKey = timeView === 'weekly' ? 'week' : timeView === 'monthly' ? 'month' : 'year';
    return(
      <div className="fi">
        <div className="scs">
          {[
            {lb:"Balance",val:fmt(sum.bal),cls:"balance",ic:"💰",note:"Available funds",trend:{type:"up",value:"+12%"}},
            {lb:"Income",val:fmt(sum.inc),cls:"income",ic:"📈",note:"Total earnings",trend:{type:"up",value:"+8%"}},
            {lb:"Expenses",val:fmt(sum.exp),cls:"expense",ic:"💳",note:"Total spent",trend:{type:"down",value:"-5%"}},
            {lb:"Savings",val:fmt(sum.sav),cls:"savings",ic:"🎯",note:"Net saved",trend:{type:"up",value:"+15%"}},
          ].map((c,i)=>(
            <div key={i} className={`sc ${c.cls}`}>
              <div className="sc-ic">{c.ic}</div>
              <div className="sc-lb">{c.lb}</div>
              <div className="sc-vl">{c.val}</div>
              <div className="sc-nt">{c.note}</div>
              {c.trend && (
                <div className={`sc-trend ${c.trend.type}`}>
                  <span className="sc-trend-arrow">{c.trend.type === 'up' ? '↑' : '↓'}</span>
                  {c.trend.value}
                </div>
              )}
              <div className="sc-tooltip">Compared to last month {c.trend.value}</div>
            </div>
          ))}
        </div>

        <div className="g2">
          <div className="cc">
            <div className="cc-hd">
              <span className="cc-tt">{timeView === 'weekly' ? 'Weekly' : timeView === 'monthly' ? 'Monthly' : 'Yearly'} Trend</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                {timeView === 'yearly' && (
                  <select 
                    value={yearRange} 
                    onChange={(e) => setYearRange(Number(e.target.value))}
                    style={{
                      background: 'var(--b0)',
                      border: '1px solid var(--b1)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      color: 'var(--tx)',
                      fontSize: '10px',
                      fontFamily: 'var(--fn)'
                    }}
                  >
                    <option value={2}>2 Years</option>
                    <option value={3}>3 Years</option>
                    <option value={4}>4 Years</option>
                    <option value={5}>5 Years</option>
                  </select>
                )}
                <span className="cc-bj">Last {timeView === 'weekly' ? '6 Weeks' : timeView === 'monthly' ? '3 Months' : `${yearRange} Years`}</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{top:8,right:8,left:0,bottom:0}}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false}/>
                <XAxis dataKey={dataKey} tick={{fill:"#8BA0B8",fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#8BA0B8",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={fmtK}/>
                <Tooltip content={<Tip/>}/>
                <Area type="monotone" dataKey="income" stroke="#22c55e" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2}/>
                <Area type="monotone" dataKey="expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="cc">
            <div className="cc-hd">
              <span className="cc-tt">Category Breakdown</span>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <select 
                  value={pieChartMonth} 
                  onChange={(e) => setPieChartMonth(Number(e.target.value))}
                  style={{
                    background: 'var(--b0)',
                    border: '1px solid var(--b1)',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    color: 'var(--tx)',
                    fontSize: '10px',
                    fontFamily: 'var(--fn)'
                  }}
                >
                  <option value={0}>January</option>
                  <option value={1}>February</option>
                  <option value={2}>March</option>
                  <option value={3}>April</option>
                  <option value={4}>May</option>
                  <option value={5}>June</option>
                  <option value={6}>July</option>
                  <option value={7}>August</option>
                  <option value={8}>September</option>
                  <option value={9}>October</option>
                  <option value={10}>November</option>
                  <option value={11}>December</option>
                </select>
                <span className="cc-bj">{['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][pieChartMonth]}</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={catData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {catData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CAT[entry.name]?.clr || "#64748B"} />
                  ))}
                </Pie>
                <Tooltip content={<Tip/>}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="pl">
              {catData.slice(0,5).map((c,i)=>(
                <div key={i} className="pl-r">
                  <div className="pl-d" style={{background:CAT[c.name]?.clr||"#64748B"}}/>
                  <span className="pl-n">{c.name}</span>
                  <span className="pl-p">{c.percentage}%</span>
                  <span className="pl-v">{fmt(c.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="g3">
          <div className="cc">
            <div className="cc-hd">
              <span className="cc-tt">Monthly Comparison</span>
              <span className="cc-bj">Q1 2026</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthly} margin={{top:8,right:8,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false}/>
                <XAxis dataKey="month" tick={{fill:"#8BA0B8",fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#8BA0B8",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={fmtK}/>
                <Tooltip content={<Tip/>}/>
                <Bar dataKey="inc" fill="#22c55e" radius={[8,8,0,0]} name="Income"/>
                <Bar dataKey="exp" fill="#ef4444" radius={[8,8,0,0]} name="Expenses"/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="cc">
            <div className="cc-hd">
              <span className="cc-tt">Balance Trend</span>
              <span className="cc-bj">Growth Analysis</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={monthly} margin={{top:8,right:8,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false}/>
                <XAxis dataKey="month" tick={{fill:"#8BA0B8",fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#8BA0B8",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={fmtK}/>
                <Tooltip content={<Tip/>}/>
                <Line type="monotone" dataKey="net" stroke="#f59e0b" strokeWidth={3} dot={{fill:"#f59e0b",r:6}} activeDot={{r:8}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="cc">
          <div className="cc-hd">
            <span className="cc-tt">Recent Transactions</span>
            <span className="cc-bj">Latest Activity</span>
          </div>
          {recent5.map(t=>(
            <div key={t.id} className="ra">
              <div className="ra-ic" style={{background:CAT[t.category]?.bg||"rgba(100,116,139,.12)"}}>{CAT[t.category]?.icon||"💳"}</div>
              <div className="ra-mid"><div className="ra-nm">{t.description}</div><div className="ra-ct">{fmtD(t.date)} · {t.category}</div></div>
              <div className="ra-am" style={{color:t.type==="income"?"#22c55e":"var(--tx)"}}>{t.type==="income"?"+":"−"}{fmt(t.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const vWallet=()=>{
    const avgDaily=(sum.exp/90).toFixed(0);
    const bestM=[...monthly].sort((a,b)=>b.net-a.net)[0];
    const recList=txns.filter(t=>t.recurring);
    return(
      <div className="fi">
        <div className="scs">
          {[
            {lb:"Avg Daily Spend",val:fmt(parseFloat(avgDaily)),cls:"daily",ic:"📅",note:`${txns.filter(t=>t.type==="expense").length} expense entries`},
            {lb:"Best Month Net", val:fmt(bestM?.net||0),       cls:"budget",ic:"🏆",note:`${bestM?.month} 2026`},
            {lb:"Recurring Count",val:String(recList.length),   cls:"recurring",ic:"🔄",note:"Auto-tagged entries"},
            {lb:"Unique Sources", val:String(txns.filter(t=>t.type==="income").map(t=>t.description).filter((v,i,a)=>a.indexOf(v)===i).length),cls:"health",ic:"💡",note:"Income sources"},
          ].map((c,i)=>(
            <div key={i} className={`sc ${c.cls}`}>
              <div className="sc-ic">{c.ic}</div>
              <div className="sc-lb">{c.lb}</div>
              <div className="sc-vl">{c.val}</div>
              <div className="sc-nt">{c.note}</div>
            </div>
          ))}
        </div>
        <div className="cc" style={{marginBottom:14}}>
          <div className="cc-hd"><span className="cc-tt">Category Spending Analysis</span><span className="cc-bj">Q1 2026</span></div>
          <div className="tw">
            <table className="tb">
              <thead><tr><th>Category</th><th>Entries</th><th>Avg/txn</th><th>Budget</th><th style={{textAlign:"right"}}>Total</th><th style={{minWidth:150}}>Share</th></tr></thead>
              <tbody>
                {catData.map((c,i)=>{
                  const count=txns.filter(t=>t.category===c.name&&t.type==="expense").length;
                  const avg=count>0?Math.round(c.value/count):0;
                  const bud=budgets[c.name];
                  const bp=bud?Math.min((c.value/bud)*100,100):null;
                  return(
                    <tr key={i} className="tr">
                      <td><span className="cp" style={{background:CAT[c.name]?.bg||"rgba(100,116,139,.12)",color:CAT[c.name]?.clr||"#94A3B8"}}>{CAT[c.name]?.icon} {c.name}</span></td>
                      <td style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--su)"}}>{count}</td>
                      <td style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--su)"}}>{fmt(avg)}</td>
                      <td style={{fontFamily:"var(--fm)",fontSize:11,color:bud?bp>=100?"var(--re)":bp>=80?"var(--am)":"var(--gr)":"var(--mu)"}}>{bud?fmt(bud):"—"}</td>
                      <td style={{textAlign:"right",fontFamily:"var(--fm)",fontWeight:600,fontSize:13}}>{fmt(c.value)}</td>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div className="pb2" style={{flex:1}}><div className="pf2" style={{width:`${pct(c.value,sum.exp)}%`,background:CAT[c.name]?.clr||"#64748B"}}/></div>
                          <span style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--mu)",minWidth:30,textAlign:"right"}}>{pct(c.value,sum.exp)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="cc">
          <div className="cc-hd"><span className="cc-tt">Recurring Transactions</span><span style={{fontSize:11,color:"var(--teal)",display:"flex",alignItems:"center",gap:4}}><div style={{width:5,height:5,borderRadius:"50%",background:"var(--teal)"}}/>Active</span></div>
          {recList.length===0?<div className="emp"><div className="emp-ic">🔄</div><div className="emp-t">No recurring transactions</div></div>:(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(195px,1fr))",gap:9}}>
              {recList.map(t=>(
                <div key={t.id} style={{background:"var(--b0)",border:"1px solid var(--b1)",borderRadius:10,padding:"11px",display:"flex",alignItems:"center",gap:9}}>
                  <div style={{fontSize:17}}>{CAT[t.category]?.icon||"💳"}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.description}</div>
                    <div style={{fontSize:10,color:"var(--mu)",marginTop:1}}>{t.category}</div>
                  </div>
                  <div style={{fontFamily:"var(--fm)",fontSize:12,fontWeight:600,color:t.type==="income"?"var(--gr)":"var(--tx)",flexShrink:0}}>{t.type==="income"?"+":"−"}{fmt(t.amount)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const vTransactions=()=>{
    const fInc=filtered.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
    const fExp=filtered.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
    return(
      <div className="fi">
        <div className="tc">
          <div className="ts">
            <Search size={13} color="#3D5068"/>
            <input placeholder="Search transactions…" value={q} onChange={e=>{setQ(e.target.value);setPage(1);}}/>
            {q&&<button style={{background:"none",border:"none",cursor:"pointer",color:"var(--mu)",display:"flex",padding:0}} onClick={()=>{setQ("");setPage(1);}}><X size={12}/></button>}
          </div>
          <select className="tse" value={fType} onChange={e=>{setFType(e.target.value);setPage(1);}}>
            <option value="all">All Types</option><option value="income">Income</option><option value="expense">Expense</option>
          </select>
          <select className="tse" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="date-desc">Newest</option><option value="date-asc">Oldest</option>
            <option value="amount-desc">Highest</option><option value="amount-asc">Lowest</option>
          </select>
          {role==="admin"&&<button className="add" onClick={openAdd}><Plus size={12}/>Add Transaction</button>}
        </div>
        <div className="chips">
          <div className="chip on" style={!chipCat?{background:"var(--gold)",borderColor:"var(--gold)",color:"#000"}:{background:""}} onClick={()=>{setChipCat(null);setPage(1);}}>All</div>
          {allCats.map(c=>(
            <div key={c} className="chip" style={chipCat===c?{background:CAT[c]?.clr||"#64748B",borderColor:"transparent",color:"#000"}:{}} onClick={()=>onChip(c)}>
              {CAT[c]?.icon} {c}
            </div>
          ))}
        </div>
        <div className="tst">
          <span>Showing <strong>{filtered.length}</strong> of {txns.length}</span>
          <span style={{color:"#22c55e"}}>↑ {fmt(fInc)}</span>
          <span style={{color:"#ef4444"}}>↓ {fmt(fExp)}</span>
          <span>Net: <strong style={{color:fInc-fExp>=0?"#22c55e":"#ef4444"}}>{fmt(fInc-fExp)}</strong></span>
        </div>
        <div className="tw">
          {paged.length===0?(
            <div className="emp"><div className="emp-ic">🔍</div><div className="emp-t">No transactions found</div><div className="emp-s">Try clearing your search or filters</div></div>
          ):(
            <table className="tb">
              <thead><tr><th>Description</th><th>Date</th><th>Category</th><th>Type</th><th style={{textAlign:"right"}}>Amount</th>{role==="admin"&&<th style={{width:70}}></th>}</tr></thead>
              <tbody>
                {paged.map(t=>(
                  <tr key={t.id} className="tr">
                    <td><div className="td-ds">{t.recurring&&<div className="td-rc" title="Recurring"/>}{t.description}</div></td>
                    <td><div className="td-dt">{fmtD(t.date)}</div></td>
                    <td><span className="cp" style={{background:CAT[t.category]?.bg||"rgba(100,116,139,.12)",color:CAT[t.category]?.clr||"#94A3B8"}}>{CAT[t.category]?.icon} {t.category}</span></td>
                    <td><span style={{fontSize:10,fontWeight:700,color:t.type==="income"?"var(--gr)":"var(--re)"}}>{t.type==="income"?"↑ INCOME":"↓ EXPENSE"}</span></td>
                    <td style={{textAlign:"right"}}><span className="ta" style={{color:t.type==="income"?"var(--gr)":"var(--tx)"}}>{t.type==="income"?"+":"−"}{fmt(t.amount)}</span></td>
                    {role==="admin"&&<td><div className="tac"><button className="ab ed" onClick={()=>openEdit(t)}><Edit2 size={11}/></button><button className="ab dl" onClick={()=>del(t.id)}><Trash2 size={11}/></button></div></td>}
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
              {Array.from({length:totalPages},(_,i)=>i+1).filter(p=>p===1||p===totalPages||Math.abs(p-page)<=1).reduce((acc,p,i,arr)=>{if(i>0&&p-arr[i-1]>1)acc.push("…");acc.push(p);return acc;},[]).map((p,i)=>(
                typeof p==="string"
                  ?<span key={i} style={{padding:"0 4px",fontSize:12,color:"var(--mu)"}}>…</span>
                  :<button key={i} className={`pb${page===p?" on":""}`} onClick={()=>setPage(p)}>{p}</button>
              ))}
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
            {lb:"Total Budget",   v:fmt(totalBud),     cls:"budget",ic:"💰",note:"Monthly limit"},
            {lb:"Total Spent",    v:fmt(totalSp),      cls:"expense",ic:"💳",note:totalSp>totalBud?"Over budget":"On track"},
            {lb:"Over Budget",    v:`${overC} categories`, cls:"danger",ic:"⚠️",note:"Needs attention"},
            {lb:"On Track",       v:`${safeC} categories`, cls:"health",ic:"✅",note:"Good progress"},
          ].map((c,i)=>(
            <div key={i} className={`sc ${c.cls}`}>
              <div className="sc-ic">{c.ic}</div>
              <div className="sc-lb">{c.lb}</div>
              <div className="sc-vl">{c.v}</div>
              <div className="sc-nt">{c.note}</div>
            </div>
          ))}
        </div>
        <div className="cc" style={{marginBottom:16}}>
          <div className="cc-hd"><span className="cc-tt">Overall Budget Utilization</span><span className="cc-bj">{budUtil.toFixed(1)}%</span></div>
          <div style={{height:9,background:"var(--b1)",borderRadius:5,overflow:"hidden",marginBottom:7}}>
            <div style={{height:"100%",width:`${budUtil}%`,background:budUtil>=100?"#ef4444":budUtil>=80?"#f59e0b":"#22c55e",borderRadius:5,transition:"width 1s ease"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--mu)",fontFamily:"var(--fm)"}}>
            <span>₹0</span><span style={{color:budUtil>=100?"#ef4444":budUtil>=80?"#f59e0b":"#22c55e"}}>{fmt(totalSp)} spent</span><span>{fmt(totalBud)}</span>
          </div>
          {role!=="admin"&&<div style={{marginTop:11,padding:"7px 11px",background:"rgba(59,130,246,0.07)",borderRadius:8,fontSize:11,color:"var(--primary)"}}>Switch to Admin to edit budget limits</div>}
        </div>
        <div className="bg">
          {Object.entries(budgets).map(([cat,budget])=>{
            const spent=catSpend[cat]||0,p=Math.min((spent/budget)*100,100);
            const over=spent>budget,warn=!over&&p>=80;
            const bc=over?"var(--re)":warn?"var(--am)":CAT[cat]?.clr||"var(--teal)";
            return(
              <div key={cat} className="bc">
                <div className="bc-tp">
                  <div className="bc-ca"><div className="bc-ni" style={{background:CAT[cat]?.bg||"rgba(100,116,139,.12)"}}>{CAT[cat]?.icon||"💳"}</div><div className="bc-nm">{cat}</div></div>
                  <div className={`bc-st ${over?"ov":warn?"wn":"ok"}`}>{over?"OVER":warn?"WARN":"OK"}</div>
                </div>
                <div className="bb"><div className="bf" style={{width:`${p}%`,background:bc}}/></div>
                <div className="bns"><span className="bs" style={{color:bc}}>{fmt(spent)} spent</span><span className="bt">/ {fmt(budget)}</span></div>
                {role==="admin"&&(
                  <div className="be">
                    <input type="range" className="bsl" min={0} max={50000} step={500} value={budget} onChange={e=>setBudgets(pr=>({...pr,[cat]:parseInt(e.target.value)||0}))}/>
                    <input type="number" className="bv" value={budget} min={0} onChange={e=>setBudgets(pr=>({...pr,[cat]:Math.max(0,parseInt(e.target.value)||0)}))}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const vInsights=()=>{
    const avgExp=monthly.filter(m=>m.exp>0).reduce((s,m)=>s+m.exp,0)/Math.max(monthly.filter(m=>m.exp>0).length,1);
    const best=[...monthly].sort((a,b)=>b.net-a.net)[0];
    return(
      <div className="fi">
        <div className="hs-sec">
          <HealthGauge score={health.total}/>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:".8px",textTransform:"uppercase",color:"var(--su)",marginBottom:13}}>Score Breakdown</div>
            <div className="hf">
              {[
                {lb:"Savings Rate",pts:health.savPts,max:40,nt:`${health.savRate}% of income`,clr:"#22c55e"},
                {lb:"Budget Adherence",pts:health.budPts,max:40,nt:`${Math.round(health.budPts/40*100)}% on track`,clr:"#f59e0b"},
                {lb:"Income Diversity",pts:health.divPts,max:20,nt:`${txns.filter(t=>t.type==="income").map(t=>t.category).filter((v,i,a)=>a.indexOf(v)===i).length} source(s)`,clr:"#8b5cf6"},
              ].map((f,i)=>(
                <div key={i} className="hf-r">
                  <div className="hf-lb">{f.lb}</div>
                  <div className="hf-bg"><div className="hf-fl" style={{width:`${(f.pts/f.max)*100}%`,background:f.clr}}/></div>
                  <div className="hf-pt" style={{color:f.clr}}>{f.pts}/{f.max}</div>
                  <div className="hf-nt">{f.nt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="scs">
          {[
            {ic:"🏆",lb:"Top Spending Category",vl:catData[0]?.name||"—",sb:`${fmt(catData[0]?.value||0)} total`,cls:"expense"},
            {ic:"💰",lb:"Savings Rate",         vl:`${health.savRate}%`,sb:`${fmt(sum.bal)} saved`,cls:"income"},
            {ic:"📊",lb:"Avg Monthly Expense",  vl:fmtK(Math.round(avgExp)),sb:"Per month this quarter",cls:"budget"},
            {ic:"🌟",lb:"Best Month Net",       vl:best?.month||"—",sb:`${fmt(best?.net||0)}`,cls:"daily"},
          ].map((c,i)=>(
            <div key={i} className={`sc ${c.cls}`}>
              <div className="sc-ic">{c.ic}</div>
              <div className="sc-lb">{c.lb}</div>
              <div className="sc-vl">{c.vl}</div>
              <div className="sc-nt">{c.sb}</div>
            </div>
          ))}
        </div>
        <div className="cc">
          <div className="cc-hd"><span className="cc-tt">Category Spending Rank</span></div>
          {catData.map((c,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:"1px solid var(--b0)"}}>
              <div style={{width:21,height:21,borderRadius:6,background:"var(--b0)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontFamily:"var(--fm)",color:"var(--mu)",fontWeight:600,flexShrink:0}}>#{i+1}</div>
              <div style={{fontSize:15,flexShrink:0}}>{CAT[c.name]?.icon||"💳"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontSize:12,fontWeight:600}}>{c.name}</span>
                  <span style={{fontFamily:"var(--fm)",fontSize:12,fontWeight:600}}>{fmt(c.value)}</span>
                </div>
                <div className="pb2"><div className="pf2" style={{width:`${pct(c.value,catData[0].value)}%`,background:CAT[c.name]?.clr||"#64748B"}}/></div>
              </div>
              <span style={{fontFamily:"var(--fm)",fontSize:10,color:"var(--mu)",minWidth:34,textAlign:"right"}}>{pct(c.value,sum.exp)}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ── RENDER ── */
  return(
    <div className="app">
      <style>{getCSS(darkMode)}</style>

      {/* SIDEBAR */}
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
              {!mini&&n.id===tab&&<ChevronRight size={11} style={{opacity:.4}}/>}
              {n.id==="budget"&&notifications.length>0&&!mini&&(
                <span style={{background:"var(--re)",color:"#fff",fontSize:9,fontWeight:700,width:16,height:16,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>{notifications.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sb-btm">
          {!mini&&(
            <div className="hs-mini">
              <svg width={34} height={34} viewBox="0 0 34 34">
                <circle cx={17} cy={17} r={13} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={3}/>
                <circle cx={17} cy={17} r={13} fill="none" stroke={health.total>=75?"#22c55e":health.total>=50?"#f59e0b":"#ef4444"} strokeWidth={3} strokeDasharray={`${(health.total/100)*81.68} 81.68`} strokeLinecap="round" transform="rotate(-90,17,17)" style={{transition:"stroke-dasharray 1s ease"}}/>
              </svg>
              <div style={{overflow:"hidden",whiteSpace:"nowrap"}}>
                <div style={{fontSize:10,color:"var(--mu)",letterSpacing:".5px",textTransform:"uppercase",marginBottom:2}}>Health Score</div>
                <div style={{fontFamily:"var(--fm)",fontSize:14,fontWeight:600,color:health.total>=75?"#22c55e":health.total>=50?"#f59e0b":"#ef4444"}}>{health.total}/100</div>
              </div>
            </div>
          )}
          <button className="sb-mini" onClick={()=>setMini(m=>!m)} title={mini?"Expand sidebar":"Collapse sidebar"}>
            {mini?<ChevronRight size={14}/>:<ChevronLeft size={14}/>}
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="ma">
        <header className="hdr">
          <div className="hdr-l">
            <div className="ht">{tabMeta[tab]}</div>
            <div className="hs">{tabSub[tab]}</div>
          </div>
          <div className="hdr-r">
            <div className="rel" ref={nRef}>
              <button className={`bell${notifications.length>0?" has":""}`} onClick={()=>{console.log('Bell clicked');setShowN(s=>!s);}}>
                <Bell size={14}/>
                {notifications.length>0&&<div className="nbadge">{notifications.length}</div>}
              </button>
              {showN && (
                <div className="ndrop" style={{display: 'block'}}>
                  <div className="nd-hd">{notifications.length===0?"All Clear":"Alerts"}</div>
                  {notifications.length===0 ? (
                    <div className="nd-empty">
                      <div className="nd-empty-icon">
                        <CheckCircle size={20}/>
                      </div>
                      <div className="nd-empty-title">All Clear!</div>
                      <div className="nd-empty-message">No alerts at this time. Your budgets are on track.</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ maxHeight: 300, overflowY: "auto" }}>
                        {notifications.map((n)=>(
                          <div key={n.key} className="ni">
                            <div className="ni-ic" style={{
                              background: n.type==="danger" ? "rgba(239,68,68,0.1)" : 
                                       n.type==="warning" ? "rgba(245,158,11,0.1)" : 
                                       "rgba(34,197,94,0.1)",
                              color: n.type==="danger" ? "#ef4444" : 
                                     n.type==="warning" ? "#f59e0b" : 
                                     "#22c55e"
                            }}>
                              <AlertTriangle size={16}/>
                            </div>
                            <div className="ni-content">
                              <div className="ni-title">{n.cat}</div>
                              <div className="ni-message">{n.msg}</div>
                              <div className={`ni-severity ${n.type==="danger"?"high":n.type==="warning"?"medium":"low"}`}>
                                {n.type==="danger"?"High":n.type==="warning"?"Medium":"Low"} Priority
                              </div>
                            </div>
                            <button className="ni-dismiss" onClick={(e)=>{e.stopPropagation(); dismissNotification(n.key);}}>
                              <X size={12}/>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="nd-actions">
                        <button className="nd-action" onClick={dismissAllNotifications}>
                          Dismiss All
                        </button>
                        <button className="nd-action" onClick={markAllAsRead}>
                          Mark as Read
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="time-toggle">
              <button className={`time-btn ${timeView === 'weekly' ? 'active' : ''}`} onClick={() => setTimeView('weekly')}>Weekly</button>
              <button className={`time-btn ${timeView === 'monthly' ? 'active' : ''}`} onClick={() => setTimeView('monthly')}>Monthly</button>
              <button className={`time-btn ${timeView === 'yearly' ? 'active' : ''}`} onClick={() => setTimeView('yearly')}>Yearly</button>
            </div>
            <button className="hb" onClick={xport}><Download size={12}/>Export CSV</button>
            <button className="hb" onClick={()=>setDarkMode(!darkMode)}>
              {darkMode?<Sun size={12}/>:<Moon size={12}/>}{darkMode?" Light":" Dark"}
            </button>
            <div className="rel" style={{marginRight:8}}>
              <button className="hb" onClick={()=>setReportMenu(!reportMenu)}>
                <FileText size={12}/>Reports
                <ChevronDown size={10} style={{marginLeft:4}}/>
              </button>
              {reportMenu && (
                <div className="rdrop" style={{top:"calc(100% + 8px)",right:0,width:200}}>
                  <div className="rd-hd">Generate Report</div>
                  <div className="rd-opt" onClick={()=>generateReport("week")}>📅 Weekly Report</div>
                  <div className="rd-opt" onClick={()=>generateReport("month")}>📊 Monthly Report</div>
                  <div className="rd-opt" onClick={()=>generateReport("quarter")}>📈 Quarterly Report</div>
                  <div className="rd-opt" onClick={()=>generateReport("year")}>📋 Annual Report</div>
                  <div className="rd-opt" onClick={()=>generateReport("custom")}>🎯 Custom Period</div>
                  <div className="rd-hd" style={{marginTop:8}}>Export Options</div>
                  <div className="rd-opt" onClick={()=>exportData("csv")}>📄 Export CSV</div>
                  <div className="rd-opt" onClick={()=>exportData("excel")}>📊 Export Excel</div>
                  <div className="rd-opt" onClick={()=>exportData("pdf")}>📑 Export PDF</div>
                  <div className="rd-opt" onClick={()=>exportData("json")}>🔧 Export JSON</div>
                </div>
              )}
            </div>
            <button className={`rp ${role}`} onClick={()=>setRole(r=>r==="admin"?"viewer":"admin")}>
              {role==="admin"?<Shield size={11}/>:<Eye size={11}/>}
              {role==="admin"?"Admin":"Viewer"}
              <ChevronDown size={10}/>
            </button>
          </div>
        </header>
        {role==="viewer"&&<div className="vb"><Eye size={12}/>Read-only mode — switch to Admin to manage transactions</div>}
        <div className="cnt">
          {tab==="overview"    &&vOverview()}
          {tab==="wallet"      &&vWallet()}
          {tab==="transactions"&&vTransactions()}
          {tab==="budget"      &&vBudget()}
          {tab==="insights"    &&vInsights()}
        </div>
      </div>

      {/* MODAL */}
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