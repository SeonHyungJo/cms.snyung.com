"use client";

import { useEffect, useState, useRef } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { Loader2 } from "lucide-react";
import { MdxComponents } from "./MdxComponents";

interface MdxPreviewProps {
  content: string;
}

type Frontmatter = Record<string, unknown>;

function FrontmatterTable({ frontmatter }: { frontmatter: Frontmatter }) {
  const formatValue = (value: unknown): string => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return String(value ?? "");
  };

  const entries = Object.entries(frontmatter).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );

  if (entries.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {entries.map(([key, value]) => (
            <tr key={key} className="border-b border-border last:border-b-0">
              <td className="px-3 py-2 bg-muted/50 font-medium text-muted-foreground w-32 align-top">
                {key}
              </td>
              <td className="px-3 py-2 break-words">
                {formatValue(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MdxPreview({ content }: MdxPreviewProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [frontmatter, setFrontmatter] = useState<Frontmatter | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Debounce MDX compilation to avoid too many API calls while typing
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!content.trim()) {
      setMdxSource(null);
      setFrontmatter(null);
      setError(null);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsCompiling(true);
      setError(null);

      try {
        const res = await fetch("/api/compile-mdx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        if (!res.ok) {
          throw new Error("Failed to compile MDX");
        }

        const { mdxSource: compiled, frontmatter: fm } = await res.json();
        setMdxSource(compiled);
        setFrontmatter(fm);
      } catch (err) {
        console.error("MDX compile error:", err);
        setError("MDX 컴파일 중 오류가 발생했습니다.");
      } finally {
        setIsCompiling(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [content]);

  return (
    <div className="h-full overflow-auto bg-background p-6">
      {isCompiling && (
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">컴파일 중...</span>
        </div>
      )}

      {error && (
        <div className="text-destructive text-sm mb-4">{error}</div>
      )}

      {mdxSource && (
        <div className="max-w-[700px]">
          {frontmatter && Object.keys(frontmatter).length > 0 && (
            <FrontmatterTable frontmatter={frontmatter} />
          )}
          <article className="prose prose-code:before:content-[''] prose-code:after:content-[''] prose-code:rounded-lg prose-code:px-1.5 prose-code:py-1 prose-code:bg-slate-200 dark:prose-dark prose-img:max-w-none prose-img:rounded-xl prose-a:text-slate-500
          lg:prose-h1:text-4xl prose-h1:text-3xl
          lg:prose-h2:text-3xl prose-h2:text-2xl
          lg:prose-h3:text-2xl prose-h3:text-xl
          lg:prose-h4:text-xl prose-h4:text-lg
          lg:prose-h5:text-lg prose-h5:text-base
          lg:prose-h6:text-base prose-h6:text-base
          ">
            <MDXRemote {...mdxSource} components={MdxComponents} />
          </article>
        </div>
      )}

      {!mdxSource && !isCompiling && !error && (
        <div className="text-muted-foreground text-sm">
          내용을 입력하면 미리보기가 표시됩니다.
        </div>
      )}
    </div>
  );
}
