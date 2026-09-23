import type { Report, Status } from "./model";

const baseUrl = (process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000").replace(/\/+$/, "");

export function reportImageUrl(path: string | null) {
  return path ? path.startsWith("http") ? path : `${baseUrl}${path}` : null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, { cache: "no-store", ...options });
  } catch {
    throw new Error(`تعذر الاتصال بخادم بلدي على ${baseUrl}. تأكد من تشغيل API على المنفذ 4000.`);
  }
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data && typeof data === "object" && "error" in data && typeof data.error === "string" ? data.error : "تعذر إكمال الطلب.";
    throw new Error(message);
  }
  return data as T;
}

export const getReports = () => request<Report[]>("/reports");
export const getReport = (id: string) => request<Report>(`/reports/${encodeURIComponent(id)}`);
export const updateReport = (id: string, change: { status?: Status; department?: string; adminNote?: string }) => request<Report>(`/reports/${encodeURIComponent(id)}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(change)
});
