import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";

const TOKEN_STORAGE_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY;
const EMAIL_STORAGE_KEY = import.meta.env.VITE_EMAIL_STORAGE_KEY;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => {
    if (!EMAIL_STORAGE_KEY) {
      return "";
    }

    return localStorage.getItem(EMAIL_STORAGE_KEY) || "";
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (!TOKEN_STORAGE_KEY || !EMAIL_STORAGE_KEY) {
        throw new Error("Missing login configuration. Check your .env values.");
      }

      const data = await apiClient.request("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const token = data?.token || data?.accessToken || data?.data?.token;
      if (!token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      if (rememberMe) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        localStorage.setItem(EMAIL_STORAGE_KEY, email);
      } else {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
        localStorage.removeItem(EMAIL_STORAGE_KEY);
      }

      setPassword("");
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#04140A] via-[#061F11] to-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-56 w-56 rounded-full bg-[#01F27B]/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-[-4rem] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-8rem] left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#01F27B]/15 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-xl items-center justify-center px-4 py-16">
        <div className="w-full rounded-[28px] border border-white/15 bg-gradient-to-b from-white/10 via-black/40 to-black/70 p-8 shadow-2xl backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm text-white">
              Email address
              <input
                type="email"
                required
                placeholder="admin@boostfundr.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/20 bg-black/70 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-[#01F27B] focus:outline-none"
              />
            </label>

            <label className="block text-sm text-white">
              Password
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/20 bg-black/70 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/60 focus:border-[#01F27B] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/70 transition hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" strokeWidth={1.7} />
                  ) : (
                    <Eye className="h-5 w-5" strokeWidth={1.7} />
                  )}
                </button>
              </div>
            </label>

            <label className="flex items-center gap-2 text-xs text-white">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-white/30 bg-black accent-[#01F27B] cursor-pointer"
              />
              Remember me
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-[#01F27B] via-[#7CFFB2] to-white px-4 py-3 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? "Signing in..." : "Sign in to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
