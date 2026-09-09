/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type HostType = 'host' | 'router' | 'switch' | 'internet';

export interface Host {
  id: string;
  type: HostType;
  name: string;
  geometry: string;
  img: string;
  labelpos: string;
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  lx?: number;
  ly?: number;
}

export interface Route {
  hid: string;
  rid: string;
  route: string;
  gate: string;
  route_edit: string; // 'true' | 'false'
  gate_edit: string;  // 'true' | 'false'
  h?: Host;
}

export interface NetworkInterface {
  if: string;
  hid: string;
  ip: string;
  mask: string;
  ip_edit: string; // 'true' | 'false'
  mask_edit: string; // 'true' | 'false'
  type: 'std' | 'hidden';
  pos: string;
  dx?: number;
  dy?: number;
  h?: Host;
}

export interface NetworkLink {
  if1: string;
  if2: string;
  e1?: NetworkInterface;
  e2?: NetworkInterface;
  h1?: Host;
  h2?: Host;
}

export interface Goal {
  id: string;
  type?: string;
  id1?: string;
  id2?: string;
  if_id1?: string;
  if_id2?: string;
  src?: string;
  dst?: string;
  src_type?: 'if' | 'hid';
  src_name?: 'interface' | 'host';
  dst_type?: 'if' | 'hid';
  dst_name?: 'interface' | 'host';
  h1?: Host;
  h2?: Host;
}

export interface GoalResult {
  id: string;
  text: string;
  status: number; // 1 = OK, 0 = KO
  srcName: string;
  dstName: string;
  srcType: string;
  dstType: string;
}

export interface SimulationResult {
  results: GoalResult[];
  allOk: boolean;
  logs: string;
}

export interface LevelConfig {
  level: number;
  hosts: Host[];
  routes: Route[];
  ifs: NetworkInterface[];
  links: NetworkLink[];
  goals: Goal[];
  description?: string;
}

export interface EditableState {
  routes: Record<string, { route: string; gate: string }>;
  ifs: Record<string, { ip: string; mask: string }>;
}
