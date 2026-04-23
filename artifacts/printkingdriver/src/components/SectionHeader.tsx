interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  const match = title.match(/^Section\s+(\d+)\s*[—-]\s*(.+)$/i);
  const number = match?.[1];
  const cleanTitle = match?.[2] ?? title;

  return (
    <div className="mb-8 flex items-end justify-between gap-6 flex-wrap">
      <div className="flex items-start gap-4">
        {number && (
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-heading font-bold text-primary text-sm tracking-tight">
            {number.padStart(2, "0")}
          </div>
        )}
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/80 mb-1.5">
            Section {number ?? ""}
          </div>
          <h3 className="font-heading font-bold text-foreground text-[1.5rem] md:text-[1.7rem] tracking-[-0.02em] leading-tight">
            {cleanTitle}
          </h3>
          <p className="font-sans text-sm text-muted-foreground mt-1.5 max-w-xl">{subtitle}</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70 font-semibold">
        <span className="w-8 h-px bg-border" />
        <span>Reference Set</span>
      </div>
    </div>
  );
}
