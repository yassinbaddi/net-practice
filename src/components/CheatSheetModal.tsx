/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, AlertTriangle, Network, Key } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CIDR_TABLE = [
  { cidr: '/8', mask: '255.0.0.0', block: 16777216, hosts: 16777214 },
  { cidr: '/16', mask: '255.255.0.0', block: 65536, hosts: 65534 },
  { cidr: '/24', mask: '255.255.255.0', block: 256, hosts: 254 },
  { cidr: '/25', mask: '255.255.255.128', block: 128, hosts: 126 },
  { cidr: '/26', mask: '255.255.255.192', block: 64, hosts: 62 },
  { cidr: '/27', mask: '255.255.255.224', block: 32, hosts: 30 },
  { cidr: '/28', mask: '255.255.255.240', block: 16, hosts: 14 },
  { cidr: '/29', mask: '255.255.255.248', block: 8, hosts: 6 },
  { cidr: '/30', mask: '255.255.255.252', block: 4, hosts: 2 },
];

export const CheatSheetModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'rules' | 'cidr' | 'errors'>('rules');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full max-w-2xl max-h-[85vh] flex flex-col border rounded-2xl shadow-2xl overflow-hidden transition-colors duration-200 ${
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
              isDark ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}>
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-wide">NetPractice Networking Handbook</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Rules, CIDR masks, routing principles & common pitfalls
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

        {/* Tabs */}
        <div className={`flex border-b px-6 pt-2 ${
          isDark ? 'border-white/10 bg-black/30' : 'border-slate-200 bg-slate-100'
        }`}>
          {[
            { id: 'rules', label: 'Golden Rules', icon: CheckCircle },
            { id: 'cidr', label: 'CIDR Table', icon: Network },
            { id: 'errors', label: 'Common Pitfalls', icon: AlertTriangle },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                  active
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-300 bg-white/[0.03]'
                    : isDark
                    ? 'border-transparent text-slate-400 hover:text-slate-200'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className={`p-6 overflow-y-auto space-y-4 text-xs leading-relaxed ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className={`p-3.5 border rounded-xl space-y-1 ${
                isDark ? 'bg-indigo-950/30 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'
              }`}>
                <div className="font-bold text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                  <Key size={15} /> Core Networking Principles
                </div>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Keep these 6 rules in mind to solve all 10 levels with 100% confidence.
                </p>
              </div>

              <div className="grid gap-3">
                <div className={`p-3 border rounded-xl ${
                  isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>1. Direct Subnet Matching</div>
                  <div>Devices connected via a switch or direct cable must share the same network address and netmask. For example, if Machine A has <code className="text-cyan-600 dark:text-cyan-300 font-mono">192.168.1.5/24</code>, Machine B must be in <code className="text-cyan-600 dark:text-cyan-300 font-mono">192.168.1.X/24</code>.</div>
                </div>

                <div className={`p-3 border rounded-xl ${
                  isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>2. Network ID & Broadcast IP are Reserved</div>
                  <div>In any subnet, the very first address is the Network ID (all host bits 0) and the very last is Broadcast (all host bits 1). You cannot assign either to an interface.</div>
                </div>

                <div className={`p-3 border rounded-xl ${
                  isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>3. Router Subnet Non-Overlap</div>
                  <div>Each interface on a single router must belong to a strictly separate, non-overlapping subnet. If R11 is <code className="text-amber-600 dark:text-amber-300 font-mono">10.0.0.1/25</code> (range 0..127), R12 cannot use any IP between 0 and 127!</div>
                </div>

                <div className={`p-3 border rounded-xl ${
                  isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>4. Gateway Must Be on the Local Subnet</div>
                  <div>A host's default gateway (or next-hop) must be directly reachable on that host's local network without going through any other router.</div>
                </div>

                <div className={`p-3 border rounded-xl ${
                  isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>5. Internet Does Not Route Private Subnets</div>
                  <div>RFC 1918 private subnets (<code className="text-emerald-600 dark:text-emerald-300 font-mono">10.0.0.0/8</code>, <code className="text-emerald-600 dark:text-emerald-300 font-mono">172.16.0.0/12</code>, <code className="text-emerald-600 dark:text-emerald-300 font-mono">192.168.0.0/16</code>) are discarded if forwarded through the public Internet node without NAT.</div>
                </div>

                <div className={`p-3 border rounded-xl ${
                  isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>6. No Loopback 127.0.0.0/8 on Outside Interfaces</div>
                  <div>Addresses in 127.0.0.0/8 are reserved exclusively for the local machine loopback (localhost). Any appearance on an interface card triggers a fatal error.</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cidr' && (
            <div className="space-y-4">
              <div className={`overflow-x-auto rounded-xl border ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className={`uppercase tracking-wider border-b ${
                    isDark ? 'bg-white/5 text-slate-400 border-white/10' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    <tr>
                      <th className="p-2.5">CIDR</th>
                      <th className="p-2.5">Subnet Mask</th>
                      <th className="p-2.5">Block Size</th>
                      <th className="p-2.5">Usable Hosts</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-200'}`}>
                    {CIDR_TABLE.map(row => (
                      <tr key={row.cidr} className={isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}>
                        <td className="p-2.5 font-bold text-indigo-600 dark:text-indigo-400">{row.cidr}</td>
                        <td className={`p-2.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>{row.mask}</td>
                        <td className="p-2.5 text-cyan-600 dark:text-cyan-300">{row.block.toLocaleString()}</td>
                        <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-semibold">{row.hosts.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={`p-3.5 border rounded-xl space-y-2 ${
                isDark ? 'bg-white/[0.02] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>RFC 1918 Private Ranges:</div>
                <div className={`space-y-1 font-mono text-[11px] ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  <div>• <b className="text-indigo-600 dark:text-indigo-400">Class A:</b> 10.0.0.0/8 (10.0.0.0 — 10.255.255.255)</div>
                  <div>• <b className="text-indigo-600 dark:text-indigo-400">Class B:</b> 172.16.0.0/12 (172.16.0.0 — 172.31.255.255)</div>
                  <div>• <b className="text-indigo-600 dark:text-indigo-400">Class C:</b> 192.168.0.0/16 (192.168.0.0 — 192.168.255.255)</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'errors' && (
            <div className="space-y-3">
              <div className={`p-3 border rounded-xl ${
                isDark ? 'bg-rose-950/20 border-rose-500/20' : 'bg-rose-50 border-rose-200'
              }`}>
                <div className="font-bold text-rose-600 dark:text-rose-300 mb-1">Mask with holes (e.g. 255.255.255.32)</div>
                <div>A subnet mask MUST consist of consecutive 1-bits followed by consecutive 0-bits. 32 in binary is <code className="text-rose-700 dark:text-rose-200 font-mono">00100000</code>, which is not valid. The correct mask with a block size of 32 is <code className="text-emerald-700 dark:text-emerald-300 font-mono">255.255.255.224</code> (/27).</div>
              </div>

              <div className={`p-3 border rounded-xl ${
                isDark ? 'bg-amber-950/20 border-amber-500/20' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="font-bold text-amber-600 dark:text-amber-300 mb-1">Double dot typo (e.g. 10..0.0.0/8)</div>
                <div>In Level 5, the route contains an extra dot (<code className="text-amber-700 dark:text-amber-200 font-mono">10..0.0.0/8</code>). Replace with <code className="text-emerald-700 dark:text-emerald-300 font-mono">default</code> or <code className="text-emerald-700 dark:text-emerald-300 font-mono">0.0.0.0/0</code>.</div>
              </div>

              <div className={`p-3 border rounded-xl ${
                isDark ? 'bg-sky-950/20 border-sky-500/20' : 'bg-sky-50 border-sky-200'
              }`}>
                <div className="font-bold text-sky-600 dark:text-sky-300 mb-1">Return Route on Internet Router</div>
                <div>Communication is always two-way! Even if packet reaches Internet from Host A, Internet needs a routing table entry pointing back towards Host A's subnet via the router's public interface.</div>
              </div>

              <div className={`p-3 border rounded-xl ${
                isDark ? 'bg-purple-950/20 border-purple-500/20' : 'bg-purple-50 border-purple-200'
              }`}>
                <div className="font-bold text-purple-600 dark:text-purple-300 mb-1">Default Route keyword</div>
                <div>You can type either <code className="text-purple-700 dark:text-purple-300 font-mono">default</code> or <code className="text-purple-700 dark:text-purple-300 font-mono">0.0.0.0/0</code> for catch-all default routing entries.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
