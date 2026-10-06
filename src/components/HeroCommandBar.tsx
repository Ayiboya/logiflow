'use client';

import React, { useState, useEffect } from 'react';
import { 
  PackagePlus, 
  Boxes, 
  MapPin, 
  TrendingUp, 
  AlertTriangle, 
  Truck, 
  Clock, 
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { SystemKPIs } from '@/types/logistics';

interface HeroCommandBarProps {
  kpis: SystemKPIs;
  onOpenCreateOrder: () => void;
  onOpenAddInventory: () => void;
  onScrollToSection: (sectionId: string) => void;
}

const CYCLING_STAGES = [
  'ORDER INTAKE',
  'AUTOMATED STOCK SYNC',
  'RIDER DISPATCH',
  'LAST-MILE FULFILLMENT',
];

export const HeroCommandBar: React.FC<HeroCommandBarProps> = ({
  kpis,
  onOpenCreateOrder,
  onOpenAddInventory,
  onScrollToSection,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStageIdx((prev) => (prev + 1) % CYCLING_STAGES.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-ink text-paper pt-8 pb-10 px-4 lg:px-10 border-b border-borderBrand/20 relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Eyebrow row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-[#b7b7ac] text-xs font-mono tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>SWIFT FREIGHT & PARCEL OPERATIONS · GREATER ACCRA</span>
          </div>
          <span className="text-[11px] opacity-80">CASE STUDY: RAPID STARTUP SCALE</span>
        </div>

        {/* Big Rotating Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none mb-3">
              INTELLIGENT LOGISTICS. <br />
              <span className="text-primary inline-flex items-center gap-2">
                {CYCLING_STAGES[currentStageIdx]}
                <span className="text-white text-2xl lg:text-4xl">.</span>
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#b7b7ac] max-w-2xl font-normal leading-relaxed">
              Replacing manual spreadsheets and phone coordination with a unified, real-time logistics engine tailored for Ghanaian startups.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
            <button
              onClick={onOpenCreateOrder}
              className="px-5 py-3 rounded-xl bg-primary text-ink font-bold text-sm hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <PackagePlus className="w-4 h-4" />
              <span>+ Book Customer Order</span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={onOpenAddInventory}
                className="flex-1 px-4 py-2.5 rounded-xl border border-white/20 hover:border-primary text-paper hover:text-primary text-xs font-semibold transition flex items-center justify-center gap-1.5"
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>+ Restock Item</span>
              </button>
              <button
                onClick={() => onScrollToSection('live-tracking')}
                className="px-4 py-2.5 rounded-xl border border-white/20 hover:border-primary text-paper hover:text-primary text-xs font-semibold transition flex items-center justify-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Key Performance Indicator Cards (matching chris-pi-three card look) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* KPI 1: Handled Volume */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-primary/50 transition">
            <div className="flex items-center justify-between text-xs text-[#b7b7ac] mb-2 font-mono">
              <span>01 / FREIGHT VOLUME</span>
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
              {kpis.totalMetricTonnes} <span className="text-sm font-normal text-primary">T/mo</span>
            </div>
            <p className="text-[11px] text-[#b7b7ac] truncate">
              Tema Port & local transport
            </p>
          </div>

          {/* KPI 2: Active Dispatches */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-primary/50 transition">
            <div className="flex items-center justify-between text-xs text-[#b7b7ac] mb-2 font-mono">
              <span>02 / IN TRANSIT</span>
              <Truck className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
              {kpis.activeShipments} <span className="text-sm font-normal text-[#b7b7ac]">Active</span>
            </div>
            <p className="text-[11px] text-[#b7b7ac] truncate">
              Assigned to motorbike & van fleet
            </p>
          </div>

          {/* KPI 3: Low Stock Alerts */}
          <div className={`border rounded-xl p-4 transition ${
            kpis.lowStockAlerts > 0 
              ? 'bg-danger/10 border-danger/40 text-danger' 
              : 'bg-white/5 border-white/10 text-white'
          }`}>
            <div className="flex items-center justify-between text-xs mb-2 font-mono opacity-80">
              <span>03 / STOCK ALERTS</span>
              <AlertTriangle className="w-4 h-4 text-danger" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1 flex items-baseline gap-1.5">
              <span>{kpis.lowStockAlerts}</span>
              <span className="text-xs font-semibold text-danger">SKUs Low</span>
            </div>
            <p className="text-[11px] text-[#b7b7ac] truncate">
              Automatic reorder triggers
            </p>
          </div>

          {/* KPI 4: Turnaround Time */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-primary/50 transition">
            <div className="flex items-center justify-between text-xs text-[#b7b7ac] mb-2 font-mono">
              <span>04 / TURNAROUND</span>
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
              {kpis.avgDeliveryHours} <span className="text-sm font-normal text-primary">hrs</span>
            </div>
            <p className="text-[11px] text-[#b7b7ac] truncate">
              {kpis.onTimeDeliveryRate}% on-time dispatch rate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
