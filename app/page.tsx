const runAnalysis = async () => {
  try {
    setLoading(true);
    const res = await fetch("/api/analyze", {
      method: "POST",   // ✅ 꼭 POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ test: true })  // ✅ body도 같이 주기
    });
    const data = await res.json();
    setResult(data);
  } catch (e: any) {
    setResult({ error: e.message });
  } finally {
    setLoading(false);
  }
};
