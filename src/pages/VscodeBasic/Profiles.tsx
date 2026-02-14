import { useState } from "react";

type Step = {
  title: string;
  description: string;
  detail?: string;
};

type Section = {
  id: string;
  title: string;
  description: string;
  steps: Step[];
};

const sections: Section[] = [
  {
    id: "what",
    title: "프로필이란?",
    description: "프로필의 개념과 왜 필요한지",
    steps: [
      {
        title: "프로필 = 확장 + 설정 묶음",
        description:
          "프로필은 확장(Extensions), 설정(Settings), 키바인딩, 스니펫 등을 하나의 세트로 묶어 관리하는 기능입니다.",
        detail:
          "예를 들어 'Spring 개발' 프로필에는 Java/Spring 관련 확장만, 'React 개발' 프로필에는 JS/React 관련 확장만 넣을 수 있습니다.",
      },
      {
        title: "프로젝트마다 필요한 확장이 다르다",
        description:
          "Spring+JSP 프로젝트와 React 프로젝트에서 동시에 모든 확장을 켜두면 불필요한 메모리 사용과 충돌이 발생할 수 있습니다.",
        detail:
          "프로필을 전환하면 해당 프로필의 확장만 활성화되어 VS Code가 가볍고 빠르게 동작합니다.",
      },
      {
        title: "프로필에 포함되는 항목",
        description:
          "설정(settings.json), 키보드 단축키, 사용자 스니펫, 사용자 작업, 확장 프로그램, UI 상태",
      },
    ],
  },
  {
    id: "create",
    title: "프로필 만들기",
    description: "새 프로필을 만드는 방법",
    steps: [
      {
        title: "1. 명령 팔레트 열기",
        description: "Ctrl + Shift + P 를 누릅니다.",
      },
      {
        title: '2. "Profiles: Create Profile" 검색',
        description:
          '명령 팔레트에 "Profiles: Create Profile"을 입력하고 선택합니다.',
      },
      {
        title: "3. 프로필 이름 입력",
        description:
          '용도에 맞는 이름을 지정합니다. 예: "Spring 개발", "React 개발", "기본"',
      },
      {
        title: "4. 복사 소스 선택",
        description:
          '기존 프로필을 기반으로 만들 수 있습니다. 처음이면 "None"을 선택하면 깨끗한 상태에서 시작합니다.',
        detail:
          '"현재 프로필에서 복사"를 선택하면 지금 설치된 확장과 설정을 그대로 가져옵니다.',
      },
      {
        title: "5. 포함 항목 선택",
        description:
          "설정, 키보드 단축키, 스니펫, 작업, 확장 중 프로필에 포함할 항목을 체크합니다.",
        detail:
          "보통 전부 체크하는 것을 권장합니다. 특히 확장은 반드시 포함해야 프로필별 확장 관리가 됩니다.",
      },
      {
        title: "6. 필요한 확장 설치",
        description:
          "프로필이 만들어지면 해당 프로필 전용으로 확장을 설치합니다. 다른 프로필에는 영향 없음.",
      },
    ],
  },
  {
    id: "switch",
    title: "프로필 전환하기",
    description: "프로젝트에 맞는 프로필로 전환하는 방법",
    steps: [
      {
        title: "방법 1: 좌측 하단 기어 아이콘",
        description:
          "VS Code 좌측 하단의 기어(⚙️) 아이콘 → 프로필 → 원하는 프로필 클릭",
        detail: "현재 활성 프로필 이름이 기어 아이콘 옆에 표시됩니다.",
      },
      {
        title: "방법 2: 명령 팔레트",
        description:
          'Ctrl + Shift + P → "Profiles: Switch Profile" 검색 → 원하는 프로필 선택',
      },
      {
        title: "방법 3: 폴더에 프로필 연결 (자동 전환)",
        description:
          '특정 폴더를 열면 자동으로 프로필이 전환되도록 설정할 수 있습니다. Ctrl + Shift + P → "Profiles: Associate Profile with Folder" 검색',
        detail:
          "예: D:\\projects\\spring-app 폴더를 열면 자동으로 'Spring 개발' 프로필로 전환. 가장 편리한 방법!",
      },
    ],
  },
  {
    id: "workspace",
    title: "워크스페이스별 확장 비활성화",
    description: "프로필 없이 프로젝트별로 확장을 끄는 방법",
    steps: [
      {
        title: "1. 확장 패널 열기",
        description: "Ctrl + Shift + X 를 눌러 확장 패널을 엽니다.",
      },
      {
        title: "2. 비활성화할 확장 우클릭",
        description:
          '설치된 확장 목록에서 이 프로젝트에서 필요 없는 확장을 우클릭합니다.',
      },
      {
        title: '3. "사용 안 함 (워크스페이스)" 선택',
        description:
          "이 워크스페이스(폴더)에서만 해당 확장이 비활성화됩니다. 다른 폴더에서는 여전히 활성 상태.",
        detail:
          '반대로 "사용 (워크스페이스)"을 선택하면 이 워크스페이스에서만 활성화할 수도 있습니다.',
      },
    ],
  },
  {
    id: "recommend",
    title: "팀 공유: 추천 확장 설정",
    description: ".vscode/extensions.json으로 팀원에게 확장 추천하기",
    steps: [
      {
        title: "1. .vscode/extensions.json 파일 생성",
        description:
          "프로젝트 루트에 .vscode 폴더를 만들고 extensions.json 파일을 생성합니다.",
      },
      {
        title: "2. 추천 확장 ID 작성",
        description:
          "recommendations 배열에 확장 ID를 나열합니다. 확장 ID는 확장 상세 페이지에서 확인 가능.",
      },
      {
        title: "3. Git에 커밋",
        description:
          "이 파일을 Git에 커밋하면 팀원이 프로젝트를 열 때 추천 확장 알림이 표시됩니다.",
        detail:
          '"이 리포지토리에서 권장하는 확장이 있습니다" 팝업이 뜨고, 한 번에 설치할 수 있습니다.',
      },
    ],
  },
  {
    id: "manage",
    title: "프로필 관리",
    description: "프로필 삭제, 내보내기, 가져오기",
    steps: [
      {
        title: "프로필 삭제",
        description:
          'Ctrl + Shift + P → "Profiles: Delete Profile" → 삭제할 프로필 선택',
        detail: "기본(Default) 프로필은 삭제할 수 없습니다.",
      },
      {
        title: "프로필 내보내기 (공유용)",
        description:
          'Ctrl + Shift + P → "Profiles: Export Profile" → GitHub Gist 또는 로컬 파일로 저장',
        detail:
          "팀원에게 프로필을 공유할 때 유용합니다. 확장 목록과 설정을 한 번에 전달할 수 있습니다.",
      },
      {
        title: "프로필 가져오기",
        description:
          'Ctrl + Shift + P → "Profiles: Import Profile" → Gist URL 또는 파일 선택',
        detail:
          "공유받은 프로필을 그대로 가져와서 바로 사용할 수 있습니다.",
      },
    ],
  },
];

