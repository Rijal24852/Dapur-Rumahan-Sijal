import { useState } from 'react';
import {
  Check,
  ClipboardList,
  Package,
  RotateCcw,
  Search,
  ShoppingCart,
  Wallet,
} from 'lucide-react';
import { Order, OrderStatus, Product, Seller } from '../types/marketplace';
import { formatRupiah } from '../utils/format';
import { FoodImage } from './FoodImage';

interface SellerDashboardViewProps {
  products: Product[];
  sellers: Seller[];
  orders: Order[];
  onUpdateProduct: (productId: number, updates: { price: number; stock: number }) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onResetDemoData: () => void;
}

const ORDER_STATUSES: OrderStatus[] = [
  'Menunggu',
  'Diproses',
  'Siap Antar',
  'Selesai',
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  Menunggu: 'bg-[#FFF1DF] text-[#75452E] border-[#F28C45]/40',
  Diproses: 'bg-amber-50 text-amber-900 border-amber-300',
  'Siap Antar': 'bg-sky-50 text-sky-900 border-sky-300',
  Selesai: 'bg-emerald-50 text-emerald-900 border-emerald-300',
};

export function SellerDashboardView({
  products,
  sellers,
  orders,
  onUpdateProduct,
  onUpdateOrderStatus,
  onResetDemoData,
}: SellerDashboardViewProps) {
  const [sellerFilter, setSellerFilter] = useState<string>('semua');
  const [productQuery, setProductQuery] = useState<string>('');
  const [drafts, setDrafts] = useState<
    Record<number, { price: string; stock: string }>
  >({});

  const normalizedQuery = productQuery.trim().toLowerCase();
  const filteredProducts = products.filter((p) => {
    const matchesSeller =
      sellerFilter === 'semua' || p.sellerId === sellerFilter;
    const matchesQuery =
      !normalizedQuery ||
      p.name.toLowerCase().includes(normalizedQuery) ||
      p.category.toLowerCase().includes(normalizedQuery);
    return matchesSeller && matchesQuery;
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalPortionsSold = orders.reduce(
    (sum, order) =>
      sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );
  const activeProductsCount = products.filter((p) => p.stock > 0).length;

  const getDraft = (product: Product) => {
    return (
      drafts[product.id] ?? {
        price: String(product.price),
        stock: String(product.stock),
      }
    );
  };

  const handleDraftChange = (
    product: Product,
    field: 'price' | 'stock',
    value: string
  ) => {
    const current = getDraft(product);
    setDrafts((prev) => ({
      ...prev,
      [product.id]: {
        ...current,
        [field]: value,
      },
    }));
  };

  const handleSaveProduct = (product: Product) => {
    const draft = getDraft(product);
    const parsedPrice = Math.max(500, Number(draft.price) || product.price);
    const parsedStock = Math.max(0, Math.floor(Number(draft.stock) || 0));
    onUpdateProduct(product.id, { price: parsedPrice, stock: parsedStock });
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[product.id];
      return next;
    });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#75452E]/10">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#3B2014]">
            Dashboard Penjual UMKM
          </h1>
          <p className="text-sm sm:text-base text-[#75452E]/80 mt-1">
            Kelola harga dan stok menu, pantau pesanan masuk, serta lihat ringkasan penjualan.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetDemoData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#75452E]/20 bg-white text-xs sm:text-sm font-semibold text-[#75452E] hover:bg-[#FFF9F2] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          <span>Reset Data Demo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-[#75452E]/12 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-sm text-[#75452E]/80">
            <span>Total Penjualan</span>
            <Wallet className="w-4 h-4 text-[#C85A17]" aria-hidden="true" />
          </div>
          <p className="text-2xl font-bold text-[#3B2014] tabular-nums">
            {formatRupiah(totalRevenue)}
          </p>
          <p className="text-xs text-[#75452E]/70">Akumulasi pesanan tercatat</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#75452E]/12 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-sm text-[#75452E]/80">
            <span>Pesanan Masuk</span>
            <ClipboardList className="w-4 h-4 text-[#C85A17]" aria-hidden="true" />
          </div>
          <p className="text-2xl font-bold text-[#3B2014] tabular-nums">
            {orders.length} Pesanan
          </p>
          <p className="text-xs text-[#75452E]/70">
            {orders.filter((o) => o.status !== 'Selesai').length} perlu diproses
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#75452E]/12 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-sm text-[#75452E]/80">
            <span>Porsi Terjual</span>
            <ShoppingCart className="w-4 h-4 text-[#C85A17]" aria-hidden="true" />
          </div>
          <p className="text-2xl font-bold text-[#3B2014] tabular-nums">
            {totalPortionsSold} Porsi
          </p>
          <p className="text-xs text-[#75452E]/70">Dari seluruh kategori menu</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#75452E]/12 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-sm text-[#75452E]/80">
            <span>Produk Tersedia</span>
            <Package className="w-4 h-4 text-[#C85A17]" aria-hidden="true" />
          </div>
          <p className="text-2xl font-bold text-[#3B2014] tabular-nums">
            {activeProductsCount} / {products.length}
          </p>
          <p className="text-xs text-[#75452E]/70">Menu aktif dengan stok &gt; 0</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#3B2014]">
              Kelola Produk, Harga &amp; Stok
            </h2>
            <p className="text-sm text-[#75452E]/80">
              Ubah harga atau jumlah stok lalu tekan Simpan untuk langsung memperbarui katalog toko.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#75452E]/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                placeholder="Cari menu di dashboard..."
                aria-label="Cari produk di dashboard penjual"
                className="w-full sm:w-56 pl-9 pr-3.5 py-2.5 rounded-xl border border-[#75452E]/20 bg-white text-sm text-[#3B2014] placeholder:text-[#75452E]/50 focus:border-[#F28C45] focus:outline-none"
              />
            </div>

            <select
              value={sellerFilter}
              onChange={(e) => setSellerFilter(e.target.value)}
              aria-label="Filter produk berdasarkan penjual"
              className="px-3.5 py-2.5 rounded-xl border border-[#75452E]/20 bg-white text-sm font-medium text-[#3B2014] focus:border-[#F28C45] focus:outline-none cursor-pointer"
            >
              <option value="semua">Semua Penjual UMKM</option>
              {sellers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#75452E]/12 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#75452E]/10 bg-[#FFF9F2] text-xs font-semibold text-[#75452E]">
                <th className="py-3.5 px-4">Produk</th>
                <th className="py-3.5 px-4">Penjual &amp; Kategori</th>
                <th className="py-3.5 px-4">Harga (Rp)</th>
                <th className="py-3.5 px-4">Stok</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#75452E]/10 text-sm">
              {filteredProducts.map((product) => {
                const draft = getDraft(product);
                const isDirty =
                  Number(draft.price) !== product.price ||
                  Number(draft.stock) !== product.stock;

                return (
                  <tr key={product.id} className="hover:bg-[#FFF9F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-[#FFF1DF] shrink-0">
                          <FoodImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-semibold text-[#3B2014]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#75452E]">
                      <div className="font-medium text-[#3B2014]">{product.sellerName}</div>
                      <div className="text-xs text-[#75452E]/75">{product.category}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <input
                        type="number"
                        min={500}
                        step={500}
                        value={draft.price}
                        aria-label={`Harga ${product.name}`}
                        onChange={(e) =>
                          handleDraftChange(product, 'price', e.target.value)
                        }
                        className="w-32 px-3 py-1.5 rounded-lg border border-[#75452E]/20 bg-white text-[#3B2014] font-medium tabular-nums focus:border-[#F28C45] focus:outline-none"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={draft.stock}
                        aria-label={`Stok ${product.name}`}
                        onChange={(e) =>
                          handleDraftChange(product, 'stock', e.target.value)
                        }
                        className="w-24 px-3 py-1.5 rounded-lg border border-[#75452E]/20 bg-white text-[#3B2014] font-medium tabular-nums focus:border-[#F28C45] focus:outline-none"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleSaveProduct(product)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isDirty
                            ? 'bg-[#F28C45] text-[#3B2014] hover:bg-[#e57e36]'
                            : 'bg-[#FFF1DF] text-[#75452E] hover:bg-[#F28C45]/30'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Simpan</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#3B2014]">
          Pesanan Masuk ({orders.length})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {orders.map((order) => (
            <article
              key={order.id}
              className="bg-white rounded-2xl border border-[#75452E]/12 shadow-sm p-5 space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#75452E]/10">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#75452E]/75 tabular-nums">
                    <span className="font-bold text-[#3B2014]">#{order.id}</span>
                    <span aria-hidden="true">·</span>
                    <span>{order.createdAt}</span>
                  </div>
                  <h3 className="font-bold text-base text-[#3B2014] mt-0.5">
                    {order.customerName}
                  </h3>
                  <p className="text-xs text-[#75452E]/80 tabular-nums">
                    WhatsApp: {order.whatsapp}
                  </p>
                </div>

                <select
                  value={order.status}
                  onChange={(e) =>
                    onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                  }
                  aria-label={`Status pesanan ${order.id}`}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer focus:outline-none ${STATUS_STYLES[order.status]}`}
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      Status: {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs sm:text-sm text-[#75452E]/90 space-y-1">
                <p>
                  <strong className="text-[#3B2014]">Alamat:</strong> {order.address}
                </p>
                {order.notes && (
                  <p>
                    <strong className="text-[#3B2014]">Catatan:</strong> {order.notes}
                  </p>
                )}
              </div>

              <ul className="bg-[#FFF9F2] rounded-xl p-3.5 space-y-1.5 text-xs sm:text-sm">
                {order.items.map((item) => (
                  <li
                    key={`${order.id}-${item.productId}`}
                    className="flex items-center justify-between gap-2 text-[#75452E]"
                  >
                    <span className="truncate">
                      <strong className="text-[#3B2014] tabular-nums">
                        {item.quantity}x
                      </strong>{' '}
                      {item.name} ({item.sellerName})
                    </span>
                    <span className="font-semibold text-[#3B2014] tabular-nums shrink-0">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-1 text-sm font-bold text-[#3B2014]">
                <span>Total Pembayaran</span>
                <span className="text-base text-[#75452E] tabular-nums">
                  {formatRupiah(order.total)}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
