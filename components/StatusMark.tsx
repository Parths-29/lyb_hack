import type { Status } from "@/lib/calc";

const LABEL: Record<Status, string> = {
  pending: "Pending",
  approved: "Approved",
  overridden: "Overridden",
  blocked: "Blocked",
};

export function StatusMark({ status }: { status: Status }) {
  return (
    <span className={`mark mark-${status}`}>
      <svg viewBox="0 0 16 16" aria-hidden="true" className="mark-icon">
        {status === "pending" && <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />}
        {status === "approved" && (
          <path d="M3.5 8.2 6.4 11l6.1-6.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        )}
        {status === "overridden" && (
          <path d="M4 4.5h8M8 4.5V12" fill="none" stroke="currentColor" strokeWidth="1.5" />
        )}
        {status === "blocked" && (
          <>
            <circle cx="8" cy="8" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 8h6" stroke="currentColor" strokeWidth="1.5" />
          </>
        )}
      </svg>
      {LABEL[status]}
    </span>
  );
}
