import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased selection:bg-blue-500/30">
      
      {/* 1. NAVIGATION BAR LAYER */}
      <nav className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <span className="text-lg font-black tracking-wider text-blue-500">VOXPOP</span>
            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              14,204 Live Voters
            </span>
          </div>
          
          {/* Navigation Anchors */}
          <div className="hidden space-x-8 text-sm font-medium text-zinc-400 md:flex">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          {/* Authentication Entry Gateways */}
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-500 text-white font-medium">
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* 2. HERO / HOME SECTION */}
      <section id="home" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
              Your Opinion Matters. <br />
              <span className="text-blue-500">Watch Public Sentiments Shift.</span>
            </h1>
            <p className="max-w-lg text-lg text-zinc-400">
              Create, share, and vote on decentralized public queries. Experience instant response updates driven by an uncompromised live synchronization engine.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 font-semibold">
                <a href="#features">Explore Features</a>
              </Button>
              <Link to="/register" className="text-sm font-semibold hover:underline underline-offset-4">
                Create a Poll Now &rarr;
              </Link>
            </div>
          </div>
          
          {/* Hero Featured Live Poll Interactive Display Box */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-400">Featured Public Poll</span>
              <span className="text-xs text-zinc-500">Expires in 2 days</span>
            </div>
            <h3 className="text-lg font-bold mb-4">Which core technology framework will define full-stack engineering next?</h3>
            <div className="space-y-3">
              {['React/Next.js with Tailwind v4', 'Native Component Architecture'].map((option, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3 hover:bg-zinc-800/40 transition-all cursor-pointer group">
                  <div className="h-4 w-4 rounded-full border border-zinc-700 grid place-items-center group-hover:border-blue-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white">{option}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="border-t border-zinc-900 bg-zinc-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Built For High-Trust Public Engagement</h2>
            <p className="mt-4 text-zinc-400 text-sm sm:text-base">We eliminated slow page loads and complex sign-ups so you can gauge collective thought instantly.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { title: "Real-Time Sync", desc: "Every submission renders across connected visitor views instantly without manual state refreshing pages." },
              { title: "Expiration Enforcements", desc: "Calculations evaluate variables exactly. Once system parameters expire, options securely close." },
              { title: "Open Wall Visibility", desc: "Public categories remain globally accessible for verification, audit checks, and shared data distribution." }
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-6 hover:border-zinc-800 transition-colors">
                <div className="text-2xl font-black text-blue-500 mb-2">0{i+1}.</div>
                <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURES SECTION (Bento Grid Architecture) */}
      <section id="features" className="border-t border-zinc-900 bg-zinc-900/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Platform Core</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Engineered for absolute scale.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Box 1: Large Feature Row */}
            <div className="md:col-span-2 rounded-2xl border border-zinc-900 bg-zinc-900/50 p-8 flex flex-col justify-between hover:border-zinc-800 transition-all">
              <div className="max-w-md space-y-2">
                <h3 className="text-xl font-bold">Dynamic Live Analytical Visualizer</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Watch community choices adapt dynamically. As soon as a public voter checks an option, metrics, percentage fills, and total counters adapt fluidly right before your eyes.
                </p>
              </div>
              {/* Mini visual mockup data bar rows */}
              <div className="mt-8 space-y-3 rounded-xl bg-zinc-950 p-4 border border-zinc-900">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-400"><span>Option Alpha</span><span className="text-blue-400 font-bold">68%</span></div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: '68%' }} /></div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-zinc-400"><span>Option Beta</span><span className="text-zinc-500">32%</span></div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-zinc-700 rounded-full" style={{ width: '32%' }} /></div>
                </div>
              </div>
            </div>

            {/* Box 2: Small Feature Card */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-900/50 p-8 flex flex-col justify-between hover:border-zinc-800 transition-all">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Automated Expiration Locks</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Set your target expiry timestamp and step away. The application securely evaluates date boundaries, preventing additional vote payloads natively.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-center rounded-lg bg-red-500/5 border border-red-500/10 p-4 text-center">
                <span className="font-mono text-sm tracking-widest text-red-400 font-bold animate-pulse">LOCKDOWN ACTIVE</span>
              </div>
            </div>

            {/* Box 3: Small Feature Card */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-900/50 p-8 flex flex-col justify-between hover:border-zinc-800 transition-all">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Anonymous Security Keys</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Accept input responses cleanly without collecting sensitive personal credentials. Protect user identities while maintaining data fidelity.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs text-zinc-500 border-t border-zinc-900 pt-4">
                <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">AES-256</span>
                <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800">Session Guard</span>
              </div>
            </div>

            {/* Box 4: Large Feature Row */}
            <div className="md:col-span-2 rounded-2xl border border-zinc-900 bg-zinc-900/50 p-8 flex flex-col justify-between hover:border-zinc-800 transition-all">
              <div className="max-w-md space-y-2">
                <h3 className="text-xl font-bold">Central Dashboard Control</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Manage your active portfolio effortlessly. Filter through published questions, draft temporary queries, or export clean response logs with a single click.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs bg-zinc-950 p-3 rounded-lg border border-zinc-900 text-zinc-400 font-mono">
                <span className="text-blue-400">⚡ Status: Operational</span>
                <span>|</span>
                <span>Active Channels: 42</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="pricing" className="border-t border-zinc-900 bg-zinc-950 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Transparent Plans, No Surprises</h2>
            <p className="mt-4 text-zinc-400 text-sm sm:text-base">Start hosting public feedback walls for free, or scale up for private corporate spaces.</p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {/* Free Tier */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-900/20 p-8 flex flex-col justify-between hover:border-zinc-800 transition-colors">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Public Ballot</h4>
                  <div className="mt-2 flex items-baseline text-4xl font-black">
                    $0<span className="text-sm font-normal text-zinc-500">/ forever</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-400">Perfect for running community polls, social debates, and open general questions.</p>
                <ul className="space-y-2 text-sm text-zinc-300 pt-4 border-t border-zinc-900">
                  <li className="flex items-center gap-2">✔ Unlimited Public Polls</li>
                  <li className="flex items-center gap-2">✔ Instant Live Results Layout</li>
                  <li className="flex items-center gap-2">✔ 1-Click Expiration Timestamp</li>
                </ul>
              </div>
              <Button asChild variant="outline" className="mt-8 border-zinc-800 text-white hover:bg-zinc-900 bg-transparent">
                <Link to="/register">Get Started Free</Link>
              </Button>
            </div>

            {/* Paid Tier */}
            <div className="rounded-2xl border-2 border-blue-600 bg-zinc-900 p-8 flex flex-col justify-between relative shadow-2xl">
              <span className="absolute -top-3 right-4 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-bold text-white tracking-wide">POPULAR</span>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-blue-400">Workspace Hub</h4>
                  <div className="mt-2 flex items-baseline text-4xl font-black">
                    $12<span className="text-sm font-normal text-zinc-400">/ month</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-400">Tailored for content creators, businesses, and targeted user group tracking.</p>
                <ul className="space-y-2 text-sm text-zinc-300 pt-4 border-t border-zinc-800">
                  <li className="flex items-center gap-2 text-white font-medium">✔ Everything in Public Ballot</li>
                  <li className="flex items-center gap-2">✔ Secure Private Access Routes</li>
                  <li className="flex items-center gap-2">✔ Advanced Analytics CSV Downloads</li>
                  <li className="flex items-center gap-2">✔ Custom Identity Authentication Walls</li>
                </ul>
              </div>
              <Button asChild className="mt-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                <Link to="/register">Upgrade to Hub</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER SECTION */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 text-center text-xs text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-black tracking-wider text-zinc-400">
            <span className="text-blue-500">VOXPOP</span> &copy; {new Date().getFullYear()}
          </div>
          <div className="flex gap-6 font-medium">
            <a href="#home" className="hover:text-zinc-300 transition-colors">Back to Top</a>
            <span>•</span>
            <span className="text-emerald-500">Connected to Database Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
}