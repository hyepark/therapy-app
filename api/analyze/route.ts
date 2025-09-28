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
          { role: "user", content: "테스트 메시지" },
        ],
      }),
    });

    const text = await res.text(); // ✅ JSON이든 에러든 전부 문자열로 받음
    let data;
    try {
      data = JSON.parse(text); // ✅ 정상 JSON일 경우만 파싱
    } catch {
      data = { raw: text }; // ✅ JSON이 아닐 경우 원문 그대로 반환
    }

    if (!res.ok) {
      throw new Error(`OpenAI API Error: ${res.status} ${text}`);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
