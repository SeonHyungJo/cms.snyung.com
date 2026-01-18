import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getOrCreateCmsRootFolder,
  listRootFolders,
} from "@/lib/google-drive";
import { handleGoogleApiError } from "@/lib/api-error";

// GET: 루트 폴더 목록 또는 CMS 폴더 자동 생성
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");

    if (action === "auto") {
      // 자동으로 CMS 폴더 찾거나 생성
      const folder = await getOrCreateCmsRootFolder(session.accessToken);
      return NextResponse.json({ folder });
    }

    // 루트 폴더 목록 반환
    const folders = await listRootFolders(session.accessToken);
    return NextResponse.json({ folders });
  } catch (error) {
    return handleGoogleApiError(error);
  }
}
