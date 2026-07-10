/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard, MessageSquare, Mail, Calendar, HardDrive, Cpu,
  Layers, Check, RefreshCw, Smartphone, ShieldCheck, Sparkles
} from 'lucide-react';

export default function Integrations() {
  const [activeNode, setActiveNode] = useState<string | null>('stripe');
  const [connectionStates, setConnectionStates] = useState<Record<string, boolean>>({
    stripe: true,
    whatsapp: true,
    email: false,
    calendar: true,
    storage: false,
    api: true,
  });

  const integrationNodes = [
    {
      id: 'stripe',
      name: 'Stripe Gateway',
      category: 'Payments',
      description: 'Authorize security holding deposits, collect digital card check-ins, and trigger auto-invoicing.',
      icon: <CreditCard className="w-5 h-5 text-primary" />,
      color: 'bg-primary-light border-primary-light text-primary',
      pos: 'lg:top-10 lg:left-10',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      category: 'Communications',
      description: 'Send automated sub-second SMS returns reminders, damage inspection reports, and active dispatch confirmations.',
      icon: <MessageSquare className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      pos: 'lg:top-10 lg:right-10',
    },
    {
      id: 'email',
      name: 'SMTP & SendGrid',
      category: 'Email',
      description: 'Dispatch high-fidelity billing invoices and legally-sealed PDF agreements instantly to customers.',
      icon: <Mail className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200 text-blue-600',
      pos: 'lg:bottom-10 lg:left-10',
    },
    {
      id: 'calendar',
      name: 'Google Calendar',
      category: 'Schedulers',
      description: 'Synchronize active rental checkout blocks and return slots into your logistics calendar.',
      icon: <Calendar className="w-5 h-5 text-rose-500" />,
      color: 'bg-rose-50 border-rose-200 text-rose-500',
      pos: 'lg:bottom-10 lg:right-10',
    },
    {
      id: 'storage',
      name: 'AWS S3 Storage',
      category: 'Cloud Archiving',
      description: 'Back up electronic signatures, liability waivers, and photo-inspections inside an encrypted cloud archive.',
      icon: <HardDrive className="w-5 h-5 text-amber-500" />,
      color: 'bg-amber-50 border-amber-200 text-amber-500',
      pos: 'lg:top-1/2 lg:left-[-40px] lg:-translate-y-1/2',
    },
    {
      id: 'api',
      name: 'Developer API & Webhooks',
      category: 'API Engine',
      description: 'Integrate dispatch triggers directly with custom ERP networks, warehouse robotic hubs, and shipping platforms.',
      icon: <Cpu className="w-5 h-5 text-primary-hover" />,
      color: 'bg-primary-light border-primary-light text-primary-hover',
      pos: 'lg:top-1/2 lg:right-[-40px] lg:-translate-y-1/2',
    },
  ];

  const toggleConnection = (id: string) => {
    setConnectionStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selectedNodeInfo = integrationNodes.find(node => node.id === activeNode);

  return (
    <section id="integrations" className="py-24 bg-transparent relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-slate-50 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary-light text-xs font-semibold text-primary font-mono tracking-tight uppercase mb-4">
            <Smartphone className="w-3.5 h-3.5" /> Connections
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Connect your favorite <span className="bg-linear-to-r from-primary via-secondary to-primary bg-clip-text text-transparent font-display">Tools Semantics</span>
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Unite operations. RentalOne integrates directly with standard payment processing systems, customer notification tools, and legal cloud secure channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Radial visual map (Left column) */}
          <div className="lg:col-span-7 flex items-center justify-center relative min-h-95 md:min-h-110 bg-slate-50/50 rounded-3xl p-6 border border-slate-100/80">

            {/* Center Node (RentalOne) */}
            <div className="z-20 w-24 h-24 rounded-3xl bg-primary border-4 border-white shadow-2xl flex flex-col items-center justify-center text-white relative">
              <Layers className="w-8 h-8" />
              <span className="text-[9px] font-bold tracking-wider uppercase mt-1 font-mono">CORE</span>
              <div className="absolute -inset-1.5 rounded-3xl border border-primary/20 animate-ping pointer-events-none" />
            </div>

            {/* Integration Nodes list */}
            {integrationNodes.map((node) => {
              const isConnected = connectionStates[node.id];
              const isActive = activeNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node.id)}
                  className={`lg:absolute ${node.pos} z-10 m-3 lg:m-0 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${isActive ? 'scale-110' : 'hover:scale-105'
                    }`}
                >
                  <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center relative shadow-sm transition-all ${isActive
                      ? 'bg-slate-950 border-primary shadow-primary/10'
                      : 'bg-white border-slate-200'
                    }`}>
                    {node.icon}

                    {/* Live active connector dot */}
                    {isConnected && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 lg:block hidden">{node.name.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>

          {/* Details & Live Controls Panel (Right column) */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-100 p-6 md:p-8 flex flex-col justify-between min-h-90 text-left">
            <AnimatePresence mode="wait">
              {selectedNodeInfo && (
                <motion.div
                  key={selectedNodeInfo.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-primary bg-primary-light px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {selectedNodeInfo.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${connectionStates[selectedNodeInfo.id] ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                      {connectionStates[selectedNodeInfo.id] ? 'Linked' : 'Disconnected'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{selectedNodeInfo.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{selectedNodeInfo.description}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-slate-200/60 pt-6 mt-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Verified secure authorization channel.
              </span>
              {selectedNodeInfo && (
                <button
                  onClick={() => toggleConnection(selectedNodeInfo.id)}
                  className={`w-full sm:w-auto text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 ${connectionStates[selectedNodeInfo.id]
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100'
                      : 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/10'
                    }`}
                >
                  {connectionStates[selectedNodeInfo.id] ? (
                    <>Disconnect Service</>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Connect Account
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
