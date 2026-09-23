export const categories = ["WATER", "ELECTRICITY", "STREET_LIGHTING", "ROADS", "SEWAGE", "WASTE", "PUBLIC_FACILITY", "OTHER"] as const;
export const statuses = ["NEW", "UNDER_REVIEW", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;
export type Category = typeof categories[number];
export type Status = typeof statuses[number];
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
