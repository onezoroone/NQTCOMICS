import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: `Trang Chủ -  ${process.env.NEXT_PUBPIC_BASE_NAME}`,
  description: `Web đọc truyện tranh manhwa, manhua, manga, ngôn tình, tiên hiệp, kiếm hiệp online hay và mới nhất cập nhật liên tục tại ${process.env.NEXT_PUBPIC_BASE_NAME}`,
  openGraph: {
    title: `Trang Chủ -  ${process.env.NEXT_PUBPIC_BASE_NAME}`,
    description: `Web đọc truyện tranh manhwa, manhua, manga, ngôn tình, tiên hiệp, kiếm hiệp online hay và mới nhất cập nhật liên tục tại ${process.env.NEXT_PUBPIC_BASE_NAME}`,
    type: "website",
    locale: "vi_VN",
    siteName: `${process.env.NEXT_PUBPIC_BASE_NAME}`,
    images: [
      {
        url: `${process.env.NEXT_PUBPIC_BASE_URL}/favicon.png`,
        width: 800,
        height: 600,
        alt: `Trang Chủ -  ${process.env.NEXT_PUBPIC_BASE_NAME}`,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" id="nqtcomics">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
