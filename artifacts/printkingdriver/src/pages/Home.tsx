import Layout from "@/components/Layout";
import { Link } from "wouter";
import {
  BookOpen, Cpu, HardDrive, Printer, Microchip,
  ArrowRight, ArrowDown, Server, Monitor, Layers,
} from "lucide-react";

const categories = [
  {
    tag: "Category 01",
    icon: <Cpu className="w-5 h-5 text-blue-600" />,
    bg: "bg-blue-50",
    title: "Essential Drivers",
    desc: "Core system drivers that form the foundation of stable computer operation. These drivers enable the operating system to communicate with the most critical internal components.",
    items: [
      { name: "Chipset Driver", note: "Coordinates the motherboard's logic and CPU communication." },
      { name: "Graphics Driver", note: "Handles visual rendering and GPU instruction sets." },
      { name: "Audio Driver", note: "Manages sound input and output processing." },
      { name: "Network Driver", note: "Enables wired and wireless network communication." },
    ],
  },
  {
    tag: "Category 02",
    icon: <HardDrive className="w-5 h-5 text-orange-600" />,
    bg: "bg-orange-50",
    title: "Hardware-Specific Drivers",
    desc: "Specialised drivers that control internal hardware components. They allow the OS to take full advantage of each component's features and performance characteristics.",
    items: [
      { name: "Storage Controller", note: "Manages data transfer for SSDs and hard drives." },
      { name: "USB Support", note: "Enables port detection and external device communication." },
      { name: "Bluetooth Driver", note: "Handles wireless pairing for nearby peripherals." },
      { name: "Touchpad / Keyboard", note: "Translates input gestures and keystrokes to the OS." },
    ],
  },
  {
    tag: "Category 03",
    icon: <Printer className="w-5 h-5 text-teal-600" />,
    bg: "bg-teal-50",
    title: "Peripheral Drivers",
    desc: "Drivers that connect external devices to your computer. They define how peripherals exchange data with the host system across various interfaces.",
    items: [
      { name: "Printer Driver", note: "Translates digital documents into printer commands." },
      { name: "Scanner Driver", note: "Manages image capture and OCR data exchange." },
      { name: "Webcam Driver", note: "Handles video stream capture and resolution." },
      { name: "Display Driver", note: "Controls external monitor signals and refresh rates." },
    ],
  },
  {
    tag: "Category 04",
    icon: <Microchip className="w-5 h-5 text-purple-600" />,
    bg: "bg-purple-50",
    title: "Advanced Systems",
    desc: "Low-level firmware and security drivers responsible for system integrity. These drivers operate close to the hardware and influence the overall reliability of the platform.",
    items: [
      { name: "BIOS / UEFI", note: "Initialises hardware before the operating system loads." },
      { name: "Security Driver", note: "Supports encryption and secure boot enforcement." },
      { name: "Monitor Calibration", note: "Manages colour accuracy and display profiles." },
      { name: "Power Management", note: "Coordinates CPU and battery efficiency." },
    ],
  },
];

const compareRows = [
  { type: "Graphics Driver", fn: "Translates rendering commands into GPU instructions.", use: "Display visuals, video playback, gaming." },
  { type: "Audio Driver", fn: "Manages sound signal processing between OS and audio chip.", use: "Music playback, voice calls, system sound." },
  { type: "Network Driver", fn: "Handles data packet exchange over wired or wireless links.", use: "Internet access, file sharing, streaming." },
  { type: "Storage Controller", fn: "Coordinates read/write operations to internal storage.", use: "Booting the OS, saving files, data caching." },
  { type: "USB Driver", fn: "Detects and routes data for connected USB devices.", use: "Flash drives, keyboards, mice, peripherals." },
  { type: "Printer Driver", fn: "Converts digital documents into printer-readable commands.", use: "Office printing, design output, scanning." },
  { type: "BIOS / UEFI", fn: "Initialises hardware components before the OS loads.", use: "System boot sequence, firmware updates." },
  { type: "Security Driver", fn: "Supports encryption, signing, and secure boot processes.", use: "Disk encryption, trusted boot environments." },
];

