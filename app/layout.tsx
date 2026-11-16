import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-jakarta', display: 'swap' });

export const metadata: Metadata = {
  title: 'Tamkeen | From relief to self-reliance',
  description: 'Helping families in Pakistan move from immediate relief to a livelihood of their own.',
  openGraph: {
    title: 'Tamkeen | From relief to self-reliance',
    description: 'Groceries, blankets and shoes come first. Then skills, tools and interest-free loans until a family earns a living of its own.',
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#303236' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={jakarta.variable} suppressHydrationWarning>
    <head>
      {/* Mark JS before first paint so scroll reveals never hide content when JS is unavailable. */}
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
    </head>
    <body>{children}</body>
  </html>;
}
