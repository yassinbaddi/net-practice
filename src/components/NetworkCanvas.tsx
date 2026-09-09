/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { EditableState, LevelConfig, NetworkInterface, Route } from '../types';
import { DeviceIcon } from './NetworkIcons';
import { ip_to_int, mask_to_int } from '../lib/sim';
import { ZoomIn, ZoomOut, RotateCcw, Lock, Edit3, Copy, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  config: LevelConfig;
  editableState: EditableState;
  onUpdateIf: (ifName: string, field: 'ip' | 'mask', val: string) => void;
  onUpdateRoute: (rid: string, field: 'route' | 'gate', val: string) => void;
}

export const NetworkCanvas: React.FC<Props> = ({
  config,
  editableState,
  onUpdateIf,
  onUpdateRoute,
}) => {
  const { isDark } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(0.99);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [focusedCard, setFocusedCard] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = async (val: string, key: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!val) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(val);
      } else {
        const el = document.createElement('textarea');
        el.value = val;
        el.setAttribute('readonly', '');
        el.style.position = 'fixed';
        el.style.left = '-9999px';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey(prev => (prev === key ? null : prev));
      }, 1600);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Compute bounding box of all hosts to allow comfortable viewing
  const minX = Math.min(...config.hosts.map(h => h.x ?? 100), 50);
  const minY = Math.min(...config.hosts.map(h => h.y ?? 100), 50);
  const maxX = Math.max(...config.hosts.map(h => (h.x ?? 100) + (h.w ?? 200) + 260), 1200);
  const maxY = Math.max(...config.hosts.map(h => (h.y ?? 100) + (h.h ?? 200) + 260), 1200);

  const canvasWidth = Math.max(maxX + 100, 1300);
  const canvasHeight = Math.max(maxY + 100, 1100);

  return (
    <div className={`relative w-full h-[620px] sm:h-[720px] lg:h-[820px] rounded-2xl overflow-hidden shadow-2xl transition-colors duration-200 border ${
      isDark
        ? 'bg-[#050716] border-white/10 shadow-black/80'
        : 'bg-slate-100/90 border-slate-300 shadow-slate-300/40'
    }`}>
      {/* Zoom / View controls */}
      <div className={`absolute top-4 right-4 z-50 flex items-center gap-1.5 p-1.5 backdrop-blur-md rounded-xl text-xs font-semibold shadow-lg border transition ${
        isDark
          ? 'bg-black/60 border-white/15 text-slate-300'
          : 'bg-white/90 border-slate-300 text-slate-700 shadow-slate-200/80'
      }`}>
        <button
          onClick={() => setZoom(z => Math.max(0.45, z - 0.1))}
          className={`p-1.5 rounded-lg transition ${
            isDark ? 'hover:bg-white/10 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <span className={`px-2 font-mono text-[11px] select-none font-semibold ${
          isDark ? 'text-indigo-300' : 'text-indigo-600'
        }`}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(z => Math.min(1.4, z + 0.1))}
          className={`p-1.5 rounded-lg transition ${
            isDark ? 'hover:bg-white/10 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
        <div className={`w-[1px] h-4 mx-0.5 ${isDark ? 'bg-white/15' : 'bg-slate-200'}`} />
        <button
          onClick={() => setZoom(0.85)}
          className={`p-1.5 rounded-lg transition ${
            isDark ? 'hover:bg-white/10 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title="Reset Zoom"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity"
        style={{
          backgroundImage: isDark
            ? 'radial-gradient(circle, #6366f1 1px, transparent 1px)'
            : 'radial-gradient(circle, #94a3b8 1.2px, transparent 1.2px)',
          backgroundSize: '32px 32px',
          opacity: isDark ? 0.2 : 0.35,
        }}
      />

      {/* Scrollable & Scalable Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto p-6"
      >
        <div
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            transition: 'transform 0.15s ease-out',
          }}
          className="relative"
        >
          {/* SVG Links Layer */}
          <svg
            className="absolute top-0 left-0 pointer-events-none z-0"
            width={canvasWidth}
            height={canvasHeight}
          >
            <defs>
              <linearGradient id="linkGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isDark ? "#6366f1" : "#4f46e5"} stopOpacity={isDark ? "0.8" : "0.95"} />
                <stop offset="50%" stopColor={isDark ? "#38bdf8" : "#0284c7"} stopOpacity="0.95" />
                <stop offset="100%" stopColor={isDark ? "#10b981" : "#059669"} stopOpacity={isDark ? "0.8" : "0.95"} />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation={isDark ? "3" : "1.5"} result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {config.links.map((link, idx) => {
              const h1 = link.h1;
              const h2 = link.h2;
              if (!h1 || !h2) return null;

              const x1 = (h1.x ?? 0) + (h1.w ?? 200) / 2;
              const y1 = (h1.y ?? 0) + (h1.h ?? 200) / 2;
              const x2 = (h2.x ?? 0) + (h2.w ?? 200) / 2;
              const y2 = (h2.y ?? 0) + (h2.h ?? 200) / 2;

              return (
                <g key={`link-${idx}`}>
                  {/* Outer glow line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isDark ? "#4f46e5" : "#94a3b8"}
                    strokeWidth={isDark ? "7" : "6"}
                    strokeOpacity={isDark ? "0.25" : "0.35"}
                    strokeLinecap="round"
                  />
                  {/* Sharp core link */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="url(#linkGlow)"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                  {/* Subtle link label */}
                  <circle cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} r="3.5" fill={isDark ? "#22d3ee" : "#0284c7"} />
                </g>
              );
            })}
          </svg>

          {/* Hosts / Devices Layer */}
          {config.hosts.map(h => {
            const hRoutes = config.routes.filter(r => r.hid === h.id);
            const hostX = h.x ?? 100;
            const hostY = h.y ?? 100;
            const hostW = h.w ?? 200;
            const hostH = h.h ?? 200;
            const labelX = hostX + (h.lx ?? 0);
            const labelY = hostY + (h.ly ?? 200);

            return (
              <React.Fragment key={h.id}>
                {/* Device Icon on Canvas */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${hostX}px`,
                    top: `${hostY}px`,
                    width: `${hostW}px`,
                    height: `${hostH}px`,
                    zIndex: hoveredCard === `dev-${h.id}` ? 25 : 5,
                  }}
                  className="flex items-center justify-center pointer-events-none"
                >
                  <div
                    onMouseEnter={() => setHoveredCard(`dev-${h.id}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className={`device-node relative group p-4 rounded-2xl border transition shadow-xl pointer-events-auto hover:scale-105 ${
                      isDark
                        ? 'bg-indigo-950/30 border-indigo-500/20 hover:border-indigo-400/50 hover:bg-indigo-900/40 shadow-black/60'
                        : 'bg-white/95 border-slate-300 hover:border-indigo-400 hover:bg-slate-50 shadow-slate-300/60'
                    }`}
                  >
                    <DeviceIcon type={h.type} size={64} />
                    <span className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold uppercase tracking-widest shadow ${
                      isDark
                        ? 'bg-indigo-950 border-indigo-500/40 text-indigo-300'
                        : 'bg-white border-slate-300 text-indigo-700 shadow-sm'
                    }`}>
                      {h.id}
                    </span>
                  </div>
                </div>

                {/* Host Info & Routing Table Card */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${labelX}px`,
                    top: `${labelY}px`,
                    minWidth: '220px',
                    zIndex: (hoveredCard === `host-${h.id}` || focusedCard === `host-${h.id}`) ? 40 : 10,
                  }}
                  onMouseEnter={() => setHoveredCard(`host-${h.id}`)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onFocus={() => setFocusedCard(`host-${h.id}`)}
                  onBlur={() => setFocusedCard(null)}
                  className={`network-card z-10 p-3 backdrop-blur-md border rounded-xl shadow-xl pointer-events-auto transition hover:z-40 focus-within:z-40 ${
                    isDark
                      ? hoveredCard === `host-${h.id}` || focusedCard === `host-${h.id}`
                        ? 'bg-[#0a0e27]/95 border-indigo-400 shadow-2xl shadow-indigo-500/20 text-white'
                        : 'bg-[#0a0e27]/95 border-indigo-500/30 shadow-black/60 text-white'
                      : hoveredCard === `host-${h.id}` || focusedCard === `host-${h.id}`
                        ? 'bg-white/98 border-indigo-500 shadow-2xl shadow-indigo-300/50 text-slate-900'
                        : 'bg-white/98 border-slate-300 shadow-slate-300/80 text-slate-900'
                  }`}
                >
                  <div className={`text-center pb-2 mb-2 border-b ${
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {h.type} {h.id}
                    </span>
                    <h4 className={`font-bold text-xs tracking-wide ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>{h.name}</h4>
                  </div>

                  {/* Routing Table */}
                  {hRoutes.length > 0 && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center justify-between ${
                        isDark ? 'text-indigo-400' : 'text-indigo-600'
                      }`}>
                        <span>Routes</span>
                        <span className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>LPM / Ordered</span>
                      </div>

                      <div className="space-y-1.5">
                        {hRoutes.map(r => {
                          const currentRoute = editableState.routes[r.rid]?.route ?? r.route;
                          const currentGate = editableState.routes[r.rid]?.gate ?? r.gate;
                          const routeEdit = r.route_edit === 'true';
                          const gateEdit = r.gate_edit === 'true';

                          return (
                            <div
                              key={r.rid}
                              className={`p-1.5 rounded-lg space-y-1 font-mono border ${
                                isDark
                                  ? 'bg-black/40 border-white/5'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] w-11 shrink-0 ${
                                  isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'
                                }`}>Route:</span>
                                {routeEdit ? (
                                  <input
                                    type="text"
                                    value={currentRoute}
                                    onChange={e => onUpdateRoute(r.rid, 'route', e.target.value)}
                                    placeholder="0.0.0.0/0"
                                    className={`flex-1 px-2 py-0.5 rounded text-[11px] font-mono border transition focus:outline-none ${
                                      isDark
                                        ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-200 focus:border-indigo-400'
                                        : 'bg-white border-indigo-300 text-slate-900 focus:border-indigo-600 shadow-sm'
                                    }`}
                                  />
                                ) : (
                                  <div
                                    data-selectable="true"
                                    className={`flex-1 flex items-center justify-between px-2 py-0.5 font-semibold rounded border transition group/route select-text cursor-text ${
                                      isDark
                                        ? 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-200 border-white/10'
                                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-sm'
                                    }`}
                                    title="Click copy button or select text"
                                  >
                                    <span className="font-mono text-[11px] select-text cursor-text selection:bg-indigo-500/40 selection:text-white">
                                      {currentRoute}
                                    </span>
                                    <div className="flex items-center gap-1 shrink-0 ml-1.5 select-none">
                                      <button
                                        type="button"
                                        onClick={e => copyToClipboard(currentRoute, `route-dst-${r.rid}`, e)}
                                        title={copiedKey === `route-dst-${r.rid}` ? 'Copied to clipboard!' : 'Copy route'}
                                        className={`p-0.5 rounded transition ${
                                          copiedKey === `route-dst-${r.rid}`
                                            ? isDark ? 'text-emerald-400 bg-emerald-950/70' : 'text-emerald-700 bg-emerald-100'
                                            : isDark
                                            ? 'text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/20 opacity-70 group-hover/route:opacity-100'
                                            : 'text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 opacity-70 group-hover/route:opacity-100'
                                        }`}
                                      >
                                        {copiedKey === `route-dst-${r.rid}` ? (
                                          <span className={`flex items-center gap-0.5 text-[9px] font-sans font-bold ${
                                            isDark ? 'text-emerald-400' : 'text-emerald-700'
                                          }`}>
                                            <Check size={11} className="animate-in zoom-in" />
                                            Copied
                                          </span>
                                        ) : (
                                          <Copy size={11} />
                                        )}
                                      </button>
                                      <Lock size={10} className={isDark ? 'text-slate-500' : 'text-slate-400'} title="Locked" />
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className={`text-[10px] w-11 shrink-0 ${
                                  isDark ? 'text-slate-400' : 'text-slate-600 font-semibold'
                                }`}>Gate:</span>
                                {gateEdit ? (
                                  <input
                                    type="text"
                                    value={currentGate}
                                    onChange={e => onUpdateRoute(r.rid, 'gate', e.target.value)}
                                    placeholder="e.g. 192.168.1.1"
                                    className={`flex-1 px-2 py-0.5 rounded text-[11px] font-mono border transition focus:outline-none ${
                                      isDark
                                        ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-200 focus:border-indigo-400'
                                        : 'bg-white border-indigo-300 text-slate-900 focus:border-indigo-600 shadow-sm'
                                    }`}
                                  />
                                ) : (
                                  <div
                                    data-selectable="true"
                                    className={`flex-1 flex items-center justify-between px-2 py-0.5 font-semibold rounded border transition group/gate select-text cursor-text ${
                                      isDark
                                        ? 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-200 border-white/10'
                                        : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-sm'
                                    }`}
                                    title="Click copy button or select text"
                                  >
                                    <span className="font-mono text-[11px] select-text cursor-text selection:bg-indigo-500/40 selection:text-white">
                                      {currentGate || <span className={`italic font-normal font-sans text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>none</span>}
                                    </span>
                                    {currentGate && (
                                      <div className="flex items-center gap-1 shrink-0 ml-1.5 select-none">
                                        <button
                                          type="button"
                                          onClick={e => copyToClipboard(currentGate, `route-gate-${r.rid}`, e)}
                                          title={copiedKey === `route-gate-${r.rid}` ? 'Copied to clipboard!' : 'Copy gateway'}
                                          className={`p-0.5 rounded transition ${
                                            copiedKey === `route-gate-${r.rid}`
                                              ? isDark ? 'text-emerald-400 bg-emerald-950/70' : 'text-emerald-700 bg-emerald-100'
                                              : isDark
                                              ? 'text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/20 opacity-70 group-hover/gate:opacity-100'
                                              : 'text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 opacity-70 group-hover/gate:opacity-100'
                                          }`}
                                        >
                                          {copiedKey === `route-gate-${r.rid}` ? (
                                            <span className={`flex items-center gap-0.5 text-[9px] font-sans font-bold ${
                                              isDark ? 'text-emerald-400' : 'text-emerald-700'
                                            }`}>
                                              <Check size={11} className="animate-in zoom-in" />
                                              Copied
                                            </span>
                                          ) : (
                                            <Copy size={11} />
                                          )}
                                        </button>
                                        <Lock size={10} className={isDark ? 'text-slate-500' : 'text-slate-400'} title="Locked" />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}

          {/* Interface Cards Layer */}
          {config.ifs.map(itf => {
            if (itf.type !== 'std') return null;
            const h = itf.h;
            if (!h) return null;

            const itfX = (h.x ?? 0) + (itf.dx ?? 0);
            const itfY = (h.y ?? 0) + (itf.dy ?? 0);

            const currentIp = editableState.ifs[itf.if]?.ip ?? itf.ip;
            const currentMask = editableState.ifs[itf.if]?.mask ?? itf.mask;

            const ipEdit = itf.ip_edit === 'true';
            const maskEdit = itf.mask_edit === 'true';

            const ipValid = ip_to_int(currentIp) !== null;
            const maskValid = mask_to_int(currentMask) !== null;
            const isElevated = hoveredCard === `if-${itf.if}` || focusedCard === `if-${itf.if}`;

            return (
              <div
                key={itf.if}
                style={{
                  position: 'absolute',
                  left: `${itfX}px`,
                  top: `${itfY}px`,
                  minWidth: '200px',
                  zIndex: isElevated ? 40 : 10,
                }}
                onMouseEnter={() => setHoveredCard(`if-${itf.if}`)}
                onMouseLeave={() => setHoveredCard(null)}
                onFocus={() => setFocusedCard(`if-${itf.if}`)}
                onBlur={() => setFocusedCard(null)}
                className={`network-card z-10 p-2.5 backdrop-blur-md border rounded-xl shadow-xl pointer-events-auto transition hover:z-40 focus-within:z-40 ${
                  isDark
                    ? isElevated
                      ? 'bg-[#080d28]/95 border-cyan-400 shadow-2xl shadow-cyan-500/20 text-white'
                      : 'bg-[#080d28]/95 border-cyan-500/30 shadow-black/70 text-white'
                    : isElevated
                      ? 'bg-white/98 border-cyan-500 shadow-2xl shadow-cyan-300/50 text-slate-900'
                      : 'bg-white/98 border-slate-300 shadow-slate-300/80 text-slate-900'
                }`}
              >
                {/* Interface Header */}
                <div className={`flex items-center justify-between pb-1.5 mb-1.5 border-b ${
                  isDark ? 'border-cyan-500/20' : 'border-cyan-200'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span className={`text-[11px] font-mono font-bold ${
                      isDark ? 'text-cyan-300' : 'text-cyan-700'
                    }`}>
                      interface {itf.if}
                    </span>
                  </div>
                  <span className={`text-[9px] uppercase font-semibold ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {h.id}
                  </span>
                </div>

                {/* Form Fields */}
                <div className="space-y-1.5 text-[11px] font-mono">
                  {/* IP Row */}
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] w-11 font-sans font-semibold shrink-0 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>IP:</span>
                    {ipEdit ? (
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={currentIp}
                          onChange={e => onUpdateIf(itf.if, 'ip', e.target.value)}
                          placeholder="0.0.0.0"
                          className={`w-full px-2 py-0.5 rounded text-[11px] font-mono focus:outline-none transition border ${
                            ipValid
                              ? isDark
                                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-200 focus:border-cyan-300'
                                : 'bg-white border-cyan-300 text-slate-900 focus:border-cyan-600 shadow-sm'
                              : isDark
                                ? 'border-rose-500 text-rose-300 bg-rose-950/30'
                                : 'border-rose-400 text-rose-700 bg-rose-50'
                          }`}
                        />
                        <Edit3 size={10} className={`absolute right-1.5 top-1.5 pointer-events-none ${
                          isDark ? 'text-cyan-400/60' : 'text-cyan-600/70'
                        }`} />
                      </div>
                    ) : (
                      <div
                        data-selectable="true"
                        className={`flex-1 flex items-center justify-between px-2 py-0.5 font-semibold rounded border transition group/ip select-text cursor-text ${
                          isDark
                            ? 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-200 border-white/10'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-sm'
                        }`}
                        title="Click copy button or select text"
                      >
                        <span className="font-mono text-[11px] select-text cursor-text selection:bg-cyan-500/40 selection:text-white">
                          {currentIp}
                        </span>
                        <div className="flex items-center gap-1 shrink-0 ml-1.5 select-none">
                          <button
                            type="button"
                            onClick={e => copyToClipboard(currentIp, `if-ip-${itf.if}`, e)}
                            title={copiedKey === `if-ip-${itf.if}` ? 'Copied to clipboard!' : 'Copy IP address'}
                            className={`p-0.5 rounded transition ${
                              copiedKey === `if-ip-${itf.if}`
                                ? isDark ? 'text-emerald-400 bg-emerald-950/70' : 'text-emerald-700 bg-emerald-100'
                                : isDark
                                ? 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/20 opacity-70 group-hover/ip:opacity-100'
                                : 'text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 opacity-70 group-hover/ip:opacity-100'
                            }`}
                          >
                            {copiedKey === `if-ip-${itf.if}` ? (
                              <span className={`flex items-center gap-0.5 text-[9px] font-sans font-bold ${
                                isDark ? 'text-emerald-400' : 'text-emerald-700'
                              }`}>
                                <Check size={11} className="animate-in zoom-in" />
                                Copied
                              </span>
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                          <Lock size={10} className={isDark ? 'text-slate-500' : 'text-slate-400'} title="Locked" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mask Row */}
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] w-11 font-sans font-semibold shrink-0 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>Mask:</span>
                    {maskEdit ? (
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={currentMask}
                          onChange={e => onUpdateIf(itf.if, 'mask', e.target.value)}
                          placeholder="255.255.255.0 or /24"
                          className={`w-full px-2 py-0.5 rounded text-[11px] font-mono focus:outline-none transition border ${
                            maskValid
                              ? isDark
                                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-200 focus:border-cyan-300'
                                : 'bg-white border-cyan-300 text-slate-900 focus:border-cyan-600 shadow-sm'
                              : isDark
                                ? 'border-rose-500 text-rose-300 bg-rose-950/30'
                                : 'border-rose-400 text-rose-700 bg-rose-50'
                          }`}
                        />
                        <Edit3 size={10} className={`absolute right-1.5 top-1.5 pointer-events-none ${
                          isDark ? 'text-cyan-400/60' : 'text-cyan-600/70'
                        }`} />
                      </div>
                    ) : (
                      <div
                        data-selectable="true"
                        className={`flex-1 flex items-center justify-between px-2 py-0.5 font-semibold rounded border transition group/mask select-text cursor-text ${
                          isDark
                            ? 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-200 border-white/10'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-sm'
                        }`}
                        title="Click copy button or select text"
                      >
                        <span className="font-mono text-[11px] select-text cursor-text selection:bg-cyan-500/40 selection:text-white">
                          {currentMask}
                        </span>
                        <div className="flex items-center gap-1 shrink-0 ml-1.5 select-none">
                          <button
                            type="button"
                            onClick={e => copyToClipboard(currentMask, `if-mask-${itf.if}`, e)}
                            title={copiedKey === `if-mask-${itf.if}` ? 'Copied to clipboard!' : 'Copy subnet mask'}
                            className={`p-0.5 rounded transition ${
                              copiedKey === `if-mask-${itf.if}`
                                ? isDark ? 'text-emerald-400 bg-emerald-950/70' : 'text-emerald-700 bg-emerald-100'
                                : isDark
                                ? 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/20 opacity-70 group-hover/mask:opacity-100'
                                : 'text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 opacity-70 group-hover/mask:opacity-100'
                            }`}
                          >
                            {copiedKey === `if-mask-${itf.if}` ? (
                              <span className={`flex items-center gap-0.5 text-[9px] font-sans font-bold ${
                                isDark ? 'text-emerald-400' : 'text-emerald-700'
                              }`}>
                                <Check size={11} className="animate-in zoom-in" />
                                Copied
                              </span>
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                          <Lock size={10} className={isDark ? 'text-slate-500' : 'text-slate-400'} title="Locked" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
