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
  const code = (slug ?? title).slice(0, 3).toUpperCase();

  return (
    <Link
      href={href}
      className={`
        group relative flex flex-col border bg-white overflow-hidden
        rounded-tl-[36px] rounded-br-[36px] rounded-tr-md rounded-bl-md
        transition-all duration-300 cursor-pointer
        hover:border-primary/30 hover:shadow-[0_18px_40px_-24px_rgba(74,107,117,0.32)]
        ${active ? 'border-primary/40' : 'border-border'}
      `}
    >
      {/* Top thin accent bar (slides in on hover) */}
      <span
        aria-hidden
        className="absolute top-0 left-0 h-[3px] w-0 bg-primary transition-all duration-500 group-hover:w-full"
      />

      <div className="p-6 flex gap-5 items-start">
        {/* Inline icon — small rounded square */}
        <div className="flex-shrink-0 w-10 h-10 rounded-lg border border-border bg-secondary/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors duration-300">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3 mb-1.5">
            <h3 className="font-heading font-bold text-[1rem] tracking-[-0.015em] text-foreground group-hover:text-primary transition-colors leading-snug">
              {title}
            </h3>
            <span className="font-mono text-[10px] tracking-[0.1em] font-bold text-muted-foreground/60 px-1.5 py-0.5 rounded bg-secondary/50 border border-border/60 flex-shrink-0">
              {code}
            </span>
          </div>
          <p className="text-[12.5px] text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Footer strip with hairline + tracked label */}
      <div className="px-6 py-3 mt-auto border-t border-border/60 bg-secondary/20 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Reference Entry
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground group-hover:text-primary transition-colors">
          Read
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}
