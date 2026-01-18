import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFileContent } from '@/lib/google-drive';
import { handleGoogleApiError } from '@/lib/api-error';

export async function GET(req: Request) {
  // 1. 인증 확인 (NextAuth)
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. 쿼리 파라미터에서 fileId 추출
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    // 3. 구글 드라이브에서 파일 내용 읽기
    const content = await getFileContent(fileId, session.accessToken as string);

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    return handleGoogleApiError(error);
  }
}
