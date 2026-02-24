import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Permanent_Marker } from 'next/font/google'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const permanentMarker = Permanent_Marker({
  weight: '400', // Permanent Marker solo tiene un peso: 400
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-permanent-marker', // Variable CSS para usarla con Tailwind
})

export const metadata: Metadata = {
  title: "Magios Guild",
  description: "Turtle WoW - Guild",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${permanentMarker.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
