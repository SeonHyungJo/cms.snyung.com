import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { renameFile } from '@/lib/google-drive';
import { handleGoogleApiError } from '@/lib/api-error';
import { z } from 'zod';

const renameSchema = z.object({
  fileId: z.string().min(1),
  newName: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fileId, newName } = renameSchema.parse(body);

    const updatedFile = await renameFile(
      fileId,
      newName,
      session.accessToken as string
    );

    return NextResponse.json({ success: true, file: updatedFile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    return handleGoogleApiError(error);
  }
}
