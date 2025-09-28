import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // OpenAI 호출
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "너는 심리상담 보조 도구다. 사용자의 SNS 행동 데이터를 기반으로 인사이트를 제공한다.",
        },
        {
          role: "user",
          content: JSON.stringify(body),
        },
      ],
    });

    const message = completion.choices?.[0]?.message?.content || "응답 없음";

    return new Response(
      JSON.stringify({ result: message }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    // 에러 발생 시에도 항상 JSON 반환
    return new Response(
      JSON.stringify({
        error: e.message || "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
