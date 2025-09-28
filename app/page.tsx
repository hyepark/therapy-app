"use client";

import { useState } from "react";

export default function Home() {
  const [stories, setStories] = useState([
    { user: "엄마B", topic: "산후 다이어트", minutes: 18 },
    { user: "엄마C", topic: "아기 돌잔치", minutes: 7 },
  ]);
  const [events, setEvents] = useState([
    { ts: "2025-09-19 22:50", type: "reels", minutes: 31 },
    { ts: "2025-09-20 12:30", type: "feed", minutes: 15 },
  ]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h1>TheraLens 상담 보조 데모</h1>

      {/* 사용자 프로필 */}
      <section style={{ marginBottom: 20 }}>
        <h3>사용자 프로필</h3>
        <p>여성 · 30대 · 최근 출산</p>
      </section>

      {/* 인스타그램 행동 데이터 */}
      <section style={{ marginBottom: 20 }}>
        <h3>일자별 사용 이벤트</h3>
        <ul>
          {events.map((e, i) => (
            <li key={i}>
              {e.ts} · {e.type} 시청 {e.minutes}분
            </li>
          ))}
        </ul>

        <h3>스토리 뷰잉 패턴</h3>
        <ul>
          {stories.map((s, i) => (
            <li key={i}>
              {s.user} · {s.topic} · {s.minutes}분
            </li>
          ))}
        </ul>
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

      {/* 결과 출력 */}
      {result && (
        <section style={{ marginTop: 20 }}>
          <h3>분석 결과</h3>
          <pre style={{ background: "#f7f7f7", padding: 12 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
