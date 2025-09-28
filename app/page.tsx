"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const storyData = [
    { name: "엄마B - 산후 다이어트", value: 18 },
    { name: "엄마C - 아기 돌잔치", value: 7 },
  ];

  const COLORS = ["#0088FE", "#FF8042"];

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: { gender: "여성", age: 32, context: "최근 출산" },
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setResult({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>TheraLens Demo (Next.js)</h1>

      {/* 버튼 */}
      <button onClick={runAnalysis} disabled={loading}>
        {loading ? "분석 중..." : "GPT로 분석 실행"}
      </button>

      {/* 📊 그래프 1: 스토리별 시청 분포 */}
      <PieChart width={400} height={300}>
        <Pie
          data={storyData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {storyData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      {/* 결과 출력 */}
      {result && (
        <pre style={{ background: "#f7f7f7", padding: 12 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
