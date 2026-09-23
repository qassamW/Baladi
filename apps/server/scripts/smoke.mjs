import { readFile, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

const base = "http://127.0.0.1:4000";
const root = path.resolve(import.meta.dirname, "../../..");
let created;
try {
  const health = await fetch(`${base}/health`).then(response => response.json());
  if (!health.ok) throw new Error("Health check failed");
  const form = new FormData();
  form.append("category", "WATER");
  form.append("description", "اختبار إرسال بلاغ محلي");
  form.append("latitude", "31.7683");
  form.append("longitude", "35.2137");
  form.append("image", new Blob([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/lXcAAAAASUVORK5CYII=", "base64")], { type: "image/png" }), "test.png");
  const createResponse = await fetch(`${base}/reports`, { method: "POST", body: form });
  created = await createResponse.json();
  if (createResponse.status !== 201 || !created.id || !created.imageUrl) throw new Error(`Create failed: ${JSON.stringify(created)}`);
  const imageResponse = await fetch(`${base}${created.imageUrl}`);
  if (!imageResponse.ok) throw new Error("Uploaded image is inaccessible");
  const read = await fetch(`${base}/reports/${created.id}`).then(response => response.json());
  if (read.id !== created.id) throw new Error("Read failed");
  const updateResponse = await fetch(`${base}/reports/${created.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "ASSIGNED", department: "قسم المياه", adminNote: "تم تحويل البلاغ إلى قسم المياه." }) });
  const updated = await updateResponse.json();
  if (!updateResponse.ok || updated.status !== "ASSIGNED") throw new Error("Update failed");
  const list = await fetch(`${base}/reports`).then(response => response.json());
  if (!list.some(report => report.id === created.id)) throw new Error("Report absent from list");
  console.log(`API smoke check passed: ${created.ticketNumber}, image, list, details, update`);
} finally {
  if (created?.id) {
    const file = path.join(root, "data/reports.json");
    const reports = JSON.parse(await readFile(file, "utf8"));
    await writeFile(file, JSON.stringify(reports.filter(report => report.id !== created.id), null, 2) + "\n");
    if (created.imageUrl?.startsWith("/uploads/")) await unlink(path.join(root, created.imageUrl.slice(1))).catch(() => {});
  }
}
