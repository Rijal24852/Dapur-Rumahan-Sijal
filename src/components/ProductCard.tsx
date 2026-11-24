import { Plus, Star } from 'lucide-react';
import { Product } from '../types/marketplace';
import { formatRupiah } from '../utils/format';
import { FoodImage } from './FoodImage';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onSelectSeller: (sellerId: string) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({
  product,
  onSelectProduct,
  onSelectSeller,
  onAddToCart,
}: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group bg-white rounded-2xl border border-[#75452E]/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden">
      <button
        type="button"
        onClick={() => onSelectProduct(product)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-[#FFF1DF] cursor-pointer text-left"
      >
        <FoodImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-lg bg-white text-[#3B2014] text-xs font-bold">
              Stok Habis
            </span>
          </div>
        )}
      </button>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs text-[#75452E]/75">
            <span className="font-medium truncate">{product.category}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#75452E] shrink-0 tabular-nums">
              <Star
                className="w-3.5 h-3.5 fill-[#F28C45] text-[#F28C45]"
                aria-hidden="true"
              />
              {product.rating.toFixed(1)}
            </span>
          </div>

          <h3 className="text-base font-bold text-[#3B2014] leading-snug line-clamp-1">
            <button
              type="button"
              onClick={() => onSelectProduct(product)}
              className="hover:text-[#C85A17] transition-colors text-left cursor-pointer"
            >
              {product.name}
            </button>
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-[#75452E]/80">
            <button
              type="button"
              onClick={() => onSelectSeller(product.sellerId)}
              className="font-medium hover:text-[#C85A17] underline decoration-[#75452E]/25 underline-offset-2 transition-colors cursor-pointer truncate"
            >
              {product.sellerName}
            </button>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums shrink-0">
              {isOutOfStock ? 'Habis' : `Stok ${product.stock}`}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#75452E]/8 flex items-center justify-between gap-3">
          <span className="text-base sm:text-lg font-bold text-[#75452E] tabular-nums">
            {formatRupiah(product.price)}
          </span>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0 min-h-[40px] ${
              isOutOfStock
                ? 'bg-[#75452E]/10 text-[#75452E]/40 cursor-not-allowed'
                : 'bg-[#F28C45] text-[#3B2014] hover:bg-[#e57e36] active:scale-[0.98] cursor-pointer'
            }`}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Tambah</span>
          </button>
        </div>
      </div>
    </article>
  );
}
