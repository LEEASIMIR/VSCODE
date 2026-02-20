import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import PageMeta from "../../components/common/PageMeta";

type SyntaxItem = {
  title: string;
  syntax: string;
};

type SyntaxSection = {
  category: string;
  description: string;
  items: SyntaxItem[];
};

const sections: SyntaxSection[] = [
  {
    category: "제목 (Headings)",
    description: "# 기호의 개수로 제목 레벨을 지정합니다.",
    items: [
      { title: "제목 1", syntax: "# 제목 1" },
      { title: "제목 2", syntax: "## 제목 2" },
      { title: "제목 3", syntax: "### 제목 3" },
      { title: "제목 4", syntax: "#### 제목 4" },
    ],
  },
  {
    category: "텍스트 스타일 (Text Styles)",
    description: "텍스트에 다양한 서식을 적용합니다.",
    items: [
      { title: "굵게", syntax: "**굵은 텍스트**" },
      { title: "기울임", syntax: "*기울임 텍스트*" },
      { title: "굵게 + 기울임", syntax: "***굵고 기울인 텍스트***" },
      { title: "취소선", syntax: "~~취소선 텍스트~~" },
      { title: "인라인 코드", syntax: "`인라인 코드`" },
    ],
  },
  {
    category: "목록 (Lists)",
    description: "순서 있는 목록과 순서 없는 목록을 만듭니다.",
    items: [
      {
        title: "순서 없는 목록",
        syntax: "- 항목 1\n- 항목 2\n  - 하위 항목",
      },
      {
        title: "순서 있는 목록",
        syntax: "1. 첫 번째\n2. 두 번째\n3. 세 번째",
      },
      {
        title: "체크박스",
        syntax: "- [x] 완료된 항목\n- [ ] 미완료 항목",
      },
    ],
  },
  {
    category: "링크 & 이미지 (Links & Images)",
    description: "하이퍼링크와 이미지를 삽입합니다.",
    items: [
      { title: "링크", syntax: "[표시 텍스트](https://example.com)" },
      { title: "이미지", syntax: "![대체 텍스트](https://via.placeholder.com/150x50)" },
      { title: "링크 + 타이틀", syntax: '[텍스트](https://example.com "타이틀")' },
    ],
  },
  {
    category: "코드 블록 (Code Blocks)",
    description: "코드를 구문 강조와 함께 표시합니다.",
    items: [
      {
        title: "코드 블록",
        syntax:
          "```javascript\nconst greeting = 'Hello';\nconsole.log(greeting);\n```",
      },
      {
        title: "diff 표시",
        syntax: "```diff\n- 삭제된 줄\n+ 추가된 줄\n```",
      },
    ],
  },
  {
    category: "테이블 (Tables)",
    description: "파이프(|)와 하이픈(-)으로 테이블을 만듭니다.",
    items: [
      {
        title: "기본 테이블",
        syntax:
          "| 헤더 1 | 헤더 2 | 헤더 3 |\n| ------ | ------ | ------ |\n| 셀 1   | 셀 2   | 셀 3   |\n| 셀 4   | 셀 5   | 셀 6   |",
      },
      {
        title: "정렬",
        syntax:
          "| 왼쪽 정렬 | 가운데 정렬 | 오른쪽 정렬 |\n| :-------- | :---------: | ----------: |\n| 왼쪽      |   가운데    |      오른쪽 |",
      },
    ],
  },
  {
    category: "인용문 (Blockquotes)",
    description: "> 기호로 인용문을 만듭니다.",
    items: [
      { title: "인용문", syntax: "> 인용문 텍스트입니다." },
      {
        title: "중첩 인용문",
        syntax: "> 첫 번째 레벨\n>> 두 번째 레벨\n>>> 세 번째 레벨",
      },
    ],
  },
  {
    category: "수평선 (Horizontal Rules)",
    description: "구분선을 삽입합니다.",
    items: [
      { title: "하이픈", syntax: "---" },
      { title: "별표", syntax: "***" },
      { title: "밑줄", syntax: "___" },
    ],
  },
  {
    category: "이스케이프 (Escape)",
    description: "특수 문자를 그대로 표시합니다.",
    items: [
      {
        title: "이스케이프",
        syntax: "\\* \\# \\[ \\] \\( \\) \\` \\- \\_",
      },
    ],
  },
];

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{children}</h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-base font-bold text-gray-900 dark:text-white">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-sm text-gray-700 dark:text-gray-300">{children}</p>
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
        <pre className="overflow-x-auto rounded-lg bg-gray-800 p-3 text-sm text-gray-100">
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
    <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li>{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-brand-500 pl-4 text-sm italic text-gray-600 dark:text-gray-400">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a href={href} className="text-brand-500 underline hover:text-brand-600" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <table className="w-full text-sm border-collapse border border-gray-200 dark:border-gray-700">
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
  hr: () => <hr className="border-gray-300 dark:border-gray-600" />,
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <img src={src} alt={alt} className="max-w-full rounded" />
  ),
  input: ({ checked, disabled }: { checked?: boolean; disabled?: boolean }) => (
    <input type="checkbox" checked={checked} disabled={disabled} className="mr-1.5 accent-brand-500" readOnly />
  ),
};

export default function MarkdownGuide() {
  return (
    <div>
      <PageMeta
        title="Markdown 작성법 | Syntax Reference"
        description="Markdown 문법 가이드"
      />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Markdown 작성법
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Markdown 문법의 주요 구문과 사용 예시를 정리한 가이드입니다.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.category}
            className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {section.category}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {section.description}
              </p>
            </div>
            <div className="p-5">
              <div className="space-y-6">
                {section.items.map((item) => (
                  <div key={item.title}>
                    <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.title}
                    </p>
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase text-gray-400">
                          구문
                        </p>
                        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                          <code>{item.syntax}</code>
                        </pre>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase text-gray-400">
                          출력
                        </p>
                        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/50">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {item.syntax}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
