"use client";

import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", { method: "POST" });

      // 응답을 먼저 텍스트로 받아서 확인
      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: "서버가 JSON이 아닌 응답을 보냈습니다", raw: text };
      }

      setResult(data);
    } catch (e: any) {
      setResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>TheraLens Demo (Next.js)</h1>

      <button
        type="button" // ✅ 폼 제출 방지
        onClick={runAnalysis}
        disabled={loading}
      >
        {loading ? "분석 중..." : "분석 실행"}
      </button>

      {result && (
        <pre style={{ background: "#f7f7f7", padding: 12, marginTop: 20 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
