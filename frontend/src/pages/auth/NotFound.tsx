import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased flex flex-col justify-between relative overflow-hidden">
      
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      
      <header className="border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-lg font-black tracking-wider text-blue-500"
          >
            VOXPOP
          </Link>
          <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            Route Exception 404
          </span>
        </div>
      </header>

      
      <main className="mx-auto max-w-md px-4 text-center py-20 relative z-10 flex-1 flex flex-col justify-center">
        <h1 className="text-8xl font-black tracking-tighter text-zinc-900 select-none">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Parameter Not Found
        </h2>

        <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
          The requested path variable or polling channel directory does not
          exist or has been permanently removed by an expiration enforcement
          lock.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto border-zinc-800 text-white hover:bg-zinc-900 bg-transparent px-6 font-semibold"
          >
            &larr; Go Back
          </Button>

          <Button
            asChild
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-6 font-semibold shadow-lg shadow-blue-500/10"
          >
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950/20 py-8 text-center text-[11px] text-zinc-600 font-mono">
        <div>SYSTEM_LOG: INVALID_REQUEST_URI_ROUTE_EXCEPTION</div>
      </footer>
    </div>
  );
};

export default NotFound;
