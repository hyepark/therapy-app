export const runtime = "nodejs";

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
