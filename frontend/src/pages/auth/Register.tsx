import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

// Register Schema
const registerSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterValues = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 2. Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  // 3. Handle Form Submission
  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await authApi.register(data.name, data.email, data.password);

      navigate("/login");
    } catch (err: any) {
      setServerError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row font-sans text-white">
      {/* LEFT SIDE: BRANDING (Visible on Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 border-r border-zinc-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <Link
            to="/"
            className="text-2xl font-black tracking-wider text-blue-500"
          >
            VOXPOP
          </Link>
          <h2 className="mt-20 text-5xl font-black tracking-tight leading-tight">
            The world is <br />
            <span className="text-zinc-500">waiting for your</span> <br />
            next question.
          </h2>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Join 14,000+ active creators
          </div>
          <p className="mt-2 text-zinc-500 text-sm max-w-xs">
            Start building public feedback walls and watch live sentiments shift
            in real-time.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: THE FORM */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-zinc-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-500 hover:underline underline-offset-4 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Server Error Message */}
            {serverError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold animate-in fade-in zoom-in duration-300">
                ⚠️ {serverError}
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                name
              </label>
              <input
                {...register("name")}
                placeholder="johndoe"
                className={`w-full bg-zinc-900 border ${errors.name ? "border-red-500" : "border-zinc-800"} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600`}
              />
              {errors.name && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
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

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Password
                </label>
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full bg-zinc-900 border ${errors.password ? "border-red-500" : "border-zinc-800"} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-0/2 text-zinc-400 hover:text-zinc-100"
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-lg font-bold text-base transition-all shadow-lg shadow-blue-500/10"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>

            {/* Terms Disclaimer */}
            <p className="text-[10px] text-center text-zinc-500 leading-relaxed">
              By clicking sign up, you agree to our{" "}
              <span className="underline">Terms of Service</span> and{" "}
              <span className="underline">Privacy Policy</span>. VoxPop uses
              immutable expiration locks to secure poll data.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
