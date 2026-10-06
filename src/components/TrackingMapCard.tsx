'use client';

import React, { useState } from 'react';
import { DeliveryOrder } from '@/types/logistics';
import { 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Share2, 
  ExternalLink,
  ShieldCheck,
  Truck,
  RotateCw
} from 'lucide-react';

interface TrackingMapCardProps {
  order: DeliveryOrder | null;
}

export const TrackingMapCard: React.FC<TrackingMapCardProps> = ({ order }) => {
  const [copied, setCopied] = useState(false);

  if (!order) {
    return (
      <section id="live-tracking" className="py-10 px-4 lg:px-10 border-b border-borderBrand">
        <div className="max-w-7xl mx-auto">
          <div className="browser-frame p-8 text-center bg-white">
            <p className="text-xs text-mutedBrand font-mono">No order currently selected for tracking.</p>
          </div>
        </div>
      </section>
    );
  }

  const trackingUrl = `https://track.logiflow.gh/${order.trackingNumber}`;

  const copyTrackingLink = () => {
    navigator.clipboard?.writeText(trackingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStepStatus = (stepIdx: number) => {
    if (order.status === 'delivered') return 'completed';
    if (order.status === 'out_for_delivery' || order.status === 'dispatched') {
      if (stepIdx <= 2) return 'completed';
      if (stepIdx === 3) return 'current';
      return 'upcoming';
    }
    if (order.status === 'pending') {
      if (stepIdx === 1) return 'completed';
      if (stepIdx === 2) return 'current';
      return 'upcoming';
    }
    return 'upcoming';
  };

  return (
    <section id="live-tracking" className="py-10 px-4 lg:px-10 border-b border-borderBrand">
      <div className="max-w-7xl mx-auto">
        {/* Section Eyebrow */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow mb-1">03 / REAL-TIME GPS & ROUTE VISUALIZATION</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Customer Tracking Interface
            </h2>
            <p className="text-xs sm:text-sm text-mutedBrand mt-1">
              Public tracking page format sent to customers via Africa’s Talking SMS.
            </p>
          </div>

          <button
            onClick={copyTrackingLink}
            className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-white border border-borderBrand hover:bg-secondaryBrand text-ink text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5 text-primary-dark" />
            <span>{copied ? 'Link Copied!' : 'Copy Customer Tracking Link'}</span>
          </button>
        </div>

        {/* Browser Frame Layout (signature element from chris-pi-three.vercel.app) */}
        <div className="browser-frame shadow-md">
          {/* Browser Bar with traffic dots and tracking URL */}
          <div className="browser-bar">
            <div className="flex items-center gap-1.5">
              <span className="traffic-dot bg-[#ff5f56]" />
              <span className="traffic-dot bg-[#ffbd2e]" />
              <span className="traffic-dot bg-[#27c93f]" />
            </div>
            <div className="mx-auto flex items-center gap-1.5 px-3 py-1 bg-white rounded-md border border-borderBrand/80 text-[11px] font-mono text-mutedBrand max-w-md w-full justify-center">
              <ShieldCheck className="w-3 h-3 text-primary-dark" />
              <span className="truncate">{trackingUrl}</span>
            </div>
          </div>

          {/* Browser Canvas Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 bg-white">
            {/* Left Column: Interactive Simulated Ghana Map View */}
            <div className="lg:col-span-7 p-6 bg-gradient-to-br from-paper to-secondaryBrand/30 border-b lg:border-b-0 lg:border-r border-borderBrand relative overflow-hidden min-h-[380px] flex flex-col justify-between">
              {/* Map Road Grid Graphic */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#5bb6e6" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Accra Route Simulated Line */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded bg-ink text-white font-mono text-[11px] font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    LIVE ACCRA ROUTE LAYER
                  </span>
                  <span className="text-xs font-mono text-mutedBrand font-medium">
                    ETA: ~25 mins
                  </span>
                </div>

                {/* SVG Route Visualization */}
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-borderBrand/80 shadow-sm mb-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-ink mb-3">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-ink" />
                      Tema Industrial Depot (Origin)
                    </span>
                    <span className="text-primary-dark">➔ Tema Motorway ➔</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                      {order.destination}
                    </span>
                  </div>

                  {/* Visual Route Progress Track */}
                  <div className="relative w-full h-3 bg-paper rounded-full overflow-hidden border border-borderBrand">
                    <div 
                      className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000"
                      style={{
                        width: order.status === 'delivered' ? '100%' : order.status === 'out_for_delivery' ? '68%' : '20%'
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-mutedBrand mt-1">
                    <span>Depot Departure</span>
                    <span>Spintex / Airport Bypass</span>
                    <span>Final Destination</span>
                  </div>
                </div>
              </div>

              {/* Map Footer: Rider Location Pin */}
              <div className="relative z-10 bg-white p-3 rounded-xl border border-borderBrand shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondaryBrand flex items-center justify-center text-primary-dark">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-ink">
                      {order.assignedRiderName || 'Awaiting Rider Assignment'}
                    </h4>
                    <p className="text-[11px] text-mutedBrand">
                      {order.assignedRiderPhone || 'Fleet dispatch in progress'}
                    </p>
                  </div>
                </div>
                {order.status === 'out_for_delivery' && (
                  <span className="text-[11px] text-primary-dark font-mono font-semibold bg-primary/15 px-2.5 py-1 rounded-full">
                    GPS Active (Accra)
                  </span>
                )}
              </div>
            </div>

            {/* Right Column: Tracking Milestones & Delivery Details */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between">
              <div>
                <div className="border-b border-borderBrand/70 pb-4 mb-4">
                  <span className="text-[10px] uppercase font-mono text-mutedBrand block">Waybill Number</span>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-extrabold text-ink font-mono">
                      {order.trackingNumber}
                    </h3>
                    <span className="text-xs font-mono font-bold text-primary-dark bg-secondaryBrand px-2 py-0.5 rounded">
                      GH₵ {order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-mutedBrand mt-1">
                    Consignment: {order.quantity}x {order.itemName}
                  </p>
                </div>

                {/* Tracking Milestones Stepper */}
                <h4 className="text-xs font-bold uppercase tracking-wider text-mutedBrand mb-3 font-mono">
                  Delivery Milestones
                </h4>

                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-ink">Order Intake & Verification</h5>
                      <p className="text-[11px] text-mutedBrand">Stock reserved, invoice logged at {order.createdAt}</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      getStepStatus(2) === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : getStepStatus(2) === 'current'
                        ? 'bg-amber-100 text-amber-700 animate-pulse'
                        : 'bg-paper text-mutedBrand border border-borderBrand'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-ink">Depot Sorting & Rider Assignment</h5>
                      <p className="text-[11px] text-mutedBrand">
                        {order.assignedRiderName 
                          ? `Allocated to ${order.assignedRiderName} (${order.vehicleType})` 
                          : 'Pending assignment'}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      getStepStatus(3) === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : getStepStatus(3) === 'current'
                        ? 'bg-primary/20 text-primary-dark ring-2 ring-primary animate-pulse'
                        : 'bg-paper text-mutedBrand border border-borderBrand'
                    }`}>
                      <Navigation className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-ink">Out for Delivery (Transit)</h5>
                      <p className="text-[11px] text-mutedBrand">
                        En route to {order.destination}
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      order.status === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-paper text-mutedBrand border border-borderBrand'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-ink">Delivered & Signed</h5>
                      <p className="text-[11px] text-mutedBrand">
                        {order.deliveredAt 
                          ? `Delivered at ${order.deliveredAt}` 
                          : 'Expected by end of day'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Delivery Recipient Box */}
              <div className="mt-6 pt-4 border-t border-borderBrand/60 bg-paper/60 p-3 rounded-xl border border-borderBrand/80">
                <span className="text-[10px] uppercase font-mono text-mutedBrand block">Delivery Recipient</span>
                <span className="text-xs font-bold text-ink block">{order.customerName}</span>
                <span className="text-[11px] text-mutedBrand font-mono">{order.customerPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
