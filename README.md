# 🌐 NetPractice — Interactive Network Simulation Lab

[![React](https://img.shields.io/badge/React-19.0-blue.svg?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Apache_2.0-green.svg?style=flat-square)](LICENSE)

An interactive, high-fidelity IPv4 networking and subnetting simulator built for students, engineers, and certification candidates. Inspired by the renowned **42 Network Curriculum NetPractice project**, this lab provides a visual canvas, deterministic packet verification engine, and guided networking toolset across 10 progressive levels.

---

## 🚀 Overview

**NetPractice** challenges you to configure IP addresses, subnet masks, default gateways, and static routing tables across complex local networks and internet topologies. Each level simulates bi-directional packet communication between clients, servers, switches, routers, and the public internet.

Whether preparing for the 42 NetPractice exam or brushing up on fundamental CCNA/Network+ skills, this platform offers real-time diagnostics, educational cheat sheets, and automated solvers.

---

## ✨ Features

### 🕹️ Two Distinct Game Modes
- **Training Mode**:
  - Seeded network topologies based on your Intranet login (matching 42 intranet behavior).
  - Progressive access to Levels 1 through 10.
  - Interactive solvers and step-by-step guidance available when needed.
- **Evaluation Mode**:
  - Simulates the strict 42 exam environment.
  - Draws **3 random levels** between Level 6 and Level 10.
  - **15-minute countdown clock** with strict pass/fail criteria.
  - Solvers and hints disabled during evaluation.

### 🧠 Built-In Networking Toolkit
- **Interactive Subnet Calculator**:
  - Enter any IPv4 address and CIDR prefix (or decimal mask).
  - Computes Network ID, Broadcast IP, usable host range, total hosts, and RFC 1918 status.
  - Shows 32-bit binary octet representations for both IP and mask.
  - Quick-select presets (`/24`, `/25`, `/26`, `/27`, `/28`, `/30`).
- **Networking Handbook & Cheat Sheet**:
  - **The 6 Golden Rules of Subnetting** (Direct subnet matching, router isolation, gateway reachability, RFC 1918 boundaries, etc.).
  - **CIDR Reference Table**: Quick reference for prefix sizes, subnet masks, block sizes, and usable addresses (`/8` down to `/30`).
  - **Common Pitfalls Guide**: Explains non-contiguous mask holes, double-dot typos, return-path routing on internet nodes, and default route syntax.
- **Solution & Guided Explanations**:
  - Real-time solver that computes valid IPs and routing entries for any level.
  - Outlines the theoretical reasons behind each required correction.
  - One-click "Apply Solution to Form" for rapid inspection.
- **Simulation Console & Diagnostics Drawer**:
  - Expandable terminal console displaying packet forwarding logs.
  - Individual goal badges (`OK` / `KO`) highlighting which transmission paths succeeded or failed.
  - Copyable plain-text logs for debugging.

### 🎨 UI & UX Polish
- **Light & Dark Mode**: Seamless theme toggle with CSS variable adaptation for dark night sessions or high-contrast daytime study.
- **One-Click Address Copy**: Hover over any locked IP, mask, or route to instantly copy the value to your clipboard.
- **Interactive Network Canvas**:
  - Smooth pan and zoom controls (drag, scroll, fit-to-screen).
  - Dynamic SVG links showing interface connections and status.
  - Highlighting for invalid entries, unroutable paths, and duplicate subnets.

---

## 🗺️ Levels & Curriculum

| Level | Focus Area | Key Concepts |
|---|---|---|
| **Level 1** | Subnet Basics | Matching client and server masks in a single direct segment |
| **Level 2** | Subnet Partitioning | Computing valid host IPs within a `/26` block |
| **Level 3** | Switch Domains | Multi-host local area networks connected via a Layer 2 switch |
| **Level 4** | Subnet Sizing | Choosing the tightest netmask for a required host count |
| **Level 5** | Routing & Gateways | First router hop, default gateways (`0.0.0.0/0`), and routing typos |
| **Level 6** | Router Interface Isolation | Ensuring dual-homed router interfaces never overlap subnets |
| **Level 7** | Multi-Router Forwarding | Next-hop forwarding across chained routers |
| **Level 8** | Complex Mixed Topologies | Asymmetrical subnets, multi-interface routers, and route tables |
| **Level 9** | Public vs. Private Boundaries | RFC 1918 routing limits and Internet interface requirements |
| **Level 10** | Enterprise Topologies | Full multi-tier network with edge routers, local hosts, and return routes |

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Motion](https://motion.dev/)
- **Simulation Engine**: Custom deterministic IPv4 bitwise router & packet tracer (`src/lib/sim.ts`)

---

## 📂 Project Structure

```
netpractice/
├── index.html                   # HTML entry point with metadata tags
├── metadata.json                # Project configuration and capabilities
├── package.json                 # Dependencies and build scripts
├── vite.config.ts               # Vite & Tailwind configuration
├── tsconfig.json                # TypeScript compiler configuration
└── src/
    ├── main.tsx                 # React entry point with runtime safeguards
    ├── App.tsx                  # Main application controller, state & layout
    ├── types.ts                 # Type definitions for nodes, interfaces, routes & sim
    ├── index.css                # Global styles and Light/Dark CSS theme variables
    ├── context/
    │   └── ThemeContext.tsx     # Light/Dark mode state management & persistence
    ├── components/
    │   ├── NetworkCanvas.tsx    # Interactive pan/zoom topology canvas & cards
    │   ├── NetworkIcons.tsx     # Hardware device icons (Client, Server, Router, Switch, Internet)
    │   ├── LevelNavBar.tsx      # Bottom navigation pill with level dots
    │   ├── LogsDrawer.tsx       # Bottom slide-up simulation terminal
    │   ├── SubnetCalculatorModal.tsx # IPv4 & CIDR range inspector
    │   ├── CheatSheetModal.tsx  # Networking handbook, golden rules, and CIDR table
    │   ├── SolutionModal.tsx    # Guided level solver & auto-fill assistant
    │   ├── IntroScreen.tsx      # Welcome screen (Training vs Evaluation mode)
    │   ├── EndScreen.tsx        # Completion trophy screen & next steps
    │   └── ThemeToggle.tsx      # Sun / Moon theme switch button
    └── lib/
        ├── levels.ts            # Level definitions, device coordinates & validation goals
        ├── sim.ts               # Deterministic IPv4 packet simulation & bitwise arithmetic
        └── solver.ts            # Constraint solver computing level solutions
```

---

## 💻 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/netpractice.git
   cd netpractice
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` — Starts Vite development server at `http://localhost:3000`.
- `npm run build` — Compiles TypeScript and creates optimized production assets in `dist/`.
- `npm run preview` — Locally preview the production build.
- `npm run lint` — Runs TypeScript type-checker (`tsc --noEmit`) to verify clean types.

---

## 📖 Key Subnetting Rules Recap

1. **Direct Subnet Match**: Devices on the same switch or wire must share the identical network address (`IP & Mask`).
2. **Reserved Addresses**:
   - **Network ID**: Host bits are all `0`. Cannot be assigned to a device.
   - **Broadcast ID**: Host bits are all `1`. Cannot be assigned to a device.
3. **Router Non-Overlap**: Each interface of a single router must reside in a distinct, non-overlapping subnet.
4. **Gateway Reachability**: A machine's default gateway IP must belong to its local subnet.
5. **Private Subnets (RFC 1918)**:
   - `10.0.0.0/8` (`10.0.0.0` — `10.255.255.255`)
   - `172.16.0.0/12` (`172.16.0.0` — `172.31.255.255`)
   - `192.168.0.0/16` (`192.168.0.0` — `192.168.255.255`)
6. **Return Paths**: Network communication is bi-directional; destination routers need routes pointing back to the origin subnet.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open an issue or submit a pull request.

---

## 📜 License

Distributed under the Apache-2.0 License. See `LICENSE` for more information.
