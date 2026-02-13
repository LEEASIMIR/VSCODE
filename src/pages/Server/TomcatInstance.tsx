import { useState } from "react";

const scriptContent = `@echo off
chcp 65001 >nul
setlocal

REM ============================================================
REM  Tomcat 인스턴스 등록 스크립트
REM  - 현재 디렉토리를 프로젝트 경로로 사용
REM  - CATALINA_HOME 공유, CATALINA_BASE 분리
REM  - 개별 시작/종료 가능
REM ============================================================
REM
REM  사용법:
REM    프로젝트 폴더에서 실행:
REM    init-tomcat-instance.bat [톰캣경로] [인스턴스명] [포트] [docBase폴더명] [JPDA포트]
REM
REM  예시:
REM    cd D:\\Project\\speed\\AzureDevOpsRepo\\speedmate_admin
REM    init-tomcat-instance.bat C:\\apache-tomcat-9.0.112 Admin 8083 web 10083
REM
REM    cd D:\\Project\\speed\\AzureDevOpsRepo\\speedmate_user
REM    init-tomcat-instance.bat C:\\apache-tomcat-9.0.112 User 8080 web 10080
REM

REM === 파라미터 검증 ===
if "%~4"=="" (
    echo.
    echo  [사용법] 프로젝트 폴더에서 실행
    echo    %~nx0 [톰캣경로] [인스턴스명] [포트] [docBase폴더명] [JPDA포트]
    echo.
    echo  [예시]
    echo    cd D:\\Project\\speedmate_admin
    echo    %~nx0 C:\\apache-tomcat-9.0.112 Admin 8083 web 10083
    echo.
    echo  [파라미터]
    echo    톰캣경로      : Tomcat 설치 루트 (CATALINA_HOME)
    echo    인스턴스명    : 인스턴스 이름 (중복 불가, 영문)
    echo    포트          : HTTP 포트 번호
    echo    docBase폴더명 : JSP/정적파일 폴더 (예: web, src/main/webapp)
    echo    JPDA포트      : 디버그 포트 (선택, 미지정시 HTTP포트+2000)
    echo.
    exit /b 1
)

set "TOMCAT_HOME=%~1"
set "INSTANCE_NAME=%~2"
set "PORT=%~3"
set "DOCBASE_DIR=%~4"
set "PROJECT_PATH=%CD%"

...이하 생략 (전체 스크립트는 아래 섹션별 설명 참조)`;

const sections = [
  {
    title: "개요",
    description:
      "하나의 Tomcat 설치(CATALINA_HOME)를 공유하면서 프로젝트마다 독립적인 인스턴스(CATALINA_BASE)를 생성하는 스크립트다. 각 인스턴스는 별도 포트, 별도 설정, 별도 시작/종료가 가능하다.",
  },
  {
    title: "사용법",
    code: `cd D:\\Project\\speedmate_admin
init-tomcat-instance.bat C:\\apache-tomcat-9.0.112 Admin 8083 web 10083`,
  },
  {
    title: "파라미터",
    table: [
      { param: "톰캣경로", desc: "Tomcat 설치 루트 (CATALINA_HOME)", example: "C:\\apache-tomcat-9.0.112" },
      { param: "인스턴스명", desc: "인스턴스 이름 (중복 불가, 영문)", example: "Admin" },
      { param: "포트", desc: "HTTP 포트 번호", example: "8083" },
      { param: "docBase폴더명", desc: "JSP/정적파일 폴더", example: "web" },
      { param: "JPDA포트", desc: "디버그 포트 (선택, 미지정 시 HTTP포트+2000)", example: "10083" },
    ],
  },
  {
    title: "자동 포트 할당",
    table: [
      { param: "HTTP", desc: "사용자 지정", example: "8083" },
      { param: "Shutdown", desc: "HTTP + 1000", example: "9083" },
      { param: "JPDA (Debug)", desc: "HTTP + 2000 (또는 직접 지정)", example: "10083" },
    ],
  },
  {
    title: "생성되는 인스턴스 구조",
    code: `{CATALINA_HOME}/instances/{인스턴스명}/
├── conf/
│   ├── server.xml              ← 포트 설정
│   ├── web.xml                 ← 기본 web.xml 복사
│   ├── catalina.properties
│   ├── logging.properties
│   └── Catalina/localhost/
│       └── ROOT.xml            ← docBase, classes, lib 매핑
├── logs/
├── temp/
├── webapps/
├── work/
├── start.bat                   ← 일반 시작
├── debug.bat                   ← JPDA 디버그 시작
└── stop.bat                    ← 종료`,
  },
  {
    title: "프로젝트 폴더에 생성되는 파일",
    code: `{프로젝트}/
├── tomcat-instance/
│   ├── .tomcat-instance        ← 설정 정보 (포트, 경로)
│   ├── tomcat-start.bat        ← 래퍼: 일반 시작
│   ├── tomcat-debug.bat        ← 래퍼: 디버그 시작
│   └── tomcat-stop.bat         ← 래퍼: 종료
└── .vscode/
    └── launch.json             ← VSCode 디버그 Attach 설정`,
  },
  {
    title: "Context XML (ROOT.xml) 핵심",
    description:
      "Maven 프로젝트의 target/classes와 target/dependency를 WEB-INF/classes, WEB-INF/lib로 매핑한다. WAR 빌드 없이 mvn compile만으로 변경사항이 즉시 반영된다.",
    code: `<Context docBase="{프로젝트}/web" reloadable="true">
    <Resources>
        <PreResources className="org.apache.catalina.webresources.DirResourceSet"
            base="{프로젝트}/target/classes"
            webAppMount="/WEB-INF/classes" />
        <PreResources className="org.apache.catalina.webresources.DirResourceSet"
            base="{프로젝트}/target/dependency"
            webAppMount="/WEB-INF/lib" />
    </Resources>
</Context>`,
  },
  {
    title: "실행 방법",
    table: [
      { param: "일반 시작", desc: "tomcat-instance\\tomcat-start.bat", example: "콘솔에서 실행" },
      { param: "디버그 시작", desc: "tomcat-instance\\tomcat-debug.bat", example: "JPDA 포트로 VSCode Attach" },
      { param: "종료", desc: "tomcat-instance\\tomcat-stop.bat", example: "Shutdown 포트로 종료" },
      { param: "VSCode 디버그", desc: ".vscode/launch.json → Attach", example: "F5로 디버거 연결" },
    ],
  },
];

