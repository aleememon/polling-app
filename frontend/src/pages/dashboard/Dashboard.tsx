import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pollsApi, type Poll } from "@/api/polls";
import { Button } from "@/components/ui/button";


const Dashboard = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch polls on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await pollsApi.getCreatorDashboardPolls();
        // Accessing response.data because of your ServerResponse envelope structure wrapper
        setPolls(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // 🚀 NEW: Handshake function talking directly to your publishPoll endpoint
  const handlePublish = async (id: string) => {
    try {
      await pollsApi.publishPoll(id);
      
      // Instantly modify frontend state array so the badge changes color without a page reload
      setPolls((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPublished: true } : p))
      );
      alert("Ballot deployed live! WebSocket events broadcasted successfully. 🌐");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // 2. Handle instant UI removal on successful deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this poll permanently?")) return;
    
    try {
      await pollsApi.deletePoll(id);
      setPolls((prev) => prev.filter((p) => p.id !== id));
      alert("Poll removed from active channels.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Helper calculation to check if a poll has expired natively
  const isExpired = (expiryDate: string) => {
    return new Date() > new Date(expiryDate);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased selection:bg-blue-500/30">
      
      {/* INTERNAL DASHBOARD HEADER */}
      <header className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-lg font-black tracking-wider text-blue-500">VOXPOP</Link>
            <span className="text-zinc-700">/</span>
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Creator Console</span>
          </div>
          
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-500 font-bold">
            <Link to="/dashboard/create">+ Create New Poll</Link>
          </Button>
        </div>
      </header>

      {/* MAIN CONTAINER LAYER */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight">Your Active Workspace</h1>
          <p className="text-zinc-400 text-sm mt-1">Monitor, verify parameters, and view analytics for your custom polls.</p>
        </div>

        {/* LOADING STATE CONTAINER */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="h-48 rounded-xl border border-zinc-900 bg-zinc-900/20 animate-pulse" />
            ))}
          </div>
        )}

        {/* RUNTIME SYSTEM ERROR CONTAINER */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm font-semibold max-w-xl">
            ⚠️ {error}
          </div>
        )}

        {/* EMPTY DATALIST STATE */}
        {!isLoading && polls.length === 0 && !error && (
          <div className="text-center py-20 rounded-2xl border border-dashed border-zinc-900 bg-zinc-900/10 max-w-xl mx-auto">
            <h3 className="text-lg font-bold text-zinc-300">No active poll streams found</h3>
            <p className="text-zinc-500 text-xs mt-2 max-w-xs mx-auto">You haven't generated any dynamic questionnaire sets yet. Let's build your first collection block.</p>
            <Button asChild className="mt-6 bg-blue-600 hover:bg-blue-500 text-xs font-bold">
              <Link to="/dashboard/create">Launch First Ballot</Link>
            </Button>
          </div>
        )}

        {/* THE MAIN ACTIVE POLLS GRID */}
        {!isLoading && polls.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => {
              const expired = isExpired(poll.expiresAt);
              
              return (
                <div 
                  key={poll.id} 
                  className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6 flex flex-col justify-between hover:border-zinc-800 transition-all group relative overflow-hidden"
                >
                  <div>
                    {/* Status badges bar */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1.5">
                        {expired ? (
                          <span className="rounded bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 uppercase tracking-wide">
                            Expired
                          </span>
                        ) : poll.isPublished ? (
                          <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                            Public Live
                          </span>
                        ) : (
                          <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                            Private Draft
                          </span>
                        )}
                        
                        {poll.isAnonymous && (
                          <span className="rounded bg-zinc-800 border border-zinc-700/50 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                            Anonymous
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-zinc-600">ID: {poll.slug.slice(-6)}</span>
                    </div>

                    {/* Question Title text */}
                    <h3 className="text-base font-bold text-zinc-200 group-hover:text-white transition-colors line-clamp-2 mb-2">
                      {poll.title}
                    </h3>
                    
                    <p className="text-[11px] text-zinc-500 mb-6 font-mono">
                      Ends: {new Date(poll.expiresAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Operational Controls Footer Row */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-zinc-900/60 mt-auto">
                    <button 
                      onClick={() => handleDelete(poll.id)}
                      className="text-xs text-zinc-500 hover:text-red-400 font-semibold transition-colors bg-transparent border-0 cursor-pointer"
                    >
                      Delete
                    </button>

                    <div className="flex items-center gap-2">
                      {/* If the poll is a private draft and hasn't expired, provide a quick link to vote/view */}
                      <Button asChild size="sm" variant="outline" className="h-8 border-zinc-800 text-xs font-semibold hover:bg-zinc-900 bg-transparent text-zinc-300">
                        <Link to={`/poll/${poll.id}`}>View External</Link>
                      </Button>
                      
                      <Button asChild size="sm" className="h-8 bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white">
                        <Link to={`/dashboard/analytics/${poll.id}`}>Analytics</Link>
                      </Button>
                    </div>
                  </div>

                  {/* Dynamic Publish Call-to-Action Bar */}
                    {!poll.isPublished && !expired && (
                      <Button 
                        onClick={() => handlePublish(poll.id)}
                        className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-2 tracking-wide uppercase shadow-md"
                      >
                        ⚡ Deploy Poll to Live Stream
                      </Button>
                    )}

                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}

export default Dashboard