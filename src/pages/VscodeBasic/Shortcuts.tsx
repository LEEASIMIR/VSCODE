import { useState } from "react";

type ShortcutCategory = {
  title: string;
  description: string;
  shortcuts: {
    keys: string;
    mac?: string;
    description: string;
  }[];
};

const categories: ShortcutCategory[] = [
  {
    title: "일반",
    description: "명령 팔레트, 파일 열기, 설정 등 기본 조작",
    shortcuts: [
      {
        keys: "Ctrl + Shift + P",
        mac: "⌘ + ⇧ + P",
        description: "명령 팔레트 열기 (모든 명령 검색·실행)",
      },
      {
        keys: "Ctrl + P",
        mac: "⌘ + P",
        description: "빠른 파일 열기 (파일명으로 검색)",
      },
      {
        keys: "Ctrl + ,",
        mac: "⌘ + ,",
        description: "설정(Settings) 열기",
      },
      {
        keys: "Ctrl + K  Ctrl + S",
        mac: "⌘ + K  ⌘ + S",
        description: "키보드 단축키 설정 열기",
      },
      {
        keys: "Ctrl + Shift + N",
        mac: "⌘ + ⇧ + N",
        description: "새 창(인스턴스) 열기",
      },
      {
        keys: "Ctrl + Shift + W",
        mac: "⌘ + ⇧ + W",
        description: "현재 창 닫기",
      },
      {
        keys: "Ctrl + K  Ctrl + T",
        mac: "⌘ + K  ⌘ + T",
        description: "색상 테마 변경",
      },
    ],
  },
  {
    title: "편집",
    description: "코드 편집 시 가장 많이 사용하는 단축키",
    shortcuts: [
      {
        keys: "Ctrl + X",
        mac: "⌘ + X",
        description: "줄 잘라내기 (선택 없이 누르면 전체 줄)",
      },
      {
        keys: "Ctrl + C",
        mac: "⌘ + C",
        description: "줄 복사 (선택 없이 누르면 전체 줄)",
      },
      {
        keys: "Ctrl + Shift + K",
        mac: "⌘ + ⇧ + K",
        description: "현재 줄 삭제",
      },
      {
        keys: "Alt + ↑ / ↓",
        mac: "⌥ + ↑ / ↓",
        description: "현재 줄 위/아래로 이동",
      },
      {
        keys: "Shift + Alt + ↑ / ↓",
        mac: "⇧ + ⌥ + ↑ / ↓",
        description: "현재 줄 위/아래로 복사",
      },
      {
        keys: "Ctrl + Enter",
        mac: "⌘ + Enter",
        description: "아래에 빈 줄 삽입",
      },
      {
        keys: "Ctrl + Shift + Enter",
        mac: "⌘ + ⇧ + Enter",
        description: "위에 빈 줄 삽입",
      },
      {
        keys: "Ctrl + Shift + \\",
        mac: "⌘ + ⇧ + \\",
        description: "일치하는 괄호로 이동",
      },
      {
        keys: "Ctrl + ] / [",
        mac: "⌘ + ] / [",
        description: "들여쓰기 / 내어쓰기",
      },
      {
        keys: "Ctrl + /",
        mac: "⌘ + /",
        description: "줄 주석 토글",
      },
      {
        keys: "Shift + Alt + A",
        mac: "⇧ + ⌥ + A",
        description: "블록 주석 토글",
      },
      {
        keys: "Ctrl + Z",
        mac: "⌘ + Z",
        description: "실행 취소 (Undo)",
      },
      {
        keys: "Ctrl + Shift + Z",
        mac: "⌘ + ⇧ + Z",
        description: "다시 실행 (Redo)",
      },
      {
        keys: "Ctrl + S",
        mac: "⌘ + S",
        description: "파일 저장",
      },
      {
        keys: "Ctrl + Shift + [ / ]",
        mac: "⌘ + ⌥ + [ / ]",
        description: "코드 접기 / 펼치기",
      },
      {
        keys: "Ctrl + K  Ctrl + 0",
        mac: "⌘ + K  ⌘ + 0",
        description: "모든 영역 접기 (Fold All)",
      },
      {
        keys: "Ctrl + K  Ctrl + J",
        mac: "⌘ + K  ⌘ + J",
        description: "모든 영역 펼치기 (Unfold All)",
      },
    ],
  },
  {
    title: "멀티 커서 & 선택",
    description: "여러 위치를 동시에 편집하는 강력한 기능",
    shortcuts: [
      {
        keys: "Alt + Click",
        mac: "⌥ + Click",
        description: "클릭한 위치에 커서 추가",
      },
      {
        keys: "Ctrl + Alt + ↑ / ↓",
        mac: "⌘ + ⌥ + ↑ / ↓",
        description: "위/아래에 커서 추가",
      },
      {
        keys: "Ctrl + D",
        mac: "⌘ + D",
        description: "현재 단어 선택 → 다음 동일 단어 선택 추가",
      },
      {
        keys: "Ctrl + Shift + L",
        mac: "⌘ + ⇧ + L",
        description: "현재 선택과 동일한 모든 항목 선택",
      },
      {
        keys: "Ctrl + L",
        mac: "⌘ + L",
        description: "현재 줄 전체 선택",
      },
      {
        keys: "Shift + Alt + 드래그",
        mac: "⇧ + ⌥ + 드래그",
        description: "박스(열) 선택 — 사각형 영역 선택",
      },
    ],
  },
  {
    title: "검색 & 바꾸기",
    description: "파일 내 검색, 프로젝트 전체 검색",
    shortcuts: [
      {
        keys: "Ctrl + F",
        mac: "⌘ + F",
        description: "현재 파일에서 찾기",
      },
      {
        keys: "Ctrl + H",
        mac: "⌘ + H",
        description: "현재 파일에서 바꾸기",
      },
      {
        keys: "Ctrl + Shift + F",
        mac: "⌘ + ⇧ + F",
        description: "전체 파일에서 찾기 (프로젝트 검색)",
      },
      {
        keys: "Ctrl + Shift + H",
        mac: "⌘ + ⇧ + H",
        description: "전체 파일에서 바꾸기",
      },
      {
        keys: "F3 / Shift + F3",
        mac: "⌘ + G / ⌘ + ⇧ + G",
        description: "다음 / 이전 검색 결과로 이동",
      },
      {
        keys: "Alt + Enter",
        mac: "⌥ + Enter",
        description: "검색 결과 모두 선택 (찾기 창 내에서)",
      },
    ],
  },
  {
    title: "탐색",
    description: "파일 간 이동, 심볼 탐색, 정의 이동",
    shortcuts: [
      {
        keys: "Ctrl + G",
        mac: "⌃ + G",
        description: "특정 줄 번호로 이동",
      },
      {
        keys: "Ctrl + P",
        mac: "⌘ + P",
        description: "파일명으로 빠르게 이동",
      },
      {
        keys: "Ctrl + Shift + O",
        mac: "⌘ + ⇧ + O",
        description: "현재 파일의 심볼(메서드/변수) 목록 이동",
      },
      {
        keys: "Ctrl + T",
        mac: "⌘ + T",
        description: "워크스페이스 전체 심볼 검색",
      },
      {
        keys: "F12",
        mac: "F12",
        description: "정의로 이동 (Go to Definition)",
      },
      {
        keys: "Alt + F12",
        mac: "⌥ + F12",
        description: "정의 미리보기 (Peek Definition)",
      },
      {
        keys: "Shift + F12",
        mac: "⇧ + F12",
        description: "참조 찾기 (모든 사용처 표시)",
      },
      {
        keys: "Ctrl + Tab",
        mac: "⌃ + Tab",
        description: "열린 에디터 간 전환",
      },
      {
        keys: "Alt + ← / →",
        mac: "⌃ + - / ⌃ + ⇧ + -",
        description: "이전 / 다음 커서 위치로 이동",
      },
      {
        keys: "Ctrl + \\",
        mac: "⌘ + \\",
        description: "에디터 분할 (Split Editor)",
      },
    ],
  },
  {
    title: "화면 & 패널",
    description: "사이드바, 터미널, 패널 등 UI 제어",
    shortcuts: [
      {
        keys: "Ctrl + B",
        mac: "⌘ + B",
        description: "사이드바 토글 (보이기/숨기기)",
      },
      {
        keys: "Ctrl + Shift + E",
        mac: "⌘ + ⇧ + E",
        description: "탐색기(Explorer) 열기",
      },
      {
        keys: "Ctrl + Shift + F",
        mac: "⌘ + ⇧ + F",
        description: "검색 패널 열기",
      },
      {
        keys: "Ctrl + Shift + G",
        mac: "⌃ + ⇧ + G",
        description: "소스 제어(Git) 패널 열기",
      },
      {
        keys: "Ctrl + Shift + X",
        mac: "⌘ + ⇧ + X",
        description: "확장(Extensions) 패널 열기",
      },
      {
        keys: "Ctrl + Shift + D",
        mac: "⌘ + ⇧ + D",
        description: "디버그 패널 열기",
      },
      {
        keys: "Ctrl + J",
        mac: "⌘ + J",
        description: "하단 패널 토글 (터미널/출력/문제 등)",
      },
      {
        keys: "Ctrl + `",
        mac: "⌃ + `",
        description: "통합 터미널 토글",
      },
      {
        keys: "Ctrl + Shift + `",
        mac: "⌃ + ⇧ + `",
        description: "새 터미널 생성",
      },
      {
        keys: "Ctrl + K  Z",
        mac: "⌘ + K  Z",
        description: "Zen Mode (집중 모드) 토글",
      },
    ],
  },
  {
    title: "디버그",
    description: "디버거 실행, 브레이크포인트, 스텝 실행",
    shortcuts: [
      {
        keys: "F5",
        mac: "F5",
        description: "디버깅 시작 / 계속 (Continue)",
      },
      {
        keys: "Shift + F5",
        mac: "⇧ + F5",
        description: "디버깅 중지 (Stop)",
      },
      {
        keys: "Ctrl + Shift + F5",
        mac: "⌘ + ⇧ + F5",
        description: "디버깅 재시작 (Restart)",
      },
      {
        keys: "F9",
        mac: "F9",
        description: "브레이크포인트 토글",
      },
      {
        keys: "F10",
        mac: "F10",
        description: "Step Over (다음 줄 실행)",
      },
      {
        keys: "F11",
        mac: "F11",
        description: "Step Into (함수 내부 진입)",
      },
      {
        keys: "Shift + F11",
        mac: "⇧ + F11",
        description: "Step Out (함수 밖으로 나감)",
      },
    ],
  },
  {
    title: "Git (내장 소스 제어)",
    description: "VS Code 내장 Git 기능 관련 단축키",
    shortcuts: [
      {
        keys: "Ctrl + Shift + G",
        mac: "⌃ + ⇧ + G",
        description: "소스 제어(Git) 뷰 열기",
      },
      {
        keys: "Ctrl + Shift + P → Git:",
        mac: "⌘ + ⇧ + P → Git:",
        description: "명령 팔레트에서 Git 명령 검색 (commit, push, pull 등)",
      },
    ],
  },
];

