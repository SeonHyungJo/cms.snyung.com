import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-6 px-4 border-t bg-background">
      <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; 2026 Drive MDX CMS. All rights reserved.</p>
        <div className="flex gap-4">
          <Link
            href="/privacy"
            className="hover:text-foreground transition-colors"
          >
            개인정보처리방침
          </Link>
          <Link
            href="/terms"
            className="hover:text-foreground transition-colors"
          >
            이용약관
          </Link>
        </div>
      </div>
    </footer>
  );
}
