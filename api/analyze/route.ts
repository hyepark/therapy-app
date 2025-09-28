export const runtime = "nodejs";

// 무조건 JSON 반환
export async function POST(req: Request) {
  const response = { message: "API 정상 작동 🚀" };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// GET 요청도 대비 (브라우저에서 직접 접속 시)
export async function GET() {
  const response = { message: "이 API는 POST로 호출해야 합니다." };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
