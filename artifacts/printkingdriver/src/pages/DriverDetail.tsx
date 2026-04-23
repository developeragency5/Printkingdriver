import { Link, useRoute } from "wouter";
import Layout from "@/components/Layout";
import {
  ArrowLeft,
  ArrowRight,
  Cpu,
  Monitor,
  Volume2,
  Wifi,
  HardDrive,
  Usb,
  Bluetooth,
  MousePointer2,
  Printer,
  Scan,
  Webcam,
  Microchip,
  Shield,
  MonitorSpeaker,
} from "lucide-react";

type DriverInfo = {
  name: string;
  tagline: string;
  icon: React.ReactNode;
  what: string;
  how: string;
  functions: string[];
  table: { component: string; role: string; example: string }[];
  why: string;
};

const drivers: Record<string, DriverInfo> = {
  chipset: {
    name: "Chipset Driver",
    tagline: "Coordinates motherboard logic and CPU communication.",
    icon: <Cpu className="w-7 h-7 text-blue-600" />,
    what: "A chipset driver tells the operating system how to communicate with the controllers built into the motherboard. It governs the data paths between the CPU, memory, storage, and expansion buses, ensuring each subsystem can exchange information correctly.",
    how: "When the OS starts, the chipset driver loads early so the kernel knows the layout of the system bus. The CPU sends instructions to the chipset, the chipset routes them to the right hardware lane, the driver translates the response, and the OS exposes the result to applications.",
    functions: [
      "Configures PCIe, SATA, and USB controllers on the motherboard.",
      "Maps interrupts so the CPU receives signals from the right device.",
      "Optimises memory and bus timing for stability and throughput.",
      "Enables power management features like idle states and wake events.",
    ],
    table: [
      { component: "CPU ↔ Chipset link", role: "High-speed data path", example: "DMI / Infinity Fabric" },
      { component: "PCIe lanes", role: "Connect GPU and SSDs", example: "NVMe storage" },
      { component: "Power management unit", role: "Sleep / wake states", example: "ACPI S0/S3" },
    ],
    why: "Without a working chipset driver, every other driver underperforms because the basic communication layer between CPU and hardware is misconfigured. It is the foundation the rest of the OS sits on.",
  },
  graphics: {
    name: "Graphics Driver",
    tagline: "Handles visual rendering and GPU instructions.",
    icon: <Monitor className="w-7 h-7 text-blue-600" />,
    what: "A graphics driver is the translation layer between the operating system and the graphics processor. It converts standard rendering calls from applications into GPU-specific instructions that produce images on screen.",
    how: "An application asks the OS to draw something through an API such as DirectX, Vulkan, or OpenGL. The OS forwards that request to the graphics driver, which compiles it into commands the GPU can execute. The GPU renders frames and the driver pushes them to the display.",
    functions: [
      "Translates rendering API calls into GPU machine instructions.",
      "Manages video memory allocation for textures and frame buffers.",
      "Schedules workloads across GPU cores and shader units.",
      "Controls display output, resolution, refresh rate, and colour depth.",
    ],
    table: [
      { component: "Graphics API", role: "Standard interface for apps", example: "DirectX / Vulkan" },
      { component: "Shader compiler", role: "Builds GPU programs", example: "HLSL → ISA" },
      { component: "Display controller", role: "Sends pixels to monitor", example: "HDMI / DisplayPort" },
    ],
    why: "Smooth visuals, accurate colours, and stable frame rates all depend on the graphics driver. A poor or outdated driver causes flickering, artefacts, and crashes even when the GPU itself is healthy.",
  },
  audio: {
    name: "Audio Driver",
    tagline: "Manages sound input and output processing.",
    icon: <Volume2 className="w-7 h-7 text-blue-600" />,
    what: "An audio driver lets the operating system route digital sound to and from the audio hardware. It handles encoding, mixing, and signal processing so that microphones, speakers, and headphones behave consistently across applications.",
    how: "When an app plays a sound, the OS sends raw audio data to the audio driver. The driver mixes streams from multiple apps, applies any effects, and forwards the final signal to the audio codec. The codec converts it into an analog waveform sent to the speakers.",
    functions: [
      "Mixes multiple audio streams from different applications.",
      "Selects input and output devices and manages their levels.",
      "Provides effects pipelines such as equalisation and noise reduction.",
      "Synchronises audio with video to prevent lag.",
    ],
    table: [
      { component: "Audio API", role: "App-facing interface", example: "WASAPI / Core Audio" },
      { component: "Mixer", role: "Combines streams", example: "System volume mixer" },
      { component: "Codec", role: "Digital ↔ analog", example: "Realtek ALC" },
    ],
    why: "Audio drivers determine clarity, latency, and reliability. Without one, microphones go silent, speakers crackle, and meeting apps fail to detect any device at all.",
  },
  network: {
    name: "Network Driver",
    tagline: "Enables wired and wireless network connectivity.",
    icon: <Wifi className="w-7 h-7 text-blue-600" />,
    what: "A network driver allows the operating system to send and receive data through Ethernet ports, Wi-Fi adapters, and other network interfaces. It manages the low-level packet flow that the rest of the network stack relies on.",
    how: "When data leaves an application, the OS wraps it in network packets and hands them to the driver. The driver instructs the network adapter to transmit those packets. Incoming packets follow the reverse path, with the driver delivering them back to the OS.",
    functions: [
      "Initialises the network adapter and negotiates link speed.",
      "Sends and receives packets between the OS and the hardware.",
      "Manages wireless association, encryption, and roaming.",
      "Reports status events such as cable unplugged or signal loss.",
    ],
    table: [
      { component: "MAC layer", role: "Hardware addressing", example: "Ethernet frames" },
      { component: "Wi-Fi radio", role: "Wireless transmission", example: "802.11ax" },
      { component: "TCP/IP stack", role: "Packet routing", example: "OS networking" },
    ],
    why: "Every online activity, from web browsing to cloud sync, depends on a reliable network driver. Failures here often look like full system outages even though only one component is misbehaving.",
  },
  storage: {
    name: "Storage Controller Driver",
    tagline: "Manages data transfer with SSDs and hard drives.",
    icon: <HardDrive className="w-7 h-7 text-orange-600" />,
    what: "A storage controller driver is responsible for moving data between the operating system and storage devices. It abstracts the differences between SATA, NVMe, and other protocols so the file system can read and write reliably.",
    how: "The OS issues a read or write to a logical sector. The driver converts that into a hardware command, queues it on the controller, and waits for completion. The controller moves data to or from the SSD, and the driver returns the result to the OS.",
    functions: [
      "Translates file system calls into device-level commands.",
      "Manages command queues and prioritises critical operations.",
      "Reports drive health metrics such as SMART data.",
      "Supports features like TRIM, caching, and RAID arrays.",
    ],
    table: [
      { component: "SATA / NVMe protocol", role: "Storage interface", example: "AHCI / NVMe 1.4" },
      { component: "Command queue", role: "Operation ordering", example: "NCQ" },
      { component: "Cache layer", role: "Speeds up reads", example: "Write-back cache" },
    ],
    why: "Boot times, file access speed, and data integrity are all shaped by the storage driver. A poor driver can cause corruption, slowdowns, or invisible drives.",
  },
  usb: {
    name: "USB Driver",
    tagline: "Detects ports and connected USB devices.",
    icon: <Usb className="w-7 h-7 text-orange-600" />,
    what: "A USB driver allows the operating system to recognise and communicate with devices plugged into USB ports. It identifies each device, loads the matching device driver, and manages bandwidth on the bus.",
    how: "When a device is plugged in, the host controller signals the OS. The USB driver enumerates the device, reads its descriptors, and matches it against known device classes. Once paired, data flows between the OS and the device through the USB stack.",
    functions: [
      "Detects connect and disconnect events on every port.",
      "Allocates power and bandwidth among connected devices.",
      "Loads class drivers for storage, audio, HID, and more.",
      "Supports USB 2.0, 3.x, and modern USB-C alternate modes.",
    ],
    table: [
      { component: "Host controller", role: "Bus master", example: "xHCI" },
      { component: "Device descriptor", role: "Identifies hardware", example: "VID / PID" },
      { component: "Class driver", role: "Generic behaviour", example: "USB Mass Storage" },
    ],
    why: "Almost every external accessory uses USB. A broken USB driver leaves keyboards, drives, printers, and chargers unusable even when they are physically connected.",
  },
  bluetooth: {
    name: "Bluetooth Driver",
    tagline: "Pairs and manages nearby wireless devices.",
    icon: <Bluetooth className="w-7 h-7 text-orange-600" />,
    what: "A Bluetooth driver controls the short-range wireless radio that connects peripherals like headphones, mice, and keyboards. It handles pairing, profiles, and ongoing data exchange between the OS and each device.",
    how: "The driver scans for nearby devices and exchanges identification keys during pairing. Once trusted, the OS opens a profile (audio, HID, file transfer) over the link, and the driver moves packets between the application and the Bluetooth radio.",
    functions: [
      "Discovers devices and manages pairing keys.",
      "Implements profiles for audio, input, and data transfer.",
      "Maintains stable links and handles reconnects.",
      "Coexists with Wi-Fi on shared 2.4 GHz frequencies.",
    ],
    table: [
      { component: "Bluetooth radio", role: "Wireless link", example: "Bluetooth 5.3" },
      { component: "Pairing layer", role: "Trust and security", example: "Secure Simple Pairing" },
      { component: "Profile", role: "Device behaviour", example: "A2DP, HID" },
    ],
    why: "A clean Bluetooth driver gives stable audio, low input latency, and reliable reconnection. Issues here usually surface as dropouts, missing devices, or stuttering sound.",
  },
  input: {
    name: "Input Driver (Touchpad / Keyboard)",
    tagline: "Translates input gestures and keystrokes.",
    icon: <MousePointer2 className="w-7 h-7 text-orange-600" />,
    what: "Input drivers convert physical actions on a keyboard, touchpad, or pointing device into events the operating system can deliver to applications. They handle layout, gestures, and accessibility behaviour.",
    how: "Each key press or finger movement generates a hardware signal. The input driver decodes the signal, applies layout and gesture rules, and emits a standard input event. The OS routes that event to the focused application window.",
    functions: [
      "Interprets keystrokes according to the active keyboard layout.",
      "Recognises multi-finger gestures on touchpads.",
      "Provides palm rejection and adjustable sensitivity.",
      "Supports accessibility features like sticky keys.",
    ],
    table: [
      { component: "HID protocol", role: "Standard input format", example: "USB HID" },
      { component: "Gesture engine", role: "Multi-touch rules", example: "Two-finger scroll" },
      { component: "Layout map", role: "Keys → characters", example: "QWERTY / AZERTY" },
    ],
    why: "Input drivers shape the feel of typing and navigation. Even small bugs here cause missed keystrokes, ghost cursor movement, or unresponsive gestures.",
  },
  printer: {
    name: "Printer Driver",
    tagline: "Translates documents into printer commands.",
    icon: <Printer className="w-7 h-7 text-teal-600" />,
    what: "A printer driver converts on-screen documents into a stream of instructions a specific printer can render. It manages page layout, colour, paper handling, and the print queue between the OS and the device.",
    how: "When a user prints, the OS captures the document and hands it to the driver. The driver renders each page into the printer's native language (such as PCL or PostScript), sends it to the print spooler, and the spooler delivers it to the printer over USB or the network.",
    functions: [
      "Renders documents into a printer-readable page description.",
      "Manages paper size, orientation, duplex, and tray selection.",
      "Communicates job status, errors, and ink or toner levels.",
      "Queues multiple print jobs and supports cancellation.",
    ],
    table: [
      { component: "Page description", role: "Defines page contents", example: "PCL / PostScript" },
      { component: "Spooler", role: "Queues jobs", example: "Windows Print Spooler" },
      { component: "Transport", role: "Sends data to device", example: "USB / IPP / Wi-Fi" },
    ],
    why: "The printer driver is the bridge between the digital document and the physical page. Issues here are the most common cause of garbled output, stuck queues, and offline printers.",
  },
  scanner: {
    name: "Scanner Driver",
    tagline: "Captures images and handles OCR exchange.",
    icon: <Scan className="w-7 h-7 text-teal-600" />,
    what: "A scanner driver controls flatbed and document scanners. It tells the OS how to start a scan, capture image data at the right resolution, and pass the result to applications for editing or OCR.",
    how: "An application requests a scan through an interface like TWAIN or WIA. The driver instructs the scanner to move the imaging sensor across the page, collects the pixel data, and delivers a finished image back to the application.",
    functions: [
      "Initiates and controls scan jobs at chosen resolutions.",
      "Selects colour mode, contrast, and brightness.",
      "Provides previews and cropping support.",
      "Bridges hardware to OCR and document software.",
    ],
    table: [
      { component: "Scan API", role: "App interface", example: "TWAIN / WIA" },
      { component: "Sensor controller", role: "Captures pixels", example: "CIS / CCD" },
      { component: "Image pipeline", role: "Cleans output", example: "Deskew, denoise" },
    ],
    why: "A reliable scanner driver decides how accurate, fast, and consistent your scans look. Without it, documents arrive blurred, skewed, or never reach the application at all.",
  },
  webcam: {
    name: "Webcam Driver",
    tagline: "Processes video stream capture and resolution.",
    icon: <Webcam className="w-7 h-7 text-teal-600" />,
    what: "A webcam driver allows the operating system to capture live video and stills from an attached camera. It manages resolution, frame rate, and image processing so meeting and recording apps receive a clean stream.",
    how: "The camera sensor captures frames continuously. The driver receives raw frames, applies adjustments such as exposure and white balance, and exposes the stream through a standard video interface that any application can consume.",
    functions: [
      "Negotiates resolution and frame rate with the camera.",
      "Controls exposure, focus, and white balance.",
      "Encodes frames into formats apps can read.",
      "Manages access so only one app uses the camera at a time.",
    ],
    table: [
      { component: "Video API", role: "Standard stream", example: "UVC / Media Foundation" },
      { component: "ISP", role: "Image processing", example: "Auto-exposure" },
      { component: "Encoder", role: "Compresses frames", example: "MJPEG / H.264" },
    ],
    why: "Sharp, well-lit video calls and recordings rely on the webcam driver. A weak driver causes laggy, washed-out, or completely missing video.",
  },
  bios: {
    name: "BIOS / UEFI Driver",
    tagline: "Initialises hardware before the OS loads.",
    icon: <Microchip className="w-7 h-7 text-purple-600" />,
    what: "BIOS and UEFI firmware act as the lowest-level driver layer of the system. They start the hardware, run early diagnostics, and hand control to the operating system loader.",
    how: "When power is applied, the firmware checks each major component, configures memory and CPU features, and selects a boot device. It then loads the OS bootloader and provides a minimal interface the OS uses until its own drivers are ready.",
    functions: [
      "Performs the power-on self-test (POST).",
      "Initialises memory, CPU features, and storage controllers.",
      "Selects and launches the boot loader.",
      "Provides runtime services for time, NVRAM, and secure boot.",
    ],
    table: [
      { component: "POST", role: "Hardware checks", example: "Memory test" },
      { component: "Boot manager", role: "OS selection", example: "UEFI boot order" },
      { component: "Secure Boot", role: "Trust verification", example: "Signed bootloader" },
    ],
    why: "Without functioning firmware, the computer never reaches the operating system. UEFI quality affects boot speed, hardware compatibility, and platform security.",
  },
  security: {
    name: "Security Driver",
    tagline: "Supports encryption and secure boot.",
    icon: <Shield className="w-7 h-7 text-purple-600" />,
    what: "Security drivers expose hardware-backed protections such as TPMs, secure enclaves, and disk encryption engines. They give the operating system a trustworthy place to store keys and verify integrity.",
    how: "The OS asks the security driver to perform sensitive operations like generating a key or measuring a boot component. The driver passes the request to a secure chip, which executes it in isolation and returns only the result.",
    functions: [
      "Stores and protects cryptographic keys.",
      "Measures boot components for integrity attestation.",
      "Accelerates disk and network encryption.",
      "Backs features like Windows Hello and FileVault.",
    ],
    table: [
      { component: "TPM", role: "Key storage", example: "TPM 2.0" },
      { component: "Secure enclave", role: "Isolated execution", example: "Apple Secure Enclave" },
      { component: "Crypto engine", role: "Hardware acceleration", example: "AES-NI" },
    ],
    why: "Security drivers protect identity, files, and the boot chain. Their correctness directly affects how resistant a device is to tampering or theft.",
  },
  monitor: {
    name: "Monitor Calibration Driver",
    tagline: "Manages colour accuracy and refresh rate.",
    icon: <MonitorSpeaker className="w-7 h-7 text-purple-600" />,
    what: "A monitor calibration driver loads a display's colour profile and refresh settings into the operating system. It ensures consistent colours and timing across applications, especially for design and video work.",
    how: "When the OS detects a display, it reads the device's EDID information. The driver applies the matching ICC profile and refresh configuration, and the GPU outputs frames using those settings.",
    functions: [
      "Loads ICC colour profiles per display.",
      "Sets resolution, refresh rate, and HDR mode.",
      "Manages multi-monitor arrangements.",
      "Supports adaptive sync technologies for smooth motion.",
    ],
    table: [
      { component: "EDID", role: "Display capabilities", example: "Resolution list" },
      { component: "ICC profile", role: "Colour mapping", example: "sRGB / Display P3" },
      { component: "Adaptive sync", role: "Smooth frames", example: "FreeSync / G-Sync" },
    ],
    why: "Accurate calibration matters for any visual work and for comfortable viewing. A missing or wrong profile leads to dull colours, flicker, or eye strain.",
  },
};

