import { useRef, useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Cpu, Monitor, Volume2, Wifi, HardDrive, Usb, Bluetooth, MousePointer2, Printer, Scan, Webcam, Microchip, Shield, MonitorSpeaker, AlertCircle, RefreshCw, FileQuestion, XOctagon, VolumeX, WifiOff, Layers, Server, ArrowRight, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import DriverGrid from "@/components/DriverGrid";
import { Link } from "wouter";

type ExploreCategory = {
  tag: string;
  icon: React.ReactNode;
  bg: string;
  title: string;
  desc: string;
  items: { icon: React.ReactNode; name: string; note: string }[];
};

function ExploreSlider({ categories }: { categories: ExploreCategory[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  const scrollToIdx = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[idx] as HTMLElement | undefined;
    if (card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    let nearest = 0;
    let min = Infinity;
    children.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - el.offsetLeft - el.scrollLeft);
      if (d < min) { min = d; nearest = i; }
    });
    setActiveIdx(nearest);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });

    const checkOverflow = () => {
      setCanScroll(el.scrollWidth - el.clientWidth > 4);
    };
    checkOverflow();
    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);
    window.addEventListener("resize", checkOverflow);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      ro.disconnect();
      window.removeEventListener("resize", checkOverflow);
    };
  }, []);

  const prev = () => scrollToIdx(Math.max(0, activeIdx - 1));
  const next = () => scrollToIdx(Math.min(categories.length - 1, activeIdx + 1));

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        {categories.map((c, idx) => (
          <article
            key={c.title}
            className="group relative snap-start flex-shrink-0 w-[85%] sm:w-[48%] lg:w-[31%] xl:w-[23.5%] rounded-2xl border border-border/70 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_22px_45px_-22px_rgba(74,107,117,0.32)] hover:-translate-y-0.5 hover:border-primary/25 transition-all duration-300 flex flex-col overflow-hidden"
          >
            {/* subtle hover glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "radial-gradient(closest-side, rgba(190,215,220,0.45), transparent 70%)" }}
            />

            {/* Header: numbered chip + eyebrow */}
            <div className="relative z-10 flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 font-heading font-bold text-primary text-[11px] tracking-tight">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground/80">
                  {c.tag}
                </span>
              </div>
              <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center ring-1 ring-black/5`}>
                {c.icon}
              </div>
            </div>

            <h3 className="relative z-10 font-heading font-bold text-[1.15rem] text-foreground tracking-[-0.015em] leading-snug mb-2">
              {c.title}
            </h3>
            <p className="relative z-10 text-[13px] text-muted-foreground leading-relaxed mb-5">
              {c.desc}
            </p>

            {/* Item count label */}
            <div className="relative z-10 flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
              <span>Includes</span>
              <span className="flex-1 h-px bg-border" />
              <span>{c.items.length} drivers</span>
            </div>

            <ul className="relative z-10 space-y-3 mt-auto">
              {c.items.map((it) => (
                <li key={it.name} className="flex gap-3 items-start">
                  <div className={`w-7 h-7 ${c.bg} rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-black/5`}>
                    {it.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12.5px] font-semibold text-foreground tracking-[-0.005em]">{it.name}</div>
                    <div className="text-[11px] text-muted-foreground leading-snug mt-0.5">{it.note}</div>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {canScroll && (
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-1.5">
            {categories.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === activeIdx ? "w-6 bg-primary" : "w-1.5 bg-border"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={activeIdx === 0}
              aria-label="Previous"
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              disabled={activeIdx === categories.length - 1}
              aria-label="Next"
              className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const exploreCategories = [
  {
    tag: "Category 01",
    icon: <Cpu className="w-5 h-5 text-blue-600" />,
    bg: "bg-blue-50",
    title: "Essential Drivers",
    desc: "Core system drivers required for basic operation. They allow the OS to recognise and use the most fundamental components of a computer.",
    items: [
      { icon: <Cpu className="w-3.5 h-3.5 text-blue-600" />, name: "Chipset Driver", note: "Coordinates motherboard logic and CPU communication." },
      { icon: <Monitor className="w-3.5 h-3.5 text-blue-600" />, name: "Graphics Driver", note: "Handles visual rendering and GPU instructions." },
      { icon: <Volume2 className="w-3.5 h-3.5 text-blue-600" />, name: "Audio Driver", note: "Manages sound input and output processing." },
      { icon: <Wifi className="w-3.5 h-3.5 text-blue-600" />, name: "Network Driver", note: "Enables wired and wireless network connectivity." },
    ],
  },
  {
    tag: "Category 02",
    icon: <HardDrive className="w-5 h-5 text-orange-600" />,
    bg: "bg-orange-50",
    title: "Hardware-Specific Drivers",
    desc: "Drivers that control specialised internal hardware. They enable the OS to fully use each component's features and performance.",
    items: [
      { icon: <HardDrive className="w-3.5 h-3.5 text-orange-600" />, name: "Storage Controller", note: "Manages data transfer with SSDs and hard drives." },
      { icon: <Usb className="w-3.5 h-3.5 text-orange-600" />, name: "USB Driver", note: "Detects ports and connected USB devices." },
      { icon: <Bluetooth className="w-3.5 h-3.5 text-orange-600" />, name: "Bluetooth Driver", note: "Pairs and manages nearby wireless devices." },
      { icon: <MousePointer2 className="w-3.5 h-3.5 text-orange-600" />, name: "Touchpad / Keyboard", note: "Translates input gestures and keystrokes." },
    ],
  },
  {
    tag: "Category 03",
    icon: <Printer className="w-5 h-5 text-teal-600" />,
    bg: "bg-teal-50",
    title: "Peripheral Drivers",
    desc: "Drivers for external devices that connect to a computer. They define how peripherals exchange data with the host system.",
    items: [
      { icon: <Printer className="w-3.5 h-3.5 text-teal-600" />, name: "Printer Driver", note: "Translates documents into printer commands." },
      { icon: <Scan className="w-3.5 h-3.5 text-teal-600" />, name: "Scanner Driver", note: "Captures images and handles OCR exchange." },
      { icon: <Webcam className="w-3.5 h-3.5 text-teal-600" />, name: "Webcam Driver", note: "Processes video stream capture and resolution." },
      { icon: <MonitorSpeaker className="w-3.5 h-3.5 text-teal-600" />, name: "Display Driver", note: "Controls external monitor signal output." },
    ],
  },
  {
    tag: "Category 04",
    icon: <Microchip className="w-5 h-5 text-purple-600" />,
    bg: "bg-purple-50",
    title: "Advanced Systems",
    desc: "Low-level firmware and security drivers that operate close to the hardware and influence overall platform integrity.",
    items: [
      { icon: <Microchip className="w-3.5 h-3.5 text-purple-600" />, name: "BIOS / UEFI", note: "Initialises hardware before the OS loads." },
      { icon: <Shield className="w-3.5 h-3.5 text-purple-600" />, name: "Security Driver", note: "Supports encryption and secure boot." },
      { icon: <MonitorSpeaker className="w-3.5 h-3.5 text-purple-600" />, name: "Monitor Calibration", note: "Manages colour accuracy and profiles." },
      { icon: <RefreshCw className="w-3.5 h-3.5 text-purple-600" />, name: "Power Management", note: "Coordinates CPU and battery efficiency." },
    ],
  },
];

const driverRoleRows = [
  { type: "Graphics Driver", fn: "Translates rendering commands into GPU instructions.", use: "Display visuals, video playback, gaming." },
  { type: "Audio Driver", fn: "Manages sound signal processing between OS and audio chip.", use: "Music playback, voice calls, system sound." },
  { type: "Network Driver", fn: "Handles data packet exchange over wired or wireless links.", use: "Internet access, file sharing, streaming." },
  { type: "Storage Controller", fn: "Coordinates read and write operations to internal storage.", use: "Booting the OS, saving files, data caching." },
  { type: "USB Driver", fn: "Detects and routes data for connected USB devices.", use: "Flash drives, keyboards, mice, peripherals." },
  { type: "Printer Driver", fn: "Converts digital documents into printer-readable commands.", use: "Office printing, design output, scanning." },
  { type: "BIOS / UEFI", fn: "Initialises hardware components before the OS loads.", use: "System boot sequence and firmware updates." },
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-[100px] pb-[90px] px-4 relative overflow-hidden bg-[#F1EEDC]">
        {/* Decorative grid backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 30%, #000 35%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 30%, #000 35%, transparent 80%)",
          }}
        />
        {/* Soft color glow */}
        <div
          aria-hidden
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] -z-10 rounded-full blur-3xl opacity-60"
          style={{ background: "radial-gradient(closest-side, #BED7DC 0%, transparent 70%)" }}
        />

        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-border/80 shadow-sm text-[12px] font-medium text-[#2a2a26] mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a6b75] animate-pulse" />
            <span className="tracking-wide">Printer Driver Information Guide</span>
          </div>

          <h1 className="font-heading font-[800] text-[2.6rem] md:text-[3.6rem] text-[#2a2a26] leading-[1.05] tracking-[-0.035em] mb-7 animate-fade-in-up">
            Understand Printer Drivers.
            <br className="hidden md:block" />
            <span className="text-[#4a6b75]"> A clear, practical </span>
            <span className="italic font-[700] text-[#2a2a26]">guide.</span>
          </h1>

          <p className="text-[1.05rem] md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            PrintKingDriver is an informational portal explaining what printer drivers are,
            how they work, the categories that exist, and how to recognise common issues.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/drivers"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#4a6b75] text-white rounded-full font-semibold hover:bg-[#3b5860] transition-colors shadow-[0_10px_30px_-10px_rgba(74,107,117,0.55)]"
            >
              Explore Drivers →
            </Link>
            <Link
              href="/how-it-works"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#2a2a26] border border-border rounded-full font-semibold hover:border-[#4a6b75]/40 hover:bg-[#F1EEDC] transition-colors"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Driver Categories */}
      <section className="py-20 md:py-28 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#4a6b75] font-semibold mb-3">Reference</div>
            <h2 className="font-heading font-bold text-[2rem] md:text-[2.4rem] text-[#2a2a26] tracking-[-0.025em] mb-4">
              Browse by Driver Type
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Each section groups drivers by purpose — from essential foundations to advanced firmware — so you can find what you need in seconds.
            </p>
          </div>
          
          <DriverGrid 
            title="Section 1 — Essential Drivers"
            subtitle="Core System Foundation for stable operation."
            columns={4}
            cards={[
              { title: "Chipset Driver", description: "CPU & Motherboard Logic Sync", icon: <Cpu strokeWidth={1.5} />, slug: "chipset" },
              { title: "Graphics Driver", description: "Visual Rendering & GPU Protocols", icon: <Monitor strokeWidth={1.5} />, slug: "graphics" },
              { title: "Audio Driver", description: "Sound Input/Output Processing", icon: <Volume2 strokeWidth={1.5} />, slug: "audio" },
              { title: "Network Driver", description: "Wi-Fi 6 & High-Speed LAN Link", icon: <Wifi strokeWidth={1.5} />, slug: "network" },
            ]}
          />
          
          <DriverGrid 
            title="Section 2 — Hardware-Specific"
            subtitle="Internal Component Control for optimization and speed."
            columns={4}
            cards={[
              { title: "Storage Controller", description: "Efficient data transfer for SSDs and HDDs.", icon: <HardDrive strokeWidth={1.5} />, slug: "storage" },
              { title: "USB Support", description: "Port recognition and external device connectivity.", icon: <Usb strokeWidth={1.5} />, slug: "usb" },
              { title: "Bluetooth Drivers", description: "Seamless wireless pairing for peripherals.", icon: <Bluetooth strokeWidth={1.5} />, slug: "bluetooth" },
              { title: "Touchpad/Keyboard", description: "Precision input control and gesture translation.", icon: <MousePointer2 strokeWidth={1.5} />, slug: "input" },
            ]}
          />

          <DriverGrid 
            title="Section 3 — Peripheral Drivers"
            subtitle="External Device Integration for connectivity and capture."
            columns={3}
            cards={[
              { title: "Printer Drivers", description: "Digital to physical document translation.", icon: <Printer strokeWidth={1.5} />, active: true, slug: "printer" },
              { title: "Scanner Support", description: "Image digitizing and OCR protocol management.", icon: <Scan strokeWidth={1.5} />, slug: "scanner" },
              { title: "Webcam Drivers", description: "HD video capture and streaming optimization.", icon: <Webcam strokeWidth={1.5} />, slug: "webcam" },
            ]}
          />

          <DriverGrid 
            title="Section 4 — Advanced Systems"
            subtitle="Low-level Firmware & Security for system integrity."
            columns={3}
            cards={[
              { title: "BIOS/UEFI", description: "Low-level pre-boot hardware initialization.", icon: <Microchip strokeWidth={1.5} />, slug: "bios" },
              { title: "Security Drivers", description: "System encryption and secure boot protection.", icon: <Shield strokeWidth={1.5} />, slug: "security" },
              { title: "Monitor Calibration", description: "Color accuracy and refresh rate optimization.", icon: <MonitorSpeaker strokeWidth={1.5} />, slug: "monitor" },
            ]}
          />
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#4a6b75] font-semibold mb-3">Diagnostics</div>
            <h2 className="font-heading font-bold text-[2rem] md:text-[2.4rem] text-[#2a2a26] tracking-[-0.025em] mb-4">
              Common Driver Issues, Explained
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              From missing drivers to conflict errors — recognise the symptoms and learn what they really mean before reaching for support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {[
              { title: "Printer Offline", desc: "Device not detected by the operating system.", icon: <AlertCircle className="w-5 h-5" />, color: "text-orange-600", dot: "bg-orange-600", ring: "bg-orange-50 ring-orange-100", severity: "Common", code: "ERR-01" },
              { title: "Driver Conflict", desc: "Two drivers clashing and causing errors.", icon: <XOctagon className="w-5 h-5" />, color: "text-red-600", dot: "bg-red-600", ring: "bg-red-50 ring-red-100", severity: "Critical", code: "ERR-02" },
              { title: "Missing Driver", desc: "Required driver not found or corrupted.", icon: <FileQuestion className="w-5 h-5" />, color: "text-blue-600", dot: "bg-blue-600", ring: "bg-blue-50 ring-blue-100", severity: "High", code: "ERR-03" },
              { title: "Print Queue Stuck", desc: "Jobs stuck and not clearing from queue.", icon: <RefreshCw className="w-5 h-5" />, color: "text-purple-600", dot: "bg-purple-600", ring: "bg-purple-50 ring-purple-100", severity: "Common", code: "ERR-04" },
              { title: "Audio Errors", desc: "Sound driver failure or no audio output.", icon: <VolumeX className="w-5 h-5" />, color: "text-pink-600", dot: "bg-pink-600", ring: "bg-pink-50 ring-pink-100", severity: "Moderate", code: "ERR-05" },
              { title: "Network Drops", desc: "Wi-Fi or LAN driver instability issues.", icon: <WifiOff className="w-5 h-5" />, color: "text-teal-600", dot: "bg-teal-600", ring: "bg-teal-50 ring-teal-100", severity: "High", code: "ERR-06" },
            ].map((issue, i) => (
              <div
                key={i}
                className="group relative bg-white border border-border/70 rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_22px_45px_-22px_rgba(74,107,117,0.32)] hover:-translate-y-0.5 hover:border-primary/25 transition-all duration-300 overflow-hidden"
              >
                {/* Top meta row */}
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl ${issue.ring} ring-1 flex items-center justify-center ${issue.color}`}>
                    {issue.icon}
                  </div>
                  <span className="text-[10px] font-mono font-semibold tracking-[0.12em] text-muted-foreground/70 uppercase px-2 py-1 rounded-md bg-secondary/60 border border-border/60">
                    {issue.code}
                  </span>
                </div>

                <h4 className="font-heading font-bold text-[1.1rem] text-[#2a2a26] mb-2 tracking-[-0.015em]">{issue.title}</h4>
                <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-5">{issue.desc}</p>

                {/* Footer divider with severity */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${issue.dot}`} />
                    <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{issue.severity}</span>
                  </div>
                  <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70 group-hover:text-primary transition-colors">
                    Diagnose →
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#4a6b75] text-white rounded-full font-semibold hover:bg-[#3b5860] transition-colors shadow-[0_10px_30px_-10px_rgba(74,107,117,0.55)]"
            >
              Get Support →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Explore Driver Categories ── */}
      <section className="py-20 px-4 bg-[#E5DDC5]">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-wider text-[#4a6b75] font-semibold mb-2">Explore</div>
            <h2 className="font-heading font-bold text-3xl text-[#2a2a26] mb-3">Explore Drivers</h2>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Find and learn about all essential system drivers, organised into clear categories for easy reference.
            </p>
          </div>

          <ExploreSlider categories={exploreCategories} />
        </div>
      </section>

      {/* ── How Drivers Work ── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-wider text-[#4a6b75] font-semibold mb-2">Concept</div>
            <h2 className="font-heading font-bold text-3xl text-[#2a2a26] mb-3">How Drivers Work</h2>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              A driver is the bridge between physical hardware and the software running on the operating system. The diagram below shows the typical flow of communication.
            </p>
          </div>

          <div className="bg-[#f9f9f7] border border-border rounded-2xl p-8 md:p-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
              {[
                { icon: <Cpu className="w-6 h-6 text-blue-700" />, label: "Hardware", sub: "Physical device or component", bg: "bg-blue-50", border: "border-blue-100" },
                { icon: <Layers className="w-6 h-6 text-[#1d4ed8]" />, label: "Driver", sub: "Software translator layer", bg: "bg-[#eff6ff]", border: "border-blue-300", highlight: true },
                { icon: <Server className="w-6 h-6 text-purple-700" />, label: "Operating System", sub: "Manages resources & I/O", bg: "bg-purple-50", border: "border-purple-100" },
                { icon: <Monitor className="w-6 h-6 text-teal-700" />, label: "Application", sub: "User-facing program", bg: "bg-teal-50", border: "border-teal-100" },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex flex-col md:flex-row items-center md:flex-1 gap-5 md:gap-3">
                  <div className={`flex-1 w-full md:w-auto rounded-xl border ${step.border} ${step.bg} px-5 py-5 text-center ${step.highlight ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}>
                    <div className="w-11 h-11 bg-white border border-white shadow-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                      {step.icon}
                    </div>
                    <div className={`font-heading font-bold text-sm ${step.highlight ? "text-[#1d4ed8]" : "text-[#111110]"}`}>{step.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-1 leading-snug">{step.sub}</div>
                  </div>
                  {i < arr.length - 1 && (
                    <>
                      <ArrowRight className="hidden md:block w-5 h-5 text-muted-foreground flex-shrink-0" />
                      <ArrowDown className="md:hidden w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground leading-relaxed">
              When an application makes a request, the operating system routes it to the correct <span className="font-semibold text-[#1d4ed8]">Driver</span>, which translates it into instructions the hardware can execute. The result then travels back up the chain to the user.
            </div>
          </div>
        </div>
      </section>

      {/* ── Types of Drivers and Their Roles ── */}
      <section className="py-20 px-4 bg-[#E5DDC5]">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-wider text-[#4a6b75] font-semibold mb-2">Reference</div>
            <h2 className="font-heading font-bold text-3xl text-[#2a2a26] mb-3">Types of Drivers and Their Roles</h2>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              A summary of common driver types, the function each one performs, and a typical use case in everyday computing.
            </p>
          </div>

          <div className="border border-border rounded-2xl overflow-hidden bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f4f4f0] border-b border-border">
                  <th className="text-left px-5 py-4 font-heading font-bold text-xs text-[#111110] uppercase tracking-wider">Driver Type</th>
                  <th className="text-left px-5 py-4 font-heading font-bold text-xs text-[#111110] uppercase tracking-wider">Function</th>
                  <th className="text-left px-5 py-4 font-heading font-bold text-xs text-[#111110] uppercase tracking-wider hidden md:table-cell">Example Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {driverRoleRows.map((r) => (
                  <tr key={r.type} className="hover:bg-[#f9f9f7] transition-colors">
                    <td className="px-5 py-4 font-semibold text-[#111110] align-top w-44">{r.type}</td>
                    <td className="px-5 py-4 text-muted-foreground align-top">{r.fn}</td>
                    <td className="px-5 py-4 text-muted-foreground align-top hidden md:table-cell">{r.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </Layout>
  );
}
