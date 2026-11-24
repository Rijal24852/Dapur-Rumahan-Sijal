import {
  ArrowLeft,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Store,
  User,
} from 'lucide-react';
import { Product, Seller } from '../types/marketplace';
import { FoodImage } from './FoodImage';
import { ProductCard } from './ProductCard';

interface SellerProfileViewProps {
  sellers: Seller[];
  selectedSellerId: string;
  onSelectSeller: (sellerId: string) => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onContactSeller: (sellerId: string) => void;
  onBackToMenu: () => void;
}

export function SellerProfileView({
  sellers,
  selectedSellerId,
  onSelectSeller,
  products,
  onSelectProduct,
  onAddToCart,
  onContactSeller,
  onBackToMenu,
}: SellerProfileViewProps) {
  const activeSeller =
    sellers.find((s) => s.id === selectedSellerId) ?? sellers[0];
  const sellerProducts = products.filter(
    (product) => product.sellerId === activeSeller.id
  );

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBackToMenu}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#75452E] hover:text-[#C85A17] transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Kembali ke Daftar Menu</span>
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#3B2014]">
            Profil Penjual UMKM
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {sellers.map((seller) => {
            const isSelected = seller.id === activeSeller.id;
            return (
              <button
                key={seller.id}
                type="button"
                onClick={() => onSelectSeller(seller.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-[#75452E] text-white border-[#75452E]'
                    : 'bg-[#FFF9F2] text-[#75452E] border-[#75452E]/15 hover:bg-[#FFF1DF]'
                }`}
              >
                {seller.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#75452E]/12 overflow-hidden shadow-sm">
        <div className="relative h-48 sm:h-64 bg-[#FFF1DF]">
          <FoodImage
            src={activeSeller.coverImage}
            alt={`Foto sampul ${activeSeller.name}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex items-end gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-[#FFF1DF] shrink-0">
              <FoodImage
                src={activeSeller.avatarImage}
                alt={`Foto profil ${activeSeller.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-white pb-1 min-w-0">
              <h2 className="font-display text-xl sm:text-3xl font-bold leading-tight truncate">
                {activeSeller.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#FFF1DF] mt-1 line-clamp-1">
                {activeSeller.tagline}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h3 className="font-display text-xl font-bold text-[#3B2014]">
                Tentang Usaha
              </h3>
              <p className="text-sm sm:text-base text-[#75452E]/90 leading-relaxed mt-2">
                {activeSeller.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#75452E]/10 flex flex-wrap items-center gap-6 text-sm text-[#75452E]">
              <span className="inline-flex items-center gap-1.5 font-semibold tabular-nums">
                <Star
                  className="w-4 h-4 fill-[#F28C45] text-[#F28C45]"
                  aria-hidden="true"
                />
                Rating {activeSeller.rating.toFixed(1)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums font-medium">
                {activeSeller.completedOrders}+ pesanan selesai
              </span>
              <span aria-hidden="true">·</span>
              <span>Bergabung sejak {activeSeller.joinedYear}</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#FFF9F2] rounded-2xl p-5 border border-[#75452E]/10 space-y-3">
            <h3 className="font-semibold text-base text-[#3B2014]">
              Informasi Penjual
            </h3>
            <dl className="space-y-2.5 text-sm text-[#75452E]">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-[#C85A17] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-[#75452E]/70">Pemilik Dapur</dt>
                  <dd className="font-medium text-[#3B2014]">{activeSeller.ownerName}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Store className="w-4 h-4 text-[#C85A17] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-[#75452E]/70">Spesialisasi</dt>
                  <dd className="font-medium text-[#3B2014]">{activeSeller.specialty}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C85A17] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-[#75452E]/70">Lokasi Dapur</dt>
                  <dd className="font-medium text-[#3B2014]">{activeSeller.location}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C85A17] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-[#75452E]/70">Jam Operasional</dt>
                  <dd className="font-medium text-[#3B2014]">{activeSeller.operatingHours}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#C85A17] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <dt className="text-xs text-[#75452E]/70">Kontak WhatsApp UMKM</dt>
                  <dd className="font-medium text-[#3B2014] tabular-nums">
                    {activeSeller.whatsapp}
                  </dd>
                </div>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => onContactSeller(activeSeller.id)}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>Hubungi via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#3B2014]">
            Daftar Produk dari {activeSeller.name}
          </h3>
          <span className="text-sm text-[#75452E]/80 tabular-nums">
            {sellerProducts.length} menu tersedia
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sellerProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onSelectSeller={onSelectSeller}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
