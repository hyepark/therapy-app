"use client";

import { useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Home() {
  const [stories] = useState([
    { user: "엄마B", topic: "산후 다이어트", minutes: 18 },
    { user: "엄마C", topic: "아기 돌잔치", minutes: 7 },
    { user: "엄마D", topic: "직장 복귀", minutes: 12 },
  ]);
  const [events] = useState([
    { ts: "2025-09-19", type: "reels", minutes: 31 },
    { ts: "2025-09-20", type: "feed", minutes: 15 },
    { ts: "2025-09-21", type: "reels", minutes: 42 },
  ]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

  const runAnalysis = async (mode: "basic" | "gpt") => {
    try {
      setLoading(true);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: { gender: "여성", age: 32, context: "최근 출산" },
          stories,
          events,
          mode,
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
      <h1>TheraLens 상담 보조 데모</h1>

      {/* 📊 시각화 - 스토리별 시청 시간 */}
      <section style={{ marginBottom: 30 }}>
        <h3>스토리별 시청 시간 분포</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={stories}
              dataKey="minutes"
              nameKey="topic"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {stories.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* 📊 시각화 - 일자별 사용 시간 */}
      <section style={{ marginBottom: 30 }}>
        <h3>일자별 평균 사용 시간</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={events}>
            <XAxis dataKey="ts" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* 분석 버튼 */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => runAnalysis("basic")} disabled={loading}>
          {loading ? "분석 중..." : "로컬 분석"}
        </button>
        <button onClick={() => runAnalysis("gpt")} disabled={loading}>
          {loading ? "추론 중..." : "GPT 도움 받기"}
        </button>
      </div>

      {/* 결과 카드 */}
      {result && (
        <section style={{ marginTop: 20 }}>
          <h3>분석 결과</h3>
          {result.error && (
            <div
              style={{
                background: "#ffe6e6",
                padding: 12,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              ❌ 오류: {result.error}
            </div>
          )}
          {result.summary && (
            <div
              style={{
                background: "#e6f7ff",
                padding: 12,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <strong>요약</strong>
              <p>{result.summary}</p>
              <p>인사이트: {result.insight}</p>
            </div>
          )}
          {result.gptResult && (
            <div
              style={{
                background: "#f6ffed",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <strong>GPT 분석</strong>
              <p style={{ whiteSpace: "pre-line" }}>{result.gptResult}</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
