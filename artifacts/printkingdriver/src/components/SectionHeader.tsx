interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="border-l-4 border-blue-700 pl-4 mb-6">
      <h3 className="font-heading font-bold text-[#111110] text-[1.4rem] mb-1">{title}</h3>
      <p className="font-sans text-[0.875rem] text-muted-foreground">{subtitle}</p>
    </div>
  );
}
