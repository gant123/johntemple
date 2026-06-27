import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = "https://templepropertycare.com";
const title = "Temple Property Care | Orange TX Lawn Care & Property Maintenance";
const description =
  "Honest, reliable lawn care and property maintenance in Orange, Bridge City, West Orange, Vidor, Mauriceville, and Southeast Texas. Lawn mowing, edging, weed eating, yard cleanup, leaf removal, and seasonal maintenance. Request a free quote from John.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Temple Property Care",
  },
  description,
  applicationName: "Temple Property Care",
  keywords: [
    "Orange TX Lawn Care",
    "Bridge City Lawn Care",
    "West Orange Lawn Care",
    "Vidor Lawn Care",
    "Mauriceville Lawn Care",
    "Lawn Mowing Near Me",
    "Property Maintenance",
    "Yard Cleanup",
    "Leaf Removal",
    "Southeast Texas lawn care",
  ],
  authors: [{ name: "Temple Property Care" }],
  creator: "Temple Property Care",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Temple Property Care",
    title,
    description,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Temple Property Care — Lawn Care & Property Maintenance in Orange, TX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

const services = [
  "Lawn Mowing",
  "Edging",
  "Weed Eating",
  "Yard Cleanup",
  "Leaf Removal",
  "Seasonal Property Maintenance",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Temple Property Care",
  image: `${siteUrl}/og-image.jpg`,
  logo: `${siteUrl}/logo.png`,
  url: siteUrl,
  description,
  slogan: "Reliable. Honest. Quality work.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Orange",
    addressRegion: "TX",
    addressCountry: "US",
  },
  areaServed: [
    "Orange, TX",
    "Bridge City, TX",
    "West Orange, TX",
    "Vidor, TX",
    "Mauriceville, TX",
  ].map((name) => ({ "@type": "City", name })),
  makesOffer: services.map((name) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
