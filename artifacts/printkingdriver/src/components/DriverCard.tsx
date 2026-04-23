import React from "react";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";

interface DriverCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  active?: boolean;
  slug?: string;
}

export default function DriverCard({ icon, title, description, active = false, slug }: DriverCardProps) {
  const href = slug ? `/drivers/${slug}` : "/drivers";
  return (
    <Link
      href={href}
      className={`
        group relative flex flex-col p-6 rounded-2xl border bg-white overflow-hidden
        transition-all duration-300 cursor-pointer
        hover:-translate-y-[3px] hover:shadow-[0_22px_45px_-22px_rgba(74,107,117,0.38)]
        ${active ? 'border-primary/40 shadow-sm' : 'border-border hover:border-primary/30'}
      `}
    >
      {/* subtle decorative gradient on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(closest-side, rgba(190,215,220,0.55), transparent 70%)" }}
      />

      {/* arrow indicator */}
      <div className="absolute top-5 right-5 w-8 h-8 rounded-full border border-border bg-white flex items-center justify-center text-muted-foreground transition-all duration-300 group-hover:bg-primary group-hover:border-primary group-hover:text-white group-hover:rotate-45">
        <ArrowUpRight className="w-4 h-4" />
      </div>

      <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 bg-primary text-white group-hover:bg-[#BED7DC] group-hover:text-[#2a2a26] shadow-[0_6px_18px_-8px_rgba(74,107,117,0.55)] group-hover:shadow-[0_6px_18px_-8px_rgba(190,215,220,0.9)]">
        {icon}
      </div>

      <h3 className="relative z-10 font-heading font-bold text-[1.05rem] mb-2 tracking-[-0.015em] transition-colors text-foreground group-hover:text-primary">
        {title}
      </h3>

      <p className="relative z-10 text-[13px] text-muted-foreground mb-6 leading-relaxed line-clamp-2">
        {description}
      </p>

      <div className="relative z-10 mt-auto pt-4 border-t border-border/70">
        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold tracking-[0.18em] uppercase text-muted-foreground group-hover:text-primary transition-colors">
          Technical Specs
          <span className="transition-transform duration-300 group-hover:translate-x-1">›</span>
        </span>
      </div>
    </Link>
  );
}
