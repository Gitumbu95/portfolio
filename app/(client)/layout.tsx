import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";


// ✅ Brand Metadata for ConceptDash
export const metadata: Metadata = {
  title: {
    template: "%s | ConceptDash254",
    default: "ConceptDash254 | Innovate. Connect. Simplify.",
  },
  description:
    "ConceptDash254 is your trusted e-commerce platform for tech, creativity, and innovation. Discover, shop, and experience convenience redefined.",
  keywords: [
    "ConceptDash254",
    "Concept Dash",
    "Tech Store Kenya",
    "Electronics",
    "E-commerce",
    "Innovation",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ConceptDash254 | Where Innovation Meets Simplicity",
    description:
      "Shop smarter with ConceptDash254 — your destination for quality tech and creative products across Kenya.",
    url: "https://conceptdash254.co.ke",
    siteName: "ConceptDash254",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ConceptDash254 - Smart Shopping Platform",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
};

// ✅ Root Layout Component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ClerkProvider>
  );
}