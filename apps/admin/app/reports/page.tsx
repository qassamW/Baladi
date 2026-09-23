"use client";

import { ArrowUpLeft } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CategoryBadge, DataState, PageHeading, RefreshButton, ReportRow, StatusBadge } from "@/components/ui";
import { categories, formatDate, statuses, type Category, type Status } from "@/lib/model";
import { useReports } from "@/lib/use-reports";

export default function ReportsPage() {
  const { reports, loading, refreshing, error, refresh } = useReports();
  const [status, setStatus] = useState<Status | "ALL">("ALL");
  const [category, setCategory] = useState<Category | "ALL">("ALL");
  const filtered = useMemo(() => reports.filter(report => (status === "ALL" || report.status === status) && (category === "ALL" || report.category === category)), [reports, status, category]);
  return <>
    <PageHeading eyebrow="إدارة البلاغات" title="البلاغات" description="راجع البلاغات الواردة، ثم افتح البلاغ لتحديثه أو إسناده." action={<RefreshButton onClick={() => void refresh(true)} busy={refreshing} />} />
    <div className="panel filters">
      <div className="field"><label htmlFor="status-filter">الحالة</label><select id="status-filter" className="select" value={status} onChange={event => setStatus(event.target.value as Status | "ALL")}><option value="ALL">كل الحالات</option>{Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      <div className="field"><label htmlFor="category-filter">التصنيف</label><select id="category-filter" className="select" value={category} onChange={event => setCategory(event.target.value as Category | "ALL")}><option value="ALL">كل التصنيفات</option>{Object.entries(categories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      <span className="filter-count">{filtered.length} بلاغ</span>
    </div>
    <section className="panel"><DataState loading={loading} error={error} empty={filtered.length === 0} onRetry={() => void refresh()} emptyTitle={reports.length ? "لا توجد بلاغات مطابقة" : "لا توجد بلاغات بعد"} emptyDescription={reports.length ? "جرّب تغيير مرشحات الحالة أو التصنيف." : "ستظهر البلاغات فور إرسالها من تطبيق المواطن."}>
      <div className="table-wrap"><table className="data-table"><thead><tr><th scope="col">رقم البلاغ</th><th scope="col">التصنيف</th><th scope="col">الوصف</th><th scope="col">التاريخ</th><th scope="col">الحالة</th><th scope="col">القسم</th><th scope="col">إجراء</th></tr></thead><tbody>{filtered.map(report => <tr key={report.id}><td><span className="ticket" dir="ltr">{report.ticketNumber}</span></td><td><CategoryBadge category={report.category} /></td><td className="description-cell" title={report.description}>{report.description}</td><td>{formatDate(report.createdAt)}</td><td><StatusBadge status={report.status} /></td><td>{report.department || <span style={{ color: "var(--muted)" }}>لم يُسند</span>}</td><td><Link className="inline-link" href={`/reports/${report.id}`}>عرض التفاصيل <ArrowUpLeft size={14} style={{ display: "inline" }} /></Link></td></tr>)}</tbody></table></div>
      <div className="mobile-report-list">{filtered.map(report => <ReportRow key={report.id} report={report} />)}</div>
    </DataState></section>
  </>;
}
