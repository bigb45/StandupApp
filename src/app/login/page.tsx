"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle } from "phosphor-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    toast.success("Signed in successfully");

    if (profile?.role === "manager") {
      router.push("/manager");
    } else {
      router.push("/dashboard");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setIsResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset email sent");
    setIsResetting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-cream p-4">
      <div className="card max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mb-3 shadow-sm">
            <CheckCircle size={32} weight="bold" />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">
            StandupApp
          </h1>
        </div>

        {!isForgotPassword ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label
                className="text-xs font-medium text-text-secondary uppercase tracking-wider"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="input-field w-full"
                placeholder="name@compunknown.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label
                  className="text-xs font-medium text-text-secondary uppercase tracking-wider"
                  htmlFor="password"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                className="input-field w-full"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-6"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

            {process.env.NEXT_PUBLIC_DEV_EMAIL && (
              <button
                type="button"
                onClick={() => {
                  setEmail(process.env.NEXT_PUBLIC_DEV_EMAIL || "");
                  setPassword(process.env.NEXT_PUBLIC_DEV_PASSWORD || "");
                }}
                className="w-full text-xs text-text-secondary hover:text-primary transition-colors mt-2"
              >
                Auto-fill dev credentials
              </button>
            )}
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1">
              <label
                className="text-xs font-medium text-text-secondary uppercase tracking-wider"
                htmlFor="reset-email"
              >
                Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                className="input-field w-full"
                placeholder="name@compunknown.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isResetting}
              className="btn-primary w-full mt-6"
            >
              {isResetting ? "Sending..." : "Send reset link"}
            </button>
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              className="w-full text-xs text-primary hover:underline mt-2"
            >
              Back to sign in
            </button>
          </form>
        )}

        {!isForgotPassword && (
          <div className="text-center mt-8 space-y-2">
            <p className="text-xs text-text-secondary">
              Account creation is managed by your team lead.
            </p>
            <a
              href="/setup"
              className="text-xs text-primary hover:underline inline-block"
            >
              First time? Create manager account
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
