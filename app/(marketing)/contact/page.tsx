import Link from "next/link";
import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = { title: "Contact", description: "Get in touch with the Kodshala team.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <div className="container-cv grid gap-12 py-16 lg:grid-cols-2">
      <div>
        <h1 className="mt-3 font-heading text-4xl font-bold md:text-5xl">Let&apos;s talk</h1>
        <p className="mt-4 max-w-md text-muted-foreground">Questions, partnerships, bug reports or feature ideas, we read every message and reply within 2 working days.</p>
        <ul className="mt-8 space-y-4 text-sm">
          <li className="flex items-center gap-3"><Mail className="size-5 text-cyan" /> support@kodshala.com</li>
          <li className="flex items-center gap-3"><MessageCircle className="size-5 text-cyan" /> Doubts about a problem? Ask in the <Link href="/doubts" className="underline">Doubts forum</Link></li>
          <li className="flex items-center gap-3"><MapPin className="size-5 text-cyan" /> HSR Layout, Bengaluru, Karnataka 560102</li>
        </ul>
      </div>
      <ContactForm />
    </div>
  );
}
