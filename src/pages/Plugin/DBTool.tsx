export default function DBTool() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          DB Tool
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          VS Code에서 DB를 다루는 것에 대한 현실적인 조언
        </p>
      </div>

      {/* 결론 */}
      <div className="mb-6 rounded-xl border-2 border-red-300 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <h3 className="text-lg font-bold text-red-800 dark:text-red-300">
          결론부터 말하면
        </h3>
        <p className="mt-2 text-base leading-relaxed text-red-700 dark:text-red-400">
          DB 작업은 <strong>전문 DB 툴</strong>을 사용하는 것이 정신건강에
          이롭다.
        </p>
      </div>

      {/* 이유 */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
          VS Code DB 확장의 한계
        </h3>
        <ul className="space-y-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-red-500">&#x2717;</span>
            <span>
              <strong>자동완성이 빈약하다</strong> — 테이블명, 컬럼명 자동완성이
              전문 툴 대비 현저히 부족하다. 복잡한 쿼리를 작성할수록 체감된다.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-red-500">&#x2717;</span>
            <span>
              <strong>결과 조회가 불편하다</strong> — 대량 데이터 조회, 정렬,
              필터링, 셀 단위 편집 등 기본적인 작업이 번거롭다.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-red-500">&#x2717;</span>
            <span>
              <strong>ERD, 테이블 구조 파악이 어렵다</strong> — 테이블 간 관계를
              시각적으로 확인하기 힘들고 DDL 확인도 불편하다.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-red-500">&#x2717;</span>
            <span>
              <strong>데이터 export/import 기능이 제한적이다</strong> — CSV,
              Excel, INSERT문 변환 등 실무에서 자주 쓰는 기능이 부족하다.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 shrink-0 text-red-500">&#x2717;</span>
            <span>
              <strong>확장 프로그램 충돌</strong> — DB 확장이 Java 확장과
              리소스를 경쟁하여 VS Code가 느려지는 경우가 있다.
            </span>
          </li>
        </ul>
      </div>

      {/* 추천 툴 */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
          추천 DB 전문 툴
        </h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                DBeaver (Community Edition)
              </h4>
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                무료
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              오픈소스 범용 DB 클라이언트. Oracle, MySQL, PostgreSQL, MSSQL 등
              거의 모든 DB 지원. ERD 자동 생성, 데이터 편집, export/import 기능이
              강력하다.
            </p>
          </div>

          <div className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                HeidiSQL
              </h4>
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                무료
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              가볍고 빠른 Windows 전용 DB 클라이언트. MySQL, MariaDB,
              PostgreSQL, MSSQL 지원. 설치 용량이 작고 직관적인 UI가 장점이다.
            </p>
          </div>

          <div className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                DataGrip
              </h4>
              <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                유료
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              JetBrains의 DB 전문 IDE. 지능적인 SQL 자동완성, 리팩토링, 버전
              관리 통합이 최고 수준이다. IntelliJ 사용자에게 익숙한 인터페이스.
            </p>
          </div>

          <div className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Orange (오렌지)
              </h4>
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                무료
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              국산 DB 관리 툴. Oracle 특화 기능이 강력하며 한글 UI로 접근성이
              좋다. 국내 SI/SM 프로젝트에서 많이 사용된다.
            </p>
          </div>
        </div>
      </div>

      {/* 요약 */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
          정리
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-blue-700 dark:text-blue-400">
          VS Code는 <strong>코드 편집기</strong>로서 최고지만 DB 작업까지
          맡기는 건 욕심이다. 코드는 VS Code에서, DB는 전문 툴에서. 역할을
          나누면 둘 다 쾌적해진다.
        </p>
      </div>
    </div>
  );
}
