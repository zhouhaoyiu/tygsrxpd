export async function api<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(
    (import.meta.env.VITE_API_BASE || "/api") + path,
    {
      method: body === undefined ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + (sessionStorage.getItem("dispatchToken") || ""),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    },
  );
  const data = await response.json();
  if (response.status === 401) {
    sessionStorage.removeItem("dispatchToken");
    if (location.pathname !== "/login") location.assign("/login");
  }
  if (!response.ok || data?.success === false)
    throw new Error(data.message || "请求失败，请重试");
  return data as T;
}
