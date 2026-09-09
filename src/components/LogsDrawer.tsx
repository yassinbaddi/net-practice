import React, { useState } from 'react';
import { Terminal, ChevronUp, ChevronDown, CheckCircle2, XCircle, Copy, Check } from 'lucide-react';
import { SimulationResult } from '../types';
import { useTheme } from '../context/ThemeContext';

interface Props {
  simulationResult: SimulationResult | null;
  isOpen: boolean;
  onToggle: () => void;
}

export const LogsDrawer: React.FC<Props> = ({
  simulationResult,
  isOpen,
  onToggle,
}) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const copyLogs = () => {
    if (!simulationResult) return;
    // Strip HTML tags for clean clipboard text
    const text = simulationResult.logs.replace(/<[^>]*>/g, '');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`fixed bottom-0 right-0 transition-all duration-300 ease-in-out border-l border-t backdrop-blur-xl shadow-2xl hover:z-45 ${
        isDark
          ? 'border-white/15 bg-[#05081b]/95 text-slate-100'
          : 'border-slate-300 bg-white/95 text-slate-900 shadow-slate-400/40'
      } ${
        isOpen
          ? 'w-full md:w-[480px] lg:w-[540px] h-[360px] sm:h-[420px] rounded-tl-2xl z-45'
          : 'w-full md:w-[320px] h-11 rounded-tl-xl z-30'
      }`}
    >
      {/* Drawer Header / Bar */}
      <div
        onClick={onToggle}
        className={`flex items-center justify-between px-4 h-11 cursor-pointer transition select-none border-b ${
          isDark
            ? 'bg-white/[0.04] hover:bg-white/[0.07] border-white/10'
            : 'bg-slate-100 hover:bg-slate-200/80 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span className={`text-xs font-bold uppercase tracking-wider ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            Simulation Console
          </span>
          {simulationResult && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                simulationResult.allOk
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
              }`}
            >
              {simulationResult.allOk ? 'ALL GOALS OK' : 'ERRORS DETECTED'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isOpen && simulationResult && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyLogs();
              }}
              className={`p-1 rounded transition ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/10'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Copy plain logs"
            >
              {copied ? <Check size={14} className="text-emerald-500 dark:text-emerald-400" /> : <Copy size={14} />}
            </button>
          )}
          <button className={`transition ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
            {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {/* Drawer Content */}
      {isOpen && (
        <div className="flex flex-col h-[calc(100%-44px)] p-4 overflow-hidden text-xs">
          {simulationResult ? (
            <>
              {/* Goals Status Pills */}
              <div className={`flex flex-wrap gap-1.5 pb-3 border-b shrink-0 ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                {simulationResult.results.map(r => (
                  <div
                    key={r.id}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono font-medium border ${
                      r.status === 1
                        ? isDark
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : isDark
                          ? 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                          : 'bg-rose-50 text-rose-700 border-rose-300'
                    }`}
                  >
                    {r.status === 1 ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    <span>Goal {r.id}: {r.status === 1 ? 'OK' : 'KO'}</span>
                  </div>
                ))}
              </div>

              {/* Terminal Logs Output */}
              <div
                className={`flex-1 mt-3 p-3 border rounded-xl overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1 selection:bg-indigo-500 selection:text-white ${
                  isDark
                    ? 'bg-black/60 border-white/10 text-slate-300'
                    : 'bg-slate-900 border-slate-700 text-slate-200'
                }`}
                dangerouslySetInnerHTML={{ __html: simulationResult.logs.replace(/\n/g, '<br/>') }}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
              <Terminal size={28} className={isDark ? 'text-slate-600' : 'text-slate-400'} />
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Click "Check Simulation" to run network packet validation.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
