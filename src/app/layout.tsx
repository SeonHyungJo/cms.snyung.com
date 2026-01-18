import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Drive MDX CMS - DB 없이 구글 드라이브로 운영하는 Next.js 블로그",
    template: "%s | Drive MDX CMS",
  },
  description:
    "DB 비용 $0! Google Drive를 저장소로 사용하는 오픈소스 헤드리스 CMS. Next.js 16 + Monaco Editor로 VS Code와 동일한 MDX 편집 경험.",
  keywords: [
    "Next.js 블로그",
    "Google Drive CMS",
    "MDX 에디터",
    "오픈소스 CMS",
    "헤드리스 CMS",
    "마크다운 블로그",
    "Monaco Editor",
    "무료 블로그 CMS",
  ],
  authors: [{ name: "snyung" }],
  creator: "snyung",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "Drive MDX CMS",
    title: "Drive MDX CMS - 무료 Google Drive 기반 블로그 CMS",
    description:
      "VS Code 경험 그대로 웹에서 MDX 작성. 데이터베이스 비용 없이 개인 블로그 운영.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drive MDX CMS",
    description: "Google Drive를 백엔드로 사용하는 무료 오픈소스 블로그 CMS",
  },
  robots: {
    index: true,
    follow: true,
  },
  // Search Console 사이트 소유권 확인
  verification: {
    google: "hDzzkGSdcpcCt94YWZs1eqeK8tpkC5ZT0UjypZ3H3JQ",
  },
  // 네이버 Search Advisor
  other: {
    "naver-site-verification": "cd4a4f48683654955f8a711dd18ad192a66cb9d7",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Drive MDX CMS",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Google Drive를 백엔드로 사용하는 오픈소스 Next.js MDX 블로그 CMS",
  featureList: [
    "Google Drive 연동",
    "Monaco Editor 내장",
    "MDX 실시간 미리보기",
    "NextAuth.js 인증",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
