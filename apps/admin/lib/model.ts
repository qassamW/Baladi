export const categories = {
  WATER: "تسرب مياه",
  ELECTRICITY: "كهرباء",
  STREET_LIGHTING: "إنارة شوارع",
  ROADS: "طرق وحفر",
  SEWAGE: "صرف صحي",
  WASTE: "نفايات",
  PUBLIC_FACILITY: "مرافق عامة",
  OTHER: "أخرى"
} as const;
export type Category = keyof typeof categories;

export const statuses = {
  NEW: "جديد",
  UNDER_REVIEW: "قيد المراجعة",
  ASSIGNED: "تم الإسناد",
  IN_PROGRESS: "جاري العمل",
  RESOLVED: "تم الحل",
  CLOSED: "مغلق"
} as const;
export type Status = keyof typeof statuses;

export const departments = ["قسم المياه", "قسم الكهرباء", "قسم الطرق", "قسم النظافة", "قسم الصرف الصحي", "قسم الصيانة العامة"] as const;

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

export function formatDate(value: string, includeTime = false) {
  return new Intl.DateTimeFormat("ar", includeTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(new Date(value));
}
