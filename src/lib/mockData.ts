import {
  InventoryItem,
  DeliveryOrder,
  DispatchRider,
  NotificationRecord,
  UserProfile,
} from '@/types/logistics';

export const INITIAL_USER: UserProfile = {
  id: 'usr_01',
  name: 'Kwame Mensah',
  email: 'operations@logiflow.com.gh',
  role: 'manager',
  hubLocation: 'Accra North Industrial Depot',
};

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv_01',
    sku: 'CEM-GHA-50',
    name: 'Ghacem Super Rapid Cement (50kg)',
    category: 'Building Materials',
    stock: 240,
    reorderPoint: 50,
    unit: 'bags',
    unitPrice: 105.0,
    weightPerUnitKg: 50,
    warehouseLocation: 'Tema Bay A-12',
    updatedAt: '2026-10-04 14:30',
  },
  {
    id: 'inv_02',
    sku: 'STL-ROD-16',
    name: 'High-Tensile TMT Steel Rebars 16mm',
    category: 'Building Materials',
    stock: 18,
    reorderPoint: 25,
    unit: 'bundles',
    unitPrice: 620.0,
    weightPerUnitKg: 50,
    warehouseLocation: 'Tema Yard B-04',
    updatedAt: '2026-10-04 09:15',
  },
  {
    id: 'inv_03',
    sku: 'SOL-INV-5KW',
    name: 'Felicity Solar Hybrid Inverter 5KVA',
    category: 'Electronics',
    stock: 14,
    reorderPoint: 5,
    unit: 'units',
    unitPrice: 8400.0,
    weightPerUnitKg: 12,
    warehouseLocation: 'Spintex Tech Vault',
    updatedAt: '2026-10-03 16:20',
  },
  {
    id: 'inv_04',
    sku: 'AGR-NPK-50',
    name: 'YaraMila Actyva NPK 23-10-5 Fertilizer (50kg)',
    category: 'Agrochemicals',
    stock: 310,
    reorderPoint: 60,
    unit: 'bags',
    unitPrice: 380.0,
    weightPerUnitKg: 50,
    warehouseLocation: 'Accra North Shed 2',
    updatedAt: '2026-10-05 08:00',
  },
  {
    id: 'inv_05',
    sku: 'FOD-RIC-ROY',
    name: 'Royal Aroma Fragrant Jasmine Rice (25kg)',
    category: 'FMCG / Food',
    stock: 85,
    reorderPoint: 30,
    unit: 'bags',
    unitPrice: 420.0,
    weightPerUnitKg: 25,
    warehouseLocation: 'Accra Central Hub',
    updatedAt: '2026-10-05 07:45',
  },
  {
    id: 'inv_06',
    sku: 'FSH-KT-W10',
    name: 'Handwoven Kente Fabric Premium Royal Strips',
    category: 'Fashion & Retail',
    stock: 6,
    reorderPoint: 10,
    unit: 'pieces',
    unitPrice: 1250.0,
    weightPerUnitKg: 1,
    warehouseLocation: 'Osu Design Vault',
    updatedAt: '2026-10-02 11:10',
  },
];

export const INITIAL_RIDERS: DispatchRider[] = [
  {
    id: 'rdr_01',
    name: 'Kofi Mensah',
    phone: '+233 54 881 2940',
    whatsapp: '+233 54 881 2940',
    vehicle: 'Motorbike',
    licensePlate: 'M-24-GR 4012',
    currentZone: 'Osu / Labone',
    status: 'on_delivery',
    rating: 4.9,
    batteryLevel: 82,
    deliveriesToday: 7,
  },
  {
    id: 'rdr_02',
    name: 'Emmanuel Tetteh',
    phone: '+233 20 412 8731',
    whatsapp: '+233 20 412 8731',
    vehicle: 'Delivery Van',
    licensePlate: 'GT 8934-22',
    currentZone: 'Spintex / Tema',
    status: 'available',
    rating: 4.8,
    batteryLevel: 91,
    deliveriesToday: 5,
  },
  {
    id: 'rdr_03',
    name: 'Suleiman Abubakar',
    phone: '+233 55 903 1478',
    whatsapp: '+233 55 903 1478',
    vehicle: 'Tricycle (Aboboyaa)',
    licensePlate: 'M-23-AS 1099',
    currentZone: 'Circle / Kaneshie',
    status: 'available',
    rating: 4.7,
    batteryLevel: 76,
    deliveriesToday: 4,
  },
  {
    id: 'rdr_04',
    name: 'Prince Addo',
    phone: '+233 24 330 9851',
    whatsapp: '+233 24 330 9851',
    vehicle: 'Box Truck',
    licensePlate: 'GN 4521-21',
    currentZone: 'Tema Heavy Industrial',
    status: 'on_delivery',
    rating: 4.95,
    batteryLevel: 68,
    deliveriesToday: 6,
  },
];

