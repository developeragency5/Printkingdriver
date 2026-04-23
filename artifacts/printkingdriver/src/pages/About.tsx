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
            PrintKingDriver was built to simplify the confusing world of printer drivers. Whether you're a home user setting up a new printer or an IT professional managing multiple devices, our guide gives you clear, straightforward information to help you identify, troubleshoot, and choose the right driver for your printer.
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
            <p className="text-muted-foreground text-sm">Clear, straightforward driver information to help you make the right choice.</p>
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


    </Layout>
  );
}
