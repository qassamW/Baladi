import type { Category, Report } from "./types";
import { Platform } from "react-native";

const configured = process.env.EXPO_PUBLIC_API_URL?.trim();
export const apiUrl = configured?.replace(/\/+$/, "") || "";

function requireApiUrl(): string {
  const setup = "افتح apps/mobile/.env وأضف EXPO_PUBLIC_API_URL=http://MY_LAPTOP_IP:4000، ثم أوقف Expo وشغّله مجدداً.";
  if (!apiUrl) throw new Error(`عنوان الخادم غير مُعدّ. ${setup}`);
  let parsed: URL;
  try { parsed = new URL(apiUrl); }
  catch { throw new Error(`عنوان الخادم غير صالح. ${setup}`); }
  if (!["http:", "https:"].includes(parsed.protocol) || parsed.pathname !== "/" || parsed.search || parsed.hash || parsed.hostname === "MY_LAPTOP_IP") {
    throw new Error(`عنوان الخادم غير صالح للهاتف. ${setup}`);
  }
  if (Platform.OS !== "web" && ["localhost", "127.0.0.1"].includes(parsed.hostname)) throw new Error(`عنوان الخادم غير صالح للهاتف. ${setup}`);
  return apiUrl;
}

export function imageUrl(path: string | null): string | null {
  return path ? path.startsWith("http") ? path : `${apiUrl}${path}` : null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const baseUrl = requireApiUrl();
  let response: Response;
  try { response = await fetch(`${baseUrl}${path}`, options); }
  catch { throw new Error(`تعذر الاتصال بـ ${baseUrl}. افتح ${baseUrl}/health في متصفح الهاتف، وتأكد من تشغيل الخادم واتصال الجهازين بنفس الشبكة.`); }
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || "تعذر إكمال الطلب. حاول مرة أخرى.");
  return payload as T;
}

export const getReports = () => request<Report[]>("/reports");
export const getReport = (id: string) => request<Report>(`/reports/${encodeURIComponent(id)}`);

export interface NewReport {
  category: Category;
  description: string;
  latitude: number;
  longitude: number;
  image?: { uri: string; mimeType?: string; fileName?: string };
}

export async function createReport(input: NewReport): Promise<Report> {
  const body = new FormData();
  body.append("category", input.category);
  body.append("description", input.description);
  body.append("latitude", String(input.latitude));
  body.append("longitude", String(input.longitude));
  if (input.image) {
    const fileName = input.image.fileName || "report.jpg";
    const mimeType = input.image.mimeType || "image/jpeg";

    if (Platform.OS === "web") {
      const response = await fetch(input.image.uri);
      if (!response.ok) throw new Error("تعذر تجهيز الصورة للرفع. اختر الصورة مرة أخرى.");
      const selectedImage = await response.blob();
      const upload = selectedImage.type ? selectedImage : new Blob([selectedImage], { type: mimeType });
      body.append("image", upload, fileName);
    } else {
      body.append("image", {
        uri: input.image.uri,
        name: fileName,
        type: mimeType
      } as unknown as Blob);
    }
  }
  return request<Report>("/reports", { method: "POST", body });
}
