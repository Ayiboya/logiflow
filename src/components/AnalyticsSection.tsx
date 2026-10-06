'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  ArrowUpRight 
} from 'lucide-react';
import { DeliveryOrder, InventoryItem } from '@/types/logistics';

interface AnalyticsSectionProps {
  orders: DeliveryOrder[];
  inventory: InventoryItem[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  orders,
  inventory,
}) => {
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const inTransitCount = orders.filter(
    (o) => o.status === 'out_for_delivery' || o.status === 'dispatched'
  ).length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const inventoryValue = inventory.reduce(
    (sum, item) => sum + item.stock * item.unitPrice,
    0
  );

  return (
    <section id="analytics" className="py-10 px-4 lg:px-10 border-b border-borderBrand">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow mb-1">04 / LOGISTICS INTELLIGENCE & REPORTING</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Operational Performance & Analytics
            </h2>
            <p className="text-xs sm:text-sm text-mutedBrand mt-1">
              Data-backed insights for Ghanaian startup founders, operations managers, and stakeholders.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-white border border-borderBrand text-xs font-mono text-ink">
              Accra & Tema Fleet Coverage
            </span>
          </div>
        </div>

        {/* 3 Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Card 1: Revenue & Order Value */}
          <div className="service-tile rounded-xl p-5">
            <div className="flex items-center justify-between text-xs text-mutedBrand mb-2 font-mono">
              <span>DISPATCH VALUE (GHS)</span>
              <TrendingUp className="w-4 h-4 text-primary-dark" />
            </div>
            <div className="text-2xl font-extrabold text-ink mb-1">
              GH₵ {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-mutedBrand">
              From {orders.length} lifetime customer shipments
            </p>
          </div>

          {/* Card 2: Total Inventory Valuation */}
          <div className="service-tile rounded-xl p-5">
            <div className="flex items-center justify-between text-xs text-mutedBrand mb-2 font-mono">
              <span>WAREHOUSE ASSET VALUE</span>
              <BarChart3 className="w-4 h-4 text-primary-dark" />
            </div>
            <div className="text-2xl font-extrabold text-ink mb-1">
              GH₵ {inventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-mutedBrand">
              Across {inventory.length} active registered SKUs
            </p>
          </div>

          {/* Card 3: Fulfillment Success Rate */}
          <div className="service-tile rounded-xl p-5">
            <div className="flex items-center justify-between text-xs text-mutedBrand mb-2 font-mono">
              <span>SUCCESSFUL DISPATCH RATE</span>
              <CheckCircle2 className="w-4 h-4 text-green-700" />
            </div>
            <div className="text-2xl font-extrabold text-ink mb-1">
              {orders.length > 0
                ? Math.round(
                    (deliveredCount / Math.max(1, orders.length - orders.filter(o => o.status === 'cancelled').length)) * 100
                  )
                : 100}
              %
            </div>
            <p className="text-xs text-mutedBrand">
              {deliveredCount} delivered · {inTransitCount} currently in transit
            </p>
          </div>
        </div>

        {/* Operational Corridors & Academic Evaluation Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Active Logistics Corridors in Accra */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-borderBrand p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-mutedBrand font-mono mb-3">
              Top Ghanaian Logistics Transit Corridors
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-paper border border-borderBrand/60 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-dark" />
                  <div>
                    <span className="font-bold text-ink block">Tema Port ➔ Accra North Industrial Area</span>
                    <span className="text-[10px] text-mutedBrand">Bulk freight & container offloading</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-ink">45% volume</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-paper border border-borderBrand/60 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-dark" />
                  <div>
                    <span className="font-bold text-ink block">Spintex Corridor ➔ East Legon & Airport</span>
                    <span className="text-[10px] text-mutedBrand">E-commerce parcel & solar hardware</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-ink">32% volume</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-paper border border-borderBrand/60 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-dark" />
                  <div>
                    <span className="font-bold text-ink block">Central Accra ➔ Osu & Cantonments</span>
                    <span className="text-[10px] text-mutedBrand">Express retail & food delivery</span>
                  </div>
                </div>
                <span className="font-mono font-bold text-ink">23% volume</span>
              </div>
            </div>
          </div>

          {/* Academic & Research Context (UPSA Project Evaluation) */}
          <div className="lg:col-span-5 bg-ink text-paper rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-primary font-mono mb-2">
                <span>TAM SYSTEM EVALUATION</span>
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                Technology Acceptance Metric
              </h4>
              <p className="text-xs text-[#b7b7ac] leading-relaxed mb-4">
                Designed according to the Technology Acceptance Model (Davis, 1989): maximizing Perceived Usefulness (PU) and Perceived Ease of Use (PEOU) for resource-constrained Ghanaian startups.
              </p>
            </div>

            <div className="p-3 bg-white/10 rounded-lg border border-white/15 text-xs">
              <span className="text-[11px] text-primary block font-mono">System Efficacy Summary:</span>
              <p className="text-[11px] text-white/90 mt-1">
                Zero manual spreadsheet dependencies, automated inventory deduction, and instant Africa&apos;s Talking SMS tracking links.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
