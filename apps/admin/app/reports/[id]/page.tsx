"use client";

import { ArrowRight, ImageOff, LoaderCircle, MapPin, Save } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ReportMap } from "@/components/report-map";
import { CategoryBadge, DataState, PageHeading, RefreshButton, StatusBadge } from "@/components/ui";
import { getReport, reportImageUrl, updateReport } from "@/lib/api";
import { departments, formatDate, statuses, type Report, type Status } from "@/lib/model";

export default function ReportDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<Status>("NEW");
  const [department, setDepartment] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  const load = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true); else setLoading(true);
    setError(""); setFeedback(""); setFormError("");
    try {
      const data = await getReport(id);
      setReport(data); setStatus(data.status); setDepartment(data.department || ""); setAdminNote(data.adminNote || ""); setImageFailed(false);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "تعذر تحميل البلاغ."); }
    finally { setLoading(false); setRefreshing(false); }
  }, [id]);

  useEffect(() => {
    let active = true;
    getReport(id).then(data => {
      if (!active) return;
      setReport(data); setStatus(data.status); setDepartment(data.department || ""); setAdminNote(data.adminNote || ""); setImageFailed(false);
    }).catch(cause => { if (active) setError(cause instanceof Error ? cause.message : "تعذر تحميل البلاغ."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);
  const dirty = report && (status !== report.status || department !== (report.department || "") || adminNote !== (report.adminNote || ""));

  async function save() {
    if (!report || saving) return;
    setFeedback(""); setFormError("");
    if (status === "ASSIGNED" && !department) { setFormError("اختر القسم المسؤول قبل تعيين الحالة إلى تم الإسناد."); return; }
    if (adminNote.length > 2000) { setFormError("ملاحظة البلدية طويلة جداً. الحد الأقصى 2000 حرف."); return; }
    setSaving(true);
    try {
      const updated = await updateReport(report.id, { status, department, adminNote: adminNote.trim() });
      setReport(updated); setStatus(updated.status); setDepartment(updated.department || ""); setAdminNote(updated.adminNote || "");
      setFeedback("تم حفظ التحديث. ستظهر الحالة والملاحظة للمواطن عند تحديث بلاغه.");
    } catch (cause) { setFormError(cause instanceof Error ? cause.message : "تعذر حفظ التحديث."); }
    finally { setSaving(false); }
  }

  return <>
    <div style={{ marginBottom: 14 }}><Link href="/reports" className="inline-link"><ArrowRight size={15} style={{ display: "inline", verticalAlign: "middle" }} /> العودة إلى البلاغات</Link></div>
    <PageHeading eyebrow="تفاصيل البلاغ" title={report ? report.ticketNumber : "تفاصيل البلاغ"} description="راجع ما أرسله المواطن وحدّث سير العمل من هذه الصفحة." action={<RefreshButton onClick={() => void load(true)} busy={refreshing} />} />
    <DataState loading={loading} error={error} empty={!report} onRetry={() => void load()}>{report && <div className="detail-grid">
      <div className="detail-main">
        <section className="panel"><div className="panel-heading"><div><h2>معلومات البلاغ</h2><p>المعلومات المقدمة من المواطن</p></div><StatusBadge status={report.status} /></div><div className="panel-body"><div className="info-grid">
          <div className="info-item"><p className="detail-label">رقم البلاغ</p><strong className="ticket" dir="ltr">{report.ticketNumber}</strong></div>
          <div className="info-item"><p className="detail-label">التصنيف</p><CategoryBadge category={report.category} /></div>
          <div className="info-item"><p className="detail-label">تاريخ الإرسال</p><strong>{formatDate(report.createdAt, true)}</strong></div>
          <div className="info-item"><p className="detail-label">القسم المسؤول</p><strong>{report.department || "لم يُسند بعد"}</strong></div>
        </div></div></section>
        <section className="panel"><div className="panel-heading"><div><h2>وصف المشكلة والصورة</h2><p>التفاصيل كما وردت من المواطن</p></div></div><div className="panel-body"><p className="detail-text">{report.description}</p><div style={{ marginTop: 20 }}>{report.imageUrl && !imageFailed ? <Image unoptimized width={800} height={500} className="detail-image" src={reportImageUrl(report.imageUrl)!} alt={`صورة البلاغ ${report.ticketNumber}`} onError={() => setImageFailed(true)} /> : <div className="image-empty"><ImageOff size={19} />{report.imageUrl ? "تعذر تحميل الصورة المرفقة" : "لم تُرفق صورة لهذا البلاغ"}</div>}</div></div></section>
        <section className="panel"><div className="panel-heading"><div><h2>موقع البلاغ</h2><p>{report.address || "موقع محدد بالإحداثيات"}</p></div><MapPin size={20} color="var(--teal)" /></div><div className="panel-body"><p className="detail-label">الإحداثيات: <span className="coordinate">{report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}</span></p><ReportMap reports={[report]} small /><p className="map-note">قد تحتاج الخريطة إلى اتصال إنترنت لتحميل طبقة OpenStreetMap؛ الإحداثيات تبقى متاحة دائماً.</p></div></section>
      </div>
      <div className="detail-side">
        <section className="panel"><div className="panel-heading"><div><h2>تحديث البلاغ</h2><p>احفظ التغييرات لإظهارها في تطبيق المواطن</p></div></div><div className="panel-body"><div className="edit-form">
          <div className="field"><label htmlFor="department">القسم المسؤول</label><select id="department" className="select" value={department} onChange={event => setDepartment(event.target.value)} disabled={saving}><option value="">اختر القسم</option>{departments.map(item => <option key={item} value={item}>{item}</option>)}</select></div>
          <div className="field"><label htmlFor="status">حالة البلاغ</label><select id="status" className="select" value={status} onChange={event => setStatus(event.target.value as Status)} disabled={saving}>{Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          <div className="field"><label htmlFor="admin-note">ملاحظة البلدية</label><textarea id="admin-note" className="textarea" value={adminNote} onChange={event => setAdminNote(event.target.value)} maxLength={2000} placeholder="اكتب ملاحظة توضح الإجراء المتخذ..." disabled={saving} /></div>
          {formError && <p className="form-message form-error" role="alert">{formError}</p>}{feedback && <p className="form-message form-success" role="status">{feedback}</p>}
          <div className="form-actions"><button type="button" className="button button-primary" onClick={() => void save()} disabled={!dirty || saving}>{saving ? <LoaderCircle size={17} className="spin" /> : <Save size={17} />}{saving ? "جارٍ الحفظ..." : "حفظ التحديثات"}</button></div>
        </div></div></section>
        {report.adminNote && <section className="panel"><div className="panel-heading"><div><h2>الملاحظة الحالية</h2><p>آخر ملاحظة محفوظة للمواطن</p></div></div><div className="panel-body"><p className="detail-text">{report.adminNote}</p></div></section>}
      </div>
    </div>}</DataState>
  </>;
}
