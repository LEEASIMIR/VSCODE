import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import PageMeta from "../../components/common/PageMeta";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
});

const STORAGE_KEY = "mermaid-playground-content";

const defaultCode = `graph TD
    A[시작] --> B{조건 확인}
    B -->|Yes| C[처리]
    B -->|No| D[종료]
    C --> D`;

export default function MermaidPlayground() {
  const [code, setCode] = useState(
    () => localStorage.getItem(STORAGE_KEY) ?? defaultCode
  );
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const renderCounter = useRef(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, code);
  }, [code]);

  useEffect(() => {
    const render = async () => {
      if (!previewRef.current) return;
      const id = `mermaid-pg-${++renderCounter.current}`;

      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
      });

      document.querySelectorAll('[id^="dmermaid-pg-"]').forEach((el) => el.remove());

      try {
        const { svg } = await mermaid.render(id, code);
        if (previewRef.current) {
          previewRef.current.innerHTML = svg;
        }
        setError(null);
      } catch (e) {
        const errorEl = document.getElementById(`d${id}`);
        if (errorEl) errorEl.remove();
        setError(e instanceof Error ? e.message : "렌더링 실패");
      }
    };

    const timer = setTimeout(render, 500);
    return () => clearTimeout(timer);
  }, [code]);

  // Ctrl+wheel zoom on preview
  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      setZoom((prev) => Math.min(200, Math.max(25, prev + (e.deltaY < 0 ? 10 : -10))));
    };
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  const handleClear = () => {
    setCode("");
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div>
      <PageMeta
        title="Mermaid Playground | Syntax Reference"
        description="Mermaid 다이어그램 실시간 미리보기 에디터"
      />

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Mermaid Playground
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            왼쪽에 Mermaid 구문을 작성하면 오른쪽에서 실시간으로 다이어그램을
            확인할 수 있습니다.
          </p>
        </div>
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800"
        >
          초기화
        </button>
      </div>

      <div className="grid h-[calc(100vh-180px)] grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Editor */}
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Editor
            </span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 resize-none bg-transparent p-4 font-mono text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
            placeholder="Mermaid 구문을 입력하세요..."
            spellCheck={false}
          />
        </div>

        {/* Preview */}
        <div className="flex flex-col rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Preview
            </span>
            <div className="flex items-center gap-2">
              {error && (
                <span className="text-xs text-red-500">구문 오류</span>
              )}
              <div className="flex items-center gap-1 rounded-lg border border-gray-200 px-1 dark:border-gray-700">
                <button
                  onClick={() => setZoom((z) => Math.max(25, z - 25))}
                  className="px-1.5 py-0.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  −
                </button>
                <button
                  onClick={() => setZoom(100)}
                  className="min-w-[3rem] px-1 py-0.5 text-center text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {zoom}%
                </button>
                <button
                  onClick={() => setZoom((z) => Math.min(200, z + 25))}
                  className="px-1.5 py-0.5 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div
            ref={previewContainerRef}
            className="flex flex-1 items-center justify-center overflow-auto p-4"
          >
            <pre
              className={`max-w-full overflow-x-auto text-xs text-red-400 ${error ? "" : "hidden"}`}
            >
              {error}
            </pre>
            <div
              ref={previewRef}
              className={error ? "hidden" : ""}
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center center",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
