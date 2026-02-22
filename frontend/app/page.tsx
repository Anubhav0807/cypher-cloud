import type { Metadata } from "next";
import Navbar from "@/components/landing-page/Navbar";
import Hero from "@/components/landing-page/Hero";
import Features from "@/components/landing-page/Features";
// import SecurityHighlight from "@/components/landing-page/SecurityHighlight";
// import CTA from "@/components/CTA";
import Footer from "@/components/landing-page/Footer";

export const metadata: Metadata = {
  title: "CypherCloud — Secure Multi-Cloud Storage with Hybrid Encryption",
  description:
    "CypherCloud offers enterprise-grade hybrid encryption and encrypted sharding across AWS, GCP, and Azure. Quantum-safe. Zero-knowledge. Built for the future.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-white antialiased">
      <Navbar />
      <Hero />
      <Features />
      {/* <SecurityHighlight />
      <CTA /> */}
      <Footer />
    </main>
  );
}
