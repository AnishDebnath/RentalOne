import React from 'react';
import { ShieldCheck, ExternalLink, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type OwnerCredentialsProps = {
  house: any;
  credentials: any;
  setCredentials: (creds: any) => void;
  isUpdating: boolean;
  onUpdate: (e: React.FormEvent) => void;
};

const OwnerCredentials = ({ house, credentials, setCredentials, isUpdating, onUpdate }: OwnerCredentialsProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[1rem] border border-line shadow-sm overflow-hidden"
    >
      <div className="p-5 border-b border-line bg-slate-50/50">
        <h3 className="text-sm font-black text-ink uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Owner Credentials
        </h3>
        <p className="text-[10px] font-bold text-muted uppercase mt-0.5">Manage client-side login for this house</p>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-1.5">User ID / House ID</label>
              <div className="flex items-center px-4 py-3 bg-slate-50 rounded-xl border border-line/60">
                <span className="text-sm font-black text-ink">{house.house_id}</span>
              </div>
            </div>
            <form onSubmit={onUpdate} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-1.5">Contact Email</label>
                <input
                  type="email"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Enter contact email"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-line outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-muted uppercase tracking-widest mb-1.5">New Password</label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Set new password"
                  className="w-full px-4 py-3 bg-white rounded-xl border border-line outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdating || !credentials.password}
                className="primary-button w-full h-12 flex items-center justify-center gap-2"
              >
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Credentials'}
              </button>
            </form>
          </div>
          <div className="bg-indigo-50/30 rounded-2xl p-5 border border-indigo-100/50 flex flex-col justify-center">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 mb-3">
              <ExternalLink className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-black text-ink leading-tight mb-2">Client Portal Access</h4>
            <p className="text-[11px] font-bold text-muted leading-relaxed">
              House owner logs in at client-side portal with house ID as user ID and password set here.
              They will be able to see their active rentals, history, and financial statements.
            </p>
            <div className="mt-4 pt-4 border-t border-indigo-100/50 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Account is Active
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default OwnerCredentials;
