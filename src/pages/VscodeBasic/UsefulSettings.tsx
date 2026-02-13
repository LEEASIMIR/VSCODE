import { useState } from "react";

type SettingItem = {
  key: string;
  value: string;
  description: string;
};

type SettingCategory = {
  title: string;
  description: string;
  settings: SettingItem[];
};

const categories: SettingCategory[] = [
  {
    title: "인코딩 & 언어별 포맷터",
    description: "파일 인코딩, 언어별 기본 포맷터 지정",
    settings: [
      {
        key: '"files.encoding"',
        value: '"utf8"',
        description: "기본 파일 인코딩 (JSP, Java 등 모든 파일에 적용)",
      },
      {
        key: '"[java]"',
        value: '{ "editor.defaultFormatter": "redhat.java" }',
        description: "Java 파일의 기본 포맷터를 Red Hat Java로 지정",
      },
      {
        key: '"[xml]"',
        value: '{ "editor.defaultFormatter": "redhat.vscode-xml" }',
        description: "XML 파일(pom.xml 등)의 기본 포맷터를 Red Hat XML로 지정",
      },
      {
        key: '"[jsp]"',
        value: '{ "files.encoding": "utf8" }',
        description: "JSP 파일 인코딩을 UTF-8로 강제 지정 (EUC-KR 환경 방지)",
      },
    ],
  },
  {
    title: "에디터 기본",
    description: "코딩 시 가장 체감되는 에디터 핵심 설정",
    settings: [
      {
        key: '"editor.tabSize"',
        value: "4",
        description: "탭 간격 (Java 프로젝트는 4 권장)",
      },
      {
        key: '"editor.formatOnSave"',
        value: "true",
        description: "저장 시 자동 포맷 (언어별 포맷터 설정 필요)",
      },
      {
        key: '"editor.bracketPairColorization.enabled"',
        value: "true",
        description: "괄호 쌍 색상 구분 (기본 활성)",
      },
      {
        key: '"editor.guides.bracketPairs"',
        value: "true",
        description: "괄호 쌍 가이드 라인 표시",
      },
      {
        key: '"editor.linkedEditing"',
        value: "true",
        description: "HTML/JSP 태그 이름 동시 편집 (여는 태그 수정 시 닫는 태그 자동 변경)",
      },
      {
        key: '"editor.stickyScroll.enabled"',
        value: "true",
        description: "스크롤 시 현재 스코프(함수/클래스명)를 상단에 고정 표시",
      },
      {
        key: '"files.trimTrailingWhitespace"',
        value: "true",
        description: "저장 시 줄 끝 공백 자동 제거",
      },
      {
        key: '"files.insertFinalNewline"',
        value: "true",
        description: "저장 시 파일 끝에 빈 줄 추가",
      },
    ],
  },
  {
    title: "Java 설정",
    description: "JDK 경로, Language Server, 프로젝트 구조",
    settings: [
      {
        key: '"java.jdt.ls.java.home"',
        value: '"C:\\\\Program Files\\\\Java\\\\jdk1.8.0_281"',
        description:
          "Java Language Server가 사용할 JDK 경로. 시스템 JAVA_HOME과 별개로 VS Code 전용으로 지정. 반드시 JDK 경로여야 하며 JRE는 불가.",
      },
      {
        key: '"java.configuration.updateBuildConfiguration"',
        value: '"automatic"',
        description: "pom.xml/build.gradle 변경 시 자동으로 빌드 설정 갱신",
      },
      {
        key: '"java.compile.nullAnalysis.mode"',
        value: '"disabled"',
        description: "null 분석 모드 (disabled | automatic). 1.8 프로젝트에서는 disabled 권장.",
      },
      {
        key: '"java.project.sourcePaths"',
        value: '["src/main/java"]',
        description: "Java 소스 경로 지정. pom.xml이 없는 프로젝트에서 소스 루트를 수동 지정할 때 사용.",
      },
      {
        key: '"java.project.outputPath"',
        value: '"target/classes"',
        description: "컴파일 출력 경로. Maven 프로젝트 표준 구조에 맞춰 설정.",
      },
      {
        key: '"java.saveActions.organizeImports"',
        value: "true",
        description: "저장 시 import 자동 정리 (사용하지 않는 import 제거, 정렬)",
      },
      {
        key: '"java.sources.organizeImports.starThreshold"',
        value: "5",
        description: "import 정리 시 * (star import) 적용 기준 개수",
      },
      {
        key: '"java.debug.settings.hotCodeReplace"',
        value: '"auto"',
        description:
          '디버그 중 Hot Code Replace 모드 (auto: 저장 시 자동 반영)',
      },
    ],
  },
  {
    title: "Maven 설정",
    description: "Maven 실행 경로, 환경변수 설정",
    settings: [
      {
        key: '"maven.executable.path"',
        value: '"C:\\\\apache-maven-3.9.12\\\\bin\\\\mvn.cmd"',
        description:
          "Maven 실행 파일 경로를 직접 지정. M2_HOME/bin이 PATH에 없거나 여러 Maven 버전을 사용할 때 유용.",
      },
      {
        key: '"maven.terminal.customEnv"',
        value: '[{ "environmentVariable": "JAVA_HOME", "value": "..." }]',
        description:
          "Maven 터미널 실행 시 환경변수 오버라이드. 시스템 JAVA_HOME과 다른 JDK로 빌드할 때 사용.",
      },
    ],
  },
  {
    title: "XML 설정",
    description: "XML Language Server 관련 설정",
    settings: [
      {
        key: '"xml.java.home"',
        value: '"C:\\\\Program Files\\\\Java\\\\jdk-24"',
        description:
          "XML Language Server가 사용할 JDK 경로. java.jdt.ls.java.home과 별도로 지정 가능. 최신 JDK를 지정하면 XML 처리 성능이 향상된다.",
      },
    ],
  },
  {
    title: "파일 제외 & 성능",
    description: "탐색기, 검색, 파일 감시에서 제외할 경로",
    settings: [
      {
        key: '"files.exclude"',
        value: '{ "**/target": true, "**/node_modules": true, "**/.git": true }',
        description: "탐색기에서 숨길 파일/폴더 패턴",
      },
      {
        key: '"files.watcherExclude"',
        value: '{ "**/target/**": true }',
        description:
          "파일 변경 감시(watcher)에서 제외. target 폴더는 빌드마다 대량 변경이 발생하므로 제외하면 CPU/메모리 절약.",
      },
      {
        key: '"search.exclude"',
        value: '{ "**/node_modules": true, "**/target": true, "**/dist": true }',
        description: "전체 검색(Ctrl+Shift+F)에서 제외할 경로",
      },
    ],
  },
];

