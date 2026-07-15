import type { Metadata } from "next";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { Section, Container } from "@/components/ui/Primitives";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact \u2014 Konita AI",
  description: "Get in touch with the Konita AI team.",
};

const CONTACT_METHODS = [
  { icon: Mail, label: "Email", value: "knootix@gmail.com", href: "mailto:knootix@gmail.com" },
  { icon: Instagram, label: "Instagram", value: "@knootix", href: "https://instagram.com/knootix" },
  { icon: MessageCircle, label: "WhatsApp", value: "+92 341 4680668", href: "https://wa.me/923414680668" },
  { icon: MapPin, label: "Location", value: "Lahore, Pakistan", href: undefined },
];

export default function ContactPage() {
  return (
    <Section
      eyebrow="Contact"
      title="We'd love to hear from you"
      description="Questions, feedback, or partnership ideas — reach out any way that's convenient."
      className="pt-20 sm:pt-28"
    >
      <Container className="!px-0">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col gap-4">
            {CONTACT_METHODS.map((method) => (
              <Card key={method.label} className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                  <method.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-mist-500">{method.label}</p>
                  {method.href ? (
                    <a
                      href={method.href}
                      target={method.href.startsWith("http") ? "_blank" : undefined}
                      rel={method.href.startsWith("http") ? "noreferrer noopener" : undefined}
                      className="mt-1 block truncate text-sm font-medium text-mist-100 transition hover:text-emerald-300"
                    >
                      {method.value}
                    </a>
                  ) : (
                    <p className="mt-1 truncate text-sm font-medium text-mist-100">{method.value}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
