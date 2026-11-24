/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Scale, RotateCcw, Sun, Moon, IndianRupee, X } from 'lucide-react';
import { motion } from 'motion/react';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

const PRICE_OPTIONS = [100, 120, 140, 160, 200, 240, 280, 300, 320, 350, 360, 400, 440, 480, 560, 600];
const DESIRED_OPTIONS = [10, 20, 30, 40, 50, 60, 80, 100, 120, 150, 180, 200, 250, 300, 350, 400];

const getAdaptiveValueClass = (formatted: string) => {
  const len = formatted.length;
  if (len <= 5) {
    return 'text-[26px] min-[390px]:text-3xl sm:text-5xl';
  }
  if (len <= 8) {
    return 'text-xl min-[390px]:text-2xl sm:text-4xl';
  }
  return 'text-lg min-[390px]:text-xl sm:text-3xl';
};

const getAdaptiveUnitClass = (formatted: string) => {
  const len = formatted.length;
  if (len <= 5) {
    return 'text-lg min-[390px]:text-xl sm:text-3xl';
  }
  if (len <= 8) {
    return 'text-base min-[390px]:text-lg sm:text-2xl';
  }
  return 'text-sm min-[390px]:text-base sm:text-xl';
};

export default function App() {
  const [pricePerKg, setPricePerKg] = useState<string>('');
  const [desiredVal, setDesiredVal] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [hasManualTheme, setHasManualTheme] = useState<boolean>(false);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', darkMode);
    }
  }, [darkMode]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!hasManualTheme) {
        setDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [hasManualTheme]);

  const priceNum = parseFloat(pricePerKg);
  const desiredNum = parseFloat(desiredVal);

  const hasPrice = !isNaN(priceNum) && priceNum > 0;
  const hasDesired = !isNaN(desiredNum) && desiredNum > 0;

  // 1. Quantity in grams for ₹desiredVal
  const quantityCalculation = useMemo(() => {
    if (!hasPrice || !hasDesired) return null;
    const grams = (desiredNum / priceNum) * 1000;
    const formatted = Number.isInteger(grams)
      ? grams.toLocaleString('en-IN')
      : (Math.round(grams * 100) / 100).toLocaleString('en-IN', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });

    let kgText = '';
    if (grams >= 1000) {
      const kg = grams / 1000;
      kgText = `${Number.isInteger(kg) ? kg : kg.toFixed(2)} kg`;
    }

    return { grams, formatted, kgText };
  }, [hasPrice, hasDesired, priceNum, desiredNum]);

  // 2. Price in ₹ for desiredVal grams
  const priceCalculation = useMemo(() => {
    if (!hasPrice || !hasDesired) return null;
    const price = (desiredNum / 1000) * priceNum;
    const formatted = Number.isInteger(price)
      ? price.toLocaleString('en-IN')
      : (Math.round(price * 100) / 100).toLocaleString('en-IN', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });

    return { price, formatted };
  }, [hasPrice, hasDesired, priceNum, desiredNum]);

  const handleReset = () => {
    setPricePerKg('');
    setDesiredVal('');
  };

  const quantityFormatted = quantityCalculation ? quantityCalculation.formatted : '0';
  const priceFormatted = priceCalculation ? priceCalculation.formatted : '0';

  return (
    <div
      className={`min-h-dvh transition-colors duration-300 ${
        darkMode ? 'bg-[#111215] text-zinc-100' : 'bg-[#f4f5f7] text-zinc-800'
      } font-sans p-1.5 sm:p-6 lg:p-8 flex justify-center items-start selection:bg-amber-500/30`}
    >
      <div
        className={`w-full max-w-5xl rounded-2xl transition-all duration-300 ${
          darkMode
            ? 'bg-[#1a1c21] border border-[#292c34] shadow-2xl'
            : 'bg-white border border-slate-200 shadow-xl'
        } px-3 py-2.5 sm:px-7 sm:py-6 md:px-9 md:py-7`}
      >
        {/* Top Header Bar (Single-line on all screen sizes) */}
        <header className="flex items-center justify-between gap-2 pt-0 pb-2 sm:pt-0 sm:pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shadow-sm shrink-0">
              <Scale className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h1 className="text-[15px] min-[390px]:text-base sm:text-2xl font-bold tracking-tight truncate">
              Weight-Price Calculator
            </h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <PWAInstallButton darkMode={darkMode} />
            <button
              onClick={() => {
                setHasManualTheme(true);
                setDarkMode(!darkMode);
              }}
              className={`p-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border text-sm font-medium transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                darkMode
                  ? 'bg-zinc-800/80 border-zinc-700 hover:bg-zinc-700 text-zinc-200'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              <span className="hidden sm:inline text-xs">{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            <button
              onClick={handleReset}
              className={`px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border text-sm font-medium transition-all flex items-center gap-1 sm:gap-1.5 shrink-0 whitespace-nowrap ${
                darkMode
                  ? 'bg-zinc-800/80 border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 text-zinc-200'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
              }`}
              title="Reset all inputs"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[11px] sm:text-xs font-semibold">Reset</span>
            </button>
          </div>
        </header>

        {/* Main Grid: Inputs (Top on mobile / Left on desktop) and Results (Bottom on mobile / Right on desktop) */}
        <div className="mt-2.5 sm:mt-6 grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-8 lg:gap-10 items-start">
          {/* Inputs Section */}
          <section
            className={`lg:col-span-6 rounded-xl sm:rounded-2xl p-2.5 sm:p-7 transition-all ${
              darkMode ? 'bg-[#15161a] border border-[#252830]' : 'bg-slate-50/80 border border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5 sm:mb-5">
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                INPUTS
              </span>
              {(pricePerKg || desiredVal) && (
                <button
                  onClick={handleReset}
                  className={`text-[11px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border transition-all flex items-center gap-1 ${
                    darkMode
                      ? 'bg-red-500/15 border-red-500/40 text-red-400 hover:bg-red-500/25 hover:text-red-300'
                      : 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700'
                  }`}
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" /> Clear
                </button>
              )}
            </div>

            <div className="space-y-2.5 sm:space-y-7">
              {/* Field 1: Item Price per Kg */}
              <div className="space-y-1.5 sm:space-y-3">
                <label className="block text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Item Price per Kg (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                    <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="Enter rate per kg"
                    className={`w-full text-sm sm:text-lg font-bold pl-8 sm:pl-9 pr-8 py-1.5 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-all outline-none tabular-nums ${
                      darkMode
                        ? 'bg-[#1a1c22] border-[#2e323c] text-white placeholder:text-zinc-600 focus:border-amber-500/70 focus:bg-[#1f2229]'
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white'
                    }`}
                  />
                  {pricePerKg && (
                    <button
                      onClick={() => setPricePerKg('')}
                      aria-label="Clear price per kg"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Options for Price per Kg (4x4 grid on both mobile & desktop) */}
                <div className="grid grid-cols-4 gap-1 sm:gap-2 pt-0.5">
                  {PRICE_OPTIONS.map((val) => {
                    const isSelected = pricePerKg === String(val);
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setPricePerKg(String(val))}
                        className={`py-1 sm:py-2 px-1.5 sm:px-2.5 text-[11px] sm:text-xs font-bold rounded-md sm:rounded-lg border transition-all text-center tabular-nums whitespace-nowrap ${
                          isSelected
                            ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20 scale-[1.03]'
                            : darkMode
                            ? 'bg-[#1f2229] border-[#2c303a] text-zinc-300 hover:bg-[#272b35] hover:border-zinc-600'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        ₹{val}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 2: Desired Number */}
              <div className="space-y-1.5 sm:space-y-3 pt-2.5 sm:pt-6 border-t border-zinc-200/80 dark:border-zinc-800/80">
                <label className="block text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Desired Number (Rupees or Grams)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={desiredVal}
                    onChange={(e) => setDesiredVal(e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    placeholder="Enter ₹ or grams"
                    className={`w-full text-sm sm:text-lg font-bold pl-3.5 pr-8 py-1.5 sm:py-3 rounded-lg sm:rounded-xl border-2 transition-all outline-none tabular-nums ${
                      darkMode
                        ? 'bg-[#1a1c22] border-[#2e323c] text-white placeholder:text-zinc-600 focus:border-amber-500/70 focus:bg-[#1f2229]'
                        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white'
                    }`}
                  />
                  {desiredVal && (
                    <button
                      onClick={() => setDesiredVal('')}
                      aria-label="Clear desired number"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Options for Desired Number (4x4 grid on both mobile & desktop) */}
                <div className="grid grid-cols-4 gap-1 sm:gap-2 pt-0.5">
                  {DESIRED_OPTIONS.map((val) => {
                    const isSelected = desiredVal === String(val);
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setDesiredVal(String(val))}
                        className={`py-1 sm:py-2 px-1.5 sm:px-2.5 text-[11px] sm:text-xs font-bold rounded-md sm:rounded-lg border transition-all text-center tabular-nums whitespace-nowrap ${
                          isSelected
                            ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20 scale-[1.03]'
                            : darkMode
                            ? 'bg-[#1f2229] border-[#2c303a] text-zinc-300 hover:bg-[#272b35] hover:border-zinc-600'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Two Output Cards: Always Side-by-Side (Mobile & Desktop) */}
          <section className="lg:col-span-6 grid grid-cols-2 gap-2.5 sm:gap-6 lg:self-start">
            {/* Output Card 1: Quantity for ₹X */}
            <motion.div
              layout
              className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-6 lg:min-h-[340px] flex flex-col justify-between transition-all relative overflow-hidden border-2 min-w-0 ${
                darkMode
                  ? 'bg-[#1c1815] border-[#5a2e16]/80 text-zinc-100 shadow-lg shadow-orange-950/20'
                  : 'bg-[#fffaf5] border-[#fed7aa] text-zinc-800 shadow-md'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-[10px] min-[390px]:text-xs sm:text-sm font-extrabold uppercase tracking-wide text-orange-500 dark:text-orange-400 truncate">
                    QUANTITY FOR ₹{hasDesired ? desiredVal : '0'}
                  </h2>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Grams</p>

                {/* Adaptive Big Display */}
                <div className="mt-1.5 mb-2 sm:mt-6 sm:mb-8">
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span
                      className={`${getAdaptiveValueClass(
                        quantityFormatted
                      )} font-black tracking-tight tabular-nums leading-none break-all ${
                        darkMode ? 'text-white' : 'text-zinc-900'
                      }`}
                    >
                      {quantityFormatted}
                    </span>
                    <span
                      className={`${getAdaptiveUnitClass(
                        quantityFormatted
                      )} font-black text-orange-500 dark:text-orange-400 leading-none`}
                    >
                      g
                    </span>
                  </div>

                  {quantityCalculation?.kgText && (
                    <span className="inline-block mt-1 sm:mt-2 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-md bg-orange-500/10 text-orange-500 dark:text-orange-400 border border-orange-500/20 tabular-nums">
                      {quantityCalculation.kgText}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Divider & Price per Kg Label */}
              <div className="pt-1.5 sm:pt-3 border-t border-orange-500/20 text-[11px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate tabular-nums">
                {hasPrice ? `@ ₹${pricePerKg} / kg` : '@ — / kg'}
              </div>
            </motion.div>

            {/* Output Card 2: Price for X grams */}
            <motion.div
              layout
              className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-6 lg:min-h-[340px] flex flex-col justify-between transition-all relative overflow-hidden border-2 min-w-0 ${
                darkMode
                  ? 'bg-[#141b17] border-[#1b4332]/90 text-zinc-100 shadow-lg shadow-emerald-950/20'
                  : 'bg-[#f2fcf6] border-[#6ee7b7] text-zinc-800 shadow-md'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center justify-between">
                  <h2
                    className={`text-[10px] min-[390px]:text-xs sm:text-sm font-extrabold uppercase tracking-wide truncate ${
                      darkMode ? 'text-emerald-400' : 'text-emerald-700'
                    }`}
                  >
                    PRICE FOR {hasDesired ? `${desiredVal} G` : '0 G'}
                  </h2>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Amount</p>

                {/* Adaptive Big Display */}
                <div className="mt-1.5 mb-2 sm:mt-6 sm:mb-8">
                  <div className="flex items-baseline gap-0.5 sm:gap-1 flex-wrap">
                    <span
                      className={`${getAdaptiveUnitClass(priceFormatted)} font-black leading-none ${
                        darkMode ? 'text-emerald-400' : 'text-emerald-700'
                      }`}
                    >
                      ₹
                    </span>
                    <span
                      className={`${getAdaptiveValueClass(
                        priceFormatted
                      )} font-black tracking-tight tabular-nums leading-none break-all ${
                        darkMode ? 'text-white' : 'text-zinc-900'
                      }`}
                    >
                      {priceFormatted}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Divider & Price per Kg Label */}
              <div className="pt-1.5 sm:pt-3 border-t border-emerald-600/25 text-[11px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate tabular-nums">
                {hasPrice ? `@ ₹${pricePerKg} / kg` : '@ — / kg'}
              </div>
            </motion.div>
          </section>
        </div>

        {/* Footer info note */}
        <footer className="mt-2.5 sm:mt-9 pt-2 sm:pt-5 border-t border-zinc-200 dark:border-zinc-800/60 flex flex-wrap items-center justify-between text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 gap-2">
          <span>Real-time calculation on typing & quick chip selection</span>
          <span className="font-semibold">• Kishan Chourasiya •</span>
        </footer>
      </div>
      <OfflineIndicator />
    </div>
  );
}
