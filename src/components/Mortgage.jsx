import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Landmark, ArrowUpRight, ShieldCheck, Award,
  Phone, Mail, User, CheckCircle2, TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import SEO from "./Seo/SEO";

/* ------------------------------------------------------------------ */
/*  RESIDENCY RULES — UAE mortgage regulations                        */
/* ------------------------------------------------------------------ */
const RESIDENCY_RULES = {
  "UAE national": {
    minDownPercent: 15,
    maxTenure: 25,
    minRate: 3.5,
    maxRate: 5.0,
    label: "UAE National",
    flag: "🇦🇪",
  },
  "UAE resident": {
    minDownPercent: 20,
    maxTenure: 25,
    minRate: 3.75,
    maxRate: 5.5,
    label: "UAE Resident",
    flag: "🏠",
  },
  "Non resident": {
    minDownPercent: 40,
    maxTenure: 25,
    minRate: 4.25,
    maxRate: 6.5,
    label: "Non-Resident",
    flag: "🌍",
  },
};

const RESIDENCY_KEYS = Object.keys(RESIDENCY_RULES);
const MIN_PRICE = 300_000;
const MAX_PRICE = 50_000_000;

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/**
 * Standard amortization monthly payment
 * M = P · r(1+r)^n / ((1+r)^n − 1)
 */
