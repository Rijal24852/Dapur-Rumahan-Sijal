import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { CartItem, Order, Product, UserAccount } from '../types/marketplace';
import { formatRupiah } from '../utils/format';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: Product[];
  currentUser: UserAccount | null;
  onSubmitOrder: (payload: {
    customerName: string;
    whatsapp: string;
    address: string;
    notes: string;
  }) => Order;
  onViewDashboard: () => void;
}

export function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  products,
  currentUser,
  onSubmitOrder,
  onViewDashboard,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      setCustomerName((prev) => prev || currentUser.name);
      setWhatsapp((prev) => prev || currentUser.whatsapp);
    }
  }, [isOpen, currentUser]);

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

  const handleClose = () => {
    setConfirmedOrder(null);
    setError('');
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !whatsapp.trim() || !address.trim()) {
      setError('Mohon lengkapi nama penerima, nomor WhatsApp, dan alamat pengantaran.');
      return;
    }

    const order = onSubmitOrder({
      customerName: customerName.trim(),
      whatsapp: whatsapp.trim(),
      address: address.trim(),
      notes: notes.trim(),
    });
    setConfirmedOrder(order);
    setCustomerName('');
    setWhatsapp('');
    setAddress('');
    setNotes('');
    setError('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-checkout"
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-[#75452E]/15"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 sm:px-6 py-4 border-b border-[#75452E]/10 flex items-center justify-between gap-4">
          <h2 id="judul-checkout" className="font-display text-xl sm:text-2xl font-bold text-[#3B2014]">
            {confirmedOrder ? 'Pesanan Berhasil Dikirim' : 'Checkout Pesanan'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup jendela checkout"
            className="w-10 h-10 rounded-lg border border-[#75452E]/15 flex items-center justify-center text-[#75452E] hover:bg-[#FFF1DF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-4 bg-[#FFF9F2] p-5 rounded-2xl border border-[#75452E]/12">
              <CheckCircle2 className="w-7 h-7 text-[#C85A17] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <p className="font-bold text-base text-[#3B2014]">
                  Pesanan #{confirmedOrder.id} Diterima Dapur UMKM
                </p>
                <p className="text-sm text-[#75452E]/85">
                  Terima kasih, {confirmedOrder.customerName}. Pesanan Anda telah
                  diteruskan ke daftar Pesanan Masuk pada Dashboard Penjual.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-sm border-b border-[#75452E]/10 pb-4">
              <div className="flex justify-between gap-4">
                <span className="text-[#75452E]/75">Penerima</span>
                <span className="font-semibold text-[#3B2014] text-right">
                  {confirmedOrder.customerName} ({confirmedOrder.whatsapp})
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#75452E]/75">Alamat Pengantaran</span>
                <span className="font-medium text-[#3B2014] text-right max-w-sm">
                  {confirmedOrder.address}
                </span>
              </div>
              {confirmedOrder.notes && (
                <div className="flex justify-between gap-4">
                  <span className="text-[#75452E]/75">Catatan Pesanan</span>
                  <span className="font-medium text-[#3B2014] text-right max-w-sm">
                    {confirmedOrder.notes}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-4 pt-2 border-t border-[#75452E]/10">
                <span className="font-bold text-[#3B2014]">Total Pembayaran (COD)</span>
                <span className="font-bold text-lg text-[#75452E] tabular-nums">
                  {formatRupiah(confirmedOrder.total)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onViewDashboard();
                }}
                className="px-5 py-2.5 rounded-xl border border-[#75452E]/25 text-sm font-semibold text-[#75452E] hover:bg-[#FFF9F2] transition-colors cursor-pointer"
              >
                Lihat di Dashboard Penjual
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-[#F28C45] text-[#3B2014] text-sm font-bold hover:bg-[#e57e36] transition-colors cursor-pointer"
              >
                Lanjut Belanja
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="checkout-nama"
                  className="block text-sm font-semibold text-[#3B2014] mb-1.5"
                >
                  Nama Penerima
                </label>
                <input
                  id="checkout-nama"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Siti Rahma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#75452E]/20 text-sm text-[#3B2014] focus:border-[#F28C45] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-wa"
                  className="block text-sm font-semibold text-[#3B2014] mb-1.5"
                >
                  Nomor WhatsApp
                </label>
                <input
                  id="checkout-wa"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Contoh: 0812-3456-7890"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#75452E]/20 text-sm text-[#3B2014] focus:border-[#F28C45] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="checkout-alamat"
                className="block text-sm font-semibold text-[#3B2014] mb-1.5"
              >
                Alamat Pengantaran
              </label>
              <textarea
                id="checkout-alamat"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Nama jalan, nomor rumah, patokan terdekat..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#75452E]/20 text-sm text-[#3B2014] focus:border-[#F28C45] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="checkout-catatan"
                className="block text-sm font-semibold text-[#3B2014] mb-1.5"
              >
                Catatan Pesanan (Opsional)
              </label>
              <textarea
                id="checkout-catatan"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Sambal dipisah, kurangi gula, antar pukul 12.00..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#75452E]/20 text-sm text-[#3B2014] focus:border-[#F28C45] focus:outline-none"
              />
            </div>

            <div className="rounded-2xl bg-[#FFF9F2] border border-[#75452E]/12 p-4 sm:p-5 space-y-3">
              <h3 className="font-semibold text-sm text-[#3B2014]">
                Ringkasan Pembayaran
              </h3>

              <ul className="space-y-1.5 text-sm">
                {enrichedItems.map(({ product, quantity }) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between gap-3 text-[#75452E]"
                  >
                    <span className="truncate">
                      {quantity}x {product.name}
                    </span>
                    <span className="font-medium text-[#3B2014] tabular-nums shrink-0">
                      {formatRupiah(product.price * quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-[#75452E]/10 space-y-1.5 text-sm">
                <div className="flex justify-between text-[#75452E]/85">
                  <span>Ongkos Kirim</span>
                  <span className="tabular-nums font-medium text-[#3B2014]">
                    {deliveryFee === 0 ? 'Gratis' : formatRupiah(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base text-[#3B2014]">
                  <span>Total Pembayaran (COD / Bayar di Tempat)</span>
                  <span className="text-[#75452E] tabular-nums">
                    {formatRupiah(total)}
                  </span>
                </div>
              </div>
            </div>

            {error && <p className="text-sm font-medium text-red-700">{error}</p>}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl border border-[#75452E]/20 text-sm font-semibold text-[#75452E] hover:bg-[#FFF9F2] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={enrichedItems.length === 0}
                className="px-6 py-2.5 rounded-xl bg-[#F28C45] text-[#3B2014] text-sm font-bold hover:bg-[#e57e36] transition-colors cursor-pointer min-h-[44px]"
              >
                Konfirmasi Pesanan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