export default function Home() {
  return (
    <Layout>

      {/* ── Hero ── */}
      <section className="pt-20 pb-14 px-4 border-b border-border" style={{ background: "linear-gradient(180deg, #f4f6fb 0%, #f9f9f7 100%)" }}>
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mb-6 tracking-wide uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Driver Guide Portal</span>
          </div>
          <h1 className="font-heading font-[800] text-[2.4rem] md:text-[3rem] text-[#111110] leading-[1.1] tracking-tight mb-5">
            A Reference Guide to System & Device Drivers
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Explore how drivers function, the categories that exist, and the role each plays in a modern computing environment. A neutral, educational resource — not a download or product directory.
          </p>
        </div>
      </section>

      {/* ── Explore: Driver Categories ── */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">

          <div className="mb-10">
            <div className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-2">Explore</div>
            <h2 className="font-heading font-bold text-3xl text-[#111110] mb-2">Driver Categories</h2>
            <p className="text-sm text-muted-foreground max-w-2xl">An organised overview of common driver categories found in modern operating systems, with examples of the components each one supports.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {categories.map((c) => (
              <article key={c.title} className="rounded-2xl border border-border bg-background p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${c.bg} rounded-lg flex items-center justify-center`}>{c.icon}</div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">{c.tag}</span>
                  </div>
                </div>
                <h3 className="font-heading font-bold text-xl text-[#111110] mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{c.desc}</p>

                <ul className="border-t border-border divide-y divide-border">
                  {c.items.map((it) => (
                    <li key={it.name} className="py-2.5 flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                      <span className="text-sm font-semibold text-[#111110] sm:w-44 flex-shrink-0">{it.name}</span>
                      <span className="text-xs text-muted-foreground leading-relaxed">{it.note}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How Drivers Work — Diagram ── */}
      <section className="py-16 px-4 bg-[#f9f9f7]">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-2">Concept</div>
            <h2 className="font-heading font-bold text-3xl text-[#111110] mb-2">How Drivers Work</h2>
            <p className="text-sm text-muted-foreground max-w-2xl">A driver acts as the bridge between physical hardware and the software running on the operating system. The diagram below illustrates the typical flow of communication.</p>
          </div>

          <div className="bg-white border border-border rounded-2xl p-8 md:p-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">

              {[
                { icon: <Cpu className="w-6 h-6 text-blue-700" />, label: "Hardware", sub: "Physical device or component", bg: "bg-blue-50", border: "border-blue-100" },
                { icon: <Layers className="w-6 h-6 text-[#1d4ed8]" />, label: "Driver", sub: "Software translator", bg: "bg-[#eff6ff]", border: "border-blue-300", highlight: true },
                { icon: <Server className="w-6 h-6 text-purple-700" />, label: "Operating System", sub: "Manages resources & I/O", bg: "bg-purple-50", border: "border-purple-100" },
                { icon: <Monitor className="w-6 h-6 text-teal-700" />, label: "Application", sub: "User-facing program", bg: "bg-teal-50", border: "border-teal-100" },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex flex-col md:flex-row items-center md:flex-1 gap-5 md:gap-3">
                  <div className={`flex-1 w-full md:w-auto rounded-xl border ${step.border} ${step.bg} px-5 py-5 text-center ${step.highlight ? "ring-2 ring-blue-400 ring-offset-2" : ""}`}>
                    <div className="w-11 h-11 bg-white border border-white shadow-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                      {step.icon}
                    </div>
                    <div className={`font-heading font-bold text-sm ${step.highlight ? "text-[#1d4ed8]" : "text-[#111110]"}`}>{step.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{step.sub}</div>
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
              The <span className="font-semibold text-[#1d4ed8]">Driver</span> sits between the hardware and the operating system. When an application makes a request, the OS routes it to the correct driver, which translates it into instructions the hardware can execute, then returns the result back up the chain.
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-2">Reference</div>
            <h2 className="font-heading font-bold text-3xl text-[#111110] mb-2">Types of Drivers and Their Roles</h2>
            <p className="text-sm text-muted-foreground max-w-2xl">A quick-reference table summarising common driver types, the function each performs, and a typical use case.</p>
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
                {compareRows.map((r) => (
                  <tr key={r.type} className="hover:bg-[#f9f9f7] transition-colors">
                    <td className="px-5 py-4 font-semibold text-[#111110] align-top w-44">{r.type}</td>
                    <td className="px-5 py-4 text-muted-foreground align-top">{r.fn}</td>
                    <td className="px-5 py-4 text-muted-foreground align-top hidden md:table-cell">{r.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-sm">
            <Link href="/drivers" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-border text-[#111110] font-medium hover:bg-[#f4f4f0] transition-colors">
              Continue to driver reference <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/how-it-works" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-border text-[#111110] font-medium hover:bg-[#f4f4f0] transition-colors">
              Read the How It Works guide <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </Layout>
  );
}