export const INITIAL_ORDERS: DeliveryOrder[] = [
  {
    id: 'ord_101',
    trackingNumber: 'GH-2026-081',
    waybillNumber: 'WB-GH-2026-081',

    customerName: 'Nana Kwame Baah',
    customerPhone: '+233 55 445 3553',
    customerEmail: 'nkbaah@outlook.com',

    destination: 'East Legon, American House (Near Melcom)',
    digitalAddress: 'GA-183-9024',
    region: 'Greater Accra',
    telco: 'MTN Ghana',

    coordinates: {
      lat: 5.6358,
      lng: -0.1557,
    },

    originDepot: 'Spintex Tech Vault',
    originCoordinates: {
      lat: 5.6395,
      lng: -0.1062,
    },

    itemId: 'inv_03',
    itemName: 'Felicity Solar Hybrid Inverter 5KVA',
    quantity: 1,
    totalWeightKg: 12,
    totalAmount: 8400.0,

    paymentMethod: 'MTN Mobile Money',

    status: 'out_for_delivery',

    assignedRiderId: 'rdr_01',
    assignedRiderName: 'Kofi Mensah',
    assignedRiderPhone: '+233 54 881 2940',
    vehicleType: 'Motorbike',

    createdAt: '2026-10-05 08:30',
    dispatchedAt: '2026-10-05 09:15',

    notes: 'Please call recipient when crossing Legon Bypass',
  },

  {
    id: 'ord_102',
    trackingNumber: 'GH-2026-082',
    waybillNumber: 'WB-GH-2026-082',

    customerName: 'Abena Serwaa Boateng',
    customerPhone: '+233 24 991 4322',
    customerEmail: 'abena.serwaa@gmail.com',

    destination: 'Osu Oxford Street (Opposite Frankie’s)',
    digitalAddress: 'GA-092-4451',
    region: 'Greater Accra',
    telco: 'Telecel Ghana',

    coordinates: {
      lat: 5.5564,
      lng: -0.1834,
    },

    originDepot: 'Accra Central Hub',
    originCoordinates: {
      lat: 5.5601,
      lng: -0.2057,
    },

    itemId: 'inv_05',
    itemName: 'Royal Aroma Fragrant Jasmine Rice (25kg)',
    quantity: 3,
    totalWeightKg: 75,
    totalAmount: 1260.0,

    paymentMethod: 'Telecel Cash',

    status: 'dispatched',

    assignedRiderId: 'rdr_02',
    assignedRiderName: 'Emmanuel Tetteh',
    assignedRiderPhone: '+233 20 412 8731',
    vehicleType: 'Delivery Van',

    createdAt: '2026-10-05 09:00',
    dispatchedAt: '2026-10-05 09:40',

    notes: 'Ground floor store front',
  },

  {
    id: 'ord_103',
    trackingNumber: 'GH-2026-083',
    waybillNumber: 'WB-GH-2026-083',

    customerName: 'Dansoaa Construction Ltd',
    customerPhone: '+233 20 188 5600',
    customerEmail: 'procure@dansoaa.com',

    destination: 'Tema Community 25 Site Gate B',
    digitalAddress: 'GT-258-7214',
    region: 'Greater Accra',
    telco: 'MTN Ghana',

    coordinates: {
      lat: 5.7121,
      lng: 0.0418,
    },

    originDepot: 'Tema Bay A-12',
    originCoordinates: {
      lat: 5.6698,
      lng: 0.0166,
    },

    itemId: 'inv_01',
    itemName: 'Ghacem Super Rapid Cement (50kg)',
    quantity: 40,
    totalWeightKg: 2000,
    totalAmount: 4200.0,

    paymentMethod: 'Corporate Invoice (30 Days)',

    status: 'pending',

    createdAt: '2026-10-05 10:15',

    notes: 'Forklift on site ready for offloading',
  },

  {
    id: 'ord_104',
    trackingNumber: 'GH-2026-084',
    waybillNumber: 'WB-GH-2026-084',

    customerName: 'Lynxx Boutique Hub',
    customerPhone: '+233 50 712 3490',
    customerEmail: 'orders@lynxxkloset.gh',

    destination: 'Cantonments, 4th Circular Road',
    digitalAddress: 'GA-044-8127',
    region: 'Greater Accra',
    telco: 'AT (AirtelTigo)',

    coordinates: {
      lat: 5.5812,
      lng: -0.1691,
    },

    originDepot: 'Osu Design Vault',
    originCoordinates: {
      lat: 5.5569,
      lng: -0.1826,
    },

    itemId: 'inv_06',
    itemName: 'Handwoven Kente Fabric Premium Royal Strips',
    quantity: 2,
    totalWeightKg: 2,
    totalAmount: 2500.0,

    paymentMethod: 'Cash on Delivery',

    status: 'delivered',

    assignedRiderId: 'rdr_01',
    assignedRiderName: 'Kofi Mensah',
    assignedRiderPhone: '+233 54 881 2940',
    vehicleType: 'Motorbike',

    createdAt: '2026-10-04 11:20',
    dispatchedAt: '2026-10-04 12:10',
    deliveredAt: '2026-10-04 13:45',

    notes: 'Signed and confirmed by Store Manager',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'notif_01',
    type: 'sms',
    title: 'Out For Delivery SMS Alert',
    recipient: '+233 55 445 3553 (Nana Kwame Baah)',
    content:
      'LogiFlow Alert: Your order GH-2026-081 is out for delivery with rider Kofi (+233548812940). Track: https://track.logiflow.gh/GH-2026-081',
    timestamp: '10 mins ago',
    gateway: "Africa's Talking",
    status: 'delivered',
    orderId: 'ord_101',
  },

  {
    id: 'notif_02',
    type: 'system',
    title: 'Low Stock Level Alert',
    recipient: 'Warehouse Ops Console',
    content:
      'Stock for High-Tensile TMT Steel Rebars 16mm has fallen to 18 bundles (Threshold: 25 bundles). Reorder suggested.',
    timestamp: '28 mins ago',
    gateway: 'System Push',
    status: 'delivered',
  },

  {
    id: 'notif_03',
    type: 'email',
    title: 'Dispatch Confirmation',
    recipient: 'procure@dansoaa.com',
    content:
      'Waybill generated for 40x Ghacem Super Rapid Cement. Awaiting driver pickup assignment at Tema Depot.',
    timestamp: '1 hour ago',
    gateway: 'Google Email Service',
    status: 'delivered',
    orderId: 'ord_103',
  },
];