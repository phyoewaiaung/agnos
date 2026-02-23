import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "../components/providers/SocketProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",  
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agnos Health Assignment",
  description: "Real-time patient input form and staff view system",
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
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
