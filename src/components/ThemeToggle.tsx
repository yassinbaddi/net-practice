/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<Props> = ({ className = '', showLabel = true }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode (currently ${theme})`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border cursor-pointer select-none active:scale-95 ${
        isDark
          ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10 shadow-sm'
          : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-300 shadow-sm shadow-slate-200'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Moon size={15} className="text-indigo-400 transition-transform duration-200 hover:rotate-12" />
          {showLabel && (
            <span className="text-[11px] font-medium tracking-wide">
              Dark
            </span>
          )}
        </>
      ) : (
        <>
          <Sun size={15} className="text-amber-500 transition-transform duration-200 hover:rotate-45" />
          {showLabel && (
            <span className="text-[11px] font-medium tracking-wide text-slate-800">
              Light
            </span>
          )}
        </>
      )}
    </button>
  );
};
