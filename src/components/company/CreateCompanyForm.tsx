'use client';
import { useActionState, useState, useRef } from 'react';
import { createCompany } from '@/features/company/actions';
import { createClient } from '@/utils/supabase/client';

const initialState = { error: '' };
const STORAGE_BUCKET = 'madeshop-media';

export function CreateCompanyForm() {
  const [state, formAction, pending] = useActionState(createCompany, initialState);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const maxSize = type === 'logo' ? 2 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(`El ${type === 'logo' ? 'logo' : 'banner'} excede el tamaño permitido.`);
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

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fullPath, file);

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fullPath);
      
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData(e.currentTarget);
      
      if (logoFile) {
        const url = await uploadToSupabase(logoFile, 'companies/logos/');
        formData.set('logoUrl', url);
      }
      
      if (bannerFile) {
        const url = await uploadToSupabase(bannerFile, 'companies/banners/');
        formData.set('bannerUrl', url);
      }

      formAction(formData);
    } catch (err: any) {
      console.error(err);
      setUploadError('Error al procesar las imágenes.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-surface-container-low p-12 lg:p-16 shadow-[0px_20px_40px_rgba(47,51,49,0.06)] relative overflow-hidden">
      {/* Decorative texture/shape */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <header className="mb-12">
        <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary mb-4 block">Fundación de la Boutique</span>
        <h2 className="flex items-center gap-4"><img src="/image/made-logo.jpeg" alt="MADE" className="h-12 w-auto" /></h2>
        <p className="mt-4 text-on-surface-variant font-body leading-relaxed max-w-md">Establece tu marca en la red global de Luxe Atelier para desbloquear herramientas de gestión premium.</p>
      </header>

      {(state?.error || uploadError) && (
        <p className="text-error font-label text-xs uppercase tracking-widest mb-8 border border-error/20 bg-error-container/10 p-4 animate-in fade-in slide-in-from-top-4 duration-500">
          {state?.error || uploadError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
        {/* Brand Details */}
        <div className="space-y-6 pb-6 border-b border-outline-variant/20">
          <h3 className="font-headline text-xl text-on-surface">Información de la Marca</h3>
          
          <div className="group relative">
            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Nombre de la Boutique / Marca</label>
            <input name="name" type="text" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface placeholder:text-outline-variant/40 focus:border-secondary focus:ring-0 outline-none transition-colors" placeholder="Ej. Maison Valentina" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Logo de Marca (Max 2MB)</label>
              <input 
                ref={logoInputRef}
                type="file" 
                accept="image/png,image/jpeg,image/webp" 
                className="hidden"
                onChange={(e) => handleFileChange(e, 'logo')}
              />
              <div 
                onClick={() => logoInputRef.current?.click()}
                className="relative group h-32 bg-surface-low border border-dashed border-outline-variant/30 flex flex-col items-center justify-center cursor-pointer hover:border-secondary transition-colors overflow-hidden"
              >
                {logoPreview ? (
                  <>
                    <img src={logoPreview} className="w-full h-full object-contain" alt="Logo preview" />
                    <button
                      type="button"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setLogoFile(null); 
                        setLogoPreview(''); 
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-error text-surface rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-40">
                    <span className="material-symbols-outlined">upload</span>
                    <span className="text-[8px] font-label uppercase tracking-widest">Seleccionar Logo</span>
                  </div>
                )}
              </div>
              <input type="hidden" name="logoUrl" />
            </div>

            <div className="space-y-4">
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Banner de Boutique (Max 5MB)</label>
              <input 
                ref={bannerInputRef}
                type="file" 
                accept="image/png,image/jpeg,image/webp" 
                className="hidden"
                onChange={(e) => handleFileChange(e, 'banner')}
              />
              <div 
                onClick={() => bannerInputRef.current?.click()}
                className="relative group h-32 bg-surface-low border border-dashed border-outline-variant/30 flex flex-col items-center justify-center cursor-pointer hover:border-secondary transition-colors overflow-hidden"
              >
                {bannerPreview ? (
                  <>
                    <img src={bannerPreview} className="w-full h-full object-cover" alt="Banner preview" />
                    <button
                      type="button"
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setBannerFile(null); 
                        setBannerPreview(''); 
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-error text-surface rounded-full flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-40">
                    <span className="material-symbols-outlined">add_photo_alternate</span>
                    <span className="text-[8px] font-label uppercase tracking-widest">Seleccionar Banner</span>
                  </div>
                )}
              </div>
              <input type="hidden" name="bannerUrl" />
            </div>
          </div>
        </div>

        {/* Legal Details */}
        <div className="space-y-6 pb-6 border-b border-outline-variant/20">
          <h3 className="font-headline text-xl text-on-surface">Identidad Corporativa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative">
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Representante Legal</label>
              <input name="legalRepresentative" type="text" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface placeholder:text-outline-variant/40 focus:border-secondary focus:ring-0 outline-none transition-colors" placeholder="Ej. Julian Thorne" />
            </div>
            <div className="group relative">
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">NIT / Identificación Jurídica</label>
              <input name="legalId" type="text" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface placeholder:text-outline-variant/40 focus:border-secondary focus:ring-0 outline-none transition-colors" placeholder="Global EIN / VAT" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative">
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">País de Operación</label>
              <select name="country" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface focus:border-secondary focus:ring-0 outline-none transition-colors appearance-none cursor-pointer">
                <option value="US">Estados Unidos</option>
                <option value="FR">Francia</option>
                <option value="IT">Italia</option>
                <option value="UK">Reino Unido</option>
                <option value="JP">Japón</option>
                <option value="CO">Colombia</option>
              </select>
            </div>
            <div className="group relative">
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Ciudad Principal</label>
              <input name="city" type="text" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface placeholder:text-outline-variant/40 focus:border-secondary focus:ring-0 outline-none transition-colors" placeholder="Ej. París" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative">
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Dirección Física</label>
              <input name="address" type="text" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface placeholder:text-outline-variant/40 focus:border-secondary focus:ring-0 outline-none transition-colors" placeholder="Calle, Suite, Número" />
            </div>
            <div className="group relative">
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Email Empresarial</label>
              <input name="email" type="email" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-3 text-on-surface placeholder:text-outline-variant/50 focus:border-secondary focus:ring-0 outline-none transition-all" placeholder="boutique@marca.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative">
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Teléfono de Contacto</label>
              <input name="phone" type="tel" required className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant px-0 py-2 text-on-surface placeholder:text-outline-variant/40 focus:border-secondary focus:ring-0 outline-none transition-colors" placeholder="Ej. +1 555-000-0000" />
            </div>
            <div className="group relative text-start">
              <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Estado Activo</label>
              <div className="flex items-center gap-4 py-2">
                <input type="checkbox" name="isActive_toggle" defaultChecked className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary" onChange={(e: any) => {
                  const hiddenInput = document.getElementById('isActive_hidden') as HTMLInputElement;
                  if (hiddenInput) hiddenInput.value = e.target.checked ? 'true' : 'false';
                }} />
                <span className="text-on-surface font-body text-sm">Empresa Activa</span>
                <input type="hidden" id="isActive_hidden" name="isActive" value="true" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8">
          <button 
            disabled={pending || isUploading} 
            type="submit" 
            className="w-full bg-on-surface text-surface py-5 font-label text-[10px] uppercase tracking-[0.3em] hover:bg-secondary flex justify-center items-center gap-4 transition-all duration-500 disabled:opacity-50"
          >
            {pending || isUploading ? (
              <span className="animate-pulse">Cargando... Registrando en el Libro...</span>
            ) : (
              <>
                <span>Establecer Marca</span>
                <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
        <p className="text-[10px] font-label uppercase tracking-widest text-center text-outline mt-6">
          Al establecerte, te adhieres a los <span className="underline cursor-pointer">Estándares de Comercio de Atelier</span>.
        </p>
      </form>
    </div>
  );
}
