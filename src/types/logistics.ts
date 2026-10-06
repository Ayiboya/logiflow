export type UserRole = 'admin' | 'manager' | 'staff' | 'rider';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hubLocation: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Building Materials' | 'FMCG / Food' | 'Electronics' | 'Agrochemicals' | 'Fashion & Retail';
  stock: number;
  reorderPoint: number;
  unit: string;
  unitPrice: number; // in GH₵
  weightPerUnitKg: number;
  warehouseLocation: string;
  updatedAt: string;
}

export type OrderStatus = 'pending' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface DeliveryOrder {
  id: string;
  trackingNumber: string;
  waybillNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  destination: string;
  digitalAddress: string; // Ghana Post GPS (e.g., GA-183-9024)
  region: string;
  telco: 'MTN Ghana' | 'Telecel Ghana' | 'AT (AirtelTigo)' | 'Other';
  coordinates: {
    lat: number;
    lng: number;
  };
  originDepot: string;
  originCoordinates: {
    lat: number;
    lng: number;
  };
  itemId: string;
  itemName: string;
  quantity: number;
  totalWeightKg: number;
  totalAmount: number; // GH₵
  paymentMethod: 'MTN Mobile Money' | 'Telecel Cash' | 'Cash on Delivery' | 'Corporate Invoice (30 Days)';
  status: OrderStatus;
  assignedRiderId?: string;
  assignedRiderName?: string;
  assignedRiderPhone?: string;
  vehicleType?: string;
  createdAt: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  notes?: string;
}

export interface DispatchRider {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  vehicle: 'Motorbike' | 'Tricycle (Aboboyaa)' | 'Delivery Van' | 'Box Truck';
  licensePlate: string;
  currentZone: string;
  status: 'available' | 'on_delivery' | 'offline';
  rating: number;
  batteryLevel: number;
  deliveriesToday: number;
}

export interface NotificationRecord {
  id: string;
  type: 'sms' | 'email' | 'system';
  title: string;
  recipient: string;
  content: string;
  timestamp: string;
  gateway: "Africa's Talking" | "Google Email Service" | "System Push";
  status: 'delivered' | 'sent' | 'queued';
  orderId?: string;
  simulatedNetwork?: string;
}

export interface SystemKPIs {
  totalMetricTonnes: number;
  activeShipments: number;
  pendingDispatch: number;
  lowStockAlerts: number;
  avgDeliveryHours: number;
  onTimeDeliveryRate: number;
  totalRevenueGHS: number;
}
