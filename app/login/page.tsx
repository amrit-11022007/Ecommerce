"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Lock, Sparkles } from "lucide-react";

import Input from "../components/Input";
import Button from "../components/Button";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (res?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F0F8FF] via-white to-[#F8F0FF] px-4 py-8">
      <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-[#6C63FF]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-linear-to-tr from-[#2874F0]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] p-10 shadow-2xl shadow-[#6C63FF]/10 flex flex-col gap-6"
      >
        <div className="mb-2 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-[#2874F0] to-[#6C63FF] shadow-lg shadow-[#6C63FF]/30 mb-5">
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#2D3436] tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-gray-500 font-medium">
            Sign in to your account
          </p>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-600">
              Username
            </span>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Enter your username"
                type="text"
                value={username}
                onChange={setUsername}
                style="w-full rounded-2xl border-2 border-gray-100 bg-white px-5 py-3.5 pl-12 text-sm text-[#2D3436] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 focus:shadow-lg focus:shadow-[#6C63FF]/10 hover:border-gray-200"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-600">
              Password
            </span>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={setPassword}
                style="w-full rounded-2xl border-2 border-gray-100 bg-white px-5 py-3.5 pl-12 pr-12 text-sm text-[#2D3436] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 focus:shadow-lg focus:shadow-[#6C63FF]/10 hover:border-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6C63FF] transition-colors duration-300"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded-lg border-gray-300 text-[#6C63FF] focus:ring-[#6C63FF]/20"
            />
            <span className="text-gray-500 font-medium">Remember me</span>
          </label>
          <button
            type="button"
            className="font-semibold text-[#6C63FF] hover:text-[#2874F0] transition-colors duration-300"
          >
            Forgot password?
          </button>
        </div>

        <Button
          text={isLoading ? "Signing in..." : "Sign In"}
          type="submit"
          variant="primary"
          fullWidth
          size="lg"
          disabled={isLoading}
          className="mt-2 rounded-2xl shadow-xl shadow-[#6C63FF]/30 hover:shadow-2xl hover:shadow-[#6C63FF]/40"
        />

        {error && (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-semibold text-red-500">{error}</p>
          </div>
        )}

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="font-semibold text-[#6C63FF] hover:text-[#2874F0] transition-colors duration-300"
          >
            Sign up
          </button>
        </p>
      </form>
    </main>
  );
}
