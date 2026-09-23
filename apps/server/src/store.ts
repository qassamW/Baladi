import { copyFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Report } from "./model.js";

const localDataDir = path.resolve(process.cwd(), "../../data");
const dataDir = process.env.BALADI_STORAGE_DIR?.trim() ? path.resolve(process.env.BALADI_STORAGE_DIR) : localDataDir;
const dataFile = path.join(dataDir, "reports.json");
const bundledSeedFile = path.resolve(process.cwd(), "data/reports.seed.json");
let pending: Promise<unknown> = Promise.resolve();

async function ensureDataFile() {
  try { await readFile(dataFile, "utf8"); }
  catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
    await mkdir(dataDir, { recursive: true });
    if (dataFile !== bundledSeedFile) await copyFile(bundledSeedFile, dataFile);
    else await writeFile(dataFile, "[]\n", "utf8");
  }
}

export async function readReports(): Promise<Report[]> {
  await ensureDataFile();
  const content = await readFile(dataFile, "utf8");
  const reports: unknown = JSON.parse(content);
  if (!Array.isArray(reports)) throw new Error("reports.json must contain an array");
  return reports as Report[];
}

export function updateReports<T>(change: (reports: Report[]) => T): Promise<T> {
  const operation = pending.then(async () => {
    const reports = await readReports();
    const result = change(reports);
    await mkdir(path.dirname(dataFile), { recursive: true });
    const temporary = `${dataFile}.${process.pid}.tmp`;
    try {
      await writeFile(temporary, JSON.stringify(reports, null, 2) + "\n", "utf8");
      await rename(temporary, dataFile);
    } catch (error) {
      const { unlink } = await import("node:fs/promises");
      await unlink(temporary).catch(() => {});
      throw error;
    }
    return result;
  });
  pending = operation.catch(() => {});
  return operation;
}
