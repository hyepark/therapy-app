import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    console.log("BODY:", body);
    console.log("KEY EXISTS:", !!process.env.OPENAI_API_KEY);

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
    console.error("API ERROR:", e);

    return new Response(
      JSON.stringify({
        error: e.message || "Unknown error",
        stack: e.stack || null,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ message: "이 API는 POST로 호출해야 합니다." }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
