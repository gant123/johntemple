import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Temple Property Care | Orange TX Lawn Care & Property Maintenance",
  description:
    "Request a free quote from Temple Property Care for honest lawn mowing, edging, bush trimming, yard cleanup, leaf removal, and property maintenance in Orange, Bridge City, West Orange, Vidor, Mauriceville, and Southeast Texas.",
  keywords: [
    "Orange TX Lawn Care",
    "Bridge City Lawn Care",
    "West Orange Lawn Care",
    "Property Maintenance",
    "Lawn Mowing Near Me",
    "Southeast Texas lawn care",
  ],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
