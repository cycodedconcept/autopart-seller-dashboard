// Mock data representing the AutoParts Seller Dashboard database

export const currentUser = {
  name: "Kamal Okelola",
  email: "scholar@gmail.com",
  role: "Seller/Vendor",
  storeName: "AutoParts Hub Lagos",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  joinDate: "June 2024",
  phone: "+234 812 345 6789",
  address: "12 Toyin Street, Ikeja, Lagos, Nigeria",
};

export const monthlyRevenueData = [
  { name: "Jan", revenue: 280000 },
  { name: "Feb", revenue: 450000 },
  { name: "Mar", revenue: 260000 },
  { name: "Apr", revenue: 500000 },
  { name: "May", revenue: 220000 },
  { name: "Jun", revenue: 580000 },
  { name: "Jul", revenue: 620000, active: true },
  { name: "Aug", revenue: 490000 },
  { name: "Sep", revenue: 250000 },
  { name: "Oct", revenue: 420000 },
  { name: "Nov", revenue: 210000 },
  { name: "Dec", revenue: 510000 },
];

export const stockBreakdown = {
  inStock: 520,
  lowStock: 180,
  outOfStock: 80,
  total: 780,
};

export const topAgents = [
  { id: 1, name: "Kamal Okelola", sales: 43546, itemsSold: 12, itemsRented: 21, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80" },
  { id: 2, name: "James", sales: 12257, itemsSold: 18, itemsRented: 32, avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=80" },
  { id: 3, name: "Jahid Khan", sales: 17324, itemsSold: 14, itemsRented: 25, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80" },
  { id: 4, name: "Jemen Khan", sales: 13345, itemsSold: 10, itemsRented: 30, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80" },
  { id: 5, name: "Ali Khan", sales: 18890, itemsSold: 16, itemsRented: 28, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=80" },
];

export const initialProducts = [
  {
    id: "prod-001",
    name: "OEM Brake Pad Set",
    price: 26609,
    category: "Brakes",
    location: "Ikeja, Lagos",
    units: 43,
    compatibility: "Universal",
    sku: "BP-OEM-9082",
    condition: "New",
    brand: "OEM",
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400",
    images: [
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400"
    ],
    description: "Premium heavy-duty brake pad set designed for high durability and consistent braking performance in city traffic. Resistant to thermal fade.",
    vehicles: ["Toyota Camry 2018-2024", "Honda Accord 2018-2023", "Nissan Altima 2019-2024"]
  },
  {
    id: "prod-002",
    name: "Engine Air Filter",
    price: 12000,
    category: "Filters",
    location: "Abuja, FCT",
    units: 12,
    compatibility: "Universal",
    sku: "AF-ENG-8722",
    condition: "New",
    brand: "Bosch",
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&q=80&w=400",
    images: [
      "https://images.unsplash.com/photo-1616788494707-ec28f08d05a1?auto=format&fit=crop&q=80&w=400"
    ],
    description: "High-efficiency air filtering media prevents dust, sand, and fine soot from entering the combustion chambers, prolonging engine lifespan.",
    vehicles: ["Ford Explorer 2017-2023", "Jeep Grand Cherokee 2018-2024", "Dodge Durango 2018-2024"]
  },
  {
    id: "prod-003",
    name: "Alternator 12V",
    price: 39130,
    category: "Electrical",
    location: "Port Harcourt, Rivers",
    units: 62,
    compatibility: "Universal",
    sku: "ALT-12V-3490",
    condition: "New",
    brand: "Denso",
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1635839736854-469b2d86a4e3?auto=format&fit=crop&q=80&w=400",
    images: [
      "https://images.unsplash.com/photo-1635839736854-469b2d86a4e3?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400"
    ],
    description: "High-output replacement alternator providing stable voltage levels under heavy load. Tested to exceed original manufacturer specifications.",
    vehicles: ["Toyota Camry 2018-2024", "Toyota RAV4 2019-2024", "Lexus RX350 2018-2023"]
  },
  {
    id: "prod-004",
    name: "Double Iridium Spark Plug",
    price: 4500,
    category: "Ignition",
    location: "Lekki, Lagos",
    units: 150,
    compatibility: "Universal",
    sku: "SP-IRID-1100",
    condition: "New",
    brand: "NGK",
    status: "In Stock",
    image: "https://images.unsplash.com/photo-1605558158382-95993a8e972c?auto=format&fit=crop&q=80&w=400",
    images: ["https://images.unsplash.com/photo-1605558158382-95993a8e972c?auto=format&fit=crop&q=80&w=400"],
    description: "Features double iridium alloy tips for enhanced ignitability and a service life exceeding 100,000 miles. Designed for modern petrol engines.",
    vehicles: ["Honda Civic 2016-2022", "Honda CR-V 2017-2023", "Acura RDX 2019-2024"]
  },
  {
    id: "prod-005",
    name: "Front Gas Shock Absorber",
    price: 32000,
    category: "Suspension",
    location: "Kano, Kano",
    units: 0,
    compatibility: "Universal",
    sku: "SH-GAS-5521",
    condition: "New",
    brand: "KYB",
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1632733711679-5292d77d7b10?auto=format&fit=crop&q=80&w=400",
    images: ["https://images.unsplash.com/photo-1632733711679-5292d77d7b10?auto=format&fit=crop&q=80&w=400"],
    description: "Nitrogen gas-charged suspension strut that restores original handling, steering feedback and body control. Features custom leak-proof seals.",
    vehicles: ["Hyundai Elantra 2017-2023", "Kia Forte 2018-2024", "Hyundai Sonata 2018-2023"]
  },
];

export const orderStats = {
  totalOrders: 8924,
  totalChange: "+30%",
  partsShipped: 6381,
  partsShippedChange: "+12%",
  backordered: 542,
  backorderedChange: "-04%",
  pendingOrders: 413,
  pendingChange: "+18%"
};

export const initialOrders = [
  {
    id: "ORD-001234",
    customerName: "Chukwuemeka Obi",
    email: "chukwuemeka.obi@gmail.com",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=80",
    purchaseDate: "Mar 10, 2025",
    itemName: "Brake Pads Set",
    amount: 45000,
    paymentMethod: "Bank Transfer",
    status: "Delivered",
    shippingAddress: "14 Broad Street, Lagos Island, Lagos",
    phone: "+234 803 456 7890",
    carrier: "DHL Express",
    trackingId: "TRK-448920",
    orderDate: "Jun 10, 2025",
    items: [
      { id: "prod-001", name: "OEM Brake Pad Set", sku: "BRK-001", qty: 1, price: 4356 },
      { id: "prod-002", name: "Engine Air Filter", sku: "ENG-012", qty: 1, price: 5123 }
    ],
    subtotal: 9479,
    shippingCost: 0,
    tax: 0,
    total: 13835,
    notes: "Customer requested fragile sticker on package.",
    timeline: [
      { status: "Order Placed", date: "Jun 10, 2025, 09:30 AM", completed: true },
      { status: "Processing", date: "Jun 10, 2025, 11:15 AM", completed: true },
      { status: "Shipped", date: "Jun 11, 2025, 02:00 PM", completed: true },
      { status: "Delivered", date: "Jun 13, 2025, 10:45 AM", completed: true }
    ]
  },
  {
    id: "ORD-001235",
    customerName: "Funmilayo Adeyemi",
    email: "funmilayo.adeyemi@yahoo.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80",
    purchaseDate: "Mar 11, 2025",
    itemName: "Alternator 12V",
    amount: 18500,
    paymentMethod: "Card Payment",
    status: "Cancelled",
    shippingAddress: "45 Independence Layout, Enugu",
    phone: "+234 814 333 4444",
    carrier: "GIG Logistics",
    trackingId: "GIG-5591-EN",
    items: [
      { id: "prod-003", name: "Alternator 12V", sku: "ALT-12V", qty: 1, price: 18500 }
    ],
    subtotal: 18500,
    shippingCost: 1000,
    tax: 0,
    total: 19500,
    timeline: [
      { status: "Order Placed", date: "Mar 11, 2025, 02:40 PM", completed: true },
      { status: "Cancelled", date: "Mar 11, 2025, 03:00 PM", completed: true }
    ]
  },
  {
    id: "ORD-001236",
    customerName: "Babatunde Afolabi",
    email: "babatunde.afolabi@outlook.com",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=80",
    purchaseDate: "Mar 13, 2025",
    itemName: "LED Headlight Kit",
    amount: 120000,
    paymentMethod: "Mobile Money",
    status: "Processing",
    shippingAddress: "12 Ahmadu Bello Way, Kaduna",
    phone: "+234 809 555 6666",
    carrier: "DHL Express",
    trackingId: "Pending Allocation",
    items: [
      { id: "prod-006", name: "LED Headlight Kit", sku: "LED-001", qty: 1, price: 120000 }
    ],
    subtotal: 120000,
    shippingCost: 3000,
    tax: 12000,
    total: 135000,
    timeline: [
      { status: "Order Placed", date: "Mar 13, 2025, 06:12 PM", completed: true },
      { status: "Processing", date: "Mar 14, 2025, 09:00 AM", completed: true },
      { status: "Shipped", date: "Pending", completed: false },
      { status: "Delivered", date: "Pending", completed: false }
    ]
  },
  {
    id: "ORD-001237",
    customerName: "Ngozi Okonkwo",
    email: "ngozi.okonkwo@gmail.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80",
    purchaseDate: "Mar 14, 2025",
    itemName: "Shock Absorber",
    amount: 67500,
    paymentMethod: "Bank Transfer",
    status: "Delivered",
    shippingAddress: "88 Wetheral Road, Owerri",
    phone: "+234 802 777 8888",
    carrier: "None",
    trackingId: "TRK-448921",
    items: [
      { id: "prod-005", name: "Front Gas Shock Absorber", sku: "SHK-005", qty: 1, price: 67500 }
    ],
    subtotal: 67500,
    shippingCost: 0,
    tax: 0,
    total: 67500,
    timeline: [
      { status: "Order Placed", date: "Mar 14, 2025, 11:15 AM", completed: true },
      { status: "Processing", date: "Mar 14, 2025, 01:30 PM", completed: true },
      { status: "Shipped", date: "Mar 15, 2025, 10:00 AM", completed: true },
      { status: "Delivered", date: "Mar 17, 2025, 02:00 PM", completed: true }
    ]
  },
  {
    id: "ORD-001238",
    customerName: "Emeka Nwosu",
    email: "emeka.nwosu@yahoo.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80",
    purchaseDate: "Mar 15, 2025",
    itemName: "Oil Filter Kit",
    amount: 12000,
    paymentMethod: "Card Payment",
    status: "Shipped",
    shippingAddress: "32 Ring Road, Ibadan",
    phone: "+234 818 999 0000",
    carrier: "DHL Express",
    trackingId: "TRK-448922",
    items: [
      { id: "prod-007", name: "Oil Filter Kit", sku: "OIL-001", qty: 1, price: 12000 }
    ],
    subtotal: 12000,
    shippingCost: 500,
    tax: 0,
    total: 12500,
    timeline: [
      { status: "Order Placed", date: "Mar 15, 2025, 01:22 PM", completed: true },
      { status: "Processing", date: "Mar 15, 2025, 03:45 PM", completed: true },
      { status: "Shipped", date: "Mar 16, 2025, 09:00 AM", completed: true },
      { status: "Delivered", date: "Pending", completed: false }
    ]
  },
  {
    id: "ORD-001239",
    customerName: "Aisha Bello",
    email: "aisha.bello@gmail.com",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=80",
    purchaseDate: "Mar 16, 2025",
    itemName: "Front Bumper",
    amount: 38750,
    paymentMethod: "Mobile Money",
    status: "Pending",
    shippingAddress: "56 Oregun Road, Ikeja",
    phone: "+234 803 123 4567",
    carrier: "DHL Express",
    trackingId: "Pending Allocation",
    items: [
      { id: "prod-008", name: "Front Bumper", sku: "BMP-001", qty: 1, price: 38750 }
    ],
    subtotal: 38750,
    shippingCost: 3000,
    tax: 3875,
    total: 45625,
    timeline: [
      { status: "Order Placed", date: "Mar 16, 2025, 04:00 PM", completed: true },
      { status: "Processing", date: "Pending", completed: false },
      { status: "Shipped", date: "Pending", completed: false },
      { status: "Delivered", date: "Pending", completed: false }
    ]
  },
  {
    id: "ORD-001210",
    customerName: "Oluwaseun Fadahunsi",
    email: "oluwaseun.f@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80",
    purchaseDate: "Mar 17, 2025",
    itemName: "Alloy Wheel Set",
    amount: 95000,
    paymentMethod: "Bank Transfer",
    status: "Processing",
    shippingAddress: "123 Opebi Road, Ikeja",
    phone: "+234 810 765 4321",
    carrier: "GIG Logistics",
    trackingId: "GIG-5592-EN",
    items: [
      { id: "prod-009", name: "Alloy Wheel Set", sku: "WHL-001", qty: 1, price: 95000 }
    ],
    subtotal: 95000,
    shippingCost: 7000,
    tax: 9500,
    total: 111500,
    timeline: [
      { status: "Order Placed", date: "Mar 17, 2025, 09:00 AM", completed: true },
      { status: "Processing", date: "Mar 17, 2025, 11:30 AM", completed: true },
      { status: "Shipped", date: "Pending", completed: false },
      { status: "Delivered", date: "Pending", completed: false }
    ]
  },
  {
    id: "ORD-001211",
    customerName: "Chidinma Eze",
    email: "chidinma.eze@yahoo.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80",
    purchaseDate: "Mar 18, 2025",
    itemName: "Fuel Injector",
    amount: 24800,
    paymentMethod: "Card Payment",
    status: "Shipped",
    shippingAddress: "89 Maryland Road, Lagos",
    phone: "+234 805 234 5678",
    carrier: "DHL Express",
    trackingId: "TRK-448923",
    items: [
      { id: "prod-010", name: "Fuel Injector", sku: "INJ-001", qty: 1, price: 24800 }
    ],
    subtotal: 24800,
    shippingCost: 1500,
    tax: 2480,
    total: 28780,
    timeline: [
      { status: "Order Placed", date: "Mar 18, 2025, 02:00 PM", completed: true },
      { status: "Processing", date: "Mar 18, 2025, 04:15 PM", completed: true },
      { status: "Shipped", date: "Mar 19, 2025, 10:30 AM", completed: true },
      { status: "Delivered", date: "Pending", completed: false }
    ]
  }
];

export const initialCustomers = [
  {
    refNumber: "CUST-8821",
    dateJoined: "Mar 10, 2025",
    name: "James Oke",
    email: "jamesoke@gmail.com",
    status: "Active",
    phone: "+234 803 111 2222",
    address: "Plot 8, Admiralty Way, Lekki Phase 1",
    city: "Lekki",
    state: "Lagos",
    country: "Nigeria",
    zipCode: "105102",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=80",
    socials: { twitter: "@james_oke", instagram: "@james_oke", linkedin: "james-oke-profile" },
    partCategory: "Brakes",
    deliveryAddress: "Lagos, Nigeria",
    lastDate: "Mar 10, 2025"
  },
  {
    refNumber: "CUST-6881",
    dateJoined: "Mar 11, 2025",
    name: "Adewale Chidi",
    email: "adewale@yahoo.com",
    status: "Inactive",
    phone: "+234 814 333 4444",
    address: "45 Independence Layout",
    city: "Enugu",
    state: "Enugu State",
    country: "Nigeria",
    zipCode: "400102",
    avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=80",
    socials: { twitter: "@adewale_chidi", instagram: "@adewale_chidi", linkedin: "adewale-chidi-profile" },
    partCategory: "Engine Parts",
    deliveryAddress: "Enugu, Nigeria",
    lastDate: "Mar 11, 2025"
  },
  {
    refNumber: "CUST-0542",
    dateJoined: "Mar 12, 2025",
    name: "Emeka Oka",
    email: "emeka@hotmail.com",
    status: "Active",
    phone: "+234 809 555 6666",
    address: "12 Ahmadu Bello Way",
    city: "Kaduna",
    state: "Kaduna State",
    country: "Nigeria",
    zipCode: "800283",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80",
    socials: { twitter: "@emeka_oka", instagram: "@emeka_oka", linkedin: "emeka-oka-profile" },
    partCategory: "Electrical",
    deliveryAddress: "Kaduna, Nigeria",
    lastDate: "Mar 12, 2025"
  },
  {
    refNumber: "CUST-0413",
    dateJoined: "Mar 13, 2025",
    name: "Fatimah Ali",
    email: "fatimah@gmail.com",
    status: "Active",
    phone: "+234 802 777 8888",
    address: "88 Wetheral Road",
    city: "Owerri",
    state: "Imo State",
    country: "Nigeria",
    zipCode: "460221",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80",
    socials: { twitter: "@fatimah_ali", instagram: "@fatimah_ali", linkedin: "fatimah-ali-profile" },
    partCategory: "Suspension",
    deliveryAddress: "Kano, Nigeria",
    lastDate: "Mar 13, 2025"
  },
  {
    refNumber: "CUST-7721",
    dateJoined: "Mar 14, 2025",
    name: "Chukwuemeka Okafor",
    email: "chukwuemeka@outlook.com",
    status: "Active",
    phone: "+234 818 999 0000",
    address: "32 Ring Road",
    city: "Ibadan",
    state: "Oyo State",
    country: "Nigeria",
    zipCode: "200252",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=80",
    socials: { twitter: "@chukwuemeka", instagram: "@chukwuemeka", linkedin: "chukwuemeka-profile" },
    partCategory: "Tyres & Wheels",
    deliveryAddress: "Ibadan, Nigeria",
    lastDate: "Mar 14, 2025"
  },
  {
    refNumber: "CUST-2234",
    dateJoined: "Mar 15, 2025",
    name: "Bimpe Adeyemi",
    email: "bimpe@yahoo.com",
    status: "Inactive",
    phone: "+234 812 334 5566",
    address: "123 Opebi Road",
    city: "Ikeja",
    state: "Lagos",
    country: "Nigeria",
    zipCode: "100001",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80",
    socials: { twitter: "@bimpe", instagram: "@bimpe", linkedin: "bimpe-profile" },
    partCategory: "Body Parts",
    deliveryAddress: "Ikeja, Nigeria",
    lastDate: "Mar 15, 2025"
  },
  {
    refNumber: "CUST-5567",
    dateJoined: "Mar 16, 2025",
    name: "Tunde Balogun",
    email: "tunde@gmail.com",
    status: "Active",
    phone: "+234 805 667 8899",
    address: "45 Allen Avenue",
    city: "Ikeja",
    state: "Lagos",
    country: "Nigeria",
    zipCode: "100001",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80",
    socials: { twitter: "@tunde", instagram: "@tunde", linkedin: "tunde-profile" },
    partCategory: "Filters",
    deliveryAddress: "Abeokuta, Nigeria",
    lastDate: "Mar 16, 2025"
  },
  {
    refNumber: "CUST-8890",
    dateJoined: "Mar 17, 2025",
    name: "Ngozi Okonkwo",
    email: "ngozi@hotmail.com",
    status: "Active",
    phone: "+234 809 112 3344",
    address: "78 Awolowo Way",
    city: "Ikeja",
    state: "Lagos",
    country: "Nigeria",
    zipCode: "100001",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=80",
    socials: { twitter: "@ngozi", instagram: "@ngozi", linkedin: "ngozi-profile" },
    partCategory: "Lighting",
    deliveryAddress: "Asaba, Nigeria",
    lastDate: "Mar 17, 2025"
  },
  {
    refNumber: "CUST-1123",
    dateJoined: "Mar 18, 2025",
    name: "Aisha Mohammed",
    email: "aisha@gmail.com",
    status: "Inactive",
    phone: "+234 803 445 6677",
    address: "23 Airport Road",
    city: "Ikeja",
    state: "Lagos",
    country: "Nigeria",
    zipCode: "100001",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=80",
    socials: { twitter: "@aisha", instagram: "@aisha", linkedin: "aisha-profile" },
    partCategory: "Transmission",
    deliveryAddress: "Kaduna, Nigeria",
    lastDate: "Mar 18, 2025"
  },
  {
    refNumber: "CUST-4456",
    dateJoined: "Mar 19, 2025",
    name: "Yemi Alabi",
    email: "yemi@yahoo.com",
    status: "Inactive",
    phone: "+234 812 778 9900",
    address: "56 Oregun Road",
    city: "Ikeja",
    state: "Lagos",
    country: "Nigeria",
    zipCode: "100001",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=80",
    socials: { twitter: "@yemi", instagram: "@yemi", linkedin: "yemi-profile" },
    partCategory: "Cooling System",
    deliveryAddress: "Lekki, Nigeria",
    lastDate: "Mar 19, 2025"
  },
  {
    refNumber: "CUST-7789",
    dateJoined: "Mar 20, 2025",
    name: "Obiageli Nwachukwu",
    email: "obiageli@gmail.com",
    status: "Active",
    phone: "+234 805 223 4455",
    address: "89 Maryland Road",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    zipCode: "100001",
    avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&q=80&w=80",
    socials: { twitter: "@obiageli", instagram: "@obiageli", linkedin: "obiageli-profile" },
    partCategory: "Steering",
    deliveryAddress: "Surulere, Lagos",
    lastDate: "Mar 20, 2025"
  }
];

export const customerStats = {
  totalCustomers: 2648,
  totalChange: "12%",
  activeThisMonth: 1342,
  activeChange: "5.5%",
  avgOrderValue: "₦7.5M",
  avgChange: "3.2%",
  repeatBuyers: 68,
  repeatChange: "2.8%"
};

// ─── Analytics page data ────────────────────────────────────────────────────

export const salesAnalyticData = [
  { month: 'Jan', income: 14000, expense: 11500 },
  { month: 'Feb', income: 15500, expense: 13000 },
  { month: 'Mar', income: 14500, expense: 14000 },
  { month: 'Apr', income: 13000, expense: 15500 },
  { month: 'May', income: 12000, expense: 17000 },
  { month: 'Jun', income: 15000, expense: 15000 },
  { month: 'Jul', income: 19000, expense: 12000 },
  { month: 'Aug', income: 17000, expense: 13000 },
  { month: 'Sep', income: 15500, expense: 14000 },
  { month: 'Oct', income: 14000, expense: 15000 },
  { month: 'Nov', income: 12500, expense: 16000 },
  { month: 'Dec', income: 17500, expense: 12500 },
];

export const salesSummaryData = [
  { name: 'Sold',    value: 36423 },
  { name: 'Expense', value: 2512  },
  { name: 'Rented',  value: 12221 },
  { name: 'Income',  value: 10134 },
];

export const totalRevenueBarData = [
  { month: 'Mar 11', a: 8200,  b: 5100,  c: 2800             },
  { month: 'Apr 11', a: 10500, b: 7200,  c: 4500             },
  { month: 'May 11', a: 9100,  b: 5600,  c: 3200             },
  { month: 'Jun 11', a: 20000, b: 15000, c: 8646, active: true },
  { month: 'Jul 11', a: 12100, b: 8300,  c: 5100             },
  { month: 'Aug 11', a: 11200, b: 7100,  c: 4200             },
  { month: 'Sep 11', a: 9300,  b: 6100,  c: 3200             },
];

export const transactionStats = {
  totalBalance: 39305,
  totalBalanceChange: "+12%",
  totalCredits: 39305,
  totalCreditsChange: "+30%",
  totalDebits: 16050,
  totalDebitsChange: "-8%"
};

export const initialTransactions = [
  {
    id: 'TXN-64547',
    customerName: 'Ameer Hassan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80',
    description: 'Order #ORD-7841...',
    amount: 4356,
    date: 'Jun 10, 2025 09:30 AM',
    paymentMethod: 'Bank Transfer',
    status: 'Completed',
  },
  {
    id: 'TXN-64548',
    customerName: 'Sufi Hossan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=80',
    description: 'Supplier Payment...',
    amount: -42000,
    date: 'Jun 09, 2025 02:15 PM',
    paymentMethod: 'Wire Transfer',
    status: 'Completed',
  },
  {
    id: 'TXN-64549',
    customerName: 'Jahid Khan',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=80',
    description: 'Order #ORD-7840...',
    amount: 67500,
    date: 'Jun 09, 2025 10:00 AM',
    paymentMethod: 'Card Payment',
    status: 'Pending',
  },
  {
    id: 'TXN-64550',
    customerName: 'Metty Henry',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80',
    description: 'Order #ORD-7839...',
    amount: 32500,
    date: 'Jun 08, 2025 12:30 PM',
    paymentMethod: 'Mobile Money',
    status: 'Completed',
  },
  {
    id: 'TXN-64551',
    customerName: 'Kamal Okelola',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=80',
    description: 'Platform Fee - Jun...',
    amount: -4850,
    date: 'Jun 07, 2025 04:00 PM',
    paymentMethod: 'Auto-debit',
    status: 'Completed',
  },
  {
    id: 'TXN-64552',
    customerName: 'Jaman Khan',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=80',
    description: 'Bulk Order #ORD-7837...',
    amount: 142500,
    date: 'Jun 07, 2025 10:15 AM',
    paymentMethod: 'Bank Transfer',
    status: 'Pending',
  },
  {
    id: 'TXN-64553',
    customerName: 'Azeem Khan',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=80',
    description: 'Refund - Order #ORD-7836...',
    amount: -15200,
    date: 'Jun 06, 2025 11:00 AM',
    paymentMethod: 'Card Payment',
    status: 'Reversal',
  },
  {
    id: 'TXN-64554',
    customerName: 'Soyem Khan',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=80',
    description: 'Order #ORD-7835...',
    amount: 86500,
    date: 'Jun 05, 2025 03:30 PM',
    paymentMethod: 'Mobile Money',
    status: 'Completed',
  },
];

export const latestTransactions = initialTransactions;
