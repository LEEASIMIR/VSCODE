import { useState } from "react";

const steps = [
  {
    title: "1. VSIX 파일 다운로드",
    description:
      "인터넷이 되는 PC에서 VS Code Marketplace 웹사이트에 접속하여 확장 프로그램의 VSIX 파일을 다운로드한다.",
    details: [
      {
        label: "Marketplace 접속",
        content:
          "https://marketplace.visualstudio.com/vscode 에 접속하여 확장 프로그램을 검색한다.",
      },
      {
        label: "VSIX 다운로드",
        content:
          '확장 프로그램 상세 페이지 우측의 "Resources" 섹션에서 "Download Extension" 링크를 클릭하면 .vsix 파일이 다운로드된다.',
      },
      {
        label: "직접 URL 구성",
        content:
          "Marketplace에서 다운로드 링크가 보이지 않는 경우, 아래 URL 패턴으로 직접 다운로드할 수 있다.",
      },
    ],
    code: `# VSIX 직접 다운로드 URL 패턴
https://{publisher}.gallery.vsassets.io/_apis/public/gallery/publisher/{publisher}/extension/{extensionName}/{version}/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage

# 예시: Red Hat Java Extension v1.40.0
https://redhat.gallery.vsassets.io/_apis/public/gallery/publisher/redhat/extension/java/1.40.0/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`,
  },
  {
    title: "2. 오프라인 PC로 파일 이동",
    description:
      "다운로드한 .vsix 파일을 USB 드라이브 등을 이용하여 오프라인 PC로 복사한다.",
    details: [
      {
        label: "파일 확인",
        content:
          "다운로드된 파일의 확장자가 .vsix인지 확인한다. 브라우저에 따라 .zip으로 저장될 수 있는데, 이 경우 확장자를 .vsix로 변경한다.",
      },
      {
        label: "의존성 확인",
        content:
          "일부 확장 프로그램은 다른 확장에 의존한다. Marketplace 상세 페이지의 Dependencies 탭에서 필요한 의존 확장도 함께 다운로드한다.",
      },
    ],
  },
  {
    title: "3-A. CLI로 설치 (권장)",
    description:
      "명령 프롬프트 또는 터미널에서 code 명령어를 사용하여 설치한다. 가장 간단하고 확실한 방법이다.",
    code: `# 단일 파일 설치
code --install-extension <파일경로>.vsix

# 예시
code --install-extension C:\\Downloads\\redhat.java-1.40.0.vsix

# 여러 파일 한번에 설치
code --install-extension ext1.vsix --install-extension ext2.vsix

# 설치 확인
code --list-extensions`,
    details: [
      {
        label: "code 명령어가 안 되는 경우",
        content:
          'VS Code에서 Ctrl+Shift+P → "Shell Command: Install \'code\' command in PATH"를 실행한 후 터미널을 재시작한다. Windows의 경우 VS Code 설치 시 PATH 추가 옵션을 체크했다면 자동으로 사용 가능하다.',
      },
    ],
  },
  {
    title: "3-B. VS Code UI로 설치",
    description:
      "VS Code의 확장 프로그램 뷰에서 메뉴를 통해 VSIX 파일을 직접 지정하여 설치한다.",
    details: [
      {
        label: "방법",
        content:
          'VS Code 실행 → 좌측 확장(Extensions) 아이콘 클릭 (Ctrl+Shift+X) → 상단 "..." 메뉴 클릭 → "Install from VSIX..." 선택 → .vsix 파일 선택',
      },
      {
        label: "Command Palette 이용",
        content:
          'Ctrl+Shift+P → "Extensions: Install from VSIX..." 입력 → .vsix 파일 선택',
      },
    ],
  },
  {
    title: "3-C. 수동 설치 (extensions 폴더 직접 복사)",
    description:
      "VSIX 파일의 압축을 풀어 확장 프로그램 폴더에 직접 배치하는 방법이다. CLI/UI 설치가 불가능한 환경에서 사용한다.",
    code: `# 확장 프로그램 설치 경로
Windows : %USERPROFILE%\\.vscode\\extensions\\
macOS   : ~/.vscode/extensions/
Linux   : ~/.vscode/extensions/

# 설치 절차
# 1. .vsix 파일의 확장자를 .zip으로 변경
# 2. 압축 해제
# 3. 해제된 폴더 내 "extension" 폴더를 찾음
# 4. "{publisher}.{name}-{version}" 형식으로 폴더명 변경
# 5. 위 경로에 복사
# 6. VS Code 재시작

# 예시: redhat.java-1.40.0.vsix → redhat.java-1.40.0 폴더`,
    details: [
      {
        label: "주의사항",
        content:
          "폴더명은 반드시 {publisher}.{name}-{version} 형식이어야 한다. 형식이 다르면 VS Code가 인식하지 못한다.",
      },
    ],
  },
];

