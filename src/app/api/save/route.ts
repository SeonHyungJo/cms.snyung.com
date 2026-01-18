import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { saveFileSchema } from '@/lib/schema';
import { authOptions } from '@/lib/auth';
import { updateFileContent } from '@/lib/google-drive';
import { handleGoogleApiError } from '@/lib/api-error';

export async function POST(req: Request) {
  // 1. 인증 확인 (NextAuth)
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. 데이터 파싱 및 검증 (Zod)
    const body = await req.json();
    const result = saveFileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { fileId, content } = result.data;

    // 3. 구글 드라이브 업데이트 로직
    await updateFileContent(fileId, content, session.accessToken as string);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleGoogleApiError(error);
  }
}
