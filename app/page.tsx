const runAnalysis = async () => {
  try {
    setLoading(true);
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: true }),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: "서버가 JSON이 아닌 응답을 보냈습니다", raw: text };
    }
    setResult(data);
  } catch (e: any) {
    setResult({ error: e.message });
  } finally {
    setLoading(false);
  }
};
