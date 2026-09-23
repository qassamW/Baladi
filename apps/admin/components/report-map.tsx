"use client";

import dynamic from "next/dynamic";
import type { Report } from "@/lib/model";

const MapClient = dynamic(() => import("./report-map-client"), { ssr: false, loading: () => <div className="state-panel">جارٍ تحميل الخريطة...</div> });

export function ReportMap({ reports, small = false }: { reports: Report[]; small?: boolean }) {
  return <div className={`map-frame ${small ? "map-frame-small" : ""}`}><MapClient reports={reports} small={small} /></div>;
}
