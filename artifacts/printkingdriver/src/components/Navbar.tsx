import { Link, useLocation } from "wouter";
import { Search, Menu, Printer } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/drivers", label: "Explore Drivers" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/about", label: "About Guide" }
  ];

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
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search hardware, drivers or firmware..." 
              className="w-full h-10 pl-9 pr-4 rounded-full bg-secondary border-none focus:ring-2 focus:ring-primary/20 text-sm outline-none"
              readOnly
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-6">
            {links.map(link => (
              <Link key={link.href} href={link.href}>
                <span className={`text-sm font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-foreground"}`}>
                  {link.label}
                </span>
              </Link>
            ))}
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
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col gap-6 mt-8">
              {links.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                  <span className={`text-lg font-medium transition-colors hover:text-primary ${location === link.href ? "text-primary" : "text-foreground"}`}>
                    {link.label}
                  </span>
                </Link>
              ))}
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
