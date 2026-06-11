import { UserRound, Phone, IdCard, CheckCircle2, LogOut, QrCode, Loader2 } from 'lucide-react';
import { User } from '../../store/AuthContext';

interface AccountHeaderProps {
  user: User;
  onSignOut: () => void;
  onOpenQr: () => void;
}

const AccountHeader = ({ user, onSignOut, onOpenQr }: AccountHeaderProps) => {

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/50 p-6 shadow-sm backdrop-blur-2xl md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:text-left text-center">

          {/* Avatar Group */}
          <div className="relative shrink-0">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-[1.5rem] border-2 border-white bg-gradient-to-br from-primary-light/50 to-blue-50/50 shadow-sm transition-transform duration-300 md:h-28 md:w-28 text-primary">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-10 w-10 md:h-12 md:w-12" />
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-3">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-ink">
                {user.fullName}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-semibold text-muted sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-primary" />
                  {user.phone}
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-muted/40 sm:block" />
                <span className="flex items-center gap-1.5 font-mono tracking-wider">
                  <IdCard className="h-4 w-4 text-primary" />
                  {user.memberId || 'CRH-XXXXXX'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {user.isVerified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/20 bg-warning/10 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-warning">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Review Pending
                </span>
              )}
              <button
                type="button"
                onClick={onSignOut}
                className="inline-flex items-center gap-1.5 rounded-full border border-danger/20 bg-danger/5 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-danger transition-colors hover:bg-danger hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="hidden h-24 w-px rounded-full bg-line/60 md:block" />

        {/* Premium QR Code Section */}
        <div
          className="group relative flex cursor-pointer items-center justify-center rounded-[1.8rem] bg-white/40 p-2.5 shadow-inner backdrop-blur-md transition-all duration-300 border border-white/60 hover:bg-white/60 hover:shadow-sm"
          onClick={onOpenQr}
        >
          <div className="flex items-center gap-4 pr-4 pl-1 min-w-[200px]">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-white p-1 shadow-sm border border-line transition-transform duration-300 group-hover:scale-105">
              <img
                src={user.userQrBase64}
                alt="QR"
                className="h-full w-full object-contain blur-[1px]"
              />
            </div>
            <div className="flex flex-col space-y-1 text-left">
              <p className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-ink whitespace-nowrap">
                <QrCode className="h-4 w-4 text-primary" />
                Rental QR
              </p>
              <p className="text-[10px] md:text-xs font-semibold text-muted">
                Tap to display
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountHeader;
