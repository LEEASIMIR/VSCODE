import { useEffect, useId, useRef } from "react";
import mermaid from "mermaid";
import PageMeta from "../../components/common/PageMeta";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

function MermaidRenderer({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, "_");

  useEffect(() => {
    const render = async () => {
      if (!containerRef.current) return;
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
      });
      try {
        const { svg } = await mermaid.render(`mermaid${uniqueId}`, code);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch {
        const errorEl = document.getElementById(`dmermaid${uniqueId}`);
        if (errorEl) errorEl.remove();
        if (containerRef.current) {
          containerRef.current.innerHTML =
            '<p class="text-sm text-red-500">다이어그램 렌더링 실패</p>';
        }
      }
    };
    render();
  }, [code, uniqueId]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center overflow-x-auto rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/50"
    />
  );
}

type DiagramType = {
  title: string;
  description: string;
  examples: {
    label: string;
    code: string;
  }[];
};

const diagrams: DiagramType[] = [
  {
    title: "Flowchart (플로우차트)",
    description:
      "프로세스 흐름을 시각화합니다. 방향은 TB(위→아래), LR(왼→오른), BT(아래→위), RL(오른→왼)로 지정합니다.",
    examples: [
      {
        label: "기본 플로우차트",
        code: `graph TD
    A[시작] --> B{조건 확인}
    B -->|Yes| C[처리]
    B -->|No| D[종료]
    C --> D`,
      },
      {
        label: "노드 형태",
        code: `graph LR
    A[사각형] --> B(둥근 사각형)
    B --> C([경기장형])
    C --> D{다이아몬드}
    D --> E((원형))
    E --> F[[서브루틴]]`,
      },
      {
        label: "링크 스타일",
        code: `graph LR
    A --> B
    A --- C
    A -.- D
    A -.-> E
    A ==> F
    A -- 텍스트 --> G`,
      },
    ],
  },
  {
    title: "Sequence Diagram (시퀀스 다이어그램)",
    description: "객체 간의 상호작용을 시간 순서대로 표현합니다.",
    examples: [
      {
        label: "기본 시퀀스",
        code: `sequenceDiagram
    participant C as Client
    participant S as Server
    participant DB as Database

    C->>S: HTTP 요청
    activate S
    S->>DB: 쿼리 실행
    activate DB
    DB-->>S: 결과 반환
    deactivate DB
    S-->>C: HTTP 응답
    deactivate S`,
      },
      {
        label: "조건 / 반복",
        code: `sequenceDiagram
    participant U as User
    participant A as App

    U->>A: 로그인 요청
    alt 인증 성공
        A-->>U: 대시보드 표시
    else 인증 실패
        A-->>U: 에러 메시지
    end

    loop 매 5초마다
        A->>A: 상태 체크
    end`,
      },
      {
        label: "메시지 유형",
        code: `sequenceDiagram
    A->>B: 실선 + 화살표
    A-->>B: 점선 + 화살표
    A-)B: 실선 + 열린 화살표
    A--)B: 점선 + 열린 화살표
    A-xB: 실선 + X
    A--xB: 점선 + X`,
      },
    ],
  },
  {
    title: "Class Diagram (클래스 다이어그램)",
    description: "클래스 구조와 관계를 표현합니다.",
    examples: [
      {
        label: "기본 클래스",
        code: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound() void
    }
    class Dog {
        +String breed
        +fetch() void
    }
    class Cat {
        +String color
        +purr() void
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
      },
      {
        label: "관계 유형",
        code: `classDiagram
    classA <|-- classB : 상속
    classC *-- classD : 구성
    classE o-- classF : 집합
    classG --> classH : 연관
    classI ..> classJ : 의존
    classK ..|> classL : 구현`,
      },
    ],
  },
  {
    title: "Gantt Chart (간트 차트)",
    description: "프로젝트 일정과 작업 진행 상황을 시각화합니다.",
    examples: [
      {
        label: "프로젝트 일정",
        code: `gantt
    title 프로젝트 일정
    dateFormat YYYY-MM-DD

    section 기획
    요구사항 분석    :a1, 2024-01-01, 7d
    설계 문서 작성    :a2, after a1, 5d

    section 개발
    프론트엔드 개발  :b1, after a2, 14d
    백엔드 개발      :b2, after a2, 14d
    API 연동         :b3, after b1, 7d

    section 테스트
    단위 테스트       :c1, after b3, 5d
    통합 테스트       :c2, after c1, 5d`,
      },
    ],
  },
  {
    title: "State Diagram (상태 다이어그램)",
    description: "객체의 상태 변화를 표현합니다.",
    examples: [
      {
        label: "주문 상태",
        code: `stateDiagram-v2
    [*] --> 주문접수
    주문접수 --> 결제대기
    결제대기 --> 결제완료 : 결제 성공
    결제대기 --> 주문취소 : 결제 실패
    결제완료 --> 배송준비
    배송준비 --> 배송중
    배송중 --> 배송완료
    배송완료 --> [*]
    주문취소 --> [*]`,
      },
    ],
  },
  {
    title: "Pie Chart (파이 차트)",
    description: "비율 데이터를 파이 차트로 표현합니다.",
    examples: [
      {
        label: "브라우저 점유율",
        code: `pie title 브라우저 점유율
    "Chrome" : 65
    "Safari" : 19
    "Firefox" : 4
    "Edge" : 4
    "기타" : 8`,
      },
    ],
  },
  {
    title: "ER Diagram (ERD)",
    description: "엔티티 간의 관계를 표현합니다.",
    examples: [
      {
        label: "주문 시스템 ERD",
        code: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "ordered in"

    CUSTOMER {
        int id PK
        string name
        string email
    }
    ORDER {
        int id PK
        date created_at
        string status
    }
    PRODUCT {
        int id PK
        string name
        float price
    }`,
      },
      {
        label: "관계 표기법",
        code: `erDiagram
    A ||--|| B : "1:1 (정확히 하나)"
    C ||--o{ D : "1:N (0개 이상)"
    E }o--o{ F : "N:M (0개 이상)"`,
      },
    ],
  },
];

export default function MermaidGuide() {
  return (
    <div>
      <PageMeta
        title="Mermaid 작성법 | Syntax Reference"
        description="Mermaid 다이어그램 문법 가이드"
      />

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mermaid 작성법
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Mermaid 다이어그램의 주요 구문과 사용 예시를 정리한 가이드입니다.
          Markdown 코드 블록 안에{" "}
          <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">
            ```mermaid
          </code>
          로 감싸서 사용합니다.
        </p>
      </div>

      <div className="space-y-6">
        {diagrams.map((diagram) => (
          <div
            key={diagram.title}
            className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {diagram.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {diagram.description}
              </p>
            </div>
            <div className="p-5">
              <div className="space-y-6">
                {diagram.examples.map((example) => (
                  <div key={example.label}>
                    <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {example.label}
                    </p>
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase text-gray-400">
                          구문
                        </p>
                        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-100">
                          <code>{example.code}</code>
                        </pre>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase text-gray-400">
                          출력
                        </p>
                        <MermaidRenderer code={example.code} />
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