const tips = [
  {
    title: "Chord 단축키란?",
    content:
      'Ctrl + K → Ctrl + S 처럼 "두 조합을 순서대로" 누르는 단축키. 첫 번째 키 조합을 누른 뒤 손을 떼고 두 번째 키 조합을 누른다.',
  },
  {
    title: "단축키 커스터마이징",
    content:
      "Ctrl + K → Ctrl + S 로 키보드 단축키 설정을 열어 원하는 명령에 자신만의 단축키를 지정할 수 있다. keybindings.json 파일로 직접 편집도 가능하다.",
  },
  {
    title: "단축키 PDF 다운로드",
    content:
      '명령 팔레트(Ctrl + Shift + P)에서 "Help: Keyboard Shortcuts Reference"를 검색하면 OS별 공식 단축키 치트시트(PDF)를 열 수 있다.',
  },
];

export default function Shortcuts() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [showMac, setShowMac] = useState(false);

  const toggleCategory = (index: number) => {
    setActiveCategory((prev) => (prev === index ? null : index));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          단축키
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          VS Code에서 자주 사용하는 키보드 단축키 모음
        </p>
      </div>

      {/* OS 토글 */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          OS 선택:
        </span>
        <button
          onClick={() => setShowMac(false)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            !showMac
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Windows / Linux
        </button>
        <button
          onClick={() => setShowMac(true)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            showMac
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          macOS
        </button>
      </div>

      {/* 카테고리별 단축키 */}
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
                  {cat.shortcuts.length}
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
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                        단축키
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                        설명
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.shortcuts.map((sc) => (
                      <tr
                        key={sc.keys}
                        className="border-b border-gray-50 last:border-b-0 dark:border-gray-700/50"
                      >
                        <td className="px-4 py-2.5">
                          <kbd className="inline-block rounded bg-gray-100 px-2 py-1 font-mono text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            {showMac && sc.mac ? sc.mac : sc.keys}
                          </kbd>
                        </td>
                        <td className="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300">
                          {sc.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 팁 */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          참고
        </h3>
        <div className="space-y-3">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20"
            >
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                {tip.title}
              </h4>
              <p className="mt-1 text-sm leading-relaxed text-blue-700 dark:text-blue-400">
                {tip.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
