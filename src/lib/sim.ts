/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EditableState, Goal, GoalResult, Host, NetworkInterface, NetworkLink, Route, SimulationResult } from '../types';

export const RED_TAG = "style='color:#f43f5e;font-weight:600;'";
export const GREEN_TAG = "style='color:#10b981;font-weight:600;'";
export const ACCENT_TAG = "style='color:#818cf8;font-weight:600;'";

export function ip_to_int(s: string, logs?: { value: string }): number | null {
  if (!s || typeof s !== 'string') return null;
  const tab = s.trim().split('.');
  if (tab.length !== 4) return null;
  
  const nums: number[] = [];
  for (let i = 0; i < 4; i++) {
    const n = parseInt(tab[i], 10);
    if (isNaN(n) || n < 0 || n > 255 || tab[i].trim() !== n.toString()) return null;
    nums.push(n);
  }

  if (nums[0] > 223) return null;
  if (nums[0] === 127) {
    if (logs) logs.value += "loopback address detected on outside interface\n";
    return null;
  }

  return (((nums[0] << 24) | (nums[1] << 16) | (nums[2] << 8) | nums[3]) >>> 0);
}

export function int_to_ip(intVal: number): string {
  const b1 = (intVal >>> 24) & 255;
  const b2 = (intVal >>> 16) & 255;
  const b3 = (intVal >>> 8) & 255;
  const b4 = intVal & 255;
  return `${b1}.${b2}.${b3}.${b4}`;
}

export function cidr_to_int(cidr: number): number {
  if (cidr <= 0) return 0;
  if (cidr >= 32) return 0xffffffff >>> 0;
  return (((((1 << cidr) >>> 0) - 1) << (32 - cidr)) >>> 0);
}

export function mask_to_int(s: string): number | null {
  if (!s || typeof s !== 'string') return null;
  const trimmed = s.trim();
  if (trimmed.length === 0) return null;

  if (trimmed[0] === '/') {
    const cidr = parseInt(trimmed.substring(1), 10);
    if (isNaN(cidr) || cidr < 0 || cidr > 32) return null;
    return cidr_to_int(cidr);
  }

  const tab = trimmed.split('.');
  if (tab.length !== 4) return null;

  const nums: number[] = [];
  for (let i = 0; i < 4; i++) {
    const n = parseInt(tab[i], 10);
    if (isNaN(n) || n < 0 || n > 255 || tab[i].trim() !== n.toString()) return null;
    nums.push(n);
  }

  if (nums[0] !== 255 && (nums[1] !== 0 || nums[2] !== 0 || nums[3] !== 0)) return null;
  if (nums[0] === 255 && nums[1] !== 255 && (nums[2] !== 0 || nums[3] !== 0)) return null;
  if (nums[0] === 255 && nums[1] === 255 && nums[2] !== 255 && nums[3] !== 0) return null;

  const mask = (((nums[0] << 24) | (nums[1] << 16) | (nums[2] << 8) | nums[3]) >>> 0);
  if (mask === 0) return 0;
  if (((((~mask) + 1) & (~mask)) >>> 0) === 0) {
    return mask;
  }
  return null;
}

export function mask_to_cidr(maskInt: number): number {
  let count = 0;
  let temp = maskInt;
  while (temp !== 0) {
    count += temp & 1;
    temp = temp >>> 1;
  }
  return count;
}

export const private_subnets: Route[] = [
  { hid: '__none__', rid: 'private_class_A', route: '10.0.0.0/8', gate: '0.0.0.0', route_edit: 'false', gate_edit: 'false', h: { id: 'I', type: 'internet', name: 'Internet', geometry: '', img: '', labelpos: '' } },
  { hid: '__none__', rid: 'private_class_B', route: '172.16.0.0/12', gate: '0.0.0.0', route_edit: 'false', gate_edit: 'false', h: { id: 'I', type: 'internet', name: 'Internet', geometry: '', img: '', labelpos: '' } },
  { hid: '__none__', rid: 'private_class_C', route: '192.168.0.0/16', gate: '0.0.0.0', route_edit: 'false', gate_edit: 'false', h: { id: 'I', type: 'internet', name: 'Internet', geometry: '', img: '', labelpos: '' } },
];

