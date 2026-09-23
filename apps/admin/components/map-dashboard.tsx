"use client";

import { DataState, PageHeading, RefreshButton, ReportRow } from "@/components/ui";
import { ReportMap } from "@/components/report-map";
import { useReports } from "@/lib/use-reports";

export function MapDashboard() {
  const { reports, loading, refreshing, error, refresh } = useReports();
  const points = reports.filter(report => Number.isFinite(report.latitude) && Number.isFinite(report.longitude));
  return <>
    <PageHeading eyebrow="مركز عمليات المدينة" title="خريطة بلاغات القدس" description="جميع البلاغات المسجلة في القدس. اختر بلاغاً من القائمة أو اضغط علامته على الخريطة لفتح التفاصيل." action={<RefreshButton onClick={() => void refresh(true)} busy={refreshing} />} />
    <DataState loading={loading} error={error} empty={points.length === 0} onRetry={() => void refresh()}>
      <div className="map-page-grid">
        <section className="panel map-panel"><div className="panel-body"><ReportMap reports={points} /><p className="map-note">تفتح الخريطة على نظرة عامة لمدينة القدس. اضغط أي علامة للانتقال مباشرة إلى البلاغ.</p></div></section>
        <aside className="panel map-tickets-panel"><div className="panel-heading"><div><h2>بلاغات المدينة</h2><p>{points.length} بلاغاً محدد الموقع</p></div></div><div className="map-list">{points.map(report => <ReportRow key={report.id} report={report} compact />)}</div></aside>
      </div>
    </DataState>
  </>;
}
