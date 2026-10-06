'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { InventoryItem } from '@/types/logistics';
import { X, Boxes, Plus } from 'lucide-react';

const inventorySchema = z.object({
  name: z.string().min(2, 'Item name must be at least 2 characters'),
  sku: z.string().min(2, 'SKU code is required (e.g. CEM-01)'),
  category: z.enum([
    'Building Materials',
    'FMCG / Food',
    'Electronics',
    'Agrochemicals',
    'Fashion & Retail',
  ]),
  stock: z.coerce.number().min(0, 'Initial stock cannot be negative'),
  reorderPoint: z.coerce.number().min(1, 'Reorder threshold must be at least 1'),
  unit: z.string().min(1, 'Unit of measurement is required (e.g. bags, cartons, units)'),
  unitPrice: z.coerce.number().min(0.1, 'Price must be greater than 0'),
  warehouseLocation: z.string().min(2, 'Warehouse bay / depot is required'),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (item: Omit<InventoryItem, 'id' | 'updatedAt'>) => void;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: '',
      sku: '',
      category: 'Building Materials',
      stock: 50,
      reorderPoint: 15,
      unit: 'bags',
      unitPrice: 120.0,
      warehouseLocation: 'Tema Depot Bay 1',
    },
  });

  if (!isOpen) return null;

  const onFormSubmit = (data: InventoryFormData) => {
    onAddProduct(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in">
      <div className="bg-white rounded-2xl border border-borderBrand shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-borderBrand flex items-center justify-between bg-paper">
          <div>
            <p className="eyebrow">WAREHOUSE REGISTRATION</p>
            <h3 className="text-lg font-extrabold text-ink">
              Register New Inventory SKU
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-borderBrand hover:bg-white text-ink transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Product / Commodity Name *
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="e.g. Dangote 42.5R Portland Cement (50kg)"
              className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && (
              <p className="text-[11px] text-danger mt-0.5">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                SKU Identifier *
              </label>
              <input
                type="text"
                {...register('sku')}
                placeholder="CEM-DAN-50"
                className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary font-mono uppercase"
              />
              {errors.sku && (
                <p className="text-[11px] text-danger mt-0.5">{errors.sku.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Industry Category *
              </label>
              <select
                {...register('category')}
                className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="Building Materials">Building Materials</option>
                <option value="FMCG / Food">FMCG / Food</option>
                <option value="Electronics">Electronics</option>
                <option value="Agrochemicals">Agrochemicals</option>
                <option value="Fashion & Retail">Fashion & Retail</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Starting Stock *
              </label>
              <input
                type="number"
                {...register('stock')}
                className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Unit (e.g. bags) *
              </label>
              <input
                type="text"
                {...register('unit')}
                placeholder="bags, units, kg"
                className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Unit Price (GH₵) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('unitPrice')}
                className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Low-Stock Alert Trigger *
              </label>
              <input
                type="number"
                {...register('reorderPoint')}
                className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Depot / Bay Location *
              </label>
              <input
                type="text"
                {...register('warehouseLocation')}
                placeholder="Tema Yard B-02"
                className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-borderBrand">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-borderBrand text-xs font-semibold text-ink hover:bg-secondaryBrand transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-ink text-white hover:bg-ink/90 text-xs font-bold transition flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4 text-primary" />
              <span>Save Product to Catalog</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