const exampleExtensionsJson = `{
  "recommendations": [
    "vscjava.vscode-java-pack",
    "redhat.vscode-xml",
    "pivotal.vscode-boot-dev-pack",
    "SummerSigh.vscode-jsp"
  ],
  "unwantedRecommendations": [
    "dbaeumer.vscode-eslint"
  ]
}`;

const profileExamples = [
  {
    name: "Spring 개발",
    color: "blue",
    extensions: [
      "Extension Pack for Java",
      "Spring Boot Extension Pack",
      "XML (Red Hat)",
      "JSP Language Support",
      "Community Server Connectors",
      "Database Client (Weijan Chen)",
    ],
  },
  {
    name: "React 개발",
    color: "emerald",
    extensions: [
      "ESLint",
      "Prettier",
      "Tailwind CSS IntelliSense",
      "ES7+ React/Redux Snippets",
      "Auto Rename Tag",
      "Path Intellisense",
    ],
  },
  {
    name: "기본 (공통)",
    color: "amber",
    extensions: [
      "Korean Language Pack",
      "Material Icon Theme",
      "GitLens",
      "Code Spell Checker",
      "Bracket Pair Color DLW",
      "indent-rainbow",
    ],
  },
];

const colorMap: Record<string, { border: string; bg: string; badge: string; text: string; dot: string }> = {
  blue: {
    border: "border-blue-200 dark:border-blue-800",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300",
    text: "text-blue-800 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  emerald: {
    border: "border-emerald-200 dark:border-emerald-800",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-300",
    text: "text-emerald-800 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  amber: {
    border: "border-amber-200 dark:border-amber-800",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-300",
    text: "text-amber-800 dark:text-amber-300",
    dot: "bg-amber-500",
  },
};

