import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  darkMode: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ darkMode }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="p-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border border-amber-500/40 bg-amber-500 text-black hover:bg-amber-400 text-sm font-bold transition-all flex items-center gap-1.5 shadow-sm shrink-0 whitespace-nowrap"
        title="Install App"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline text-xs font-bold">Install</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`p-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl border text-sm font-medium transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
            darkMode
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 hover:bg-amber-500/25'
              : 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
          }`}
          title="Install on iOS"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-semibold">Install</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div
              className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl border ${
                darkMode
                  ? 'bg-[#1a1c21] border-zinc-700 text-zinc-100'
                  : 'bg-white border-slate-200 text-zinc-900'
              }`}
            >
              <h3 className="text-lg font-bold">Install on iPhone / iPad</h3>
              <p className={`mt-2 text-sm leading-relaxed ${darkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-bold text-black hover:bg-amber-400 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
