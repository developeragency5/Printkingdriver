import Layout from "@/components/Layout";
import { Cpu, Monitor, Volume2, Wifi, HardDrive, Usb, Bluetooth, MousePointer2, Printer, Scan, Webcam, Microchip, Shield, MonitorSpeaker, AlertCircle, RefreshCw, FileQuestion, XOctagon, VolumeX, WifiOff } from "lucide-react";
import DriverGrid from "@/components/DriverGrid";
import { Link } from "wouter";

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
            Find, Fix & Install Printer Drivers — Instantly
          </h1>
          
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            PrintKingDriver helps you locate the right driver for any printer brand, troubleshoot errors, and get your device working in minutes.
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
    </Layout>
  );
}
