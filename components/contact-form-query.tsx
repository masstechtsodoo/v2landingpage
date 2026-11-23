"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import type { Dictionary } from "@/lib/dictionaries";

/** Contact form that pre-fills the product from ?product=… (set by "Request a quote"). */
export function ContactFormFromQuery(props: { dict: Dictionary["contact"]["form"]; email: string; className?: string }) {
  const product = useSearchParams().get("product")?.slice(0, 200) || undefined;
  return <ContactForm {...props} product={product} />;
}
