import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  Scale, 
  ShieldCheck, 
  FileText, 
  Cpu, 
  Zap, 
  Download, 
  Layers, 
  Code2, 
  ExternalLink,
  ChevronRight,
  Bot,
  Activity,
  History,
  Settings,
  Flame,
  ShieldAlert,
  BarChart3
} from 'lucide-react';
import ThreeRobot from '../components/ThreeRobot';
import { useAuth } from '../context/AuthContext';
import VisualParityBar from '../components/charts/VisualParityBar';
import VarianceTrendChart from '../components/charts/VarianceTrendChart';

const SAMPLES = {
  mismatch: {
    id: 'test-3-contractor',
    title: 'Mismatched Contractor Invoice',
    docType: 'Contractor Tax Invoice (PDF)',
    vendor: 'Apex Engineering & Cloud Contractors',
    gstin: 'GSTIN-29AAACE4910M1ZU',
    rawSnippet: `APEX ENGINEERING & CLOUD CONTRACTORS
GSTIN: 29AAACE4910M1ZU | INV-2026-884
---------------------------------------------
1. Lead Cloud Architect (40h) : ₹1,00,000.00
2. K8s Security Hardening     : ₹45,000.00
3. CI/CD Deployment Pipeline  : ₹25,000.00
---------------------------------------------
Subtotal: ₹1,70,000.00 | GST 18%: ₹30,600.00
TOTAL PAYABLE BILLED          : ₹2,18,000.00
*** ARITHMETIC DISCREPANCY DETECTED (+₹17,400) ***`,
    items: [
      { name: 'Lead Cloud Architect (40 Hours)', qty: 40, rate: '₹2,500', total: '₹1,00,000.00' },
      { name: 'Kubernetes Zero-Trust Security', qty: 1, rate: '₹45,000', total: '₹45,000.00' },
      { name: 'CI/CD Production Deployment Pipeline', qty: 1, rate: '₹25,000', total: '₹25,000.00' }
    ],
    subtotal: '₹1,70,000.00',
    tax: '₹30,600.00 (18% GST)',
    calculatedTotal: '₹2,00,600.00',
    statedTotal: '₹2,18,000.00',
    variance: '+₹17,400.00',
    hasError: true,
    errorMsg: 'Arithmetic Parity Violation: Subtotal + 18% GST equals ₹2,00,600.00. Vendor billed ₹2,18,000.00 (Overbilled by ₹17,400.00).'
  },
  receipt: {
    id: 'test-1-coffee',
    title: 'Clean Coffee Receipt',
    docType: 'Retail Store POS Receipt',
    vendor: 'Blue Tokai Coffee Roasters',
    gstin: 'GSTIN-07AAACB1294F1Z8',
    rawSnippet: `BLUE TOKAI COFFEE ROASTERS
KHAN MARKET, NEW DELHI - GSTIN-07AAACB1294F1Z8
---------------------------------------------
* 1x Specialty Espresso Beans 500g :   750.00
* 1x Cold Brew Bottle (Pack of 2)  :   420.00
* 2x Almond Butter Croissant       :   440.00
---------------------------------------------
SUBTOTAL : ₹1,610.00
GST (5%) : ₹80.50
TOTAL PAID VIA UPI : ₹1,690.50
[POLICYGUARD APPROVED - 100% RECONCILED]`,
    items: [
      { name: 'Specialty Roasted Espresso Beans', qty: 1, rate: '₹750', total: '₹750.00' },
      { name: 'Cold Brew Roast Bottle (Pack of 2)', qty: 1, rate: '₹420', total: '₹420.00' },
      { name: 'Artisanal Butter Almond Croissant', qty: 2, rate: '₹220', total: '₹440.00' }
    ],
    subtotal: '₹1,610.00',
    tax: '₹80.50 (5% GST)',
    calculatedTotal: '₹1,690.50',
    statedTotal: '₹1,690.50',
    variance: '₹0.00',
    hasError: false,
    errorMsg: 'Perfect Reconciliation: Zero arithmetic variance, 100% compliant with corporate business meal policy.'
  },
  alcohol: {
    id: 'test-2-alcohol',
    title: 'Restaurant Bill (Policy Violations)',
    docType: 'Dining & Hospitality Bill',
    vendor: 'The Oberoi Sky Lounge & Bar',
    gstin: 'GSTIN-27AAATB4912J1ZR',
    rawSnippet: `THE OBEROI SKY LOUNGE & BAR
NARIMAN POINT, MUMBAI | 2026-09-27 (SUNDAY)
---------------------------------------------
* 1x Truffle Risotto               : ₹1,650.00
* 1x Grilled Salmon Fillet         : ₹2,400.00
* 1x Glenfiddich 18yr Scotch       : ₹4,800.00
* 2x Sparkling Mineral Water       : ₹760.00
---------------------------------------------
SUBTOTAL : ₹9,610.00 | GST 18%: ₹1,729.80
TOTAL BILLED : ₹11,339.80
*** POLICYGUARD ALERT: 3 VIOLATIONS DETECTED ***`,
    items: [
      { name: 'Wild Mushroom & Truffle Risotto', qty: 1, rate: '₹1,650', total: '₹1,650.00' },
      { name: 'Norwegian Grilled Salmon Fillet', qty: 1, rate: '₹2,400', total: '₹2,400.00' },
      { name: 'Glenfiddich 18yr Single Malt Scotch', qty: 1, rate: '₹4,800', total: '₹4,800.00' }
    ],
    subtotal: '₹9,610.00',
    tax: '₹1,729.80 (18% Luxury GST)',
    calculatedTotal: '₹11,339.80',
    statedTotal: '₹11,339.80',
    variance: '₹0.00',
    hasError: true,
    errorMsg: 'PolicyGuard Warning: 3 compliance infractions detected including prohibited liquor and weekend non-business hours.'
  },
  tampering: {
    id: 'demo-4-tampering',
    title: 'Altered Invoice (Tampering Caught)',
    docType: 'Tampered Air Freight Invoice',
    vendor: 'Global Freight Logistics India',
    gstin: 'GSTIN-27AAACG0561D1ZW',
    rawSnippet: `GLOBAL FREIGHT LOGISTICS INDIA
ANDHERI EAST, MUMBAI | INV-2026-FORGED
---------------------------------------------
1. Air Freight Cargo 2x Container  : ₹90,000.00
2. Priority Customs Clearance      : ₹15,000.00
3. Cold Chain Pharma Storage       : ₹12,000.00
---------------------------------------------
Subtotal: ₹1,17,000.00 | GST 18%: ₹21,060.00
FORGED BILLED TOTAL : ₹3,45,000.00 (Spliced!)
*** TAMPER SHIELD INTEGRITY SCORE: 32/100 (HIGH RISK) ***`,
    items: [
      { name: 'Air Freight Domestic Container (2x)', qty: 2, rate: '₹45,000', total: '₹90,000.00' },
      { name: 'Priority Customs Clearance Handling', qty: 1, rate: '₹15,000', total: '₹15,000.00' },
      { name: 'Cold Chain Pharma Storage', qty: 1, rate: '₹12,000', total: '₹12,000.00' }
    ],
    subtotal: '₹1,17,000.00',
    tax: '₹21,060.00 (18% GST)',
    calculatedTotal: '₹1,38,060.00',
    statedTotal: '₹3,45,000.00',
    variance: '+₹2,06,940.00',
    hasError: true,
    errorMsg: '🚨 Tampering Alert: Visual Inconsistencies Detected in Grand Total. Digit alteration and JPEG pixel splicing verified by TamperShield.'
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { loginWithGoogle, loginWithGitHub } = useAuth();
  const [activeSampleKey, setActiveSampleKey] = useState('mismatch');
  const activeSample = SAMPLES[activeSampleKey];

  // Scroll listener for dynamic Apple-style centered logo moving up as user scrolls
  const [scrollY, setScrollY] = useState(0);
  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoTranslateY = Math.min(scrollY * 0.75, 110);
  const logoScale = Math.max(1 - scrollY * 0.002, 0.78);
  const logoGlow = Math.max(1 - scrollY * 0.004, 0.15);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-maroon-800 selection:text-white transition-colors duration-200">
      
      {/* ============================================================== */}
      {/* APPLE OS CENTERED LOGO HERO SECTION                            */}
      {/* Dynamic Maroon & White Glassmorphism Anchor                   */}
      {/* Moves up dynamically as the user scrolls up the page!         */}
      {/* ============================================================== */}
      <section className="relative pt-8 pb-4 px-4 overflow-hidden border-b border-maroon-100/70 dark:border-zinc-800/80 bg-gradient-to-b from-maroon-50/40 via-white to-white dark:from-zinc-950 dark:via-black dark:to-black transition-colors">
        
        {/* Apple-style Soft Ambient Radial Spotlight in Maroon */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[280px] bg-gradient-to-r from-maroon-800/15 via-rose-900/15 to-maroon-950/20 dark:from-maroon-800/25 dark:via-rose-900/20 dark:to-black blur-[110px] rounded-full pointer-events-none transition-opacity duration-300"
          style={{ opacity: logoGlow }}
        />

        {/* Dynamic Centered Logo Anchor - Scales & Floats Upward on Scroll */}
        <div 
          className="max-w-2xl mx-auto flex flex-col items-center justify-center text-center relative z-10 py-4 will-change-transform"
          style={{
            transform: `translateY(-${logoTranslateY}px) scale(${logoScale})`,
            transition: 'transform 80ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Glowing Glassmorphism Emblem in Royal Maroon */}
          <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="absolute -inset-1.5 bg-gradient-to-r from-maroon-800 via-rose-800 to-maroon-950 rounded-3xl blur-md opacity-60 group-hover:opacity-90 transition duration-500"></div>
            
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-white dark:bg-zinc-900 border border-maroon-200/80 dark:border-zinc-700/80 shadow-2xl flex items-center justify-center backdrop-blur-xl">
              {/* Traffic Light Dot Micro-Accents */}
              <div className="absolute top-2 left-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>

              {/* Main Emblem Icon */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-maroon-800 to-maroon-950 flex items-center justify-center text-white shadow-lg shadow-maroon-900/40 border border-maroon-700/50">
                <Scale className="w-6 h-6" />
              </div>

              {/* Status Indicator */}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              </span>
            </div>
          </div>

          {/* Centered Brand Title */}
          <div className="mt-3 space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black font-sans tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
              <span>Discrep</span>
              <span className="text-maroon-800 dark:text-rose-400">IQ</span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-maroon-100 dark:bg-maroon-950/80 text-maroon-900 dark:text-rose-300 border border-maroon-200 dark:border-maroon-800 ml-1.5 font-bold">
                Maroon Edition
              </span>
            </h2>
          </div>

          {/* Micro Scroll Hint */}
          {scrollY === 0 && (
            <div className="mt-2 text-[10px] font-mono text-slate-400 dark:text-zinc-500 animate-bounce flex items-center gap-1">
              <span>↓ Scroll down to see logo float upwards into header</span>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* CENTERED HERO: ROBOT IN CENTER & GET STARTED DIRECTLY BELOW IT */}
      {/* ============================================================== */}
      <section className="relative pt-10 pb-20 px-4 sm:px-8 border-b border-maroon-100/80 dark:border-zinc-800 bg-white dark:bg-black overflow-hidden transition-colors">
        
        {/* Soft Ambient Radial Maroon Light */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-maroon-500/10 dark:bg-maroon-900/20 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center text-center space-y-8">
          
          {/* Centered Enterprise Tag Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-maroon-50 dark:bg-maroon-950/70 border border-maroon-200 dark:border-maroon-800 text-maroon-900 dark:text-rose-300 text-xs font-mono font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-maroon-800 dark:bg-rose-400 animate-pulse"></span>
            <span>DiscrepIQ Vision AI</span>
            <span className="text-maroon-300 dark:text-zinc-700">|</span>
            <span>Automated Accounts Payable &amp; Expense Auditing</span>
          </div>

          {/* Centered Giant Hero Title */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-mono font-black text-slate-900 dark:text-white tracking-tight uppercase leading-[0.98]">
              <span className="block">THE <span className="text-maroon-800 dark:text-rose-400">NEW</span> STANDARD</span>
              <span className="block text-slate-800 dark:text-zinc-200">IN DATA ANALYSIS</span>
            </h1>
            <p className="text-base sm:text-xl font-mono text-maroon-900 dark:text-rose-300 font-bold max-w-xl mx-auto">
              Use Data to Get a 360-Degree View of Your Business
            </p>
          </div>

          {/* Centered Subtitle */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-sans leading-relaxed max-w-2xl mx-auto">
            Autonomous Accounts Payable verification powered by Gemini Vision, PolicyGuard compliance auditing, and TamperShield AI forensic manipulation detection. Eliminate fraudulent overbilling, catch alcohol and per-diem cap violations, and verify deterministic arithmetic parity before wire transfer dispatch.
          </p>

          {/* ========================================================== */}
          {/* 1. CENTERED 3D AI ROBOT (AS REQUESTED)                    */}
          {/* ========================================================== */}
          <div className="w-full max-w-md mx-auto pt-2">
            <div className="relative w-full rounded-3xl bg-white dark:bg-zinc-900 border border-maroon-200/80 dark:border-zinc-800 p-6 shadow-2xl transition-all hover:border-maroon-400 dark:hover:border-zinc-700">
              
              {/* Traffic Lights & Status */}
              <div className="flex items-center justify-between border-b border-maroon-100 dark:border-zinc-800 pb-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="ml-2 text-xs font-mono uppercase text-slate-800 dark:text-zinc-200 font-bold">
                    DiscrepBot AI Assistant
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  ONLINE
                </span>
              </div>

              {/* 3D Robot Interactive Canvas */}
              <div className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-gradient-to-b from-maroon-50/50 to-slate-100 dark:from-zinc-950 dark:to-zinc-900 border border-maroon-100 dark:border-zinc-800 relative shadow-inner">
                <ThreeRobot interactive={true} />
              </div>

              <div className="mt-4 pt-3 border-t border-maroon-100 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500 dark:text-zinc-400">Interactive 3D Sensor Core</span>
                <span className="text-[10px] text-maroon-800 dark:text-rose-400 font-bold">Ready to Audit</span>
              </div>
            </div>
          </div>

          {/* ========================================================== */}
          {/* 2. CENTERED "GET STARTED" OPTION BELOW AI ROBOT            */}
          {/* ========================================================== */}
          <div className="w-full flex flex-col items-center justify-center space-y-4 pt-2">
            
            {/* Primary Centered "Get Started" CTA Button */}
            <div className="flex flex-wrap items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-10 py-4.5 rounded-2xl bg-maroon-800 hover:bg-maroon-900 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-maroon-900/35 hover:shadow-maroon-900/50 hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
                id="hero-get-started-btn"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Judge Presets */}
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-4.5 rounded-2xl bg-white dark:bg-zinc-900 hover:bg-maroon-50 dark:hover:bg-zinc-800 border border-maroon-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:border-maroon-600 flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-maroon-800 dark:text-rose-400" />
                <span>1-Click Judge Presets</span>
              </button>

              {/* Ask DiscrepBot AI */}
              <button
                type="button"
                onClick={() => navigate('/support')}
                className="px-6 py-4.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-maroon-800 dark:text-rose-400" />
                <span>Talk to AI Bot</span>
              </button>
            </div>

            {/* Quick Google & GitHub Sign In / Sign Up Shortcuts */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs">
              <span className="text-slate-500 dark:text-zinc-400 font-mono text-[11px] font-semibold">Instant Access:</span>
              
              <button
                type="button"
                onClick={() => {
                  loginWithGoogle(false);
                  navigate('/dashboard');
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 font-semibold shadow-xs hover:border-maroon-600 cursor-pointer transition-all"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.5.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginWithGitHub(false);
                  navigate('/dashboard');
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 font-semibold shadow-xs hover:border-maroon-600 cursor-pointer transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </button>

              <Link
                to="/register"
                className="text-maroon-800 dark:text-rose-400 hover:text-maroon-900 font-bold underline underline-offset-2 ml-1"
              >
                Sign Up Free →
              </Link>
            </div>

            {/* Key Value Props Ticker */}
            <div className="pt-4 grid grid-cols-3 gap-4 max-w-lg w-full text-xs font-mono">
              <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-maroon-100 dark:border-zinc-800 shadow-xs">
                <div className="text-maroon-900 dark:text-rose-300 font-bold text-sm">PolicyGuard</div>
                <div className="text-slate-500 dark:text-zinc-400 text-[11px] mt-0.5">3 Compliance Rules</div>
              </div>
              <div className="p-3 bg-maroon-50/70 dark:bg-zinc-900 rounded-xl border border-maroon-200 dark:border-zinc-800 shadow-xs">
                <div className="text-maroon-800 dark:text-rose-400 font-bold text-sm">TamperShield</div>
                <div className="text-maroon-700 dark:text-zinc-400 text-[11px] mt-0.5">AI Forgery Detection</div>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-zinc-900 rounded-xl border border-emerald-200 dark:border-zinc-800 shadow-xs">
                <div className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">₹0.00 Variance</div>
                <div className="text-emerald-600 dark:text-zinc-400 text-[11px] mt-0.5">Deterministic Math</div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* Interactive Audit Simulator Widget */}
      <section id="playground" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Audit Simulator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            See the DiscrepIQ Engine in Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
            Click any test scenario below to watch how Vision AI inspects documents, catches math errors, and flags compliance breaches.
          </p>

          {/* Sample Switcher Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            {Object.entries(SAMPLES).map(([key, s]) => {
              const isSelected = activeSampleKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveSampleKey(key)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-maroon-800 text-white shadow-md shadow-maroon-900/30 font-bold'
                      : 'bg-white dark:bg-zinc-900 hover:bg-maroon-50/50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 border border-maroon-200/60 dark:border-zinc-800 shadow-xs'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${s.hasError ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side-by-Side Playground Card */}
        <div className="bg-white dark:bg-zinc-900 border border-maroon-100 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
          
          {/* Card Subheader */}
          <div className="px-6 py-4 bg-maroon-50/40 dark:bg-zinc-800/50 border-b border-maroon-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 dark:text-zinc-400 font-mono">Scenario:</span>
              <span className="font-bold text-slate-900 dark:text-white">{activeSample.vendor}</span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 shadow-xs">
                {activeSample.docType}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/inspect/${activeSample.id}`)}
              className="text-maroon-800 dark:text-rose-400 hover:text-maroon-900 font-mono text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Open in Full Inspector</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Split Pane: Raw Ingested vs Verified Ledger */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-zinc-800">
            
            {/* Left Column: Raw Capture (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-slate-50/60 dark:bg-zinc-900/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-400 mb-3">
                  <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200">
                    <FileText className="w-3.5 h-3.5 text-maroon-800 dark:text-rose-400" />
                    INGESTED DOCUMENT CAPTURE
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">OCR Pipeline · OK</span>
                </div>

                <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 font-mono text-xs text-slate-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed overflow-x-auto relative shadow-xs">
                  <div className="absolute top-2 right-2 text-[9px] font-mono text-slate-400 dark:text-zinc-600 uppercase font-bold">
                    Raw Printout
                  </div>
                  {activeSample.rawSnippet}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400 font-mono">
                <span>Vendor GSTIN:</span>
                <span className="text-slate-900 dark:text-zinc-200 font-semibold">{activeSample.gstin}</span>
              </div>
            </div>

            {/* Right Column: Structured Reconciled Table (7 cols) */}
            <div className="lg:col-span-7 p-6 bg-white dark:bg-zinc-900 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-zinc-400 mb-3">
                  <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200">
                    <Scale className="w-3.5 h-3.5 text-maroon-800 dark:text-rose-400" />
                    AUDITED LINE-ITEM LEDGER
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                    activeSample.hasError 
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' 
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  }`}>
                    {activeSample.hasError ? 'Discrepancy Detected' : 'Parity Balanced'}
                  </span>
                </div>

                {/* Line Items Table */}
                <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 shadow-xs">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 font-mono text-[11px] border-b border-slate-200 dark:border-zinc-800">
                      <tr>
                        <th className="px-3.5 py-2.5">Item Description</th>
                        <th className="px-3 py-2.5 text-right">Qty</th>
                        <th className="px-3 py-2.5 text-right">Unit Price</th>
                        <th className="px-3 py-2.5 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                      {activeSample.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-maroon-50/30 dark:hover:bg-zinc-900/60">
                          <td className="px-3.5 py-2.5 text-slate-800 dark:text-zinc-200 font-medium">{it.name}</td>
                          <td className="px-3 py-2.5 text-right font-mono text-slate-600 dark:text-zinc-400">{it.qty}</td>
                          <td className="px-3 py-2.5 text-right font-mono text-slate-600 dark:text-zinc-400">{it.rate}</td>
                          <td className="px-3 py-2.5 text-right font-mono text-slate-900 dark:text-zinc-100 font-bold">{it.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Totals */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                    <span>Line Item Subtotal:</span>
                    <span className="text-slate-900 dark:text-zinc-100 font-semibold">{activeSample.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                    <span>GST Calculation:</span>
                    <span className="text-slate-900 dark:text-zinc-100">{activeSample.tax}</span>
                  </div>
                  <div className="flex justify-between text-slate-800 dark:text-zinc-200 font-bold border-t border-slate-200 dark:border-zinc-800 pt-1.5">
                    <span>Calculated Fair Total:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-extrabold">{activeSample.calculatedTotal}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1">
                    <span className="text-slate-600 dark:text-zinc-400">Printed Invoice Total:</span>
                    <span className={activeSample.hasError ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                      {activeSample.statedTotal}
                    </span>
                  </div>
                </div>

                {/* Live Visual Parity Bar Graph */}
                <div className="mt-4">
                  <VisualParityBar 
                    statedTotal={parseFloat(String(activeSample.statedTotal || 0).replace(/[^0-9.]/g, ''))}
                    calculatedTotal={parseFloat(String(activeSample.calculatedTotal || 0).replace(/[^0-9.]/g, ''))}
                  />
                </div>

                {/* Dynamic Variance Notification Banner */}
                <div className={`mt-3 p-3.5 rounded-xl border text-xs font-mono ${
                  activeSample.hasError
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                }`}>
                  <div className="flex items-start gap-2.5">
                    {activeSample.hasError ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold">{activeSample.hasError ? `Audit Exception (${activeSample.variance})` : 'Zero Discrepancy Verified'}</p>
                      <p className="text-[11px] text-slate-700 dark:text-zinc-300 mt-0.5">{activeSample.errorMsg}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Card Actions */}
              <div className="mt-5 pt-3 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                  Open Inspector to edit quantities or tax rates &amp; see real-time recalculations
                </span>
                <button
                  type="button"
                  onClick={() => navigate(`/inspect/${activeSample.id}`)}
                  className="px-5 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white text-xs font-bold transition-all shadow-md shadow-maroon-900/25 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Open in Inspector</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Visual Analytics & Telemetry Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-maroon-100 dark:border-zinc-800">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-maroon-800 dark:text-rose-400 font-bold">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Autonomous Financial Telemetry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-sans">
            Visual Intelligence That Makes Audits Obvious
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
            Turn opaque receipts and invoices into crystal-clear variance trends, real-time parity meters, and automated risk heatmaps.
          </p>
        </div>

        <VarianceTrendChart />
      </section>

      {/* Feature Grid: Enterprise Maroon/White Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-maroon-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 transition-colors">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Purpose-Engineered for Accounts Payable &amp; Audit Compliance
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1">
              Deterministic OCR and tax parity verification replacing error-prone manual spreadsheets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-maroon-100 dark:border-zinc-800 shadow-sm space-y-3 transition-colors hover:border-maroon-400">
              <div className="w-10 h-10 rounded-xl bg-maroon-50 dark:bg-maroon-950 text-maroon-800 dark:text-rose-400 flex items-center justify-center border border-maroon-100 dark:border-maroon-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                PolicyGuard Compliance Shield
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
                Automated auditing against 3 corporate compliance rules: Alcohol detection, $50 per-diem meals cap, and weekend non-business hours verification.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-maroon-100 dark:border-zinc-800 shadow-sm space-y-3 transition-colors hover:border-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                TamperShield Forensics
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
                AI visual inspection detecting font rasterization mismatches, JPEG compression ghosts, and digit alignment shifts with interactive pulsating heatmaps.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-maroon-100 dark:border-zinc-800 shadow-sm space-y-3 transition-colors hover:border-emerald-400">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Deterministic Math Parity
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
                Cross-validates line-item unit prices × quantities and calculates exact Indian GST distributions (CGST, SGST, IGST) down to two decimal places.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Prominent Bottom Call-to-Action Section in Maroon */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-maroon-50/30 to-maroon-50/60 dark:from-black dark:via-zinc-950 dark:to-black border-t border-maroon-100 dark:border-zinc-800 text-center transition-colors">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-maroon-100 dark:bg-maroon-950/80 border border-maroon-200 dark:border-maroon-800 text-maroon-900 dark:text-rose-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-maroon-800 dark:text-rose-400" />
            <span>Ready to Eliminate Accounts Payable Discrepancies?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
            Start Auditing with <span className="text-maroon-800 dark:text-rose-400">DiscrepIQ</span> Today
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
            Harness multimodal Vision AI, corporate PolicyGuard compliance checks, and TamperShield forgery detection. Ingest your first document in seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              id="cta-get-started-btn"
              className="px-8 py-4 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg shadow-maroon-900/30 hover:shadow-maroon-900/50 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                loginWithGoogle(false);
                navigate('/dashboard');
              }}
              className="px-6 py-4 rounded-xl bg-white dark:bg-zinc-800 hover:bg-maroon-50 dark:hover:bg-zinc-700 border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:border-maroon-700 hover:text-maroon-800 flex items-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.5.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"/>
              </svg>
              <span>Sign In with Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                loginWithGitHub(false);
                navigate('/dashboard');
              }}
              className="px-6 py-4 rounded-xl bg-white dark:bg-zinc-800 hover:bg-maroon-50 dark:hover:bg-zinc-700 border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-100 font-bold text-xs uppercase tracking-wider transition-all shadow-xs hover:border-slate-500 hover:text-slate-900 flex items-center gap-2.5 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>Sign In with GitHub</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-maroon-100 dark:border-zinc-800 bg-white dark:bg-black text-slate-600 dark:text-zinc-400 text-xs font-mono transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">DiscrepIQ AP Audit Platform</span>
            <span>· Maroon &amp; White Edition</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="hover:text-maroon-800 dark:hover:text-rose-400 cursor-pointer">Workspace</button>
            <button onClick={() => navigate('/history')} className="hover:text-maroon-800 dark:hover:text-rose-400 cursor-pointer">Audit Ledger</button>
            <button onClick={() => navigate('/analytics')} className="hover:text-maroon-800 dark:hover:text-rose-400 cursor-pointer">Analytics</button>
            <button onClick={() => navigate('/support')} className="hover:text-maroon-800 dark:hover:text-rose-400 cursor-pointer">AI Support</button>
          </div>
        </div>
      </footer>

    </div>
  );
}


