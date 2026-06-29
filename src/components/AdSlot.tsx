interface AdSlotProps {
  slot: string;
  size?: '728x90' | '320x50' | '300x250' | 'responsive';
  className?: string;
}

export function AdSlot({ slot, size = 'responsive', className = '' }: AdSlotProps) {
  const sizeClasses: Record<string, string> = {
    '728x90': 'hidden md:flex h-[90px] w-[728px]',
    '320x50': 'flex md:hidden h-[50px] w-[320px]',
    '300x250': 'h-[250px] w-[300px]',
    responsive: 'h-[90px] w-full max-w-[728px] md:h-[90px]',
  };

  return (
    <div
      id={`ad-slot-${slot}`}
      className={`mx-auto flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 text-xs text-gray-400 transition-colors dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500 ${sizeClasses[size] ?? sizeClasses.responsive} ${className}`}
      data-ad-slot={slot}
    >
      <span className="select-none">Ad Space &middot; {slot}</span>
    </div>
  );
}
