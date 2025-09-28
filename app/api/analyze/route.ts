import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profile, stories, events, mode } = body;

    if (mode === "basic") {
      // 단순 로컬 분석
      return new Response(
        JSON.stringify({
          summary: "로컬 규칙 기반 분석 결과",
          profile,
          stories,
          events,
          insight: "스토리를 공식 반응(댓글, 좋아요) 없이 오래 보는 경향 → 내적 비교 성향 가능",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (mode === "gpt") {
      // GPT 추론 확장
      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "너는 심리상담 보조 도구다. 사용자의 인스타그램 행동 데이터를 분석해서 상담사가 볼 수 있는 인사이트와 가설을 제시해라. '가설 / 근거 / 제안' 형식으로 정리하라.",
          },
          {
            role: "user",
            content: `사용자 정보: ${JSON.stringify(profile)}\n스토리: ${JSON.stringify(
              stories
            )}\n이벤트: ${JSON.stringify(events)}`,
          },
        ],
      });

      return new Response(
        JSON.stringify({ gptResult: completion.choices[0].message.content }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "지원하지 않는 모드" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
