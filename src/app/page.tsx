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

  // ============================================================
  // DYNAMIC KPI CALCULATIONS
  // ============================================================

  // Orders currently being dispatched or delivered
  const activeShipments = orders.filter(
    (order) =>
      order.status === 'out_for_delivery' ||
      order.status === 'dispatched'
  ).length;

  // Orders waiting to be dispatched
  const pendingDispatch = orders.filter(
    (order) => order.status === 'pending'
  ).length;

  // Inventory items that have reached or fallen below
  // their reorder threshold
  const lowStockAlerts = inventory.filter(
    (item) => item.stock <= item.reorderPoint
  ).length;

  // Number of delivered orders
  const deliveredCount = orders.filter(
    (order) => order.status === 'delivered'
  ).length;

  // Ignore cancelled orders when calculating delivery performance
  const nonCancelledTotal = orders.filter(
    (order) => order.status !== 'cancelled'
  ).length;

  // Calculate on-time delivery percentage
  const onTimeRate =
    nonCancelledTotal > 0
      ? Math.round((deliveredCount / nonCancelledTotal) * 100)
      : 98;

  // Calculate total revenue from all non-cancelled orders
  const totalRevenueGHS = orders
    .filter((order) => order.status !== 'cancelled')
    .reduce(
      (total, order) => total + order.totalAmount,
      0
    );

  // ============================================================
  // SYSTEM KPIs
  // ============================================================

  const kpis: SystemKPIs = {
    totalMetricTonnes: 540,
    activeShipments,
    pendingDispatch,
    lowStockAlerts,
    avgDeliveryHours: 2.4,
    onTimeDeliveryRate: onTimeRate,
    totalRevenueGHS,
  };

  // ============================================================
  // SCROLL HANDLER
  // ============================================================

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  // ============================================================
  // LOADING SCREEN
  // ============================================================

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

  // ============================================================
  // MAIN PAGE
  // ============================================================

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans">

      {/* ========================================================
          1. BRAND & ROLE HEADER
      ======================================================== */}

      <Header
        currentUser={currentUser}
        onRoleChange={switchRole}
        unreadCount={notifications.length}
        onOpenNotifications={() =>
          setIsNotificationsOpen(true)
        }
        onResetData={resetToSampleData}
      />

      {/* ========================================================
          2. COMMAND CENTER
      ======================================================== */}

      <HeroCommandBar
        kpis={kpis}
        onOpenCreateOrder={() =>
          setIsCreateOrderOpen(true)
        }
        onOpenAddInventory={() =>
          setIsAddInventoryOpen(true)
        }
        onScrollToSection={handleScrollToSection}
      />

      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <main className="flex-1">

        {/* ======================================================
            3. INVENTORY CONTROL
        ====================================================== */}

        <InventorySection
          inventory={inventory}
          onAddStockClick={() =>
            setIsAddInventoryOpen(true)
          }
          onUpdateStock={updateStock}
        />

        {/* ======================================================
            4. ORDER PROCESSING & DISPATCH
        ====================================================== */}

        <OrderDispatchSection
          orders={orders}
          riders={riders}
          selectedOrderId={selectedOrder?.id || null}
          onSelectOrder={setSelectedOrder}
          onAssignRider={assignRider}
          onUpdateStatus={updateOrderStatus}
          onOpenCreateOrder={() =>
            setIsCreateOrderOpen(true)
          }
        />

        {/* ======================================================
            5. LIVE GPS ROUTE TRACKING
        ====================================================== */}

        <TrackingMapCard
          order={selectedOrder}
        />

        {/* ======================================================
            6. ANALYTICS & REPORTS
        ====================================================== */}

        <AnalyticsSection
          orders={orders}
          inventory={inventory}
        />
      </main>

      {/* ========================================================
          CREATE ORDER MODAL
      ======================================================== */}

      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() =>
          setIsCreateOrderOpen(false)
        }
        inventory={inventory}
        onSubmitOrder={(data) => {
          createOrder(data);
          setIsCreateOrderOpen(false);
        }}
      />

      {/* ========================================================
          ADD INVENTORY MODAL
      ======================================================== */}

      <AddInventoryModal
        isOpen={isAddInventoryOpen}
        onClose={() =>
          setIsAddInventoryOpen(false)
        }
        onAddProduct={addInventoryItem}
      />

      {/* ========================================================
          NOTIFICATION CENTER
      ======================================================== */}

      <NotificationCenter
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() =>
          setIsNotificationsOpen(false)
        }
        onAddNotification={addNotification}
      />

      {/* ========================================================
          FOOTER
      ======================================================== */}

      <footer className="bg-ink text-paper py-10 px-4 lg:px-10 border-t border-borderBrand/20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-base text-white flex items-center">
              logiflow
              <span className="text-primary text-sm ml-0.5">
                ✦
              </span>
            </span>

            <span className="text-mutedBrand">
              ·
            </span>

            <span className="text-[#b7b7ac]">
              Logistics Management System for Start-up Firms in Ghana
            </span>
          </div>

          {/* Technology / Project Information */}
          <div className="flex items-center gap-4 text-[#b7b7ac] font-mono text-[11px]">
            <span>
              UPSA · 2026
            </span>

            <span>
              AFRICA&apos;S TALKING SMS
            </span>

            <span>
              NEXT.JS & FIRESTORE
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}