export function get_if_mask_str(itf: NetworkInterface, state: EditableState): string {
  if (itf.mask_edit === 'true' && state.ifs[itf.if]?.mask !== undefined) {
    return state.ifs[itf.if].mask;
  }
  return itf.mask;
}

export function get_if_mask(itf: NetworkInterface, state: EditableState): number | null {
  return mask_to_int(get_if_mask_str(itf, state));
}

export function get_if_ip_str(itf: NetworkInterface, state: EditableState): string {
  if (itf.ip_edit === 'true' && state.ifs[itf.if]?.ip !== undefined) {
    return state.ifs[itf.if].ip;
  }
  return itf.ip;
}

export function get_if_ip(itf: NetworkInterface, state: EditableState, logs?: { value: string }): number | null {
  const the_ip = ip_to_int(get_if_ip_str(itf, state), logs);
  if (the_ip === null) return null;
  const the_mask = get_if_mask(itf, state);
  if (the_mask === null) return null;

  // Check that IP is neither network address nor broadcast address
  if ((the_ip & (~the_mask >>> 0)) === 0 ||
      (the_ip & (~the_mask >>> 0)) === (~the_mask >>> 0)) {
    return null;
  }
  return the_ip;
}

export function get_route_route_str(r: Route, state: EditableState): string {
  if (r.route_edit === 'true' && state.routes[r.rid]?.route !== undefined) {
    return state.routes[r.rid].route;
  }
  return r.route;
}

export function get_route_gate_str(r: Route, state: EditableState): string {
  if (r.gate_edit === 'true' && state.routes[r.rid]?.gate !== undefined) {
    return state.routes[r.rid].gate;
  }
  return r.gate;
}

export function get_route_gate(r: Route, state: EditableState, logs?: { value: string }): number | null {
  return ip_to_int(get_route_gate_str(r, state), logs);
}

export function ip_match_if(ip: number, itf: NetworkInterface, state: EditableState, logs: { value: string }): number {
  const iip = get_if_ip(itf, state, logs);
  if (iip === null) {
    logs.value += `on interface ${itf.if}: <span ${RED_TAG}>invalid IP address</span>\n`;
    return 0;
  }
  const imask = get_if_mask(itf, state);
  if (imask === null) {
    logs.value += `on interface ${itf.if}: invalid netmask\n`;
    return 0;
  }
  if (iip === ip) {
    logs.value += `duplicate IP (${get_if_ip_str(itf, state)})\n`;
    return 0;
  }
  if ((iip & imask) === (ip & imask)) {
    return 1;
  }
  return 0;
}

export function ip_match_route(ip: number, r: Route, state: EditableState, logs: { value: string }): number {
  let str = get_route_route_str(r, state);
  if (str === 'default') str = '0.0.0.0/0';
  if (r.h?.type === 'internet' && str === '0.0.0.0/0') {
    logs.value += `invalid default route on internet ${r.hid}\n`;
    return 0;
  }
  const tab = str.split('/');
  if (tab.length !== 2) {
    logs.value += `invalid route on host ${r.hid}\n`;
    return 0;
  }
  const rip = ip_to_int(tab[0], logs);
  if (rip === null) {
    logs.value += `invalid route on host ${r.hid}\n`;
    return 0;
  }
  const rmask = mask_to_int('/' + tab[1]);
  if (rmask === null) {
    logs.value += `invalid route on host ${r.hid}\n`;
    return 0;
  }
  if ((rip & rmask) === (ip & rmask)) {
    return 1;
  }
  return 0;
}

