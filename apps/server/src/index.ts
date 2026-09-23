import cors from "cors";
import express from "express";
import multer from "multer";
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { categories, statuses, type Category, type Report, type Status } from "./model.js";
import { readReports, updateReports } from "./store.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const uploadsDir = process.env.BALADI_STORAGE_DIR?.trim()
  ? path.join(path.resolve(process.env.BALADI_STORAGE_DIR), "uploads")
  : path.resolve(process.cwd(), "../../uploads");
await mkdir(uploadsDir, { recursive: true });

app.use(cors());
app.use(express.json({ limit: "64kb" }));
app.use("/uploads", express.static(uploadsDir));

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (_request, file, callback) => {
      const extension = file.mimetype === "image/png" ? ".png" : file.mimetype === "image/webp" ? ".webp" : ".jpg";
      callback(null, `${randomUUID()}${extension}`);
    }
  }),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) { callback(new Error("نوع الصورة غير مدعوم. استخدم JPG أو PNG أو WebP.")); return; }
    callback(null, true);
  }
});

const validCategory = (value: unknown): value is Category => typeof value === "string" && categories.includes(value as Category);
const validStatus = (value: unknown): value is Status => typeof value === "string" && statuses.includes(value as Status);
const coordinate = (value: unknown, limit: number) => {
  const number = typeof value === "number" || typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
  return Number.isFinite(number) && Math.abs(number) <= limit ? number : null;
};
const fail = (message: string) => ({ error: message });

app.get("/health", (_request, response) => response.json({ ok: true }));

app.get("/reports", async (_request, response, next) => {
  try { response.json((await readReports()).sort((a, b) => b.createdAt.localeCompare(a.createdAt))); }
  catch (error) { next(error); }
});

app.get("/reports/:id", async (request, response, next) => {
  try {
    const report = (await readReports()).find(item => item.id === request.params.id);
    if (!report) { response.status(404).json(fail("البلاغ غير موجود")); return; }
    response.json(report);
  } catch (error) { next(error); }
});

app.post("/reports", upload.single("image"), async (request, response, next) => {
  const removeUpload = async () => { if (request.file) await unlink(request.file.path).catch(() => {}); };
  try {
    const { category, description, address } = request.body;
    const latitude = coordinate(request.body.latitude, 90);
    const longitude = coordinate(request.body.longitude, 180);
    if (!validCategory(category) || typeof description !== "string" || !description.trim() || description.trim().length > 2000 || latitude === null || longitude === null) {
      await removeUpload(); response.status(400).json(fail("تحقق من التصنيف والوصف والموقع")); return;
    }
    if (address !== undefined && (typeof address !== "string" || address.length > 200)) {
      await removeUpload(); response.status(400).json(fail("العنوان غير صالح")); return;
    }
    const report = await updateReports(reports => {
      const nextNumber = Math.max(0, ...reports.map(item => Number(item.ticketNumber.match(/^BLD-(\d+)$/)?.[1]) || 0)) + 1;
      const now = new Date().toISOString();
      const item: Report = {
        id: randomUUID(), ticketNumber: `BLD-${String(nextNumber).padStart(5, "0")}`,
        category, description: description.trim(), imageUrl: request.file ? `/uploads/${request.file.filename}` : null,
        latitude, longitude, ...(address?.trim() ? { address: address.trim() } : {}),
        status: "NEW", createdAt: now, updatedAt: now
      };
      reports.push(item);
      return item;
    });
    response.status(201).json(report);
  } catch (error) { await removeUpload(); next(error); }
});

app.patch("/reports/:id", async (request, response, next) => {
  try {
    const body = request.body;
    if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).some(key => !["status", "department", "adminNote"].includes(key))) {
      response.status(400).json(fail("حقول التحديث غير صالحة")); return;
    }
    if (body.status !== undefined && !validStatus(body.status) ||
      body.department !== undefined && (typeof body.department !== "string" || body.department.length > 100) ||
      body.adminNote !== undefined && (typeof body.adminNote !== "string" || body.adminNote.length > 2000)) {
      response.status(400).json(fail("قيم التحديث غير صالحة")); return;
    }
    const report = await updateReports(reports => {
      const item = reports.find(entry => entry.id === request.params.id);
      if (!item) return null;
      if (body.status !== undefined) item.status = body.status;
      if (body.department !== undefined) item.department = body.department.trim();
      if (body.adminNote !== undefined) item.adminNote = body.adminNote.trim();
      item.updatedAt = new Date().toISOString();
      return item;
    });
    if (!report) { response.status(404).json(fail("البلاغ غير موجود")); return; }
    response.json(report);
  } catch (error) { next(error); }
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof multer.MulterError) { response.status(400).json(fail(error.code === "LIMIT_FILE_SIZE" ? "الصورة أكبر من 8 ميغابايت" : "تعذر رفع الصورة")); return; }
  if (error instanceof Error && error.message.startsWith("نوع الصورة غير مدعوم")) { response.status(400).json(fail(error.message)); return; }
  console.error(error);
  response.status(500).json(fail("حدث خطأ في الخادم"));
});

app.listen(port, "0.0.0.0", () => console.log(`Baladi API listening on http://0.0.0.0:${port}`));
