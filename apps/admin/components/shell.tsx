"use client";

import { Building2, MapPinned, Menu, ClipboardList, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

const navigation = [
  { href: "/", label: "خريطة البلاغات", Icon: MapPinned },
  { href: "/reports", label: "البلاغات", Icon: ClipboardList }
];

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return <div className="app-shell">
    {open && <button className="mobile-scrim" aria-label="إغلاق القائمة" onClick={() => setOpen(false)} />}
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand"><span className="brand-icon"><Building2 size={25} /></span><span><strong>بلدي</strong><small>BALADI MUNICIPALITY</small></span><button className="sidebar-close" onClick={() => setOpen(false)} aria-label="إغلاق القائمة"><X size={19} /></button></div>
      <div className="sidebar-section">مساحة العمل</div>
      <nav aria-label="القائمة الرئيسية">{navigation.map(({ href, label, Icon }) => {
        const active = href === "/" ? path === "/" : path.startsWith(href);
        return <Link key={href} href={href} className={`nav-link ${active ? "nav-active" : ""}`} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined}><Icon size={20} /><span>{label}</span></Link>;
      })}</nav>
      <div className="sidebar-footer"><span className="online-dot" />النظام المحلي جاهز للعمل</div>
    </aside>
    <div className="main-column"><header className="topbar"><button className="menu-button" aria-label="فتح القائمة" onClick={() => setOpen(true)}><Menu size={22} /></button><div><span className="topbar-label">لوحة عمليات البلدية</span><span className="topbar-separator">/</span><strong>{navigation.find(item => item.href === "/" ? path === "/" : path.startsWith(item.href))?.label || "الرئيسية"}</strong></div><span className="topbar-environment"><span className="online-dot" />نسخة العرض المحلية</span></header><main className="content">{children}</main></div>
  </div>;
}
