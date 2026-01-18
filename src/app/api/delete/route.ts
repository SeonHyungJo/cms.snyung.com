import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteFile } from "@/lib/google-drive";
import { handleGoogleApiError } from "@/lib/api-error";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId } = await req.json();

    if (!fileId) {
      return NextResponse.json(
        { error: "fileId is required" },
        { status: 400 }
      );
    }

    await deleteFile(fileId, session.accessToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleGoogleApiError(error);
  }
}
