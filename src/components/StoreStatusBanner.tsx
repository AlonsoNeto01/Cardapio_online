interface StoreStatusBannerProps {
  isOpen: boolean;
  message: string;
}

export default function StoreStatusBanner({ isOpen, message }: StoreStatusBannerProps) {
  return (
    <div
      className={`w-full py-2.5 px-4 text-center text-sm font-medium transition-colors ${
        isOpen
          ? 'bg-[var(--primary-light)] text-green-700 dark:text-green-400 border-b border-green-500/15'
          : 'bg-[var(--accent-red-light)] text-[var(--accent-red)] border-b border-[var(--accent-red)]/15'
      }`}
      id="store-status-banner"
    >
      <span className="inline-flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-green-500 animate-pulse' : 'bg-[var(--accent-red)]'}`} />
        {message}
      </span>
    </div>
  );
}
