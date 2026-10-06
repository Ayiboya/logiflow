'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { InventoryItem } from '@/types/logistics';
import { X, PackagePlus, AlertCircle, MapPin, Phone, User, ShoppingBag } from 'lucide-react';

const orderSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  customerPhone: z
    .string()
    .min(9, 'Please provide a valid Ghanaian phone number (e.g., 055 445 3553 or +233...)'),
  customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  destination: z.string().min(3, 'Delivery destination address is required'),
  itemId: z.string().min(1, 'Please select an item from warehouse inventory'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  onSubmitOrder: (data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    destination: string;
    itemId: string;
    quantity: number;
    notes?: string;
  }) => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onSubmitOrder,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      destination: '',
      itemId: inventory[0]?.id || '',
      quantity: 1,
      notes: '',
    },
  });

  const selectedItemId = watch('itemId');
  const selectedItem = inventory.find((i) => i.id === selectedItemId);
  const selectedQty = watch('quantity') || 1;

  if (!isOpen) return null;

  const onFormSubmit = (data: OrderFormData) => {
    if (selectedItem && selectedItem.stock < data.quantity) {
      alert(`Insufficient stock! Only ${selectedItem.stock} ${selectedItem.unit} available in warehouse.`);
      return;
    }
    onSubmitOrder({
      ...data,
      customerEmail: data.customerEmail || undefined,
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in">
      <div className="bg-white rounded-2xl border border-borderBrand shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-borderBrand flex items-center justify-between bg-paper">
          <div>
            <p className="eyebrow">ORDER INTAKE CONSOLE</p>
            <h3 className="text-lg font-extrabold text-ink">
              Book Customer Shipment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-borderBrand hover:bg-white text-ink transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-5 space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-primary-dark" />
              Customer / Recipient Name *
            </label>
            <input
              type="text"
              {...register('customerName')}
              placeholder="e.g. Nana Kwame Baah"
              className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.customerName && (
              <p className="text-[11px] text-danger mt-0.5">{errors.customerName.message}</p>
            )}
          </div>

          {/* Phone & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-primary-dark" />
                Phone Number (for SMS) *
              </label>
              <input
                type="text"
                {...register('customerPhone')}
                placeholder="055 445 3553 or +233..."
                className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
              {errors.customerPhone && (
                <p className="text-[11px] text-danger mt-0.5">{errors.customerPhone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                {...register('customerEmail')}
                placeholder="customer@gmail.com"
                className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Delivery Destination */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary-dark" />
              Delivery Destination (Ghana) *
            </label>
            <input
              type="text"
              {...register('destination')}
              placeholder="e.g. East Legon, American House or Osu Oxford Street"
              className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.destination && (
              <p className="text-[11px] text-danger mt-0.5">{errors.destination.message}</p>
            )}
          </div>

          {/* Item Selection & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-ink mb-1 flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-primary-dark" />
                Select Warehouse Product *
              </label>
              <select
                {...register('itemId')}
                className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer"
              >
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.stock} {item.unit} in stock - GH₵{item.unitPrice})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min="1"
                max={selectedItem?.stock || 100}
                {...register('quantity')}
                className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              />
              {errors.quantity && (
                <p className="text-[11px] text-danger mt-0.5">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          {/* Dynamic Order Calculation Box */}
          {selectedItem && (
            <div className="p-3 bg-secondaryBrand/60 rounded-xl border border-borderBrand/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-mutedBrand font-mono block">Order Subtotal</span>
                <span className="font-extrabold text-ink text-sm">
                  GH₵ {(selectedItem.unitPrice * selectedQty).toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-mutedBrand font-mono block">Stock After Order</span>
                <span className={`font-mono font-bold ${
                  selectedItem.stock - selectedQty <= selectedItem.reorderPoint ? 'text-danger' : 'text-green-700'
                }`}>
                  {Math.max(0, selectedItem.stock - selectedQty)} {selectedItem.unit} remaining
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Delivery Notes / Landmarks
            </label>
            <input
              type="text"
              {...register('notes')}
              placeholder="e.g. Call upon reaching roundabout, opposite Total filling station"
              className="w-full text-xs px-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
              <PackagePlus className="w-4 h-4 text-primary" />
              <span>Confirm & Deduct Stock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
