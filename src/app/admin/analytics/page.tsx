import type { Metadata } from "next";
import { categories } from "@/lib/beliefs";
import { isAuthed, isConfigured } from "@/lib/admin-auth";
import { readStats, type CountedEvent, type StatsSnapshot } from "@/lib/stats-store";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

// Never cache: always read fresh counters and the request's cookie.
export const dynamic = "force-dynamic";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (!isConfigured()) {
    return (
      <Shell>
        <Notice>
          Set the <code className="font-mono">STAT_ACC_TOKEN</code> environment
          variable (any value) and redeploy, then reload this page to sign in.
        </Notice>
      </Shell>
    );
  }

  if (!(await isAuthed())) {
    return (
      <Shell>
        <LoginForm error={Boolean(error)} />
      </Shell>
    );
  }

  const stats = await readStats();
  return (
    <Shell authed>
      {stats ? (
        <Dashboard stats={stats} />
      ) : (
        <Notice>
          Couldn&apos;t reach the analytics store. Check that the{" "}
          <code className="font-mono">WOB_STORAGE_KV_REST_API_URL</code> and{" "}
          <code className="font-mono">WOB_STORAGE_KV_REST_API_TOKEN</code>{" "}
          variables are present.
        </Notice>
      )}
    </Shell>
  );
}

/* ------------------------------------------------------------------ layout */

function Shell({
  children,
  authed = false,
}: {
  children: React.ReactNode;
  authed?: boolean;
}) {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-5xl px-6 py-12 lg:px-8">
        <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-5">
          <div>
            <p className="font-sans text-[0.65rem] uppercase tracking-[0.22em] text-mark">
              Private dashboard
            </p>
            <h1 className="mt-1 font-serif text-3xl font-medium tracking-tight text-ink">
              Funnel analytics
            </h1>
          </div>
          {authed ? (
            <form method="post" action="/api/stat-auth">
              <input type="hidden" name="logout" value="1" />
              <button
                type="submit"
                className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-muted underline decoration-rule underline-offset-4 transition hover:text-ink hover:decoration-ink"
              >
                Sign out
              </button>
            </form>
          ) : null}
        </div>
        {children}
      </div>
    </main>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 border border-rule bg-paper-soft p-6 font-sans text-[0.9rem] leading-6 text-ink-soft">
      {children}
    </div>
  );
}

function LoginForm({ error }: { error: boolean }) {
  return (
    <form
      method="post"
      action="/api/stat-auth"
      className="mt-10 max-w-sm border border-rule bg-paper-soft p-6"
    >
      <label className="block font-sans text-[0.7rem] uppercase tracking-[0.18em] text-muted">
        Access token
      </label>
      <input
        type="password"
        name="password"
        autoFocus
        autoComplete="current-password"
        className="mt-2 w-full border border-rule bg-paper px-3 py-2.5 font-mono text-sm text-ink outline-none focus:border-ink"
      />
      {error ? (
        <p className="mt-2 font-sans text-[0.78rem] text-[#b3261e]">
          Incorrect token.
        </p>
      ) : null}
      <button
        type="submit"
        className="mt-4 inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2.5 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-paper transition hover:border-mark hover:bg-mark"
      >
        Sign in
      </button>
    </form>
  );
}

/* --------------------------------------------------------------- dashboard */

function pct(part: number, whole: number): number {
  return whole > 0 ? Math.round((part / whole) * 100) : 0;
}

