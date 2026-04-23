import React from "react";
import { Link } from "wouter";

interface DriverCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  active?: boolean;
}

export default function DriverCard({ icon, title, description, active = false }: DriverCardProps) {
  return (
    <div className={`
      relative p-6 rounded-xl border transition-all duration-200 group
      hover:-translate-y-[3px] hover:shadow-md cursor-pointer bg-white
      ${active ? 'border-blue-200 shadow-sm' : 'border-border'}
    `}>
      <div className={`
        w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors
        ${active ? 'bg-primary text-white' : 'bg-secondary text-[#6b8fd4] group-hover:bg-primary group-hover:text-white'}
      `}>
        {icon}
      </div>
      
      <h3 className={`font-heading font-bold text-lg mb-2 transition-colors ${active ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
        {description}
      </p>
      
      <div className="mt-auto pt-4 border-t border-border">
        <Link href="/drivers" className="block">
          <span className={`text-[11px] font-bold tracking-widest uppercase transition-colors ${active ? 'text-primary' : 'text-[#9a9a8e] group-hover:text-primary'}`}>
            TECHNICAL SPECS ›
          </span>
        </Link>
      </div>
    </div>
  );
}
