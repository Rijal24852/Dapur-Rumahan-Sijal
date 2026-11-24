import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#3B2014] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 border border-[#F28C45]/35"
    >
      <CheckCircle2 className="w-5 h-5 text-[#F28C45] shrink-0" aria-hidden="true" />
      <p className="text-sm font-medium leading-snug">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup notifikasi"
        className="p-1 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
