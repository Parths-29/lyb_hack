"use client";

import { useState, type FormEvent } from "react";
import { cardStatus, formatInr, formatValue, localScore } from "@/lib/calc";
import { LEVER_NAME, type Decision, type Recommendation as Rec } from "@/lib/data";
import { RangeBar } from "./RangeBar";
import { StatusMark } from "./StatusMark";

export function Recommendation({
  rec,
  decision,
  onApprove,
  onOverride,
  onUndo,
}: {
  rec: Rec;
  decision?: Decision;
  onApprove?: () => void;
  onOverride?: (reason: string) => void;
  onUndo?: () => void;
}) {
  const status = cardStatus(rec, decision);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const safety = rec.touchesSetpoint
    ? status === "blocked"
      ? "Blocked. Outside the proven region."
      : "Inside the proven region. A person still decides."
    : "Does not touch a set-point.";

  function submitOverride(event: FormEvent) {
    event.preventDefault();
    const text = reason.trim();
    if (!text) {
      setError("A reason is required.");
      return;
    }
    setError("");
    onOverride?.(text);
  }

  return (
    <article className="card">
      <p className="kicker">
        Lever {rec.lever} · {LEVER_NAME[rec.lever]} · {rec.source}
      </p>
      <div className="card-head">
        <h2>{rec.title}</h2>
        <StatusMark status={status} />
      </div>
      <p className="reason">{rec.reason}</p>
      <dl className="facts">
        <div>
          <dt>Expected saving</dt>
          <dd>{formatInr(rec.expectedSavingInrPerDay)}/day</dd>
        </div>
        <div>
          <dt>Confidence</dt>
          <dd>{rec.confidence}</dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{rec.source}</dd>
        </div>
        <div>
          <dt>Safety</dt>
          <dd>{safety}</dd>
        </div>
      </dl>
      {rec.source === "AI" && (
        <p className="score">
          Local score {localScore(rec).toLocaleString("en-IN")} — expected saving × confidence. Not a trained model.
        </p>
      )}
      <RangeBar rec={rec} />
      {status === "blocked" && rec.provenRegion && rec.proposedValue != null && (
        <p className="block-note">
          Approve is disabled. {formatValue(rec.proposedValue, rec.provenRegion.unit)} is outside the proven region of{" "}
          {formatValue(rec.provenRegion.min, rec.provenRegion.unit)} to{" "}
          {formatValue(rec.provenRegion.max, rec.provenRegion.unit)}.
        </p>
      )}
      {status === "pending" && onApprove && (
        <button type="button" className="button" onClick={onApprove}>
          Approve
        </button>
      )}
      {status === "blocked" && (
        <button type="button" className="button" disabled>
          Approve
        </button>
      )}
      {status === "pending" && onOverride && (
        <form className="override" onSubmit={submitOverride}>
          <label htmlFor={`reason-${rec.id}`}>Reason for override</label>
          <textarea
            id={`reason-${rec.id}`}
            value={reason}
            rows={3}
            aria-invalid={error ? true : undefined}
            onChange={(event) => {
              setReason(event.target.value);
              if (error) setError("");
            }}
          />
          {error ? (
            <p className="form-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="button button-ghost">
            Override
          </button>
        </form>
      )}
      {decision ? (
        <div className="decision">
          <p className="log">
            <StatusMark status={decision.kind} />
            <time>{decision.at}</time>
            {decision.reason ? <span className="log-reason">{decision.reason}</span> : null}
          </p>
          {onUndo ? (
            <button type="button" className="text-button" onClick={onUndo}>
              Undo
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
