import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

// 1. Define the validation schema using Zod
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 2. Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  // 3. Handle Form Submission
  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      // Fires the network request to POST /api/auth/login and saves the token
      await authApi.login(data.email, data.password);

      // Success! Send them directly to their private dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row font-sans text-white">
      {/* LEFT SIDE: BRANDING PANEL (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 border-r border-zinc-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Light Flare */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link
            to="/"
            className="text-2xl font-black tracking-wider text-blue-500"
          >
            VOXPOP
          </Link>
          <h2 className="mt-20 text-5xl font-black tracking-tight leading-tight">
            Welcome back. <br />
            <span className="text-zinc-500">Analyze real-time</span> <br />
            voter analytics.
          </h2>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Live Connection
          </div>
          <p className="mt-2 text-zinc-500 text-sm max-w-xs">
            Log in to manage your public channels, publish active parameters,
            and inspect live data changes.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: THE LOGIN FORM CONTROL */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header text block */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Sign in to VoxPop
            </h1>
            <p className="mt-2 text-zinc-400 text-sm">
              New to our platform?{" "}
              <Link
                to="/register"
                className="text-blue-500 hover:underline underline-offset-4 font-semibold"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Form Layer */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Dynamic Server Error Banner Catch */}
            {serverError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold animate-in fade-in zoom-in duration-300">
                ⚠️ {serverError}
              </div>
            )}

            {/* Email Input Field Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="name@example.com"
                className={`w-full bg-zinc-900 border ${errors.email ? "border-red-500" : "border-zinc-800"} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600`}
              />
              {errors.email && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Input Field Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Password
                </label>{" "}
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full bg-zinc-900 border ${errors.password ? "border-red-500" : "border-zinc-800"} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-100"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Action Form Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-lg font-bold text-base transition-all shadow-lg shadow-blue-500/10"
            >
              {isLoading ? "Verifying Credentials..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
