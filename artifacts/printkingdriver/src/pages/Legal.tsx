import { Link, useRoute } from "wouter";
import Layout from "@/components/Layout";
import { ArrowLeft } from "lucide-react";

const content: Record<string, { title: string; tagline: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: "Privacy Policy",
    tagline: "How PrintKingDriver handles information on this informational site.",
    sections: [
      {
        heading: "Overview",
        body: "PrintKingDriver.com is an informational website that explains how printer and system drivers work. It does not sell or distribute software, and does not require accounts or sign-ins to read its guides.",
      },
      {
        heading: "Information We Collect",
        body: "When you browse this site, your browser may send standard request data such as your IP address, the page you requested, and your user agent. This information is used only to deliver the page and to keep the service running.",
      },
      {
        heading: "Cookies",
        body: "This site does not set tracking cookies for advertising. Any cookies present are limited to functional preferences such as remembering your last visited page.",
      },
      {
        heading: "Contact Forms",
        body: "If you choose to send a message through the contact page, the details you provide are used solely to reply to your enquiry and are not shared with third parties.",
      },
      {
        heading: "Updates to This Policy",
        body: "We may update this policy from time to time. The date of the most recent change will always be displayed at the bottom of this page.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    tagline: "The conditions for using the PrintKingDriver informational portal.",
    sections: [
      {
        heading: "Use of the Website",
        body: "PrintKingDriver.com provides general information about printer and system drivers for educational purposes. By using this website, you agree to use it for lawful, informational purposes only.",
      },
      {
        heading: "No Software Distribution",
        body: "This site does not provide downloads or driver files. All driver software should be obtained directly from the manufacturer of your hardware.",
      },
      {
        heading: "Accuracy of Information",
        body: "We work to keep the content on this site accurate and up to date, but driver behaviour and operating system features change over time. The information here is provided as a general reference and not as professional advice.",
      },
      {
        heading: "Third-Party Names",
        body: "Brand names and product names mentioned on this website belong to their respective owners. References are made for educational purposes only and do not imply endorsement.",
      },
      {
        heading: "Limitation of Liability",
        body: "PrintKingDriver is not responsible for any damage that may result from acting on the information provided. Always test changes on non-critical systems first and consult a qualified technician when in doubt.",
      },
    ],
  },
};

export default function Legal() {
  const [, privacyParams] = useRoute("/privacy");
  const slug = privacyParams ? "privacy" : "terms";
  const data = content[slug];

  return (
    <Layout>
      <article className="py-12 px-4 bg-[#fafaf7]">
        <div className="container mx-auto max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <header className="mb-10">
            <div className="text-xs uppercase tracking-wider text-blue-700 font-semibold mb-2">Legal</div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-[#111110] leading-tight mb-3">
              {data.title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">{data.tagline}</p>
          </header>

          <div className="space-y-5">
            {data.sections.map((s) => (
              <section
                key={s.heading}
                className="rounded-2xl bg-white border border-border p-6 md:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <h2 className="font-heading font-bold text-lg text-[#111110] mb-3">{s.heading}</h2>
                <p className="text-[15px] text-foreground/85 leading-relaxed">{s.body}</p>
              </section>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-10">Last updated: April 2026</p>
        </div>
      </article>
    </Layout>
  );
}