const debugGuide = {
  title: "VS Code 디버그 연결 방법",
  prerequisite: {
    title: "사전 준비",
    items: [
      "VS Code 확장 프로그램 \"Debugger for Java\" (vscjava.vscode-java-debug) 설치",
      "VS Code 확장 프로그램 \"Language Support for Java\" (redhat.java) 설치",
      "init-tomcat-instance.bat 실행 완료 (launch.json 자동 생성됨)",
    ],
  },
  steps: [
    {
      step: "1. 디버그 모드로 톰캣 시작",
      description:
        "프로젝트 폴더의 tomcat-debug.bat을 실행한다. 톰캣이 JPDA 모드로 시작되며, 지정된 디버그 포트에서 디버거 연결을 대기한다.",
      code: `# 프로젝트 폴더에서 실행
tomcat-instance\\tomcat-debug.bat

# 콘솔에 아래와 유사한 메시지가 출력되면 정상
# Listening for transport dt_socket at address: 10083`,
    },
    {
      step: "2. launch.json 확인",
      description:
        "init-tomcat-instance.bat 실행 시 .vscode/launch.json이 자동 생성된다. 기존 launch.json이 있으면 configurations 배열에 항목이 추가된다.",
      code: `// .vscode/launch.json (자동 생성)
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "java",
            "name": "Tomcat Debug - Admin",
            "request": "attach",
            "hostName": "localhost",
            "port": 10083
        }
    ]
}`,
    },
    {
      step: "3. VS Code에서 디버거 연결 (Attach)",
      description:
        "VS Code에서 디버거를 톰캣 프로세스에 연결한다.",
      details: [
        "VS Code에서 프로젝트 폴더를 연다",
        "좌측 사이드바에서 실행 및 디버그(Run and Debug) 아이콘 클릭 (Ctrl+Shift+D)",
        '상단 드롭다운에서 "Tomcat Debug - {인스턴스명}" 선택',
        "F5 또는 초록색 재생 버튼 클릭",
        '"Connected to the target VM" 메시지가 나타나면 연결 성공',
      ],
    },
    {
      step: "4. 브레이크포인트 설정 및 디버깅",
      description:
        "디버거가 연결되면 일반적인 Java 디버깅 기능을 모두 사용할 수 있다.",
      details: [
        "Java 소스 파일에서 라인 번호 왼쪽을 클릭하여 브레이크포인트 설정 (빨간 점)",
        "브라우저에서 해당 기능을 호출하면 브레이크포인트에서 실행이 멈춤",
        "변수 값 확인: 좌측 VARIABLES 패널 또는 코드 위에 마우스 오버",
        "스텝 실행: F10 (Step Over), F11 (Step Into), Shift+F11 (Step Out)",
        "실행 계속: F5 (Continue)",
        "디버그 콘솔(Debug Console)에서 표현식 평가 가능",
      ],
    },
    {
      step: "5. Hot Code Replace (코드 실시간 반영)",
      description:
        "디버그 연결 상태에서 Java 코드를 수정하고 저장하면, VS Code Java 디버거가 자동으로 변경된 클래스를 JVM에 교체한다. 별도의 mvn compile 없이 저장만으로 즉시 반영된다.",
      details: [
        "Java 파일 수정 후 저장 (Ctrl+S) → 디버거가 자동 컴파일 및 Hot Replace 수행",
      ],
      code: `// ✅ Hot Replace 가능 — 메서드 본문(body)만 변경
public String getName(String id, int type) {
    return "hello";  →  return "world";   // 저장만 하면 즉시 반영
}

// ❌ Hot Replace 불가 — 메서드 시그니처 변경 (이름, 파라미터 타입·개수·순서)
// 파라미터 추가 → 톰캣 재시작 필요
public String getName(String id, int type, boolean flag) { ... }

// 메서드 이름 변경 → 톰캣 재시작 필요
public String getUserName(String id, int type) { ... }

// ❌ Hot Replace 불가 — 클래스 구조 변경
// 새 메서드 추가, 필드 추가·삭제 → 톰캣 재시작 필요
private String newField;
public void newMethod() { ... }`,
    },
  ],
  troubleshooting: [
    {
      problem: "연결 거부 (Connection refused)",
      solution:
        "tomcat-debug.bat이 실행 중인지 확인한다. 콘솔에 \"Listening for transport dt_socket at address: {포트}\" 메시지가 있어야 한다. 방화벽이 해당 포트를 차단하고 있지 않은지 확인한다.",
    },
    {
      problem: "브레이크포인트가 동작하지 않음 (회색 빈 원)",
      solution:
        "소스 코드와 실행 중인 클래스가 일치하지 않는 경우 발생한다. mvn compile을 다시 실행하고, target/classes에 최신 .class 파일이 있는지 확인한다.",
    },
    {
      problem: "launch.json에 설정이 없음",
      solution:
        'init-tomcat-instance.bat을 다시 실행하거나, launch.json에 위 설정을 수동으로 추가한다. "type"은 반드시 "java"여야 한다.',
    },
    {
      problem: "디버거 연결 후 응답 없음",
      solution:
        "톰캣 콘솔에서 에러 로그를 확인한다. OutOfMemoryError 등으로 JVM이 응답 불가 상태일 수 있다. 톰캣을 재시작한 후 다시 연결한다.",
    },
  ],
};

