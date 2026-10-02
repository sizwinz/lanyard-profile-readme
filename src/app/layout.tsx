import type { Metadata } from "next";
import "./globals.css";
import { CSideScript } from "@c-side/next";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Lanyard for GitHub Profile",
  description: "Display your Discord Presence anywhere, using Lanyard",
  openGraph: {
    title: "Lanyard for GitHub Profile",
    description: "Display your Discord Presence anywhere, using Lanyard",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <CSideScript />
      </Head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
