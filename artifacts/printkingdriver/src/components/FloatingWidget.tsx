import { useEffect, useState } from "react";
import { Link } from "wouter";

export default function FloatingWidget() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-opacity duration-500 ease-in-out ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <Link
        href="/contact"
        aria-label="Contact our technicians"
        className="bg-white px-4 py-2.5 rounded-full shadow-lg border border-border flex items-center gap-2 hover:shadow-xl hover:bg-[#fafafa] transition-all"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-dot"></div>
        <span className="text-xs font-bold tracking-wider text-foreground">TECHNICIANS ONLINE</span>
      </Link>
    </div>
  );
}
