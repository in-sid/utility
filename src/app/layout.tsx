import type {Metadata} from 'next';
import './globals.css';
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: 'Bill Generator - Professional Document Utility',
  description: 'Generate professional utility bills and receipts with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <SidebarProvider defaultOpen={true}>
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
