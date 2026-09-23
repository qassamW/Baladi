export const categories = [
  { id: "WATER", label: "تسرب مياه", icon: "water-outline" },
  { id: "ELECTRICITY", label: "كهرباء", icon: "flash-outline" },
  { id: "STREET_LIGHTING", label: "إنارة شوارع", icon: "lightbulb-outline" },
  { id: "ROADS", label: "طرق وحفر", icon: "road-variant" },
  { id: "SEWAGE", label: "صرف صحي", icon: "pipe-leak" },
  { id: "WASTE", label: "نفايات", icon: "delete-outline" },
  { id: "PUBLIC_FACILITY", label: "مرافق عامة", icon: "office-building-outline" },
  { id: "OTHER", label: "أخرى", icon: "dots-horizontal-circle-outline" }
] as const;
export type Category = typeof categories[number]["id"];
export const statuses = [
  { id: "NEW", label: "جديد", step: "تم استلام البلاغ", color: "#1D6D8E", background: "#E6F3F6" },
  { id: "UNDER_REVIEW", label: "قيد المراجعة", step: "قيد المراجعة", color: "#9A6700", background: "#FFF4D8" },
  { id: "ASSIGNED", label: "تم الإسناد", step: "تم الإسناد", color: "#6653A6", background: "#F0ECFA" },
  { id: "IN_PROGRESS", label: "جاري العمل", step: "جاري العمل", color: "#A65522", background: "#FFF0E4" },
  { id: "RESOLVED", label: "تم الحل", step: "تم الحل", color: "#24745C", background: "#E4F4ED" },
  { id: "CLOSED", label: "مغلق", step: "مغلق", color: "#4B626B", background: "#EAF0F1" }
] as const;
export type Status = typeof statuses[number]["id"];
export interface Report {
  id: string;
  ticketNumber: string;
  category: Category;
  description: string;
  imageUrl: string | null;
  latitude: number;
  longitude: number;
  address?: string;
  status: Status;
  department?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}
export const categoryLabel = (category: Category) => categories.find(item => item.id === category)?.label ?? category;
export const statusInfo = (status: Status) => statuses.find(item => item.id === status) ?? statuses[0];