const fullExample = `{
  // ============================================
  // 필수 시스템 환경변수 (각 컴퓨터에서 설정 필요)
  // - JAVA_HOME: JDK 1.8 경로 (예: C:\\Program Files\\Java\\jdk1.8.0_281)
  // - M2_HOME: Maven 경로 (예: C:\\apache-maven-3.9.12)
  // - CATALINA_HOME: Tomcat 경로 (예: C:\\apache-tomcat-9.0.112)
  // - PATH에 %JAVA_HOME%\\bin, %M2_HOME%\\bin 추가
  // ============================================

  // 파일 인코딩
  "files.encoding": "utf8",
  "[java]": {
    "editor.defaultFormatter": "redhat.java"
  },
  "[xml]": {
    "editor.defaultFormatter": "redhat.vscode-xml"
  },
  "[jsp]": {
    "files.encoding": "utf8"
  },

  // 에디터
  "editor.tabSize": 4,
  "editor.formatOnSave": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  "editor.linkedEditing": true,
  "editor.stickyScroll.enabled": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,

  // XML
  "xml.java.home": "C:\\Program Files\\Java\\jdk-24",

  // Java 설정
  "java.jdt.ls.java.home": "C:\\Program Files\\Java\\jdk1.8.0_281",
  "java.configuration.updateBuildConfiguration": "automatic",
  "java.compile.nullAnalysis.mode": "disabled",
  "java.project.sourcePaths": ["src/main/java"],
  "java.project.outputPath": "target/classes",
  "java.saveActions.organizeImports": true,
  "java.debug.settings.hotCodeReplace": "auto",

  // Maven 설정
  "maven.terminal.customEnv": [
    {
      "environmentVariable": "JAVA_HOME",
      "value": "C:\\Program Files\\Java\\jdk1.8.0_281"
    }
  ],
  "maven.executable.path": "C:\\apache-maven-3.9.12\\bin\\mvn.cmd",

  // 파일 제외 (성능 향상)
  "files.exclude": {
    "**/target": true,
    "**/node_modules": true,
    "**/.git": true
  },
  "files.watcherExclude": {
    "**/target/**": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/target": true,
    "**/dist": true
  }
}`;

