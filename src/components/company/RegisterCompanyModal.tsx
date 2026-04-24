'use client';

import { useState, useActionState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createCompanyAdmin } from '@/features/company/actions';
import { createClient } from '@/utils/supabase/client';

interface RegisterCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  { id: 1, title: 'Identidad' },
  { id: 2, title: 'Ubicación' },
  { id: 3, title: 'Marca' }
];

const countries = [
  "Colombia", "Estados Unidos", "México", "España", "Francia", "Italia", "Reino Unido", "Japón"
];

const STORAGE_BUCKET = 'madeshop-media';

export default function RegisterCompanyModal({ isOpen, onClose }: RegisterCompanyModalProps) {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    legalId: '',
    legalRepresentative: '',
    email: '',
    phone: '',
    country: 'Colombia',
    city: '',
    address: '',
    logoUrl: '',
    bannerUrl: '',
    isActive: true
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [state, formAction, isPending] = useActionState(createCompanyAdmin, null);

  useEffect(() => {
    if (state?.success) {
      setTimeout(() => {
        onClose();
        resetForm();
      }, 500);
    }
  }, [state, onClose]);

  const resetForm = () => {
    setStep(1);
    setFormData({
      name: '', legalId: '', legalRepresentative: '', email: '', phone: '',
      country: 'Colombia', city: '', address: '', logoUrl: '', bannerUrl: '',
      isActive: true
    });
    setLogoFile(null);
    setBannerFile(null);
    setLogoPreview('');
    setBannerPreview('');
    setUploadError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Size validation
    const maxSize = type === 'logo' ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(`El ${type} excede el tamaño máximo permitido (${type === 'logo' ? '2MB' : '5MB'}).`);
      return;
    }

    setUploadError('');
    if (type === 'logo') {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const uploadToSupabase = async (file: File, path: string) => {
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const fullPath = `${path}${fileName}`;

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fullPath, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fullPath);
      
    return publicUrl;
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logoInputRef.current?.click();
  };

  const handleBannerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    bannerInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError('');

    try {
      let finalLogoUrl = formData.logoUrl;
      let finalBannerUrl = formData.bannerUrl;

      if (logoFile) {
        finalLogoUrl = await uploadToSupabase(logoFile, 'companies/logos/');
      }
      if (bannerFile) {
        finalBannerUrl = await uploadToSupabase(bannerFile, 'companies/banners/');
      }

      const submissionData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'logoUrl') submissionData.append(key, finalLogoUrl);
        else if (key === 'bannerUrl') submissionData.append(key, finalBannerUrl);
        else submissionData.append(key, String(value));
      });

      // Execute the server action with the updated data
      formAction(submissionData);
    } catch (err: any) {
      console.error("Upload Error:", err);
      setUploadError(`Error al subir archivos: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/80 backdrop-blur-md p-6"
      >
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-surface-lowest w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface-low/30">
            <div>
              <h2 className="font-headline text-3xl tracking-tight">Registrar Empresa</h2>
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mt-1">Nivel: Boutique Manager Admin</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
          </div>

          {/* Stepper */}
          <div className="px-20 py-8 bg-surface-lowest">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-outline-variant/20 -z-10" />
              {steps.map((s) => (
                <div key={s.id} className="flex flex-col items-center space-y-2 bg-surface-lowest px-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${step >= s.id ? 'bg-secondary text-surface' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                    {s.id}
                  </div>
                  <span className={`text-[10px] font-label uppercase tracking-widest ${step >= s.id ? 'text-secondary font-bold' : 'text-on-surface-variant'}`}>{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          {/* Form Content Area */}
          <div className="flex-1 overflow-y-auto p-12">
            {(state?.error || uploadError) && (
              <div className="mb-8 p-4 bg-error/10 border-l-4 border-error text-error text-[10px] font-label uppercase tracking-widest">
                {state?.error || uploadError}
              </div>
            )}
            {state?.success && (
              <div className="mb-8 p-4 bg-secondary/10 border-l-4 border-secondary text-secondary text-[10px] font-label uppercase tracking-widest">
                Empresa registrada y publicada exitosamente en el Atelier.
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {step === 1 && (
                  <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="md:col-span-2 space-y-2 group">
                        <label htmlFor="name" className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Nombre de la Empresa *</label>
                        <input required type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-secondary transition-colors outline-none font-body" />
                      </div>
                      <div className="space-y-2 group">
                        <label htmlFor="legalId" className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">NIT / Identificación Legal *</label>
                        <input required type="text" id="legalId" name="legalId" value={formData.legalId} onChange={handleChange} className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-secondary transition-colors outline-none font-body" />
                      </div>
                      <div className="space-y-2 group">
                        <label htmlFor="legalRepresentative" className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Representante Legal *</label>
                        <input required type="text" id="legalRepresentative" name="legalRepresentative" value={formData.legalRepresentative} onChange={handleChange} className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-secondary transition-colors outline-none font-body" />
                      </div>
                      <div className="space-y-2 group">
                        <label htmlFor="email" className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Email Empresarial</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-secondary transition-colors outline-none font-body" />
                      </div>
                      <div className="space-y-2 group">
                        <label htmlFor="phone" className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Teléfono de Contacto</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-secondary transition-colors outline-none font-body" />
                      </div>
                    </div>

                    {/* Footer Buttons Step 1 */}
                    <div className="mt-12 flex justify-between pt-8 border-t border-outline-variant/10">
                      <div className="w-32" /> {/* Spacer instead of Hidden Previous Button */}
                      <button 
                        type="submit"
                        className="bg-on-surface text-surface px-8 py-3 text-[10px] font-label uppercase tracking-[0.2em] hover:bg-secondary transition-all"
                      >
                        Siguiente
                      </button>
                    </div>
                  </form>
                )}

                {step === 2 && (
                  <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="space-y-2 group">
                        <label htmlFor="country" className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">País *</label>
                        <select required id="country" name="country" value={formData.country} onChange={handleChange} className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-secondary transition-colors outline-none font-body appearance-none">
                          {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2 group">
                        <label htmlFor="city" className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Ciudad Principal *</label>
                        <input required type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-secondary transition-colors outline-none font-body" />
                      </div>
                      <div className="md:col-span-2 space-y-2 group">
                        <label htmlFor="address" className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Dirección Física</label>
                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-secondary transition-colors outline-none font-body" />
                      </div>
                    </div>

                    {/* Footer Buttons Step 2 */}
                    <div className="mt-12 flex justify-between pt-8 border-t border-outline-variant/10">
                      <button 
                        type="button"
                        onClick={prevStep}
                        className="text-[10px] font-label uppercase tracking-[0.2em] px-8 py-3 text-on-surface-variant hover:text-on-surface transition-colors"
                      >
                        Anterior
                      </button>
                      <button 
                        type="submit"
                        className="bg-on-surface text-surface px-8 py-3 text-[10px] font-label uppercase tracking-[0.2em] hover:bg-secondary transition-all"
                      >
                        Siguiente
                      </button>
                    </div>
                  </form>
                )}

                {step === 3 && (
                  <div className="space-y-12">
                    
                    {/* FUERA del form - Inputs de archivo independientes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      
                      {/* Logo */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                          Logo de Marca (Max 2MB)
                        </label>
                        <input
                          ref={logoInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleFileChange(e, 'logo')}
                        />
                        <div
                          onClick={handleLogoClick}
                          className="w-24 h-24 bg-surface-low border border-dashed border-outline-variant/30 flex flex-col items-center justify-center cursor-pointer hover:border-secondary transition-colors overflow-hidden relative"
                        >
                          {logoPreview ? (
                            <>
                              <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLogoFile(null);
                                  setLogoPreview('');
                                }}
                                className="absolute top-1 right-1 w-5 h-5 bg-error text-surface rounded-full flex items-center justify-center"
                              >
                                <span className="material-symbols-outlined text-[12px]">close</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-outline-variant">upload</span>
                              <span className="text-[8px] font-label uppercase tracking-widest text-outline-variant mt-1">
                                Subir Logo
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Banner */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">
                          Banner (Max 5MB)
                        </label>
                        <input
                          ref={bannerInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleFileChange(e, 'banner')}
                        />
                        <div
                          onClick={handleBannerClick}
                          className="w-full h-24 bg-surface-low border border-dashed border-outline-variant/30 flex flex-col items-center justify-center cursor-pointer hover:border-secondary transition-colors overflow-hidden relative"
                        >
                          {bannerPreview ? (
                            <>
                              <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBannerFile(null);
                                  setBannerPreview('');
                                }}
                                className="absolute top-1 right-1 w-5 h-5 bg-error text-surface rounded-full flex items-center justify-center"
                              >
                                <span className="material-symbols-outlined text-[12px]">close</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-outline-variant">add_photo_alternate</span>
                              <span className="text-[8px] font-label uppercase tracking-widest text-outline-variant mt-1">
                                Subir Banner
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Form para el resto de campos y el submit final */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="flex items-center space-x-4">
                        <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 accent-secondary" />
                        <label htmlFor="isActive" className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Publicar inmediatamente en el Mall</label>
                      </div>

                      <div className="bg-surface-low p-8 border border-outline-variant/10">
                        <h4 className="font-headline text-lg italic mb-6">Resumen del Atelier</h4>
                        <div className="grid grid-cols-2 gap-4 text-[10px] font-label uppercase tracking-[0.1em] text-on-surface-variant">
                          <div><span className="font-bold">Marca:</span> {formData.name || '---'}</div>
                          <div><span className="font-bold">ID Legal:</span> {formData.legalId || '---'}</div>
                          <div><span className="font-bold">Ubicación:</span> {formData.city ? `${formData.city}, ${formData.country}` : '---'}</div>
                          <div><span className="font-bold">Estado:</span> {formData.isActive ? 'ACTIVA' : 'INACTIVA'}</div>
                        </div>
                      </div>

                      {/* Footer Buttons Step 3 */}
                      <div className="mt-12 flex justify-between pt-8 border-t border-outline-variant/10">
                        <button 
                          type="button"
                          onClick={prevStep}
                          disabled={isPending || isUploading}
                          className="text-[10px] font-label uppercase tracking-[0.2em] px-8 py-3 text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
                        >
                          Anterior
                        </button>
                        
                        <button 
                          type="submit"
                          disabled={isPending || isUploading}
                          className="bg-secondary text-surface px-12 py-3 text-[10px] font-label uppercase tracking-[0.2em] hover:bg-secondary-dim transition-all disabled:opacity-50"
                          id="submit_company_btn"
                        >
                          {isPending || isUploading ? 'Subiendo datos...' : 'Finalizar Registro'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