export default function DriverDetail() {
  const [, params] = useRoute<{ slug: string }>("/drivers/:slug");
  const slug = params?.slug ?? "";
  const driver = drivers[slug];

  if (!driver) {
    return (
      <Layout>
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h1 className="font-heading font-bold text-3xl mb-4">Driver Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We don't have a dedicated page for this driver yet.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <article className="py-12 px-4 bg-[#fafaf7]">
        <div className="container mx-auto max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          {/* Title */}
          <header className="mb-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-white border border-border flex items-center justify-center flex-shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                {driver.icon}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-1">
                  Driver Reference
                </div>
                <h1 className="font-heading font-bold text-3xl md:text-4xl text-[#111110] leading-tight">
                  {driver.name}
                </h1>
              </div>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">
              {driver.tagline}
            </p>
          </header>

          {/* What is this driver */}
          <section className="rounded-2xl bg-white border border-border p-6 md:p-8 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <h2 className="font-heading font-bold text-xl text-[#111110] mb-3">
              What is this driver?
            </h2>
            <p className="text-[15px] text-foreground/85 leading-relaxed">
              {driver.what}
            </p>
          </section>

          {/* How it works */}
          <section className="rounded-2xl bg-white border border-border p-6 md:p-8 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <h2 className="font-heading font-bold text-xl text-[#111110] mb-3">
              How it works
            </h2>
            <p className="text-[15px] text-foreground/85 leading-relaxed mb-6">
              {driver.how}
            </p>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#f4f6fb] rounded-xl p-5 border border-border">
              {["Hardware", "Driver", "Operating System", "Application"].map((label, i, arr) => (
                <div key={label} className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                  <div
                    className={`px-4 py-3 rounded-lg text-center text-sm font-semibold w-full md:w-auto md:min-w-[140px] ${
                      label === "Driver"
                        ? "bg-primary text-white shadow-md"
                        : "bg-white border border-border text-foreground"
                    }`}
                  >
                    {label}
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight className="hidden md:block w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Key functions */}
          <section className="rounded-2xl bg-white border border-border p-6 md:p-8 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <h2 className="font-heading font-bold text-xl text-[#111110] mb-4">
              Key functions
            </h2>
            <ul className="space-y-3">
              {driver.functions.map((f) => (
                <li key={f} className="flex gap-3 text-[15px] text-foreground/85 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Technical overview table */}
          <section className="rounded-2xl bg-white border border-border p-6 md:p-8 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <h2 className="font-heading font-bold text-xl text-[#111110] mb-4">
              Technical overview
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-[#f4f6fb] text-left">
                    <th className="py-3 px-4 font-semibold text-[#111110]">Component</th>
                    <th className="py-3 px-4 font-semibold text-[#111110]">Role</th>
                    <th className="py-3 px-4 font-semibold text-[#111110]">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {driver.table.map((row) => (
                    <tr key={row.component} className="border-b border-border last:border-0">
                      <td className="py-3 px-4 font-semibold text-[#111110]">{row.component}</td>
                      <td className="py-3 px-4 text-foreground/80">{row.role}</td>
                      <td className="py-3 px-4 text-muted-foreground">{row.example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Why it matters */}
          <section className="rounded-2xl bg-white border border-border p-6 md:p-8 mb-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <h2 className="font-heading font-bold text-xl text-[#111110] mb-3">
              Why it matters
            </h2>
            <p className="text-[15px] text-foreground/85 leading-relaxed">
              {driver.why}
            </p>
          </section>

          <div className="flex justify-between items-center pt-4 border-t border-border">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
            <Link
              href="/drivers"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Explore all drivers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
}
