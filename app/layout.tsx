import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToasterProvider } from '@/components/shared/ToasterProvider';
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
  title: "Apotekku - Solusi Manajemen Apotek Modern",
  description: "Platform manajemen apotek terpercaya dengan sistem terintegrasi untuk meningkatkan efisiensi dan kualitas pelayanan kesehatan di Indonesia",
  keywords: ["apotek", "manajemen apotek", "sistem apotek", "obat", "kesehatan", "farmasi"],
  authors: [{ name: "Apotekku Team" }],
  openGraph: {
    title: "Apotekku - Solusi Manajemen Apotek Modern",
    description: "Platform manajemen apotek terpercaya dengan sistem terintegrasi",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToasterProvider />
        {children}
      </body>
    </html>
  );
}
