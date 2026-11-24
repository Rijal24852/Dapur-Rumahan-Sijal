import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { CartItem, Product } from '../types/marketplace';
import { formatRupiah } from '../utils/format';
import { FoodImage } from './FoodImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
  onProceedCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
}: CartDrawerProps) {
  if (!isOpen) {
    return null;
  }

  const enrichedItems = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((entry): entry is { productId: number; quantity: number; product: Product } =>
      Boolean(entry)
    );

  const subtotal = enrichedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = subtotal === 0 || subtotal >= 50000 ? 0 : 5000;
  const total = subtotal + deliveryFee;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-keranjang"
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px] flex justify-end"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-[#75452E]/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#75452E]/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#C85A17]" aria-hidden="true" />
            <h2 id="judul-keranjang" className="font-display text-xl font-bold text-[#3B2014]">
              Keranjang Belanja
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup keranjang"
            className="w-10 h-10 rounded-lg border border-[#75452E]/15 flex items-center justify-center text-[#75452E] hover:bg-[#FFF1DF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {enrichedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF1DF] text-[#75452E] flex items-center justify-center">
                <ShoppingBag className="w-7 h-7" aria-hidden="true" />
              </div>
              <p className="font-display text-lg font-semibold text-[#3B2014]">
                Keranjang masih kosong
              </p>
              <p className="text-sm text-[#75452E]/75 max-w-xs">
                Pilih masakan rumahan favorit Anda dari daftar menu untuk mulai memesan.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#75452E]/10">
              {enrichedItems.map(({ product, quantity }) => (
                <li key={product.id} className="py-4 flex gap-3.5 items-start">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-[#FFF1DF] shrink-0 border border-[#75452E]/10">
                    <FoodImage
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-[#3B2014] leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#75452E]/75 mt-0.5">
                          {product.sellerName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        aria-label={`Hapus ${product.name}`}
                        className="p-1.5 rounded-lg text-[#75452E]/60 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-sm font-bold text-[#75452E] tabular-nums">
                        {formatRupiah(product.price * quantity)}
                      </span>

                      <div className="inline-flex items-center border border-[#75452E]/20 rounded-lg bg-[#FFF9F2]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          aria-label={`Kurangi jumlah ${product.name}`}
                          className="w-8 h-8 flex items-center justify-center text-[#75452E] hover:bg-[#FFF1DF] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#3B2014] tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          disabled={quantity >= product.stock}
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          aria-label={`Tambah jumlah ${product.name}`}
                          className="w-8 h-8 flex items-center justify-center text-[#75452E] hover:bg-[#FFF1DF] disabled:opacity-35 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {enrichedItems.length > 0 && (
          <div className="p-5 border-t border-[#75452E]/12 bg-[#FFF9F2] space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-[#75452E]/85">
                <span>Subtotal Makanan</span>
                <span className="font-semibold text-[#3B2014] tabular-nums">
                  {formatRupiah(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#75452E]/85">
                <span>Ongkos Kirim Lokal</span>
                <span className="font-semibold text-[#3B2014] tabular-nums">
                  {deliveryFee === 0 ? 'Gratis' : formatRupiah(deliveryFee)}
                </span>
              </div>
              {subtotal < 50000 && (
                <p className="text-xs text-[#C85A17]">
                  Tambah {formatRupiah(50000 - subtotal)} lagi untuk gratis ongkos kirim.
                </p>
              )}
              <div className="pt-2 border-t border-[#75452E]/12 flex items-center justify-between text-base font-bold text-[#3B2014]">
                <span>Total Pembayaran</span>
                <span className="text-lg text-[#75452E] tabular-nums">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedCheckout}
              className="w-full py-3 px-5 rounded-xl bg-[#F28C45] text-[#3B2014] font-bold text-sm sm:text-base hover:bg-[#e57e36] transition-colors cursor-pointer min-h-[44px]"
            >
              Lanjut ke Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
