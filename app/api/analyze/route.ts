export const runtime = "nodejs";

export async function POST(req: Request) {
  return new Response(
    JSON.stringify({ message: "POST 응답 정상 🚀" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

export async function GET() {
  return new Response(
    JSON.stringify({ message: "GET 응답 정상 ✅" }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

