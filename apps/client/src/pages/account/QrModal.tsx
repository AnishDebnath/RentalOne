import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, IdCard, Phone, CalendarDays, QrCode, CheckCircle2 } from 'lucide-react';
import { User } from '../../store/AuthContext';

interface QrModalProps {
  show: boolean;
  onClose: (val: boolean) => void;
  user: User;
  memberSince: string;
  lenis: any;
}

const QrModal = ({ show, onClose, user, memberSince, lenis }: QrModalProps) => {


  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[2000]"
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterEnter={() => lenis?.stop()}
          afterLeave={() => lenis?.start()}
        >
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-[400px] overflow-hidden bg-white rounded-[2.5rem] shadow-2xl transition-all md:rounded-[3rem]">
                {/* Top Close Button */}
                <button
                  onClick={() => onClose(false)}
                  className="absolute top-6 right-6 z-10 h-10 w-10 flex items-center justify-center bg-slate-50 border border-line rounded-full text-ink shadow-sm hover:bg-white hover:scale-105 transition-all active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* QR Card Content */}
                <div className="p-8 pt-12 space-y-8 text-center bg-gradient-to-b from-primary/5 to-transparent">
                  {/* Header Info */}
                  <div className="space-y-3">
                    <Dialog.Title as="h2" className="text-2xl font-bold text-ink">
                      {user.fullName}
                    </Dialog.Title>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-3 text-sm font-bold text-ink">
                        <span className="flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-1 text-primary font-mono tracking-wider">
                          <IdCard className="h-3.5 w-3.5 text-primary" />
                          {user.memberId || 'CRH-XXXXXX'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold text-muted font-mono tracking-tight">
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-primary" />
                          {user.phone}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-muted/40" />
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-primary" />
                          {memberSince}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* QR Image with Border Effect */}
                  <div className="relative group mx-auto w-fit">
                    <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-2xl group-hover:bg-primary/10 transition-colors" />
                    <div className="relative p-2 bg-white border border-line rounded-[2rem] shadow-sm">
                      <img
                        src={user.userQrBase64}
                        alt="User QR Identity"
                        className="h-56 w-56 md:h-60 md:w-60 object-cover rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Footer Instruction */}
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-1">
                      <QrCode className="h-6 w-6 text-primary mb-1" />
                      <p className="text-sm font-bold text-ink">User Identity QR</p>
                      <p className="text-xs font-medium text-muted">Show this at the counter for quick verification</p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase text-success">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified Identity
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default QrModal;
