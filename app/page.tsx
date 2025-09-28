"use client";

import { useState } from "react";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [useGpt, setUseGpt] = useState(true);

  // 임의 데이터 (스토리 / 이벤트)
  const stories = [
    { user: "엄마B", topic: "산후 다이어트", minutes: 18 },
    { user: "엄마C", topic: "아기 돌잔치", minutes: 7 },
    { user: "엄마D", topic: "직장 복귀", minutes: 12 },
  ];
  const events = [
    { ts: "2025-09-19", type: "reels", minutes: 31 },
    { ts: "2025-09-20", type: "feed", minutes: 15 },
    { ts: "2025-09-21", type: "reels", minutes: 42 },
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

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
          events,
          stories,
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

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h1>TheraLens Demo (Next.js)</h1>

      {/* 📊 그래프 1: 스토리별 시청 분포 */}
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

      {/* 📊 그래프 2: 일자별 사용 시간 */}
      <section style={{ marginBottom: 30 }}>
        <h3>일자별 사용 시간</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={events}>
            <XAxis dataKey="ts" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* 실행 버튼 */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "10px 0" }}>
        <button onClick={runAnalysis} disabled={loading}>
          {loading ? "분석 중..." : useGpt ? "GPT로 분석 실행" : "로컬 분석 실행"}
        </button>
        <label style={{ fontSize: 13 }}>
          <input
