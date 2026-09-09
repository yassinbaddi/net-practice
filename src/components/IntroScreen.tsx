/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Network, GraduationCap, Zap, Clock, Target, ArrowRight, Shield } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

interface Props {
  initialLogin: string;
  onStartTraining: (login: string) => void;
  onStartEvaluation: () => void;
}

export const IntroScreen: React.FC<Props> = ({
  initialLogin,
  onStartTraining,
  onStartEvaluation,
}) => {
  const { isDark } = useTheme();
  const [tab, setTab] = useState<'training' | 'eval'>('training');
  const [login, setLogin] = useState(initialLogin);
  const [inputError, setInputError] = useState(false);

  const handleStartTraining = () => {
    if (!login.trim()) {
      setInputError(true);
      setTimeout(() => setInputError(false), 2000);
      return;
    }
    onStartTraining(login.trim());
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-12">
      {/* Theme Toggle Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className={`relative w-full max-w-md p-8 backdrop-blur-2xl border rounded-3xl shadow-2xl overflow-hidden z-10 transition-colors duration-200 ${
        isDark
          ? 'bg-[#090d26]/85 border-white/15 shadow-black/80'
          : 'bg-white/95 border-slate-200 shadow-slate-300/70'
      }`}>
        {/* Shimmer top accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider mb-3 ${
            isDark
              ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
              : 'bg-indigo-50 border-indigo-200 text-indigo-700'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            42 Network Simulation Lab
          </div>

          <div className="w-16 h-16 mb-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/30">
            <div className={`w-full h-full rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-[#080d27] text-cyan-400' : 'bg-slate-900 text-cyan-300'
            }`}>
              <Network size={32} />
            </div>
          </div>

          <h1 className={`text-2xl font-black tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>NetPractice</h1>
          <p className={`text-xs mt-1 max-w-xs ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Master IPv4 addressing, CIDR subnets, gateway routing, and packet switches across 10 interactive levels.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className={`flex p-1 mb-6 border rounded-xl ${
          isDark ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setTab('training')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition ${
              tab === 'training'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap size={15} />
            Training
          </button>
          <button
            onClick={() => setTab('eval')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition ${
              tab === 'eval'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap size={15} />
            Evaluation
          </button>
        </div>

        {/* Training Tab */}
        {tab === 'training' && (
          <div className="space-y-4">
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-700'
              }`}>
                Intranet Login
              </label>
              <input
                type="text"
                value={login}
                onChange={e => setLogin(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleStartTraining()}
                placeholder="your-42-login (e.g. jdoe)"
                className={`w-full px-4 py-3 border rounded-xl font-mono text-sm placeholder:text-slate-400 focus:outline-none transition ${
                  isDark
                    ? 'bg-black/40 text-white placeholder:text-slate-600'
                    : 'bg-white text-slate-900 border-slate-300 shadow-sm'
                } ${
                  inputError
                    ? 'border-rose-500 ring-2 ring-rose-500/30 bg-rose-500/10'
                    : isDark
                    ? 'border-white/15 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                    : 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'
                }`}
              />
              <p className={`text-[11px] mt-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Your login seeds a unique network configuration identical to 42 school.
              </p>
            </div>

            <button
              onClick={handleStartTraining}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-sm shadow-xl shadow-indigo-950/40 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Start Training</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Evaluation Tab */}
        {tab === 'eval' && (
          <div className="space-y-4">
            <div className={`p-4 border rounded-2xl space-y-3 text-xs ${
              isDark
                ? 'bg-indigo-950/30 border-indigo-500/20'
                : 'bg-indigo-50/70 border-indigo-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  <Target size={16} />
                </div>
                <div>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>3 Random Levels</span>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Drawn randomly from Levels 6 to 10</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                }`}>
                  <Clock size={16} />
                </div>
                <div>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>15 Minutes Countdown</span>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Real exam timing and strict conditions</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <Shield size={16} />
                </div>
                <div>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No Login Required</span>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Fresh random network topologies</p>
                </div>
              </div>
            </div>

            <button
              onClick={onStartEvaluation}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-xl shadow-amber-950/40 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Start Evaluation</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Footnote */}
        <div className={`text-center pt-5 mt-5 border-t text-[10px] ${
          isDark ? 'border-white/10 text-slate-500' : 'border-slate-200 text-slate-400'
        }`}>
          All addresses and topologies shown are simulated and fictitious.
        </div>
      </div>
    </div>
  );
};
