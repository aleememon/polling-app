import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pollsApi } from "@/api/polls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define structural parameters for incoming poll array rows
interface SimplePollSummary {
  id: string;
  title: string;
  expiresAt: string;
  isAnonymous: boolean;
  totalBallotsCast?: number;
}

const PublicPolls = () => {
  const [polls, setPolls] = useState<SimplePollSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "expired">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllFeedPolls = async () => {
      try {
        // Replace this with your actual global index fetch API route if named differently
        const response = await pollsApi.getPublicPolls(); 
        setPolls(response.polls || []);
      } catch (err: any) {
        const serverMsg = err.response?.data?.error || err.message || "Failed to load feed pipeline.";
        setError(serverMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllFeedPolls();
  }, []);

  // 🔍 Dynamic Query Filtering & State Evaluation Routine
  const filteredPolls = polls.filter((poll) => {
    const matchesSearch = poll.title.toLowerCase().includes(searchQuery.toLowerCase());
    const isExpired = new Date() > new Date(poll.expiresAt);

    if (!matchesSearch) return false;
    if (activeFilter === "active") return !isExpired;
    if (activeFilter === "expired") return isExpired;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        Aggregating Global Feed Clusters...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased selection:bg-blue-500/30">
      {/* GLOBAL HUB TOP NAVIGATION BAR */}
      <header className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <span className="text-sm font-black tracking-widest text-zinc-400 uppercase font-mono">
            VoxPop Public Gateway
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-16 space-y-12">
        {/* HERO HEADER SECTION */}
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            Explore Open Consensus Ballots.
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Participate in running community surveys or explore automated historical metric charts compiled instantly upon deadline expirations.
          </p>
        </div>

        {/* CONTROLS MATRIX: SEARCH & FILTER TOGGLES */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-zinc-900/10 border border-zinc-900">
          <div className="w-full sm:max-w-xs">
            <Input
              type="text"
              placeholder="Search surveys..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-blue-500/30 text-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-zinc-950 border border-zinc-800 p-1 rounded-lg">
            {(["all", "active", "expired"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  activeFilter === filter
                    ? "bg-zinc-900 text-blue-400 shadow-sm border border-zinc-800/60"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* SYSTEM STATUS FEED ERROR DISPATCH */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-xs font-mono max-w-md">
            ⚠️ Feed Streaming Error: {error}
          </div>
        )}

        {/* DYNAMIC CARD FEED CONTAINER */}
        {filteredPolls.length === 0 ? (
          <div className="h-48 rounded-xl border border-dashed border-zinc-900 flex flex-col items-center justify-center gap-2 text-center p-4">
            <p className="text-sm font-semibold text-zinc-400">No matching ballots indexed</p>
            <p className="text-xs text-zinc-600 font-mono">Try altering your search or system filter toggle state.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPolls.map((poll) => {
              const isExpired = new Date() > new Date(poll.expiresAt);

              return (
                <div
                  key={poll.id}
                  className="group bg-zinc-900/20 border border-zinc-900 rounded-xl p-5 flex flex-col justify-between hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-200"
                >
                  <div className="space-y-4">
                    {/* TOP ACCENT BADGES */}
                    <div className="flex items-center justify-between gap-2">
                      {isExpired ? (
                        <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800/40">
                          🛑 Closed / Archived
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded bg-blue-500/5 text-blue-400 border border-blue-500/10 animate-pulse">
                          🟢 Active Voting
                        </span>
                      )}

                      {poll.isAnonymous && (
                        <span className="text-[10px] text-zinc-600 font-mono" title="Identity Token Masking Active">
                          🔒 Anonymous
                        </span>
                      )}
                    </div>

                    {/* POLL CARD TEXT BLOCK */}
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-zinc-200 group-hover:text-white transition-colors line-clamp-2">
                        {poll.title}
                      </h3>
                      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wide">
                        Ends: {new Date(poll.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM ACTION BUTTON / METRIC BLOCK */}
                  <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between gap-3">
                    <span className="text-xs font-mono text-zinc-500">
                      {poll.totalBallotsCast || 0} casted
                    </span>

                    <Button
                      asChild
                      variant="ghost"
                      className={`text-xs font-bold font-mono uppercase tracking-wider h-9 px-4 rounded-lg transition-all ${
                        isExpired
                          ? "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                          : "text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                      }`}
                    >
                      <Link to={`/poll/${poll.id}`}>
                        {isExpired ? "View Analytics" : "Cast Ballot"}
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default PublicPolls;