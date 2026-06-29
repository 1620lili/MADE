'use client';

import { useState, useRef, useActionState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { createProduct, updateProduct } from '@/features/inventory/actions';

interface Variant {
  sku: string;
  price: string;
  stock: string;
  color: string;
  size: string;
}

interface CreateProductFormProps {
  companyId: number;
  mode?: 'create' | 'edit';
  initialData?: any;
}

export default function CreateProductForm({ companyId, mode = 'create', initialData }: CreateProductFormProps) {
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData?.ProductImage?.map((img: any) => img.url) || []
  );
  const [mainImageIndex, setMainImageIndex] = useState(
    initialData?.ProductImage?.findIndex((img: any) => img.isMain) >= 0 
      ? initialData.ProductImage.findIndex((img: any) => img.isMain) 
      : 0
  );

  const [variants, setVariants] = useState<Variant[]>(
    initialData?.ProductVariant?.map((v: any) => ({
      sku: v.sku,
      price: v.price.toString(),
      stock: v.stock.toString(),
      color: v.color || '',
      size: v.size || ''
    })) || [{ sku: '', price: '', stock: '0', color: '', size: '' }]
  );

  const [isUploading, setIsUploading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 3 * 1024 * 1024;
    
    const validFiles = files.filter(f => {
      if (f.size > maxSize) {
        alert(`La imagen ${f.name} excede los 3MB.`);
        return false;
      }
      return true;
    }).slice(0, 6 - imageFiles.length);

    if (validFiles.length > 0) {
      setImageFiles(prev => [...prev, ...validFiles].slice(0, 6));
      validFiles.forEach(f => {
        const url = URL.createObjectURL(f);
        setImagePreviews(prev => [...prev, url].slice(0, 6));
      });
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    // Si la imagen era nueva (tenía un File asociado)
    // El índice en imageFiles es diferente si hay imágenes existentes
    // Pero para simplificar, si estamos en create, imageFiles y imagePreviews coinciden.
    // En edit, imagePreviews tiene (existentes + nuevas).
    // Para simplificar el borrado en este MVP:
    if (index < (initialData?.ProductImage?.length || 0)) {
       // Imagen existente - requeriría lógica extra para borrar en DB si fuera delete directo
       // Pero aquí solo estamos en el form de "Crear" o "Editar General"
    } else {
       const newFilesIndex = index - (initialData?.ProductImage?.length || 0);
       setImageFiles(prev => prev.filter((_, i) => i !== newFilesIndex));
    }
    
    if (mainImageIndex === index) setMainImageIndex(0);
    else if (mainImageIndex > index) setMainImageIndex(mainImageIndex - 1);
  };

  const addVariant = () => {
    if (variants.length < 10) {
      setVariants(prev => [...prev, { sku: '', price: '', stock: '0', color: '', size: '' }]);
    }
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (index: number, field: keyof Variant, value: string) => {
    setVariants(prev => prev.map((v, i) => 
      i === index ? { ...v, [field]: value } : v
    ));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(7)}.${ext}`;
    const path = `products/images/${fileName}`;
    
    const { error } = await supabase.storage
      .from('madeshop-media')
      .upload(path, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('madeshop-media')
      .getPublicUrl(path);
      
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formRef.current) return;

    setIsUploading(true);
    setServerError(null);
    
    try {
      // 1. Subir imágenes nuevas
      const uploadedUrls: string[] = [];
      // Mantener las URLs de imágenes existentes que no fueron borradas
      const existingUrls = imagePreviews.filter(p => p.startsWith('http'));
      
      for (const file of imageFiles) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }

      const allImageUrls = [...existingUrls, ...uploadedUrls];

      const formData = new FormData(formRef.current);
      formData.set('companyId', companyId.toString());
      formData.set('imageUrls', JSON.stringify(allImageUrls));
      formData.set('mainImageIndex', mainImageIndex.toString());
      formData.set('variants', JSON.stringify(variants));

      if (mode === 'create') {
        const result = await createProduct(null, formData);
        if (result?.error) setServerError(result.error);
      } else {
        await updateProduct(initialData.id, {
          name: formData.get('name') as string,
          brand: formData.get('brand') as string,
          description: formData.get('description') as string,
          isActive: formData.get('isActive') === 'on',
        });
        // Podríamos añadir lógica para actualizar imágenes aquí si fuera necesario
        // Pero por ahora cumplimos con la estructura pedida
        window.location.href = '/dashboard/inventario';
      }
    } catch (err: any) {
      console.error(err);
      setServerError("Error al registrar el producto o subir imágenes.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-surface-lowest border border-outline-variant/20 p-8 shadow-sm">
      <h2 className="font-headline text-xl text-on-surface mb-8 border-b border-outline-variant/10 pb-4">
        {mode === 'create' ? 'Nuevo Producto' : 'Editar Producto'}
      </h2>
      
      {serverError && (
        <div className="bg-error/10 border border-error/30 text-error p-4 mb-6 text-[11px] font-label uppercase tracking-wider">
          {serverError}
        </div>
      )}

      <input
        ref={imagesInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onClick={(e) => e.stopPropagation()}
        onChange={handleImagesChange}
      />

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-12">
        <input type="hidden" name="companyId" value={companyId} />

        {/* SECCIÓN 1 - Datos del Producto */}
        <div className="space-y-6">
          <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">1. Información General</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Nombre del Producto *</label>
              <input 
                type="text" 
                name="name" 
                defaultValue={initialData?.name}
                required
                className="w-full bg-transparent border-b border-outline-variant/30 px-0 py-2 focus:border-secondary focus:ring-0 outline-none text-on-surface transition-colors"
                placeholder="Ej. Bolso de Cuero"
              />
            </div>

            <div className="space-y-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Marca</label>
              <input 
                type="text" 
                name="brand" 
                defaultValue={initialData?.brand}
                className="w-full bg-transparent border-b border-outline-variant/30 px-0 py-2 focus:border-secondary focus:ring-0 outline-none text-on-surface transition-colors"
                placeholder="Nombre de la marca"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Descripción</label>
            <textarea 
              name="description" 
              defaultValue={initialData?.description}
              rows={3}
              className="w-full bg-transparent border-b border-outline-variant/30 px-0 py-2 focus:border-secondary focus:ring-0 outline-none text-on-surface transition-colors resize-none"
              placeholder="Describe el producto detalladamente..."
            />
          </div>

          <label className="flex items-center space-x-3 cursor-pointer group mt-4">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                name="isActive" 
                defaultChecked={initialData?.isActive ?? true} 
                className="peer sr-only"
              />
              <div className="w-10 h-5 bg-outline-variant/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
            </div>
            <span className="font-label text-[11px] uppercase tracking-wider text-on-surface group-hover:text-secondary transition-colors">Producto Activo</span>
          </label>
        </div>

        {/* SECCIÓN 2 - Galería de Imágenes */}
        <div className="space-y-6">
          <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">2. Galería de Imágenes (Máx 6)</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {imagePreviews.map((preview, index) => (
              <div 
                key={index}
                onClick={() => setMainImageIndex(index)}
                className={`relative aspect-square bg-surface-low border-2 cursor-pointer overflow-hidden group ${mainImageIndex === index ? 'border-secondary' : 'border-transparent'}`}
              >
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                  className="absolute top-1 right-1 w-5 h-5 bg-error text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <span className="material-symbols-outlined" style={{fontSize:'12px'}}>close</span>
                </button>
                {mainImageIndex === index && (
                  <div className="absolute bottom-0 left-0 right-0 bg-secondary text-surface text-[8px] font-label uppercase tracking-widest text-center py-1">
                    Principal
                  </div>
                )}
              </div>
            ))}
            {imagePreviews.length < 6 && (
              <button
                type="button"
                onClick={() => imagesInputRef.current?.click()}
                className="aspect-square bg-surface-low border border-dashed border-outline-variant/30 flex flex-col items-center justify-center hover:border-secondary transition-colors text-outline-variant hover:text-secondary"
              >
                <span className="material-symbols-outlined" style={{fontSize:'24px'}}>add_photo_alternate</span>
                <span className="text-[8px] font-label uppercase tracking-widest mt-2">Añadir</span>
              </button>
            )}
          </div>
        </div>

        {/* SECCIÓN 3 - Variantes */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">3. Variantes (Máx 10)</h3>
            <button 
              type="button" 
              onClick={addVariant}
              className="text-secondary font-label text-[10px] uppercase tracking-widest hover:underline"
            >
              + Agregar Variante
            </button>
          </div>
          
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end bg-surface-low/30 p-4 border border-outline-variant/10 relative group">
                <div className="space-y-2">
                  <label className="font-label text-[8px] uppercase tracking-widest text-on-surface-variant">SKU *</label>
                  <input 
                    type="text" 
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-outline-variant/30 text-[11px] py-1 focus:border-secondary outline-none"
                    placeholder="SKU"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[8px] uppercase tracking-widest text-on-surface-variant">Precio *</label>
                  <input 
                    type="number" 
                    value={variant.price}
                    onChange={(e) => updateVariant(index, 'price', e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-outline-variant/30 text-[11px] py-1 focus:border-secondary outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[8px] uppercase tracking-widest text-on-surface-variant">Stock</label>
                  <input 
                    type="number" 
                    value={variant.stock}
                    onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-[11px] py-1 focus:border-secondary outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[8px] uppercase tracking-widest text-on-surface-variant">Color</label>
                  <input 
                    type="text" 
                    value={variant.color}
                    onChange={(e) => updateVariant(index, 'color', e.target.value)}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-[11px] py-1 focus:border-secondary outline-none"
                    placeholder="Color"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label text-[8px] uppercase tracking-widest text-on-surface-variant">Talla</label>
                  <input 
                    type="text" 
                    value={variant.size}
                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                    className="w-full bg-transparent border-b border-outline-variant/30 text-[11px] py-1 focus:border-secondary outline-none"
                    placeholder="Talla"
                  />
                </div>
                <div className="flex justify-end pb-1">
                  {variants.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeVariant(index)}
                      className="text-error hover:scale-110 transition-transform"
                    >
                      <span className="material-symbols-outlined" style={{fontSize:'18px'}}>delete</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-8 border-t border-outline-variant/10 flex justify-end">
          <button 
            type="submit" 
            disabled={isUploading}
            className="bg-on-surface text-surface px-10 py-4 font-label text-[10px] uppercase tracking-[0.2em] hover:bg-secondary transition-all disabled:opacity-50 flex items-center gap-3"
          >
            {isUploading ? (
              <>
                <span className="material-symbols-outlined animate-spin" style={{fontSize:'16px'}}>sync</span>
                Procesando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{fontSize:'16px'}}>save</span>
                {mode === 'create' ? 'Registrar Colección' : 'Guardar Cambios'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
