"use client";

import LogoIcon from "@/components/LogoIcon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {

  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);

    const router=useRouter();
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const onSubmit= async(data: SignInFormValues)=>{
    try{
      const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/login`,
          {
            email: data.email,
            password: data.password,
          },{
            withCredentials:true
          }
        );
        toast.success("Welcome Back!");
        router.push("/dashboard");
    }catch(error:any){
        toast.error(error?.response?.data?.message || "Login failed");
    }finally {
    setLoading(false);
  }

  }

  return (
    <div className="min-h-screen bg-[#f3f4f8] flex flex-col items-center justify-center px-4 animate-fadeIn">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-8 animate-fadeIn">
        <LogoIcon />
        <span className="text-[17px] font-bold text-slate-800 tracking-tight">
          Cypher<span className="text-blue-600">Cloud</span>
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-110 bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-9">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[1.55rem] font-bold text-slate-900 tracking-tight mb-1.5">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-[14px]">
            Sign in to access your secure cloud workspace
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              required
              {...form.register("email")}
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[13.5px] text-slate-800 placeholder-slate-400 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:scale-[1.01] focus:shadow-md transition-all duration-200"/>
              {form.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[13px] font-semibold text-slate-700">
                Password
              </label>
              <Link
                href="#"
                className="text-[13px] text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot?
              </Link>
            </div>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                {...form.register("password")}
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-[13.5px] text-slate-800 placeholder-slate-400 bg-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-150"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>

            {form.formState.errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 text-white font-semibold text-[14.5px] py-2.5 rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>


        {/* Sign up link */}
        <p className="text-center text-[13.5px] text-slate-500 mt-6">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-blue-600 font-bold hover:text-blue-700">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Footer legal */}
      <p className="mt-6 text-[12px] text-slate-400 text-center">
        By signing in, you agree to our{" "}
        <Link href="#" className="underline hover:text-slate-600 transition-colors">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline hover:text-slate-600 transition-colors">
          Privacy Policy
        </Link>
      </p>

    </div>
  );
}
