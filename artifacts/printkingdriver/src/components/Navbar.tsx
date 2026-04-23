import { Link, useLocation } from "wouter";
import { Search, Menu, Printer, ChevronDown, X } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useMemo, useRef, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { driverPages, mainNav } from "@/lib/siteConfig";

const driverColumns: {
  heading: string;
  items: { label: string; slug: string; desc: string }[];
}[] = [
  {
    heading: "Essential Drivers",
    items: [
      { label: "Chipset Driver", slug: "chipset", desc: "Motherboard logic & CPU sync" },
      { label: "Graphics Driver", slug: "graphics", desc: "Visual rendering & GPU" },
      { label: "Audio Driver", slug: "audio", desc: "Sound input/output" },
      { label: "Network Driver", slug: "network", desc: "Wired & wireless networking" },
    ],
  },
  {
    heading: "Hardware-Specific",
    items: [
      { label: "Storage Controller", slug: "storage", desc: "SSDs & hard drives" },
      { label: "USB Support", slug: "usb", desc: "Port & device recognition" },
      { label: "Bluetooth Driver", slug: "bluetooth", desc: "Wireless peripheral pairing" },
      { label: "Input Drivers", slug: "input", desc: "Touchpad & keyboard" },
    ],
  },
  {
    heading: "Peripheral Drivers",
    items: [
      { label: "Printer Driver", slug: "printer", desc: "Document to print commands" },
      { label: "Scanner Support", slug: "scanner", desc: "Image capture & OCR" },
      { label: "Webcam Driver", slug: "webcam", desc: "Video stream capture" },
    ],
  },
  {
    heading: "Advanced Systems",
    items: [
      { label: "BIOS / UEFI", slug: "bios", desc: "Pre-boot initialisation" },
      { label: "Security Drivers", slug: "security", desc: "Encryption & secure boot" },
      { label: "Monitor Driver", slug: "monitor", desc: "Colour & refresh control" },
    ],
  },
];

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMatchIdx, setActiveMatchIdx] = useState(0);

  const searchIndex = useMemo(
    () => [
      ...driverPages.map((d) => ({ label: d.label, href: d.href, type: "Driver" })),
      ...mainNav.map((n) => ({ label: n.label, href: n.href, type: "Page" })),
    ],
    []
  );

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .filter((it) => it.label.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, searchIndex]);

  useEffect(() => {
    setActiveMatchIdx(0);
  }, [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!searchRef.current) return;
      if (!searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const goTo = (href: string) => {
    setQuery("");
    setSearchOpen(false);
    navigate(href);
  };

  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveMatchIdx((i) => Math.min(matches.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveMatchIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (matches[activeMatchIdx]) goTo(matches[activeMatchIdx].href);
      else if (query.trim()) goTo("/drivers");
    } else if (e.key === "Escape") {
      setSearchOpen(false);
    }
  };

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const scheduleCloseMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!megaRef.current) return;
      if (!megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isExploreActive = location === "/drivers" || location.startsWith("/drivers/");

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-primary w-9 h-9 rounded-lg flex items-center justify-center text-white">
            <Printer size={20} />
          </div>
          <div>
            <div className="font-heading font-bold text-foreground text-lg leading-tight">PrintKingDriver</div>
            <div className="text-[10px] text-muted-foreground tracking-widest uppercase leading-tight font-medium">System Guide Portal</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-8">
          <div className="relative w-full" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={onSearchKey}
              placeholder="Search drivers, pages, hardware..."
              className="w-full h-10 pl-9 pr-9 rounded-full bg-transparent border border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/15 text-sm outline-none"
              data-testid="input-search"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setSearchOpen(false); }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {searchOpen && query && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-50">
                {matches.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <div className="text-sm text-muted-foreground mb-2">No direct matches.</div>
                    <button
                      onClick={() => goTo("/drivers")}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Browse all drivers →
                    </button>
                  </div>
                ) : (
                  <ul className="py-1.5">
                    {matches.map((m, i) => (
                      <li key={m.href}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveMatchIdx(i)}
                          onClick={() => goTo(m.href)}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                            i === activeMatchIdx ? "bg-secondary" : "hover:bg-secondary/60"
                          }`}
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium text-foreground truncate">{m.label}</span>
                          </span>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex-shrink-0">{m.type}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-6">
            <Link href="/">
              <span className={`text-sm font-medium transition-colors hover:text-primary ${location === "/" ? "text-primary" : "text-foreground"}`}>
                Home
              </span>
            </Link>

            {/* Mega dropdown trigger */}
            <div
              ref={megaRef}
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={scheduleCloseMega}
            >
              <button
                type="button"
                onClick={() => setMegaOpen((v) => !v)}
                aria-haspopup="true"
                aria-expanded={megaOpen}
                className={`inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  isExploreActive ? "text-primary" : "text-foreground"
                }`}
              >
                Explore Drivers
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
              </button>

              {megaOpen && (
                <div
                  onMouseEnter={openMega}
                  onMouseLeave={scheduleCloseMega}
                  className="fixed left-1/2 top-16 -translate-x-1/2 w-[min(1100px,calc(100vw-2rem))] z-50"
                >
                  <div className="mt-2 bg-white border border-border rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-6 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {driverColumns.map((col) => (
                        <div key={col.heading}>
                          <div className="text-[11px] uppercase tracking-wider font-semibold text-blue-700 mb-3">
                            {col.heading}
                          </div>
                          <ul className="space-y-1">
                            {col.items.map((it) => (
                              <li key={it.slug}>
                                <Link
                                  href={`/drivers/${it.slug}`}
                                  onClick={() => setMegaOpen(false)}
                                  className="block rounded-lg px-3 py-2 -mx-3 hover:bg-[#f4f6fb] transition-colors group"
                                >
                                  <div className="text-[13px] font-semibold text-[#111110] group-hover:text-primary transition-colors">
                                    {it.label}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground leading-snug">
                                    {it.desc}
                                  </div>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        Browse the full reference for each driver type.
                      </p>
                      <Link
                        href="/drivers"
                        onClick={() => setMegaOpen(false)}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View all drivers →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/how-it-works">
              <span className={`text-sm font-medium transition-colors hover:text-primary ${location === "/how-it-works" ? "text-primary" : "text-foreground"}`}>
                How It Works
              </span>
            </Link>
            <Link href="/about">
              <span className={`text-sm font-medium transition-colors hover:text-primary ${location === "/about" ? "text-primary" : "text-foreground"}`}>
                About Guide
              </span>
            </Link>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 font-semibold" size="sm">
            <Link href="/contact">⚡ Get In Touch</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
            <div className="flex flex-col gap-2 mt-8">
              <Link href="/" onClick={() => setOpen(false)}>
                <span className={`block py-2 text-lg font-medium transition-colors hover:text-primary ${location === "/" ? "text-primary" : "text-foreground"}`}>
                  Home
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileExploreOpen((v) => !v)}
                className={`flex w-full items-center justify-between py-2 text-lg font-medium transition-colors hover:text-primary ${
                  isExploreActive ? "text-primary" : "text-foreground"
                }`}
                aria-expanded={mobileExploreOpen}
              >
                Explore Drivers
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileExploreOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileExploreOpen && (
                <div className="ml-2 pl-3 border-l border-border space-y-4 pb-3">
                  {driverColumns.map((col) => (
                    <div key={col.heading}>
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-blue-700 mb-1.5">
                        {col.heading}
                      </div>
                      <ul className="space-y-1">
                        {col.items.map((it) => (
                          <li key={it.slug}>
                            <Link
                              href={`/drivers/${it.slug}`}
                              onClick={() => {
                                setOpen(false);
                                setMobileExploreOpen(false);
                              }}
                              className="block py-1 text-sm text-foreground hover:text-primary transition-colors"
                            >
                              {it.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <Link
                    href="/drivers"
                    onClick={() => {
                      setOpen(false);
                      setMobileExploreOpen(false);
                    }}
                    className="inline-block text-xs font-semibold text-primary hover:underline pt-1"
                  >
                    View all drivers →
                  </Link>
                </div>
              )}

              <Link href="/how-it-works" onClick={() => setOpen(false)}>
                <span className={`block py-2 text-lg font-medium transition-colors hover:text-primary ${location === "/how-it-works" ? "text-primary" : "text-foreground"}`}>
                  How It Works
                </span>
              </Link>
              <Link href="/about" onClick={() => setOpen(false)}>
                <span className={`block py-2 text-lg font-medium transition-colors hover:text-primary ${location === "/about" ? "text-primary" : "text-foreground"}`}>
                  About Guide
                </span>
              </Link>

              <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full font-semibold w-full mt-4" size="lg">
                <Link href="/contact" onClick={() => setOpen(false)}>⚡ Get In Touch</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
