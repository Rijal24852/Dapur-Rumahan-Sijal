import { FormEvent, useState } from 'react';
import { Clock, MessageCircle, Minus, Plus, ShoppingBag, Star, Store, X } from 'lucide-react';
import { Product } from '../types/marketplace';
import { formatRupiah } from '../utils/format';
import { FoodImage } from './FoodImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onSelectSeller: (sellerId: string) => void;
  onContactSeller: (sellerId: string) => void;
  defaultAuthorName?: string;
  onAddReview: (
    productId: number,
    review: { author: string; rating: number; comment: string }
  ) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onSelectSeller,
  onContactSeller,
  defaultAuthorName = '',
  onAddReview,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [author, setAuthor] = useState(defaultAuthorName);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  if (!product) {
    return null;
  }

  const isOutOfStock = product.stock <= 0;
  const clampedQty = Math.min(Math.max(1, quantity), Math.max(1, product.stock));

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) {
      setReviewError('Mohon isi nama dan ulasan Anda.');
      return;
    }
    onAddReview(product.id, {
      author: author.trim(),
      rating,
      comment: comment.trim(),
    });
    setAuthor('');
    setRating(5);
    setComment('');
    setReviewError('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-produk-judul"
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-[#75452E]/15"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-5 sm:px-6 py-4 border-b border-[#75452E]/10 flex items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-[#75452E]/80 flex items-center gap-2 truncate">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-[#75452E] truncate">
              {product.sellerName}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail produk"
            className="w-10 h-10 rounded-lg border border-[#75452E]/15 flex items-center justify-center text-[#75452E] hover:bg-[#FFF1DF] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-6 rounded-2xl overflow-hidden bg-[#FFF1DF] aspect-[4/3] border border-[#75452E]/10">
              <FoodImage
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-6 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <h2
                  id="detail-produk-judul"
                  className="font-display text-2xl sm:text-3xl font-bold text-[#3B2014] leading-tight"
                >
                  {product.name}
                </h2>

                <div className="flex flex-wrap items-center gap-3 text-sm text-[#75452E]">
                  <span className="inline-flex items-center gap-1 font-semibold tabular-nums">
                    <Star
                      className="w-4 h-4 fill-[#F28C45] text-[#F28C45]"
                      aria-hidden="true"
                    />
                    {product.rating.toFixed(1)} ({product.reviews.length} ulasan)
                  </span>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSelectSeller(product.sellerId);
                    }}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#C85A17] hover:underline cursor-pointer"
                  >
                    <Store className="w-4 h-4" aria-hidden="true" />
                    <span>{product.sellerName}</span>
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onContactSeller(product.sellerId);
                    }}
                    className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:underline cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Chat WhatsApp</span>
                  </button>
                </div>

                <p className="text-2xl font-bold text-[#75452E] tabular-nums pt-1">
                  {formatRupiah(product.price)}
                </p>

                <p className="text-sm sm:text-base text-[#3B2014]/85 leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#75452E]/85">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#C85A17]" aria-hidden="true" />
                    Siap dalam {product.prepTime}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{product.portionInfo}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold tabular-nums">
                    {isOutOfStock ? 'Stok habis' : `Tersedia ${product.stock} porsi`}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#75452E]/10 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center border border-[#75452E]/20 rounded-xl bg-[#FFF9F2]">
                  <button
                    type="button"
                    disabled={clampedQty <= 1 || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Kurangi jumlah"
                    className="w-10 h-11 flex items-center justify-center text-[#75452E] disabled:opacity-35 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-[#3B2014] tabular-nums">
                    {clampedQty}
                  </span>
                  <button
                    type="button"
                    disabled={clampedQty >= product.stock || isOutOfStock}
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    aria-label="Tambah jumlah"
                    className="w-10 h-11 flex items-center justify-center text-[#75452E] disabled:opacity-35 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => {
                    onAddToCart(product, clampedQty);
                    onClose();
                  }}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm sm:text-base font-bold transition-all min-h-[44px] ${
                    isOutOfStock
                      ? 'bg-[#75452E]/10 text-[#75452E]/40 cursor-not-allowed'
                      : 'bg-[#F28C45] text-[#3B2014] hover:bg-[#e57e36] cursor-pointer'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {isOutOfStock
                      ? 'Stok Habis'
                      : `Tambah ke Keranjang · ${formatRupiah(product.price * clampedQty)}`}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#75452E]/12 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-display text-xl font-bold text-[#3B2014]">
                Ulasan Pembeli ({product.reviews.length})
              </h3>
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="pb-4 border-b border-[#75452E]/8 last:border-b-0"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-[#3B2014]">
                        {rev.author}
                      </span>
                      <span className="text-xs text-[#75452E]/70 flex items-center gap-1.5 tabular-nums">
                        <Star
                          className="w-3.5 h-3.5 fill-[#F28C45] text-[#F28C45]"
                          aria-hidden="true"
                        />
                        {rev.rating.toFixed(1)} · {rev.date}
                      </span>
                    </div>
                    <p className="text-sm text-[#75452E]/90 mt-1.5 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-5 bg-[#FFF9F2] rounded-2xl p-5 border border-[#75452E]/10">
              <h4 className="font-semibold text-base text-[#3B2014]">
                Tulis Ulasan Anda
              </h4>
              <form onSubmit={handleReviewSubmit} className="mt-3 space-y-3">
                <div>
                  <label
                    htmlFor="review-author"
                    className="block text-xs font-medium text-[#75452E] mb-1"
                  >
                    Nama Anda
                  </label>
                  <input
                    id="review-author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Contoh: Rina Wijaya"
                    className="w-full px-3.5 py-2 rounded-lg border border-[#75452E]/20 bg-white text-sm text-[#3B2014] focus:border-[#F28C45] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="review-rating"
                    className="block text-xs font-medium text-[#75452E] mb-1"
                  >
                    Rating
                  </label>
                  <select
                    id="review-rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#75452E]/20 bg-white text-sm text-[#3B2014] focus:border-[#F28C45] focus:outline-none"
                  >
                    <option value={5}>5 — Sangat Enak</option>
                    <option value={4}>4 — Enak</option>
                    <option value={3}>3 — Cukup</option>
                    <option value={2}>2 — Kurang Cocok</option>
                    <option value={1}>1 — Perlu Perbaikan</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="review-comment"
                    className="block text-xs font-medium text-[#75452E] mb-1"
                  >
                    Komentar
                  </label>
                  <textarea
                    id="review-comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ceritakan rasa, porsi, dan pengemasan makanan..."
                    className="w-full px-3.5 py-2 rounded-lg border border-[#75452E]/20 bg-white text-sm text-[#3B2014] focus:border-[#F28C45] focus:outline-none"
                  />
                </div>

                {reviewError && (
                  <p className="text-xs font-medium text-red-700">{reviewError}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#75452E] text-white text-sm font-semibold hover:bg-[#5E3522] transition-colors cursor-pointer"
                >
                  Kirim Ulasan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
