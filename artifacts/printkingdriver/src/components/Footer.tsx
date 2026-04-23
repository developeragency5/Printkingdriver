import { Link } from "wouter";
import { Printer } from "lucide-react";

const sections = [
  {
    title: "Driver Basics",
    links: [
      { label: "What Is a Driver?", href: "/drivers" },
      { label: "How Drivers Work", href: "/" },
      { label: "Common Driver Issues", href: "/how-it-works" },
      { label: "Driver Categories", href: "/" },
    ],
  },
  {
    title: "System Components",
    links: [
      { label: "Chipset & CPU", href: "/drivers" },
      { label: "Graphics & Display", href: "/drivers" },
      { label: "Audio Subsystem", href: "/drivers" },
      { label: "Network Interfaces", href: "/drivers" },
    ],
  },
  {
    title: "Hardware Compatibility",
    links: [
      { label: "Operating System Support", href: "/drivers" },
      { label: "Peripheral Devices", href: "/drivers" },
      { label: "Storage & USB", href: "/drivers" },
      { label: "Printer Standards", href: "/drivers" },
    ],
  },
  {
    title: "Security & Firmware",
    links: [
      { label: "BIOS / UEFI Overview", href: "/drivers" },
      { label: "Secure Boot Concepts", href: "/drivers" },
      { label: "Encryption Drivers", href: "/drivers" },
      { label: "Firmware Updates", href: "/drivers" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1c1c1a] text-[#a3a39a] py-14 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-10">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0">
                <Printer size={18} />
              </div>
              <div className="font-heading font-bold text-white text-lg">PrintKingDriver</div>
            </Link>
            <p className="text-sm leading-relaxed">A neutral, educational reference on system and device drivers — how they function and why they matter.</p>
          </div>

          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="text-white font-semibold mb-4 text-sm">{s.title}</h4>
              <ul className="space-y-2 text-sm">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}>
                      <span className="hover:text-white transition-colors cursor-pointer">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#2a2a28] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#7a7a72]">
          <p>© 2025 PrintKingDriver.com — Documentation & Reference Portal.</p>
          <p>An informational resource. Always obtain driver files directly from your hardware manufacturer.</p>
        </div>
      </div>
    </footer>
  );
}
