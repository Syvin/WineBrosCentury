import type { LucideIcon } from "lucide-react";
import { CircleCheck, Clock3, MailWarning } from "lucide-react";
import type { WineCategory } from "./inventory";

export type InquiryStatus = "new" | "contacted" | "archived";

export interface Inventory {
  id: string;
  sku: string;
  name: string;
  brand: string | null;
  vintage: number;
  region: string;
  price: number;
  stock: number;
  image_url: string | null;
  category: WineCategory;
  metadata: Record<string, unknown> | null;
}

export interface Inquiry {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  message: string;
  status: InquiryStatus;
}

export interface InquiryInsert {
  full_name: string;
  email: string;
  message: string;
  status?: InquiryStatus;
}

export const InquiryStatusIcons: Record<InquiryStatus, LucideIcon> = {
  new: Clock3,
  contacted: CircleCheck,
  archived: MailWarning,
};
