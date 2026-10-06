'use client';

import React, { useState } from 'react';
import { useLogisticsStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { HeroCommandBar } from '@/components/HeroCommandBar';
import { InventorySection } from '@/components/InventorySection';
import { OrderDispatchSection } from '@/components/OrderDispatchSection';
import { TrackingMapCard } from '@/components/TrackingMapCard';
import { AnalyticsSection } from '@/components/AnalyticsSection';
import { NotificationCenter } from '@/components/NotificationCenter';
import { CreateOrderModal } from '@/components/Modals/CreateOrderModal';
import { AddInventoryModal } from '@/components/Modals/AddInventoryModal';
import { SystemKPIs } from '@/types/logistics';
import { Sparkles, Heart } from 'lucide-react';

export default function HomePage() {
  const {
    inventory,
    orders,
    riders,
    notifications,
    currentUser,
    selectedOrder,
    setSelectedOrder,
    isLoaded,
    addInventoryItem,
    updateStock,
    createOrder,
    assignRider,
    updateOrderStatus,
    addNotification,
    switchRole,
    resetToSampleData,
  } = useLogisticsStore();

  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isAddInventoryOpen, setIsAddInventoryOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Dynamic KPI calculations
  const activeShipments = orders.filter(
    (o) => o.status === 'out_for_delivery' || o.status === 'dispatched'
  ).length;

  const pendingDispatch = orders.filter((o) => o.status === 'pending').length;

  const lowStockAlerts = inventory.filter(
    (item) => item.stock <= item.reorderPoint
  ).length;

  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const nonCancelledTotal = orders.filter((o) => o.status !== 'cancelled').length;
  const onTimeRate = nonCancelledTotal > 0
    ? Math.round((deliveredCount / nonCancelledTotal) * 100)
    : 98;

  const kpis: SystemKPIs = {
    totalMetricTonnes: 540, // Base freight tonnage handled monthly (inspired by Swiftly Global case study)
    activeShipments,
    pendingDispatch,
    lowStockAlerts,
    avgDeliveryHours: 2.4,
    onTimeDeliveryRate: onTimeRate,
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-ink rounded-full animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest text-mutedBrand">
            Initializing LogiFlow Ghana Engine...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans">
      {/* 1. Brand & Role Header */}
      <Header
        currentUser={currentUser}
        onRoleChange={switchRole}
        unreadCount={notifications.length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onResetData={resetToSampleData}
      />

      {/* 2. Deep Ink Command Center */}
      <HeroCommandBar
        kpis={kpis}
        onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
        onOpenAddInventory={() => setIsAddInventoryOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 3. Real-Time Inventory Control Section */}
        <InventorySection
          inventory={inventory}
          onAddStockClick={() => setIsAddInventoryOpen(true)}
          onUpdateStock={updateStock}
        />

        {/* 4. Order Processing & Dispatch Section */}
        <OrderDispatchSection
          orders={orders}
          riders={riders}
          selectedOrderId={selectedOrder?.id || null}
          onSelectOrder={setSelectedOrder}
          onAssignRider={assignRider}
          onUpdateStatus={updateOrderStatus}
          onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
        />

        {/* 5. Live GPS Route Tracking Browser Frame */}
        <TrackingMapCard order={selectedOrder} />

        {/* 6. Logistics Intelligence & Reports */}
        <AnalyticsSection orders={orders} inventory={inventory} />
      </main>

      {/* Modals & Drawers */}
      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        inventory={inventory}
        onSubmitOrder={(data) => {
          createOrder(data);
        }}
      />

      <AddInventoryModal
        isOpen={isAddInventoryOpen}
        onClose={() => setIsAddInventoryOpen(false)}
        onAddProduct={addInventoryItem}
      />

      <NotificationCenter
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onAddNotification={addNotification}
      />

      {/* Editorial Footer matching chris-pi-three.vercel.app aesthetic */}
      <footer className="bg-ink text-paper py-10 px-4 lg:px-10 border-t border-borderBrand/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-base text-white flex items-center">
              logiflow<span className="text-primary text-sm ml-0.5">✦</span>
            </span>
            <span className="text-mutedBrand">·</span>
            <span className="text-[#b7b7ac]">
              Logistics Management System for Start-up Firms in Ghana
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#b7b7ac] font-mono text-[11px]">
            <span>UPSA · 2026</span>
            <span>AFRICA&apos;S TALKING SMS</span>
            <span>NEXT.JS & FIRESTORE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
