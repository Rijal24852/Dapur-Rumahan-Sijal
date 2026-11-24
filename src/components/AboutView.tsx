import { ArrowRight, HeartHandshake, ShoppingBag, Store } from 'lucide-react';

interface AboutViewProps {
  onExploreMenu: () => void;
  onOpenDashboard: () => void;
}

export function AboutView({ onExploreMenu, onOpenDashboard }: AboutViewProps) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-12">
      <div className="bg-[#FFF1DF]/70 rounded-2xl p-6 sm:p-10 border border-[#75452E]/10 space-y-4">
        <p className="text-sm font-semibold text-[#C85A17]">
          Tentang DapurKu · Rasa Rumahan, Mudah Dipesan
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#3B2014] max-w-3xl text-balance leading-tight">
          Menghubungkan Dapur UMKM Kuliner dengan Pelanggan Sekitar Secara Digital
        </h1>
        <p className="text-base sm:text-lg text-[#75452E]/90 max-w-3xl leading-relaxed">
          DapurKu hadir sebagai jembatan digital bagi pelaku usaha makanan rumahan
          agar masakan berkualitas buatan keluarga lebih mudah ditemukan, dipesan,
          dan dinikmati oleh masyarakat tanpa proses yang rumit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#75452E]/12 shadow-sm space-y-4">
          <div className="w-11 h-11 rounded-xl bg-[#FFF1DF] text-[#C85A17] flex items-center justify-center">
            <Store className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#3B2014]">
            Manfaat bagi Pelaku UMKM
          </h2>
          <ul className="space-y-3 text-sm sm:text-base text-[#75452E]/90 leading-relaxed">
            <li>
              <strong className="text-[#3B2014]">Etalase Digital Profesional:</strong>{' '}
              Menampilkan foto makanan, harga, deskripsi, dan profil dapur usaha secara rapi.
            </li>
            <li>
              <strong className="text-[#3B2014]">Kontrol Harga &amp; Stok Mandiri:</strong>{' '}
              Penjual dapat memperbarui harga dan ketersediaan porsi kapan saja melalui Dashboard Penjual.
            </li>
            <li>
              <strong className="text-[#3B2014]">Pencatatan Pesanan Terpusat:</strong>{' '}
              Pesanan yang masuk langsung tercatat lengkap dengan alamat dan catatan pembeli.
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#75452E]/12 shadow-sm space-y-4">
          <div className="w-11 h-11 rounded-xl bg-[#FFF1DF] text-[#C85A17] flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#3B2014]">
            Manfaat bagi Pelanggan
          </h2>
          <ul className="space-y-3 text-sm sm:text-base text-[#75452E]/90 leading-relaxed">
            <li>
              <strong className="text-[#3B2014]">Rasa Rumahan yang Terjamin:</strong>{' '}
              Hidangan dimasak segar harian dengan bahan pilihan oleh dapur lokal terpercaya.
            </li>
            <li>
              <strong className="text-[#3B2014]">Pencarian &amp; Kategori Cepat:</strong>{' '}
              Mudah mencari makanan berdasarkan nama menu, penjual, kategori, atau harga termurah.
            </li>
            <li>
              <strong className="text-[#3B2014]">Transparan &amp; Praktis:</strong>{' '}
              Dilengkapi ulasan pembeli, rincian keranjang otomatis, serta formulir checkout singkat.
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-[#75452E] text-white rounded-2xl p-6 sm:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-[#FFF1DF] text-sm font-semibold">
            <HeartHandshake className="w-4 h-4 text-[#F28C45]" aria-hidden="true" />
            <span>Dukung Kuliner Lokal Bersama DapurKu</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">
            Siap Mencicipi Masakan Rumahan atau Mengelola Toko Anda?
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onExploreMenu}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F28C45] text-[#3B2014] font-bold text-sm hover:bg-[#e57e36] transition-colors cursor-pointer"
          >
            <span>Lihat Daftar Menu</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onOpenDashboard}
            className="px-5 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors cursor-pointer"
          >
            Buka Dashboard Penjual
          </button>
        </div>
      </div>
    </section>
  );
}
