import React from 'react';
import { Award, CheckCircle2, RotateCcw, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

interface Props {
  isEvalMode: boolean;
  onRestart: () => void;
  onOpenHandbook: () => void;
}

export const EndScreen: React.FC<Props> = ({
  isEvalMode,
  onRestart,
  onOpenHandbook,
}) => {
  const { isDark } = useTheme();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-12">
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className={`relative w-full max-w-lg p-8 backdrop-blur-2xl border rounded-3xl shadow-2xl overflow-hidden text-center z-10 animate-in fade-in zoom-in-95 duration-300 transition-colors duration-200 ${
        isDark
          ? 'bg-[#090d26]/90 border-indigo-500/30 shadow-indigo-950/80 text-white'
          : 'bg-white/95 border-slate-200 shadow-slate-300/80 text-slate-900'
      }`}>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-indigo-500 to-cyan-400" />

        {/* Big Trophy */}
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/20">
          <div className={`w-full h-full rounded-3xl flex items-center justify-center text-amber-400 ${
            isDark ? 'bg-[#080d27]' : 'bg-slate-900'
          }`}>
            <Award size={40} />
          </div>
        </div>

        <h2 className={`text-2xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {isEvalMode ? 'Evaluation Passed! ⚡' : 'All Levels Complete! 🏆'}
        </h2>
        <p className={`text-xs max-w-sm mx-auto mb-6 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {isEvalMode
            ? 'Congratulations! You successfully resolved all 3 random examination levels within the allotted time.'
            : 'You have mastered all 10 NetPractice levels! You now understand how IPv4 subnetting, netmasks, gateways, and routing tables really work.'}
        </p>

        {/* Skills Unlocked Grid */}
        <div className={`p-4 mb-4 border rounded-2xl text-left ${
          isDark
            ? 'bg-indigo-950/30 border-indigo-500/20'
            : 'bg-indigo-50/70 border-indigo-200'
        }`}>
          <div className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Skills Mastered
          </div>
          <div className={`grid grid-cols-2 gap-2 text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {[
              'IP Addressing & Octets',
              'CIDR & Subnet Calculations',
              'Routing Tables & Next-Hops',
              'Default Gateways (0.0.0.0/0)',
              'Switch Broadcast Domains',
              'Multi-Router Packet Forwarding',
            ].map(skill => (
              <div key={skill} className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps advice */}
        <div className={`p-4 mb-6 border rounded-2xl text-left text-xs space-y-1.5 leading-relaxed ${
          isDark
            ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-300'
            : 'bg-emerald-50/80 border-emerald-200 text-slate-700'
        }`}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            Next Networking Topics
          </div>
          <p>• BGP & OSPF dynamic routing protocols</p>
          <p>• VLANs (802.1Q) & Network segmentation</p>
          <p>• NAT & Port Forwarding</p>
          <p>• IPv6 global unicast addressing</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onOpenHandbook}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs border transition ${
              isDark
                ? 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            <BookOpen size={15} />
            <span>Open Handbook</span>
          </button>
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-950/40 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <RotateCcw size={15} />
            <span>Back to Start</span>
          </button>
        </div>
      </div>
    </div>
  );
};
