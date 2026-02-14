import { useState } from "react";

function VsixConverter() {
  const [marketplaceUrl, setMarketplaceUrl] = useState("");
  const [downloadInfo, setDownloadInfo] = useState<{
    url: string;
    filename: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);

  const parse = (input: string) => {
    // URL 형식: https://marketplace.visualstudio.com/items?itemName=redhat.java
    const urlMatch = input.match(/itemName=([^&]+)/i);
    if (urlMatch) {
      const parts = urlMatch[1].split(".");
      if (parts.length >= 2)
        return { publisher: parts[0], name: parts.slice(1).join(".") };
    }
    // Extension ID 형식: redhat.java
    const idMatch = input.trim().match(/^([^.]+)\.(.+)$/);
    if (idMatch) return { publisher: idMatch[1], name: idMatch[2] };
    return null;
  };

  const handleConvert = () => {
    setError("");
    setDownloadInfo(null);

    const parsed = parse(marketplaceUrl);
    if (!parsed) {
      setError(
        "올바른 Marketplace URL 또는 Extension ID를 입력해주세요.\n예: https://marketplace.visualstudio.com/items?itemName=redhat.java\n예: redhat.java"
      );
      return;
    }

    const { publisher, name } = parsed;
    const url = `https://${publisher}.gallery.vsassets.io/_apis/public/gallery/publisher/${publisher}/extension/${name}/latest/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`;
    setDownloadInfo({ url, filename: `${publisher}.${name}.vsix` });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConvert();
  };

  const handleDownload = async () => {
    if (!downloadInfo) return;
    setDownloading(true);
    try {
      const res = await fetch(downloadInfo.url);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = downloadInfo.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    } catch {
      window.open(downloadInfo.url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!downloadInfo) return;
    await navigator.clipboard.writeText(downloadInfo.url);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-950/40">
      <h3 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
        VSIX 다운로드 변환기
      </h3>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Marketplace 링크 또는 Extension ID를 입력하면 VSIX 파일을 바로 다운로드할
        수 있다.
      </p>

      {/* 입력 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={marketplaceUrl}
          onChange={(e) => setMarketplaceUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="https://marketplace.visualstudio.com/items?itemName=redhat.java"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />
        <button
          onClick={handleConvert}
          className="shrink-0 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          변환
        </button>
      </div>

      {/* 에러 */}
      {error && (
        <p className="mt-2 whitespace-pre-line text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {/* 결과 */}
      {downloadInfo && (
        <div className="mt-4 space-y-3">
          {/* 파일명 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              파일명:
            </span>
            <code className="rounded bg-gray-200 px-2 py-0.5 text-sm font-semibold text-gray-900 dark:bg-gray-700 dark:text-white">
              {downloadInfo.filename}
            </code>
          </div>

          {/* 다운로드 URL */}
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              다운로드 URL:
            </span>
            <div className="mt-1 flex gap-2">
              <pre className="min-w-0 flex-1 overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs leading-relaxed text-gray-100">
                <code>{downloadInfo.url}</code>
              </pre>
              <button
                onClick={handleCopyUrl}
                className="shrink-0 self-start rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                {urlCopied ? "복사됨" : "복사"}
              </button>
            </div>
          </div>

          {/* 다운로드 버튼 */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {downloading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                다운로드 중...
              </>
            ) : (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {downloadInfo.filename} 다운로드
              </>
            )}
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            CORS 제한으로 직접 다운로드가 안 될 경우, 위 URL을 브라우저
            주소창에 붙여넣으면 다운로드된다. 이때 파일명이{" "}
            <code className="rounded bg-gray-200 px-1 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              Microsoft.VisualStudio.Services.VSIXPackage
            </code>
            로 저장되므로, 위에 표시된 파일명(
            <code className="rounded bg-gray-200 px-1 font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {downloadInfo.filename}
            </code>
            )으로 직접 변경해야 한다.
          </p>
        </div>
      )}
    </div>
  );
}

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

export default function OfflineInstall() {
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

      {/* VSIX 다운로드 변환기 */}
      <div className="mb-6">
        <VsixConverter />
      </div>

      {/* 일괄 설치 스크립트 다운로드 */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
          일괄 설치 스크립트
        </h3>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          VSIX 파일이 들어있는 폴더를 인자로 넘기면, 폴더 내 모든 .vsix 파일을
          자동으로 설치한다.
        </p>
        <a
          href="/downloads/install-extensions.bat"
          download="install-extensions.bat"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          install-extensions.bat 다운로드
        </a>
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


      </div>
    </div>
  );
}
