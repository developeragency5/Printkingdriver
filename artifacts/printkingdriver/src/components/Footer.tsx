import { Link } from "wouter";
import { Printer } from "lucide-react";
import {
  site,
  mainNav,
  driverPages,
  supportLinks,
  legalLinks,
  type SiteLink,
} from "@/lib/siteConfig";

const columns: { heading: string; links: SiteLink[] }[] = [
  { heading: "Core Drivers", links: driverPages },
  { heading: "Quick Links", links: mainNav },
  { heading: "System Support", links: supportLinks },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1c1c1a] text-[#a3a39a] py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0">
                <Printer size={18} />
              </div>
              <div className="font-heading font-bold text-white text-lg">{site.name}</div>
            </Link>
            <p className="text-sm leading-relaxed">{site.tagline}</p>
          </div>

          {/* Dynamic columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-white font-semibold mb-4">{col.heading}</h4>
              <ul className="space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={`${col.heading}-${link.href}-${link.label}`}>
                    <Link href={link.href} className="hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#2a2a28] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
          <p>© {year} {site.domain}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
