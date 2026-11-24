import {
  ArrowUpDown,
  CakeSlice,
  Cookie,
  CupSoda,
  Flame,
  LayoutGrid,
  Search,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { FoodCategory, Product, SortOption } from '../types/marketplace';
import { ProductCard } from './ProductCard';

interface MenuSectionProps {
  products: Product[];
  categoryCounts: Record<FoodCategory, number>;
  selectedCategory: FoodCategory;
  onSelectCategory: (category: FoodCategory) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  onSelectProduct: (product: Product) => void;
  onSelectSeller: (sellerId: string) => void;
  onAddToCart: (product: Product) => void;
  onResetFilters: () => void;
}

const CATEGORIES: {
  id: FoodCategory;
  label: string;
  icon: typeof LayoutGrid;
}[] = [
  { id: 'Semua', label: 'Semua', icon: LayoutGrid },
  { id: 'Makanan Berat', label: 'Makanan Berat', icon: UtensilsCrossed },
  { id: 'Jajanan', label: 'Jajanan', icon: Cookie },
  { id: 'Kue & Roti', label: 'Kue & Roti', icon: CakeSlice },
  { id: 'Minuman', label: 'Minuman', icon: CupSoda },
  { id: 'Gorengan', label: 'Gorengan', icon: Flame },
];

export function MenuSection({
  products,
  categoryCounts,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onSelectProduct,
  onSelectSeller,
  onAddToCart,
  onResetFilters,
}: MenuSectionProps) {
  return (
    <section id="katalog-menu" className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#75452E]/10">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#3B2014]">
            Menu Pilihan Hari Ini
          </h2>
          <p className="text-sm sm:text-base text-[#75452E]/80 mt-1">
            Cari makanan berdasarkan nama hidangan atau dapur penjual UMKM favorit Anda.
          </p>
        </div>

        <p className="text-sm text-[#75452E]/75 tabular-nums shrink-0">
          Menampilkan <strong className="text-[#3B2014]">{products.length}</strong> menu
        </p>
      </div>

      <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div
          role="tablist"
          aria-label="Kategori makanan"
          className="flex flex-wrap items-center gap-2"
        >
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectCategory(category.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer min-h-[42px] border ${
                  isActive
                    ? 'bg-[#75452E] text-white border-[#75452E] shadow-sm'
                    : 'bg-[#FFF9F2] text-[#75452E] border-[#75452E]/15 hover:bg-[#FFF1DF]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-[#F28C45]' : 'text-[#C85A17]'}`}
                  aria-hidden="true"
                />
                <span>{category.label}</span>
                <span
                  className={`tabular-nums text-xs ${
                    isActive ? 'text-[#FFF1DF]' : 'text-[#75452E]/65'
                  }`}
                >
                  ({categoryCounts[category.id] ?? 0})
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search
              className="w-4 h-4 text-[#75452E]/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari menu atau penjual..."
              aria-label="Cari makanan berdasarkan nama produk atau penjual"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-[#75452E]/20 bg-white text-sm text-[#3B2014] placeholder:text-[#75452E]/50 focus:border-[#F28C45] focus:outline-none min-h-[42px]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Hapus pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#75452E]/60 hover:text-[#3B2014] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative sm:w-56">
            <ArrowUpDown
              className="w-4 h-4 text-[#75452E]/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Urutkan menu"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#75452E]/20 bg-white text-sm font-medium text-[#3B2014] focus:border-[#F28C45] focus:outline-none cursor-pointer min-h-[42px]"
            >
              <option value="rekomendasi">Urutan Rekomendasi</option>
              <option value="harga-terendah">Harga: Terendah ke Tertinggi</option>
              <option value="harga-tertinggi">Harga: Tertinggi ke Terendah</option>
              <option value="rating-tertinggi">Rating Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-[#75452E]/12 bg-[#FFF9F2] p-10 text-center space-y-3">
          <p className="font-display text-xl font-semibold text-[#3B2014]">
            Menu tidak ditemukan
          </p>
          <p className="text-sm text-[#75452E]/80 max-w-md mx-auto">
            Tidak ada hidangan atau dapur UMKM yang cocok dengan filter saat ini.
            Coba kata kunci lain atau tampilkan semua kategori.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-2 inline-flex items-center px-5 py-2.5 rounded-xl bg-[#F28C45] text-[#3B2014] text-sm font-semibold hover:bg-[#e57e36] transition-colors cursor-pointer"
          >
            Tampilkan Semua Menu
          </button>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onSelectSeller={onSelectSeller}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}
