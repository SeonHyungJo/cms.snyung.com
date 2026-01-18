import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { listFiles } from '@/lib/google-drive';
import { handleGoogleApiError } from '@/lib/api-error';

export async function GET(req: Request) {
  // 1. 인증 확인 (NextAuth)
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. 쿼리 파라미터에서 folderId 추출
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get('folderId');

    if (!folderId) {
      return NextResponse.json(
        { error: 'folderId is required' },
        { status: 400 }
      );
    }

    // 3. 구글 드라이브에서 파일 목록 가져오기
    const files = await listFiles(folderId, session.accessToken);

    return NextResponse.json({ files });
  } catch (error) {
    return handleGoogleApiError(error);
  }
}
