"use client";

import { cpp } from "@codemirror/lang-cpp";
import { css } from "@codemirror/lang-css";
import { go } from "@codemirror/lang-go";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { php } from "@codemirror/lang-php";
import { python } from "@codemirror/lang-python";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";
import { yaml } from "@codemirror/lang-yaml";
import { EditorView } from "@codemirror/view";
import { githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";

const languageMap: Record<string, () => ReturnType<typeof javascript>> = {
  javascript: () => javascript(),
  js: () => javascript(),
  jsx: () => javascript({ jsx: true }),
  typescript: () => javascript({ typescript: true }),
  ts: () => javascript({ typescript: true }),
  tsx: () => javascript({ jsx: true, typescript: true }),
  css: () => css(),
  html: () => html(),
  json: () => json(),
  markdown: () => markdown(),
  md: () => markdown(),
  python: () => python(),
  py: () => python(),
  java: () => java(),
  cpp: () => cpp(),
  c: () => cpp(),
  rust: () => rust(),
  rs: () => rust(),
  go: () => go(),
  sql: () => sql(),
  php: () => php(),
  yaml: () => yaml(),
  yml: () => yaml(),
};

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({
  code,
  language = "plaintext",
  filename,
}: CodeBlockProps) {
  const langExtension = languageMap[language.toLowerCase()];
  const extensions = [
    EditorView.lineWrapping,
    EditorView.editable.of(false),
    ...(langExtension ? [langExtension()] : []),
  ];

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-gray-200">
      {filename && (
        <div className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 border-b border-gray-200">
          {filename}
        </div>
      )}
      <CodeMirror
        value={code.trim()}
        theme={githubLight}
        extensions={extensions}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: false,
          highlightActiveLine: false,
          foldGutter: false,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: false,
          bracketMatching: false,
          closeBrackets: false,
          autocompletion: false,
          rectangularSelection: false,
          crosshairCursor: false,
          highlightSelectionMatches: false,
          closeBracketsKeymap: false,
          searchKeymap: false,
          foldKeymap: false,
          completionKeymap: false,
          lintKeymap: false,
        }}
        className="text-[13px]"
      />
    </div>
  );
}
