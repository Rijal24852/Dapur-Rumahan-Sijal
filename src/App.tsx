import { useEffect, useMemo, useState } from 'react';
import { AboutView } from './components/AboutView';
import { AccountAuthModal } from './components/AccountAuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { Navbar } from './components/Navbar';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SellerDashboardView } from './components/SellerDashboardView';
import { SellerProfileView } from './components/SellerProfileView';
import { Toast } from './components/Toast';
import { WhatsAppContactModal } from './components/WhatsAppContactModal';
import {
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_SELLERS,
} from './data/marketplaceData';
import {
  ActivePage,
  CartItem,
  FoodCategory,
  Order,
  OrderStatus,
  Product,
  SortOption,
  UserAccount,
} from './types/marketplace';

const STORAGE_KEYS = {
  products: 'dapurku_products_v4',
  cart: 'dapurku_cart_v1',
  orders: 'dapurku_orders_v1',
  user: 'dapurku_user_v1',
};

function loadStoredState<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('beranda');
  const [selectedSellerId, setSelectedSellerId] = useState<string>(
    INITIAL_SELLERS[0].id
  );

  const [products, setProducts] = useState<Product[]>(() =>
    loadStoredState(STORAGE_KEYS.products, INITIAL_PRODUCTS)
  );
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadStoredState(STORAGE_KEYS.cart, [])
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadStoredState(STORAGE_KEYS.orders, INITIAL_ORDERS)
  );
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    loadStoredState<UserAccount | null>(STORAGE_KEYS.user, null)
  );

  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('rekomendasi');

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [waPreselectedSellerId, setWaPreselectedSellerId] = useState<string | null>(
    null
  );
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    } catch {
      // Ignore storage quota errors
    }
  }, [products]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (currentUser) {
        window.localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(currentUser));
      } else {
        window.localStorage.removeItem(STORAGE_KEYS.user);
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [currentUser]);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const scrollToMenu = () => {
    window.setTimeout(() => {
      const target = document.getElementById('katalog-menu');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    if (page === 'menu') {
      scrollToMenu();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectSeller = (sellerId: string) => {
    setSelectedSellerId(sellerId);
    setActivePage('penjual');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenWhatsApp = (sellerId?: string) => {
    setWaPreselectedSellerId(sellerId ?? null);
    setIsWhatsAppOpen(true);
  };

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Semua' || product.category === selectedCategory;
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.sellerName.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });

    if (sortBy === 'harga-terendah') {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'harga-tertinggi') {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating-tertinggi') {
      return [...filtered].sort((a, b) => b.rating - a.rating);
    }
    return filtered;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const categoryCounts = useMemo<Record<FoodCategory, number>>(() => {
    const counts: Record<FoodCategory, number> = {
      Semua: products.length,
      'Makanan Berat': 0,
      Jajanan: 0,
      'Kue & Roti': 0,
      Minuman: 0,
      Gorengan: 0,
    };
    for (const product of products) {
      counts[product.category] += 1;
    }
    return counts;
  }, [products]);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId]
  );

  const totalCartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleAddToCart = (product: Product, quantityToAdd = 1) => {
    if (product.stock <= 0) {
      showToast(`${product.name} sedang habis stoknya.`);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        const nextQty = Math.min(product.stock, existing.quantity + quantityToAdd);
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: nextQty } : item
        );
      }
      return [
        ...prev,
        { productId: product.id, quantity: Math.min(product.stock, quantityToAdd) },
      ];
    });

    showToast(`${product.name} ditambahkan ke keranjang.`);
  };

  const handleUpdateCartQuantity = (productId: number, delta: number) => {
    const product = products.find((p) => p.id === productId);
    const maxStock = product?.stock ?? 99;

    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) {
            return item;
          }
          const nextQty = Math.min(maxStock, item.quantity + delta);
          return { ...item, quantity: nextQty };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Menu dihapus dari keranjang.');
  };

  const handleAddReview = (
    productId: number,
    review: { author: string; rating: number; comment: string }
  ) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== productId) {
          return product;
        }
        const nextReviews = [
          {
            id: `rev-${Date.now()}`,
            author: review.author,
            rating: review.rating,
            comment: review.comment,
            date: 'Baru saja',
          },
          ...product.reviews,
        ];
        const avgRating =
          nextReviews.reduce((sum, r) => sum + r.rating, 0) / nextReviews.length;

        return {
          ...product,
          reviews: nextReviews,
          reviewCount: nextReviews.length,
          rating: Number(avgRating.toFixed(1)),
        };
      })
    );
    showToast('Ulasan Anda berhasil ditambahkan.');
  };

  const handleSubmitOrder = (payload: {
    customerName: string;
    whatsapp: string;
    address: string;
    notes: string;
  }): Order => {
    const orderItems = cartItems
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          return null;
        }
        return {
          productId: product.id,
          name: product.name,
          sellerName: product.sellerName,
          price: product.price,
          quantity: item.quantity,
          image: product.image,
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee = subtotal === 0 || subtotal >= 50000 ? 0 : 5000;
    const total = subtotal + deliveryFee;

    const now = new Date();
    const timeLabel = `${String(now.getHours()).padStart(2, '0')}.${String(
      now.getMinutes()
    ).padStart(2, '0')} WIB`;

    const newOrder: Order = {
      id: `DK-${1043 + orders.length}`,
      customerName: payload.customerName,
      whatsapp: payload.whatsapp,
      address: payload.address,
      notes: payload.notes,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      status: 'Menunggu',
      createdAt: `Hari ini, ${timeLabel}`,
    };

    setOrders((prev) => [newOrder, ...prev]);

    setProducts((prev) =>
      prev.map((product) => {
        const ordered = orderItems.find((item) => item.productId === product.id);
        if (!ordered) {
          return product;
        }
        return {
          ...product,
          stock: Math.max(0, product.stock - ordered.quantity),
        };
      })
    );

    setCartItems([]);
    return newOrder;
  };

  const handleUpdateProduct = (
    productId: number,
    updates: { price: number; stock: number }
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId
          ? { ...product, price: updates.price, stock: updates.stock }
          : product
      )
    );
    showToast('Perubahan harga dan stok berhasil disimpan.');
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
    showToast(`Status pesanan #${orderId} diubah menjadi ${status}.`);
  };

  const handleResetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCartItems([]);
    showToast('Data demo berhasil dikembalikan ke kondisi awal.');
  };

  const handleLogin = (account: UserAccount) => {
    setCurrentUser(account);
    showToast(`Selamat datang, ${account.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Anda telah keluar dari akun.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#3B2014]">
      <Navbar
        activePage={activePage}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWhatsApp={() => handleOpenWhatsApp()}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="flex-1">
        {(activePage === 'beranda' || activePage === 'menu') && (
          <>
            <HeroSection
              onExploreMenu={() => {
                setActivePage('menu');
                scrollToMenu();
              }}
              onViewSellers={() => handleNavigate('penjual')}
              sellerCount={INITIAL_SELLERS.length}
              productCount={products.length}
            />

            <MenuSection
              products={filteredProducts}
              categoryCounts={categoryCounts}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onSelectProduct={(product) => setSelectedProductId(product.id)}
              onSelectSeller={handleSelectSeller}
              onAddToCart={(product) => handleAddToCart(product, 1)}
              onResetFilters={() => {
                setSelectedCategory('Semua');
                setSearchQuery('');
                setSortBy('rekomendasi');
              }}
            />
          </>
        )}

        {activePage === 'penjual' && (
          <SellerProfileView
            sellers={INITIAL_SELLERS}
            selectedSellerId={selectedSellerId}
            onSelectSeller={setSelectedSellerId}
            products={products}
            onSelectProduct={(product) => setSelectedProductId(product.id)}
            onAddToCart={(product) => handleAddToCart(product, 1)}
            onContactSeller={(sellerId) => handleOpenWhatsApp(sellerId)}
            onBackToMenu={() => handleNavigate('menu')}
          />
        )}

        {activePage === 'tentang' && (
          <AboutView
            onExploreMenu={() => handleNavigate('menu')}
            onOpenDashboard={() => handleNavigate('dashboard')}
          />
        )}

        {activePage === 'dashboard' && (
          <SellerDashboardView
            products={products}
            sellers={INITIAL_SELLERS}
            orders={orders}
            onUpdateProduct={handleUpdateProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />

      <ProductDetailModal
        key={`${selectedProduct?.id ?? 'closed'}-${currentUser?.id ?? 'guest'}`}
        product={selectedProduct}
        onClose={() => setSelectedProductId(null)}
        onAddToCart={handleAddToCart}
        onSelectSeller={handleSelectSeller}
        onContactSeller={(sellerId) => handleOpenWhatsApp(sellerId)}
        defaultAuthorName={currentUser?.name ?? ''}
        onAddReview={handleAddReview}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        products={products}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        products={products}
        currentUser={currentUser}
        onSubmitOrder={handleSubmitOrder}
        onViewDashboard={() => handleNavigate('dashboard')}
      />

      <WhatsAppContactModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        sellers={INITIAL_SELLERS}
        initialSellerId={waPreselectedSellerId}
        onNotify={showToast}
      />

      <AccountAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        orderCount={orders.length}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenDashboard={() => handleNavigate('dashboard')}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
