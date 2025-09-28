export const runtime = "nodejs";

// GET 요청 (URL 직접 접속 시 안내)
export async function GET() {
  return new Response(
    JSON.stringify({ message: "POST 요청으로만 사용 가능합니다." }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

// POST 요청 (GPT 호출)
export async function POST(req: Request) {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "테스트 메시지" }
        ]
      })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`OpenAI API Error: ${res.status} ${text}`);
    }

    const data = await res.json();

    return new Response(
      JSON.stringify({ result: data.choices?.[0]?.message?.content ?? "" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
