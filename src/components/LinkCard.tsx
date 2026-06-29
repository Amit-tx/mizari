'use client';

import { useState } from 'react';
import type { Link } from '@/db/schema';

interface LinkCardProps {
  link: Link;
  onUpdate: (
    id: number, 
    title: string, 
    url: string, 
    isProduct: number, 
    price: string, 
    discount: string, 
    productImage: string
  ) => void;
  onDelete: (id: number) => void;
  onMoveUp: (id: number) => void;
  onMoveDown: (id: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function LinkCard({ link, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }: LinkCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  
  // Product states
  const [isProduct, setIsProduct] = useState(link.isProduct);
  const [price, setPrice] = useState(link.price || '');
  const [discount, setDiscount] = useState(link.discount || '');
  const [productImage, setProductImage] = useState(link.productImage || '');
  const [uploading, setUploading] = useState(false);

  const handleSave = () => {
    onUpdate(link.id, title, url, isProduct, price, discount, productImage);
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(link.title);
    setUrl(link.url);
    setIsProduct(link.isProduct);
    setPrice(link.price || '');
    setDiscount(link.discount || '');
    setProductImage(link.productImage || '');
    setEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'background'); // Uploads as background/product type

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setProductImage(data.url);
      } else {
        alert('Image upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-750 dark:bg-slate-900">
      {editing ? (
        <div className="space-y-4">
          <div className="flex gap-4 items-center mb-2">
            <button
              type="button"
              onClick={() => setIsProduct(0)}
              className={`flex-1 rounded-xl py-2 text-xs font-bold border transition-all ${
                isProduct === 0
                  ? 'border-[#FF6B6B] bg-[#FF6B6B]/5 text-[#FF6B6B]'
                  : 'border-gray-200 dark:border-slate-800 text-gray-500'
              }`}
            >
              🔗 Standard Link
            </button>
            <button
              type="button"
              onClick={() => setIsProduct(1)}
              className={`flex-1 rounded-xl py-2 text-xs font-bold border transition-all ${
                isProduct === 1
                  ? 'border-[#FF6B6B] bg-[#FF6B6B]/5 text-[#FF6B6B]'
                  : 'border-gray-200 dark:border-slate-800 text-gray-500'
              }`}
            >
              🛍️ Product Card
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm transition-colors focus:border-[#FF6B6B] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="Link or Product Name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">URL (e.g. Affiliate / Buy Link)</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm transition-colors focus:border-[#FF6B6B] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                placeholder="https://..."
              />
            </div>

            {isProduct === 1 && (
              <div className="grid gap-3 grid-cols-2 p-4 rounded-xl bg-gray-55 dark:bg-slate-950/40 border border-gray-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">Price (e.g. $49 or ₹999)</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    placeholder="Price"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-550 dark:text-slate-400 mb-1">Discount Tag (e.g. 20% OFF)</label>
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    placeholder="e.g. 20% OFF"
                  />
                </div>
                <div className="col-span-2 pt-2">
                  <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1">Product Image</label>
                  <div className="flex items-center gap-3">
                    {productImage && (
                      <img src={productImage} alt="product" className="h-12 w-12 rounded-lg object-cover border" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id={`edit-prod-img-${link.id}`}
                    />
                    <label
                      htmlFor={`edit-prod-img-${link.id}`}
                      className="cursor-pointer rounded-xl border border-gray-250 px-3 py-1.5 text-xs font-bold text-gray-600 dark:border-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50"
                    >
                      {uploading ? 'Uploading...' : productImage ? 'Change Image' : 'Upload Image'}
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} className="rounded-xl bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] px-4 py-2 text-xs font-bold text-white shadow-sm hover:brightness-110">Save</button>
            <button onClick={handleCancel} className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600 transition-colors hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {link.isProduct === 1 && link.productImage && (
              <img src={link.productImage} alt={link.title} className="h-12 w-12 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate text-sm font-bold text-gray-900 dark:text-white">{link.title}</h3>
                {link.isProduct === 1 && (
                  <span className="rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] font-extrabold text-orange-600 dark:bg-orange-950/20 dark:text-orange-400">🛍️ PRODUCT</span>
                )}
              </div>
              <p className="truncate text-xs text-gray-500 dark:text-slate-400 mt-0.5">{link.url}</p>
              {link.isProduct === 1 && link.price && (
                <div className="flex items-center gap-1.5 mt-1 text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  <span>{link.price}</span>
                  {link.discount && (
                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px] bg-emerald-50 dark:bg-emerald-950/20 px-1 rounded">{link.discount}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-1 border-t border-gray-50 pt-3 sm:border-t-0 sm:pt-0">
            <span className="whitespace-nowrap rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600 dark:bg-slate-800 dark:text-slate-300 mr-1">{link.clicks} clicks</span>
            <button onClick={() => onMoveUp(link.id)} disabled={isFirst} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="Move up">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/></svg>
            </button>
            <button onClick={() => onMoveDown(link.id)} disabled={isLast} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="Move down">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <button onClick={() => setEditing(true)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="Edit">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button onClick={() => onDelete(link.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 dark:hover:text-red-400" aria-label="Delete">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
