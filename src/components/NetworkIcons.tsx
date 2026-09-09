/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HostType } from '../types';

export const HostIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Glow base */}
    <rect x="8" y="10" width="48" height="34" rx="6" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2.5" />
    {/* Screen inner */}
    <rect x="12" y="14" width="40" height="26" rx="3" fill="#090d24" />
    {/* Terminal prompt */}
    <path d="M16 22L21 26L16 30" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="25" y1="30" x2="33" y2="30" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
    {/* Stand */}
    <path d="M28 44V50H36V44" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" strokeLinejoin="round" />
    <rect x="22" y="50" width="20" height="4" rx="2" fill="#4338ca" stroke="#6366f1" strokeWidth="1.5" />
    {/* Power LED */}
    <circle cx="48" cy="18" r="1.5" fill="#10b981" />
  </svg>
);

export const RouterIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Outer disc */}
    <circle cx="32" cy="32" r="26" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="20" fill="#0f172a" stroke="#4f46e5" strokeWidth="1.5" />
    {/* 4 Routing Arrows */}
    <g stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {/* Top arrow out */}
      <path d="M32 28V16M32 16L27 21M32 16L37 21" />
      {/* Bottom arrow out */}
      <path d="M32 36V48M32 48L27 43M32 48L37 43" />
      {/* Left arrow in */}
      <path d="M16 32H28M24 27L29 32L24 37" />
      {/* Right arrow in */}
      <path d="M48 32H36M40 27L35 32L40 37" />
    </g>
    {/* Center node */}
    <circle cx="32" cy="32" r="3.5" fill="#38bdf8" />
  </svg>
);

export const SwitchIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Chassis */}
    <rect x="6" y="20" width="52" height="24" rx="5" fill="#0f172a" stroke="#22d3ee" strokeWidth="2.5" />
    {/* Switch ports */}
    <rect x="11" y="28" width="6" height="8" rx="1.5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
    <rect x="20" y="28" width="6" height="8" rx="1.5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
    <rect x="29" y="28" width="6" height="8" rx="1.5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
    <rect x="38" y="28" width="6" height="8" rx="1.5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
    <rect x="47" y="28" width="6" height="8" rx="1.5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
    {/* Activity LEDs */}
    <circle cx="14" cy="24" r="1.5" fill="#10b981" />
    <circle cx="23" cy="24" r="1.5" fill="#10b981" />
    <circle cx="32" cy="24" r="1.5" fill="#f59e0b" />
    <circle cx="41" cy="24" r="1.5" fill="#10b981" />
    <circle cx="50" cy="24" r="1.5" fill="#10b981" />
    {/* Switching bidirectional arrows underneath */}
    <path d="M14 49H50M14 49L20 45M50 49L44 53" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 55H14M50 55L44 51M14 55L20 59" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const InternetIcon: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Cloud / Globe compound */}
    <circle cx="32" cy="32" r="24" fill="#0a192f" stroke="#0ea5e9" strokeWidth="2.5" />
    {/* Latitude / Longitude lines */}
    <ellipse cx="32" cy="32" rx="24" ry="11" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
    <ellipse cx="32" cy="32" rx="12" ry="24" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
    <line x1="8" y1="32" x2="56" y2="32" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
    <line x1="32" y1="8" x2="32" y2="56" stroke="#38bdf8" strokeWidth="1.5" opacity="0.8" />
    {/* Signal Waves */}
    <path d="M42 16A16 16 0 0 1 54 28" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <path d="M46 12A22 22 0 0 1 58 24" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export const DeviceIcon: React.FC<{ type: HostType; size?: number; className?: string }> = ({ type, size = 52, className = '' }) => {
  switch (type) {
    case 'host':
      return <HostIcon size={size} className={className} />;
    case 'router':
      return <RouterIcon size={size} className={className} />;
    case 'switch':
      return <SwitchIcon size={size} className={className} />;
    case 'internet':
      return <InternetIcon size={size} className={className} />;
    default:
      return <HostIcon size={size} className={className} />;
  }
};
