import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { fieldClass, glassCardClass, primaryButtonClass } from "../components/BoostFundrUI";
import apiClient from "../services/apiClient";
import Logo from "../components/Logo";

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
        <div className={`w-full p-8 ${glassCardClass} bg-gradient-to-b from-white/10 via-black/40 to-black/70`}>
          <div className="flex flex-col items-center mb-8 gap-2">
            <Logo size="lg" className="scale-110" />
            <div className="w-24 h-px bg-[#01F27B]/30 my-1" />
            <span className="text-[10px] text-[#01F27B] font-black uppercase tracking-[0.4em] opacity-80">
              Admin Portal
            </span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm text-white">
              Email address
              <input
                type="email"
                required
                placeholder="admin@boostfundr.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`mt-2 ${fieldClass}`}
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
                  className={`pr-12 ${fieldClass}`}
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
              className={`${primaryButtonClass} w-full disabled:cursor-not-allowed disabled:opacity-70`}
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
