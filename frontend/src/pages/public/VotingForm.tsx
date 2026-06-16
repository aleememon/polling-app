import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { pollsApi } from "@/api/polls";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { socket } from "@/utils/socket";

const VotingForm = () => {
  const { id } = useParams<{ id: string }>();

  const [viewMode, setViewMode] = useState<"Voting Form" | "Results" | null>(null);
  const [poll, setPoll] = useState<any | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Establish the Real-Time WebSocket Channel Loop
  useEffect(() => {
    if (!id) return;

    // A. Request the backend to subscribe this socket connection to the target room stream
    socket.emit("join_room", `poll_${id}`);

    // B. Setup the socket channel tracking listener for database updates
    socket.on("live_analytics_update", (data) => {
      if (data.pollId === id) {
        // console.log("⚡ Authoritative live state synchronization snapshot received:", data.outcome);
        
        // Dynamic State Merging Layer
        setPoll((prevPoll: any) => {
          if (!prevPoll) return prevPoll;

          // If your analytics view maps over an array, update those totals dynamically
          const updatedAnalytics = prevPoll.analytics?.map((questionItem: any) => {
            // Find the matching answers recorded inside this transaction outcome block
            const matchingAnswers = data.outcome.recordedAnswers.filter(
              (ans: any) => ans.questionId === questionItem.id
            );

            if (matchingAnswers.length === 0) return questionItem;

            const newResults = { ...(questionItem.results || {}) };
            
            // Increment options matching what was pushed inside the database transaction
            matchingAnswers.forEach((ans: any) => {
              newResults[ans.chosenOption] = (newResults[ans.chosenOption] || 0) + 1;
            });

            return {
              ...questionItem,
              totalQuestionVotes: questionItem.totalQuestionVotes + matchingAnswers.length,
              results: newResults,
            };
          });

          return {
            ...prevPoll,
            totalBallotsCast: (Number(prevPoll.totalBallotsCast) || 0) + 1,
            analytics: updatedAnalytics || prevPoll.analytics,
          };
        });
      }
    });

    // C. Clean up socket events when the component unmounts to prevent pipeline leaks
    return () => {
      socket.off("live_analytics_update");
    };
  }, [id]);

  // 2. Fetch Initial Structural System Layout State
  useEffect(() => {
    if (!id) return;

    const fetchPollStructure = async () => {
      try {
        const response = await pollsApi.getPublicPollById(id);
        
        if (!response || !response.poll) {
          setError("Unable to load poll structural data layout.");
          return;
        }

        setViewMode(response.viewMode);
        setPoll(response.poll);
      } catch (err: any) {
        const serverMsg = err.response?.data?.error || err.message || "Failed to establish stream link.";
        setError(serverMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPollStructure();
  }, [id]);

  const handleRadioSelect = (questionId: string, optionText: string) => {
    if (viewMode === "Results") return;
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionText,
    }));
  };

  const handleSubmitVotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poll || viewMode !== "Voting Form") return;

    const operationalQuestions = poll.questions || [];

    if (operationalQuestions.length === 0) {
      toast.error("No question entries found inside this active layout window.");
      return;
    }

    for (const q of operationalQuestions) {
      if (!selectedOptions[q.id]) {
        toast.error(`Submission halted: Question "${q.text}" requires a selection.`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const answersPayload = Object.entries(selectedOptions).map(([questionId, chosenOption]) => ({
        questionId,
        chosenOption,
      }));

      // A. Standard HTTP API invocation. This fires the backend transaction routine.
      await pollsApi.submitPollResponse(poll.id, { answers: answersPayload });
      toast.success("Ballot cast successfully! Your choices have been registered. ⚡");
      
      // B. Swap layout to viewing results directly without executing a full page window refresh!
      setViewMode("Results");
      
    } catch (err: any) {
      const serverError = err.response?.data?.error || err.message || "Failed to commit tokens.";
      toast.error(`Transaction Rejected: ${serverError}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest">
        Synchronizing Operational Parameters...
      </div>
    );
  }

  if (error || !poll) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-4 px-4">
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold font-mono uppercase tracking-wide max-w-md text-center">
          ⚠️ Terminal Error: {error || "Configuration missing."}
        </div>
        <Button asChild variant="outline" className="border-zinc-900 text-zinc-400 hover:bg-zinc-900 bg-transparent text-xs font-semibold">
          <Link to="/">Exit System</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased selection:bg-blue-500/30">
      <header className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <span className="text-sm font-black tracking-widest text-zinc-400 uppercase font-mono">
            VoxPop Public Gateway
          </span>
          <div className="flex items-center gap-3">
            {viewMode === "Results" ? (
              <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-[10px] font-bold text-blue-400 uppercase tracking-wider animate-pulse">
                📊 Historical Metrics Live
              </span>
            ) : (
              poll.isAnonymous && (
                <span className="rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  🔒 Encrypted Anonymous Session
                </span>
              )
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-16">
        <div className="space-y-2 border-b border-zinc-900 pb-6 mb-10">
          <h1 className="text-3xl font-black tracking-tight text-white">{poll.title}</h1>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            {viewMode === "Results" 
              ? `Total Aggregate Ballots Counted: ${poll.totalBallotsCast}`
              : `Operational window open until: ${new Date(poll.expiresAt).toLocaleString()}`
            }
          </p>
        </div>

        {viewMode === "Results" ? (
          <div className="space-y-8">
            {poll.analytics?.map((item: any, idx: number) => (
              <div key={item.id} className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-6 space-y-6">
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/5 border border-blue-500/10 px-2 py-0.5 rounded">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  {item.text}
                </h3>

                <div className="space-y-4 pt-2">
                  {Object.entries(item.results || {}).map(([option, count]: [string, any]) => {
                    const percentage = item.totalQuestionVotes > 0 
                      ? Math.round((count / item.totalQuestionVotes) * 100) 
                      : 0;

                    return (
                      <div key={option} className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-zinc-300">{option}</span>
                          <span className="font-mono text-zinc-500">
                            {count} {count === 1 ? "vote" : "votes"} ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-900/60">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmitVotes} className="space-y-10">
            <div className="space-y-8">
              {poll.questions?.map((q: any, qIndex: number) => (
                <div key={q.id} className="bg-zinc-900/20 border border-zinc-900 rounded-xl p-6 space-y-4 hover:border-zinc-800/80 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/5 border border-blue-500/10 px-2 py-0.5 rounded mt-0.5">
                      {String(qIndex + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-zinc-100">{q.text}</h3>
                      <p className="text-[10px] text-zinc-500 uppercase font-mono mt-0.5">Single Response Required</p>
                    </div>
                  </div>

                  <div className="grid gap-2.5 pt-2">
                    {q.options?.map((optionString: string) => {
                      const isChecked = selectedOptions[q.id] === optionString;
                      return (
                        <label
                          key={optionString}
                          onClick={() => handleRadioSelect(q.id, optionString)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer select-none transition-all duration-150 ${isChecked ? "bg-blue-600/10 border-blue-500 text-white shadow-md shadow-blue-500/5" : "bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:bg-zinc-900/60"}`}
                        >
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${isChecked ? "border-blue-500 bg-blue-500" : "border-zinc-700 bg-zinc-950"}`}>
                            {isChecked && <div className="h-1.5 w-1.5 rounded-full bg-white animate-scaleIn" />}
                          </div>
                          <span className="text-sm font-medium">{optionString}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-zinc-900 flex items-center justify-end">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-6 tracking-wide uppercase transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50">
                {isSubmitting ? "Transmitting Ballot Tokens..." : "Finalize and Cast Votes"}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default VotingForm;