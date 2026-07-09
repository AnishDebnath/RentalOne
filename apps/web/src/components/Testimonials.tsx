/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function Testimonials() {
  const row1 = [
    {
      quote: "This rental management software completely transformed how we track our equipment. Inventory management is flawless and we've reduced double-bookings to zero.",
      name: "Brian Ramirez",
      role: "Operations Director",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      quote: "Our rental business has doubled its delivery speed since we started using RentalOne. Setting up a new rental booking takes seconds instead of minutes.",
      name: "David Anderson",
      role: "Logistics Coordinator",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    },
    {
      quote: "The real-time dashboard makes daily rental operations so simple. Our customers love the automated booking confirmations and the smoother pick-up experience.",
      name: "James Carter",
      role: "Gear Supervisor",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
    {
      quote: "An incredible rental management software that keeps our entire inventory organized. Our team saves hours of admin work every single week.",
      name: "Jane Doe",
      role: "Project Director",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    {
      quote: "Managing multiple yards was a logistical nightmare before. Now, our rental business runs smoothly with complete inventory tracking across all our locations.",
      name: "Michael Chen",
      role: "Fleet Manager",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const row2 = [
    {
      quote: "The best tool for our camera rental operations. Tracking gear returns and dispatching packages is fully automated, saving us massive amounts of time.",
      name: "Sarah Lewis",
      role: "Warehouse Lead",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      quote: "Our customers love how fast they can complete a rental booking online. It has completely modernized our local rental store's user experience.",
      name: "John Mitchell",
      role: "Hub Lead",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      quote: "Integrating this rental management software was incredibly easy. Our team adjusted instantly, and we've seen significant growth in active monthly rentals.",
      name: "Daniel Walker",
      role: "IT Director",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    },
    {
      quote: "This rental business platform solved our biggest logistics headache. Inventory management is now completely error-free and our team stays fully coordinated.",
      name: "William Johnson",
      role: "Event Director",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    },
    {
      quote: "Our equipment rental business has never run better. Automated reminders have virtually eliminated late returns and vastly improved our overall customer satisfaction.",
      name: "Joshua Wright",
      role: "Operations Lead",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-transparent relative overflow-hidden">
      {/* Dynamic Background subtle grid and glowing spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-50/20 blur-[100px]" />
      </div>

      <div className="w-full">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-14 px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary-light text-xs font-semibold text-primary font-mono tracking-tight uppercase mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-primary fill-primary" /> Trusted by Operators
          </div>
          
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-black tracking-tight text-slate-950 mb-4 leading-tight"
          >
            Why Rental Businesses Choose <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">RentalOne</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium"
          >
            See how equipment rental shops around the world simplify their daily rental operations, manage inventory, and automate customer bookings with our premium rental management software.
          </motion.p>
        </div>

        {/* Double Row Continuous Sliding Marquee */}
        <div className="relative w-full overflow-hidden flex flex-col gap-8 select-none py-4">
          
          {/* Row 1: Left to Right */}
          <div className="flex overflow-hidden w-full relative">
            <div className="animate-marquee flex gap-6 whitespace-nowrap">
              {row1.map((rev, index) => (
                <div 
                  key={index} 
                  className="w-[320px] md:w-[360px] shrink-0 bg-white border border-slate-100/80 p-6 sm:p-7 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[230px] whitespace-normal transition-all hover:shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <img 
                        src={rev.avatar} 
                        alt={rev.name} 
                        referrerPolicy="no-referrer" 
                        className="w-11 h-11 rounded-full object-cover border border-slate-100 shrink-0" 
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{rev.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{rev.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      "{rev.quote}"
                    </p>
                  </div>
                  <div className="flex gap-1 text-amber-400 pt-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Duplicate for infinite effect */}
              {row1.map((rev, index) => (
                <div 
                  key={`dup1-${index}`} 
                  className="w-[320px] md:w-[360px] shrink-0 bg-white border border-slate-100/80 p-6 sm:p-7 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[230px] whitespace-normal transition-all hover:shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <img 
                        src={rev.avatar} 
                        alt={rev.name} 
                        referrerPolicy="no-referrer" 
                        className="w-11 h-11 rounded-full object-cover border border-slate-100 shrink-0" 
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{rev.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{rev.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      "{rev.quote}"
                    </p>
                  </div>
                  <div className="flex gap-1 text-amber-400 pt-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Right to Left */}
          <div className="flex overflow-hidden w-full relative">
            <div className="animate-marquee-reverse flex gap-6 whitespace-nowrap">
              {row2.map((rev, index) => (
                <div 
                  key={index} 
                  className="w-[320px] md:w-[360px] shrink-0 bg-white border border-slate-100/80 p-6 sm:p-7 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[230px] whitespace-normal transition-all hover:shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <img 
                        src={rev.avatar} 
                        alt={rev.name} 
                        referrerPolicy="no-referrer" 
                        className="w-11 h-11 rounded-full object-cover border border-slate-100 shrink-0" 
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{rev.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{rev.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      "{rev.quote}"
                    </p>
                  </div>
                  <div className="flex gap-1 text-amber-400 pt-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Duplicate for infinite effect */}
              {row2.map((rev, index) => (
                <div 
                  key={`dup2-${index}`} 
                  className="w-[320px] md:w-[360px] shrink-0 bg-white border border-slate-100/80 p-6 sm:p-7 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col justify-between h-[230px] whitespace-normal transition-all hover:shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <img 
                        src={rev.avatar} 
                        alt={rev.name} 
                        referrerPolicy="no-referrer" 
                        className="w-11 h-11 rounded-full object-cover border border-slate-100 shrink-0" 
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-tight">{rev.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{rev.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      "{rev.quote}"
                    </p>
                  </div>
                  <div className="flex gap-1 text-amber-400 pt-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
