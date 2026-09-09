/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Sparkles, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { LevelSolution } from '../lib/solver';
import { useTheme } from '../context/ThemeContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  levelNumber: number;
  solution: LevelSolution;
  onApply: () => void;
}

export const SolutionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  levelNumber,
  solution,
  onApply,
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full max-w-lg border rounded-2xl shadow-2xl overflow-hidden transition-colors duration-200 ${
        isDark
          ? 'bg-[#090d24] border-indigo-500/40 text-[#f0f4ff] shadow-indigo-950/70'
          : 'bg-white border-slate-300 text-slate-900 shadow-slate-400/50'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark
            ? 'border-white/10 bg-gradient-to-r from-indigo-950/40 to-purple-950/30'
            : 'border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl border ${
              isDark
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                : 'bg-indigo-100 text-indigo-700 border-indigo-200'
            }`}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-wide flex items-center gap-2">
                Level {levelNumber} Solution & Guide
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Step-by-step fix for network errors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          {/* Explanations */}
          <div className={`p-4 border rounded-xl space-y-2 ${
            isDark
              ? 'bg-indigo-950/30 border-indigo-500/20'
              : 'bg-indigo-50/70 border-indigo-200'
          }`}>
            <div className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2 text-sm">
              <Lightbulb size={16} /> Networking Concepts & Errors Fixed:
            </div>
            <ul className={`space-y-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {solution.explanation.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Config Changes Preview */}
          <div className="space-y-3">
            <div className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Computed Configuration:
            </div>

            {/* Interface overrides */}
            {Object.keys(solution.state.ifs).length > 0 && (
              <div className={`p-3 border rounded-xl space-y-1.5 font-mono text-[11px] ${
                isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider mb-1">
                  Interfaces
                </div>
                {Object.entries(solution.state.ifs).map(([name, data]) => {
                  const ifData = data as { ip?: string; mask?: string };
                  return (
                    <div key={name} className={`flex justify-between items-center py-0.5 border-b last:border-0 ${
                      isDark ? 'border-white/5' : 'border-slate-200'
                    }`}>
                      <span className="text-cyan-700 dark:text-cyan-300 font-semibold">{name}</span>
                      <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                        IP: <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{ifData.ip || '—'}</span> | Mask: <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{ifData.mask || '—'}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Route overrides */}
            {Object.keys(solution.state.routes).length > 0 && (
              <div className={`p-3 border rounded-xl space-y-1.5 font-mono text-[11px] ${
                isDark ? 'bg-black/40 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider mb-1">
                  Routes & Gateways
                </div>
                {Object.entries(solution.state.routes).map(([rid, data]) => {
                  const routeData = data as { route?: string; gate?: string };
                  return (
                    <div key={rid} className={`flex justify-between items-center py-0.5 border-b last:border-0 ${
                      isDark ? 'border-white/5' : 'border-slate-200'
                    }`}>
                      <span className="text-purple-700 dark:text-purple-300 font-semibold">{rid}</span>
                      <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                        Route: <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{routeData.route || '—'}</span> <ArrowRight size={10} className="inline mx-1" /> Gate: <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{routeData.gate || '—'}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
          isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
              isDark ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            Close
          </button>
          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <CheckCircle size={14} />
            Apply Solution to Form
          </button>
        </div>
      </div>
    </div>
  );
};
