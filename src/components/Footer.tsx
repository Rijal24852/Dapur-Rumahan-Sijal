import { ActivePage } from '../types/marketplace';

interface FooterProps {
  onNavigate: (page: ActivePage) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#FFF9F2] border-t border-[#75452E]/12 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#75452E]/10">
          <div className="space-y-1.5">
            <p className="font-display text-xl font-bold text-[#75452E]">DapurKu</p>
            <p className="text-sm text-[#75452E]/80">
              Rasa Rumahan, Mudah Dipesan — Marketplace Kuliner UMKM Lokal.
            </p>
          </div>

          <nav aria-label="Tautan footer" className="flex flex-wrap items-center gap-6 text-sm font-medium text-[#75452E]">
            <button
              type="button"
              onClick={() => onNavigate('beranda')}
              className="hover:text-[#C85A17] transition-colors cursor-pointer"
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={() => onNavigate('menu')}
              className="hover:text-[#C85A17] transition-colors cursor-pointer"
            >
              Menu Makanan
            </button>
            <button
              type="button"
              onClick={() => onNavigate('penjual')}
              className="hover:text-[#C85A17] transition-colors cursor-pointer"
            >
              Penjual UMKM
            </button>
            <button
              type="button"
              onClick={() => onNavigate('tentang')}
              className="hover:text-[#C85A17] transition-colors cursor-pointer"
            >
              Tentang Kami
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="hover:text-[#C85A17] transition-colors cursor-pointer"
            >
              Dashboard Penjual
            </button>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#75452E]/70">
          <p>© {new Date().getFullYear()} DapurKu. Memberdayakan kuliner rumahan Indonesia.</p>
          <p>Semua harga dalam Rupiah (IDR).</p>
        </div>
      </div>
    </footer>
  );
}
