"use client";

import { useEffect, useState } from "react";
import { Chart } from "@/components/Chart";
import { HeroLoop } from "@/components/HeroLoop";
import { Recommendation } from "@/components/Recommendation";
import { Sliders } from "@/components/Sliders";
import { StatusMark } from "@/components/StatusMark";
import {
  annualBenefitInr,
  cardStatus,
  committedInrPerDay,
  formatCrore,
  formatInr,
  formatPayback,
  paybackMonths,
  periodSec,
} from "@/lib/calc";
import {
  BEATS,
  DAYS,
  DEFAULT_POTENTIAL_PCT,
  DEFAULT_REALISATION_PCT,
  FLIP_POINT_INR,
  LEVER_NAME,
  RECOMMENDATIONS,
  type Decision,
  type Lever,
} from "@/lib/data";

type Filter = "all" | Lever;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: 1, label: "Waste" },
  { id: 2, label: "Load" },
  { id: 3, label: "Time-shift" },
  { id: 4, label: "Set-point" },
];

function now(): string {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function Home() {
  const [potential, setPotential] = useState(DEFAULT_POTENTIAL_PCT);
  const [realisation, setRealisation] = useState(DEFAULT_REALISATION_PCT);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string>(BEATS.air);
  const [solidNav, setSolidNav] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolidNav(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const benefit = annualBenefitInr(potential, realisation);
  const payback = paybackMonths(benefit);
  const sec = periodSec(DAYS);
  const committed = committedInrPerDay(RECOMMENDATIONS, decisions);
  const selected = RECOMMENDATIONS.find((rec) => rec.id === selectedId) ?? RECOMMENDATIONS[0];
  const visible = RECOMMENDATIONS.filter((rec) => filter === "all" || rec.lever === filter);
  const log = RECOMMENDATIONS.flatMap((rec) => {
    const decision = decisions[rec.id];
    return decision ? [{ rec, decision }] : [];
  });

  function approve(id: string) {
    setDecisions((current) => ({ ...current, [id]: { kind: "approved", at: now() } }));
  }

  function override(id: string, reason: string) {
    setDecisions((current) => ({
      ...current,
      [id]: { kind: "overridden", reason, at: now() },
    }));
  }

  function undo(id: string) {
    setDecisions((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  const selectedStatus = cardStatus(selected, decisions[selected.id]);

  return (
    <div className="app">
      <header className="nav" data-solid={solidNav ? "" : undefined}>
        <div className="rail nav-bar">
          <a className="brand" href="#top">
            Plant X
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M4 12 L12 4 M12 4 H7 M12 4 V9"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </a>
          <p className="nav-center">Energy Advisor</p>
          <p className="nav-end">
            <span className="pill">Illustrative</span>
          </p>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-field" aria-hidden="true" />
        <div className="hero-copy">
          <div className="hero-lead">
            <h1>Advisory only.</h1>
            <p>Humans decide every change. Recommendations stay inside a region the plant has already run.</p>
            <ul className="hero-points">
              <li>A person approves</li>
              <li>The band holds</li>
              <li>Outside stays blocked</li>
            </ul>
          </div>
          <div className="hero-stage">
            <HeroLoop />
          </div>
        </div>
      </section>

      <main>
        <section className="wrap" aria-label="Plant figures">
          <dl className="kpis">
            <div className="kpi">
              <dt>SEC</dt>
              <dd>{sec.toFixed(1)} kWh/t</dd>
            </div>
            <div className="kpi">
              <dt>Annual benefit</dt>
              <dd>{formatCrore(benefit)}</dd>
            </div>
            <div className="kpi">
              <dt>Realised</dt>
              <dd>{realisation}%</dd>
            </div>
            <div className="kpi">
              <dt>Payback</dt>
              <dd>{formatPayback(payback)}</dd>
            </div>
            <div className="kpi">
              <dt>Committed</dt>
              <dd>{formatInr(committed)}/day</dd>
            </div>
          </dl>
        </section>

        <section className="wrap section" id="recommendations">
          <h2 className="h2">Recommendations</h2>
          <p className="sub">
            Eight synthetic options. A blocked set-point cannot be approved. Anything inside the band can still be
            overridden.
          </p>
          <div className="chips" role="toolbar" aria-label="Filter by lever">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="chip"
                aria-pressed={filter === item.id}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="board">
            <ol className="feed">
              {visible.map((rec) => {
                const status = cardStatus(rec, decisions[rec.id]);
                return (
                  <li key={rec.id}>
                    <button
                      type="button"
                      className="row-btn"
                      aria-current={rec.id === selected.id ? "true" : undefined}
                      onClick={() => {
                        setSelectedId(rec.id);
                        if (window.matchMedia("(max-width: 980px)").matches) {
                          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                          document.getElementById("detail")?.scrollIntoView({
                            behavior: reduce ? "auto" : "smooth",
                            block: "start",
                          });
                        }
                      }}
                    >
                      <span className="row-lever">
                        <span>
                          {rec.lever} {LEVER_NAME[rec.lever]}
                        </span>
                        <span className="row-source">{rec.source}</span>
                      </span>
                      <span className="row-main">
                        <span className="row-title">{rec.title}</span>
                        <span className="row-save">{formatInr(rec.expectedSavingInrPerDay)}/day</span>
                      </span>
                      <StatusMark status={status} />
                    </button>
                  </li>
                );
              })}
            </ol>
            <aside className="side">
              <div className="detail" id="detail">
                <Recommendation
                  rec={selected}
                  decision={decisions[selected.id]}
                  onApprove={selectedStatus === "blocked" ? undefined : () => approve(selected.id)}
                  onOverride={selectedStatus === "blocked" ? undefined : (reason) => override(selected.id, reason)}
                  onUndo={decisions[selected.id] ? () => undo(selected.id) : undefined}
                />
              </div>
              <section className="log-panel" id="log" aria-labelledby="log-title">
                <h2 id="log-title">Decision log</h2>
                <p className="use-note">
                  Approve writes a line. Override keeps the reason. Undo removes it. Nothing here writes a set-point.
                </p>
                <ul className="log-list">
                  <li>
                    <StatusMark status="approved" />
                    <span>Drop the idle air header on Line 1</span>
                    <time>06:10</time>
                    <span className="example-tag">Example</span>
                  </li>
                  <li>
                    <StatusMark status="overridden" />
                    <span>Hold dryer zone 2 at 176°C</span>
                    <time>06:22</time>
                    <span>Moisture was already on spec.</span>
                    <span className="example-tag">Example</span>
                  </li>
                  {log.map(({ rec, decision }) => (
                    <li key={rec.id}>
                      <StatusMark status={decision.kind} />
                      <span>{rec.title}</span>
                      <time>{decision.at}</time>
                      {decision.reason ? <span>{decision.reason}</span> : null}
                    </li>
                  ))}
                </ul>
                {log.length === 0 ? (
                  <p className="use-note">Your decisions appear under the examples.</p>
                ) : null}
              </section>
            </aside>
          </div>
        </section>

        <section className="wrap section" id="chart">
          <h2 className="h2">A quiet day is not a saving.</h2>
          <p className="sub">
            Saving is energy per tonne against a baseline. Approving a card does not move this chart or the payback.
          </p>
          <Chart days={DAYS} />
        </section>

        <section className="wrap section" id="sensitivity">
          <h2 className="h2">At 30% realisation, payback is still positive.</h2>
          <p className="sub">
            Annual benefit is spend × potential × realisation. Payback is the ₹2 crore investment against that benefit.
          </p>
          <Sliders
            potential={potential}
            realisation={realisation}
            onPotential={setPotential}
            onRealisation={setRealisation}
          />
          <p className="payoff">
            Annual benefit {formatCrore(benefit)}. Payback {formatPayback(payback)}.
            {realisation <= 30 ? " Still positive." : ""}
          </p>
          <p className="flip">
            Option A beats this plan when a lost day exceeds about ₹{FLIP_POINT_INR / 100_000} lakh.
          </p>
          <p className="assumptions">₹80 crore annual energy spend. ₹2 crore investment. Illustrative.</p>
        </section>

        <footer className="wrap colophon">
          <dl className="colophon-figures">
            <div>
              <dt>Recommendations</dt>
              <dd>{RECOMMENDATIONS.length}</dd>
            </div>
            <div>
              <dt>Levers</dt>
              <dd>{Object.keys(LEVER_NAME).length}</dd>
            </div>
            <div>
              <dt>Local score</dt>
              <dd>Saving × confidence</dd>
            </div>
            <div>
              <dt>Proven region</dt>
              <dd>Checked in code</dd>
            </div>
          </dl>
          <p>
            Illustrative synthetic data across {DAYS.length} days. No trained model is running, and nothing here writes
            a set-point. Generative AI helped structure this prototype. The decisions, assumptions, and figures belong
            to the team.
          </p>
        </footer>
      </main>
    </div>
  );
}
