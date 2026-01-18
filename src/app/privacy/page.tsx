import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
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

        <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
          <p className="text-muted-foreground">최종 수정일: 2026년 1월</p>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">
              1. 수집하는 개인정보
            </h2>
            <p>
              본 서비스는 Google OAuth를 통한 로그인 시 다음 정보에 접근합니다:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Google 계정 이메일 주소</li>
              <li>Google 계정 프로필 정보 (이름, 프로필 사진)</li>
              <li>Google Drive 파일 접근 권한</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">
              2. 개인정보 이용 목적
            </h2>
            <p>수집된 정보는 다음 목적으로만 사용됩니다:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>사용자 인증 및 로그인 세션 관리</li>
              <li>Google Drive 내 MDX/Markdown 파일 편집 기능 제공</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">3. 데이터 저장</h2>
            <p>
              <strong>
                본 서비스는 사용자의 Google Drive 데이터를 자체 서버에 저장하지
                않습니다.
              </strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>모든 파일은 사용자 본인의 Google Drive에만 저장됩니다.</li>
              <li>
                본 서비스는 편집 기능을 제공할 뿐, 파일 데이터를 복제하거나
                보관하지 않습니다.
              </li>
              <li>
                로그인 세션 정보는 브라우저의 쿠키와 로컬 스토리지에 일시적으로
                저장되며, 로그아웃 시 삭제됩니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">
              4. Google Drive 권한
            </h2>
            <p>
              본 서비스는 <code>drive</code> 범위를 사용하여 Google Drive에
              접근합니다:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>사용자가 선택한 폴더 내의 파일만 읽고 편집합니다</li>
              <li>파일 목록 조회, 파일 읽기/쓰기, 폴더 생성 기능을 사용합니다</li>
              <li>사용자가 명시적으로 선택하지 않은 파일은 수정하지 않습니다</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">5. 제3자 공유</h2>
            <p>
              본 서비스는 사용자의 개인정보를 제3자와 공유하지 않습니다. 단,
              서비스 운영에 필요한 Google API 호출 시 Google의
              개인정보처리방침이 적용됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">6. 사용자 권리</h2>
            <p>사용자는 언제든지 다음 권리를 행사할 수 있습니다:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Google 계정 설정에서 본 앱의 접근 권한 철회</li>
              <li>브라우저에서 쿠키 및 로컬 스토리지 삭제</li>
              <li>계정 삭제 요청</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">7. 문의</h2>
            <p>개인정보 관련 문의사항이 있으시면 아래로 연락해 주세요:</p>
            <p className="mt-2">이메일: seonhyung.jo@gmail.com</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-4">8. 변경사항</h2>
            <p>
              본 개인정보처리방침은 법령 변경이나 서비스 변경에 따라 수정될 수
              있습니다. 변경 시 본 페이지에 공지됩니다.
            </p>
          </section>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
