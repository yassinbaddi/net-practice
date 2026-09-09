/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  currentLevel: number;
  maxLevels?: number;
  completedLevels: number[];
  onSelectLevel: (lvl: number) => void;
  onHome: () => void;
  isEvalMode?: boolean;
}

export const LevelNavBar: React.FC<Props> = ({
  currentLevel,
  maxLevels = 10,
  completedLevels,
  onSelectLevel,
  onHome,
  isEvalMode = false,
}) => {
  const { isDark } = useTheme();
  const hasPrev = currentLevel > 1;
  const hasNext = currentLevel < maxLevels;

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-3 py-2 backdrop-blur-xl border rounded-full shadow-2xl transition-colors duration-200 ${
      isDark
        ? 'bg-[#080d27]/90 border-white/15 shadow-indigo-950/80 text-white'
        : 'bg-white/95 border-slate-300 shadow-slate-300/80 text-slate-800'
    }`}>
      {/* Home Button */}
      <button
        onClick={onHome}
        className={`p-2 rounded-full transition ${
          isDark
            ? 'text-slate-400 hover:text-white hover:bg-white/10'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title="Return to Intro"
      >
        <Home size={15} />
      </button>

      <div className={`w-[1px] h-4 ${isDark ? 'bg-white/15' : 'bg-slate-200'}`} />

      {/* Prev Level */}
      <button
        disabled={!hasPrev || isEvalMode}
        onClick={() => hasPrev && onSelectLevel(currentLevel - 1)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
          hasPrev && !isEvalMode
            ? isDark
              ? 'text-slate-200 hover:text-white hover:bg-white/10 active:scale-95'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:scale-95'
            : 'text-slate-400 cursor-not-allowed opacity-40'
        }`}
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Dots Indicator */}
      <div className="flex items-center gap-1.5 px-2">
        {Array.from({ length: maxLevels }, (_, i) => i + 1).map(lvl => {
          const isCurrent = lvl === currentLevel;
          const isDone = completedLevels.includes(lvl);

          return (
            <button
              key={lvl}
              disabled={isEvalMode}
              onClick={() => onSelectLevel(lvl)}
              title={`Level ${lvl}${isDone ? ' (Completed)' : ''}`}
              className={`rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'w-6 h-2.5 bg-indigo-500 shadow-md shadow-indigo-500/50'
                  : isDone
                  ? 'w-2.5 h-2.5 bg-emerald-500 hover:scale-125'
                  : isDark
                  ? 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                  : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
              }`}
            />
          );
        })}
      </div>

      {/* Next Level */}
      <button
        disabled={!hasNext || isEvalMode}
        onClick={() => hasNext && onSelectLevel(currentLevel + 1)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
          hasNext && !isEvalMode
            ? isDark
              ? 'text-slate-200 hover:text-white hover:bg-white/10 active:scale-95'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:scale-95'
            : 'text-slate-400 cursor-not-allowed opacity-40'
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
