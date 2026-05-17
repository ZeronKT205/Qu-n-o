import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'BST Sống Chất Mặc Chất | Thời Trang Streetwear Nam Nữ - Levents Clone',
  description:
    'Khám phá bộ sưu tập "Sống chất mặc chất" từ Levents Clone. Thời trang streetwear nam nữ thiết kế tối giản, cao cấp và năng động. Mua ngay để nhận ưu đãi!',
  keywords: [
    'áo thun streetwear',
    'thời trang nam nữ',
    'Levents',
    'thời trang streetwear',
    'sống chất mặc chất',
    'thời trang cao cấp',
  ],
  openGraph: {
    title: 'BST Sống Chất Mặc Chất | Levents Clone',
    description:
      'Thời trang streetwear nam nữ thiết kế tối giản, cao cấp và năng động.',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Levents Clone',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
