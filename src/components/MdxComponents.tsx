import {
  ReactNode,
  ImgHTMLAttributes,
  TableHTMLAttributes,
  BlockquoteHTMLAttributes,
  HTMLAttributes,
  AnchorHTMLAttributes,
  Children,
  isValidElement,
} from "react";
import CodeBlock from "./CodeBlock";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./ui/collapsible";

function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === "string") {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  if (isValidElement(children)) {
    const props = children.props as { children?: ReactNode };
    if (props.children) {
      return extractTextFromChildren(props.children);
    }
  }
  return "";
}

// 시멘틱 HTML을 위한 MDX 컴포넌트 타입
type MdxComponentsType = {
  // 제목 태그 (Semantic Headings)
  h1?: (props: HTMLAttributes<HTMLHeadingElement>) => ReactNode;
  h2?: (props: HTMLAttributes<HTMLHeadingElement>) => ReactNode;
  h3?: (props: HTMLAttributes<HTMLHeadingElement>) => ReactNode;
  h4?: (props: HTMLAttributes<HTMLHeadingElement>) => ReactNode;
  h5?: (props: HTMLAttributes<HTMLHeadingElement>) => ReactNode;
  h6?: (props: HTMLAttributes<HTMLHeadingElement>) => ReactNode;
  // 텍스트 요소
  p?: (props: HTMLAttributes<HTMLParagraphElement>) => ReactNode;
  strong?: (props: HTMLAttributes<HTMLElement>) => ReactNode;
  em?: (props: HTMLAttributes<HTMLElement>) => ReactNode;
  // 링크
  a?: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => ReactNode;
  // 리스트 (Semantic Lists)
  ul?: (props: HTMLAttributes<HTMLUListElement>) => ReactNode;
  ol?: (props: HTMLAttributes<HTMLOListElement>) => ReactNode;
  li?: (props: HTMLAttributes<HTMLLIElement>) => ReactNode;
  // 미디어 및 테이블
  img?: (props: ImgHTMLAttributes<HTMLImageElement>) => ReactNode;
  figure?: (props: HTMLAttributes<HTMLElement>) => ReactNode;
  figcaption?: (props: HTMLAttributes<HTMLElement>) => ReactNode;
  table?: (
    props: TableHTMLAttributes<HTMLTableElement> & { children?: ReactNode }
  ) => ReactNode;
  thead?: (props: HTMLAttributes<HTMLTableSectionElement>) => ReactNode;
  tbody?: (props: HTMLAttributes<HTMLTableSectionElement>) => ReactNode;
  tr?: (props: HTMLAttributes<HTMLTableRowElement>) => ReactNode;
  th?: (props: HTMLAttributes<HTMLTableCellElement>) => ReactNode;
  td?: (props: HTMLAttributes<HTMLTableCellElement>) => ReactNode;
  // 인용 및 코드
  blockquote?: (
    props: BlockquoteHTMLAttributes<HTMLQuoteElement> & { children?: ReactNode }
  ) => ReactNode;
  pre?: (
    props: HTMLAttributes<HTMLPreElement> & {
      children?: ReactNode;
      "data-rehype-pretty-code-title"?: string;
    }
  ) => ReactNode;
  code?: (props: HTMLAttributes<HTMLElement>) => ReactNode;
  // 구분선
  hr?: (props: HTMLAttributes<HTMLHRElement>) => ReactNode;
  // 커스텀 컴포넌트
  Collapsible?: typeof Collapsible;
  CollapsibleTrigger?: typeof CollapsibleTrigger;
  CollapsibleContent?: typeof CollapsibleContent;
};

export const MdxComponents: MdxComponentsType = {
  // 제목: h1은 페이지당 하나여야 하므로, 본문 내 제목은 적절히 스타일링
  h1: ({ children, ...props }) => (
    <h1
      className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mt-8 mb-4"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="scroll-m-20 text-3xl font-semibold tracking-tight mt-10 mb-4 border-b pb-2"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-2"
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="scroll-m-20 text-lg font-medium mt-4 mb-2" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="scroll-m-20 text-base font-medium mt-4 mb-2" {...props}>
      {children}
    </h6>
  ),

  // 본문: 가독성을 위한 p 태그 스타일링
  p: ({ children, ...props }) => (
    <p className="leading-7 [&:not(:first-child)]:mt-6" {...props}>
      {children}
    </p>
  ),

  // 강조
  strong: ({ children, ...props }) => (
    <strong className="font-semibold" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),

  // 링크: 접근성을 위한 스타일링
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  ),

  // 리스트: 의미 있는 ul, ol 태그 유지
  ul: ({ children, ...props }) => (
    <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),

  // 이미지: figure로 감싸서 시멘틱하게
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="w-full max-w-2xl rounded-xl my-6"
      alt={props.alt || "Image"}
      loading="lazy"
      {...props}
    />
  ),

  // Figure 요소
  figure: ({ children, ...props }) => (
    <figure className="my-8" {...props}>
      {children}
    </figure>
  ),
  figcaption: ({ children, ...props }) => (
    <figcaption
      className="mt-2 text-center text-sm text-muted-foreground"
      {...props}
    >
      {children}
    </figcaption>
  ),

  // 테이블: 시멘틱 구조 유지
  table: ({ children, ...props }) => (
    <div className="my-6 w-full overflow-x-auto">
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted/50" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => <tbody {...props}>{children}</tbody>,
  tr: ({ children, ...props }) => (
    <tr className="border-b border-border" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th
      className="px-4 py-2 text-left font-semibold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td
      className="px-4 py-2 [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </td>
  ),

  // 인용구: 시멘틱 blockquote
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="mt-6 border-l-4 border-primary/30 pl-6 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // 코드 블록: figure로 감싸서 시멘틱하게
  pre: ({ children, ...props }) => {
    const codeElement = Children.toArray(children).find(
      (child) => isValidElement(child) && child.type === "code"
    );

    if (isValidElement(codeElement)) {
      const codeProps = codeElement.props as {
        className?: string;
        children?: ReactNode;
        "data-filename"?: string;
      };
      const className = codeProps.className || "";
      const languageMatch = className.match(/language-(\w+)/);
      const language = languageMatch ? languageMatch[1] : "plaintext";
      const code = extractTextFromChildren(codeProps.children);
      const filename =
        props["data-rehype-pretty-code-title"] || codeProps["data-filename"];

      return <CodeBlock code={code} language={language} filename={filename} />;
    }

    return (
      <pre
        className="my-6 overflow-x-auto rounded-lg bg-slate-950 p-4"
        {...props}
      >
        {children}
      </pre>
    );
  },

  // 인라인 코드
  code: ({ children, ...props }) => (
    <code
      className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
      {...props}
    >
      {children}
    </code>
  ),

  // 구분선
  hr: (props) => <hr className="my-8 border-t border-border" {...props} />,

  // 커스텀 컴포넌트
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
};
