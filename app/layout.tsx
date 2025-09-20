import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Illia - Turn Websites into LLM-Ready Data",
  description: "Power your AI apps with clean data crawled from any website. Extract, search, map and crawl web content with our open-source web scraping API.",
  keywords: "web scraping, data extraction, AI data, LLM data, API, crawling, web crawler",
  openGraph: {
    title: "Illia - Turn Websites into LLM-Ready Data",
    description: "Power your AI apps with clean data crawled from any website.",
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
        {children}
      </body>
    </html>
  );
}
