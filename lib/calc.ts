import type { Day, Decision, Recommendation } from "./data";
import { ANNUAL_SPEND_INR, CRORE, INVESTMENT_INR, TARIFF_INR_PER_KWH } from "./data";

export type Status = "pending" | "approved" | "overridden" | "blocked";

export function annualBenefitInr(potentialPct: number, realisationPct: number): number {
  return (ANNUAL_SPEND_INR * potentialPct * realisationPct) / 10_000;
}

export function paybackMonths(benefitInr: number): number {
  return (INVESTMENT_INR / benefitInr) * 12;
}

export function daySavingInr(day: Day): number {
  return (day.baselineSec * day.tonnes - day.energyKwh) * TARIFF_INR_PER_KWH;
}

export function periodSec(days: Day[]): number {
  const energy = days.reduce((sum, day) => sum + day.energyKwh, 0);
  const tonnes = days.reduce((sum, day) => sum + day.tonnes, 0);
  return energy / tonnes;
}

export function isOutsideProvenRegion(rec: Recommendation): boolean {
  if (rec.proposedValue == null || rec.provenRegion == null) return false;
  return rec.proposedValue < rec.provenRegion.min || rec.proposedValue > rec.provenRegion.max;
}

export function cardStatus(rec: Recommendation, decision?: Decision): Status {
  if (isOutsideProvenRegion(rec)) return "blocked";
  if (!decision) return "pending";
  return decision.kind;
}

export function committedInrPerDay(
  recs: Recommendation[],
  decisions: Record<string, Decision>,
): number {
  return recs.reduce((sum, rec) => {
    if (decisions[rec.id]?.kind !== "approved") return sum;
    return sum + rec.expectedSavingInrPerDay;
  }, 0);
}

export function localScore(rec: Recommendation): number {
  return Math.round(rec.expectedSavingInrPerDay * rec.confidenceWeight);
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCrore(amount: number): string {
  const cr = amount / CRORE;
  const digits = cr >= 1 ? 1 : 2;
  const text = cr.toFixed(digits).replace(/\.0$/, "");
  return `₹${text} cr`;
}

export function formatPayback(months: number): string {
  const rounded = Math.round(months * 10) / 10;
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  return `${text} months`;
}

export function formatValue(value: number, unit: string): string {
  const text = Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0$/, "");
  return unit ? `${text}${unit}` : text;
}
