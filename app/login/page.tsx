"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e9eef7] px-4 py-8 text-slate-700">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-4xl border border-white/70 bg-[#e9eef7] p-8 shadow-[20px_20px_60px_#c7d0de,-20px_-20px_60px_#ffffff]"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-700">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in with your username and password
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Username
            </span>
            <input
              className="w-full rounded-2xl border-0 bg-[#e9eef7] px-4 py-3 text-sm text-slate-700 outline-none shadow-[inset_8px_8px_16px_#c9d2e0,inset_-8px_-8px_16px_#ffffff] placeholder:text-slate-400"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Password
            </span>
            <input
              type="password"
              className="w-full rounded-2xl border-0 bg-[#e9eef7] px-4 py-3 text-sm text-slate-700 outline-none shadow-[inset_8px_8px_16px_#c9d2e0,inset_-8px_-8px_16px_#ffffff] placeholder:text-slate-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-[#e9eef7] px-4 py-3 text-sm font-semibold text-slate-700 shadow-[8px_8px_16px_#c7d0de,-8px_-8px_16px_#ffffff] transition hover:shadow-[6px_6px_12px_#c7d0de,-6px_-6px_12px_#ffffff] focus:outline-none"
        >
          Login
        </button>

        {error && (
          <p className="mt-4 text-center text-sm font-medium text-red-500">
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
