import { useState } from "react";

type SnippetExample = {
  title: string;
  description: string;
  filename: string;
  snippet: string;
  usage: string;
};

const snippetExamples: SnippetExample[] = [
  {
    title: "Java — System.out.println",
    description: "sout 입력 후 Tab으로 빠르게 출력문 작성",
    filename: "java.json",
    snippet: `"Print to console": {
  "prefix": "sout",
  "body": [
    "System.out.println($1);"
  ],
  "description": "System.out.println"
}`,
    usage: "sout → Tab → 내용 입력",
  },
  {
    title: "Java — main 메서드",
    description: "psvm 입력으로 main 메서드 자동 생성",
    filename: "java.json",
    snippet: `"Main method": {
  "prefix": "psvm",
  "body": [
    "public static void main(String[] args) {",
    "    $0",
    "}"
  ],
  "description": "public static void main"
}`,
    usage: "psvm → Tab",
  },
  {
    title: "Java — for 반복문",
    description: "fori 입력으로 인덱스 기반 for문 생성",
    filename: "java.json",
    snippet: `"For loop": {
  "prefix": "fori",
  "body": [
    "for (int \${1:i} = 0; \${1:i} < \${2:length}; \${1:i}++) {",
    "    $0",
    "}"
  ],
  "description": "For loop with index"
}`,
    usage: "fori → Tab → 변수명 입력 → Tab → 길이 입력",
  },
  {
    title: "Java — Spring @Controller 클래스",
    description: "Spring MVC Controller 클래스 보일러플레이트",
    filename: "java.json",
    snippet: `"Spring Controller": {
  "prefix": "scontroller",
  "body": [
    "package \${1:com.example.controller};",
    "",
    "import org.springframework.stereotype.Controller;",
    "import org.springframework.web.bind.annotation.RequestMapping;",
    "",
    "@Controller",
    "@RequestMapping(\\"/\${2:path}\\")",
    "public class \${3:ClassName}Controller {",
    "",
    "    $0",
    "}"
  ],
  "description": "Spring MVC Controller class"
}`,
    usage: "scontroller → Tab → 패키지명 → Tab → 경로 → Tab → 클래스명",
  },
  {
    title: "Java — Spring @Service 클래스",
    description: "Spring Service 클래스 보일러플레이트",
    filename: "java.json",
    snippet: `"Spring Service": {
  "prefix": "sservice",
  "body": [
    "package \${1:com.example.service};",
    "",
    "import org.springframework.stereotype.Service;",
    "",
    "@Service",
    "public class \${2:ClassName}Service {",
    "",
    "    $0",
    "}"
  ],
  "description": "Spring Service class"
}`,
    usage: "sservice → Tab → 패키지명 → Tab → 클래스명",
  },
  {
    title: "JSP — 기본 페이지 템플릿",
    description: "JSP 파일 기본 구조 빠르게 생성",
    filename: "jsp.json",
    snippet: `"JSP Page Template": {
  "prefix": "jsppage",
  "body": [
    "<%@ page language=\\"java\\" contentType=\\"text/html; charset=UTF-8\\" pageEncoding=\\"UTF-8\\"%>",
    "<%@ taglib prefix=\\"c\\" uri=\\"http://java.sun.com/jsp/jstl/core\\"%>",
    "<!DOCTYPE html>",
    "<html>",
    "<head>",
    "    <meta charset=\\"UTF-8\\">",
    "    <title>\${1:Title}</title>",
    "</head>",
    "<body>",
    "    $0",
    "</body>",
    "</html>"
  ],
  "description": "JSP page with JSTL"
}`,
    usage: "jsppage → Tab → 타이틀 입력",
  },
  {
    title: "JSP — JSTL forEach",
    description: "JSTL c:forEach 반복문 빠르게 작성",
    filename: "jsp.json",
    snippet: `"JSTL forEach": {
  "prefix": "cforeach",
  "body": [
    "<c:forEach var=\\"\${1:item}\\" items=\\"\${2:collection}\\" varStatus=\\"status\\">",
    "    $0",
    "</c:forEach>"
  ],
  "description": "JSTL c:forEach loop"
}`,
    usage: "cforeach → Tab → 변수명 → Tab → 리스트명",
  },
  {
    title: "HTML — div with class",
    description: "클래스가 포함된 div 빠르게 생성",
    filename: "html.json",
    snippet: `"Div with class": {
  "prefix": "divc",
  "body": [
    "<div class=\\"\${1:className}\\">",
    "    $0",
    "</div>"
  ],
  "description": "div with class attribute"
}`,
    usage: "divc → Tab → 클래스명 입력",
  },
];

const builtinVariables = [
  { variable: "$TM_FILENAME", description: "현재 파일명 (확장자 포함)" },
  {
    variable: "$TM_FILENAME_BASE",
    description: "현재 파일명 (확장자 제외)",
  },
  { variable: "$TM_DIRECTORY", description: "현재 파일의 디렉토리 경로" },
  { variable: "$TM_FILEPATH", description: "현재 파일의 전체 경로" },
  {
    variable: "$TM_SELECTED_TEXT",
    description: "현재 선택된 텍스트 (선택 후 스니펫 실행 시)",
  },
  { variable: "$TM_CURRENT_LINE", description: "현재 줄의 내용" },
  { variable: "$CLIPBOARD", description: "클립보드 내용" },
  {
    variable: "$CURRENT_YEAR / $CURRENT_MONTH / $CURRENT_DATE",
    description: "현재 연도 / 월 / 일",
  },
  {
    variable: "$LINE_COMMENT / $BLOCK_COMMENT_START",
    description: "해당 언어의 주석 문법",
  },
];

