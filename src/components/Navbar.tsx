import { useState } from 'react';
import { Menu, MessageCircle, ShoppingBag, User, X } from 'lucide-react';
import { ActivePage, UserAccount } from '../types/marketplace';
import { getInitials } from '../utils/format';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenWhatsApp: () => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
}

const NAV_ITEMS: { id: ActivePage; label: string }[] = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'menu', label: 'Menu' },
  { id: 'penjual', label: 'Penjual UMKM' },
  { id: 'tentang', label: 'Tentang Kami' },
  { id: 'dashboard', label: 'Dashboard Penjual' },
];

export function Navbar({
  activePage,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenWhatsApp,
  currentUser,
  onOpenAuth,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#75452E]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-6">
        <button
          type="button"
          onClick={() => handleNavClick('beranda')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 cursor-pointer group"
        >
          <span className="w-9 h-9 rounded-lg bg-[#F28C45] text-[#3B2014] flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M4 13h16" />
              <path d="M5 13a7 7 0 0 0 14 0" />
              <path d="M8 9c0-1.5 1-2.5 1-4" />
              <path d="M12 8c0-1.5 1-2.5 1-4" />
              <path d="M16 9c0-1.5 1-2.5 1-4" />
            </svg>
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-[#75452E]">
            DapurKu
          </span>
        </button>

        <nav
          aria-label="Navigasi utama"
          className="hidden lg:flex items-center gap-6"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                  isActive
                    ? 'text-[#75452E] font-semibold'
                    : 'text-[#75452E]/75 hover:text-[#75452E]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 bottom-0 h-0.5 bg-[#F28C45] transition-transform duration-200 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenWhatsApp}
            aria-label="Hubungi penjual via WhatsApp"
            title="Hubungi Penjual (WhatsApp)"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-10 rounded-lg border border-emerald-600/25 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-700" aria-hidden="true" />
            <span className="hidden xl:inline text-xs font-semibold">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onOpenAuth}
            aria-label={currentUser ? `Akun ${currentUser.name}` : 'Masuk ke akun'}
            title={currentUser ? `Akun: ${currentUser.name}` : 'Masuk / Daftar Akun'}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-10 rounded-lg border border-[#75452E]/20 bg-[#FFF9F2] text-[#75452E] hover:bg-[#FFF1DF] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {currentUser ? (
              <>
                <span className="w-5 h-5 rounded-md bg-[#F28C45] text-[#3B2014] text-[11px] font-bold flex items-center justify-center">
                  {getInitials(currentUser.name)}
                </span>
                <span className="hidden xl:inline text-xs font-semibold max-w-[96px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-[#75452E]" aria-hidden="true" />
                <span className="hidden xl:inline text-xs font-semibold">Masuk</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-3 sm:px-4 h-10 rounded-lg bg-[#75452E] text-white text-sm font-semibold whitespace-nowrap shrink-0 hover:bg-[#5E3522] active:scale-[0.99] transition-all duration-150 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#F28C45]" aria-hidden="true" />
            <span className="hidden sm:inline">Keranjang</span>
            <span className="tabular-nums font-bold text-[#FFF1DF]">
              ({cartCount})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#75452E]/15 text-[#75452E] hover:bg-[#FFF1DF] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Navigasi seluler"
          className="lg:hidden border-t border-[#75452E]/10 bg-[#FFF9F2] px-4 py-3 flex flex-col gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#FFF1DF] text-[#75452E] font-semibold'
                    : 'text-[#75452E]/80 hover:bg-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
