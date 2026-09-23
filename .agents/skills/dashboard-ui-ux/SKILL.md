---
name: dashboard-ui-ux
description: Design, implement, or review the Baladi municipality admin web dashboard using Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Arabic RTL. Use for dashboard pages, components, report workflows, maps, and UI reviews in this repository.
---

# Baladi municipality dashboard UI and UX

Apply this skill whenever designing, implementing, or reviewing the admin dashboard. Build a professional municipal operations workspace that helps staff scan, triage, assign, and resolve reports. For this hackathon MVP, favor a small, consistent visual language and polished presentation over an elaborate design system.

## Structure and visual language

- Work within the existing Next.js, TypeScript, Tailwind CSS, and shadcn/ui setup. Use shadcn/ui where it improves consistency, but compose and style it for Baladi rather than leaving pages looking like a component-library demo.
- Organize pages around clear titles, consistent content widths and spacing, sidebar navigation, and a top header when it helps orientation or actions. Make layouts responsive without losing essential report information.
- Use restrained color, consistent typography, compact but readable density, and clear emphasis. Avoid excessive gradients or animation, glassmorphism, oversized cards, overly rounded containers, random colors, and decorative elements that slow scanning.
- Reuse or refine existing report cards, tables, status and category badges, buttons, dialogs, forms, filters, empty states, and loading states. Add shared components when repetition makes the benefit clear.

## Arabic RTL

- Treat Arabic RTL as the default layout and reading direction. Check right-aligned text, sidebar and navigation order, table direction, icon placement, and logical spacing in controls and mixed-direction content.
- Keep report numbers, dates, coordinates, and other left-to-right values legible inside RTL layouts. Verify the rendered result at desktop and narrower viewport widths.

## Report workflows

- Make report number, category, status, location, submission date, and assigned department quickly scannable in lists and cards. Use a stable visual hierarchy so primary facts and next actions are obvious.
- Distinguish all six statuses consistently: جديد, قيد المراجعة, تم الإسناد, جاري العمل, تم الحل, مغلق. Pair color with readable text rather than relying on color alone.
- Organize report details so staff can find the citizen description, submitted photo, location, category, status, assigned department, and admin note without hunting through the page.
- Integrate maps naturally into the workflow. Show report markers clearly; selecting one should reveal concise report information and a clear path to details. Keep map overlays and controls unobtrusive.
- Give forms and actions clear validation, loading, success, and error feedback. Disable actions when needed to prevent invalid or duplicate operations.

## Review of existing UI

Preserve working behavior. Identify and fix visible RTL, responsive, hierarchy, and consistency problems; reuse existing components where practical. Avoid broad rewrites unless the current structure blocks the requested improvement. Check the affected report flow and relevant states after changes.