export default function TomcatInstance() {
  const [showScript, setShowScript] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            톰캣 인스턴스
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            init-tomcat-instance.bat — CATALINA_HOME 공유, CATALINA_BASE 분리 방식의 멀티 인스턴스 관리
          </p>
        </div>
        <a
          href="/downloads/init-tomcat-instance.bat"
          download="init-tomcat-instance.bat"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-brand-600 whitespace-nowrap"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          다운로드
        </a>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div
            key={section.title}
            className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
          >
            <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
              {section.title}
            </h3>

            {section.description && (
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {section.description}
              </p>
            )}

            {section.code && (
              <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm leading-relaxed text-gray-100">
                <code>{section.code}</code>
              </pre>
            )}

            {section.table && (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="py-2 pr-4 text-left font-medium text-gray-500 dark:text-gray-400">
                        항목
                      </th>
                      <th className="py-2 pr-4 text-left font-medium text-gray-500 dark:text-gray-400">
                        설명
                      </th>
                      <th className="py-2 text-left font-medium text-gray-500 dark:text-gray-400">
                        예시
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.map((row) => (
                      <tr
                        key={row.param}
                        className="border-b border-gray-100 dark:border-gray-700"
                      >
                        <td className="py-2 pr-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {row.param}
                        </td>
                        <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">
                          {row.desc}
                        </td>
                        <td className="py-2 text-gray-500 dark:text-gray-400">
                          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-700 dark:text-gray-300">
                            {row.example}
                          </code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        {/* VS Code 디버그 연결 가이드 */}
        <div className="rounded-xl border border-brand-200 bg-brand-50 p-5 dark:border-brand-800 dark:bg-brand-950">
          <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
            {debugGuide.title}
          </h3>

          {/* 사전 준비 */}
          <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              {debugGuide.prerequisite.title}
            </h4>
            <ul className="space-y-1">
              {debugGuide.prerequisite.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 단계별 가이드 */}
          <div className="space-y-4">
            {debugGuide.steps.map((s) => (
              <div
                key={s.step}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                  {s.step}
                </h4>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {s.description}
                </p>
                {s.code && (
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm leading-relaxed text-gray-100">
                    <code>{s.code}</code>
                  </pre>
                )}
                {s.details && (
                  <ol className="mt-3 space-y-1">
                    {s.details.map((d, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                      >
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                          {i + 1}
                        </span>
                        {d}
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ))}
          </div>

          {/* 트러블슈팅 */}
          <div className="mt-5 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              문제 해결 (Troubleshooting)
            </h4>
            <div className="space-y-3">
              {debugGuide.troubleshooting.map((t) => (
                <div key={t.problem}>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    {t.problem}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">
                    → {t.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 전체 스크립트 토글 */}
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <button
            onClick={() => setShowScript(!showScript)}
            className="flex w-full items-center justify-between p-5 text-left"
          >
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              전체 스크립트 보기
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
                <code>{scriptContent}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
