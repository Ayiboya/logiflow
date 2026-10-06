'use client';

import React, { useState } from 'react';
import { 
  DeliveryOrder, 
  DispatchRider, 
  OrderStatus 
} from '@/types/logistics';
import { 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Navigation,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface OrderDispatchSectionProps {
  orders: DeliveryOrder[];
  riders: DispatchRider[];
  selectedOrderId: string | null;
  onSelectOrder: (order: DeliveryOrder) => void;
  onAssignRider: (orderId: string, riderId: string) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onOpenCreateOrder: () => void;
}

type TabType = 'all' | 'pending' | 'out_for_delivery' | 'delivered' | 'cancelled';

export const OrderDispatchSection: React.FC<OrderDispatchSectionProps> = ({
  orders,
  riders,
  selectedOrderId,
  onSelectOrder,
  onAssignRider,
  onUpdateStatus,
  onOpenCreateOrder,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'out_for_delivery') return order.status === 'out_for_delivery' || order.status === 'dispatched';
    return order.status === activeTab;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            Pending Dispatch
          </span>
        );
      case 'dispatched':
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/20 text-primary-dark px-2.5 py-0.5 rounded-full animate-pulse">
            <Truck className="w-3 h-3" />
            Out for Delivery
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" />
            Cancelled (Stock Restored)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="orders" className="py-10 px-4 lg:px-10 border-b border-borderBrand bg-white/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow mb-1">02 / ORDER FULFILLMENT & DISPATCH PIPELINE</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Active Shipments & Deliveries
            </h2>
            <p className="text-xs sm:text-sm text-mutedBrand mt-1">
              Assign dispatch riders, send automated Ghana SMS alerts, and track status.
            </p>
          </div>

          <button
            onClick={onOpenCreateOrder}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-primary text-ink hover:brightness-105 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 shadow-sm"
          >
            <Package className="w-4 h-4" />
            <span>+ Book New Delivery</span>
          </button>
        </div>

        {/* Tab Filters with Counters (matching chris-pi-three filter buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scroll-fade-x">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'all'
                ? 'bg-ink text-paper shadow-sm'
                : 'bg-white hover:bg-secondaryBrand text-mutedBrand border border-borderBrand/80'
            }`}
          >
            <span>All Shipments</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-secondaryBrand text-ink font-mono">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'pending'
                ? 'bg-ink text-paper shadow-sm'
                : 'bg-white hover:bg-secondaryBrand text-mutedBrand border border-borderBrand/80'
            }`}
          >
            <span>Pending Dispatch</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-secondaryBrand text-ink font-mono">
              {orders.filter((o) => o.status === 'pending').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('out_for_delivery')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'out_for_delivery'
                ? 'bg-ink text-paper shadow-sm'
                : 'bg-white hover:bg-secondaryBrand text-mutedBrand border border-borderBrand/80'
            }`}
          >
            <span>Out for Delivery</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-secondaryBrand text-ink font-mono">
              {orders.filter((o) => o.status === 'out_for_delivery' || o.status === 'dispatched').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('delivered')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'delivered'
                ? 'bg-ink text-paper shadow-sm'
                : 'bg-white hover:bg-secondaryBrand text-mutedBrand border border-borderBrand/80'
            }`}
          >
            <span>Delivered</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-secondaryBrand text-ink font-mono">
              {orders.filter((o) => o.status === 'delivered').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'cancelled'
                ? 'bg-ink text-paper shadow-sm'
                : 'bg-white hover:bg-secondaryBrand text-mutedBrand border border-borderBrand/80'
            }`}
          >
            <span>Cancelled</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-secondaryBrand text-ink font-mono">
              {orders.filter((o) => o.status === 'cancelled').length}
            </span>
          </button>
        </div>

        {/* Order Cards Grid */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-borderBrand p-12 text-center">
            <Truck className="w-10 h-10 mx-auto text-mutedBrand/60 mb-2" />
            <h4 className="text-sm font-semibold text-ink">No orders in this view</h4>
            <p className="text-xs text-mutedBrand mt-1">Select another filter tab or create a new delivery order.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((order, idx) => {
              const isSelected = selectedOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className={`service-tile rounded-xl p-5 flex flex-col justify-between transition-all ${
                    isSelected ? 'ring-2 ring-primary border-primary shadow-md' : ''
                  }`}
                >
                  <div>
                    {/* Header: Tracking # & Status */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-mutedBrand">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="font-mono text-xs font-bold text-ink bg-secondaryBrand px-2 py-0.5 rounded">
                          {order.trackingNumber}
                        </span>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    {/* Customer & Item */}
                    <div className="mb-3">
                      <h3 className="text-base font-bold text-ink leading-tight">
                        {order.customerName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mutedBrand mt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-primary-dark" />
                          {order.customerPhone}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {order.createdAt}
                        </span>
                      </div>
                    </div>

                    {/* Delivery Destination Badge */}
                    <div className="bg-paper p-3 rounded-lg border border-borderBrand/70 mb-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary-dark shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-semibold text-ink block leading-snug">
                            {order.destination}
                          </span>
                          <span className="text-[11px] text-mutedBrand block">
                            {order.region}, Ghana
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Item details */}
                    <div className="flex items-center justify-between text-xs py-2 border-y border-borderBrand/60 mb-3">
                      <div>
                        <span className="text-mutedBrand block text-[10px] uppercase font-mono">Item Ordered</span>
                        <span className="font-semibold text-ink">
                          {order.quantity}x {order.itemName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-mutedBrand block text-[10px] uppercase font-mono">Order Value</span>
                        <span className="font-bold text-ink">
                          GH₵ {order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Assigned Rider Info */}
                    {order.assignedRiderName ? (
                      <div className="flex items-center justify-between text-xs bg-secondaryBrand/50 p-2 rounded-lg border border-borderBrand/60 mb-3">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-ink" />
                          <div>
                            <span className="font-bold text-ink block">
                              {order.assignedRiderName}
                            </span>
                            <span className="text-[10px] text-mutedBrand">
                              {order.vehicleType} · {order.assignedRiderPhone}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-primary-dark font-medium">Assigned</span>
                      </div>
                    ) : (
                      order.status !== 'cancelled' && (
                        <div className="bg-amber-50/60 border border-amber-200 p-2 rounded-lg text-xs text-amber-800 mb-3 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            No dispatch rider assigned yet
                          </span>
                        </div>
                      )
                    )}

                    {/* Inline Rider Assignment Selector */}
                    {assigningOrderId === order.id && (
                      <div className="mb-3 p-3 bg-paper rounded-xl border border-primary animate-in">
                        <label className="block text-[11px] font-bold text-ink uppercase tracking-wide mb-1.5">
                          Select Available Dispatch Rider:
                        </label>
                        <div className="grid grid-cols-1 gap-1.5 max-h-40 overflow-y-auto pr-1">
                          {riders.map((r) => (
                            <button
                              key={r.id}
                              onClick={() => {
                                onAssignRider(order.id, r.id);
                                setAssigningOrderId(null);
                              }}
                              className="text-left p-2 rounded-lg border border-borderBrand bg-white hover:bg-secondaryBrand transition flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-bold text-ink">{r.name}</span>
                                <span className="text-[10px] text-mutedBrand block">
                                  {r.vehicle} · {r.currentZone}
                                </span>
                              </div>
                              <span className="text-[11px] font-semibold text-primary-dark">
                                Assign ➔
                              </span>
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => setAssigningOrderId(null)}
                          className="mt-2 text-[11px] text-mutedBrand hover:text-ink underline block"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-borderBrand/50 mt-auto">
                    {/* View on Map button */}
                    <button
                      onClick={() => {
                        onSelectOrder(order);
                        const mapElement = document.getElementById('live-tracking');
                        mapElement?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg border border-borderBrand bg-white hover:bg-secondaryBrand text-ink text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Navigation className="w-3.5 h-3.5 text-primary-dark" />
                      <span>{isSelected ? 'Viewing on Map' : 'Track on Map'}</span>
                    </button>

                    {/* State change triggers */}
                    <div className="flex items-center gap-1.5">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => setAssigningOrderId(order.id)}
                          className="px-3 py-1.5 rounded-lg bg-ink text-white hover:bg-ink/90 text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-primary" />
                          <span>Dispatch Rider</span>
                        </button>
                      )}

                      {order.status === 'out_for_delivery' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'delivered')}
                          className="px-3 py-1.5 rounded-lg bg-green-700 hover:bg-green-800 text-white text-xs font-semibold flex items-center gap-1 transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Delivery</span>
                        </button>
                      )}

                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <button
                          onClick={() => onUpdateStatus(order.id, 'cancelled')}
                          className="px-2 py-1.5 rounded-lg border border-borderBrand hover:bg-red-50 text-danger text-xs font-medium transition"
                          title="Cancel order and restore stock to warehouse"
                        >
                          Cancel
                        </button>
                      )}
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
