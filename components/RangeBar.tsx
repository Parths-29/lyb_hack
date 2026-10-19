import { formatValue, isOutsideProvenRegion } from "@/lib/calc";
import type { Recommendation } from "@/lib/data";

export function RangeBar({ rec }: { rec: Recommendation }) {
  const region = rec.provenRegion;
  const value = rec.proposedValue;
  if (!region || value == null) return null;

  const span = region.max - region.min;
  const lo = Math.min(region.min, value) - span * 0.55;
  const hi = Math.max(region.max, value) + span * 0.55;
  const pct = (n: number) => ((n - lo) / (hi - lo)) * 100;
  const outside = isOutsideProvenRegion(rec);
  const proposed = formatValue(value, region.unit);
  const min = formatValue(region.min, region.unit);
  const max = formatValue(region.max, region.unit);
  const place = outside ? "outside" : "inside";

  return (
    <div className="range">
      <div className="range-label">
        <span>{region.label}</span>
        <span>{outside ? "Outside the proven region" : "Inside the proven region"}</span>
      </div>
      <div
        className="range-track"
        role="img"
        aria-label={`${region.label}: proposed ${proposed} is ${place} the proven region ${min} to ${max}`}
      >
        <div
          className="range-band"
          style={{ left: `${pct(region.min)}%`, width: `${pct(region.max) - pct(region.min)}%` }}
        />
        <div className={`range-marker${outside ? " is-out" : ""}`} style={{ left: `${pct(value)}%` }} />
      </div>
      <div className="range-scale">
        <span>{min}</span>
        <span>Proposed {proposed}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
