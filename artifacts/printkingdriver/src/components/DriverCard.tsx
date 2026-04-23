import React from "react";
import { Link } from "wouter";

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
    <div className={`
      relative p-6 rounded-xl border transition-all duration-300 group
      hover:-translate-y-[3px] hover:shadow-[0_18px_40px_-22px_rgba(74,107,117,0.35)] cursor-pointer bg-white
      ${active ? 'border-primary/40 shadow-sm' : 'border-border hover:border-primary/30'}
    `}>
      <div className={`
        w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300
        bg-primary text-white group-hover:bg-[#BED7DC] group-hover:text-[#2a2a26]
      `}>
        {icon}
      </div>

      <h3 className="font-heading font-bold text-lg mb-2 transition-colors text-foreground group-hover:text-primary">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
        {description}
      </p>

      <div className="mt-auto pt-4 border-t border-border">
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase text-muted-foreground hover:text-primary group-hover:text-primary transition-colors hover:underline underline-offset-4"
        >
          TECHNICAL SPECS ›
        </Link>
      </div>
    </div>
  );
}
