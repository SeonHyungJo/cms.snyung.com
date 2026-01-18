import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createFolder } from "@/lib/google-drive";
import { handleGoogleApiError } from "@/lib/api-error";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, parentId } = await req.json();

    if (!name || !parentId) {
      return NextResponse.json(
        { error: "Name and parentId are required" },
        { status: 400 }
      );
    }

    const folder = await createFolder(name, parentId, session.accessToken);

    return NextResponse.json({ folder });
  } catch (error) {
    return handleGoogleApiError(error);
  }
}
