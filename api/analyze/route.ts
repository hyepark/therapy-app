export const runtime = "nodejs";

// POST 요청 핸들러
export async function POST(req: Request) {
  try {
    // 여기서는 단순히 데모용 JSON을 반환
    return new Response(
      JSON.stringify({ message: "API 정상 작동 🚀" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: e.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// GET 요청 핸들러 (주소창에서 직접 열었을 때 확인용)
export async function GET() {
  return new Response(
    JSON.stringify({ message: "이 API는 POST로 호출해야 합니다." }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