export function rec_route(
  ip_dest: number,
  local_target: number,
  input_itf: NetworkInterface | null,
  h: Host,
  ifs: NetworkInterface[],
  routes: Route[],
  links: NetworkLink[],
  state: EditableState,
  visited_host: Host[],
  logs: { value: string }
): NetworkInterface[] {
  // Loop detection
  if (visited_host.some(v => v.id === h.id)) {
    logs.value += `on ${h.id}: <span ${RED_TAG}>loop detected</span>\n`;
    return [];
  }
  visited_host.push(h);

  // Switch: broadcast to all connected links (except incoming if possible)
  if (h.type === 'switch') {
    logs.value += `on switch ${h.id}: pass to all connections\n`;
    let ret: NetworkInterface[] = [];
    links.forEach(l => {
      if (l.e1?.hid === h.id && l.e2 && l.h2) {
        // Skip echo back to immediate sender interface
        if (input_itf && l.e2.if === input_itf.if) return;
        logs.value += `on switch ${h.id} test link to ${l.e2.hid}\n`;
        ret = ret.concat(rec_route(ip_dest, local_target, l.e2, l.h2, ifs, routes, links, state, visited_host, logs));
      } else if (l.e2?.hid === h.id && l.e1 && l.h1) {
        if (input_itf && l.e1.if === input_itf.if) return;
        logs.value += `on switch ${h.id} test link to ${l.e1.hid}\n`;
        ret = ret.concat(rec_route(ip_dest, local_target, l.e1, l.h1, ifs, routes, links, state, visited_host, logs));
      }
    });
    return ret;
  }

  // On a host, verify packet destination IP matches input interface IP
  if (input_itf !== null) {
    const itf_ip = get_if_ip(input_itf, state, logs);
    if (itf_ip === null) {
      logs.value += `on ${h.id}: <span ${RED_TAG}>invalid IP on input interface ${input_itf.if}</span>\n`;
      return [];
    }
    if (itf_ip !== local_target) {
      logs.value += `on ${h.id}: <span ${RED_TAG}>packet not for me</span>\n`;
      return [];
    }
  }

  // Accepted on host
  logs.value += `on ${h.id}: packet accepted\n`;

  // Internet does not route private addresses (RFC 1918)
  if (h.type === 'internet') {
    if (
      ip_match_route(ip_dest, private_subnets[0], state, logs) ||
      ip_match_route(ip_dest, private_subnets[1], state, logs) ||
      ip_match_route(ip_dest, private_subnets[2], state, logs)
    ) {
      logs.value += `<span ${RED_TAG}>private subnets not routed over internet</span>\n`;
      return [];
    }
  }

  // Check if destination is reached
  if (input_itf !== null) {
    const reached: NetworkInterface[] = [];
    ifs.forEach(itf => {
      if (itf.hid === h.id) {
        const itf_ip = get_if_ip(itf, state, logs);
        if (itf_ip !== null && ip_dest === itf_ip) {
          reached.push(itf);
        }
      }
    });
    if (reached.length > 0) {
      logs.value += `on ${h.id}: <span ${GREEN_TAG}>destination IP reached</span>\n`;
      return reached;
    }
  }

  // Check if destination IP matches any interface network on this host/router
  let nbif = 0;
  let ret: NetworkInterface[] = [];
  for (let i = 0; i < ifs.length; i++) {
    if (ifs[i].hid === h.id) {
      if (ip_match_if(ip_dest, ifs[i], state, logs)) {
        nbif++;
        logs.value += `on ${h.id}: send to ${ifs[i].if}\n`;
        links.forEach(l => {
          if (l.if1 === ifs[i].if && l.e2 && l.h2) {
            ret = ret.concat(rec_route(ip_dest, ip_dest, l.e2, l.h2, ifs, routes, links, state, visited_host, logs));
          } else if (l.if2 === ifs[i].if && l.e1 && l.h1) {
            ret = ret.concat(rec_route(ip_dest, ip_dest, l.e1, l.h1, ifs, routes, links, state, visited_host, logs));
          }
        });
      }
    }
  }

  if (nbif > 1) {
    logs.value += `on ${h.id}: <span ${RED_TAG}>error on destination ip - multiple interface match</span>\n`;
    return [];
  }
  if (nbif === 1) return ret;

  // No interface match: explore routing tables
  logs.value += `on ${h.id}: destination does not match any interface. pass through routing table\n`;
  ret = [];
  let nb_routes = 0;

  for (let j = 0; j < routes.length; j++) {
    if (routes[j].hid === h.id) {
      if (ip_match_route(ip_dest, routes[j], state, logs)) {
        logs.value += `on ${h.id}: route match ${get_route_route_str(routes[j], state)}\n`;
        nb_routes++;
        const ip_gate = get_route_gate(routes[j], state, logs);
        if (ip_gate === null) {
          logs.value += `on ${h.id}: <span ${RED_TAG}>invalid gate IP, route ${get_route_route_str(routes[j], state)}</span>\n`;
          return [];
        }

        nbif = 0;
        for (let i = 0; i < ifs.length; i++) {
          if (ifs[i].hid === h.id) {
            if (ip_match_if(ip_gate, ifs[i], state, logs)) {
              logs.value += `on ${h.id}: send to gateway ${get_route_gate_str(routes[j], state)} through interface ${ifs[i].if}\n`;
              nbif++;
              links.forEach(l => {
                if (l.if1 === ifs[i].if && l.e2 && l.h2) {
                  ret = ret.concat(rec_route(ip_dest, ip_gate, l.e2, l.h2, ifs, routes, links, state, visited_host, logs));
                } else if (l.if2 === ifs[i].if && l.e1 && l.h1) {
                  ret = ret.concat(rec_route(ip_dest, ip_gate, l.e1, l.h1, ifs, routes, links, state, visited_host, logs));
                }
              });
            }
          }
        }

        if (nbif > 1) {
          logs.value += `on ${h.id}: <span ${RED_TAG}>error on gate ip - multiple interface match</span>\n`;
          return [];
        }
      }
    }

    if (nb_routes > 0) {
      if (nbif === 0) {
        logs.value += `on ${h.id}: <span ${RED_TAG}>route match but no interface for gateway ${get_route_gate_str(routes[j], state)}</span>\n`;
      }
      return ret;
    }
  }

  logs.value += `on ${h.id}: <span ${RED_TAG}>destination does not match any route</span>\n`;
  return [];
}

