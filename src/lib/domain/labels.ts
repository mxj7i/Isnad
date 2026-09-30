import type { EvidenceStatus } from "./result";

export const evidenceStatusLabels: Record<EvidenceStatus, string> = {
  supported: "مدعوم بالمصادر",
  disagreement: "يوجد اختلاف",
  insufficient_evidence: "الأدلة غير كافية",
  referral_required: "يتطلب إحالة لمختص",
};