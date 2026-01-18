import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createFile } from "@/lib/google-drive";
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
        { status: 400 },
      );
    }

    // 기본 frontmatter 템플릿
    const today = new Date().toISOString().split("T")[0];
    const title = name.replace(/\.(mdx?|md)$/, "");

    const defaultContent = `---
path: ""
author: "snyung"
date: "${today}"
update: "${today}"
title: "${title}"
description: ""
tags: []
category: "posts"
series: ""
---

`;

    const file = await createFile(
      name,
      parentId,
      defaultContent,
      session.accessToken,
    );

    return NextResponse.json({ file });
  } catch (error) {
    return handleGoogleApiError(error);
  }
}
