/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, Globe, Hash } from 'lucide-react';
import { cidr_to_int, int_to_ip, ip_to_int, mask_to_cidr, mask_to_int } from '../lib/sim';
import { useTheme } from '../context/ThemeContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialIp?: string;
  initialMask?: string;
}

export const SubnetCalculatorModal: React.FC<Props> = ({ isOpen, onClose, initialIp = '192.168.1.130', initialMask = '255.255.255.192' }) => {
  const { isDark } = useTheme();
  const [ipInput, setIpInput] = useState(initialIp);
  const [maskInput, setMaskInput] = useState(initialMask);

  if (!isOpen) return null;

  const ipInt = ip_to_int(ipInput);
  const maskInt = mask_to_int(maskInput);

  let netInt: number | null = null;
  let bcastInt: number | null = null;
  let firstInt: number | null = null;
  let lastInt: number | null = null;
  let cidr: number | null = null;
  let totalHosts = 0;
  let usableHosts = 0;
  let isPrivate = false;

  if (ipInt !== null && maskInt !== null) {
    netInt = (ipInt & maskInt) >>> 0;
    bcastInt = (netInt | (~maskInt >>> 0)) >>> 0;
    cidr = mask_to_cidr(maskInt);
    totalHosts = Math.pow(2, 32 - cidr);
    usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.max(0, totalHosts - 2);

    if (cidr <= 30) {
      firstInt = (netInt + 1) >>> 0;
      lastInt = (bcastInt - 1) >>> 0;
    } else if (cidr === 31) {
      firstInt = netInt;
      lastInt = bcastInt;
    } else {
      firstInt = netInt;
      lastInt = netInt;
    }

    const b1 = (ipInt >>> 24) & 255;
    const b2 = (ipInt >>> 16) & 255;
    isPrivate = (b1 === 10) || (b1 === 172 && b2 >= 16 && b2 <= 31) || (b1 === 192 && b2 === 168);
  }

  const toBinary = (val: number | null) => {
    if (val === null) return '—';
    const b1 = ((val >>> 24) & 255).toString(2).padStart(8, '0');
    const b2 = ((val >>> 16) & 255).toString(2).padStart(8, '0');
    const b3 = ((val >>> 8) & 255).toString(2).padStart(8, '0');
    const b4 = (val & 255).toString(2).padStart(8, '0');
    return `${b1}.${b2}.${b3}.${b4}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full max-w-xl border rounded-2xl shadow-2xl overflow-hidden transition-colors duration-200 ${
        isDark
          ? 'bg-[#090d24] border-indigo-500/30 text-[#f0f4ff] shadow-indigo-950/60'
          : 'bg-white border-slate-300 text-slate-900 shadow-slate-400/50'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${
              isDark
                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}>
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-wide">Subnet Calculator</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Quick IPv4 & CIDR range inspector
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

        {/* Inputs */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                IP Address
              </label>
              <input
                type="text"
                value={ipInput}
                onChange={e => setIpInput(e.target.value)}
                placeholder="e.g. 192.168.1.130"
                className={`w-full px-3.5 py-2.5 border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition ${
                  isDark
                    ? 'bg-black/40 border-white/15 text-white focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white'
                }`}
              />
            </div>
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Netmask / CIDR
              </label>
              <input
                type="text"
                value={maskInput}
                onChange={e => setMaskInput(e.target.value)}
                placeholder="e.g. 255.255.255.192 or /26"
                className={`w-full px-3.5 py-2.5 border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition ${
                  isDark
                    ? 'bg-black/40 border-white/15 text-white focus:border-indigo-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600 focus:bg-white'
                }`}
              />
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 items-center pt-1">
            <span className={`text-[11px] uppercase font-semibold mr-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Presets:</span>
            {['/24', '/25', '/26', '/27', '/28', '/30'].map(p => (
              <button
                key={p}
                onClick={() => setMaskInput(p)}
                className={`px-2.5 py-1 text-xs font-mono rounded-md border transition ${
                  isDark
                    ? 'bg-white/5 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 border-white/10'
                    : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          {ipInt !== null && maskInt !== null && netInt !== null && bcastInt !== null && cidr !== null ? (
            <div className={`space-y-3 pt-3 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className={`p-3 border rounded-xl ${
                  isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>CIDR Notation</div>
                  <div className="text-base font-mono font-bold text-indigo-600 dark:text-indigo-400">/{cidr}</div>
                </div>
                <div className={`p-3 border rounded-xl ${
                  isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Subnet Mask</div>
                  <div className="text-sm font-mono font-semibold text-emerald-600 dark:text-emerald-400">{int_to_ip(maskInt)}</div>
                </div>
                <div className={`p-3 border rounded-xl col-span-2 sm:col-span-1 ${
                  isDark ? 'bg-white/[0.03] border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Scope</div>
                  <div className="text-xs font-semibold flex items-center gap-1.5 mt-0.5">
                    {isPrivate ? (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1"><ShieldCheck size={14} /> RFC 1918 Private</span>
                    ) : (
                      <span className="text-sky-600 dark:text-sky-400 flex items-center gap-1"><Globe size={14} /> Public IP</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={`p-3.5 border rounded-xl space-y-2 font-mono text-xs ${
                isDark
                  ? 'bg-indigo-950/20 border-indigo-500/20'
                  : 'bg-indigo-50/50 border-indigo-100'
              }`}>
                <div className={`flex justify-between items-center py-1 border-b ${isDark ? 'border-white/5' : 'border-slate-200/60'}`}>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Network ID:</span>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{int_to_ip(netInt)}</span>
                </div>
                <div className={`flex justify-between items-center py-1 border-b ${isDark ? 'border-white/5' : 'border-slate-200/60'}`}>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Broadcast IP:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{int_to_ip(bcastInt)}</span>
                </div>
                <div className={`flex justify-between items-center py-1 border-b ${isDark ? 'border-white/5' : 'border-slate-200/60'}`}>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Usable Range:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {firstInt !== null && lastInt !== null ? `${int_to_ip(firstInt)} — ${int_to_ip(lastInt)}` : '—'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Usable Hosts:</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">{usableHosts.toLocaleString()} hosts</span>
                </div>
              </div>

              {/* Binary breakdown */}
              <div className={`p-3 border rounded-xl font-mono text-[11px] space-y-1 ${
                isDark ? 'bg-black/30 border-white/5' : 'bg-slate-100/70 border-slate-200'
              }`}>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>IP Bin:</span>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{toBinary(ipInt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Mask Bin:</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{toBinary(maskInt)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-6 text-center border rounded-xl text-xs ${
              isDark
                ? 'text-rose-400 bg-rose-950/20 border-rose-500/20'
                : 'text-rose-700 bg-rose-50 border-rose-200'
            }`}>
              Please enter a valid IPv4 address (e.g. 192.168.1.1) and standard netmask (e.g. 255.255.255.0 or /24).
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
