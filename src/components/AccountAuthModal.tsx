import { FormEvent, useState } from 'react';
import { LogIn, LogOut, ShieldCheck, Store, User, X } from 'lucide-react';
import { UserAccount, UserRole } from '../types/marketplace';
import { getInitials } from '../utils/format';

interface AccountAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  orderCount: number;
  onLogin: (account: UserAccount) => void;
  onLogout: () => void;
  onOpenDashboard: () => void;
}

export function AccountAuthModal({
  isOpen,
  onClose,
  currentUser,
  orderCount,
  onLogin,
  onLogout,
  onOpenDashboard,
}: AccountAuthModalProps) {
  const [mode, setMode] = useState<'masuk' | 'daftar'>('masuk');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Pembeli');
  const [error, setError] = useState('');

  if (!isOpen) {
    return null;
  }

  const resetForm = () => {
    setName('');
    setEmail('');
    setWhatsapp('');
    setPassword('');
    setError('');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Mohon isi email dan kata sandi terlebih dahulu.');
      return;
    }
    if (mode === 'daftar' && (!name.trim() || !whatsapp.trim())) {
      setError('Mohon lengkapi nama lengkap dan nomor WhatsApp untuk mendaftar.');
      return;
    }

    const derivedName =
      name.trim() ||
      email
        .split('@')[0]
        .replace(/[._-]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

    onLogin({
      id: `usr-${Date.now()}`,
      name: derivedName,
      email: email.trim(),
      whatsapp: whatsapp.trim() || '0812-3456-7890',
      role,
    });
    resetForm();
    onClose();
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    if (demoRole === 'Penjual UMKM') {
      onLogin({
        id: 'demo-seller',
        name: 'Ibu Rina Kartika',
        email: 'dapur.mamarina@dapurku.id',
        whatsapp: '0812-8490-3312',
        role: 'Penjual UMKM',
      });
    } else {
      onLogin({
        id: 'demo-buyer',
        name: 'Siti Rahma',
        email: 'siti.rahma@email.id',
        whatsapp: '0813-4455-8899',
        role: 'Pembeli',
      });
    }
    resetForm();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-akun-dapurku"
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl border border-[#75452E]/15"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 sm:px-6 py-4 border-b border-[#75452E]/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#FFF1DF] text-[#75452E] flex items-center justify-center shrink-0">
              <User className="w-5 h-5" aria-hidden="true" />
            </span>
            <h2
              id="judul-akun-dapurku"
              className="font-display text-lg sm:text-xl font-bold text-[#3B2014]"
            >
              {currentUser ? 'Profil Akun DapurKu' : 'Masuk ke Akun DapurKu'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela akun"
            className="w-10 h-10 rounded-lg border border-[#75452E]/15 flex items-center justify-center text-[#75452E] hover:bg-[#FFF1DF] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-4 bg-[#FFF9F2] p-4 rounded-2xl border border-[#75452E]/12">
              <div className="w-14 h-14 rounded-2xl bg-[#75452E] text-white font-display text-xl font-bold flex items-center justify-center shrink-0">
                {getInitials(currentUser.name)}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-base text-[#3B2014] truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs font-semibold text-[#C85A17] mt-0.5">
                  {currentUser.role}
                </p>
                <p className="text-xs text-[#75452E]/75 truncate mt-0.5">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <dl className="space-y-2.5 text-sm border-b border-[#75452E]/10 pb-4">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#75452E]/75">Nomor WhatsApp</dt>
                <dd className="font-semibold text-[#3B2014] tabular-nums">
                  {currentUser.whatsapp}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#75452E]/75">Total Pesanan Tercatat</dt>
                <dd className="font-semibold text-[#3B2014] tabular-nums">
                  {orderCount} Pesanan
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-[#75452E]/75">Pengisian Checkout Otomatis</dt>
                <dd className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span>Aktif</span>
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-2.5">
              {currentUser.role === 'Penjual UMKM' && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDashboard();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F28C45] text-[#3B2014] font-bold text-sm hover:bg-[#e57e36] transition-colors cursor-pointer"
                >
                  <Store className="w-4 h-4" aria-hidden="true" />
                  <span>Buka Dashboard Penjual</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#75452E]/20 text-[#75452E] font-semibold text-sm hover:bg-[#FFF9F2] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FFF9F2] rounded-xl border border-[#75452E]/10">
              <button
                type="button"
                onClick={() => {
                  setMode('masuk');
                  setError('');
                }}
                className={`py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  mode === 'masuk'
                    ? 'bg-white text-[#3B2014] shadow-sm'
                    : 'text-[#75452E]/75 hover:text-[#3B2014]'
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('daftar');
                  setError('');
                }}
                className={`py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  mode === 'daftar'
                    ? 'bg-white text-[#3B2014] shadow-sm'
                    : 'text-[#75452E]/75 hover:text-[#3B2014]'
                }`}
              >
                Daftar Akun
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'daftar' && (
                <div>
                  <label
                    htmlFor="auth-nama"
                    className="block text-xs font-semibold text-[#3B2014] mb-1"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id="auth-nama"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Siti Rahma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#75452E]/20 text-sm text-[#3B2014] focus:border-[#F28C45] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-email"
                  className="block text-xs font-semibold text-[#3B2014] mb-1"
                >
                  Email
                </label>
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#75452E]/20 text-sm text-[#3B2014] focus:border-[#F28C45] focus:outline-none"
                />
              </div>

              {mode === 'daftar' && (
                <div>
                  <label
                    htmlFor="auth-wa"
                    className="block text-xs font-semibold text-[#3B2014] mb-1"
                  >
                    Nomor WhatsApp
                  </label>
                  <input
                    id="auth-wa"
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="0812-3456-7890"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#75452E]/20 text-sm text-[#3B2014] focus:border-[#F28C45] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-password"
                  className="block text-xs font-semibold text-[#3B2014] mb-1"
                >
                  Kata Sandi
                </label>
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#75452E]/20 text-sm text-[#3B2014] focus:border-[#F28C45] focus:outline-none"
                />
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#3B2014] mb-1.5">
                  Peran Akun
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {(['Pembeli', 'Penjual UMKM'] as UserRole[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRole(option)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                        role === option
                          ? 'bg-[#FFF1DF] border-[#F28C45] text-[#3B2014]'
                          : 'bg-white border-[#75452E]/15 text-[#75452E]'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-xs font-medium text-red-700">{error}</p>}

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F28C45] text-[#3B2014] font-bold text-sm hover:bg-[#e57e36] transition-colors cursor-pointer min-h-[44px]"
              >
                <LogIn className="w-4 h-4" aria-hidden="true" />
                <span>{mode === 'masuk' ? 'Masuk Sekarang' : 'Buat Akun'}</span>
              </button>
            </form>

            <div className="pt-4 border-t border-[#75452E]/10 space-y-2">
              <p className="text-xs font-medium text-[#75452E]/75 text-center">
                Atau coba langsung dengan akun demo:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('Pembeli')}
                  className="py-2 px-3 rounded-xl border border-[#75452E]/20 bg-[#FFF9F2] text-xs font-semibold text-[#75452E] hover:bg-[#FFF1DF] transition-colors cursor-pointer"
                >
                  Demo Pembeli
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('Penjual UMKM')}
                  className="py-2 px-3 rounded-xl border border-[#75452E]/20 bg-[#FFF9F2] text-xs font-semibold text-[#75452E] hover:bg-[#FFF1DF] transition-colors cursor-pointer"
                >
                  Demo Penjual
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
