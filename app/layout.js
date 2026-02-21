import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-display",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-body",
});

export const metadata = {
  title: "To My Everything | A Love Letter",
  description: "A luxury digital love letter for someone special.",
};

import { AdminProvider } from '@/context/AdminContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} scroll-smooth`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased selection:bg-rose/30 selection:text-gold">
        <div className="grain" />
        <AdminProvider>
          {children}
        </AdminProvider>
      </body>
    </html>
  );
}
