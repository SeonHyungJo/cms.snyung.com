import { NextResponse } from "next/server";

interface GoogleApiError {
  code?: number;
  message?: string;
  errors?: Array<{
    reason?: string;
    domain?: string;
    message?: string;
  }>;
}

export function handleGoogleApiError(error: unknown): NextResponse {
  console.error("Google API Error:", error);

  // Check if it's a Google API error
  const apiError = error as { code?: number; response?: { data?: { error?: GoogleApiError } } };

  // Rate limit / Quota exceeded
  if (apiError?.code === 429 || apiError?.response?.data?.error?.code === 429) {
    return NextResponse.json(
      { error: "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  // Check for quota exceeded in error message
  const errorMessage = String(error);
  if (
    errorMessage.includes("quota") ||
    errorMessage.includes("rateLimitExceeded") ||
    errorMessage.includes("userRateLimitExceeded")
  ) {
    return NextResponse.json(
      { error: "API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요." },
      { status: 429 }
    );
  }

  // Unauthorized
  if (apiError?.code === 401 || apiError?.response?.data?.error?.code === 401) {
    return NextResponse.json(
      { error: "인증이 만료되었습니다. 다시 로그인해주세요." },
      { status: 401 }
    );
  }

  // Forbidden (no access)
  if (apiError?.code === 403 || apiError?.response?.data?.error?.code === 403) {
    return NextResponse.json(
      { error: "해당 파일에 접근 권한이 없습니다." },
      { status: 403 }
    );
  }

  // Not found
  if (apiError?.code === 404 || apiError?.response?.data?.error?.code === 404) {
    return NextResponse.json(
      { error: "파일을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  // Generic error
  return NextResponse.json(
    { error: "요청을 처리하는 중 오류가 발생했습니다." },
    { status: 500 }
  );
}
