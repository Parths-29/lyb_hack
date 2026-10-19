export const CRORE = 10_000_000;
export const ANNUAL_SPEND_INR = 80 * CRORE;
export const INVESTMENT_INR = 2 * CRORE;
export const DEFAULT_POTENTIAL_PCT = 5;
export const DEFAULT_REALISATION_PCT = 60;
export const TARIFF_INR_PER_KWH = 8;
export const FLIP_POINT_INR = 80 * 100_000;

export const LEVER_NAME = {
  1: "Waste",
  2: "Load",
  3: "Time-shift",
  4: "Set-point",
} as const;

export type Lever = keyof typeof LEVER_NAME;
export type Source = "Rule" | "AI";
export type Confidence = "High" | "Medium" | "Low";

export type ProvenRegion = {
  min: number;
  max: number;
  unit: string;
  label: string;
};

export type Recommendation = {
  id: string;
  lever: Lever;
  source: Source;
  title: string;
  expectedSavingInrPerDay: number;
  confidence: Confidence;
  confidenceWeight: number;
  reason: string;
  touchesSetpoint: boolean;
  proposedValue: number | null;
  provenRegion: ProvenRegion | null;
};

export type Decision = {
  kind: "approved" | "overridden";
  at: string;
  reason?: string;
};

export type Day = {
  day: number;
  tonnes: number;
  baselineSec: number;
  energyKwh: number;
  lowProduction: boolean;
  instability: boolean;
};

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "rec_001",
    lever: 1,
    source: "Rule",
    title: "Isolate the night header and fix two leaks on Line 3",
    expectedSavingInrPerDay: 12_000,
    confidence: "High",
    confidenceWeight: 0.9,
    reason:
      "The night header holds production pressure with no demand. Two leaks account for most of that idle load.",
    touchesSetpoint: false,
    proposedValue: null,
    provenRegion: null,
  },
  {
    id: "rec_002",
    lever: 1,
    source: "Rule",
    title: "Replace six failed steam traps on the dryer header",
    expectedSavingInrPerDay: 8_000,
    confidence: "Medium",
    confidenceWeight: 0.7,
    reason:
      "The trap survey shows six traps blowing through. The loss is steam, not a set-point.",
    touchesSetpoint: false,
    proposedValue: null,
    provenRegion: null,
  },
  {
    id: "rec_003",
    lever: 2,
    source: "AI",
    title: "Run Chiller 2 at 70% instead of Chillers 1 and 2 at 40%",
    expectedSavingInrPerDay: 18_000,
    confidence: "Medium",
    confidenceWeight: 0.7,
    reason:
      "Combined cooling load is below Chiller 2's efficient range. One machine at 70% uses less power than two at 40%.",
    touchesSetpoint: false,
    proposedValue: null,
    provenRegion: null,
  },
  {
    id: "rec_004",
    lever: 2,
    source: "AI",
    title: "Shift cooling-water flow onto Pump B and idle Pump A",
    expectedSavingInrPerDay: 9_500,
    confidence: "High",
    confidenceWeight: 0.9,
    reason:
      "Today's flow sits in the efficient band of one pump. The second pump is only overcoming its own minimum flow.",
    touchesSetpoint: false,
    proposedValue: null,
    provenRegion: null,
  },
  {
    id: "rec_005",
    lever: 3,
    source: "Rule",
    title: "Move the batch wash into the off-peak window",
    expectedSavingInrPerDay: 15_000,
    confidence: "High",
    confidenceWeight: 0.9,
    reason:
      "The wash is not on the critical path after 22:00. The same tonnes move into the cheaper tariff window.",
    touchesSetpoint: false,
    proposedValue: null,
    provenRegion: null,
  },
  {
    id: "rec_006",
    lever: 3,
    source: "Rule",
    title: "Delay non-critical grinding until after 23:00",
    expectedSavingInrPerDay: 11_000,
    confidence: "Medium",
    confidenceWeight: 0.7,
    reason:
      "Grinding can slip two hours without touching the reactor. The tariff step-down covers the wait.",
    touchesSetpoint: false,
    proposedValue: null,
    provenRegion: null,
  },
  {
    id: "rec_007",
    lever: 4,
    source: "AI",
    title: "Raise Column C reflux ratio from 1.18 to 1.42",
    expectedSavingInrPerDay: 22_000,
    confidence: "Medium",
    confidenceWeight: 0.7,
    reason:
      "A higher reflux would cut reboiler steam, but 1.42 has not been run stably on this column.",
    touchesSetpoint: true,
    proposedValue: 1.42,
    provenRegion: { min: 1.1, max: 1.3, unit: "", label: "Reflux ratio" },
  },
  {
    id: "rec_008",
    lever: 4,
    source: "AI",
    title: "Lower dryer zone 2 from 178°C to 174°C",
    expectedSavingInrPerDay: 7_000,
    confidence: "High",
    confidenceWeight: 0.9,
    reason:
      "174°C is inside the band the plant has already held. Moisture spec still holds at that point.",
    touchesSetpoint: true,
    proposedValue: 174,
    provenRegion: { min: 170, max: 180, unit: "°C", label: "Dryer zone 2" },
  },
];

export const BEATS = {
  air: "rec_001",
  chiller: "rec_003",
  blocked: "rec_007",
  veto: "rec_008",
} as const;

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeDays(): Day[] {
  const rand = mulberry32(2026);
  const days: Day[] = [];
  for (let day = 1; day <= 30; day++) {
    const tonnes = 760 + Math.round(rand() * 80);
    const baselineSec = 410 + Math.round(rand() * 16);
    const betterBy = 6 + Math.round(rand() * 10);
    days.push({
      day,
      tonnes,
      baselineSec,
      energyKwh: (baselineSec - betterBy) * tonnes,
      lowProduction: false,
      instability: false,
    });
  }

  const low = days[17];
  low.tonnes = 420;
  low.energyKwh = low.baselineSec * low.tonnes;
  low.lowProduction = true;

  const upset = days[23];
  upset.energyKwh = Math.round(upset.baselineSec * upset.tonnes * 1.06);
  upset.instability = true;

  return days;
}

export const DAYS: Day[] = makeDays();
