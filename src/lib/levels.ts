/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Goal, Host, LevelConfig, NetworkInterface, NetworkLink, Route } from '../types';

export interface RawLevel {
  level: number;
  description: string;
  hosts: Host[];
  routes: Route[];
  ifs: NetworkInterface[];
  links: NetworkLink[];
  goals: Goal[];
}

export const RAW_LEVELS: RawLevel[] = [
  // Level 1
  {
    level: 1,
    description: 'Basic IP Addressing: Fix the IP addresses of my PC and my little sister\'s computer so both pairs can communicate.',
    hosts: [
      { id: 'A', type: 'host', name: 'my PC', geometry: '200x220+250+600', img: 'host.png', labelpos: '0,220' },
      { id: 'B', type: 'host', name: "my little brother's computer", geometry: '200x220+250+200', img: 'host.png', labelpos: '190,30' },
      { id: 'C', type: 'host', name: 'my Mac', geometry: '200x220+700+600', img: 'host.png', labelpos: '0,220' },
      { id: 'D', type: 'host', name: "my little sister's computer", geometry: '200x220+700+200', img: 'host.png', labelpos: '190,30' },
    ],
    routes: [],
    ifs: [
      { if: 'A1', hid: 'A', ip: '104.93.23.[260-399]a', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'false', type: 'std', pos: '-90,-70' },
      { if: 'B1', hid: 'B', ip: '104.[94-99]b.23.12', mask: '255.255.255.0', ip_edit: 'false', mask_edit: 'false', type: 'std', pos: '110,220' },
      { if: 'C1', hid: 'C', ip: '211.191.[1-254]c.75', mask: '255.255.0.0', ip_edit: 'false', mask_edit: 'false', type: 'std', pos: '-90,-70' },
      { if: 'D1', hid: 'D', ip: '211.190.[260-399]d.42', mask: '255.255.0.0', ip_edit: 'true', mask_edit: 'false', type: 'std', pos: '110,220' },
    ],
    links: [
      { if1: 'A1', if2: 'B1' },
      { if1: 'C1', if2: 'D1' },
    ],
    goals: [
      { id: '1', type: 'reach', id1: 'A', id2: 'B' },
      { id: '2', type: 'reach', id1: 'C', id2: 'D' },
    ],
  },

  // Level 2
  {
    level: 2,
    description: 'Subnet Masks & Loopback Addresses: Fix invalid netmask on B1, calculate valid host IP on A1 (/27), and replace forbidden 127.0.0.X loopback addresses on C1/D1.',
    hosts: [
      { id: 'A', type: 'host', name: 'Computer A', geometry: '200x220+200+600', img: 'host.png', labelpos: '0,220' },
      { id: 'B', type: 'host', name: 'Computer B', geometry: '200x220+200+200', img: 'host.png', labelpos: '190,30' },
      { id: 'C', type: 'host', name: 'Computer C', geometry: '200x220+600+600', img: 'host.png', labelpos: '0,220' },
      { id: 'D', type: 'host', name: 'Computer D', geometry: '200x220+600+200', img: 'host.png', labelpos: '190,30' },
    ],
    routes: [],
    ifs: [
      { if: 'A1', hid: 'A', ip: '192.168.[14-150]a.1', mask: '255.255.255.224', ip_edit: 'true', mask_edit: 'false', type: 'std', pos: '-90,-70' },
      { if: 'B1', hid: 'B', ip: '192.168.[a].222', mask: '255.255.255.32', ip_edit: 'false', mask_edit: 'true', type: 'std', pos: '110,220' },
      { if: 'C1', hid: 'C', ip: '127.0.0.1', mask: '255.255.255.252', ip_edit: 'true', mask_edit: 'false', type: 'std', pos: '-90,-70' },
      { if: 'D1', hid: 'D', ip: '127.0.0.4', mask: '/30', ip_edit: 'true', mask_edit: 'false', type: 'std', pos: '110,220' },
    ],
    links: [
      { if1: 'A1', if2: 'B1' },
      { if1: 'C1', if2: 'D1' },
    ],
    goals: [
      { id: '1', type: 'reach', id1: 'B', id2: 'A' },
      { id: '2', type: 'reach', id1: 'D', id2: 'C' },
    ],
  },

  // Level 3
  {
    level: 3,
    description: 'Switches and Shared Subnets: Connect three hosts through Switch_1 so all three can communicate simultaneously on a /25 subnet.',
    hosts: [
      { id: 'A', type: 'host', name: 'Host_A', geometry: '200x220+700+800', img: 'host.png', labelpos: '-150,150' },
      { id: 'B', type: 'host', name: 'Host_B', geometry: '200x220+600+200', img: 'host.png', labelpos: '190,30' },
      { id: 'C', type: 'host', name: 'Host_C', geometry: '200x220+200+500', img: 'host.png', labelpos: '-150,150' },
      { id: 'S', type: 'switch', name: 'Switch_1', geometry: '150x150+600+500', img: 'switch.png', labelpos: '80,110' },
    ],
    routes: [],
    ifs: [
      { if: 'A1', hid: 'A', ip: '104.198.[1-254]a.125', mask: '255.255.255.0', ip_edit: 'false', mask_edit: 'true', type: 'std', pos: '40,-70' },
      { if: 'B1', hid: 'B', ip: '127.168.42.42', mask: '255.255.0.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '100,220' },
      { if: 'C1', hid: 'C', ip: '104.198.[a].[260-299]b', mask: '255.255.255.128', ip_edit: 'true', mask_edit: 'false', type: 'std', pos: '190,10' },
      { if: 'S1', hid: 'S', ip: '0.0.0.0', mask: '/32', ip_edit: 'false', mask_edit: 'false', pos: '0,0', type: 'hidden' },
    ],
    links: [
      { if1: 'C1', if2: 'S1' },
      { if1: 'S1', if2: 'A1' },
      { if1: 'S1', if2: 'B1' },
    ],
    goals: [
      { id: '1', type: 'reach', id1: 'A', id2: 'B' },
      { id: '2', type: 'reach', id1: 'A', id2: 'C' },
      { id: '3', type: 'reach', id1: 'B', id2: 'C' },
    ],
  },

  // Level 4
  {
    level: 4,
    description: 'Routers with Multiple Interfaces: Align R1, A1, and B1 to share the same subnet through Switch-1 without overlapping R\'s other interfaces.',
    hosts: [
      { id: 'A', type: 'host', name: 'A nice host', geometry: '200x220+800+800', img: 'host.png', labelpos: '0,220' },
      { id: 'B', type: 'host', name: 'Another host', geometry: '200x220+700+200', img: 'host.png', labelpos: '190,30' },
      { id: 'R', type: 'router', name: 'My_Gate', geometry: '200x200+300+500', img: 'router.png', labelpos: '-170,120' },
      { id: 'S', type: 'switch', name: 'Switch-1', geometry: '150x150+700+500', img: 'switch.png', labelpos: '80,110' },
    ],
    routes: [],
    ifs: [
      { if: 'A1', hid: 'A', ip: '[60-125]a.[1-254]b.[110-119]c.132', mask: '255.255.255.240', ip_edit: 'false', mask_edit: 'true', type: 'std', pos: '40,-70' },
      { if: 'B1', hid: 'B', ip: '[a].[b].[120-129]d.193', mask: '255.255.0.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '100,220' },
      { if: 'R1', hid: 'R', ip: '[a].[b].[c].91', mask: '/23', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '160,10' },
      { if: 'R2', hid: 'R', ip: '[a].[b].[c].1', mask: '255.255.255.128', ip_edit: 'false', mask_edit: 'false', type: 'std', pos: '0,190' },
      { if: 'R3', hid: 'R', ip: '[a].[b].[c].244', mask: '255.255.255.192', ip_edit: 'false', mask_edit: 'false', type: 'std', pos: '-130,0' },
      { if: 'S1', hid: 'S', ip: '0.0.0.0', mask: '/32', ip_edit: 'false', mask_edit: 'false', pos: '0,0', type: 'hidden' },
    ],
    links: [
      { if1: 'R1', if2: 'S1' },
      { if1: 'S1', if2: 'A1' },
      { if1: 'S1', if2: 'B1' },
    ],
    goals: [
      { id: '1', type: 'reach', id1: 'A', id2: 'B' },
      { id: '2', type: 'reach', id1: 'A', id2: 'R' },
      { id: '3', type: 'reach', id1: 'B', id2: 'R' },
    ],
  },

  // Level 5
  {
    level: 5,
    description: 'Default Gateways & Routing Tables: Configure default routes on Machine A and Machine B to forward packets through The Mighty Router.',
    hosts: [
      { id: 'A', type: 'host', name: 'Machine A', geometry: '200x220+900+800', img: 'host.png', labelpos: '0,220' },
      { id: 'B', type: 'host', name: 'Machine B', geometry: '200x220+800+200', img: 'host.png', labelpos: '190,30' },
      { id: 'R', type: 'router', name: 'The Mighty Router', geometry: '200x200+400+500', img: 'router.png', labelpos: '-190,110' },
    ],
    routes: [
      { hid: 'A', rid: 'Ar1', route: '10..0.0.0/8', gate: '192.168.0.254', route_edit: 'true', gate_edit: 'true' },
      { hid: 'B', rid: 'Br1', route: 'default', gate: '192.168.0.254', route_edit: 'false', gate_edit: 'true' },
    ],
    ifs: [
      { if: 'A1', hid: 'A', ip: '104.198.14.2', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '-40,-75' },
      { if: 'B1', hid: 'B', ip: '192.168.42.42', mask: '/[27-30]g', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '-190,100' },
      { if: 'R1', hid: 'R', ip: '[15-99]a.[1-254]c.[1-254]e.126', mask: '255.255.255.128', ip_edit: 'false', mask_edit: 'false', type: 'std', pos: '40,190' },
      { if: 'R2', hid: 'R', ip: '[130-170]b.[1-254]d.[1-254]f.254', mask: '255.255.192.0', ip_edit: 'false', mask_edit: 'false', type: 'std', pos: '150,0' },
    ],
    links: [
      { if1: 'R1', if2: 'A1' },
      { if1: 'R2', if2: 'B1' },
    ],
    goals: [
      { id: '1', type: 'reach', id1: 'A', id2: 'R' },
      { id: '2', type: 'reach', id1: 'B', id2: 'R' },
      { id: '3', type: 'reach', id1: 'A', id2: 'B' },
    ],
  },

  // Level 6
  {
    level: 6,
    description: 'Internet Communication: Connect web server A to "Somewhere on the Net" (8.8.8.8) by configuring default routes on A, router R, and a return route on Internet I.',
    hosts: [
      { id: 'A', type: 'host', name: 'webserv.non-real.com', geometry: '200x220+900+800', img: 'host.png', labelpos: '0,220' },
      { id: 'R', type: 'router', name: 'gate.non-real.com', geometry: '200x200+400+500', img: 'router.png', labelpos: '-50,190' },
      { id: 'I', type: 'internet', name: 'Internet', geometry: '200x240+100+200', img: 'internet.png', labelpos: '-60,200' },
      { id: 'S', type: 'switch', name: 'sw-1.non-real.com', geometry: '150x150+800+500', img: 'switch.png', labelpos: '80,110' },
    ],
    routes: [
      { hid: 'A', rid: 'Ar1', route: '0.0.0.0/0', gate: '[20-120]a.[1-255]b.[1-255]c.1', route_edit: 'true', gate_edit: 'true' },
      { hid: 'R', rid: 'Rr1', route: '10.0.0.0/8', gate: '163.172.250.1', route_edit: 'true', gate_edit: 'false' },
      { hid: 'I', rid: 'Ir1', route: '[a].[b].[c].0/31', gate: '163.172.250.12', route_edit: 'true', gate_edit: 'false' },
    ],
    ifs: [
      { if: 'A1', hid: 'A', ip: '[a].[b].[c].227', mask: '255.255.255.0', ip_edit: 'false', mask_edit: 'true', type: 'std', pos: '20,-70' },
      { if: 'R1', hid: 'R', ip: '[a].[b].[c].254', mask: '255.255.255.128', ip_edit: 'true', mask_edit: 'false', type: 'std', pos: '160,15' },
      { if: 'R2', hid: 'R', ip: '163.172.250.12', mask: '255.255.255.240', ip_edit: 'false', mask_edit: 'false', type: 'std', pos: '-130,15' },
      { if: 'S1', hid: 'S', ip: '0.0.0.0', mask: '/32', ip_edit: 'false', mask_edit: 'false', pos: '0,0', type: 'hidden' },
      { if: 'Somewhere on the Net', hid: 'I', ip: '8.8.8.8', mask: '/16', ip_edit: 'false', mask_edit: 'false', pos: '0,-50', type: 'hidden' },
      { if: 'I1', hid: 'I', ip: '163.172.250.1', mask: '/28', ip_edit: 'false', mask_edit: 'false', pos: '0,0', type: 'hidden' },
    ],
    links: [
      { if1: 'I1', if2: 'R2' },
      { if1: 'R1', if2: 'S1' },
      { if1: 'S1', if2: 'A1' },
    ],
    goals: [
      { id: '1', id1: 'A', if_id2: 'Somewhere on the Net' },
    ],
  },

  // Level 7
  {
    level: 7,
    description: 'Multi-Hop Subnetting: Partition the class C network into three distinct non-overlapping subnets across two routers R1 and R2.',
    hosts: [
      { id: 'A', type: 'host', name: 'dev.non-real.net', geometry: '200x220+900+200', img: 'host.png', labelpos: '0,220' },
      { id: 'C', type: 'host', name: 'accounting.non-real.net', geometry: '200x220+900+700', img: 'host.png', labelpos: '190,100' },
      { id: 'R1', type: 'router', name: 'tech.non-real.net', geometry: '200x200+400+200', img: 'router.png', labelpos: '-280,70' },
      { id: 'R2', type: 'router', name: 'adm.non-real.net', geometry: '200x200+400+700', img: 'router.png', labelpos: '-30,190' },
    ],
    routes: [
      { hid: 'A', rid: 'Ar1', route: '0.0.0.0/0', gate: '0.0.0.0', route_edit: 'true', gate_edit: 'true' },
      { hid: 'C', rid: 'Cr1', route: '0.0.0.0/0', gate: '0.0.0.0', route_edit: 'true', gate_edit: 'true' },
      { hid: 'R1', rid: 'R1r1', route: '0.0.0.0/0', gate: '0.0.0.0', route_edit: 'true', gate_edit: 'true' },
      { hid: 'R2', rid: 'R2r1', route: '0.0.0.0/0', gate: '0.0.0.0', route_edit: 'true', gate_edit: 'true' },
    ],
    ifs: [
      { if: 'A1', hid: 'A', ip: '[90-120]a.198.14.2', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '-20,-30' },
      { if: 'C1', hid: 'C', ip: '[a].198.14.1', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '20,-70' },
      { if: 'R11', hid: 'R1', ip: '[a].198.14.1', mask: '255.255.255.0', ip_edit: 'false', mask_edit: 'true', type: 'std', pos: '160,10' },
      { if: 'R12', hid: 'R1', ip: '[a].198.14.254', mask: '255.255.255.0', ip_edit: 'false', mask_edit: 'true', type: 'std', pos: '80,180' },
      { if: 'R21', hid: 'R2', ip: '[a].198.14.149', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '0,-50' },
      { if: 'R22', hid: 'R2', ip: '[a].198.14.252', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '210,90' },
    ],
    links: [
      { if1: 'R11', if2: 'A1' },
      { if1: 'R12', if2: 'R21' },
      { if1: 'R22', if2: 'C1' },
    ],
    goals: [
      { id: '1', type: 'reach', id1: 'A', id2: 'C' },
    ],
  },

  // Level 8
  {
    level: 8,
    description: 'Corporate Network & ISP Transit: Interconnect office and home networks through private link and public Internet.',
    hosts: [
      { id: 'C', type: 'host', name: 'office.non-real.com', geometry: '200x220+700+900', img: 'host.png', labelpos: '180,120' },
      { id: 'D', type: 'host', name: 'home.non-real.com', geometry: '200x220+100+900', img: 'host.png', labelpos: '180,120' },
      { id: 'R1', type: 'router', name: 'gate.non-real.com', geometry: '200x200+400+200', img: 'router.png', labelpos: '-270,70' },
      { id: 'R2', type: 'router', name: 'transit.my-isp.org', geometry: '200x200+400+600', img: 'router.png', labelpos: '-40,180' },
      { id: 'I', type: 'internet', name: 'Internet', geometry: '200x240+900+175', img: 'internet.png', labelpos: '-50,200' },
    ],
    routes: [
      { hid: 'C', rid: 'Cr1', route: '0.0.0.0/0', gate: '10.0.0.254', route_edit: 'true', gate_edit: 'true' },
      { hid: 'D', rid: 'Dr1', route: 'default', gate: '9.9.9.9', route_edit: 'true', gate_edit: 'true' },
      { hid: 'R1', rid: 'R1r2', route: '192.168.0.0/26', gate: '10.0.0.2', route_edit: 'true', gate_edit: 'true' },
      { hid: 'R1', rid: 'R1r3', route: '0.0.0.0/0', gate: '163.[1-254]a.250.1', route_edit: 'false', gate_edit: 'false' },
      { hid: 'R2', rid: 'R2r1', route: '10.0.0.0/8', gate: '[128-170]b.[1-254]c.[1-254]d.62', route_edit: 'true', gate_edit: 'false' },
      { hid: 'I', rid: 'Ir1', route: '[b].[c].[d].0/26', gate: '163.[a].250.254', route_edit: 'false', gate_edit: 'true' },
    ],
    ifs: [
      { if: 'C1', hid: 'C', ip: '192.168.0.1', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '40,-70' },
      { if: 'D1', hid: 'D', ip: '7.9.10.11', mask: '255.255.255.240', ip_edit: 'true', mask_edit: 'false', type: 'std', pos: '-20,-70' },
      { if: 'R12', hid: 'R1', ip: '163.[a].250.12', mask: '255.255.255.240', ip_edit: 'false', mask_edit: 'false', type: 'std', pos: '170,20' },
      { if: 'R13', hid: 'R1', ip: '10.0.0.1', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '20,180' },
      { if: 'R21', hid: 'R2', ip: '10.0.0.2', mask: '255.255.0.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '0,-50' },
      { if: 'R22', hid: 'R2', ip: '192.168.0.254', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '200,90' },
      { if: 'R23', hid: 'R2', ip: '7.8.9.10', mask: '/18', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '-180,90' },
      { if: 'I1', hid: 'I', ip: '163.[a].250.1', mask: '/28', ip_edit: 'false', mask_edit: 'false', pos: '0,0', type: 'hidden' },
      { if: 'Somewhere on the Net', hid: 'I', ip: '8.8.8.8', mask: '/16', ip_edit: 'false', mask_edit: 'false', pos: '0,-50', type: 'hidden' },
    ],
    links: [
      { if1: 'I1', if2: 'R12' },
      { if1: 'R13', if2: 'R21' },
      { if1: 'R22', if2: 'C1' },
      { if1: 'R23', if2: 'D1' },
    ],
    goals: [
      { id: '1', type: 'reach', id1: 'C', id2: 'D' },
      { id: '2', type: 'reach', id1: 'C', if_id2: 'Somewhere on the Net' },
      { id: '3', type: 'reach', id1: 'D', if_id2: 'Somewhere on the Net' },
    ],
  },

  // Level 9
  {
    level: 9,
    description: 'Subatomic Particle Grid: 4 hosts (meson, ion, cation, gluon), 2 routers, switch, and Internet. Remember: private subnets cannot traverse the Internet!',
    hosts: [
      { id: 'A', type: 'host', name: 'meson', geometry: '200x220+100+900', img: 'host.png', labelpos: '-50,220' },
      { id: 'B', type: 'host', name: 'ion', geometry: '200x220+100+300', img: 'host.png', labelpos: '190,30' },
      { id: 'C', type: 'host', name: 'cation', geometry: '200x220+1000+800', img: 'host.png', labelpos: '100,220' },
      { id: 'D', type: 'host', name: 'gluon', geometry: '200x220+600+1300', img: 'host.png', labelpos: '190,80' },
      { id: 'R1', type: 'router', name: 'proton', geometry: '200x200+600+500', img: 'router.png', labelpos: '-150,180' },
      { id: 'R2', type: 'router', name: 'boson', geometry: '200x200+600+900', img: 'router.png', labelpos: '-260,100' },
      { id: 'I', type: 'internet', name: 'Internet', geometry: '200x240+900+200', img: 'internet.png', labelpos: '100,200' },
      { id: 'S', type: 'switch', name: 'neutron', geometry: '150x150+200+600', img: 'switch.png', labelpos: '-80,110' },
    ],
    routes: [
      { hid: 'A', rid: 'Ar1', route: '0.0.0.0/0', gate: '[11-126]e.198.[1-254]f.1', route_edit: 'true', gate_edit: 'true' },
      { hid: 'B', rid: 'Br1', route: '8.8.8.8/16', gate: '[e].199.[f].1', route_edit: 'true', gate_edit: 'true' },
      { hid: 'C', rid: 'Cr1', route: '0.0.0.0/0', gate: '10.0.0.254', route_edit: 'false', gate_edit: 'true' },
      { hid: 'D', rid: 'Dr1', route: '10.0.0.0/8', gate: '[11-126]a.[1-254]b.[1-254]c.[1-254]d', route_edit: 'true', gate_edit: 'false' },
      { hid: 'R1', rid: 'R1r1', route: '10.0.0.0/8', gate: '[11-126]j.[1-254]k.14.253', route_edit: 'true', gate_edit: 'true' },
      { hid: 'R1', rid: 'R1r2', route: '192.168.24.12/26', gate: '[j].[k].15.253', route_edit: 'true', gate_edit: 'true' },
      { hid: 'R1', rid: 'R1r3', route: '0.0.0.0/0', gate: '163.172.250.1', route_edit: 'false', gate_edit: 'false' },
      { hid: 'R2', rid: 'R2r1', route: '0.0.0.0/0', gate: '[j].[k].16.254', route_edit: 'false', gate_edit: 'true' },
      { hid: 'I', rid: 'Ir1', route: '[e].198.[f].0/22', gate: '163.172.250.12', route_edit: 'true', gate_edit: 'false' },
      { hid: 'I', rid: 'Ir2', route: '10.0.0.0/27', gate: '163.172.250.12', route_edit: 'true', gate_edit: 'false' },
      { hid: 'I', rid: 'Ir3', route: 'default', gate: '163.172.250.12', route_edit: 'true', gate_edit: 'false' },
    ],
    ifs: [
      { if: 'A1', hid: 'A', ip: '192.168.[1-254]g.2', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '0,-70' },
      { if: 'B1', hid: 'B', ip: '192.168.[1-254]h.42', mask: '255.255.0.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '100,220' },
      { if: 'C1', hid: 'C', ip: '10.0.0.1', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '20,-70' },
      { if: 'D1', hid: 'D', ip: '[j].[k].19.131', mask: '255.255.255.192', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '0,-70' },
      { if: 'R11', hid: 'R1', ip: '192.168.[1-254]i.1', mask: '255.255.255.128', ip_edit: 'true', mask_edit: 'false', type: 'std', pos: '-120,20' },
      { if: 'R12', hid: 'R1', ip: '163.172.250.12', mask: '255.255.255.240', ip_edit: 'false', mask_edit: 'false', type: 'std', pos: '150,20' },
      { if: 'R13', hid: 'R1', ip: '[j].[k].17.254', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '130,180' },
      { if: 'R21', hid: 'R2', ip: '[j].[k].18.253', mask: '255.255.255.252', ip_edit: 'true', mask_edit: 'false', type: 'std', pos: '-120,20' },
      { if: 'R22', hid: 'R2', ip: '10.0.0.254', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '200,80' },
      { if: 'R23', hid: 'R2', ip: '8.8.8.8', mask: '/18', ip_edit: 'true', mask_edit: 'false', type: 'std', pos: '30,180' },
      { if: 'S1', hid: 'S', ip: '0.0.0.0', mask: '/32', ip_edit: 'false', mask_edit: 'false', pos: '0,0', type: 'hidden' },
      { if: 'I1', hid: 'I', ip: '163.172.250.1', mask: '/28', ip_edit: 'false', mask_edit: 'false', pos: '0,0', type: 'hidden' },
    ],
    links: [
      { if1: 'I1', if2: 'R12' },
      { if1: 'R11', if2: 'S1' },
      { if1: 'S1', if2: 'A1' },
      { if1: 'S1', if2: 'B1' },
      { if1: 'R13', if2: 'R21' },
      { if1: 'R22', if2: 'C1' },
      { if1: 'R23', if2: 'D1' },
    ],
    goals: [
      { id: '1', type: 'reach', id1: 'A', id2: 'B' },
      { id: '2', type: 'reach', id1: 'C', id2: 'D' },
      { id: '3', type: 'reach', id1: 'A', id2: 'I' },
      { id: '4', type: 'reach', id1: 'A', id2: 'D' },
      { id: '5', type: 'reach', id1: 'B', id2: 'C' },
      { id: '6', type: 'reach', id1: 'C', id2: 'I' },
    ],
  },

  // Level 10
  {
    level: 10,
    description: 'The Ultimate Challenge: 4 Hosts, 2 Routers, Switch, and Internet with 7 interconnected routing goals. Precise CIDR subnetting is mandatory.',
    hosts: [
      { id: 'H1', type: 'host', name: 'Host one', geometry: '200x220+900+900', img: 'host.png', labelpos: '0,220' },
      { id: 'H2', type: 'host', name: 'Host two', geometry: '200x220+800+300', img: 'host.png', labelpos: '190,30' },
      { id: 'H3', type: 'host', name: 'Host three', geometry: '200x220+600+1300', img: 'host.png', labelpos: '190,100' },
      { id: 'H4', type: 'host', name: 'Host four', geometry: '200x220+100+1300', img: 'host.png', labelpos: '190,100' },
      { id: 'R1', type: 'router', name: 'Router one', geometry: '200x200+400+600', img: 'router.png', labelpos: '-150,180' },
      { id: 'R2', type: 'router', name: 'Router two', geometry: '200x200+400+1000', img: 'router.png', labelpos: '-50,180' },
      { id: 'I', type: 'internet', name: 'Internet', geometry: '200x240+100+250', img: 'internet.png', labelpos: '-50,200' },
      { id: 'S1', type: 'switch', name: 'Switch one', geometry: '150x150+800+600', img: 'switch.png', labelpos: '80,110' },
    ],
    routes: [
      { hid: 'H1', rid: 'H1r1', route: '0.0.0.0/0', gate: '[128-170]a.[1-254]b.[1-254]c.1', route_edit: 'false', gate_edit: 'false' },
      { hid: 'H2', rid: 'H2r1', route: 'default', gate: '[a].[b].[c].1', route_edit: 'false', gate_edit: 'false' },
      { hid: 'H3', rid: 'H3r1', route: '0.0.0.0/0', gate: '10.0.0.254', route_edit: 'false', gate_edit: 'true' },
      { hid: 'H4', rid: 'H4r1', route: 'default', gate: '[a].[b].[c].129', route_edit: 'false', gate_edit: 'false' },
      { hid: 'R1', rid: 'R1r1', route: '10.0.0.0/8', gate: '[a].[b].[c].253', route_edit: 'true', gate_edit: 'false' },
      { hid: 'R1', rid: 'R1r2', route: '[a].[b].[c].128/26', gate: '[a].[b].[c].253', route_edit: 'false', gate_edit: 'false' },
      { hid: 'R1', rid: 'R1r3', route: '0.0.0.0/0', gate: '163.172.250.1', route_edit: 'false', gate_edit: 'false' },
      { hid: 'R2', rid: 'R2r1', route: '0.0.0.0/0', gate: '[a].[b].[c].254', route_edit: 'false', gate_edit: 'false' },
      { hid: 'I', rid: 'Ir1', route: '[a].[b].[c].0/31', gate: '163.172.250.12', route_edit: 'true', gate_edit: 'false' },
    ],
    ifs: [
      { if: 'H11', hid: 'H1', ip: '[a].[b].[c].2', mask: '255.255.255.0', ip_edit: 'false', mask_edit: 'true', type: 'std', pos: '0,-70' },
      { if: 'H21', hid: 'H2', ip: '192.168.42.42', mask: '255.255.0.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '100,220' },
      { if: 'H31', hid: 'H3', ip: '192.168.0.1', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '40,-70' },
      { if: 'H41', hid: 'H4', ip: '[a].[b].[c].131', mask: '255.255.255.192', ip_edit: 'false', mask_edit: 'false', type: 'std', pos: '20,-70' },
      { if: 'R11', hid: 'R1', ip: '[a].[b].[c].1', mask: '255.255.255.128', ip_edit: 'false', mask_edit: 'false', type: 'std', pos: '150,20' },
      { if: 'R12', hid: 'R1', ip: '163.172.250.12', mask: '255.255.255.240', ip_edit: 'false', mask_edit: 'false', type: 'std', pos: '-130,20' },
      { if: 'R13', hid: 'R1', ip: '[a].[b].[c].254', mask: '255.255.255.0', ip_edit: 'false', mask_edit: 'true', type: 'std', pos: '130,180' },
      { if: 'R21', hid: 'R2', ip: '[a].[b].[c].253', mask: '255.255.255.252', ip_edit: 'false', mask_edit: 'false', type: 'std', pos: '0,-50' },
      { if: 'R22', hid: 'R2', ip: '10.0.0.254', mask: '255.255.255.0', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '200,90' },
      { if: 'R23', hid: 'R2', ip: '8.8.8.8', mask: '/18', ip_edit: 'true', mask_edit: 'true', type: 'std', pos: '-180,90' },
      { if: 'S11', hid: 'S1', ip: '0.0.0.0', mask: '/32', ip_edit: 'false', mask_edit: 'false', pos: '0,0', type: 'hidden' },
      { if: 'I1', hid: 'I', ip: '163.172.250.1', mask: '/28', ip_edit: 'false', mask_edit: 'false', pos: '0,0', type: 'hidden' },
    ],
    links: [
      { if1: 'I1', if2: 'R12' },
      { if1: 'R11', if2: 'S11' },
      { if1: 'S11', if2: 'H11' },
      { if1: 'S11', if2: 'H21' },
      { if1: 'R13', if2: 'R21' },
      { if1: 'R22', if2: 'H31' },
      { if1: 'R23', if2: 'H41' },
    ],
    goals: [
      { id: '1', type: 'reach', id1: 'H1', id2: 'H2' },
      { id: '2', type: 'reach', id1: 'H3', id2: 'H4' },
      { id: '3', type: 'reach', id1: 'H1', id2: 'I' },
      { id: '4', type: 'reach', id1: 'H1', id2: 'H4' },
      { id: '5', type: 'reach', id1: 'H2', id2: 'H3' },
      { id: '6', type: 'reach', id1: 'H3', id2: 'I' },
      { id: '7', type: 'reach', id1: 'H4', id2: 'I' },
    ],
  },
];

export function hash_login(login: string): number {
  let seed = 0;
  for (let i = 0; i < login.length; i++) {
    if (i % 2 === 0) seed += 973 * (login.charCodeAt(i) + i);
    else seed += 5 * login.charCodeAt(i) * i;
  }
  return seed;
}

export interface RngState {
  login: string;
  rand_prev: number;
  rand_repl: Record<string, number>;
}

function my_random(a: string, b: string, state: RngState): number {
  if (state.login === '') {
    return Math.round(parseInt(a, 10) + (parseInt(b, 10) - parseInt(a, 10)) * Math.random());
  }
  let prev = state.rand_prev;
  prev ^= prev << 13;
  prev ^= prev >> 17;
  prev ^= prev << 5;
  state.rand_prev = prev;
  prev = (prev & 0x7fffffff) % (parseInt(b, 10) - parseInt(a, 10) + 1);
  return Math.round(parseInt(a, 10) + prev);
}

function random_repl(str: string, state: RngState): string | null {
  const regex1 = /\[(\d+)-(\d+)\]([a-z])/g;
  let res: RegExpExecArray | null;
  let str2 = str;

  while ((res = regex1.exec(str)) !== null) {
    state.rand_repl[res[3]] = my_random(res[1], res[2], state);
    str2 = str2.replace(res[0], '' + state.rand_repl[res[3]]);
  }

  const regex2 = /\[([a-z])\]/g;
  while ((res = regex2.exec(str)) !== null) {
    if (state.rand_repl[res[1]] !== undefined) {
      str2 = str2.replace(res[0], '' + state.rand_repl[res[1]]);
    } else {
      return null;
    }
  }

  if (str2 === 'default') return str2;
  if (/[^\d./]/.test(str2)) return null;
  return str2;
}

export function generate_level(lvlNumber: number, login: string): LevelConfig {
  const raw = RAW_LEVELS.find(l => l.level === lvlNumber) || RAW_LEVELS[0];
  const state: RngState = {
    login: login.trim(),
    rand_prev: lvlNumber + hash_login(login.trim()),
    rand_repl: {},
  };

  // Deep clone
  const hosts: Host[] = JSON.parse(JSON.stringify(raw.hosts));
  const routes: Route[] = JSON.parse(JSON.stringify(raw.routes));
  const ifs: NetworkInterface[] = JSON.parse(JSON.stringify(raw.ifs));
  const links: NetworkLink[] = JSON.parse(JSON.stringify(raw.links));
  const goals: Goal[] = JSON.parse(JSON.stringify(raw.goals));

  // Parse hosts geometry
  hosts.forEach(h => {
    const tab = h.geometry.split(/[^0-9]+/);
    if (tab.length === 4) {
      h.w = parseInt(tab[0], 10);
      h.h = parseInt(tab[1], 10);
      h.x = parseInt(tab[2], 10);
      h.y = parseInt(tab[3], 10);
    }
    const tab2 = h.labelpos.split(',');
    if (tab2.length === 2) {
      h.lx = parseInt(tab2[0], 10);
      h.ly = parseInt(tab2[1], 10);
    }
  });

  // Evaluate routes first (preserves random sequence)
  routes.forEach(r => {
    const routeResolved = random_repl(r.route, state);
    const gateResolved = random_repl(r.gate, state);
    if (routeResolved !== null) r.route = routeResolved;
    if (gateResolved !== null) r.gate = gateResolved;

    const host = hosts.find(h => h.id === r.hid);
    if (host) r.h = host;
  });

  // Evaluate interfaces
  ifs.forEach(itf => {
    const ipResolved = random_repl(itf.ip, state);
    const maskResolved = random_repl(itf.mask, state);
    if (ipResolved !== null) itf.ip = ipResolved;
    if (maskResolved !== null) itf.mask = maskResolved;

    const host = hosts.find(h => h.id === itf.hid);
    if (host) itf.h = host;

    const tab = itf.pos.split(',');
    if (tab.length === 2) {
      itf.dx = parseInt(tab[0], 10);
      itf.dy = parseInt(tab[1], 10);
    }
  });

  // Attach interface and host pointers to links
  links.forEach(l => {
    l.e1 = ifs.find(i => i.if === l.if1);
    l.e2 = ifs.find(i => i.if === l.if2);
    if (l.e1) l.h1 = hosts.find(h => h.id === l.e1!.hid);
    if (l.e2) l.h2 = hosts.find(h => h.id === l.e2!.hid);
  });

  // Prepare goals
  goals.forEach(g => {
    if (g.if_id1) {
      const itf = ifs.find(i => i.if === g.if_id1);
      if (itf) {
        g.h1 = itf.h;
        g.src = g.if_id1;
        g.src_type = 'if';
        g.src_name = 'interface';
      }
    }
    if (!g.src && g.id1) {
      const h = hosts.find(item => item.id === g.id1);
      if (h) {
        g.h1 = h;
        g.src = g.id1;
        g.src_type = 'hid';
        g.src_name = 'host';
      }
    }

    if (g.if_id2) {
      const itf = ifs.find(i => i.if === g.if_id2);
      if (itf) {
        g.h2 = itf.h;
        g.dst = g.if_id2;
        g.dst_type = 'if';
        g.dst_name = 'interface';
      }
    }
    if (!g.dst && g.id2) {
      const h = hosts.find(item => item.id === g.id2);
      if (h) {
        g.h2 = h;
        g.dst = g.id2;
        g.dst_type = 'hid';
        g.dst_name = 'host';
      }
    }
  });

  return {
    level: lvlNumber,
    description: raw.description,
    hosts,
    routes,
    ifs,
    links,
    goals,
  };
}
