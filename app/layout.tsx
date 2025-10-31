import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
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
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10b981',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
