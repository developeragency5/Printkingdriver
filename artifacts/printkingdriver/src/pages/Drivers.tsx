import Layout from "@/components/Layout";
import { Cpu, FileCode, Globe, Shield, ArrowRight, ArrowDown, Monitor, Printer, HardDrive, Wifi } from "lucide-react";

const driverTypes = [
  {
    icon: <FileCode className="w-6 h-6 text-blue-600" />,
    name: "PCL Driver",
    full: "Printer Command Language",
    desc: "Developed by HP and widely adopted across the industry. Fast and efficient for high-volume text printing in office environments.",
    best: "Office & Business Printing",
    os: "Windows, Linux",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: <Monitor className="w-6 h-6 text-purple-600" />,
    name: "PostScript",
    full: "Adobe PostScript Driver",
    desc: "A page description language used for graphics-intensive documents. Produces high-quality output for design and publishing workflows.",
    best: "Design & Publishing",
    os: "Windows, macOS",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    icon: <Cpu className="w-6 h-6 text-orange-600" />,
    name: "Host-Based",
    full: "Host-Based Raster Driver",
    desc: "Offloads processing to the host computer rather than the printer. Found in consumer-grade printers — the host handles rendering before sending data.",
    best: "Home & Consumer Use",
    os: "Windows",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
  {
    icon: <Globe className="w-6 h-6 text-teal-600" />,
    name: "Universal (UPD)",
    full: "Universal Print Driver",
    desc: "A single driver that supports multiple printer models from the same manufacturer. Reduces complexity when managing multiple devices across a network.",
    best: "Enterprise & IT Networks",
    os: "Windows, macOS",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    icon: <HardDrive className="w-6 h-6 text-red-600" />,
    name: "IPP Everywhere",
    full: "Internet Printing Protocol",
    desc: "A driverless printing standard supported by modern operating systems. Allows printing without manually installing a dedicated driver file.",
    best: "Modern Driverless Setup",
    os: "Windows 10+, macOS, iOS",
    bg: "bg-red-50",
    border: "border-red-100",
  },
  {
    icon: <Wifi className="w-6 h-6 text-indigo-600" />,
    name: "Network Driver",
    full: "Network Print Driver",
    desc: "Enables communication between a printer and computers over a local network or the internet. Essential for shared printers in office or home network environments.",
    best: "Shared Network Printers",
    os: "Windows, macOS, Linux",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
];

const troubleshootingRows = [
  { issue: "Printer Not Detected", cause: "Missing or corrupt driver", fix: "Reinstall the correct driver for your OS version" },
  { issue: "Driver Conflict", cause: "Old driver not fully removed before new install", fix: "Clean uninstall all driver files, then reinstall fresh" },
  { issue: "Print Queue Stuck", cause: "Corrupted print job or unresponsive spooler", fix: "Restart the print spooler service and clear the spooler folder" },
  { issue: "Printer Shows Offline", cause: "Driver lost communication pathway to device", fix: "Check port settings and disable 'Use Printer Offline' option" },
  { issue: "Poor Quality After OS Update", cause: "OS update changed driver interaction layer", fix: "Install updated driver released by manufacturer post-update" },
  { issue: "Driver Install Fails", cause: "Residual files or security software blocking setup", fix: "Run installer as Administrator with antivirus temporarily paused" },
  { issue: "Incorrect Page Size Output", cause: "Driver paper settings mismatch", fix: "Verify paper size settings in driver preferences and printing app" },
  { issue: "Slow Printing Speed", cause: "Driver using wrong rendering mode", fix: "Switch from high-quality to standard mode in driver settings" },
];

export default function Drivers() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-14 max-w-5xl">

        {/* Page heading */}
        <h1 className="font-heading font-[800] text-4xl text-[#111110] mb-3">What Are Drivers?</h1>
        <p className="text-muted-foreground text-base mb-12 max-w-2xl leading-relaxed">
          A driver is software that enables your operating system to communicate with hardware. This guide explains driver types, how they function, and how to resolve common issues.
        </p>

        {/* ── How a Driver Works Diagram ── */}
        <section className="mb-16">
          <h2 className="font-heading font-bold text-2xl text-[#111110] mb-2">How a Driver Functions</h2>
          <p className="text-sm text-muted-foreground mb-8">The flow below shows how a print command travels from your application to the physical printer through the driver layer.</p>

          {/* Flow diagram */}
          <div className="bg-white border border-border rounded-2xl p-8 overflow-x-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 min-w-[560px]">

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
                  <Monitor className="w-7 h-7 text-blue-600" />
                </div>
                <div className="font-heading font-bold text-sm text-[#111110]">Application</div>
                <div className="text-xs text-muted-foreground mt-1 max-w-[100px]">User sends print command</div>
              </div>

              <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block flex-shrink-0" />
              <ArrowDown className="w-5 h-5 text-muted-foreground md:hidden flex-shrink-0" />

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-3">
                  <Shield className="w-7 h-7 text-purple-600" />
                </div>
                <div className="font-heading font-bold text-sm text-[#111110]">OS Kernel</div>
                <div className="text-xs text-muted-foreground mt-1 max-w-[100px]">Routes request to driver layer</div>
              </div>

              <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block flex-shrink-0" />
              <ArrowDown className="w-5 h-5 text-muted-foreground md:hidden flex-shrink-0" />

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#eff6ff] border border-blue-200 flex items-center justify-center mb-3 ring-2 ring-blue-400 ring-offset-2">
                  <FileCode className="w-7 h-7 text-[#1d4ed8]" />
                </div>
                <div className="font-heading font-bold text-sm text-[#1d4ed8]">Printer Driver</div>
                <div className="text-xs text-muted-foreground mt-1 max-w-[100px]">Translates to printer language (PCL / PS)</div>
              </div>

              <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block flex-shrink-0" />
              <ArrowDown className="w-5 h-5 text-muted-foreground md:hidden flex-shrink-0" />

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-3">
                  <Cpu className="w-7 h-7 text-teal-600" />
                </div>
                <div className="font-heading font-bold text-sm text-[#111110]">Firmware</div>
                <div className="text-xs text-muted-foreground mt-1 max-w-[100px]">Printer processes the command</div>
              </div>

              <ArrowRight className="w-5 h-5 text-muted-foreground hidden md:block flex-shrink-0" />
              <ArrowDown className="w-5 h-5 text-muted-foreground md:hidden flex-shrink-0" />

              {/* Step 5 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-3">
                  <Printer className="w-7 h-7 text-green-600" />
                </div>
                <div className="font-heading font-bold text-sm text-[#111110]">Output</div>
                <div className="text-xs text-muted-foreground mt-1 max-w-[100px]">Physical page is printed</div>
              </div>

            </div>

            {/* Legend note */}
            <div className="mt-8 pt-6 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-[#1d4ed8] flex-shrink-0"></div>
              The <span className="font-semibold text-[#1d4ed8] mx-1">Printer Driver</span> is the critical translation layer — without it, the OS cannot communicate with the hardware.
            </div>
          </div>
        </section>

        {/* ── Driver Types Cards ── */}
        <section className="mb-16">
          <h2 className="font-heading font-bold text-2xl text-[#111110] mb-2">Types of Printer Drivers</h2>
          <p className="text-sm text-muted-foreground mb-8">Each driver type serves a different use case. Understanding which type applies to your printer helps ensure correct installation and performance.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {driverTypes.map((d) => (
              <div key={d.name} className={`rounded-xl border ${d.border} ${d.bg} p-5 flex flex-col gap-3`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-white/80 shadow-sm flex items-center justify-center">
                    {d.icon}
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm text-[#111110]">{d.name}</div>
                    <div className="text-[11px] text-muted-foreground">{d.full}</div>
                  </div>
                </div>
                <p className="text-[13px] text-[#3a3a38] leading-relaxed">{d.desc}</p>
                <div className="mt-auto pt-3 border-t border-black/5 flex flex-col gap-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">Best for</span>
                    <span className="font-medium text-[#111110]">{d.best}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">OS Support</span>
                    <span className="font-medium text-[#111110]">{d.os}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Compatibility Table ── */}
        <section className="mb-16">
          <h2 className="font-heading font-bold text-2xl text-[#111110] mb-2">Driver Type Comparison</h2>
          <p className="text-sm text-muted-foreground mb-8">A quick-reference overview of driver types, their rendering location, typical use case, and OS compatibility.</p>

          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f2f2ee] border-b border-border">
                  <th className="text-left px-5 py-3.5 font-heading font-bold text-xs text-[#111110] uppercase tracking-wide">Driver Type</th>
                  <th className="text-left px-5 py-3.5 font-heading font-bold text-xs text-[#111110] uppercase tracking-wide">Rendering</th>
                  <th className="text-left px-5 py-3.5 font-heading font-bold text-xs text-[#111110] uppercase tracking-wide hidden md:table-cell">Language</th>
                  <th className="text-left px-5 py-3.5 font-heading font-bold text-xs text-[#111110] uppercase tracking-wide">Best For</th>
                  <th className="text-left px-5 py-3.5 font-heading font-bold text-xs text-[#111110] uppercase tracking-wide hidden lg:table-cell">OS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { type: "PCL", render: "Printer-side", lang: "PCL 5 / PCL 6", best: "Office printing", os: "Windows, Linux" },
                  { type: "PostScript", render: "Printer-side", lang: "Adobe PS", best: "Design & graphics", os: "Windows, macOS" },
                  { type: "Host-Based", render: "Host computer", lang: "Raster / GDI", best: "Home printers", os: "Windows" },
                  { type: "Universal (UPD)", render: "Varies", lang: "PCL / PS", best: "Enterprise fleets", os: "Windows, macOS" },
                  { type: "IPP Everywhere", render: "Host computer", lang: "PWG Raster", best: "Driverless setup", os: "Win 10+, macOS, iOS" },
                  { type: "Network Driver", render: "Host computer", lang: "TCP/IP Protocol", best: "Shared printers", os: "Windows, macOS, Linux" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#f9f9f7] transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-[#111110]">{row.type}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{row.render}</td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell font-mono text-xs">{row.lang}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{row.best}</td>
                    <td className="px-5 py-3.5 text-muted-foreground hidden lg:table-cell text-xs">{row.os}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Troubleshooting Table ── */}
        <section className="mb-8">
          <h2 className="font-heading font-bold text-2xl text-[#111110] mb-2">Troubleshooting Reference</h2>
          <p className="text-sm text-muted-foreground mb-8">Common driver issues, their root causes, and the recommended fix for each.</p>

          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f2f2ee] border-b border-border">
                  <th className="text-left px-5 py-3.5 font-heading font-bold text-xs text-[#111110] uppercase tracking-wide">Issue</th>
                  <th className="text-left px-5 py-3.5 font-heading font-bold text-xs text-[#111110] uppercase tracking-wide hidden md:table-cell">Likely Cause</th>
                  <th className="text-left px-5 py-3.5 font-heading font-bold text-xs text-[#111110] uppercase tracking-wide">Recommended Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {troubleshootingRows.map((row, i) => (
                  <tr key={i} className="hover:bg-[#f9f9f7] transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-[#111110] align-top">{row.issue}</td>
                    <td className="px-5 py-3.5 text-muted-foreground align-top hidden md:table-cell">{row.cause}</td>
                    <td className="px-5 py-3.5 text-muted-foreground align-top">{row.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </Layout>
  );
}
