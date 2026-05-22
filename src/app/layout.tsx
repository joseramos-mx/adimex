import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import WhatsAppButton from "@/components/whatsapp-button";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import CartDrawer from "@/components/cart-drawer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://adimex.io"),
  title: {
    default: "ADIMEX | Automatización Industrial México — PLCs, Servomotores, SCADA",
    template: "%s | ADIMEX",
  },
  description:
    "Distribuidor autorizado FLEXEM en México. PLCs FL7, servomotores FV5-E, HMI capacitiva, FlexSCADA e IoT para automatización industrial de precisión.",
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://adimex.io",
    siteName: "American Digital de México",
    title: "ADIMEX | Automatización Industrial México",
    description:
      "Distribuidor autorizado FLEXEM en México. PLCs, servomotores, HMI, SCADA e IoT para automatización industrial de precisión.",
    images: [
      {
        url: "/og-banner.png",
        width: 1200,
        height: 630,
        alt: "ADIMEX Automatización Industrial México",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ADIMEX | Automatización Industrial México",
    description:
      "PLCs FL7, servomotores FV5-E, HMI, SCADA e IoT. Distribuidor autorizado FLEXEM en México.",
    images: ["/og-banner.png"],
  },
  alternates: {
    canonical: "https://adimex.io",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico" },
    ],
    apple: "/favicon/apple-touch-icon.png",
    other: [{ rel: "manifest", url: "/favicon/site.webmanifest" }],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ADIMEX",
  url: "https://adimex.io",
  logo: "https://adimex.io/logo.svg",
  description:
    "Distribuidor autorizado FLEXEM en México. PLCs FL7, servomotores FV5-E, HMI capacitiva, FlexSCADA e IoT para automatización industrial de precisión.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ciudad de México",
    addressCountry: "MX",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    availableLanguage: "Spanish",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" forcedTheme="light">
          <AuthProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <WhatsAppButton />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
