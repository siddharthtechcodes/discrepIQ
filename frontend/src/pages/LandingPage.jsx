import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  ShieldCheck,
  BarChart3,
  Zap,
  Upload,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VarianceTrendChart from '../components/charts/VarianceTrendChart';

const SAMPLES = {
  mismatch: {
    title: 'Contractor Bill (Math Error)',
    docType: 'Tax Invoice',
    vendor: 'Apex Cloud Contractors',
    items: [
      { name: 'Lead Cloud Architect (40 hrs)', qty: 40, rate: '₹2,500', total: '₹1,00,000' },
      { name: 'Kubernetes Security Hardening', qty: 1, rate: '₹45,000', total: '₹45,000' },
      { name: 'CI/CD Production Deployment', qty: 1, rate: '₹25,000', total: '₹25,000' },
    ],
    calculatedTotal: 200600,
    statedTotal: 218000,
    hasError: true,
    errorMsg: 'Items + 18% GST = ₹2,00,600 but invoice billed ₹2,18,000. Overcharged by ₹17,400.',
  },
  receipt: {
    title: 'Coffee Receipt (Clean)',
    docType: 'Store Receipt',
    vendor: 'Blue Tokai Coffee',
    items: [
      { name: 'Specialty Espresso Beans', qty: 1, rate: '₹750', total: '₹750' },
      { name: 'Cold Brew Pack (x2)', qty: 1, rate: '₹420', total: '₹420' },
      { name: 'Almond Croissant', qty: 2, rate: '₹220', total: '₹440' },
    ],
    calculatedTotal: 1690.5,
    statedTotal: 1690.5,
    hasError: false,
    errorMsg: 'Math is 100% correct. Complies with company meal policy.',
  },
  policy: {
    title: 'Restaurant Bill (Policy Violation)',
    docType: 'Dining Receipt',
    vendor: 'The Oberoi Lounge',
    items: [
      { name: 'Wild Mushroom Truffle Risotto', qty: 1, rate: '₹1,650', total: '₹1,650' },
      { name: 'Norwegian Grilled Salmon', qty: 1, rate: '₹2,400', total: '₹2,400' },
      { name: 'Glenfiddich 18yr Scotch', qty: 1, rate: '₹4,800', total: '₹4,800' },
    ],
    calculatedTotal: 11339.8,
    statedTotal: 11339.8,
    hasError: true,
    errorMsg: 'Alcohol charges detected (₹4,800). Policy violation — alcohol not reimbursable.',
  },
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeSample, setActiveSample] = useState('mismatch');
  const sample = SAMPLES[activeSample];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleTryDemo = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col">

      {/* Hero */}
      <section className="border-b border-zinc-200 py-16 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Invoice & Expense Auditor — Powered by Gemini AI
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 leading-tight tracking-tight">
            Catch billing errors<br/>
            <span className="text-zinc-500">before you pay.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-500 max-w-xl mx-auto leading-relaxed">
            Upload any invoice or receipt. We verify line-item math, tax rates, and expense policy rules in under 2 seconds.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              id="hero-get-started-btn"
              onClick={handleGetStarted}
              className="px-7 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-700 text-white font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              id="hero-demo-btn"
              onClick={handleTryDemo}
              className="px-7 py-3.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Try Demo
            </button>
          </div>

          {/* Quick value props */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free to use</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Results in 2 seconds</span>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-zinc-200 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '₹4.8M+', label: 'Errors intercepted' },
            { value: '99.8%', label: 'Math accuracy' },
            { value: '< 2s', label: 'Audit time' },
            { value: '200+', label: 'Finance teams' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl font-black font-mono text-zinc-900">{stat.value}</div>
              <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo */}
      <section className="py-14 px-4 sm:px-8 border-b border-zinc-200">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900">See it in action</h2>
            <p className="text-sm text-zinc-500">Pick an invoice type below to see how errors are detected:</p>
          </div>

          {/* Sample picker */}
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(SAMPLES).map(([key, s]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveSample(key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeSample === key
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>

          {/* Sample card */}
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 bg-zinc-50">
              <div>
                <span className="font-semibold text-sm text-zinc-900">{sample.vendor}</span>
                <span className="text-zinc-400 mx-2">·</span>
                <span className="text-xs text-zinc-500">{sample.docType}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                sample.hasError
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {sample.hasError ? 'Error Found' : 'Verified ✓'}
              </span>
            </div>

            {/* Line items */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-zinc-500 bg-zinc-50 border-b border-zinc-100">
                  <tr>
                    <th className="px-5 py-2.5 text-left font-medium">Item</th>
                    <th className="px-5 py-2.5 text-right font-medium">Qty</th>
                    <th className="px-5 py-2.5 text-right font-medium">Rate</th>
                    <th className="px-5 py-2.5 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {sample.items.map((item, i) => (
                    <tr key={i} className="hover:bg-zinc-50">
                      <td className="px-5 py-2.5 text-zinc-700 text-xs">{item.name}</td>
                      <td className="px-5 py-2.5 text-right font-mono text-xs text-zinc-500">{item.qty}</td>
                      <td className="px-5 py-2.5 text-right font-mono text-xs text-zinc-500">{item.rate}</td>
                      <td className="px-5 py-2.5 text-right font-mono text-xs font-medium text-zinc-900">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals comparison */}
            <div className="px-5 py-4 border-t border-zinc-100 bg-zinc-50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-600">Our calculated total</span>
                <span className="font-mono font-semibold text-emerald-700">
                  ₹{sample.calculatedTotal.toLocaleString('en-IN')}
                </span>
              </div>
              {sample.statedTotal !== sample.calculatedTotal && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-600">Invoice billed total</span>
                  <span className="font-mono font-semibold text-amber-700">
                    ₹{sample.statedTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>

            {/* Result banner */}
            <div className={`px-5 py-3.5 border-t flex items-start gap-2.5 text-xs ${
              sample.hasError
                ? 'bg-red-50 border-red-100'
                : 'bg-emerald-50 border-emerald-100'
            }`}>
              {sample.hasError
                ? <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                : <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              }
              <span className={sample.hasError ? 'text-red-800' : 'text-emerald-800'}>
                <strong>Result: </strong>{sample.errorMsg}
              </span>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleGetStarted}
              className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-700 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Audit Your Invoices →
            </button>
          </div>
        </div>
      </section>

      {/* Trend chart */}
      <section className="py-14 px-4 sm:px-8 border-b border-zinc-200">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900">Audit Trends at a Glance</h2>
            <p className="text-sm text-zinc-500">Compare billed amounts vs verified totals over time</p>
          </div>
          <VarianceTrendChart />
        </div>
      </section>

      {/* Features */}
      <section className="py-14 px-4 sm:px-8 bg-zinc-50 border-b border-zinc-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900">Built for Accounts Payable</h2>
            <p className="text-sm text-zinc-500">Stop overpaying vendors. Catch errors before they become losses.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Scale,
                title: 'Math Verification',
                desc: 'Recalculates every line item, subtotal, and tax to verify the billed total is mathematically correct.'
              },
              {
                icon: ShieldCheck,
                title: 'Policy Enforcement',
                desc: 'Flags alcohol charges, over-budget meals, and weekend expense submissions automatically.'
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                desc: 'Track audit trends, vendor compliance, and discrepancy history over time with clear charts.'
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="bg-white border border-zinc-200 rounded-xl p-5 space-y-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-zinc-700" />
                </div>
                <h3 className="font-bold text-sm text-zinc-900">{title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 px-4 sm:px-8 border-b border-zinc-200">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-zinc-900">How it works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '1', icon: Upload, title: 'Upload Invoice', desc: 'Drag & drop a PDF, photo, or scanned image of any invoice or receipt.' },
              { step: '2', icon: Zap, title: 'AI Audit', desc: 'Our Gemini Vision AI reads, calculates, and checks every number against your policies.' },
              { step: '3', icon: TrendingUp, title: 'Get Results', desc: 'See exactly which line items are wrong and by how much, with a detailed audit report.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm mx-auto">
                  {step}
                </div>
                <Icon className="w-5 h-5 text-zinc-500 mx-auto" />
                <h3 className="font-bold text-sm text-zinc-900">{title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-2xl font-bold text-zinc-900">Ready to audit your invoices?</h2>
          <p className="text-sm text-zinc-500">
            Free to use. No credit card required. Setup takes 30 seconds.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              id="cta-get-started-btn"
              onClick={handleGetStarted}
              className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-700 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              Get Started Free
            </button>
            <button
              type="button"
              id="cta-sign-in-btn"
              onClick={() => navigate('/login')}
              className="px-6 py-3 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-sm transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-6 px-4 text-center text-xs text-zinc-400">
        <p>© 2026 DiscrepIQ · Invoice & Expense Audit Engine · Built for Hackathon 2026</p>
      </footer>

    </div>
  );
}
