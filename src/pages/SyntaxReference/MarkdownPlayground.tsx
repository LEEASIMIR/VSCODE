import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PageMeta from "../../components/common/PageMeta";

const STORAGE_KEY = "md-playground-content";

const defaultMarkdown = `# Markdown Playground

여기에 자유롭게 **Markdown**을 작성해보세요!

## 텍스트 스타일

**굵게**, *기울임*, ~~취소선~~, \`인라인 코드\`

## 목록

- 항목 1
- 항목 2
  - 하위 항목
- 항목 3

1. 첫 번째
2. 두 번째
3. 세 번째

## 체크박스

- [x] 완료된 작업
- [ ] 미완료 작업

## 테이블

| 이름 | 역할 | 상태 |
| :--- | :---: | ---: |
| Alice | 개발자 | 활성 |
| Bob | 디자이너 | 활성 |

## 인용문

> 인용문 텍스트입니다.
> 여러 줄도 가능합니다.

## 코드 블록

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

## 링크 & 이미지

[Google](https://google.com)

---

*즐겁게 작성해보세요!*
`;

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mb-3 mt-6 text-xl font-bold text-gray-900 dark:text-white">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mb-2 mt-4 text-lg font-bold text-gray-900 dark:text-white">{children}</h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="mb-2 mt-3 text-base font-bold text-gray-900 dark:text-white">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-bold">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  del: ({ children }: { children?: React.ReactNode }) => (
    <del className="line-through">{children}</del>
  ),
  code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    if (className) {
      return (
        <pre className="mb-3 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
          <code>{children}</code>
        </pre>
      );
    }
    return (
      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm text-red-600 dark:bg-gray-800 dark:text-red-400">
        {children}
      </code>
    );
  },
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li>{children}</li>,
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="mb-3 border-l-4 border-brand-500 pl-4 text-sm italic text-gray-600 dark:text-gray-400">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a href={href} className="text-brand-500 underline hover:text-brand-600" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <table className="mb-3 w-full border-collapse border border-gray-200 text-sm dark:border-gray-700">
      {children}
    </table>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>
  ),
  th: ({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) => (
    <th style={style} className="border border-gray-200 px-3 py-2 font-semibold text-gray-900 dark:border-gray-700 dark:text-white">
      {children}
    </th>
  ),
  td: ({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) => (
    <td style={style} className="border border-gray-200 px-3 py-2 text-gray-700 dark:border-gray-700 dark:text-gray-300">
      {children}
    </td>
  ),
  hr: () => <hr className="my-4 border-gray-300 dark:border-gray-600" />,
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <img src={src} alt={alt} className="mb-3 max-w-full rounded" />
  ),
  input: ({ checked, disabled }: { checked?: boolean; disabled?: boolean }) => (
    <input type="checkbox" checked={checked} disabled={disabled} className="mr-1.5 accent-brand-500" readOnly />
  ),
};

export default function MarkdownPlayground() {
  const [markdown, setMarkdown] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? defaultMarkdown
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, markdown);
  }, [markdown]);

  const handleClear = () => {
    setMarkdown("");
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div>
      <PageMeta
        title="Markdown Playground | Syntax Reference"
        description="Markdown 실시간 미리보기 에디터"
      />

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Markdown Playground
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            왼쪽에 Markdown을 작성하면 오른쪽에서 실시간으로 결과를 확인할 수
            있습니다.
          </p>
        </div>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          초기화
        </button>
      </div>

      <div className="grid h-[calc(100vh-180px)] grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Editor */}
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Editor
            </span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
            placeholder="Markdown을 입력하세요..."
            spellCheck={false}
          />
        </div>

        {/* Preview */}
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Preview
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