export function sim_goal(
  g: Goal,
  ifs: NetworkInterface[],
  routes: Route[],
  links: NetworkLink[],
  state: EditableState,
  logs: { value: string }
): GoalResult {
  const srcTxt = g.src_type === 'hid' ? g.h1?.name || g.src || '' : g.src || '';
  const dstTxt = g.dst_type === 'hid' ? g.h2?.name || g.dst || '' : g.dst || '';

  // Forward way
  let ret: NetworkInterface[] = [];
  for (let i = 0; i < ifs.length; i++) {
    const targetKey = g.dst_type === 'if' ? ifs[i].if : ifs[i].hid;
    if (g.dst === targetKey) {
      const itf_ip = get_if_ip(ifs[i], state, logs);
      if (itf_ip === null) {
        logs.value += `on interface ${ifs[i].if}: <span ${RED_TAG}>invalid destination IP for this way</span>\n`;
      } else {
        logs.value += `<b>Forward way</b>: ${g.src} -> ${g.dst} (${get_if_ip_str(ifs[i], state)})\n`;
        if (g.h1) {
          ret = ret.concat(rec_route(itf_ip, 0, null, g.h1, ifs, routes, links, state, [], logs));
        }
      }
      if (ret.length > 0) break;
    }
  }

  if (ret.length <= 0) {
    return { id: g.id, text: 'KO - No forward way, try again ...', status: 0, srcName: srcTxt, dstName: dstTxt, srcType: g.src_name || 'host', dstType: g.dst_name || 'host' };
  }
  if (ret.length > 1) {
    return { id: g.id, text: 'KO - Multiple destination hosts match ...', status: 0, srcName: srcTxt, dstName: dstTxt, srcType: g.src_name || 'host', dstType: g.dst_name || 'host' };
  }
  const matchDst = g.dst_type === 'if' ? ret[0].if : ret[0].hid;
  if (matchDst !== g.dst) {
    return { id: g.id, text: `KO - Correct IP reached but wrong ${g.dst_name}, try again ...`, status: 0, srcName: srcTxt, dstName: dstTxt, srcType: g.src_name || 'host', dstType: g.dst_name || 'host' };
  }

  // Reverse way
  ret = [];
  for (let i = 0; i < ifs.length; i++) {
    const targetKey = g.src_type === 'if' ? ifs[i].if : ifs[i].hid;
    if (g.src === targetKey) {
      const itf_ip = get_if_ip(ifs[i], state, logs);
      if (itf_ip === null) {
        logs.value += `on interface ${ifs[i].if}: <span ${RED_TAG}>invalid destination IP for this way</span>\n`;
      } else {
        logs.value += `<b>Reverse way</b>: ${g.dst} -> ${g.src} (${get_if_ip_str(ifs[i], state)})\n`;
        if (g.h2) {
          ret = ret.concat(rec_route(itf_ip, 0, null, g.h2, ifs, routes, links, state, [], logs));
        }
      }
      if (ret.length > 0) break;
    }
  }

  if (ret.length <= 0) {
    return { id: g.id, text: 'KO - No reverse way, try again ...', status: 0, srcName: srcTxt, dstName: dstTxt, srcType: g.src_name || 'host', dstType: g.dst_name || 'host' };
  }
  if (ret.length > 1) {
    return { id: g.id, text: 'KO - Multiple origin hosts match ...', status: 0, srcName: srcTxt, dstName: dstTxt, srcType: g.src_name || 'host', dstType: g.dst_name || 'host' };
  }
  const matchSrc = g.src_type === 'if' ? ret[0].if : ret[0].hid;
  if (matchSrc !== g.src) {
    return { id: g.id, text: `KO - Correct IP reached but wrong ${g.src_name}, try again ...`, status: 0, srcName: srcTxt, dstName: dstTxt, srcType: g.src_name || 'host', dstType: g.dst_name || 'host' };
  }

  return { id: g.id, text: 'OK - Communication successful!', status: 1, srcName: srcTxt, dstName: dstTxt, srcType: g.src_name || 'host', dstType: g.dst_name || 'host' };
}