const syntaxGuide = [
  {
    syntax: "$1, $2, $3 ...",
    description: "탭 정지점 (Tab 순서대로 이동)",
  },
  { syntax: "$0", description: "최종 커서 위치 (마지막 Tab 도착점)" },
  {
    syntax: "${1:defaultText}",
    description: "기본값이 있는 탭 정지점",
  },
  {
    syntax: "${1|one,two,three|}",
    description: "선택 목록 (드롭다운으로 선택)",
  },
  {
    syntax: "${TM_FILENAME/(.*)\\..+$/$1/}",
    description: "변수 변환 (정규식으로 가공)",
  },
];

export default function UserSnippets() {
  const [activeSnippet, setActiveSnippet] = useState<number | null>(null);
  const [showSyntax, setShowSyntax] = useState(false);
  const [showVariables, setShowVariables] = useState(false);

  const toggleSnippet = (index: number) => {
    setActiveSnippet((prev) => (prev === index ? null : index));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          사용자 스니펫
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          자주 쓰는 코드 패턴을 스니펫으로 등록하여 빠르게 작성하는 방법
        </p>
      </div>

      {/* 스니펫 만드는 방법 */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
          스니펫 파일 만들기
        </h3>
        <ol className="space-y-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <li>
            <span className="font-medium text-gray-900 dark:text-white">
              1.
            </span>{" "}
            <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-700">
              Ctrl + Shift + P
            </kbd>{" "}
            → <code className="text-xs">"Snippets: Configure Snippets"</code>{" "}
            검색
          </li>
          <li>
            <span className="font-medium text-gray-900 dark:text-white">
              2.
            </span>{" "}
            언어 선택 (예: Java, HTML, JSP 등) — 해당 언어의 스니펫 JSON 파일이 열림
          </li>
          <li>
            <span className="font-medium text-gray-900 dark:text-white">
              3.
            </span>{" "}
            아래 형식으로 스니펫을 작성하고 저장
          </li>
        </ol>
        <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
          <code>{`{
  "스니펫 이름": {
    "prefix": "트리거 키워드",    // 이것을 입력하면 자동완성 목록에 표시
    "body": [
      "첫 번째 줄",
      "    두 번째 줄 (들여쓰기 포함)",
      "$0"                       // 최종 커서 위치
    ],
    "description": "스니펫 설명"  // 자동완성 목록에 표시되는 설명
  }
}`}</code>
        </pre>
      </div>

      {/* 문법 가이드 */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <button
          onClick={() => setShowSyntax(!showSyntax)}
          className="flex w-full items-center justify-between p-4 text-left"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            스니펫 문법
          </h3>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
              showSyntax ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {showSyntax && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-gray-500">
                    문법
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-gray-500">
                    설명
                  </th>
                </tr>
              </thead>
              <tbody>
                {syntaxGuide.map((item) => (
                  <tr
                    key={item.syntax}
                    className="border-b border-gray-50 last:border-b-0 dark:border-gray-700/50"
                  >
                    <td className="px-4 py-2.5">
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-700 dark:text-gray-200">
                        {item.syntax}
                      </code>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 내장 변수 */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <button
          onClick={() => setShowVariables(!showVariables)}
          className="flex w-full items-center justify-between p-4 text-left"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            내장 변수
          </h3>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
              showVariables ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {showVariables && (
          <div className="border-t border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-gray-500">
                    변수
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-gray-500">
                    설명
                  </th>
                </tr>
              </thead>
              <tbody>
                {builtinVariables.map((item) => (
                  <tr
                    key={item.variable}
                    className="border-b border-gray-50 last:border-b-0 dark:border-gray-700/50"
                  >
                    <td className="px-4 py-2.5">
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-gray-700 dark:text-gray-200">
                        {item.variable}
                      </code>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 실전 예시 */}
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        실전 예시
      </h3>
      <div className="space-y-3">
        {snippetExamples.map((ex, index) => (
          <div
            key={ex.title}
            className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              onClick={() => toggleSnippet(index)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {ex.title}
                </h4>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {ex.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <code className="rounded bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                  {ex.filename}
                </code>
                <svg
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                    activeSnippet === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
            {activeSnippet === index && (
              <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  사용법:{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-200">
                    {ex.usage}
                  </span>
                </div>
                <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
                  <code>{ex.snippet}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 팁 */}
      <div className="mt-8 space-y-3">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            프로젝트 공유 스니펫
          </h4>
          <p className="mt-1 text-sm leading-relaxed text-blue-700 dark:text-blue-400">
            프로젝트 루트에{" "}
            <code className="rounded bg-blue-100 px-1 text-xs dark:bg-blue-800">
              .vscode/
            </code>{" "}
            폴더를 만들고{" "}
            <code className="rounded bg-blue-100 px-1 text-xs dark:bg-blue-800">
              project.code-snippets
            </code>{" "}
            파일을 생성하면 팀원들과 스니펫을 공유할 수 있다. 이 파일은 Git에
            커밋하여 관리한다.
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            scope 설정
          </h4>
          <p className="mt-1 text-sm leading-relaxed text-blue-700 dark:text-blue-400">
            프로젝트 스니펫(.code-snippets)에서는{" "}
            <code className="rounded bg-blue-100 px-1 text-xs dark:bg-blue-800">
              "scope": "java,jsp"
            </code>{" "}
            를 추가하여 특정 언어에서만 스니펫이 동작하도록 제한할 수 있다.
          </p>
        </div>
      </div>
    </div>
  );
}
