import { AlertCircle, Inbox, LoaderCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { categories, formatDate, statuses, type Report, type Status } from "@/lib/model";

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{action && <div className="heading-action">{action}</div>}</div>;
}

export function StatusBadge({ status }: { status: Status }) {
  return <span className={`status-badge status-${status.toLowerCase().replaceAll("_", "-")}`}><span className="status-dot" />{statuses[status]}</span>;
}

export function CategoryBadge({ category }: { category: Report["category"] }) {
  return <span className="category-badge">{categories[category]}</span>;
}

export function RefreshButton({ onClick, busy }: { onClick: () => void; busy?: boolean }) {
  return <button className="button button-secondary" type="button" onClick={onClick} disabled={busy}><RefreshCw size={16} className={busy ? "spin" : ""} />تحديث البيانات</button>;
}

export function DataState({ loading, error, empty, onRetry, children, emptyTitle = "لا توجد بلاغات هنا", emptyDescription = "ستظهر البلاغات فور إرسالها من تطبيق المواطن." }: { loading: boolean; error: string; empty: boolean; onRetry: () => void; children: ReactNode; emptyTitle?: string; emptyDescription?: string }) {
  if (loading) return <div className="state-panel"><LoaderCircle size={28} className="spin" /><strong>جارٍ تحميل البيانات...</strong><span>يتم جلب البلاغات من الخادم المحلي.</span></div>;
  if (error) return <div className="state-panel state-error"><AlertCircle size={30} /><strong>تعذر عرض البيانات</strong><span>{error}</span><button className="button button-secondary" type="button" onClick={onRetry}>إعادة المحاولة</button></div>;
  if (empty) return <div className="state-panel"><Inbox size={32} /><strong>{emptyTitle}</strong><span>{emptyDescription}</span></div>;
  return <>{children}</>;
}

export function ReportRow({ report, compact = false }: { report: Report; compact?: boolean }) {
  return <Link href={`/reports/${report.id}`} className={`report-row ${compact ? "report-row-compact" : ""}`}>
    <div className="report-row-main"><span className="ticket" dir="ltr">{report.ticketNumber}</span><strong>{categories[report.category]}</strong><p>{report.description}</p></div>
    <div className="report-row-meta"><StatusBadge status={report.status} /><span>{report.address || "موقع محدد بالإحداثيات"}</span><span>{formatDate(report.createdAt)}</span></div>
    <span className="row-link">عرض التفاصيل ←</span>
  </Link>;
}
