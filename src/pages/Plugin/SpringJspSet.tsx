const plugins = [
  {
    category: "Java",
    items: [
      {
        id: "redhat.java",
        name: "Language Support for Java",
        publisher: "Red Hat",
        description:
          "Java Linting, IntelliSense, formatting, refactoring, Maven/Gradle support, and project management. JDK 17+ 필요. 코드 자동완성, 에러 감지, 리팩토링 등 Java 개발의 핵심 기능을 제공한다.",
      },
      {
        id: "vscjava.vscode-java-debug",
        name: "Debugger for Java",
        publisher: "Microsoft",
        description:
          "Java 애플리케이션 디버깅 지원. 브레이크포인트, 스텝 실행, 변수 조회, 콜 스택 확인, Hot Code Replace 등 디버깅에 필요한 모든 기능을 제공한다.",
      },
      {
        id: "vscjava.vscode-java-dependency",
        name: "Project Manager for Java",
        publisher: "Microsoft",
        description:
          "Java 프로젝트의 의존성과 구조를 트리뷰로 관리한다. 패키지, 클래스, 라이브러리 탐색 및 새 프로젝트/패키지/클래스 생성 기능을 제공한다.",
      },
      {
        id: "vscjava.vscode-maven",
        name: "Maven for Java",
        publisher: "Microsoft",
        description:
          "Maven 프로젝트 탐색, pom.xml 편집 지원, Maven 명령 실행(clean, install, package 등), Archetype 기반 프로젝트 생성 기능을 제공한다.",
      },
    ],
  },
  {
    category: "XML / JSP",
    items: [
      {
        id: "redhat.vscode-xml",
        name: "XML",
        publisher: "Red Hat",
        description:
          "XML/XSD/DTD/XSLT 파일의 유효성 검사, 자동완성, 포맷팅을 지원한다. Spring Bean 설정(applicationContext.xml), web.xml, pom.xml 등 Java 프로젝트의 XML 설정 파일 편집에 필수적이다. JSP 파일의 XML 구조도 지원한다.",
      },
    ],
  },
  {
    category: "Utility",
    items: [
      {
        id: "formulahendry.auto-rename-tag",
        name: "Auto Rename Tag",
        publisher: "Jun Han",
        description:
          "HTML/XML/JSP에서 여는 태그를 수정하면 닫는 태그가 자동으로 함께 변경된다. JSP의 커스텀 태그(<c:forEach>, <fmt:message> 등) 편집 시 실수를 방지한다.",
      },
      {
        id: "esbenp.prettier-vscode",
        name: "Prettier - Code formatter",
        publisher: "Prettier",
        description:
          "코드를 일관된 스타일로 자동 포맷팅한다. JavaScript, HTML, CSS, JSON, XML 등을 지원하며, 저장 시 자동 포맷 설정과 함께 사용하면 팀 전체의 코드 스타일을 통일할 수 있다.",
      },
    ],
  },
];

export default function SpringJspSet() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Spring + JSP SET
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Spring MVC + JSP 개발에 필요한 VS Code 확장 프로그램 목록
        </p>
      </div>

      <div className="space-y-8">
        {plugins.map((group) => (
          <div key={group.category}>
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              {group.category}
            </h3>
            <div className="grid gap-4">
              {group.items.map((plugin) => (
                <div
                  key={plugin.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                        {plugin.name}
                      </h4>
                      <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                        {plugin.publisher} &middot;{" "}
                        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          {plugin.id}
                        </code>
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {plugin.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
