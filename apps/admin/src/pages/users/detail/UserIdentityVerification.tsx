import React from 'react';
import { IdCard, Hash, Image as ImageIcon } from 'lucide-react';
import { optimizeImageUrl } from '@camera-rental-house/ui';

type UserIdentityVerificationProps = {
  user: any;
  isChanged: (field: string) => boolean;
};

const UserIdentityVerification = ({ user, isChanged }: UserIdentityVerificationProps) => {
  return (
    <section className="bg-white rounded-[1rem] border border-line shadow-sm p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-line pb-3">
        <IdCard className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-ink">Identity Verification</h2>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {/* Aadhaar Card */}
        <div
          className={`rounded-card border p-4 flex flex-col gap-4 bg-white transition-all ${isChanged('aadhaar_no') || isChanged('aadhaar_doc_url')
            ? 'border-amber-400 ring-2 ring-amber-400/30'
            : 'border-line'
            }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-ink">Aadhaar Card</p>
            {(isChanged('aadhaar_no') || isChanged('aadhaar_doc_url')) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white animate-pulse">
                Changed
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 ml-1">
              <Hash className="h-3 w-3 text-tertiary" />
              <p className="text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase leading-none mt-0.5">
                Document Number
              </p>
            </div>
            <div className="h-11 flex items-center px-4 rounded-xl border border-line bg-slate-50/50 text-sm font-semibold text-ink">
              {user.aadhaar_no || <span className="text-muted/60">Not provided</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 ml-1">
              <ImageIcon className="h-3 w-3 text-tertiary" />
              <p className="text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase leading-none mt-0.5">
                Digital Copy
              </p>
            </div>
            <div className="rounded-xl border-2 border-white shadow-sm overflow-hidden bg-slate-50">
              {user.aadhaar_signed_url ? (
                <img src={optimizeImageUrl(user.aadhaar_signed_url)} alt="Aadhaar" loading="lazy" className="w-full object-contain" />
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 text-slate-400">
                  <IdCard className="h-6 w-6 opacity-40" />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Not Uploaded</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Voter ID */}
        <div
          className={`rounded-card border p-4 flex flex-col gap-4 bg-white transition-all ${isChanged('voter_no') || isChanged('voter_doc_url')
            ? 'border-amber-400 ring-2 ring-amber-400/30'
            : 'border-line'
            }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-ink">Voter ID</p>
            {(isChanged('voter_no') || isChanged('voter_doc_url')) && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white animate-pulse">
                Changed
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 ml-1">
              <Hash className="h-3 w-3 text-tertiary" />
              <p className="text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase leading-none mt-0.5">
                Document Number
              </p>
            </div>
            <div className="h-11 flex items-center px-4 rounded-xl border border-line bg-slate-50/50 text-sm font-semibold text-ink">
              {user.voter_no || <span className="text-muted/60">Not provided</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 ml-1">
              <ImageIcon className="h-3 w-3 text-tertiary" />
              <p className="text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase leading-none mt-0.5">
                Digital Copy
              </p>
            </div>
            <div className="rounded-xl border-2 border-white shadow-sm overflow-hidden bg-slate-50">
              {user.voter_signed_url ? (
                <img src={optimizeImageUrl(user.voter_signed_url)} alt="Voter card" loading="lazy" className="w-full object-contain" />
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 text-slate-400">
                  <IdCard className="h-6 w-6 opacity-40" />
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Not Uploaded</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserIdentityVerification;
