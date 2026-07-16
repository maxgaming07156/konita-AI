import Script from "next/script";

export function GlobalJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Konita Tutor AI",
        operatingSystem: "Web",
        applicationCategory: "EducationalApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description: "Konita AI is a personalized AI language tutor that helps you learn languages faster by providing instant grammar explanations, vocabulary breakdowns, and conversation practice.",
        creator: {
          "@type": "Organization",
          name: "Knootix AI",
          url: "https://konita-ai.vercel.app",
        },
      },
      {
        "@type": "EducationalOrganization",
        name: "Knootix AI",
        url: "https://konita-ai.vercel.app",
        description: "An AI-powered education technology company building next-generation language learning tools.",
      },
    ],
  };

  return (
    <Script
      id="global-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
