import { UserRound, Pencil, X, IdCard, ExternalLink, User as UserIcon, Phone, Mail, Facebook, Instagram, Youtube, Hash, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import LoadingButton from '../../components/ui/LoadingButton';
import { User } from '../../store/AuthContext';
import { compressImage, useToast } from '@rentalone/ui';

interface AccountDetailsTabProps {
  draft: User;
  editing: boolean;
  loading: boolean;
  hasActiveRentals: boolean;
  activeRentals?: any[];
  onSetEditing: (val: any) => void;
  onDraftChange: (key: string, value: string) => void;
  onSave: () => void;
  errors?: Record<string, string>;
}

const AccountDetailsTab = ({ 
  draft, 
  editing, 
  loading, 
  hasActiveRentals,
  activeRentals = [],
  onSetEditing, 
  onDraftChange, 
  onSave,
  errors = {}
}: AccountDetailsTabProps) => {
  const { addToast } = useToast();
  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const voterInputRef = useRef<HTMLInputElement>(null);
  
  const [compressing, setCompressing] = useState<Record<string, boolean>>({
    aadhaar: false,
    voter: false
  });
  
  const hasOverdueUnreturned = activeRentals.some(rental => {
    const isReleased = (rental.products || []).some(
      (item: any) => item.status === 'released'
    );
    const isOverdue = new Date().setHours(0,0,0,0) > new Date(rental.event_date).setHours(0,0,0,0);
    return isReleased && isOverdue;
  });

  const sections = [
    {
      title: 'Personal Information',
      icon: UserRound,
      fields: [
        ['Full name', 'fullName', 'text', UserIcon],
        ['Phone Number', 'phone', 'tel', Phone],
        ['Email Address', 'email', 'email', Mail],
      ]
    },
    {
      title: 'Identity Verification',
      icon: IdCard,
      fields: [
        ['Aadhaar Number', 'aadhaarNo', 'text'],
        ['Voter ID', 'voterNo', 'text'],
      ]
    },
    {
      title: 'Social Connections',
      icon: ExternalLink,
      fields: [
        ['Facebook Profile', 'facebook', 'url', Facebook],
        ['Instagram Profile', 'instagram', 'url', Instagram],
        ['YouTube Channel', 'youtube', 'url', Youtube],
      ]
    }
  ] as const;

  const handleFileChange = async (key: 'aadhaarDoc' | 'voterDoc', file: File | null) => {
    if (!file) return;

    const typeKey = key === 'aadhaarDoc' ? 'aadhaar' : 'voter';
    setCompressing(prev => ({ ...prev, [typeKey]: true }));

    try {
      // 1. Show immediate preview (as base64 or blob URL)
      const previewUrl = URL.createObjectURL(file);
      onDraftChange(`${key}Url`, previewUrl); // Temporarily update URL for preview
      
      // 2. Compress the image
      const compressed = await compressImage(file);
      
      // 3. Update the draft with the (compressed) file object
      // The updateProfile function should handle FormData if it sees File objects
      onDraftChange(key, compressed as any);
      
      // Update preview with compressed version
      const compressedUrl = URL.createObjectURL(compressed);
      onDraftChange(`${key}Url`, compressedUrl);

      addToast({ title: 'Image Optimized', message: 'Ready to upload.', tone: 'success' });
    } catch (err) {
      console.error('File processing error:', err);
      addToast({ title: 'Upload Failed', message: 'Could not process the image.', tone: 'error' });
    } finally {
      setCompressing(prev => ({ ...prev, [typeKey]: false }));
    }
  };
  
  const ErrorMessage = () => {
    const errorValues = Object.values(errors);
    if (errorValues.length === 0) return null;
    
    const displayMessage = errors.general || errorValues[0];

    return (
      <div className="mb-6 rounded-2xl bg-danger/5 border border-danger/20 p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-danger leading-relaxed">
          {displayMessage}
        </p>
      </div>
    );
  };

  const ActiveRentalWarning = () => {
    if (hasOverdueUnreturned) {
      return (
        <div className="mb-6 rounded-2xl bg-danger/10 border border-danger/20 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-danger">Overdue Unreturned Gear Warning</p>
            <p className="text-xs font-medium text-danger/80 leading-relaxed">
              You have rentals that are overdue and have not been returned yet. Please return all products to the rental house immediately. Profile editing is disabled until they are returned.
            </p>
          </div>
        </div>
      );
    }
    if (!hasActiveRentals) return null;
    return (
      <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-amber-900">Active Rentals Detected</p>
          <p className="text-xs font-medium text-amber-700 leading-relaxed">
            You cannot update your profile details while you have ongoing rentals. Please return all gear before making changes.
          </p>
        </div>
      </div>
    );
  };

  return (
    <section className="animate-fade-up space-y-4 md:space-y-6">
      <ErrorMessage />
      <ActiveRentalWarning />
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-line/40 pb-3 px-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-ink">Account Details</h2>
          <p className="mt-0.5 text-xs md:text-sm font-medium text-muted">
            Manage your personal information and verified documents.
          </p>
        </div>
        <button
          type="button"
          disabled={hasActiveRentals}
          onClick={() => onSetEditing((c: any) => !c)}
          className={`flex h-[2.25rem] md:h-[2.5rem] w-fit items-center justify-center rounded-xl px-4 md:px-5 text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] transition-all duration-300 shadow-sm disabled:opacity-50 ${
            editing 
              ? 'bg-danger/10 text-danger hover:bg-danger/20 border border-danger/20' 
              : 'bg-white text-ink hover:text-primary hover:shadow-md border border-white/60'
          }`}
        >
          {editing ? (
            <><X className="mr-1.5 h-3.5 w-3.5 md:h-4 md:w-4" /> Cancel</>
          ) : (
            <><Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit Profile</>
          )}
        </button>
      </div>

      <div className="rounded-[2.5rem] border border-white bg-white/50 p-5 backdrop-blur-2xl md:p-8 shadow-sm">
        <ErrorMessage />
        
        <div className="flex flex-col gap-12 pt-2 md:pt-4">
          {sections.map((section, index) => (
            <div 
              key={section.title} 
              className="flex flex-col gap-5"
            >
              {/* Top Row: Context */}
              <div className="w-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[0.8rem] bg-white text-primary shadow-sm border border-black/5">
                    <section.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-ink">{section.title}</h3>
                </div>
                <p className="text-sm font-medium leading-relaxed text-muted/70">
                  {index === 0 ? "Update your fundamental contact details and name." 
                   : index === 1 ? "Ensure your identity documents are accurate." 
                   : "Link your profiles to build trust within the community."}
                </p>
              </div>
              
              {/* Downside Details: Fields */}
              <div className="w-full pt-1">
                {section.title === 'Identity Verification' ? (
                  <div className="grid gap-5 xl:grid-cols-2">
                    {['aadhaarNo', 'voterNo'].map((key) => {
                      const label = key === 'aadhaarNo' ? 'Aadhaar Card' : 'Voter ID';
                      const docUrl = key === 'aadhaarNo' ? draft.aadhaarDocUrl : draft.voterDocUrl;
                      const value = (draft as any)[key] || '';
                      
                      return (
                      <div key={key} className="flex flex-col bg-white/60 rounded-[1.2rem] border border-white shadow-sm overflow-hidden">
                          <div className="flex items-center justify-between px-5 pt-5 pb-1">
                            <h4 className="text-sm font-bold text-ink">{label}</h4>
                            <span className="text-[9px] font-bold text-tertiary uppercase tracking-widest px-2 py-0.5 rounded border border-black/5 bg-white">Document</span>
                          </div>

                          <div className="px-5 pb-5 pt-3 flex flex-col gap-5">
                            <div className="w-full space-y-1.5">
                              <div className="flex items-center gap-1.5 ml-1">
                                <Hash className="h-3 w-3 text-tertiary" />
                                <label className="text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase leading-none mt-0.5">
                                  Document Number
                                </label>
                              </div>
                              <div className={`h-11 overflow-hidden rounded-xl transition-all shadow-sm flex items-center px-4 border ${
                                editing 
                                  ? (errors[key] ? 'bg-white border-danger/40 ring-2 ring-danger/5' : 'bg-white border-black/15 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10') 
                                  : 'bg-white/40 border-black/5 opacity-90'
                              }`}>
                                <input
                                  disabled={!editing}
                                  type="text"
                                  value={value}
                                  onChange={(e) => {
                                    let val = e.target.value;
                                    if (key === 'aadhaarNo') {
                                      val = val.replace(/\D/g, '').slice(0, 12);
                                    } else if (key === 'voterNo') {
                                      val = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
                                    }
                                    onDraftChange(key, val);
                                  }}
                                  className={`w-full bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 ${
                                     editing ? 'text-ink placeholder:text-muted/40' : 'text-ink/90 cursor-default'
                                  }`}
                                  placeholder={editing ? "Enter number" : "Not provided"}
                                />
                              </div>
                              {editing && errors[key] && (
                                <p className="text-[10px] font-bold text-danger ml-1 mt-1">{errors[key]}</p>
                              )}
                            </div>
                            
                            <div className="w-full">
                              <p className="mb-1.5 text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase ml-1">Digital Copy</p>
                              <div className="group/img relative w-full overflow-hidden rounded-xl border-2 border-white shadow-sm bg-slate-50">
                                {docUrl ? (
                                  <img 
                                    src={docUrl} 
                                    alt={label} 
                                    className="w-full h-auto object-contain"
                                  />
                                ) : (
                                  <div className="flex aspect-[1.6/1] w-full flex-col items-center justify-center gap-2 text-slate-300">
                                    <ImageIcon className="h-6 w-6 opacity-40" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">No File</span>
                                  </div>
                                )}
                                
                                {editing && (
                                  <div className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all ${compressing[key === 'aadhaarNo' ? 'aadhaar' : 'voter'] ? 'opacity-100' : 'opacity-0 group-hover/img:opacity-100'}`}>
                                    {compressing[key === 'aadhaarNo' ? 'aadhaar' : 'voter'] ? (
                                      <div className="flex flex-col items-center gap-2 text-white">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Optimizing...</span>
                                      </div>
                                    ) : (
                                      <button 
                                        type="button"
                                        onClick={() => (key === 'aadhaarNo' ? aadhaarInputRef : voterInputRef).current?.click()}
                                        className="flex text-[10px] uppercase tracking-widest font-bold text-ink shadow-sm items-center gap-1.5 bg-white hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors"
                                      >
                                        <Pencil className="h-3 w-3" /> Update Photo
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                              <input 
                                ref={key === 'aadhaarNo' ? aadhaarInputRef : voterInputRef}
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={(e) => handleFileChange(key === 'aadhaarNo' ? 'aadhaarDoc' : 'voterDoc', e.target.files?.[0] || null)}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 bg-white/60 p-5 rounded-[1.2rem] border border-white shadow-sm">
                    {section.fields.map((field) => {
                      const [label, key, type, Icon] = field as any;
                      const value = (draft as any)?.[key] || '';
                      return (
                        <div key={key} className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 ml-1">
                            {Icon && <Icon className="h-3 w-3 text-tertiary" />}
                            <label className="text-[10px] font-bold tracking-[0.1em] text-tertiary uppercase leading-none mt-0.5">
                              {label as string}
                            </label>
                          </div>
                          <div className={`h-11 overflow-hidden rounded-xl transition-all shadow-sm flex items-center px-4 border ${
                            editing 
                              ? (errors[key] ? 'bg-white border-danger/40 ring-2 ring-danger/5' : 'bg-white border-black/15 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10') 
                              : 'bg-white/40 border-black/5 opacity-90'
                          }`}>
                            <input
                              disabled={!editing}
                              type={type}
                              value={value}
                              onChange={(e) => {
                                let val = e.target.value;
                                if (key === 'phone') {
                                  val = val.replace(/\D/g, '').slice(0, 10);
                                }
                                onDraftChange(key, val);
                              }}
                              className={`w-full bg-transparent border-none p-0 text-sm font-semibold focus:ring-0 ${
                                 editing ? 'text-ink placeholder:text-muted/40' : 'text-ink/90 cursor-default'
                              }`}
                              placeholder={editing ? `Add ${label.toLowerCase()}` : 'Not provided'}
                            />
                          </div>
                          {editing && errors[key] && (
                            <p className="text-[10px] font-bold text-danger ml-1 mt-1">{errors[key]}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {editing && <div className="mt-6"><ErrorMessage /></div>}

        {editing && (
          <div className="flex mt-4">
            <LoadingButton
              loading={loading || Object.values(compressing).some(v => v)}
              onClick={onSave}
              className="!h-12 !min-h-0 w-full rounded-xl text-xs md:text-sm font-bold sm:w-fit sm:px-12 shadow-sm"
            >
              {Object.values(compressing).some(v => v) ? 'Processing Images...' : 'Save Changes'}
            </LoadingButton>
          </div>
        )}
      </div>
    </section>
  );
};

export default AccountDetailsTab;
