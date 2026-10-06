'use client';

import { useState, useEffect } from 'react';
import { 
  InventoryItem, 
  DeliveryOrder, 
  DispatchRider, 
  NotificationRecord, 
  UserRole, 
  UserProfile,
  OrderStatus
} from '@/types/logistics';
import { 
  INITIAL_INVENTORY, 
  INITIAL_ORDERS, 
  INITIAL_RIDERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_USER 
} from './mockData';

const STORAGE_KEYS = {
  INVENTORY: 'logiflow_inventory_v1',
  ORDERS: 'logiflow_orders_v1',
  RIDERS: 'logiflow_riders_v1',
  NOTIFICATIONS: 'logiflow_notifications_v1',
  USER: 'logiflow_user_v1',
};

export function useLogisticsStore() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [riders, setRiders] = useState<DispatchRider[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from LocalStorage or defaults
  useEffect(() => {
    try {
      const savedInv = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      const savedRiders = localStorage.getItem(STORAGE_KEYS.RIDERS);
      const savedNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

      setInventory(savedInv ? JSON.parse(savedInv) : INITIAL_INVENTORY);
      
      const loadedOrders = savedOrders ? JSON.parse(savedOrders) : INITIAL_ORDERS;
      setOrders(loadedOrders);
      if (loadedOrders.length > 0) {
        setSelectedOrder(loadedOrders[0]);
      }

      setRiders(savedRiders ? JSON.parse(savedRiders) : INITIAL_RIDERS);
      setNotifications(savedNotifs ? JSON.parse(savedNotifs) : INITIAL_NOTIFICATIONS);
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch {
      setInventory(INITIAL_INVENTORY);
      setOrders(INITIAL_ORDERS);
      setRiders(INITIAL_RIDERS);
      setNotifications(INITIAL_NOTIFICATIONS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes
  const saveState = (
    newInv: InventoryItem[], 
    newOrders: DeliveryOrder[], 
    newNotifs: NotificationRecord[],
    newRiders?: DispatchRider[]
  ) => {
    setInventory(newInv);
    setOrders(newOrders);
    setNotifications(newNotifs);
    if (newRiders) setRiders(newRiders);

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(newInv));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(newOrders));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(newNotifs));
      if (newRiders) localStorage.setItem(STORAGE_KEYS.RIDERS, JSON.stringify(newRiders));
    }
  };

  // Add Inventory Item
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'updatedAt'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv_${Date.now()}`,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    const updated = [newItem, ...inventory];
    setInventory(updated);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updated));

    // Create system notification
    addNotification({
      type: 'system',
      title: 'New SKU Registered',
      recipient: 'Warehouse Ops',
      content: `New product added: ${itemData.name} (${itemData.sku}) with ${itemData.stock} ${itemData.unit} at GH₵${itemData.unitPrice}.`,
      gateway: 'System Push',
    });
  };

  // Update Inventory Stock Count manually
  const updateStock = (itemId: string, newStock: number) => {
    const updated = inventory.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          stock: newStock,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
      }
      return item;
    });
    setInventory(updated);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(updated));
  };

  // Create Order with automatic inventory reduction & SMS dispatch
  const createOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    destination: string;
    itemId: string;
    quantity: number;
    notes?: string;
  }) => {
    const targetItem = inventory.find(i => i.id === orderData.itemId);
    if (!targetItem) {
      throw new Error('Selected item was not found in warehouse inventory.');
    }
    if (targetItem.stock < orderData.quantity) {
      throw new Error(`Insufficient stock: Only ${targetItem.stock} ${targetItem.unit} available.`);
    }

    const orderId = `ord_${Date.now()}`;
    const trackingCode = `GH-2026-${Math.floor(100 + Math.random() * 900)}`;
    const total = targetItem.unitPrice * orderData.quantity;

    // Deduct stock
    const newStockCount = targetItem.stock - orderData.quantity;
    const updatedInventory = inventory.map(item => {
      if (item.id === targetItem.id) {
        return {
          ...item,
          stock: newStockCount,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
      }
      return item;
    });

    const newOrder: DeliveryOrder = {
      id: orderId,
      trackingNumber: trackingCode,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      destination: orderData.destination,
      region: 'Greater Accra',
      coordinates: {
        lat: 5.55 + (Math.random() * 0.08),
        lng: -0.20 + (Math.random() * 0.15),
      },
      itemId: targetItem.id,
      itemName: targetItem.name,
      quantity: orderData.quantity,
      totalAmount: total,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      notes: orderData.notes,
    };

    const updatedOrders = [newOrder, ...orders];
    setSelectedOrder(newOrder);

    // Queue SMS notification via Africa's Talking
    const smsNotif: NotificationRecord = {
      id: `notif_${Date.now()}`,
      type: 'sms',
      title: 'Order Confirmed SMS',
      recipient: `${orderData.customerPhone} (${orderData.customerName})`,
      content: `LogiFlow: Order ${trackingCode} received (${orderData.quantity}x ${targetItem.name}). Amount: GH₵${total.toFixed(2)}. Tracking link: https://track.logiflow.gh/${trackingCode}`,
      timestamp: 'Just now',
      gateway: "Africa's Talking",
      status: 'delivered',
      orderId: newOrder.id,
    };

    let updatedNotifs = [smsNotif, ...notifications];

    // Check if low stock reached
    if (newStockCount <= targetItem.reorderPoint) {
      const lowStockAlert: NotificationRecord = {
        id: `notif_ls_${Date.now()}`,
        type: 'system',
        title: '⚠️ Critical Low Stock Warning',
        recipient: 'Warehouse Ops Manager',
        content: `Alert: ${targetItem.name} has fallen to ${newStockCount} ${targetItem.unit} (Minimum threshold is ${targetItem.reorderPoint} ${targetItem.unit}). Restock immediately.`,
        timestamp: 'Just now',
        gateway: 'System Push',
        status: 'delivered',
      };
      updatedNotifs = [lowStockAlert, ...updatedNotifs];
    }

    saveState(updatedInventory, updatedOrders, updatedNotifs);
    return newOrder;
  };

  // Assign Rider & Move to Dispatched / Out for Delivery
  const assignRider = (orderId: string, riderId: string) => {
    const rider = riders.find(r => r.id === riderId);
    if (!rider) return;

    const updatedOrders = orders.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          assignedRiderId: rider.id,
          assignedRiderName: rider.name,
          assignedRiderPhone: rider.phone,
          vehicleType: rider.vehicle,
          status: 'out_for_delivery' as OrderStatus,
          dispatchedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
      }
      return ord;
    });

    const targetOrder = updatedOrders.find(o => o.id === orderId);
    if (targetOrder) setSelectedOrder(targetOrder);

    // Trigger SMS dispatch alert to customer
    const dispatchSms: NotificationRecord = {
      id: `notif_disp_${Date.now()}`,
      type: 'sms',
      title: 'Dispatched with Rider SMS',
      recipient: `${targetOrder?.customerPhone} (${targetOrder?.customerName})`,
      content: `LogiFlow: Your parcel (${targetOrder?.trackingNumber}) has been picked up by rider ${rider.name} (${rider.phone}, ${rider.vehicle}). Expected delivery within Accra today.`,
      timestamp: 'Just now',
      gateway: "Africa's Talking",
      status: 'delivered',
      orderId,
    };

    const updatedRiders = riders.map(r => 
      r.id === riderId ? { ...r, status: 'on_delivery' as const } : r
    );

    saveState(inventory, updatedOrders, [dispatchSms, ...notifications], updatedRiders);
  };

  // Update Status (Delivered or Cancelled with stock reversal)
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    let updatedInventory = [...inventory];
    let newNotifs = [...notifications];

    // If cancelled, RESTORE stock back to inventory
    if (newStatus === 'cancelled' && targetOrder.status !== 'cancelled') {
      updatedInventory = inventory.map(item => {
        if (item.id === targetOrder.itemId) {
          return {
            ...item,
            stock: item.stock + targetOrder.quantity,
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          };
        }
        return item;
      });

      newNotifs.unshift({
        id: `notif_canc_${Date.now()}`,
        type: 'system',
        title: 'Order Cancelled & Stock Restored',
        recipient: 'Inventory Ledger',
        content: `Order ${targetOrder.trackingNumber} cancelled. Refunded ${targetOrder.quantity} ${targetOrder.itemName} back to warehouse stock.`,
        timestamp: 'Just now',
        gateway: 'System Push',
        status: 'delivered',
        orderId,
      });
    }

    if (newStatus === 'delivered') {
      newNotifs.unshift({
        id: `notif_deliv_${Date.now()}`,
        type: 'sms',
        title: 'Delivery Completed Confirmation',
        recipient: `${targetOrder.customerPhone} (${targetOrder.customerName})`,
        content: `LogiFlow: Package ${targetOrder.trackingNumber} successfully delivered to ${targetOrder.destination}. Thank you for choosing LogiFlow Ghana!`,
        timestamp: 'Just now',
        gateway: "Africa's Talking",
        status: 'delivered',
        orderId,
      });
    }

    const updatedOrders = orders.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          status: newStatus,
          deliveredAt: newStatus === 'delivered' 
            ? new Date().toISOString().replace('T', ' ').substring(0, 16) 
            : ord.deliveredAt,
        };
      }
      return ord;
    });

    const activeOrderMatch = updatedOrders.find(o => o.id === orderId);
    if (activeOrderMatch) setSelectedOrder(activeOrderMatch);

    saveState(updatedInventory, updatedOrders, newNotifs);
  };

  const addNotification = (notif: Omit<NotificationRecord, 'id' | 'timestamp' | 'status'>) => {
    const newRecord: NotificationRecord = {
      ...notif,
      id: `notif_${Date.now()}`,
      timestamp: 'Just now',
      status: 'delivered',
    };
    const updated = [newRecord, ...notifications];
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
  };

  const switchRole = (role: UserRole) => {
    const updatedUser = {
      ...currentUser,
      role,
      name: role === 'admin' ? 'Kofi Osei (Founder)' : role === 'manager' ? 'Kwame Mensah (Ops Manager)' : role === 'rider' ? 'Kofi Mensah (Dispatch Rider)' : 'Akosua Asare (Warehouse Staff)',
    };
    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  };

  const resetToSampleData = () => {
    localStorage.clear();
    setInventory(INITIAL_INVENTORY);
    setOrders(INITIAL_ORDERS);
    setRiders(INITIAL_RIDERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentUser(INITIAL_USER);
    setSelectedOrder(INITIAL_ORDERS[0]);
  };

  return {
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
  };
}
