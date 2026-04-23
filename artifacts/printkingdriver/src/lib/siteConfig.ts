export type SiteLink = { label: string; href: string };

export const site = {
  name: "PrintKingDriver",
  domain: "PrintKingDriver.com",
  tagline: "Your trusted source for printer & system driver information.",
};

export const mainNav: SiteLink[] = [
  { label: "Home", href: "/" },
  { label: "Explore Drivers", href: "/drivers" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Guide", href: "/about" },
];

export const driverPages: SiteLink[] = [
  { label: "Chipset Driver", href: "/drivers/chipset" },
  { label: "Graphics Driver", href: "/drivers/graphics" },
  { label: "Audio Driver", href: "/drivers/audio" },
  { label: "Network Driver", href: "/drivers/network" },
  { label: "Storage Controller", href: "/drivers/storage" },
  { label: "USB Support", href: "/drivers/usb" },
  { label: "Bluetooth Driver", href: "/drivers/bluetooth" },
  { label: "Input Drivers", href: "/drivers/input" },
  { label: "Printer Driver", href: "/drivers/printer" },
  { label: "Scanner Support", href: "/drivers/scanner" },
  { label: "Webcam Driver", href: "/drivers/webcam" },
  { label: "BIOS / UEFI", href: "/drivers/bios" },
  { label: "Security Drivers", href: "/drivers/security" },
  { label: "Monitor Driver", href: "/drivers/monitor" },
];

export const supportLinks: SiteLink[] = [
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/how-it-works" },
  { label: "Technical Support", href: "/contact" },
  { label: "Documentation Library", href: "/drivers" },
];

export const legalLinks: SiteLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];
