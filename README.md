# Drive MDX CMS

> Google Drive를 무료 DB로 사용하는 Next.js 기반 마크다운 CMS

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-black?style=flat-square)](https://ui.shadcn.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

## Screenshots

### 1. 랜딩 페이지

> Google 로그인 버튼이 있는 메인 화면

<img width="2538" height="1345" alt="Image" src="https://github.com/user-attachments/assets/a4dbcdad-5ebd-41f6-a1b2-5dc19ca2293c" />

<img width="2538" height="1345" alt="Image" src="https://github.com/user-attachments/assets/4bb0ef54-86ab-428c-b093-5a268590f1af" />

---

### 2. 폴더 선택 (온보딩)

> Google Drive 폴더를 선택하거나 새로 생성하는 화면

<img width="2538" height="1345" alt="Image" src="https://github.com/user-attachments/assets/dbcb9afd-c46d-4c5e-aa6b-466664dd6a6b" />

---

### 3. 에디터 - 전체 화면

> 파일 트리 + Monaco 에디터 + MDX 미리보기가 함께 보이는 Split View

<img width="2538" height="1345" alt="Image" src="https://github.com/user-attachments/assets/9a971a52-11ab-4add-9d04-2188de830bed" />

---

### 4. 에디터 - MDX 미리보기

> 마크다운 작성 시 실시간으로 렌더링되는 미리보기 영역

<img width="2538" height="1345" alt="Image" src="https://github.com/user-attachments/assets/222e11b9-c190-4229-b03e-f9b12a54a5c8" />

---

## Features

| Feature                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| **Google Drive as DB** | 별도 데이터베이스 비용 $0. Google Drive에 직접 저장 |
| **Monaco Editor**      | VS Code와 동일한 강력한 마크다운/MDX 편집 경험      |
| **File Tree System**   | 드라이브 폴더 구조 그대로 반영, 실시간 동기화       |
| **Live Preview**       | MDX 실시간 미리보기 지원                            |
| **SEO Ready**          | Sitemap 자동 생성, Semantic HTML 구조               |
| **Secure**             | NextAuth.js & Google OAuth 기반 안전한 인증         |

---

## Tech Stack

| Category             | Technology                   |
| -------------------- | ---------------------------- |
| **Framework**        | Next.js 16 (App Router)      |
| **Language**         | TypeScript                   |
| **Styling**          | Tailwind CSS, shadcn/ui      |
| **State Management** | Zustand                      |
| **Data Fetching**    | TanStack Query (React Query) |
| **Validation**       | Zod                          |
| **Authentication**   | NextAuth.js                  |
| **Editor**           | Monaco Editor                |
| **Package Manager**  | pnpm                         |

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Google Cloud Console 프로젝트

### Installation

```bash
# 1. 레포지토리 클론
git clone https://github.com/your-username/drive-mdx-cms.git
cd drive-mdx-cms

# 2. 의존성 설치
pnpm install

# 3. 환경 변수 설정
cp .env.example .env.local

# 4. 개발 서버 실행
pnpm dev
```

### Environment Variables

`.env.local` 파일에 다음 환경 변수를 설정하세요:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

<details>
<summary><strong>Google Cloud Console 설정 가이드</strong></summary>

### 1. Google Cloud Console에서 프로젝트 생성

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택

### 2. Google Drive API 활성화

1. **APIs & Services** > **Library** 이동
2. "Google Drive API" 검색 후 **Enable** 클릭

### 3. OAuth 동의 화면 설정

1. **APIs & Services** > **OAuth consent screen** 이동
2. User Type: **External** 선택
3. 앱 정보 입력:
   - App name: `Drive MDX CMS`
   - User support email: 본인 이메일
   - Developer contact: 본인 이메일
4. Scopes 추가:
   - `openid`
   - `email`
   - `profile`
   - `https://www.googleapis.com/auth/drive`

### 4. OAuth 2.0 Client ID 생성

1. **APIs & Services** > **Credentials** 이동
2. **Create Credentials** > **OAuth client ID** 클릭
3. Application type: **Web application**
4. Authorized redirect URIs 추가:
   - `http://localhost:3000/api/auth/callback/google` (개발)
   - `https://your-domain.com/api/auth/callback/google` (프로덕션)
5. Client ID와 Client Secret을 `.env.local`에 복사

</details>

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # 인증 페이지
│   ├── editor/            # 에디터 페이지
│   ├── onboarding/        # 온보딩 페이지
│   └── sitemap.ts         # 동적 사이트맵
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트
│   ├── FileTree.tsx      # 파일 트리
│   ├── MdxPreview.tsx    # MDX 미리보기
│   └── MdxComponents.tsx # 시멘틱 MDX 컴포넌트
├── hooks/                 # Custom Hooks
│   └── useApi.ts         # TanStack Query 훅
├── lib/                   # 유틸리티
│   ├── auth.ts           # NextAuth 설정
│   └── google-drive.ts   # Google Drive API
└── store/                 # Zustand 스토어
```

---

## Scripts

```bash
pnpm dev        # 개발 서버 실행
pnpm build      # 프로덕션 빌드
pnpm start      # 프로덕션 서버 실행
pnpm lint       # ESLint 실행
pnpm type-check # TypeScript 타입 체크
```

---

## Contributing

기여를 환영합니다! 이슈나 PR을 자유롭게 제출해주세요.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [TanStack Query](https://tanstack.com/query)
