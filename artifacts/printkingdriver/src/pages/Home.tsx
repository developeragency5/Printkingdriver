import Layout from "@/components/Layout";
import { Cpu, Monitor, Volume2, Wifi, HardDrive, Usb, Bluetooth, MousePointer2, Printer, Scan, Webcam, Microchip, Shield, MonitorSpeaker, AlertCircle, RefreshCw, FileQuestion, XOctagon, VolumeX, WifiOff, Layers, Server, ArrowRight, ArrowDown } from "lucide-react";
import DriverGrid from "@/components/DriverGrid";
import { Link } from "wouter";

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
      <section className="pt-[80px] pb-[60px] px-4 relative overflow-hidden" style={{background: 'radial-gradient(ellipse at top, #eff6ff 0%, #f9f9f7 60%)'}}>
        <div className="absolute inset-0 -z-10"></div>
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <span>Printer Driver Information Guide</span>
          </div>
          
          <h1 className="font-heading font-[800] text-[2.4rem] md:text-[2.8rem] text-[#111110] leading-[1.1] tracking-tight mb-6 animate-fade-in-up">
            Understand Printer Drivers — A Clear, Practical Guide
          </h1>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            PrintKingDriver is an informational portal explaining what printer drivers are, how they work, the categories that exist, and how to recognise common issues.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/drivers" className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
              Explore Drivers →
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto px-8 py-3.5 bg-white text-foreground border border-border rounded-full font-semibold hover:bg-secondary transition-colors">
              How It Works
            </Link>
          </div>
          
        </div>
      </section>

      {/* Driver Categories */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="font-heading font-bold text-3xl text-center mb-16">Browse by Driver Type</h2>
          
          <DriverGrid 
            title="Section 1 — Essential Drivers"
            subtitle="Core System Foundation for stable operation."
            columns={4}
            cards={[
              { title: "Chipset Driver", description: "CPU & Motherboard Logic Sync", icon: <Cpu strokeWidth={1.5} /> },
              { title: "Graphics Driver", description: "Visual Rendering & GPU Protocols", icon: <Monitor strokeWidth={1.5} /> },
              { title: "Audio Driver", description: "Sound Input/Output Processing", icon: <Volume2 strokeWidth={1.5} /> },
              { title: "Network Driver", description: "Wi-Fi 6 & High-Speed LAN Link", icon: <Wifi strokeWidth={1.5} /> },
            ]}
          />
          
          <DriverGrid 
            title="Section 2 — Hardware-Specific"
            subtitle="Internal Component Control for optimization and speed."
            columns={4}
            cards={[
              { title: "Storage Controller", description: "Efficient data transfer for SSDs and HDDs.", icon: <HardDrive strokeWidth={1.5} /> },
              { title: "USB Support", description: "Port recognition and external device connectivity.", icon: <Usb strokeWidth={1.5} /> },
              { title: "Bluetooth Drivers", description: "Seamless wireless pairing for peripherals.", icon: <Bluetooth strokeWidth={1.5} /> },
              { title: "Touchpad/Keyboard", description: "Precision input control and gesture translation.", icon: <MousePointer2 strokeWidth={1.5} /> },
            ]}
          />

          <DriverGrid 
            title="Section 3 — Peripheral Drivers"
            subtitle="External Device Integration for connectivity and capture."
            columns={3}
            cards={[
              { title: "Printer Drivers", description: "Digital to physical document translation.", icon: <Printer strokeWidth={1.5} />, active: true },
              { title: "Scanner Support", description: "Image digitizing and OCR protocol management.", icon: <Scan strokeWidth={1.5} /> },
              { title: "Webcam Drivers", description: "HD video capture and streaming optimization.", icon: <Webcam strokeWidth={1.5} /> },
            ]}
          />

          <DriverGrid 
            title="Section 4 — Advanced Systems"
            subtitle="Low-level Firmware & Security for system integrity."
            columns={3}
            cards={[
              { title: "BIOS/UEFI", description: "Low-level pre-boot hardware initialization.", icon: <Microchip strokeWidth={1.5} /> },
              { title: "Security Drivers", description: "System encryption and secure boot protection.", icon: <Shield strokeWidth={1.5} /> },
              { title: "Monitor Calibration", description: "Color accuracy and refresh rate optimization.", icon: <MonitorSpeaker strokeWidth={1.5} /> },
            ]}
          />
        </div>
      </section>

      {/* Common Issues */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl mb-3">Common Driver Issues We Resolve</h2>
            <p className="text-muted-foreground">From missing drivers to conflict errors — we have the information.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { title: "Printer Offline", desc: "Device not detected by the operating system.", icon: <AlertCircle className="w-6 h-6 text-orange-500" /> },
              { title: "Driver Conflict", desc: "Two drivers clashing and causing errors.", icon: <XOctagon className="w-6 h-6 text-red-500" /> },
              { title: "Missing Driver", desc: "Required driver not found or corrupted.", icon: <FileQuestion className="w-6 h-6 text-blue-500" /> },
              { title: "Print Queue Stuck", desc: "Jobs stuck and not clearing from queue.", icon: <RefreshCw className="w-6 h-6 text-purple-500" /> },
              { title: "Audio Errors", desc: "Sound driver failure or no audio output.", icon: <VolumeX className="w-6 h-6 text-pink-500" /> },
              { title: "Network Drops", desc: "Wi-Fi or LAN driver instability issues.", icon: <WifiOff className="w-6 h-6 text-teal-500" /> },
            ].map((issue, i) => (
              <div key={i} className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{issue.icon}</div>
                <h4 className="font-heading font-bold text-lg mb-2">{issue.title}</h4>
                <p className="text-sm text-muted-foreground">{issue.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/contact" className="inline-flex px-8 py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-md">
              Get Support →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Explore Driver Categories ── */}
      <section className="py-20 px-4 bg-[#f4f6fb]">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-2">Explore</div>
            <h2 className="font-heading font-bold text-3xl text-[#111110] mb-3">Explore Drivers</h2>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Find and learn about all essential system drivers, organised into clear categories for easy reference.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {exploreCategories.map((c) => (
              <article key={c.title} className="rounded-2xl border border-border bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-shadow flex flex-col">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={`w-9 h-9 ${c.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>{c.icon}</div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{c.tag}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[#111110] mb-2">{c.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">{c.desc}</p>

                <ul className="border-t border-border pt-3 space-y-3 mt-auto">
                  {c.items.map((it) => (
                    <li key={it.name} className="flex gap-2.5">
                      <div className={`w-6 h-6 ${c.bg} rounded-md flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        {it.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12px] font-semibold text-[#111110]">{it.name}</div>
                        <div className="text-[11px] text-muted-foreground leading-snug">{it.note}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How Drivers Work ── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-2">Concept</div>
            <h2 className="font-heading font-bold text-3xl text-[#111110] mb-3">How Drivers Work</h2>
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
      <section className="py-20 px-4 bg-[#f4f6fb]">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-2">Reference</div>
            <h2 className="font-heading font-bold text-3xl text-[#111110] mb-3">Types of Drivers and Their Roles</h2>
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