export default function UsefulSettings() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [showExample, setShowExample] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleCategory = (index: number) => {
    setActiveCategory((prev) => (prev === index ? null : index));
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          유용한 설정
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          settings.json에서 설정할 수 있는 실무에서 유용한 항목 모음
        </p>
      </div>

      {/* 필수 환경변수 */}
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          필수 시스템 환경변수 (각 컴퓨터에서 설정 필요)
        </h4>
        <ul className="mt-2 space-y-1 text-sm leading-relaxed text-amber-700 dark:text-amber-400">
          <li>
            <code className="rounded bg-amber-100 px-1 text-xs dark:bg-amber-800">
              JAVA_HOME
            </code>{" "}
            — JDK 1.8 경로 (예: C:\Program Files\Java\jdk1.8.0_281)
          </li>
          <li>
            <code className="rounded bg-amber-100 px-1 text-xs dark:bg-amber-800">
              M2_HOME
            </code>{" "}
            — Maven 경로 (예: C:\apache-maven-3.9.12)
          </li>
          <li>
            <code className="rounded bg-amber-100 px-1 text-xs dark:bg-amber-800">
              CATALINA_HOME
            </code>{" "}
            — Tomcat 경로 (예: C:\apache-tomcat-9.0.112)
          </li>
          <li>
            <code className="rounded bg-amber-100 px-1 text-xs dark:bg-amber-800">
              PATH
            </code>{" "}
            — %JAVA_HOME%\bin, %M2_HOME%\bin 추가
          </li>
        </ul>
      </div>

      {/* 설정 여는 방법 */}
      <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
          settings.json 여는 방법
        </h4>
        <ul className="mt-2 space-y-1 text-sm leading-relaxed text-blue-700 dark:text-blue-400">
          <li>
            <kbd className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs dark:bg-blue-800">
              Ctrl + ,
            </kbd>{" "}
            → 설정 UI 열기 → 우측 상단{" "}
            <code className="rounded bg-blue-100 px-1 text-xs dark:bg-blue-800">
              {"{}"}
            </code>{" "}
            아이콘 클릭 → JSON 편집
          </li>
          <li>
            <kbd className="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs dark:bg-blue-800">
              Ctrl + Shift + P
            </kbd>{" "}
            → "Preferences: Open User Settings (JSON)" 검색
          </li>
        </ul>
      </div>

      {/* 카테고리별 설정 */}
      <div className="space-y-3">
        {categories.map((cat, index) => (
          <div
            key={cat.title}
            className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              onClick={() => toggleCategory(index)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {cat.title}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {cat.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {cat.settings.length}
                </span>
                <svg
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                    activeCategory === index ? "rotate-180" : ""
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

            {activeCategory === index && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {cat.settings.map((s) => (
                    <div key={s.key} className="px-4 py-3">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                          {s.key}
                        </code>
                        <span className="font-mono text-xs text-brand-500">
                          {s.value}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {s.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 전체 예시 */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <button
          onClick={() => setShowExample(!showExample)}
          className="flex w-full items-center justify-between p-5 text-left"
        >
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            settings.json 전체 예시
          </h3>
          <svg
            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
              showExample ? "rotate-180" : ""
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
        {showExample && (
          <div className="border-t border-gray-200 p-5 dark:border-gray-700">
            <div className="mb-3 flex justify-end">
              <button
                onClick={handleCopy}
                className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600"
              >
                {copied ? "복사됨" : "복사"}
              </button>
            </div>
            <pre className="max-h-[500px] overflow-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
              <code>{fullExample}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