function Dashboard({ stats }: { stats: StatsSnapshot }) {
  const t = stats.totals;
  const sessions = t.home_viewed;

  return (
    <div className="mt-8 space-y-12">
      <Funnel totals={t} sessions={sessions} />
      <StepDropoff steps={stats.steps} startedAnswering={t.check_started} />
      <CompareSection totals={t} />
      <OtherActions totals={t} badgeVia={stats.badgeVia} />
      <Trend series={stats.series} />
      <p className="font-sans text-[0.7rem] uppercase tracking-[0.16em] text-muted">
        All-time counts. Reload to refresh · counts are progress only, never
        answers.
      </p>
    </div>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-sans text-[0.7rem] uppercase tracking-[0.22em] text-mark">
        {title}
      </h2>
      {hint ? (
        <p className="mt-1 font-serif text-[0.95rem] italic leading-6 text-muted">
          {hint}
        </p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Funnel({
  totals,
  sessions,
}: {
  totals: Record<CountedEvent, number>;
  sessions: number;
}) {
  const rows: Array<{ label: string; count: number }> = [
    { label: "Sessions (homepage)", count: totals.home_viewed },
    { label: "Clicked “Begin the check”", count: totals.begin_cta_click },
    { label: "Started answering", count: totals.check_started },
    { label: "Reached results", count: totals.results_viewed },
  ];
  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <Section
      title="Conversion funnel"
      hint="Where visitors drop off between landing and seeing their result."
    >
      <div className="space-y-2.5">
        {rows.map((row, i) => {
          const prev = i > 0 ? rows[i - 1].count : row.count;
          return (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_auto] items-center gap-4 border border-rule bg-paper-soft px-4 py-3"
            >
              <div className="min-w-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-sans text-[0.85rem] text-ink">
                    {row.label}
                  </span>
                  {i > 0 ? (
                    <span className="font-sans text-[0.68rem] uppercase tracking-[0.14em] text-muted">
                      {pct(row.count, prev)}% of previous
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 h-1.5 w-full bg-rule-soft">
                  <div
                    className="h-1.5 bg-ink"
                    style={{ width: `${Math.round((row.count / max) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg text-ink">{row.count}</div>
                <div className="font-sans text-[0.66rem] uppercase tracking-[0.14em] text-muted">
                  {pct(row.count, sessions)}% of sessions
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function StepDropoff({
  steps,
  startedAnswering,
}: {
  steps: Array<{ step: number; count: number }>;
  startedAnswering: number;
}) {
  // step N = visitor advanced to the (N)th topic. Label with the topic name.
  const max = Math.max(startedAnswering, ...steps.map((s) => s.count), 1);
  return (
    <Section
      title="How far they get"
      hint="How many people advance to each topic before leaving."
    >
      <div className="space-y-1.5">
        <DropRow label="Started answering" count={startedAnswering} max={max} />
        {steps.length === 0 ? (
          <p className="font-sans text-[0.8rem] text-muted">
            No topic advances recorded yet.
          </p>
        ) : (
          steps.map((s) => (
            <DropRow
              key={s.step}
              label={`→ ${categories[s.step - 1]?.name ?? `Topic ${s.step}`}`}
              count={s.count}
              max={max}
            />
          ))
        )}
      </div>
    </Section>
  );
}

function DropRow({
  label,
  count,
  max,
}: {
  label: string;
  count: number;
  max: number;
}) {
  return (
    <div className="grid grid-cols-[14rem_1fr_3rem] items-center gap-3">
      <span className="truncate font-sans text-[0.8rem] text-ink-soft">
        {label}
      </span>
      <div className="h-2 w-full bg-rule-soft">
        <div
          className="h-2 bg-mark"
          style={{ width: `${Math.round((count / max) * 100)}%` }}
        />
      </div>
      <span className="text-right font-mono text-sm text-ink">{count}</span>
    </div>
  );
}

function CompareSection({
  totals,
}: {
  totals: Record<CountedEvent, number>;
}) {
  return (
    <Section
      title="Compare feature"
      hint="Use of the “compare with a friend” flow."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Compare links created" value={totals.compare_link_created} />
        <Stat
          label="Compare links opened"
          value={totals.compare_viewed}
          sub={`${pct(totals.compare_viewed, totals.compare_link_created)}% of links created`}
        />
        <Stat
          label="Comparisons completed"
          value={totals.compare_completed}
          sub={`${pct(totals.compare_completed, totals.compare_viewed)}% of opened`}
        />
      </div>
    </Section>
  );
}

function OtherActions({
  totals,
  badgeVia,
}: {
  totals: Record<CountedEvent, number>;
  badgeVia: Record<string, number>;
}) {
  const badgeTotal = totals.badge_shared;
  const viaParts = ["share", "download", "copy"]
    .map((v) => (badgeVia[v] ? `${v} ${badgeVia[v]}` : null))
    .filter(Boolean)
    .join(" · ");
  return (
    <Section title="Other actions">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Result summary copied" value={totals.summary_copied} />
        <Stat
          label="Result badge shared"
          value={badgeTotal}
          sub={viaParts || undefined}
        />
        <Stat label="Checks reset" value={totals.check_reset} />
      </div>
    </Section>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="border border-rule bg-paper-soft px-4 py-3">
      <div className="font-mono text-2xl text-ink">{value}</div>
      <div className="mt-1 font-sans text-[0.72rem] uppercase tracking-[0.12em] text-muted">
        {label}
      </div>
      {sub ? (
        <div className="mt-0.5 font-sans text-[0.68rem] text-muted">{sub}</div>
      ) : null}
    </div>
  );
}

function Trend({ series }: { series: StatsSnapshot["series"] }) {
  const metrics: Array<{ label: string; key: CountedEvent }> = [
    { label: "Sessions", key: "home_viewed" },
    { label: "Started", key: "check_started" },
    { label: "Results", key: "results_viewed" },
    { label: "Compare opened", key: "compare_viewed" },
  ];
  return (
    <Section
      title={`Last ${series.days.length} days`}
      hint="Daily counts (UTC) for the headline steps."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {metrics.map((m) => (
          <Sparkline
            key={m.key}
            label={m.label}
            values={series.byEvent[m.key]}
          />
        ))}
      </div>
    </Section>
  );
}

function Sparkline({ label, values }: { label: string; values: number[] }) {
  const max = Math.max(...values, 1);
  const total = values.reduce((a, b) => a + b, 0);
  return (
    <div className="border border-rule bg-paper-soft p-4">
      <div className="flex items-baseline justify-between">
        <span className="font-sans text-[0.72rem] uppercase tracking-[0.12em] text-muted">
          {label}
        </span>
        <span className="font-mono text-sm text-ink">{total}</span>
      </div>
      <div className="mt-3 flex h-12 items-end gap-[3px]">
        {values.map((v, i) => (
          <div
            key={i}
            className="flex-1 bg-ink/80"
            style={{ height: `${Math.max((v / max) * 100, v > 0 ? 6 : 1)}%` }}
            title={`${v}`}
          />
        ))}
      </div>
    </div>
  );
}
