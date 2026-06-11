import { motion } from 'framer-motion';
import { User as UserIcon, Phone, Mail, CreditCard, ShieldCheck, Facebook, Instagram, Youtube, ExternalLink, Info, Image as ImageIcon } from 'lucide-react';
import LoadingButton from '../../components/ui/LoadingButton';
import { Link } from 'react-router-dom';

interface UserDetailsStepProps {
  user: any;
  onNext: () => void;
}

const UserDetailsStep = ({ user, onNext }: UserDetailsStepProps) => {
  const sections = [
    {
      title: 'Personal Information',
      fields: [
        { label: 'Full Name', value: user.fullName, Icon: UserIcon },
        { label: 'Phone Number', value: user.phone, Icon: Phone },
        { label: 'Email Address', value: user.email, Icon: Mail },
      ]
    },
    {
      title: 'Identity Verification',
      fields: [
        { label: 'Aadhaar Number', value: user.aadhaarNo || 'Not provided', Icon: CreditCard, docUrl: user.aadhaarDocUrl },
        { label: 'Voter ID', value: user.voterNo || 'Not provided', Icon: ShieldCheck, docUrl: user.voterDocUrl },
      ]
    },
    {
      title: 'Social Connections',
      fields: [
        { label: 'Facebook', value: user.facebook || 'Not connected', Icon: Facebook },
        { label: 'Instagram', value: user.instagram || 'Not connected', Icon: Instagram },
        { label: 'YouTube', value: user.youtube || 'Not connected', Icon: Youtube },
      ]
    }
  ];

  return (
    <motion.section
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className="space-y-6"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white/50 p-6 md:p-8 backdrop-blur-2xl transition-all duration-300 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-1 bg-primary rounded-full" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-ink">Personal Profile</h2>
              <p className="text-xs text-muted font-medium">Verify your registered identification details.</p>
            </div>
          </div>
          <Link
            to="/account?tab=details"
            className="flex items-center gap-2 px-4 py-2 bg-white/60 hover:bg-white border border-line/50 rounded-xl text-[10px] font-bold text-muted hover:text-primary transition-all duration-300 uppercase tracking-widest w-fit"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Edit on Account Page
          </Link>
        </div>

        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] ml-1 opacity-60">{section.title}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.fields.map((field) => (
                  <div key={field.label} className="group flex flex-col bg-white/60 rounded-[1.2rem] border border-white shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="p-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-line text-primary group-hover:text-muted transition-colors shrink-0">
                        <field.Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest truncate">{field.label}</p>
                        <p className="text-sm font-semibold text-ink truncate">{field.value}</p>
                      </div>
                    </div>

                    {field.docUrl && (
                      <div className="px-4 pb-4">
                        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-line bg-slate-50 group-hover:border-primary/20 transition-colors">
                          <img
                            src={field.docUrl}
                            alt={field.label}
                            className="h-full w-full object-cover transition-opacity"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Edit Notice */}
        <div className="mt-10 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[11px] font-medium text-ink/70 leading-relaxed">
            For security, profile changes must be made through your <Link to="/account?tab=details" className="text-primary font-bold hover:underline">Account Settings</Link>. These details will be included in your rental agreement.
          </p>
        </div>

        <div className="mt-6 flex gap-4">
          <LoadingButton onClick={onNext} className="!rounded-2xl !h-14">Verify & Continue</LoadingButton>
        </div>
      </div>
    </motion.section>
  );
};

export default UserDetailsStep;

