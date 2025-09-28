"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [useGpt, setUseGpt] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 클라이언트 전용 렌더링 제어 (Hydration 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  const runAnalysis = async () => {
    if (!useGpt) {
      setResult({ message: "로컬 분석 실행됨 (데모)" });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: { gender: "여성", age: 32, context: "최근 출산" },
          events: [
            { ts: "2025-09-19 22:50", type: "reels", minutes: 31 },
            { ts: "2025-09-20 12:30", type: "feed", minutes: 15 },
          ],
          stories: [
            { user: "엄마B", topic: "산후 다이어트", minutes: 18 },
            { user: "엄마C", topic: "아기 돌잔치", minutes: 7 },
          ],
        }),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  // 서버 렌더링 단계에서는 비워둠 (Hydration mismatch 방지)
  if (!mounted) return null;

  return (
    <div style={{ padding: 20 }}>
      <h1>TheraLens Demo (Next.js)</h1>

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          margin: "10px 0",
        }}
      >
        <button onClick={runAnalysis} disabled={loading}>
          {loading
            ? "분석 중..."
            : useGpt
            ? "GPT로 분석 실행"
            : "로컬 분석 실행"}
        </button>

        <label style={{ fontSize: 13 }}>
          <input
            type="checkbox"
            checked={useGpt}
            onChange={(e) => setUseGpt(e.target.checked)}
          />{" "}
          GPT 사용
        </label>
      </div>

      {result && (
        <pre style={{ background: "#f7f7f7", padding: 12 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
