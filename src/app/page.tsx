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
        <div className="flex flex-col items-center gap-8 max-w-2xl text-center">
          <div className="flex items-center gap-3">
            <FolderOpen className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">Drive MDX CMS</h1>
          </div>

          <p className="text-xl text-muted-foreground">
            Google Drive를 기반으로 한 콘텐츠 관리 시스템입니다.
            <br />
            Markdown 파일을 편집하고 바로 저장할 수 있습니다.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/auth/signin">
              <Button size="lg" className="flex items-center gap-2">
                시작하기
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Google Drive 연동</h3>
              <p className="text-sm text-muted-foreground">
                본인의 Google Drive에 파일을 직접 편집하고 저장합니다.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">안전한 접근</h3>
              <p className="text-sm text-muted-foreground">
                앱이 생성한 파일에만 접근하여 개인정보를 보호합니다.
              </p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Monaco Editor</h3>
              <p className="text-sm text-muted-foreground">
                VS Code와 동일한 에디터로 편안하게 작성합니다.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
