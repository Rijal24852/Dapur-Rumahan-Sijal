import { ArrowRight } from 'lucide-react';
import { HERO_BANNER_IMAGE } from '../data/marketplaceData';
import { FoodImage } from './FoodImage';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onViewSellers: () => void;
  sellerCount: number;
  productCount: number;
}

export function HeroSection({
  onExploreMenu,
  onViewSellers,
  sellerCount,
  productCount,
}: HeroSectionProps) {
  return (
    <section className="bg-[#FFF1DF]/65 border-b border-[#75452E]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center gap-5">
            <p className="text-sm font-semibold text-[#C85A17] tracking-wide">
              Marketplace Kuliner UMKM Lokal · DapurKu
            </p>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.15] text-[#3B2014] text-balance">
              Rasa Rumahan, Mudah Dipesan
            </h1>

            <p className="text-base sm:text-[17px] leading-relaxed text-[#75452E]/90 max-w-xl">
              Temukan aneka masakan hangat, jajanan sore, kue panggang, hingga
              minuman segar yang dimasak langsung setiap hari oleh pelaku UMKM
              dapur rumahan terpercaya di sekitar Anda.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={onExploreMenu}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#F28C45] text-[#3B2014] font-bold text-sm sm:text-base hover:bg-[#e57e36] hover:-translate-y-0.5 transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                <span>Jelajahi Menu</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onViewSellers}
                className="px-5 py-3 rounded-xl border border-[#75452E]/25 bg-white text-[#75452E] font-semibold text-sm sm:text-base hover:bg-[#FFF9F2] hover:border-[#75452E]/45 transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[44px]"
              >
                Kenali Penjual UMKM
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative h-64 sm:h-80 lg:h-full min-h-[300px] rounded-2xl overflow-hidden shadow-md border border-[#75452E]/10 bg-[#FFF1DF]">
              <FoodImage
                src={HERO_BANNER_IMAGE}
                alt="Hidangan masakan rumahan hangat dari pelaku UMKM DapurKu"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-5 sm:p-6">
                <p className="text-sm font-medium text-[#FFF1DF]">
                  Dimasak segar sesuai pesanan
                </p>
                <p className="text-base sm:text-lg font-semibold text-white">
                  Dari dapur keluarga langsung ke meja makan Anda
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#75452E]/12 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <p className="text-2xl font-bold text-[#75452E] tabular-nums">
              {sellerCount} Dapur
            </p>
            <p className="text-sm text-[#75452E]/75 mt-0.5">
              Mitra UMKM kuliner terverifikasi
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#75452E] tabular-nums">
              {productCount} Menu
            </p>
            <p className="text-sm text-[#75452E]/75 mt-0.5">
              Pilihan makanan &amp; minuman segar
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#75452E] tabular-nums">
              5 Kategori
            </p>
            <p className="text-sm text-[#75452E]/75 mt-0.5">
              Dari lauk berat hingga gorengan
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#75452E] tabular-nums">
              Gratis Ongkir
            </p>
            <p className="text-sm text-[#75452E]/75 mt-0.5">
              Untuk belanja minimal Rp50.000
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
