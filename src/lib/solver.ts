/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EditableState, LevelConfig } from '../types';

export interface LevelSolution {
  state: EditableState;
  explanation: string[];
}

export function solveLevel(config: LevelConfig): LevelSolution {
  const state: EditableState = {
    routes: {},
    ifs: {},
  };
  const explanation: string[] = [];

  // Helper to get resolved interface or route from config
  const getIf = (name: string) => config.ifs.find(i => i.if === name);
  const getRoute = (id: string) => config.routes.find(r => r.rid === id);

  switch (config.level) {
    case 1: {
      const b1 = getIf('B1');
      const c1 = getIf('C1');
      if (b1) {
        const bOctets = b1.ip.split('.');
        const targetA1 = `${bOctets[0]}.${bOctets[1]}.${bOctets[2]}.1`;
        state.ifs['A1'] = { ip: targetA1, mask: '255.255.255.0' };
        explanation.push(`A1 and B1 must share the same /24 subnet (${bOctets[0]}.${bOctets[1]}.${bOctets[2]}.0/24). A1 was set to ${targetA1}.`);
      }
      if (c1) {
        const cOctets = c1.ip.split('.');
        const targetD1 = `${cOctets[0]}.${cOctets[1]}.1.42`;
        state.ifs['D1'] = { ip: targetD1, mask: '255.255.0.0' };
        explanation.push(`C1 and D1 must share the /16 subnet (${cOctets[0]}.${cOctets[1]}.0.0/16). D1 IP was fixed to ${targetD1}.`);
      }
      break;
    }

    case 2: {
      const b1 = getIf('B1');
      if (b1) {
        const bOctets = b1.ip.split('.');
        // Subnet of .222 on /27: 192.168.a.192/27 (usable: 193 - 222)
        const targetA1 = `${bOctets[0]}.${bOctets[1]}.${bOctets[2]}.193`;
        state.ifs['A1'] = { ip: targetA1, mask: '255.255.255.224' };
        state.ifs['B1'] = { ip: b1.ip, mask: '255.255.255.224' };
        explanation.push(`B1 had an invalid mask (255.255.255.32). Changed to 255.255.255.224 (/27). In this subnet (192..223), A1 was assigned host IP ${targetA1}.`);
      }
      // Replace loopback 127.0.0.X with valid private subnet
      state.ifs['C1'] = { ip: '192.168.1.1', mask: '255.255.255.252' };
      state.ifs['D1'] = { ip: '192.168.1.2', mask: '/30' };
      explanation.push('Replaced illegal 127.0.0.X loopback addresses on outside interfaces C1/D1 with valid point-to-point /30 IPs (192.168.1.1 and 192.168.1.2).');
      break;
    }

    case 3: {
      const a1 = getIf('A1');
      if (a1) {
        const aOct = a1.ip.split('.');
        const prefix = `${aOct[0]}.${aOct[1]}.${aOct[2]}`;
        state.ifs['A1'] = { ip: a1.ip, mask: '255.255.255.128' };
        state.ifs['B1'] = { ip: `${prefix}.10`, mask: '255.255.255.128' };
        state.ifs['C1'] = { ip: `${prefix}.20`, mask: '255.255.255.128' };
        explanation.push(`C1 has a locked /25 mask. To connect all 3 hosts through Switch_1, A1, B1, and C1 must all reside on ${prefix}.0/25 (usable: .1 to .126). B1 was changed from loopback 127.x to ${prefix}.10, and C1 to ${prefix}.20.`);
      }
      break;
    }

    case 4: {
      const a1 = getIf('A1');
      if (a1) {
        const aOct = a1.ip.split('.');
        const prefix = `${aOct[0]}.${aOct[1]}.${aOct[2]}`;
        // R2 occupies 0..127, R3 occupies 192..255.
        // That leaves 128..191 which is a /26!
        state.ifs['A1'] = { ip: a1.ip, mask: '255.255.255.192' };
        state.ifs['B1'] = { ip: `${prefix}.131`, mask: '255.255.255.192' };
        state.ifs['R1'] = { ip: `${prefix}.130`, mask: '255.255.255.192' };
        explanation.push(`R2 uses 0..127 (/25) and R3 uses 192..255 (/26). To prevent overlapping routes on Router R, Switch-1 must use the remaining middle block 128..191 (/26). A1, B1, and R1 are now configured on ${prefix}.128/26.`);
      }
      break;
    }

    case 5: {
      const r1 = getIf('R1');
      const r2 = getIf('R2');
      if (r1) {
        const r1Oct = r1.ip.split('.');
        const prefix1 = `${r1Oct[0]}.${r1Oct[1]}.${r1Oct[2]}`;
        state.ifs['A1'] = { ip: `${prefix1}.1`, mask: '255.255.255.128' };
        state.routes['Ar1'] = { route: '0.0.0.0/0', gate: r1.ip };
        explanation.push(`Machine A was assigned ${prefix1}.1/25 with default route 0.0.0.0/0 pointing to gateway R1 (${r1.ip}). Fixed double dot typo in route.`);
      }
      if (r2) {
        const r2Oct = r2.ip.split('.');
        const prefix2 = `${r2Oct[0]}.${r2Oct[1]}.${r2Oct[2]}`;
        state.ifs['B1'] = { ip: `${prefix2}.1`, mask: '255.255.192.0' };
        state.routes['Br1'] = { route: 'default', gate: r2.ip };
        explanation.push(`Machine B was assigned ${prefix2}.1/18 with default gateway pointing to R2 (${r2.ip}).`);
      }
      break;
    }

    case 6: {
      const a1 = getIf('A1');
      if (a1) {
        const aOct = a1.ip.split('.');
        const prefix = `${aOct[0]}.${aOct[1]}.${aOct[2]}`;
        // .227 is in 128..255 (/25)
        state.ifs['A1'] = { ip: a1.ip, mask: '255.255.255.128' };
        state.ifs['R1'] = { ip: `${prefix}.254`, mask: '255.255.255.128' };
        state.routes['Ar1'] = { route: '0.0.0.0/0', gate: `${prefix}.254` };
        state.routes['Rr1'] = { route: '0.0.0.0/0', gate: '163.172.250.1' };
        state.routes['Ir1'] = { route: `${prefix}.128/25`, gate: '163.172.250.12' };
        explanation.push(`A1 (.227) and R1 (.254) configured on ${prefix}.128/25.`);
        explanation.push(`Added default route on A1 to R1, default route on Router R to Internet gateway (163.172.250.1), and return route on Internet to ${prefix}.128/25 via R2.`);
      }
      break;
    }

    case 7: {
      const r11 = getIf('R11');
      if (r11) {
        const oct = r11.ip.split('.');
        const prefix = `${oct[0]}.${oct[1]}.${oct[2]}`;
        // 3 subnets in prefix.0/24:
        // Subnet 1: prefix.0/26 (0..63) -> R11 (.1), A1 (.2)
        // Subnet 2: prefix.64/26 (64..127) -> R22 (.65), C1 (.66)
        // Subnet 3: prefix.192/26 (192..255) -> R12 (.254), R21 (.193)
        state.ifs['R11'] = { ip: r11.ip, mask: '255.255.255.192' };
        state.ifs['A1'] = { ip: `${prefix}.2`, mask: '255.255.255.192' };
        state.ifs['R12'] = { ip: `${prefix}.254`, mask: '255.255.255.192' };
        state.ifs['R21'] = { ip: `${prefix}.193`, mask: '255.255.255.192' };
        state.ifs['R22'] = { ip: `${prefix}.65`, mask: '255.255.255.192' };
        state.ifs['C1'] = { ip: `${prefix}.66`, mask: '255.255.255.192' };

        state.routes['Ar1'] = { route: '0.0.0.0/0', gate: `${prefix}.1` };
        state.routes['Cr1'] = { route: '0.0.0.0/0', gate: `${prefix}.65` };
        state.routes['R1r1'] = { route: `${prefix}.64/26`, gate: `${prefix}.193` };
        state.routes['R2r1'] = { route: `${prefix}.0/26`, gate: `${prefix}.254` };

        explanation.push(`Divided ${prefix}.0/24 into 3 non-overlapping /26 subnets:`);
        explanation.push(`• Subnet 1 (${prefix}.0/26): Host A (.2) ↔ Router 1 (.1)`);
        explanation.push(`• Subnet 2 (${prefix}.192/26): Router 1 (.254) ↔ Router 2 (.193)`);
        explanation.push(`• Subnet 3 (${prefix}.64/26): Router 2 (.65) ↔ Host C (.66)`);
        explanation.push('• Configured routing tables on R1 and R2 to forward traffic between subnets.');
      }
      break;
    }

    case 8: {
      state.ifs['C1'] = { ip: '192.168.0.1', mask: '255.255.255.0' };
      state.ifs['R22'] = { ip: '192.168.0.254', mask: '255.255.255.0' };
      state.routes['Cr1'] = { route: '0.0.0.0/0', gate: '192.168.0.254' };

      state.ifs['D1'] = { ip: '7.8.9.1', mask: '255.255.255.240' };
      state.ifs['R23'] = { ip: '7.8.9.14', mask: '255.255.255.240' };
      state.routes['Dr1'] = { route: 'default', gate: '7.8.9.14' };

      state.ifs['R13'] = { ip: '10.0.0.1', mask: '255.255.255.252' };
      state.ifs['R21'] = { ip: '10.0.0.2', mask: '255.255.255.252' };

      state.routes['R1r2'] = { route: '192.168.0.0/24', gate: '10.0.0.2' };
      state.routes['R2r1'] = { route: '0.0.0.0/0', gate: '10.0.0.1' };
      state.routes['Ir1'] = { route: getRoute('Ir1')?.route || '0.0.0.0/0', gate: '163.172.250.12' };

      explanation.push('Configured office subnet (192.168.0.0/24) and home subnet (7.8.9.0/28).');
      explanation.push('Set point-to-point /30 subnet between routers (10.0.0.1 ↔ 10.0.0.2).');
      explanation.push('Configured default routes and return route through Internet transit.');
      break;
    }

    case 9: {
      const r11 = getIf('R11');
      const d1 = getIf('D1');
      const r21 = getIf('R21');

      if (r11) {
        const oct = r11.ip.split('.');
        const prefix = `${oct[0]}.${oct[1]}.${oct[2]}`;
        state.ifs['R11'] = { ip: r11.ip, mask: '255.255.255.128' };
        state.ifs['A1'] = { ip: `${prefix}.2`, mask: '255.255.255.128' };
        state.ifs['B1'] = { ip: `${prefix}.3`, mask: '255.255.255.128' };
        state.routes['Ar1'] = { route: '0.0.0.0/0', gate: r11.ip };
        state.routes['Br1'] = { route: 'default', gate: r11.ip };
      }

      state.ifs['C1'] = { ip: '10.0.0.1', mask: '255.255.255.0' };
      state.ifs['R22'] = { ip: '10.0.0.254', mask: '255.255.255.0' };
      state.routes['Cr1'] = { route: '0.0.0.0/0', gate: '10.0.0.254' };

      if (d1) {
        const oct = d1.ip.split('.');
        const prefixD = `${oct[0]}.${oct[1]}.${oct[2]}`;
        state.ifs['D1'] = { ip: d1.ip, mask: '255.255.255.192' };
        state.ifs['R23'] = { ip: `${prefixD}.130`, mask: '255.255.255.192' };
        state.routes['Dr1'] = { route: '0.0.0.0/0', gate: `${prefixD}.130` };
      }

      if (r21) {
        const oct = r21.ip.split('.');
        const prefixR = `${oct[0]}.${oct[1]}.${oct[2]}`;
        state.ifs['R21'] = { ip: r21.ip, mask: '255.255.255.252' };
        state.ifs['R13'] = { ip: `${prefixR}.254`, mask: '255.255.255.252' };

        state.routes['R1r1'] = { route: '10.0.0.0/8', gate: r21.ip };
        const d1Prefix = d1 ? d1.ip.split('.').slice(0, 3).join('.') : '10.0.0';
        state.routes['R1r2'] = { route: `${d1Prefix}.128/26`, gate: r21.ip };
        state.routes['R2r1'] = { route: '0.0.0.0/0', gate: `${prefixR}.254` };
      }

      if (r11) {
        const oct = r11.ip.split('.');
        state.routes['Ir1'] = { route: `${oct[0]}.${oct[1]}.${oct[2]}.0/25`, gate: '163.172.250.12' };
      }
      if (d1) {
        const oct = d1.ip.split('.');
        state.routes['Ir2'] = { route: `${oct[0]}.${oct[1]}.${oct[2]}.128/26`, gate: '163.172.250.12' };
      }
      state.routes['Ir3'] = { route: '0.0.0.0/0', gate: '163.172.250.12' };

      explanation.push('Configured 4 distinct network segments:');
      explanation.push('• Subnet A/B (192.168.x.0/25) through switch neutron to R11.');
      explanation.push('• Subnet C (10.0.0.0/24) directly to R22.');
      explanation.push('• Subnet D (j.k.19.128/26) directly to R23.');
      explanation.push('• Point-to-point router link (j.k.18.252/30) between R13 and R21.');
      explanation.push('• Routing tables set to keep private traffic off public Internet.');
      break;
    }

    case 10: {
      const r11 = getIf('R11');
      const r21 = getIf('R21');

      if (r11) {
        const oct = r11.ip.split('.');
        const prefix = `${oct[0]}.${oct[1]}.${oct[2]}`;
        state.ifs['H11'] = { ip: `${prefix}.2`, mask: '255.255.255.128' };
        state.ifs['H21'] = { ip: `${prefix}.3`, mask: '255.255.255.128' };
      }

      if (r21) {
        const oct = r21.ip.split('.');
        const prefix = `${oct[0]}.${oct[1]}.${oct[2]}`;
        state.ifs['R13'] = { ip: `${prefix}.254`, mask: '255.255.255.252' };
      }

      state.ifs['R22'] = { ip: '10.0.0.254', mask: '255.255.255.0' };
      state.ifs['H31'] = { ip: '10.0.0.1', mask: '255.255.255.0' };
      state.routes['H3r1'] = { route: '0.0.0.0/0', gate: '10.0.0.254' };

      if (r11) {
        const oct = r11.ip.split('.');
        const prefix = `${oct[0]}.${oct[1]}.${oct[2]}`;
        state.ifs['R23'] = { ip: `${prefix}.129`, mask: '255.255.255.192' };
        state.routes['R1r1'] = { route: '10.0.0.0/8', gate: `${prefix}.253` };
        state.routes['Ir1'] = { route: `${prefix}.0/24`, gate: '163.172.250.12' };
      }

      explanation.push('Resolved all 7 complex interconnected goals:');
      explanation.push('• Subnet H1/H2/R11 aligned to /25 (0..127).');
      explanation.push('• Subnet H4/R23 aligned to /26 (128..191) with gateway .129.');
      explanation.push('• Inter-router link R13/R21 set to /30 (252..255).');
      explanation.push('• Subnet H3/R22 configured on 10.0.0.0/24 with default route to .254.');
      explanation.push('• R1 and Internet routing tables updated to forward traffic across segments.');
      break;
    }
  }

  return { state, explanation };
}
