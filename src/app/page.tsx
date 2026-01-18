"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/onboarding");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <article className="flex flex-col items-center gap-8 max-w-2xl text-center">
          <header className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-12 h-12 text-primary" aria-hidden="true" />
              <h1 className="text-4xl font-bold">Drive MDX CMS</h1>
            </div>
            <p className="text-xl text-muted-foreground">
              DB 비용 없이 Google Drive를 백엔드로 사용하는 블로그 CMS.
              <br />
              VS Code와 동일한 Monaco Editor로 MDX를 편집하세요.
            </p>
          </header>

          <nav aria-label="시작하기">
            <Link href="/auth/signin">
              <Button size="lg" className="flex items-center gap-2">
                무료로 시작하기
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
          </nav>

          <section aria-labelledby="features-heading" className="mt-8">
            <h2 id="features-heading" className="sr-only">
              주요 기능
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 list-none p-0">
              <li className="p-6 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">Google Drive 연동</h3>
                <p className="text-sm text-muted-foreground">
                  별도 DB 없이 월 $0로 블로그 운영. 15GB 무료 저장 공간 활용.
                </p>
              </li>
              <li className="p-6 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">안전한 인증</h3>
                <p className="text-sm text-muted-foreground">
                  NextAuth.js + Google OAuth로 내 드라이브만 안전하게 접근.
                </p>
              </li>
              <li className="p-6 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">Monaco Editor</h3>
                <p className="text-sm text-muted-foreground">
                  VS Code 편집 경험 그대로. 코드 하이라이팅, 자동완성 지원.
                </p>
              </li>
            </ul>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
