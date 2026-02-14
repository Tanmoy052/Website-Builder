"use client";

import React, { useState } from "react";
import { X, Mail, Lock, ShieldCheck } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<"login" | "signup" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMode("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-studio-accent rounded-xl flex items-center justify-center text-white">
              <ShieldCheck size={28} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            {mode === "login"
              ? "Welcome Back"
              : mode === "signup"
                ? "Create Account"
                : "Verify Email"}
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            {mode === "otp"
              ? `We sent a code to ${email}`
              : "Access your persistent AI Studio history"}
          </p>

          <form
            onSubmit={
              mode === "otp"
                ? handleOtpVerify
                : mode === "login"
                  ? handleLogin
                  : handleRequestOtp
            }
            className="space-y-4"
          >
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                {error}
              </div>
            )}

            {mode !== "otp" && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-studio-accent focus:border-transparent outline-none transition-all"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>
                {mode === "login" && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-studio-accent focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {mode === "otp" && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  6-Digit OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-center text-2xl font-bold tracking-[0.5em] focus:ring-2 focus:ring-studio-accent focus:border-transparent outline-none transition-all"
                  placeholder="000000"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-studio-accent text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : mode === "login"
                  ? "Sign In"
                  : mode === "signup"
                    ? "Send OTP"
                    : "Verify & Login"}
            </button>

            {mode === "login" && (
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="w-full text-xs text-studio-accent font-medium hover:underline mt-2"
              >
                Sign in with OTP instead
              </button>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            {mode === "login" ? (
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-studio-accent font-semibold hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : mode === "signup" ? (
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-studio-accent font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <button
                onClick={() => setMode("signup")}
                className="text-sm text-studio-accent font-semibold hover:underline"
              >
                Back to sign up
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
