import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "V3school",
  description: "Learn C++ in English and Urdu with Gemini.",
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
