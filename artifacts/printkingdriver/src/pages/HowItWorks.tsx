import Layout from "@/components/Layout";
import { Link } from "wouter";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HowItWorks() {
  return (
    <Layout>
      <section className="bg-[#1c1c1a] text-white py-20 px-4 text-center">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-heading font-[800] text-3xl md:text-5xl mb-4">Get Your Printer Working in 3 Simple Steps</h1>
          <p className="text-lg text-[#a3a39a]">No technical knowledge required.</p>
        </div>
      </section>

      <section className="py-20 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-border -z-10"></div>
          
          <div className="bg-white rounded-2xl p-8 border border-border relative z-10 hover:shadow-lg transition-shadow">
            <div className="font-heading font-[800] text-[3rem] text-muted leading-none mb-4">01</div>
            <h3 className="font-heading font-[700] text-xl mb-4">Search Your Printer Model</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Enter your printer brand and model in our search bar. Our driver information guide will help you identify the correct driver you need.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-border relative z-10 hover:shadow-lg transition-shadow">
            <div className="font-heading font-[800] text-[3rem] text-muted leading-none mb-4">02</div>
            <h3 className="font-heading font-[700] text-xl mb-4">Identify the Right Driver</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Use our brand filters and OS compatibility tags to find the correct driver version for your Windows 10, Windows 11, or macOS system.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-border relative z-10 hover:shadow-lg transition-shadow">
            <div className="font-heading font-[800] text-[3rem] text-primary/20 leading-none mb-4">03</div>
            <h3 className="font-heading font-[700] text-xl mb-4 text-primary">Contact Our Team</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Still need help? Reach out to our support team via the contact page and a technician will guide you through the installation process.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white border-t border-border">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-heading font-bold text-3xl mb-10 text-center">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" data-testid="faq-item-1" className="border-border">
              <AccordionTrigger className="text-left font-semibold hover:text-primary">Is PrintKingDriver free to use?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Yes, our driver information directory is completely free to browse. Contact us if you need personalised assistance.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" data-testid="faq-item-2" className="border-border">
              <AccordionTrigger className="text-left font-semibold hover:text-primary">Are the drivers listed safe and official?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Our guides reference driver types and sources commonly associated with major printer manufacturers. We recommend always obtaining driver files directly from your printer manufacturer's official website.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" data-testid="faq-item-3" className="border-border">
              <AccordionTrigger className="text-left font-semibold hover:text-primary">What operating systems are supported?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Our directory covers drivers for Windows 10, Windows 11, and macOS. Linux support information is coming soon.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" data-testid="faq-item-4" className="border-border">
              <AccordionTrigger className="text-left font-semibold hover:text-primary">What if I cannot find my printer model?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Use the contact form and our technical team will manually identify the correct driver for your specific printer model.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" data-testid="faq-item-5" className="border-border">
              <AccordionTrigger className="text-left font-semibold hover:text-primary">How do I know which version to use?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Check the OS compatibility badges on each driver listing. We indicate the latest stable version supported for each operating system.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </Layout>
  );
}
