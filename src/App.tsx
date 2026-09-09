/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { EditableState, LevelConfig, SimulationResult } from './types';
import { generate_level } from './lib/levels';
import { run_all_goals } from './lib/sim';
import { solveLevel } from './lib/solver';
import { NetworkCanvas } from './components/NetworkCanvas';
import { LogsDrawer } from './components/LogsDrawer';
import { SubnetCalculatorModal } from './components/SubnetCalculatorModal';
import { CheatSheetModal } from './components/CheatSheetModal';
import { SolutionModal } from './components/SolutionModal';
import { IntroScreen } from './components/IntroScreen';
import { EndScreen } from './components/EndScreen';
import { LevelNavBar } from './components/LevelNavBar';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './context/ThemeContext';
import {
  Play,
  RotateCcw,
  Sparkles,
  Calculator,
  BookOpen,
  Download,
  Upload,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function App() {
  const { isDark } = useTheme();
  // Navigation & Mode
  const [view, setView] = useState<'intro' | 'level' | 'end'>('intro');
  const [login, setLogin] = useState<string>(() => localStorage.getItem('g_my_login') || '');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [completedLevels, setCompletedLevels] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('np_completed_levels') || '[]');
    } catch {
      return [];
    }
  });

  // Evaluation Mode State
  const [isEvalMode, setIsEvalMode] = useState<boolean>(false);
  const [evalLevels, setEvalLevels] = useState<number[]>([]);
  const [evalIndex, setEvalIndex] = useState<number>(0);
  const [evalTimeLeft, setEvalTimeLeft] = useState<number>(900); // 15 minutes

  // Per-level user edits cache
  const [levelStates, setLevelStates] = useState<Record<number, EditableState>>({});
  // Per-level simulation results
  const [simResults, setSimResults] = useState<Record<number, SimulationResult | null>>({});

  // Modals
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isHandbookOpen, setIsHandbookOpen] = useState(false);
  const [isSolutionOpen, setIsSolutionOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);

  // Hidden file input for JSON import
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Save login
  useEffect(() => {
    if (login) {
      localStorage.setItem('g_saved_login', login);
      localStorage.setItem('g_my_login', login);
    }
  }, [login]);

  // Save completed levels
  useEffect(() => {
    localStorage.setItem('np_completed_levels', JSON.stringify(completedLevels));
  }, [completedLevels]);

  // Evaluation Countdown Timer
  useEffect(() => {
    if (!isEvalMode || view !== 'level') return;
    const interval = setInterval(() => {
      setEvalTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          alert('Evaluation Time Expired (15 minutes limit). Returning to home.');
          setView('intro');
          setIsEvalMode(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isEvalMode, view]);

  // Active level config generated with seed
  const activeConfig: LevelConfig = useMemo(() => {
    const activeLogin = isEvalMode ? '' : login;
    return generate_level(currentLevel, activeLogin);
  }, [currentLevel, login, isEvalMode]);

  // Current editable state (with default fallback to raw level initial values)
  const currentEditableState: EditableState = useMemo(() => {
    if (levelStates[currentLevel]) {
      return levelStates[currentLevel];
    }
    const defaultState: EditableState = { routes: {}, ifs: {} };
    activeConfig.routes.forEach(r => {
      defaultState.routes[r.rid] = { route: r.route, gate: r.gate };
    });
    activeConfig.ifs.forEach(i => {
      defaultState.ifs[i.if] = { ip: i.ip, mask: i.mask };
    });
    return defaultState;
  }, [currentLevel, levelStates, activeConfig]);

  // Handler for updating an interface field
  const handleUpdateIf = (ifName: string, field: 'ip' | 'mask', val: string) => {
    setLevelStates(prev => {
      const current = prev[currentLevel] || {
        routes: { ...currentEditableState.routes },
        ifs: { ...currentEditableState.ifs },
      };
      return {
        ...prev,
        [currentLevel]: {
          ...current,
          ifs: {
            ...current.ifs,
            [ifName]: {
              ...(current.ifs[ifName] || { ip: '', mask: '' }),
              [field]: val,
            },
          },
        },
      };
    });
  };

  // Handler for updating a route field
  const handleUpdateRoute = (rid: string, field: 'route' | 'gate', val: string) => {
    setLevelStates(prev => {
      const current = prev[currentLevel] || {
        routes: { ...currentEditableState.routes },
        ifs: { ...currentEditableState.ifs },
      };
      return {
        ...prev,
        [currentLevel]: {
          ...current,
          routes: {
            ...current.routes,
            [rid]: {
              ...(current.routes[rid] || { route: '', gate: '' }),
              [field]: val,
            },
          },
        },
      };
    });
  };

  // Run Simulation
  const handleRunSimulation = (targetState?: EditableState) => {
    const stateToTest = targetState || currentEditableState;
    const res = run_all_goals(
      currentLevel,
      isEvalMode ? '' : login,
      isEvalMode ? evalIndex + 1 : null,
      activeConfig.goals,
      activeConfig.ifs,
      activeConfig.routes,
      activeConfig.links,
      stateToTest
    );

    setSimResults(prev => ({ ...prev, [currentLevel]: res }));

    if (res.allOk) {
      if (!completedLevels.includes(currentLevel)) {
        setCompletedLevels(prev => [...prev, currentLevel]);
      }
    } else {
      setIsLogsOpen(true);
    }
  };

  // Start Training
  const handleStartTraining = (newLogin: string) => {
    setLogin(newLogin);
    setIsEvalMode(false);
    setCurrentLevel(1);
    setView('level');
  };

  // Start Evaluation (3 random levels 6-10)
  const handleStartEvaluation = () => {
    const pool = [6, 7, 8, 9, 10];
    const picked: number[] = [];
    while (picked.length < 3) {
      const rand = pool[Math.floor(Math.random() * pool.length)];
      if (!picked.includes(rand)) picked.push(rand);
    }
    setEvalLevels(picked);
    setEvalIndex(0);
    setCurrentLevel(picked[0]);
    setIsEvalMode(true);
    setEvalTimeLeft(900); // 15 mins
    setView('level');
  };

  // Move to next evaluation round or end
  const handleNextEvalRound = () => {
    if (evalIndex + 1 < evalLevels.length) {
      const nextIdx = evalIndex + 1;
      setEvalIndex(nextIdx);
      setCurrentLevel(evalLevels[nextIdx]);
    } else {
      setView('end');
    }
  };

  // Compute Auto-Solve Solution
  const currentSolution = useMemo(() => {
    return solveLevel(activeConfig);
  }, [activeConfig]);

  // Apply Auto-Solve Solution to form
  const handleApplySolution = () => {
    const mergedState: EditableState = {
      routes: { ...currentEditableState.routes, ...currentSolution.state.routes },
      ifs: { ...currentEditableState.ifs, ...currentSolution.state.ifs },
    };

    setLevelStates(prev => ({
      ...prev,
      [currentLevel]: mergedState,
    }));

    handleRunSimulation(mergedState);
  };

  // Reset current level to original template
  const handleResetLevel = () => {
    const defaultState: EditableState = { routes: {}, ifs: {} };
    activeConfig.routes.forEach(r => {
      defaultState.routes[r.rid] = { route: r.route, gate: r.gate };
    });
    activeConfig.ifs.forEach(i => {
      defaultState.ifs[i.if] = { ip: i.ip, mask: i.mask };
    });

    setLevelStates(prev => ({ ...prev, [currentLevel]: defaultState }));
    setSimResults(prev => ({ ...prev, [currentLevel]: null }));
  };

  // Export JSON
  const handleDownloadConfig = () => {
    const exportData = {
      level: currentLevel,
      login: isEvalMode ? '' : login,
      routes: currentEditableState.routes,
      ifs: currentEditableState.ifs,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netpractice_level_${currentLevel}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.ifs || parsed.routes) {
          const newState: EditableState = {
            routes: { ...currentEditableState.routes, ...(parsed.routes || {}) },
            ifs: { ...currentEditableState.ifs, ...(parsed.ifs || {}) },
          };
          setLevelStates(prev => ({ ...prev, [currentLevel]: newState }));
          handleRunSimulation(newState);
        }
      } catch {
        alert('Invalid JSON configuration file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const currentSimResult = simResults[currentLevel] || null;

  return (
    <div className={`min-h-screen font-sans antialiased pb-24 transition-colors duration-200 ${
      isDark
        ? 'bg-[#060818] text-[#f0f4ff] selection:bg-indigo-500 selection:text-white'
        : 'bg-slate-50 text-slate-900 selection:bg-indigo-600 selection:text-white'
    }`}>
      {/* Background radial gradients */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-300 ${
        isDark
          ? 'bg-[radial-gradient(ellipse_80%_60%_at_10%_0%,rgba(99,102,241,0.12)_0%,transparent_60%),radial-gradient(ellipse_60%_50%_at_90%_10%,rgba(34,211,238,0.08)_0%,transparent_55%)]'
          : 'bg-[radial-gradient(ellipse_80%_60%_at_10%_0%,rgba(99,102,241,0.06)_0%,transparent_60%),radial-gradient(ellipse_60%_50%_at_90%_10%,rgba(14,165,233,0.05)_0%,transparent_55%)]'
      }`} />

      {/* VIEW: INTRO */}
      {view === 'intro' && (
        <IntroScreen
          initialLogin={login}
          onStartTraining={handleStartTraining}
          onStartEvaluation={handleStartEvaluation}
        />
      )}

      {/* VIEW: END SCREEN */}
      {view === 'end' && (
        <EndScreen
          isEvalMode={isEvalMode}
          onRestart={() => {
            setView('intro');
            setIsEvalMode(false);
          }}
          onOpenHandbook={() => setIsHandbookOpen(true)}
        />
      )}

      {/* VIEW: ACTIVE LEVEL */}
      {view === 'level' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-4">
          {/* Top Bar / Level Header */}
          <header className={`p-4 sm:p-5 backdrop-blur-xl border rounded-2xl shadow-xl space-y-3 transition-colors duration-200 ${
            isDark
              ? 'bg-[#090d26]/85 border-white/15 shadow-black/40'
              : 'bg-white/95 border-slate-200 shadow-slate-200/80'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Left: Level title & Login badge */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center font-black text-lg text-white shadow-md shadow-indigo-600/30">
                  {currentLevel}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`text-lg sm:text-xl font-black tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Level {currentLevel}
                    </h2>
                    {isEvalMode ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[11px] font-bold">
                        EVAL ROUND {evalIndex + 1}/3
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full border text-[11px] font-mono font-medium ${
                        isDark
                          ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                          : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      }`}>
                        login: {login || 'default'}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 max-w-2xl ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {activeConfig.description}
                  </p>
                </div>
              </div>

              {/* Right: Timer (if eval) & Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {isEvalMode && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/40 border border-amber-500/30 rounded-xl font-mono text-xs font-bold text-amber-300">
                    <Clock size={14} className="animate-spin" />
                    <span>
                      {Math.floor(evalTimeLeft / 60)}:{(evalTimeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                )}

                {/* Subnet Calc Button */}
                <button
                  onClick={() => setIsCalcOpen(true)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                      : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-300 shadow-sm'
                  }`}
                  title="Open Subnet Calculator"
                >
                  <Calculator size={15} className="text-cyan-500" />
                  <span className="hidden sm:inline">Calculator</span>
                </button>

                {/* Handbook Button */}
                <button
                  onClick={() => setIsHandbookOpen(true)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
                      : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-300 shadow-sm'
                  }`}
                  title="Open Handbook & Cheatsheet"
                >
                  <BookOpen size={15} className={isDark ? "text-indigo-400" : "text-indigo-600"} />
                  <span className="hidden sm:inline">Handbook</span>
                </button>

                {/* Auto-Fix / Solution Button */}
                <button
                  onClick={() => setIsSolutionOpen(true)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition shadow-sm ${
                    isDark
                      ? 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-indigo-500/30'
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                  }`}
                  title="Auto-fix network errors & explain solution"
                >
                  <Sparkles size={15} className={isDark ? "text-indigo-400" : "text-indigo-600"} />
                  <span>Auto-Fix</span>
                </button>

                {/* Light / Dark Mode Toggle */}
                <ThemeToggle />

                {/* Check Simulation Run */}
                <button
                  onClick={() => handleRunSimulation()}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-950/40 transition transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Play size={14} className="fill-white" />
                  <span>Check Simulation</span>
                </button>
              </div>
            </div>

            {/* Goals Checklist Strip */}
            <div className={`pt-3 border-t flex flex-wrap items-center justify-between gap-3 ${
              isDark ? 'border-white/10' : 'border-slate-200'
            }`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider mr-1 ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  Required Goals:
                </span>
                {activeConfig.goals.map(g => {
                  const goalRes = currentSimResult?.results.find(r => r.id === g.id);
                  const isOk = goalRes?.status === 1;

                  return (
                    <div
                      key={g.id}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition ${
                        isOk
                          ? isDark
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : goalRes
                          ? isDark
                            ? 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                            : 'bg-rose-50 text-rose-700 border-rose-300'
                          : isDark
                          ? 'bg-white/5 text-slate-400 border-white/10'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {isOk ? (
                        <CheckCircle2 size={13} className={isDark ? "text-emerald-400" : "text-emerald-600"} />
                      ) : (
                        <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-slate-500' : 'bg-slate-400'}`} />
                      )}
                      <span>
                        {g.src_name} {g.src} ↔ {g.dst_name} {g.dst}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Utility actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetLevel}
                  className={`flex items-center gap-1 text-[11px] font-semibold transition ${
                    isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Reset to initial values"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>

                <div className={`w-[1px] h-3 ${isDark ? 'bg-white/15' : 'bg-slate-300'}`} />

                <button
                  onClick={handleDownloadConfig}
                  className={`flex items-center gap-1 text-[11px] font-semibold transition ${
                    isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Download level config"
                >
                  <Download size={12} />
                  <span>Export</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center gap-1 text-[11px] font-semibold transition ${
                    isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Upload level config"
                >
                  <Upload size={12} />
                  <span>Import</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportConfig}
                />

                {/* Next level button on success */}
                {currentSimResult?.allOk && (
                  <button
                    onClick={() => {
                      if (isEvalMode) {
                        handleNextEvalRound();
                      } else if (currentLevel < 10) {
                        setCurrentLevel(currentLevel + 1);
                      } else {
                        setView('end');
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md animate-pulse ml-2"
                  >
                    <span>{isEvalMode ? 'Next Round' : currentLevel === 10 ? 'Finish Lab' : 'Next Level'}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Network Canvas */}
          <main>
            <NetworkCanvas
              config={activeConfig}
              editableState={currentEditableState}
              onUpdateIf={handleUpdateIf}
              onUpdateRoute={handleUpdateRoute}
            />
          </main>

          {/* Bottom Level Navigator */}
          <LevelNavBar
            currentLevel={currentLevel}
            maxLevels={10}
            completedLevels={completedLevels}
            onSelectLevel={lvl => setCurrentLevel(lvl)}
            onHome={() => setView('intro')}
            isEvalMode={isEvalMode}
          />

          {/* Collapsible Logs Drawer */}
          <LogsDrawer
            simulationResult={currentSimResult}
            isOpen={isLogsOpen}
            onToggle={() => setIsLogsOpen(o => !o)}
          />
        </div>
      )}

      {/* Modals */}
      <SubnetCalculatorModal
        isOpen={isCalcOpen}
        onClose={() => setIsCalcOpen(false)}
      />

      <CheatSheetModal
        isOpen={isHandbookOpen}
        onClose={() => setIsHandbookOpen(false)}
      />

      <SolutionModal
        isOpen={isSolutionOpen}
        onClose={() => setIsSolutionOpen(false)}
        levelNumber={currentLevel}
        solution={currentSolution}
        onApply={handleApplySolution}
      />
    </div>
  );
}
