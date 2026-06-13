import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { pollsApi, type PollAnalytics } from "@/api/polls";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";

const Analytics = () => {
  const { id } = useParams<{ id: string }>();
  const [analytics, setAnalytics] = useState<PollAnalytics["analytics"] | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchAnalyticsData = async () => {
      try {
        const response = await pollsApi.getPollAnalytics(id);

        setAnalytics(response.analytics);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        Analyzing Datastore Streams...
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-4">
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm font-semibold">
          ⚠️ Fault: {error || "Failed to parse analytics metadata payload."}
        </div>
        <Button
          asChild
          variant="outline"
          className="border-zinc-800 text-zinc-400 bg-transparent"
        >
          <Link to="/dashboard">&larr; Return to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased">
      {/* GLOBAL BANNER HEADER */}
      <header className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-zinc-500 hover:text-white text-sm transition-colors"
            >
              &larr; Console
            </Link>
            <span className="text-zinc-800">/</span>
            <h1 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
              Telemetry Analytics Metrics
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12 space-y-10">
        {/* TOP LEVEL AGGREGATE SUMMARY SECTION */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-xl">
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 tracking-wider">
              Aggregate Counter
            </span>
            <div className="text-4xl font-black mt-1 text-white">
              {analytics.totalResponses}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Total compiled ballot form responses recorded.
            </p>
          </div>

          <div className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-xl">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-500 tracking-wider">
              Identified Voters
            </span>
            <div className="text-4xl font-black mt-1 text-emerald-400">
              {analytics.participationInsights.authenticatedCount}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Logged-in accounts that authenticated choices.
            </p>
          </div>

          <div className="bg-zinc-900/20 border border-zinc-900 p-6 rounded-xl">
            <span className="text-[10px] font-mono font-bold uppercase text-blue-500 tracking-wider">
              Anonymous Submissions
            </span>
            <div className="text-4xl font-black mt-1 text-blue-400">
              {analytics.participationInsights.anonymousCount}
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Guest voter instances matching anonymous parameters.
            </p>
          </div>
        </div>

        {/* QUESTIONS AND RECHARTS VISUALIZATION LOOP */}
        <div className="space-y-8">
          <h2 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
            02. Question Distribution Matrix
          </h2>

          {analytics.questionsSummary.map((qSummary, index) => (
            <div
              key={qSummary.questionId}
              className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-6 grid gap-8 lg:grid-cols-5"
            >
              {/* Text Meta Descriptions column */}
              <div className="lg:col-span-2 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-zinc-600 block uppercase">
                    Question Variable #{index + 1}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-100 mt-1 leading-snug">
                    {qSummary.questionText}
                  </h3>
                </div>

                <div className="pt-4 border-t border-zinc-900/60 font-mono text-[11px] text-zinc-500">
                  Total Question Assertions:{" "}
                  <span className="text-white font-bold">
                    {qSummary.totalVotesForQuestion}
                  </span>
                </div>
              </div>

              {/* Recharts Bar Component Data Graphics Display box */}
              <div className="lg:col-span-3 h-52 bg-zinc-950/40 rounded-lg p-4 border border-zinc-900/50">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={qSummary.results}
                    layout="vertical"
                    margin={{ left: 10, right: 10, top: 5, bottom: 5 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="option"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "#a1a1aa",
                        fontSize: 11,
                        fontWeight: "600",
                      }}
                      width={90}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(255,255,255,0.03)" }}
                      contentStyle={{
                        backgroundColor: "#09090b",
                        borderColor: "#27272a",
                        borderRadius: "8px",
                        fontSize: "11px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={14}>
                      {qSummary.results.map((_, idx) => (
                        <Cell
                          key={`cell-${idx}`}
                          fill={idx % 2 === 0 ? "#2563eb" : "#3b82f6"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Analytics;
