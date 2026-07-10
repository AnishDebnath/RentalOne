/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Home from './pages/home';

export default function App() {
  return (
    <div className="relative min-h-screen text-slate-900 overflow-x-hidden antialiased select-none bg-slate-50">
      {/* 0. Elegant Global Flow Gradient Background Map */}
      <div className="absolute inset-0 -z-50 pointer-events-none overflow-hidden">
        {/* Continuous Linear Gradient Base */}
        <div className="absolute inset-0 bg-linear-to-b from-[#f8fafc] via-[#eff6ff] to-[#eef2ff]" />

        {/* Soft glowing mesh gradient blobs positioned along the page scroll depth */}
        <div className="absolute top-[3%] left-[10%] w-[60vw] h-[60vw] max-w-200 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute top-[18%] right-[-10%] w-[50vw] h-[50vw] max-w-175 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.06)_0%,transparent_75%)] blur-[120px]" />
        <div className="absolute top-[35%] left-[-15%] w-[55vw] h-[55vw] max-w-187.5 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.06)_0%,transparent_70%)] blur-[110px]" />
        <div className="absolute top-[52%] right-[5%] w-[60vw] h-[60vw] max-w-200 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.07)_0%,transparent_75%)] blur-[130px]" />
        <div className="absolute top-[72%] left-[10%] w-[50vw] h-[50vw] max-w-175 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.05)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute top-[88%] right-[-5%] w-[45vw] h-[45vw] max-w-150 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)] blur-[100px]" />

        {/* Subtle decorative grid watermark with soft radial mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.2]" />
      </div>

      <Home />
    </div>
  );
}