const calcMonthlyPayment = (principal, annualRatePercent, years) => {
  const P = Number(principal);
  const r = Number(annualRatePercent) / 100 / 12;
  const n = Number(years) * 12;

  if (!P || !n || P <= 0 || n <= 0) return 0;
  if (r === 0) return P / n;

  return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
const Mortgage = () => {
  /* -------------------- State -------------------- */
  const [residency, setResidency] = useState("UAE resident");
  const [price, setPrice] = useState(1_200_000);
  const [downPayment, setDownPayment] = useState(240_000); // 20%
  const [rate, setRate] = useState(3.75);
  const [years, setYears] = useState(25);

  /* -------------------- Lead form -------------------- */
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  const rules = RESIDENCY_RULES[residency];

  /* ================================================================ */
  /*  KEY FIX: on residency change, recalc down payment from CURRENT   */
  /*           PERCENT, not from the old amount. Price stays the same. */
  /* ================================================================ */
  useEffect(() => {
    setDownPayment((prev) => {
      const minDown = Math.round((price * rules.minDownPercent) / 100);
      const currentPercent = price > 0 ? (prev / price) * 100 : rules.minDownPercent;

      // Bump up to new minimum if the user was under it
      if (currentPercent < rules.minDownPercent) return minDown;

      // Otherwise keep the same percentage against the same price
      return Math.round((currentPercent / 100) * price);
    });

    setRate((prev) => clamp(prev, rules.minRate, rules.maxRate));
  }, [residency, price, rules.minDownPercent, rules.minRate, rules.maxRate]);

  /* -------------------- Derived values -------------------- */
  const {
    monthlyPayment,
    loanAmount,
    totalInterest,
    totalPayable,
    downPaymentPercent,
  } = useMemo(() => {
    const dp = Number(downPayment) || 0;
    const p = Number(price) || 0;
    const loan = Math.max(p - dp, 0);
    const monthly = calcMonthlyPayment(loan, rate, years);
    const total = monthly * years * 12;

    return {
      monthlyPayment: monthly > 0 ? Math.round(monthly) : 0,
      loanAmount: loan,
      totalInterest: Math.max(total - loan, 0),
      totalPayable: Math.round(total),
      downPaymentPercent: p > 0 ? ((dp / p) * 100).toFixed(0) : "0",
    };
  }, [price, downPayment, rate, years]);

  /* -------------------- Handlers -------------------- */
  const handlePriceChange = useCallback(
    (val) => {
      const clamped = clamp(Number(val) || 0, MIN_PRICE, MAX_PRICE);
      setPrice(clamped);

      // Preserve down payment % relative to new price, keep >= min
      setDownPayment((prev) => {
        const currentPercent =
          price > 0 ? (prev / price) * 100 : rules.minDownPercent;
        const safePercent = Math.max(currentPercent, rules.minDownPercent);
        return Math.round((safePercent / 100) * clamped);
      });
    },
    [price, rules.minDownPercent]
  );

  const handleDownPaymentChange = (val) => {
    const minDown = (price * rules.minDownPercent) / 100;
    const maxDown = price * 0.9;
    setDownPayment(clamp(Number(val) || 0, minDown, maxDown));
  };

  const handleFormChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    // TODO: POST to your CRM
    console.log("Lead:", {
      ...form,
      residency,
      price,
      downPayment,
      rate,
      years,
      monthlyPayment,
    });
    setSubmitted(true);
  };

  /* -------------------- Render -------------------- */
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-500">
      {/* ============================= SEO ============================= */}
      <SEO
        title="UAE Mortgage Calculator | Home Loan & Refinance"
        description="Free UAE mortgage calculator. Estimate monthly payments, interest, and eligibility for UAE nationals, residents, and non-residents."
        keywords={[
          "UAE mortgage calculator",
          "Dubai home loan calculator",
          "mortgage calculator Dubai",
          "UAE home loan",
          "non-resident mortgage UAE",
          "Dubai mortgage rates",
        ]}
        url="/mortgage"
        ogTitle="UAE Mortgage Calculator | Home Loan & Refinance - HOMOGET"
        ogDescription="Estimate your monthly mortgage in seconds. Supports UAE nationals, residents, and non-residents."
      />

      {/* ============================= HERO ============================= */}
      <section className="relative flex items-center pt-8 md:pt-10 overflow-hidden min-h-[45vh] sm:min-h-[60vh] md:min-h-[85vh]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=2000"
            alt="Dubai Skyline"
            className="w-full h-full object-cover opacity-30 dark:opacity-20"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-white dark:from-neutral-950/90 dark:via-neutral-950/40 dark:to-neutral-950" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-[9px] font-black uppercase tracking-[0.2em] mb-5"
            >
              <ShieldCheck size={12} /> Home Loan & Commercial Finance
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.05] mb-4"
            >
              Mortgage <br />
              <span className="text-amber-500 italic drop-shadow-sm">Solutions</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium max-w-xl leading-relaxed mb-6"
            >
              Our expert advisors simplify the process, securing the best mortgage
              or refinancing options tailored to your needs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href="#calculator"
                className="px-6 md:px-8 py-3.5 md:py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
              >
                Calculate now <ArrowUpRight size={16} />
              </a>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-xl border border-slate-200 dark:border-white/5">
                <Award className="text-amber-500" size={18} />
                <div>
                  <p className="text-[10px] font-black dark:text-white uppercase tracking-tighter">
                    1200+ 5-Star Reviews
                  </p>
                  <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">
                    Trusted Globally
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================= STATS ============================= */}
      <section className="py-14 md:py-20 px-4 border-y border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            { label: "Years of Experience", val: "20+", desc: "Helping homeowners" },
            { label: "Google Reviews", val: "1200+", desc: "Highest rated provider" },
            { label: "Applications", val: "100k+", desc: "Expertise that delivers" },
            { label: "Bank Partners", val: "20+", desc: "Top UAE banks" },
          ].map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <h3 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-1">
                {stat.val}
              </h3>
              <p className="text-[9px] font-black uppercase tracking-widest text-amber-500 mb-1">
                {stat.label}
              </p>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================= CALCULATOR ============================= */}
      <section
        id="calculator"
        className="py-14 md:py-20 px-4 bg-slate-50 dark:bg-neutral-900/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 italic underline decoration-amber-500 decoration-4 underline-offset-8">
                Estimate Payments
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Configure your loan details to view upfront costs and eligibility.
              </p>
            </div>

            {/* Residency Toggle */}
            <div className="flex flex-wrap p-1.5 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5">
              {RESIDENCY_KEYS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  aria-pressed={residency === tab}
                  onClick={() => setResidency(tab)}
                  className={`px-3 md:px-5 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                    residency === tab
                      ? "bg-amber-500 text-black shadow-md scale-[1.03]"
                      : "text-slate-400 hover:text-slate-800 dark:hover:text-white"
                  }`}
                >
                  {RESIDENCY_RULES[tab].flag} {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            {/* -------- INPUT CONTROLS -------- */}
            <div className="lg:col-span-2 space-y-5">
              {/* Purchase Price */}
              <div className="bg-white dark:bg-neutral-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Landmark size={13} className="text-amber-500" /> Purchase Price (AED)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="w-36 text-right text-base font-black bg-transparent border-b-2 border-amber-500/40 focus:border-amber-500 outline-none dark:text-white"
                  />
                </div>
                <input
                  type="range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={50_000}
                  value={price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="w-full h-1.5 bg-slate-100 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-widest">
                  <span>AED {MIN_PRICE.toLocaleString()}</span>
                  <span>AED {MAX_PRICE.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Down Payment */}
                <div className="bg-white dark:bg-neutral-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-white/10">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Down Payment
                    </label>
                    <span className="text-[11px] font-black text-amber-500">
                      {downPaymentPercent}% · min {rules.minDownPercent}%
                    </span>
                  </div>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => handleDownPaymentChange(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-neutral-800 rounded-xl border border-slate-200 dark:border-white/5 font-bold text-base dark:text-white mb-3 outline-none focus:ring-2 ring-amber-500/40"
                  />
                  <input
                    type="range"
                    min={(price * rules.minDownPercent) / 100}
                    max={price * 0.9}
                    step={10_000}
                    value={downPayment}
                    onChange={(e) => handleDownPaymentChange(e.target.value)}
                    className="w-full h-1 bg-slate-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Interest Rate */}
                <div className="bg-white dark:bg-neutral-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-white/10">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3">
                    Interest Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min={rules.minRate}
                      max={rules.maxRate}
                      value={rate}
                      onChange={(e) =>
                        setRate(clamp(Number(e.target.value) || 0, rules.minRate, rules.maxRate))
                      }
                      className="w-full p-3 bg-slate-50 dark:bg-neutral-800 rounded-xl border border-slate-200 dark:border-white/5 font-bold text-base dark:text-white outline-none focus:ring-2 ring-amber-500/40"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-slate-400">
                      %
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-widest">
                    Range: {rules.minRate}% – {rules.maxRate}%
                  </p>
                </div>
              </div>

              {/* Loan Period */}
              <div className="bg-white dark:bg-neutral-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-white/10">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Loan Period (Years)
                  </label>
                  <span className="text-base font-black text-amber-500">
                    {years} yrs
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={rules.maxTenure}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-widest">
                  <span>1 yr</span>
                  <span>{rules.maxTenure} yrs</span>
                </div>
              </div>
            </div>

            {/* -------- STICKY RESULTS + LEAD FORM -------- */}
            <div className="lg:sticky lg:top-28 h-fit space-y-5">
              {/* Results card */}
              <div className="bg-slate-900 dark:bg-amber-500 p-6 md:p-7 rounded-3xl text-white dark:text-black shadow-2xl border border-white/10 dark:border-black/10">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-3 opacity-60 text-center">
                  Estimated Monthly Payment
                </p>
                <div className="flex flex-col items-center mb-6">
                  <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-1">
                    {monthlyPayment.toLocaleString()}
                  </h2>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    AED / Month
                  </span>
                </div>

                <div className="space-y-3 py-5 border-y border-white/10 dark:border-black/10">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="opacity-60">Down Payment</span>
                    <span>AED {Number(downPayment).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="opacity-60">Loan Amount</span>
                    <span>AED {loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="opacity-60">Total Interest</span>
                    <span>AED {totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="opacity-60">Total Payable</span>
                    <span>AED {totalPayable.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 mt-5 text-[9px] font-bold uppercase opacity-60 tracking-widest">
                  <TrendingUp size={11} />
                  Rate {rate}% · {years} years · {residency}
                </div>
              </div>

              {/* Lead form */}
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
                {submitted ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="text-amber-500 mx-auto mb-3" size={40} />
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 uppercase">
                      Thank you!
                    </h3>
                    <p className="text-slate-500 text-xs font-medium">
                      Our advisor will contact you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center mb-3">
                      Check Your Eligibility
                    </h3>

                    {/* Name */}
                    <div className="relative">
                      <User
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Full name"
                        value={form.name}
                        onChange={handleFormChange("name")}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-neutral-800 rounded-xl border border-slate-200 dark:border-white/5 font-bold text-sm dark:text-white outline-none focus:ring-2 ring-amber-500/40"
                      />
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <Mail
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleFormChange("email")}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-neutral-800 rounded-xl border border-slate-200 dark:border-white/5 font-bold text-sm dark:text-white outline-none focus:ring-2 ring-amber-500/40"
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-3 bg-slate-50 dark:bg-neutral-800 rounded-xl border border-slate-200 dark:border-white/5 font-black text-xs dark:text-white">
                        🇦🇪 +971
                      </div>
                      <div className="relative flex-1">
                        <Phone
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="50 123 4567"
                          value={form.phone}
                          onChange={handleFormChange("phone")}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-neutral-800 rounded-xl border border-slate-200 dark:border-white/5 font-bold text-sm dark:text-white outline-none focus:ring-2 ring-amber-500/40"
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-amber-500 text-black rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 mt-2"
                    >
                      Check Your Eligibility <ArrowUpRight size={14} />
                    </motion.button>

                    <p className="text-[9px] text-slate-400 text-center font-bold uppercase tracking-widest">
                      No credit impact · 100% secure
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= ADVANTAGE ============================= */}
      <section className="py-14 md:py-20 px-4 bg-white dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 italic">
              The Advantage
            </h2>
            <div className="h-1 w-20 bg-amber-500 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Unbiased and transparent advice",
                desc: "Our advisors are salaried, not commission-based, ensuring our guidance is free from bank bias.",
              },
              {
                title: "End-to-end service",
                desc: "We manage your mortgage journey from start to finish, including handling all documentation.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="group p-6 md:p-8 rounded-3xl bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-white/10 hover:border-amber-500/50 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-500 mb-5 flex items-center justify-center text-black font-black text-lg italic group-hover:scale-110 transition-transform">
                  0{i + 1}
                </div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tighter">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mortgage;