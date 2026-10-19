import { daySavingInr } from "@/lib/calc";
import type { Day } from "@/lib/data";

export function Chart({ days }: { days: Day[] }) {
  const width = 720;
  const height = 248;
  const padL = 48;
  const padR = 12;
  const padT = 20;
  const padB = 32;
  const actualSec = days.map((day) => day.energyKwh / day.tonnes);
  const secs = days.flatMap((day, i) => [day.baselineSec, actualSec[i]]);
  const min = Math.min(...secs) - 10;
  const max = Math.max(...secs) + 12;
  const x = (i: number) => padL + (i / (days.length - 1)) * (width - padL - padR);
  const y = (sec: number) => padT + (1 - (sec - min) / (max - min)) * (height - padT - padB);

  const line = (points: number[]) =>
    points.map((sec, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(sec).toFixed(1)}`).join(" ");

  const shades = days.slice(0, -1).flatMap((day, i) => {
    const next = days[i + 1];
    if (actualSec[i] >= day.baselineSec || actualSec[i + 1] >= next.baselineSec) return [];
    return [
      `${x(i).toFixed(1)},${y(day.baselineSec).toFixed(1)} ${x(i + 1).toFixed(1)},${y(next.baselineSec).toFixed(1)} ${x(i + 1).toFixed(1)},${y(actualSec[i + 1]).toFixed(1)} ${x(i).toFixed(1)},${y(actualSec[i]).toFixed(1)}`,
    ];
  });

  const low = days.find((day) => day.lowProduction)!;
  const lowIndex = low.day - 1;
  const peers = days.filter((day) => !day.lowProduction && !day.instability);
  const typicalEnergy = Math.round(peers.reduce((sum, day) => sum + day.energyKwh, 0) / peers.length);
  const saving = daySavingInr(low);

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="chart-title chart-desc">
        <title id="chart-title">Energy per tonne, baseline against actual</title>
        <desc id="chart-desc">
          Thirty illustrative days. The low-production day has lower raw energy and a normalized saving of zero.
        </desc>
        {[0, 0.5, 1].map((t) => {
          const sec = min + (max - min) * (1 - t);
          const yy = y(sec);
          return (
            <g key={t}>
              <line x1={padL} x2={width - padR} y1={yy} y2={yy} className="grid" />
              <text x={padL - 8} y={yy + 4} className="axis" textAnchor="end">
                {Math.round(sec)}
              </text>
            </g>
          );
        })}
        {shades.map((points) => (
          <polygon key={points} points={points} className="shade" />
        ))}
        <path d={line(days.map((day) => day.baselineSec))} className="baseline" />
        <path d={line(actualSec)} className="actual" />
        <line x1={x(lowIndex)} x2={x(lowIndex)} y1={padT} y2={height - padB} className="low-line" />
        <circle cx={x(lowIndex)} cy={y(actualSec[lowIndex])} r="4.5" className="low-dot" />
        <text x={x(lowIndex) + 8} y={padT + 14} className="callout">
          Day {low.day} · raw energy down · ₹{saving} saved
        </text>
        <text x={padL} y={height - 8} className="axis">
          Day 1
        </text>
        <text x={width - padR} y={height - 8} className="axis" textAnchor="end">
          Day 30
        </text>
      </svg>
      <figcaption>
        <ul className="legend">
          <li>
            <span className="swatch swatch-base" aria-hidden="true" />
            Baseline, normalized for output
          </li>
          <li>
            <span className="swatch swatch-actual" aria-hidden="true" />
            Actual specific energy
          </li>
          <li>
            <span className="swatch swatch-shade" aria-hidden="true" />
            Claimed saving
          </li>
        </ul>
        <dl className="day-facts">
          <div>
            <dt>Day {low.day} energy</dt>
            <dd>{low.energyKwh.toLocaleString("en-IN")} kWh</dd>
          </div>
          <div>
            <dt>Typical day</dt>
            <dd>{typicalEnergy.toLocaleString("en-IN")} kWh</dd>
          </div>
          <div>
            <dt>Day {low.day} output</dt>
            <dd>{low.tonnes} t</dd>
          </div>
          <div>
            <dt>Normalized saving</dt>
            <dd>₹{saving}</dd>
          </div>
        </dl>
        <p>
          Output on day {low.day} is about half a normal day, so raw energy falls with it. Specific energy stays on
          the baseline. The normalized saving is ₹{saving}.
        </p>
      </figcaption>
    </figure>
  );
}
