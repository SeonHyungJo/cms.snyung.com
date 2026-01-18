import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            돌아가기
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-8">서비스 이용약관</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">최종 수정일: 2026년 1월</p>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">1. 서비스 개요</h2>
            <p>
              본 서비스(&quot;Drive MDX CMS&quot;)는 사용자의 Google Drive에 저장된
              MDX/Markdown 파일을 웹 브라우저에서 편집할 수 있는 도구를
              제공합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">
              2. 서비스 이용 조건
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>본 서비스를 이용하려면 Google 계정이 필요합니다.</li>
              <li>사용자는 Google Drive API 접근 권한을 부여해야 합니다.</li>
              <li>사용자는 본 약관 및 개인정보처리방침에 동의해야 합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">3. 사용자 책임</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>사용자는 자신의 Google 계정 보안에 대한 책임이 있습니다.</li>
              <li>
                사용자는 본 서비스를 통해 작성/편집하는 콘텐츠에 대한 책임이
                있습니다.
              </li>
              <li>사용자는 불법적인 목적으로 서비스를 이용해서는 안 됩니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">4. 책임의 한계</h2>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-medium mb-2">중요 안내:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>데이터 백업:</strong> 본 서비스는 데이터 백업 기능을
                  제공하지 않습니다. 중요한 파일은 별도로 백업하시기 바랍니다.
                </li>
                <li>
                  <strong>데이터 손실:</strong> 서비스 이용 중 발생하는 데이터
                  손실에 대해 본 서비스는 책임지지 않습니다.
                </li>
                <li>
                  <strong>서비스 중단:</strong> 시스템 점검, 장애, 기타 사유로
                  인한 서비스 중단에 대해 사전 고지 없이 진행될 수 있습니다.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">
              5. 서비스 변경 및 종료
            </h2>
            <p>
              본 서비스는 사전 고지 후 변경되거나 종료될 수 있습니다. 서비스
              종료 시 사용자에게 최소 30일 전에 고지합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">
              6. Google API 이용
            </h2>
            <p>
              본 서비스는 Google Drive API를 사용합니다. Google API 이용에 관한
              사항은 Google의{" "}
              <a
                href="https://developers.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                API 서비스 이용약관
              </a>
              이 적용됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">7. 지적재산권</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>사용자가 작성한 콘텐츠의 저작권은 사용자에게 있습니다.</li>
              <li>
                본 서비스의 소프트웨어, 디자인, 로고 등의 권리는 서비스
                제공자에게 있습니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">8. 분쟁 해결</h2>
            <p>본 약관과 관련된 분쟁은 대한민국 법률에 따라 해결됩니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">9. 약관 변경</h2>
            <p>
              본 약관은 서비스 운영상 필요에 따라 변경될 수 있습니다. 변경 시 본
              페이지에 공지하며, 중요한 변경사항은 서비스 내에서 별도
              안내합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">10. 문의</h2>
            <p>약관 관련 문의사항이 있으시면 아래로 연락해 주세요:</p>
            <p className="mt-2">이메일: seonhyung.jo@gmail.com</p>
          </section>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
