import { Link } from "wouter";
import { Printer } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1c1c1a] text-[#a3a39a] py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0">
                <Printer size={18} />
              </div>
              <div className="font-heading font-bold text-white text-lg">PrintKingDriver</div>
            </Link>
            <p className="text-sm leading-relaxed">Your trusted source for printer & system driver information.</p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/"><span className="hover:text-white transition-colors cursor-pointer">Home</span></Link></li>
              <li><Link href="/drivers"><span className="hover:text-white transition-colors cursor-pointer">Explore Drivers</span></Link></li>
              <li><Link href="/how-it-works"><span className="hover:text-white transition-colors cursor-pointer">How It Works</span></Link></li>
              <li><Link href="/about"><span className="hover:text-white transition-colors cursor-pointer">About</span></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact"><span className="hover:text-white transition-colors cursor-pointer">Contact Us</span></Link></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Technical Support</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[#2a2a28] flex items-center justify-between text-sm">
          <p>© 2025 PrintKingDriver.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