const batchScript = `@echo off
chcp 65001 >nul
setlocal

REM ============================================================
REM  VS Code 확장 프로그램 일괄 설치 스크립트
REM  지정된 폴더 내 모든 .vsix 파일을 설치한다.
REM ============================================================
REM
REM  사용법:
REM    install-extensions.bat [vsix파일들이 있는 폴더]
REM
REM  예시:
REM    install-extensions.bat C:\\Downloads\\vsix

if "%~1"=="" (
    echo.
    echo  [사용법] install-extensions.bat [vsix 폴더 경로]
    echo  [예시]   install-extensions.bat C:\\Downloads\\vsix
    echo.
    exit /b 1
)

set "VSIX_DIR=%~1"

if not exist "%VSIX_DIR%" (
    echo [오류] 폴더를 찾을 수 없습니다: %VSIX_DIR%
    exit /b 1
)

echo.
echo ========================================
echo  VS Code 확장 프로그램 일괄 설치
echo  대상 폴더: %VSIX_DIR%
echo ========================================
echo.

set COUNT=0
for %%f in ("%VSIX_DIR%\\*.vsix") do (
    set /a COUNT+=1
    echo [설치 중] %%~nxf
    code --install-extension "%%f"
    if errorlevel 1 (
        echo [실패] %%~nxf
    ) else (
        echo [완료] %%~nxf
    )
    echo.
)

if %COUNT%==0 (
    echo [알림] .vsix 파일이 없습니다.
) else (
    echo ========================================
    echo  설치 완료: %COUNT%개 파일 처리
    echo ========================================
)

echo.
echo [설치된 확장 목록]
code --list-extensions

endlocal`;

const commonDeps = [
  {
    name: "Spring + JSP SET 전체",
    extensions: [
      "redhat.java",
      "vscjava.vscode-java-debug",
      "vscjava.vscode-java-dependency",
      "vscjava.vscode-maven",
      "redhat.vscode-xml",
      "formulahendry.auto-rename-tag",
      "esbenp.prettier-vscode",
    ],
  },
];

export default function OfflineInstall() {
  const [showScript, setShowScript] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(batchScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          오프라인 설치 방법
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          인터넷이 차단된 환경에서 VS Code 확장 프로그램을 설치하는 방법
        </p>
      </div>

      {/* 단계별 가이드 */}
      <div className="space-y-6">
        {steps.map((step) => (
          <div
            key={step.title}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              {step.description}
            </p>

            {step.details && (
              <ul className="mt-3 space-y-2">
                {step.details.map((detail) => (
                  <li key={detail.label} className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {detail.label}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {" — "}
                      {detail.content}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {step.code && (
              <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm leading-relaxed text-gray-100">
                <code>{step.code}</code>
              </pre>
            )}
          </div>
        ))}

        {/* 일괄 설치용 확장 목록 */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
            참고: 확장 프로그램 다운로드 목록
          </h3>
          <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            아래 Extension ID를 Marketplace에서 검색하여 VSIX 파일을 다운로드한다.
          </p>
          {commonDeps.map((group) => (
            <div key={group.name}>
              <h4 className="mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                {group.name}
              </h4>
              <div className="flex flex-wrap gap-2">
                {group.extensions.map((ext) => (
                  <code
                    key={ext}
                    className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {ext}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 일괄 설치 스크립트 */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={() => setShowScript(!showScript)}
            className="flex w-full items-center justify-between p-5 text-left"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              일괄 설치 스크립트 (install-extensions.bat)
            </h3>
            <svg
              className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                showScript ? "rotate-180" : ""
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
          {showScript && (
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
                <code>{batchScript}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
