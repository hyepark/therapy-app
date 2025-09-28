import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // 또는 gpt-4o, gpt-4.1
      messages: [
        {
          role: "system",
          content: "너는 심리상담 보조 도구야. 사용자의 SNS 행동 데이터를 분석해서 인사이트를 준다.",
        },
        {
          role: "user",
          content: JSON.stringify(body),
        },
      ],
    });

    return new Response(
      JSON.stringify({ result: completion.choices[0].message.content }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
