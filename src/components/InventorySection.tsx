'use client';

import React, { useState, useMemo } from 'react';
import { InventoryItem } from '@/types/logistics';
import { 
  Search, 
  Plus, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  Package, 
  MapPin, 
  Layers, 
  Boxes
} from 'lucide-react';

interface InventorySectionProps {
  inventory: InventoryItem[];
  onAddStockClick: () => void;
  onUpdateStock: (itemId: string, newStock: number) => void;
}

const CATEGORIES = [
  'All Items',
  'Building Materials',
  'FMCG / Food',
  'Electronics',
  'Agrochemicals',
  'Fashion & Retail',
] as const;

export const InventorySection: React.FC<InventorySectionProps> = ({
  inventory,
  onAddStockClick,
  onUpdateStock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');

  const filteredItems = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.warehouseLocation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All Items' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [inventory, searchQuery, selectedCategory]);

  return (
    <section id="inventory" className="py-10 px-4 lg:px-10 border-b border-borderBrand">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow mb-1">01 / INVENTORY CONTROL & REAL-TIME SYNC</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Warehouse Stock Ledger
            </h2>
            <p className="text-xs sm:text-sm text-mutedBrand mt-1">
              Automated quantity adjustments on order placement, fulfillment, and returns.
            </p>
          </div>

          <button
            onClick={onAddStockClick}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-ink text-white hover:bg-ink/90 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4 text-primary" />
            <span>Add New SKU</span>
          </button>
        </div>

        {/* Filter Controls: Category Chips + Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-6">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scroll-fade-x">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-ink text-paper shadow-sm'
                    : 'bg-white hover:bg-secondaryBrand text-mutedBrand border border-borderBrand/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-mutedBrand" />
            <input
              type="text"
              placeholder="Search by SKU, product, or depot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-ink text-xs pl-9 pr-3 py-2 rounded-lg border border-borderBrand focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder:text-mutedBrand/60"
            />
          </div>
        </div>

        {/* Inventory Cards Grid (styled like project cards on chris-pi-three) */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-borderBrand p-12 text-center">
            <Boxes className="w-10 h-10 mx-auto text-mutedBrand/60 mb-2" />
            <h4 className="text-sm font-semibold text-ink">No inventory items found</h4>
            <p className="text-xs text-mutedBrand mt-1">Try adjusting your search criteria or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item, index) => {
              const isLowStock = item.stock <= item.reorderPoint;
              const formattedIndex = String(index + 1).padStart(2, '0');

              return (
                <div
                  key={item.id}
                  className={`service-tile rounded-xl p-5 flex flex-col justify-between relative group ${
                    isLowStock ? 'border-danger/40 bg-red-50/20' : ''
                  }`}
                >
                  {/* Top line: Index, SKU, Status Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-mutedBrand/70">
                          {formattedIndex}
                        </span>
                        <span className="font-mono text-[11px] bg-secondaryBrand px-2 py-0.5 rounded text-ink font-medium">
                          {item.sku}
                        </span>
                      </div>

                      {/* Stock Health indicator */}
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-danger bg-red-100/80 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock Alert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-success bg-green-100/80 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          In Stock
                        </span>
                      )}
                    </div>

                    {/* Product Name */}
                    <h3 className="text-base font-bold text-ink leading-snug mb-1">
                      {item.name}
                    </h3>
                    
                    {/* Category & Location */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mutedBrand mb-4">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-primary-dark" />
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-mutedBrand" />
                        {item.warehouseLocation}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Stats & Quick Adjustment */}
                  <div className="pt-3 border-t border-borderBrand/60 mt-auto">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-mutedBrand block">Available Qty</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-2xl font-extrabold ${isLowStock ? 'text-danger' : 'text-ink'}`}>
                            {item.stock}
                          </span>
                          <span className="text-xs text-mutedBrand">{item.unit}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono text-mutedBrand block">Unit Price</span>
                        <span className="text-sm font-bold text-ink">
                          GH₵ {item.unitPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Quick Stock +/- Adjuster for Warehouse Audits */}
                    <div className="flex items-center justify-between bg-paper rounded-lg p-1.5 border border-borderBrand/60">
                      <span className="text-[11px] font-mono text-mutedBrand pl-1.5">
                        Min. Reorder: {item.reorderPoint} {item.unit}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onUpdateStock(item.id, Math.max(0, item.stock - 1))}
                          className="w-6 h-6 rounded flex items-center justify-center bg-white border border-borderBrand hover:bg-secondaryBrand text-ink active:scale-95"
                          title="Audit deduction (-1)"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onUpdateStock(item.id, item.stock + 5)}
                          className="px-2 h-6 rounded flex items-center justify-center bg-white border border-borderBrand hover:bg-secondaryBrand text-ink text-[11px] font-mono active:scale-95"
                          title="Restock (+5)"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => onUpdateStock(item.id, item.stock + 20)}
                          className="px-2 h-6 rounded flex items-center justify-center bg-white border border-borderBrand hover:bg-secondaryBrand text-ink text-[11px] font-mono active:scale-95"
                          title="Bulk shipment (+20)"
                        >
                          +20
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
