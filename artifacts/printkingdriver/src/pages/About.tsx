import Layout from "@/components/Layout";
import { ShieldCheck, CheckSquare, Zap } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <section className="bg-primary text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-heading font-[800] text-4xl md:text-5xl mb-6">About PrintKingDriver</h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
            Helping users worldwide find the right printer driver information — quickly, safely, and for free.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-heading font-bold text-3xl mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            PrintKingDriver was built to simplify the confusing world of printer drivers. Whether you're a home user setting up a new printer or an IT professional managing multiple devices, our directory gives you accurate, up-to-date driver information for over 200 brands. We update our database daily with the latest official releases from all major manufacturers.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 container mx-auto max-w-5xl mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-background p-8 rounded-2xl border border-border text-center hover:border-primary/30 transition-colors">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Accuracy</h3>
            <p className="text-muted-foreground text-sm">Only official, verified driver information. No guesswork.</p>
          </div>
          
          <div className="bg-background p-8 rounded-2xl border border-border text-center hover:border-primary/30 transition-colors">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Safety</h3>
            <p className="text-muted-foreground text-sm">We never host files. All information links to official sources.</p>
          </div>
          
          <div className="bg-background p-8 rounded-2xl border border-border text-center hover:border-primary/30 transition-colors">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl mb-3">Simplicity</h3>
            <p className="text-muted-foreground text-sm">Find the driver information you need in under 2 minutes.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#1c1c1a] text-white py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-[#2a2a28]">
            <div className="px-4">
              <div className="text-4xl font-heading font-bold text-primary mb-2">50,000+</div>
              <div className="text-sm text-[#a3a39a] uppercase tracking-wider font-semibold">Drivers</div>
            </div>
            <div className="px-4">
              <div className="text-4xl font-heading font-bold text-primary mb-2">200+</div>
              <div className="text-sm text-[#a3a39a] uppercase tracking-wider font-semibold">Brands</div>
            </div>
            <div className="px-4">
              <div className="text-4xl font-heading font-bold text-primary mb-2">10M+</div>
              <div className="text-sm text-[#a3a39a] uppercase tracking-wider font-semibold">Visitors</div>
            </div>
            <div className="px-4">
              <div className="text-4xl font-heading font-bold text-primary mb-2">Daily</div>
              <div className="text-sm text-[#a3a39a] uppercase tracking-wider font-semibold">Updated</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 container mx-auto max-w-4xl text-center">
        <h2 className="font-heading font-bold text-3xl mb-12">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-bold mb-4 shadow-inner">AM</div>
            <h4 className="font-heading font-bold text-lg">Alex Morgan</h4>
            <p className="text-sm text-muted-foreground">Founder & Lead Engineer</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl font-bold mb-4 shadow-inner">SC</div>
            <h4 className="font-heading font-bold text-lg">Sarah Chen</h4>
            <p className="text-sm text-muted-foreground">Driver Database Manager</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-2xl font-bold mb-4 shadow-inner">RP</div>
            <h4 className="font-heading font-bold text-lg">Raj Patel</h4>
            <p className="text-sm text-muted-foreground">Technical Support Lead</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
