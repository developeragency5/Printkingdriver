import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingWidget from "./FloatingWidget";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatingWidget />
    </div>
  );
}
