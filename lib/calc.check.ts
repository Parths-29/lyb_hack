import assert from "node:assert/strict";
import {
  annualBenefitInr,
  cardStatus,
  committedInrPerDay,
  daySavingInr,
  isOutsideProvenRegion,
  paybackMonths,
} from "./calc";
import { BEATS, DAYS, RECOMMENDATIONS } from "./data";

const benefit = annualBenefitInr(5, 60);
assert.equal(benefit, 2.4 * 10_000_000);
assert.equal(paybackMonths(benefit), 10);

const thin = annualBenefitInr(5, 30);
assert.equal(thin, 1.2 * 10_000_000);
assert.equal(paybackMonths(thin), 20);

const low = DAYS.find((day) => day.lowProduction);
assert.ok(low);
assert.equal(daySavingInr(low), 0);
assert.ok(low.energyKwh < DAYS.find((day) => !day.lowProduction)!.energyKwh);

assert.ok(DAYS.some((day) => day.instability));

const blocked = RECOMMENDATIONS.find((rec) => rec.id === BEATS.blocked)!;
const inBand = RECOMMENDATIONS.find((rec) => rec.id === BEATS.veto)!;
assert.equal(isOutsideProvenRegion(blocked), true);
assert.equal(isOutsideProvenRegion(inBand), false);
assert.equal(cardStatus(blocked), "blocked");
assert.equal(cardStatus(inBand), "pending");

const committed = committedInrPerDay(RECOMMENDATIONS, {
  [BEATS.air]: { kind: "approved", at: "15:00" },
  [BEATS.veto]: { kind: "overridden", at: "15:01", reason: "Hold the dryer." },
});
assert.equal(committed, 12_000);

console.log("calc.check ok");
