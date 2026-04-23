import Layout from "@/components/Layout";
import { Link } from "wouter";
import {
  Cpu, FileText, Layers, Settings, ShieldCheck, BookOpen,
  ArrowRight, ArrowDown, Monitor, Printer, HardDrive, Wifi,
  FileCode, AlertCircle, RefreshCw, FileQuestion, XOctagon, WifiOff, VolumeX
} from "lucide-react";

export default function Home() {
  return (
    <Layout>

      {/* ── Hero ── */}
      <section className="pt-20 pb-16 px-4" style={{ background: "radial-gradient(ellipse at top, #eff6ff 0%, #f9f9f7 65%)" }}>
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>Printer Driver Information Guide</span>
          </div>
          <h1 className="font-heading font-[800] text-[2.6rem] md:text-[3.2rem] text-[#111110] leading-[1.1] tracking-tight mb-5">
            Understanding Printer Drivers
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            A comprehensive guide explaining what printer drivers are, how they work, the types available, and how to resolve common issues — no downloads, no sign-ups.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/drivers" className="px-7 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors">
              Explore Driver Types →
            </Link>
            <Link href="/how-it-works" className="px-7 py-3 bg-white text-foreground border border-border rounded-full font-semibold hover:bg-secondary transition-colors">
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ── What Is a Driver? ── */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-[#111110] mb-3">What Is a Printer Driver?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
              A printer driver is a piece of software that acts as a translator between your operating system and your printer hardware. Without it, the two cannot communicate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FileCode className="w-6 h-6 text-blue-600" />,
                bg: "bg-blue-50",
                title: "Translation Layer",
                body: "Your application sends a print command in a format the OS understands. The driver converts that command into a language the printer hardware can execute — such as PCL or PostScript.",
              },
              {
                icon: <Layers className="w-6 h-6 text-purple-600" />,
                bg: "bg-purple-50",
                title: "Software Bridge",
                body: "Drivers sit between the operating system kernel and the printer firmware. They handle formatting, page layout, colour management, and paper-size translation automatically.",
              },
              {
                icon: <Settings className="w-6 h-6 text-teal-600" />,
                bg: "bg-teal-50",
                title: "Hardware Abstraction",
                body: "Each printer model has unique hardware. The driver abstracts those differences so the OS can issue a single standardised print command regardless of the underlying hardware.",
              },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-background p-6">
                <div className={`w-11 h-11 ${c.bg} rounded-xl flex items-center justify-center mb-4`}>
                  {c.icon}
                </div>
                <h3 className="font-heading font-bold text-lg text-[#111110] mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Functions — Flow Diagram ── */}
      <section className="py-16 px-4 bg-[#f9f9f7]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="font-heading font-bold text-3xl text-[#111110] mb-3">How a Driver Functions</h2>
            <p className="text-sm text-muted-foreground">The journey of a print command from application to physical output.</p>
          </div>

          <div className="bg-white border border-border rounded-2xl p-8 overflow-x-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 min-w-[580px]">
              {[
                { icon: <Monitor className="w-7 h-7 text-blue-600" />, bg: "bg-blue-50 border-blue-100", label: "Application", sub: "User sends print command" },
                null,
                { icon: <ShieldCheck className="w-7 h-7 text-purple-600" />, bg: "bg-purple-50 border-purple-100", label: "OS Kernel", sub: "Routes request to driver layer" },
                null,
                { icon: <FileCode className="w-7 h-7 text-[#1d4ed8]" />, bg: "bg-[#eff6ff] border-blue-200 ring-2 ring-blue-400 ring-offset-2", label: "Printer Driver", sub: "Translates to PCL / PS", highlight: true },
                null,
                { icon: <Cpu className="w-7 h-7 text-teal-600" />, bg: "bg-teal-50 border-teal-100", label: "Firmware", sub: "Printer processes command" },
                null,
                { icon: <Printer className="w-7 h-7 text-green-600" />, bg: "bg-green-50 border-green-100", label: "Output", sub: "Physical page printed" },
              ].map((step, i) =>
                step === null ? (
                  <div key={i} className="flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block" />
                    <ArrowDown className="w-5 h-5 text-muted-foreground md:hidden" />
                  </div>
                ) : (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-3 ${step.bg}`}>
                      {step.icon}
                    </div>
                    <div className={`font-heading font-bold text-sm ${step.highlight ? "text-[#1d4ed8]" : "text-[#111110]"}`}>{step.label}</div>
                    <div className="text-xs text-muted-foreground mt-1 max-w-[96px]">{step.sub}</div>
                  </div>
                )
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-[#1d4ed8] flex-shrink-0" />
              The <span className="font-semibold text-[#1d4ed8] mx-1">Printer Driver</span> is the critical translation layer — without it, the OS cannot communicate with the hardware.
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Drivers Matter ── */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-[#111110] mb-3">Why Drivers Matter</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Drivers are not optional software — they are essential components of every computing environment that uses hardware peripherals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: <Wifi className="w-5 h-5 text-blue-600" />, bg: "bg-blue-50", title: "Device Communication", body: "Without a driver, your operating system has no way to send instructions to your printer. The driver establishes and maintains that communication channel." },
              { icon: <HardDrive className="w-5 h-5 text-orange-600" />, bg: "bg-orange-50", title: "Hardware Compatibility", body: "Different printer models have different command sets. Drivers provide a compatibility layer so one OS can support thousands of printer models." },
              { icon: <FileText className="w-5 h-5 text-green-600" />, bg: "bg-green-50", title: "Print Quality Control", body: "Drivers control resolution, colour profiles, paper handling, and duplex settings — all of which directly affect the quality of the printed output." },
              { icon: <ShieldCheck className="w-5 h-5 text-purple-600" />, bg: "bg-purple-50", title: "System Stability", body: "An outdated or corrupted driver is one of the most common causes of printer errors, system crashes, and unexpected device behaviour." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-6 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors">
                <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#111110] mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Common Issues ── */}
      <section className="py-16 px-4 bg-[#f9f9f7]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl text-[#111110] mb-3">Common Driver Issues</h2>
            <p className="text-muted-foreground text-sm">Recognising the symptom is the first step to finding the correct fix.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <AlertCircle className="w-5 h-5 text-orange-500" />, title: "Printer Offline", desc: "The OS cannot detect or reach the printer. Usually caused by a missing or corrupt driver, or a broken communication port." },
              { icon: <XOctagon className="w-5 h-5 text-red-500" />, title: "Driver Conflict", desc: "Two drivers competing for the same hardware resource. Often occurs after an OS update or when an old driver was not fully removed." },
              { icon: <FileQuestion className="w-5 h-5 text-blue-500" />, title: "Missing Driver", desc: "The OS cannot find a driver for the connected device. The hardware shows as unknown in Device Manager." },
              { icon: <RefreshCw className="w-5 h-5 text-purple-500" />, title: "Print Queue Stuck", desc: "Print jobs queue but never process. Typically linked to a frozen print spooler or a corrupted driver communication channel." },
              { icon: <VolumeX className="w-5 h-5 text-pink-500" />, title: "No Output Produced", desc: "Command appears to complete but nothing prints. Often a mismatch between driver language (PCL vs PS) and printer firmware." },
              { icon: <WifiOff className="w-5 h-5 text-teal-500" />, title: "Network Printer Lost", desc: "A shared network printer drops off after a driver or OS update changes the port configuration or IP assignment." },
            ].map((issue) => (
              <div key={issue.title} className="bg-white border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  {issue.icon}
                  <h4 className="font-heading font-bold text-base text-[#111110]">{issue.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{issue.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Guide Navigation ── */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-heading font-bold text-2xl text-[#111110] mb-8 text-center">Continue Reading</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { href: "/drivers", title: "Driver Types", desc: "A deep-dive into PCL, PostScript, Host-Based, Universal, and IPP Everywhere drivers with a comparison table.", label: "Explore Drivers" },
              { href: "/how-it-works", title: "How It Works", desc: "Step-by-step walkthrough of how to identify the correct driver for your printer model and operating system.", label: "View Guide" },
              { href: "/contact", title: "Get Help", desc: "Can't find what you're looking for? Send us a question and our support team will provide guidance.", label: "Contact Us" },
            ].map((card) => (
              <Link key={card.href} href={card.href} className="group block rounded-2xl border border-border p-6 hover:border-primary/40 hover:shadow-md transition-all bg-background">
                <h3 className="font-heading font-bold text-lg text-[#111110] mb-2 group-hover:text-primary transition-colors">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{card.desc}</p>
                <span className="text-sm font-semibold text-primary flex items-center gap-1">
                  {card.label} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  );
}
