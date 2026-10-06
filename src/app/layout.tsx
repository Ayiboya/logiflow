import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LogiFlow✦ | Logistics & Inventory Management for Startups in Ghana',
  description: 'A technology-driven logistics and inventory coordination system designed for Ghanaian startups and SMEs.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="min-h-screen bg-paper text-ink font-sans selection:bg-primary selection:text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
