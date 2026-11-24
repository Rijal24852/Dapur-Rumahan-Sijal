import { useEffect, useState } from 'react';
import { Copy, ExternalLink, MessageCircle, Store, X } from 'lucide-react';
import { Seller } from '../types/marketplace';
import { FoodImage } from './FoodImage';

interface WhatsAppContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellers: Seller[];
  initialSellerId?: string | null;
  onNotify: (message: string) => void;
}

function toWaMeNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `62${digits.slice(1)}`;
  }
  if (digits.startsWith('62')) {
    return digits;
  }
  return `62${digits}`;
}

export function WhatsAppContactModal({
  isOpen,
  onClose,
  sellers,
  initialSellerId,
  onNotify,
}: WhatsAppContactModalProps) {
  const [selectedId, setSelectedId] = useState<string>(
    initialSellerId || sellers[0]?.id || ''
  );
  const [messageText, setMessageText] = useState('');

  const selectedSeller =
    sellers.find((s) => s.id === selectedId) ?? sellers[0];

  useEffect(() => {
    if (isOpen) {
      const targetId = initialSellerId || sellers[0]?.id || '';
      setSelectedId(targetId);
      const targetSeller = sellers.find((s) => s.id === targetId) ?? sellers[0];
      if (targetSeller) {
        setMessageText(
          `Halo ${targetSeller.name}, saya melihat menu di DapurKu dan ingin menanyakan ketersediaan pesanan hari ini.`
        );
      }
    }
  }, [isOpen, initialSellerId, sellers]);

  if (!isOpen || !selectedSeller) {
    return null;
  }

  const handleSelectSeller = (seller: Seller) => {
    setSelectedId(seller.id);
    setMessageText(
      `Halo ${seller.name}, saya melihat menu di DapurKu dan ingin menanyakan ketersediaan pesanan hari ini.`
    );
  };

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(selectedSeller.whatsapp);
      onNotify(`Nomor WhatsApp ${selectedSeller.name} berhasil disalin.`);
    } catch {
      onNotify(`Nomor WhatsApp ${selectedSeller.name}: ${selectedSeller.whatsapp}`);
    }
  };

  const waLink = `https://wa.me/${toWaMeNumber(
    selectedSeller.whatsapp
  )}?text=${encodeURIComponent(messageText)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="judul-wa-penjual"
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-[#75452E]/15"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 sm:px-6 py-4 border-b border-[#75452E]/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="judul-wa-penjual"
                className="font-display text-lg sm:text-xl font-bold text-[#3B2014]"
              >
                Hubungi Penjual via WhatsApp
              </h2>
              <p className="text-xs text-[#75452E]/75">
                Pilih dapur UMKM untuk bertanya stok, porsi acara, atau catatan khusus.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela WhatsApp"
            className="w-10 h-10 rounded-lg border border-[#75452E]/15 flex items-center justify-center text-[#75452E] hover:bg-[#FFF1DF] transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6">
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-[#75452E]">
              Pilih Penjual UMKM ({sellers.length} Dapur)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {sellers.map((seller) => {
                const isActive = seller.id === selectedSeller.id;
                return (
                  <button
                    key={seller.id}
                    type="button"
                    onClick={() => handleSelectSeller(seller)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#FFF1DF] border-[#F28C45] shadow-sm'
                        : 'bg-white border-[#75452E]/12 hover:bg-[#FFF9F2]'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#FFF1DF] shrink-0">
                      <FoodImage
                        src={seller.avatarImage}
                        alt={seller.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#3B2014] truncate">
                        {seller.name}
                      </p>
                      <p className="text-xs text-[#75452E]/75 truncate tabular-nums">
                        {seller.whatsapp}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-[#FFF9F2] rounded-2xl p-4 sm:p-5 border border-[#75452E]/12 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-[#3B2014]">
                <Store className="w-4 h-4 text-[#C85A17]" aria-hidden="true" />
                <span className="font-bold">{selectedSeller.name}</span>
                <span className="text-[#75452E]/75">· {selectedSeller.ownerName}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyNumber}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#75452E]/20 bg-white text-xs font-semibold text-[#75452E] hover:bg-[#FFF1DF] transition-colors cursor-pointer tabular-nums"
              >
                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Salin {selectedSeller.whatsapp}</span>
              </button>
            </div>

            <div>
              <label
                htmlFor="wa-pesan-pembeli"
                className="block text-xs font-semibold text-[#75452E] mb-1.5"
              >
                Pesan ke Penjual
              </label>
              <textarea
                id="wa-pesan-pembeli"
                rows={3}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#75452E]/20 bg-white text-sm text-[#3B2014] focus:border-[#F28C45] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-[#75452E]/75">
                Jam layanan: {selectedSeller.operatingHours}
              </p>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  onNotify(`Membuka chat WhatsApp dengan ${selectedSeller.name}.`)
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Kirim via WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
