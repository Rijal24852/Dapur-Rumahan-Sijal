export type FoodCategory =
  | 'Semua'
  | 'Makanan Berat'
  | 'Jajanan'
  | 'Kue & Roti'
  | 'Minuman'
  | 'Gorengan';

export type SortOption =
  | 'rekomendasi'
  | 'harga-terendah'
  | 'harga-tertinggi'
  | 'rating-tertinggi';

export type ActivePage =
  | 'beranda'
  | 'menu'
  | 'penjual'
  | 'tentang'
  | 'dashboard';

export type OrderStatus =
  | 'Menunggu'
  | 'Diproses'
  | 'Siap Antar'
  | 'Selesai';

export type UserRole = 'Pembeli' | 'Penjual UMKM';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  role: UserRole;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  category: Exclude<FoodCategory, 'Semua'>;
  sellerId: string;
  sellerName: string;
  price: number;
  stock: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  prepTime: string;
  portionInfo: string;
  reviews: ProductReview[];
}

export interface Seller {
  id: string;
  name: string;
  ownerName: string;
  tagline: string;
  description: string;
  location: string;
  operatingHours: string;
  whatsapp: string;
  joinedYear: string;
  specialty: string;
  rating: number;
  completedOrders: number;
  coverImage: string;
  avatarImage: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface OrderItemSnapshot {
  productId: number;
  name: string;
  sellerName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  whatsapp: string;
  address: string;
  notes: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
