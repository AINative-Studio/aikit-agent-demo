import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'agent-browser-demo',
  description: 'Built with AI Kit',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
