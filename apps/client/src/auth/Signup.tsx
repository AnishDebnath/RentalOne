import { ArrowLeft, Eye, EyeOff, Upload, User, Phone, Mail, Lock, Camera, ArrowRight, ShieldCheck, Share2, IdCard, Facebook, Instagram, Youtube, FileText, Image, AlertCircle } from 'lucide-react';
import { type FormEvent, useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import LoadingButton from '../components/ui/LoadingButton';
import clsx from 'clsx';
import { useAuth } from '../store/AuthContext';
import { useToast, compressImage } from '@camera-rental-house/ui';
import axiosInstance from '../api/axiosInstance';

type UploadKey = 'aadhaarDoc' | 'voterDoc' | 'selfie';

type UploadFile = {
  file: File;
  preview: string;
};

const signupFields = [
  { key: 'fullName', label: 'Full Name', placeholder: 'Enter your full name', icon: User },
  { key: 'phone', label: 'Phone Number', placeholder: '10 digit phone number', icon: Phone },
  { key: 'email', label: 'Email Address', placeholder: 'Enter your email address', icon: Mail },
] as const;

const socialFields = [
  { key: 'facebook', label: 'Facebook Profile', icon: Facebook },
  { key: 'instagram', label: 'Instagram Profile', icon: Instagram },
  { key: 'youtube', label: 'YouTube Channel (Optional)', icon: Youtube },
] as const;

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState<Record<UploadKey, boolean>>({
    aadhaarDoc: false,
    voterDoc: false,
    selfie: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadhaarNo: '',
    voterNo: '',
    facebook: '',
    instagram: '',
    youtube: '',
  });

  const [files, setFiles] = useState<Record<UploadKey, UploadFile | null>>({
    aadhaarDoc: null,
    voterDoc: null,
    selfie: null,
  });

  const storageRefAadhaar = useRef<HTMLInputElement>(null);
  const cameraRefAadhaar = useRef<HTMLInputElement>(null);
  const storageRefVoter = useRef<HTMLInputElement>(null);
  const cameraRefVoter = useRef<HTMLInputElement>(null);
  const cameraRefSelfie = useRef<HTMLInputElement>(null);

  const handleFile = async (key: UploadKey, file?: File) => {
    if (file) {
      // 1. Show immediate preview for better UX
      const initialPreview = URL.createObjectURL(file);
      setFiles((current) => ({
        ...current,
        [key]: { file, preview: initialPreview }
      }));
      if (Object.keys(errors).length > 0) setErrors({});

      // 2. Compress in the background
      setCompressing(prev => ({ ...prev, [key]: true }));
      try {
        const compressed = await compressImage(file) as File;

        // Only update if we actually got a different file (e.g. was compressed)
        if (compressed !== file) {
          const compressedPreview = URL.createObjectURL(compressed);
          setFiles((current) => {
            // Revoke the old preview URL to save memory
            const old = current[key];
            if (old && old.preview === initialPreview) {
              URL.revokeObjectURL(initialPreview);
            }

            return {
              ...current,
              [key]: { file: compressed, preview: compressedPreview }
            };
          });
        }
      } catch (err) {
        console.error('Compression background error:', err);
      } finally {
        setCompressing(prev => ({ ...prev, [key]: false }));
      }
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!form.fullName) newErrors.fullName = "Full Name is required";
      if (!form.phone) newErrors.phone = "Phone Number is required";
      else if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Invalid phone number";

      if (!form.email) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@gmail\.com$/.test(form.email)) newErrors.email = "Invalid email address";

      if (!form.password) newErrors.password = "Password is required";
      else if (form.password.length < 6) newErrors.password = "Minimum 6 characters";

      if (!form.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
      else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Password doesn't match";
    }

    if (currentStep === 1) {
      if (!form.aadhaarNo) newErrors.aadhaarNo = "Aadhaar Number is required";
      else if (!/^\d{12}$/.test(form.aadhaarNo.replace(/-/g, ''))) newErrors.aadhaarNo = "Invalid Aadhaar number";

      if (!files.aadhaarDoc) newErrors.aadhaarDoc = "Upload Aadhaar photo";

      if (!form.voterNo) newErrors.voterNo = "Voter ID is required";
      else if (form.voterNo.length < 10) newErrors.voterNo = "Invalid Voter ID";

      if (!files.voterDoc) newErrors.voterDoc = "Upload Voter Card photo";
    }

    if (currentStep === 2) {
      if (!form.facebook) newErrors.facebook = "Facebook URL is required";
      else if (!/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/.+/.test(form.facebook)) newErrors.facebook = "Invalid Facebook URL";

      if (!form.instagram) newErrors.instagram = "Instagram URL is required";
      else if (!/^(https?:\/\/)?(www\.)?instagram\.com\/.+/.test(form.instagram) && !/^@?[a-zA-Z0-9._]+$/.test(form.instagram)) newErrors.instagram = "Invalid Instagram URL";

      if (form.youtube && !/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(form.youtube)) {
        newErrors.youtube = "Invalid YouTube URL";
      }
    }

    if (currentStep === 3) {
      if (!files.selfie) newErrors.selfie = "Profile capture is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async (nextStep: number) => {
    if (!validateStep(step)) return;

    // Additional backend check for existing users at relevant steps
    if (step === 0 || step === 1) {
      setLoading(true);
      try {
        const payload: any = {};
        if (step === 0) {
          payload.email = form.email;
          payload.phone = form.phone;
        } else if (step === 1) {
          payload.aadhaarNo = form.aadhaarNo;
          payload.voterNo = form.voterNo;
        }

        const response = await axiosInstance.post('/auth/check-exists', payload);
        if (response.data.exists === false) {
          setStep(nextStep);
        }
      } catch (error: any) {
        console.error('Verification Error:', error);
        const fieldErrors = error.fieldErrors || error.response?.data?.fieldErrors;
        const message = error.message || error.response?.data?.message || 'Verification failed';
        const toastMessage = fieldErrors && Object.keys(fieldErrors).length > 0 ? 'This user is already registered.' : message;
        addToast({ title: 'Registration Failed', message: toastMessage, tone: 'error' });
        if (fieldErrors && Object.keys(fieldErrors).length > 0) {
          setErrors({ general: message, ...fieldErrors });
        } else {
          const lowercaseMsg = message.toLowerCase();

          if (lowercaseMsg.includes('email')) setErrors(prev => ({ ...prev, email: message }));
          else if (lowercaseMsg.includes('phone')) setErrors(prev => ({ ...prev, phone: message }));
          else if (lowercaseMsg.includes('aadhaar')) setErrors(prev => ({ ...prev, aadhaarNo: message }));
          else if (lowercaseMsg.includes('voter')) setErrors(prev => ({ ...prev, voterNo: message }));
          else {
            setErrors(prev => ({ ...prev, general: message }));
          }
        }
      } finally {
        setLoading(false);
      }
    } else {
      const isStillCompressing = Object.values(compressing).some(val => val);
      if (isStillCompressing) {
        addToast({ title: 'Processing Image', message: 'Please wait, we are optimizing your photos for upload.', tone: 'info' });
        return;
      }
      setStep(nextStep);
    }
  };

  const { signup } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStep(step)) return;

    if (Object.values(compressing).some(v => v)) {
      addToast({ title: 'Processing Image', message: 'Still optimizing your photo. Please wait a second.', tone: 'info' });
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const formData = new FormData();

      // Append form fields
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append files
      if (files.aadhaarDoc) formData.append('aadhaarDoc', files.aadhaarDoc.file);
      if (files.voterDoc) formData.append('voterDoc', files.voterDoc.file);
      if (files.selfie) formData.append('selfie', files.selfie.file);

      await signup(formData);
      navigate('/');
    } catch (error: any) {
      console.error('Signup Error:', error);
      const fieldErrors = error.fieldErrors || error.response?.data?.fieldErrors;
      const message = error.message || error.response?.data?.message || 'Something went wrong. Please check your connection.';
      const toastMessage = fieldErrors && Object.keys(fieldErrors).length > 0 ? 'This user is already registered.' : message;
      addToast({ title: 'Registration Failed', message: toastMessage, tone: 'error' });
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        setErrors({ general: message, ...fieldErrors });
        if (fieldErrors.email || fieldErrors.phone) setStep(0);
        else if (fieldErrors.aadhaarNo || fieldErrors.voterNo) setStep(1);
      } else {

        // Map common backend errors to specific fields
        if (message.includes('Email')) {
          setErrors({ email: message });
          setStep(0); // Jump to step 0 for email
        } else if (message.includes('Phone number')) {
          setErrors({ phone: message });
          setStep(0); // Jump to step 0 for phone
        } else if (message.includes('Aadhaar')) {
          setErrors({ aadhaarNo: message });
          setStep(1); // Jump to step 1 for Aadhaar
        } else if (message.includes('Voter ID')) {
          setErrors({ voterNo: message });
          setStep(1); // Jump to step 1 for Voter ID
        } else {
          setErrors({ general: message });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const StepErrorMessage = () => {
    const errorMessages = Object.values(errors);

    if (errorMessages.length === 0) return null;

    let displayMessage = errors.general || errorMessages[0];
    if (displayMessage === "error") displayMessage = errors.general || "Please check the highlighted fields.";

    return (
      <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
        <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
        <div className="text-xs font-bold text-red-600 leading-tight">
          {displayMessage}
        </div>
      </div>
    );
  };

  const titleForStep = ["Personal Info", "Identity Verification", "Social Connection", "Profile Picture"];
  const iconForStep = [User, ShieldCheck, Share2, Camera];
  const ActiveIcon = iconForStep[step];

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-[500px] relative group px-2">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/15 via-primary/5 to-primary/15 rounded-[40px] blur-xl opacity-50 transition duration-1000" />

        <div className="relative rounded-[32px] border border-white/60 bg-white/70 backdrop-blur-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => (step ? setStep((current) => current - 1) : navigate(-1))}
            className="absolute top-6 left-6 flex h-10 w-10 items-center justify-center rounded-[14px] bg-white border border-slate-100 text-slate-500 hover:text-primary shadow-[0_8px_16px_rgba(0,0,0,0.06)] transition-all active:scale-90 z-10"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>

          <div className="absolute top-8 right-8 flex items-center gap-1">
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} className={clsx("h-1.5 rounded-full transition-all duration-300", idx === step ? "w-6 bg-primary" : "w-1.5 bg-slate-200")} />
            ))}
          </div>

          <div className="absolute -top-24 -right-24 h-48 w-48 bg-primary/10 blur-[60px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-primary/5 blur-[50px] rounded-full" />

          <div className="relative mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] bg-white shadow-lg ring-1 ring-black/[0.05]">
              <ActiveIcon className="h-7 w-7 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-ink leading-tight">Create Account</h1>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">Step {step + 1}: {titleForStep[step]}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 0 && (
              <div className="space-y-4">
                {signupFields.map(({ key, label, placeholder, icon: Icon }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </label>
                    <div className="relative">
                      {key === 'phone' && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 border-r border-slate-100 pr-3 mr-3">+91</div>
                      )}
                      <input
                        type={key === 'phone' ? 'tel' : 'text'}
                        inputMode={key === 'phone' ? 'numeric' : 'text'}
                        value={form[key]}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (key === 'phone') {
                            val = val.replace(/\D/g, '').slice(0, 10);
                          }
                          setForm((curr) => ({ ...curr, [key]: val }));
                          if (Object.keys(errors).length > 0) setErrors({});
                        }}
                        className={clsx("w-full h-11 px-4 rounded-xl bg-white/50 border outline-none transition-all focus:ring-4 focus:ring-primary/5 placeholder:text-slate-400 text-sm",
                          errors[key] ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-primary/50",
                          key === 'phone' ? "pl-[72px]" : ""
                        )}
                        placeholder={placeholder}
                      />
                    </div>
                  </div>
                ))}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><Lock className="h-3.5 w-3.5" />Create Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => {
                          setForm((curr) => ({ ...curr, password: e.target.value }));
                          if (Object.keys(errors).length > 0) setErrors({});
                        }}
                        className={clsx("w-full h-11 pl-4 pr-11 rounded-xl bg-white/50 border outline-none transition-all focus:ring-4 focus:ring-primary/5 text-sm",
                          errors.password ? "border-red-400" : "border-slate-200"
                        )}
                        placeholder="Enter your password"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><Lock className="h-3.5 w-3.5" />Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={(e) => {
                          setForm((curr) => ({ ...curr, confirmPassword: e.target.value }));
                          if (Object.keys(errors).length > 0) setErrors({});
                        }}
                        className={clsx("w-full h-11 pl-4 pr-11 rounded-xl bg-white/50 border outline-none transition-all focus:ring-4 focus:ring-primary/5 text-sm",
                          errors.confirmPassword ? "border-red-400" : "border-slate-200"
                        )}
                        placeholder="Enter your confirm password"
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <StepErrorMessage />
                  <LoadingButton type="button" loading={loading} onClick={() => handleNext(1)} className="w-full h-11 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/10 hover:shadow-lg transition-all">Next Step</LoadingButton>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><IdCard className="h-3.5 w-3.5" />Aadhaar Number</label>
                    <input
                      value={form.aadhaarNo}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                        setForm((curr) => ({ ...curr, aadhaarNo: val }));
                        if (Object.keys(errors).length > 0) setErrors({});
                      }}
                      className={clsx("w-full h-11 px-4 rounded-xl bg-white/50 border outline-none transition-all focus:ring-4 focus:ring-primary/5 text-sm",
                        errors.aadhaarNo ? "border-red-400" : "border-slate-200"
                      )}
                      placeholder="12 digit Aadhaar number"
                    />
                  </div>
                  <div className="space-y-3">
                    <span className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><FileText className="h-3.5 w-3.5" />Aadhaar Card Photo</span>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => storageRefAadhaar.current?.click()} className={clsx("flex h-11 items-center justify-center gap-2 rounded-xl border border-dashed transition-all hover:bg-slate-50 text-xs font-bold text-slate-600", errors.aadhaarDoc ? "border-red-400 text-red-400 bg-red-50/50" : "border-slate-200 bg-white")}>
                        <Image className="h-4 w-4" /> From Storage
                      </button>
                      <button type="button" onClick={() => cameraRefAadhaar.current?.click()} className={clsx("flex h-11 items-center justify-center gap-2 rounded-xl border border-dashed transition-all hover:bg-slate-50 text-xs font-bold text-slate-600", errors.aadhaarDoc ? "border-red-400 text-red-400 bg-red-50/50" : "border-slate-200 bg-white")}>
                        <Camera className="h-4 w-4" /> Take Photo
                      </button>
                    </div>
                    {files.aadhaarDoc && (
                      <div className="relative mt-2 rounded-2xl overflow-hidden aspect-[3/4] border border-slate-100 shadow-sm transition-all animate-in fade-in zoom-in duration-300">
                        <img src={files.aadhaarDoc.preview} className="w-full h-full object-cover" alt="Preview" />
                        <button type="button" onClick={() => setFiles({ ...files, aadhaarDoc: null })} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur-md flex items-center justify-center text-sm">✕</button>
                      </div>
                    )}
                    <input ref={storageRefAadhaar} type="file" accept="image/*" className="hidden" onChange={(e) => { handleFile('aadhaarDoc', e.target.files?.[0]); e.target.value = ''; }} />
                    <input ref={cameraRefAadhaar} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { handleFile('aadhaarDoc', e.target.files?.[0]); e.target.value = ''; }} />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100/50">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><IdCard className="h-3.5 w-3.5" />Voter ID Number</label>
                    <input
                      value={form.voterNo}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 10);
                        setForm((curr) => ({ ...curr, voterNo: val }));
                        if (Object.keys(errors).length > 0) setErrors({});
                      }}
                      className={clsx("w-full h-11 px-4 rounded-xl bg-white/50 border outline-none transition-all focus:ring-4 focus:ring-primary/5 text-sm",
                        errors.voterNo ? "border-red-400" : "border-slate-200"
                      )}
                      placeholder="10 digit Voter ID number"
                    />
                  </div>
                  <div className="space-y-3">
                    <span className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><FileText className="h-3.5 w-3.5" />Voter Card Photo</span>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => storageRefVoter.current?.click()} className={clsx("flex h-11 items-center justify-center gap-2 rounded-xl border border-dashed transition-all hover:bg-slate-50 text-xs font-bold text-slate-600", errors.voterDoc ? "border-red-400 text-red-400 bg-red-50/50" : "border-slate-200 bg-white")}>
                        <Image className="h-4 w-4" /> From Storage
                      </button>
                      <button type="button" onClick={() => cameraRefVoter.current?.click()} className={clsx("flex h-11 items-center justify-center gap-2 rounded-xl border border-dashed transition-all hover:bg-slate-50 text-xs font-bold text-slate-600", errors.voterDoc ? "border-red-400 text-red-400 bg-red-50/50" : "border-slate-200 bg-white")}>
                        <Camera className="h-4 w-4" /> Take Photo
                      </button>
                    </div>
                    {files.voterDoc && (
                      <div className="relative mt-2 rounded-2xl overflow-hidden aspect-[3/4] border border-slate-100 shadow-sm transition-all animate-in fade-in zoom-in duration-300">
                        <img src={files.voterDoc.preview} className="w-full h-full object-cover" alt="Preview" />
                        <button type="button" onClick={() => setFiles({ ...files, voterDoc: null })} className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 text-white backdrop-blur-md flex items-center justify-center text-sm">✕</button>
                      </div>
                    )}
                    <input ref={storageRefVoter} type="file" accept="image/*" className="hidden" onChange={(e) => { handleFile('voterDoc', e.target.files?.[0]); e.target.value = ''; }} />
                    <input ref={cameraRefVoter} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { handleFile('voterDoc', e.target.files?.[0]); e.target.value = ''; }} />
                  </div>
                </div>

                <div className="pt-4">
                  <StepErrorMessage />
                  <LoadingButton type="button" loading={loading} onClick={() => handleNext(2)} className="w-full h-11 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/10 hover:shadow-lg transition-all">Almost Done</LoadingButton>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {socialFields.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 ml-1 flex items-center gap-2"><Icon className="h-3.5 w-3.5" />{label}</label>
                    <input
                      value={form[key]}
                      onChange={(e) => {
                        setForm((curr) => ({ ...curr, [key]: e.target.value }));
                        if (Object.keys(errors).length > 0) setErrors({});
                      }}
                      className={clsx("w-full h-11 px-4 rounded-xl bg-white/50 border outline-none transition-all focus:ring-4 focus:ring-primary/5 text-sm",
                        errors[key] ? "border-red-400" : "border-slate-200"
                      )}
                      placeholder={`Enter ${label.split(' ')[0]} URL`}
                    />
                  </div>
                ))}
                <div className="pt-2">
                  <StepErrorMessage />
                  <LoadingButton type="button" loading={loading} onClick={() => handleNext(3)} className="w-full h-11 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/10 hover:shadow-lg transition-all">Just One More</LoadingButton>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4 text-center">
                  <span className="text-[13px] font-semibold text-slate-700 flex items-center justify-center gap-2"><User className="h-4 w-4" /> Live Capture</span>
                  <div className="flex justify-center">
                    <div className={clsx("relative h-48 w-48 rounded-full border-2 overflow-hidden transition-all duration-500", errors.selfie ? "border-red-400 bg-red-50/30" : files.selfie ? "border-primary shadow-xl scale-105" : "border-dashed border-slate-200 bg-slate-50/50")}>
                      {files.selfie ? (<img src={files.selfie.preview} className="h-full w-full object-cover" alt="Profile" />) : (
                        <div className="flex flex-col items-center justify-center h-full gap-2">
                          <User className="h-16 w-16 text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No Image</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {!files.selfie ? (
                      <button type="button" onClick={() => cameraRefSelfie.current?.click()} className="w-full h-12 flex items-center justify-center gap-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all hover:border-primary/30 active:scale-95">
                        <Camera className="h-5 w-5 text-primary" /> Take Profile Photo
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-green-50 border border-green-100 text-sm font-bold text-green-600"><ShieldCheck className="h-5 w-5" /> Profile Photo Captured!</div>
                        <button type="button" onClick={() => cameraRefSelfie.current?.click()} className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-500 hover:text-primary hover:bg-slate-50 transition-all active:scale-95">Retake Profile Photo</button>
                      </div>
                    )}
                  </div>
                  <input ref={cameraRefSelfie} type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => { handleFile('selfie', e.target.files?.[0]); e.target.value = ''; }} />
                </div>
                <div className="pt-2">
                  <StepErrorMessage />
                  <LoadingButton type="submit" loading={loading} className="w-full h-12 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all">Complete Registration</LoadingButton>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 pt-5 text-center relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-px bg-slate-200" />
            <p className="text-sm text-slate-500">Already have an account?<br /><Link to="/login" className="font-bold text-primary inline-flex items-center gap-1 hover:underline group/sign">Login here <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/sign:translate-x-1" /></Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