export function run_all_goals(
  level: number,
  login: string,
  evalRound: number | null,
  goals: Goal[],
  ifs: NetworkInterface[],
  routes: Route[],
  links: NetworkLink[],
  state: EditableState
): SimulationResult {
  const logs = { value: '' };

  if (login.trim() !== '') {
    logs.value = `<div style="text-align:center;padding-bottom:8px;"><b class="text-indigo-400">--- Generated for login: <span class="underline">${login}</span> (Level ${level}) ---</b></div>\n`;
  } else if (evalRound !== null) {
    logs.value = `<div style="text-align:center;padding-bottom:8px;"><b class="text-amber-400">--- Evaluation Mode (Round ${evalRound}) - Level ${level} ---</b></div>\n`;
  } else {
    logs.value = `<div style="text-align:center;padding-bottom:8px;"><b class="text-indigo-400">--- Level ${level} Simulation Run ---</b></div>\n`;
  }

  const results: GoalResult[] = [];
  for (const g of goals) {
    logs.value += `\n<div class="font-bold text-indigo-300 border-t border-white/10 pt-2 my-1">◈ Goal ID ${g.id}: ${g.src_name} ${g.src} ↔ ${g.dst_name} ${g.dst}</div>\n`;
    const res = sim_goal(g, ifs, routes, links, state, logs);
    results.push(res);
  }

  const allOk = results.length > 0 && results.every(r => r.status === 1);
  return { results, allOk, logs: logs.value };
}