export default function Profiles() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const toggleSection = (id: string) => {
    setActiveSection((prev) => (prev === id ? null : id));
  };

  const handleCopyJson = async () => {
    await navigator.clipboard.writeText(exampleExtensionsJson);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          프로필 설정
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          프로젝트별로 확장과 설정을 분리하여 관리하는 방법
        </p>
      </div>

      {/* 핵심 요약 */}
      <div className="mb-6 rounded-xl border border-brand-200 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-900/20">
        <h4 className="text-sm font-semibold text-brand-700 dark:text-brand-300">
          한 줄 요약
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-brand-600 dark:text-brand-400">
          <strong>프로필</strong>을 만들어 프로젝트 유형별로 확장 세트를 분리하고,{" "}
          <strong>폴더 연결</strong> 기능으로 폴더를 열면 자동 전환되게 설정하면
          가장 편리합니다.
        </p>
      </div>

      {/* 프로필 예시 카드 */}
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        {profileExamples.map((profile) => {
          const c = colorMap[profile.color];
          return (
            <div
              key={profile.name}
              className={`rounded-xl border ${c.border} ${c.bg} p-4`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                <h4 className={`text-sm font-semibold ${c.text}`}>
                  {profile.name}
                </h4>
              </div>
              <ul className="space-y-1">
                {profile.extensions.map((ext) => (
                  <li key={ext} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <svg className="h-3 w-3 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    {ext}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* 섹션별 가이드 */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.id}
            className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between p-4 text-left"
            >
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {section.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  {section.steps.length}
                </span>
                <svg
                  className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                    activeSection === section.id ? "rotate-180" : ""
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

            {activeSection === section.id && (
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {section.steps.map((step, i) => (
                    <div key={i} className="px-4 py-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {step.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                      {step.detail && (
                        <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-500">
                          {step.detail}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* 추천 확장 섹션: extensions.json 예시 */}
                {section.id === "recommend" && (
                  <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        .vscode/extensions.json 예시
                      </span>
                      <button
                        onClick={handleCopyJson}
                        className="rounded-lg bg-brand-500 px-3 py-1 text-xs font-medium text-white hover:bg-brand-600"
                      >
                        {copiedJson ? "복사됨" : "복사"}
                      </button>
                    </div>
                    <pre className="overflow-auto rounded-lg bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
                      <code>{exampleExtensionsJson}</code>
                    </pre>
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">recommendations</code>{" "}
                        — 이 프로젝트에서 설치를 권장하는 확장 ID 목록
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">unwantedRecommendations</code>{" "}
                        — 이 프로젝트에서 불필요한 확장 (추천에서 제외)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 빠른 참조 */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
          명령어 빠른 참조
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-2 pr-4 font-medium text-gray-500 dark:text-gray-400">
                  동작
                </th>
                <th className="pb-2 font-medium text-gray-500 dark:text-gray-400">
                  명령 팔레트 (Ctrl+Shift+P)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {[
                ["프로필 만들기", "Profiles: Create Profile"],
                ["프로필 전환", "Profiles: Switch Profile"],
                ["폴더에 프로필 연결", "Profiles: Associate Profile with Folder"],
                ["프로필 삭제", "Profiles: Delete Profile"],
                ["프로필 내보내기", "Profiles: Export Profile"],
                ["프로필 가져오기", "Profiles: Import Profile"],
              ].map(([action, command]) => (
                <tr key={action}>
                  <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">
                    {action}
                  </td>
                  <td className="py-2">
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {command}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
