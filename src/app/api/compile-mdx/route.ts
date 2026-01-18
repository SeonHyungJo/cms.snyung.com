import { NextResponse } from "next/server";
import { serialize } from "next-mdx-remote/serialize";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

/**
 * HTML style 문자열을 제거합니다.
 * MDX에서 HTML style 속성은 JSX 객체 문법으로 변환되어야 하는데,
 * 복잡한 변환 대신 일단 제거하여 빌드 안정성을 확보합니다.
 */
function removeInlineStyles(source: string): string {
  const codeBlocks: string[] = [];

  // Fenced code blocks (```...```)
  let processed = source.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // Inline code (`...`)
  processed = processed.replace(/`[^`]+`/g, (match) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // style 속성 제거
  processed = processed.replace(/\s*style\s*=\s*["'][^"']*["']/g, "");

  // 코드 블록 복원
  codeBlocks.forEach((block, index) => {
    processed = processed.replace(`__CODE_BLOCK_${index}__`, block);
  });

  return processed;
}

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (typeof content !== "string") {
      return NextResponse.json(
        { error: "Content must be a string" },
        { status: 400 }
      );
    }

    // HTML style 속성 제거 (MDX 호환성을 위해)
    const processedContent = removeInlineStyles(content);

    const mdxSource = await serialize(processedContent, {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkBreaks],
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: "github-dark",
              keepBackground: true,
              defaultLang: "plaintext",
            },
          ],
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              properties: {
                className: ["anchor"],
              },
            },
          ],
        ],
      },
    });

    return NextResponse.json({
      mdxSource,
      frontmatter: mdxSource.frontmatter || null,
    });
  } catch (error) {
    console.error("MDX compile error:", error);
    return NextResponse.json(
      { error: "Failed to compile MDX" },
      { status: 500 }
    );
  }
}
