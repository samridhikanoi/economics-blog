import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Economics Desk — by Samridhi Kanoi",
    template: "%s | The Economics Desk",
  },
  description:
    "Analytical writing on inflation, labor markets, trade, and global macroeconomics by economics writer Samridhi Kanoi.",
  openGraph: {
    title: "The Economics Desk — by Samridhi Kanoi",
    description:
      "Analytical writing on inflation, labor markets, trade, and global macroeconomics.",
    siteName: "The Economics Desk",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Economics Desk — by Samridhi Kanoi",
    description:
      "Analytical writing on inflation, labor markets, trade, and global macroeconomics.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
