import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ChefAI — AI-Powered Recipe Generator",
    template: "%s | ChefAI",
  },
  description:
    "Tell us what's in your kitchen and let AI create the perfect recipe — personalized, nutritious, and delicious.",
  keywords: [
    "AI recipes",
    "recipe generator",
    "cooking AI",
    "meal planner",
    "ingredient-based recipes",
  ],
  authors: [{ name: "ChefAI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "ChefAI",
    title: "ChefAI — What can you cook today?",
    description:
      "Tell us what's in your kitchen and let AI create the perfect recipe.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChefAI — AI-Powered Recipe Generator",
    description:
      "Tell us what's in your kitchen and let AI create the perfect recipe.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
