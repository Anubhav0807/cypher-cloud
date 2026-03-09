"use client";

import EyeIcon from "@/components/EyeIcon";
import { CheckIcon } from "@/components/Icons";
import LogoIcon from "@/components/LogoIcon";
import api from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const KEYFRAMES = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes spinLoader {
    to { transform: rotate(360deg); }
  }
`;

function PasswordStrengthBar({ password }: { password: string }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  if (!password) return null;

  const score = getStrength();
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i <= score ? colors[score] : "#e2e8f0",
            }}
          />
        ))}
      </div>
      <p className="text-[11px] font-medium" style={{ color: colors[score] }}>
        {labels[score]}
      </p>
    </div>
  );
}

export default function SignUpPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const signUpSchema = z
    .object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  type SignUpFormValues = z.infer<typeof signUpSchema>;
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");
  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordMismatch = confirmPassword && password !== confirmPassword;
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!agreed) return;

    setLoading(true);

    try {
      await api.post("/api/user/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      console.log("Validated Data:", data);
      setSuccess(true);
      toast.success("Account Created Successfully");
      router.push("/sign-in");
    } catch (error: any) {
      console.log("Validated Data:", data);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create account. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <style>{KEYFRAMES}</style>

      <div className="min-h-screen bg-[#f3f4f8] flex flex-col items-center justify-center px-4 py-10">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 mb-8"
          style={{ animation: "fadeIn 0.4s ease both" }}
        >
          <LogoIcon />
          <span className="text-[17px] font-bold text-slate-800 tracking-tight">
            Cypher<span className="text-blue-600">Cloud</span>
          </span>
        </div>

        {/* Card */}
        <div
          className="w-full max-w-115 bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-9"
          style={{ animation: "fadeSlideUp 0.45s ease both" }}
        >
          {success ? (
            /* ── Success state ─────────────────────────────── */
            <div
              className="flex flex-col items-center text-center py-6"
              style={{ animation: "fadeSlideUp 0.4s ease both" }}
            >
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="text-[1.4rem] font-bold text-slate-900 mb-2">
                Account Created!
              </h2>
              <p className="text-slate-500 text-[14px] max-w-75 leading-relaxed">
                Welcome to CypherCloud. Your quantum-safe cloud workspace is
                ready.
              </p>
              <Link
                href="/sign-in"
                className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[14px] px-6 py-2.5 rounded-lg transition-colors duration-150"
              >
                Go to Sign In
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-7">
                <h1 className="text-[1.55rem] font-bold text-slate-900 tracking-tight mb-1.5">
                  Create Account
                </h1>
                <p className="text-slate-500 text-[14px]">
                  Sign up to start using CypherCloud
                </p>
              </div>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name */}
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    {...form.register("name")}
                    placeholder="Your Name"
                    required
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[13.5px] text-slate-800 placeholder-slate-400 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
                  />
                  {form.formState.errors.name && (
                    <p className="text-[11.5px] text-red-500 mt-1.5 font-medium">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    {...form.register("email")}
                    placeholder="you@company.com"
                    required
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[13.5px] text-slate-800 placeholder-slate-400 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
                  />
                  {form.formState.errors.email && (
                    <p className="text-[11.5px] text-red-500 mt-1.5 font-medium">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Password
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      {...form.register("password")}
                      placeholder="Min. 8 characters"
                      required
                      minLength={8}
                      className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 pr-10 text-[13.5px] text-slate-800 placeholder-slate-400 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
                    />
                    {form.formState.errors.password && (
                      <p className="text-[11.5px] text-red-500 mt-1.5 font-medium">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-150"
                    >
                      <EyeIcon open={showPass} />
                    </button>
                  </div>
                  <PasswordStrengthBar password={password} />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                    Confirm Password
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      {...form.register("confirmPassword")}
                      placeholder="Re-enter password"
                      required
                      className={`w-full border rounded-lg px-3.5 py-2.5 pr-10 text-[13.5px] transition-all duration-150 ${passwordMismatch
                        ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : passwordsMatch
                          ? "border-green-400 focus:border-green-400 focus:ring-2 focus:ring-green-100"
                          : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        }`}
                    />
                    {form.formState.errors.confirmPassword && (
                      <p className="text-[11.5px] text-red-500 mt-1.5 font-medium">
                        {form.formState.errors.confirmPassword.message}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-150"
                    >
                      <EyeIcon open={showConfirm} />
                    </button>
                    {/* Match indicator */}
                    {passwordsMatch && (
                      <div className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckIcon />
                      </div>
                    )}
                  </div>
                  {passwordMismatch && (
                    <p className="text-[11.5px] text-red-500 mt-1.5 font-medium">
                      Passwords do not match
                    </p>
                  )}
                </div>

                {/* Terms checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <div className="relative mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150"
                        style={{
                          borderColor: agreed ? "#3b82f6" : "#cbd5e1",
                          background: agreed ? "#3b82f6" : "white",
                        }}
                      >
                        {agreed && <CheckIcon />}
                      </div>
                    </div>
                    <span className="text-[12.5px] text-slate-500 leading-relaxed">
                      I agree to the{" "}
                      <Link
                        href="#"
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="#"
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading || !agreed}
                    className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-[14.5px] py-2.5 rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          style={{
                            animation: "spinLoader 0.7s linear infinite",
                          }}
                        >
                          <circle
                            cx="7.5"
                            cy="7.5"
                            r="6"
                            stroke="rgba(255,255,255,0.35)"
                            strokeWidth="2.5"
                            fill="none"
                          />
                          <path
                            d="M7.5 1.5 A6 6 0 0 1 13.5 7.5"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            fill="none"
                          />
                        </svg>
                        Creating account…
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </div>
              </form>

              {/* Sign in link */}
              <p className="text-center text-[13.5px] text-slate-500 mt-6">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-blue-600 font-bold hover:text-blue-700"
                >
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-[12px] text-slate-400 text-center">
          By signing up, you agree to our{" "}
          <Link
            href="#"
            className="underline hover:text-slate-600 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="#"
            className="underline hover:text-slate-600 transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </>
  );
}
