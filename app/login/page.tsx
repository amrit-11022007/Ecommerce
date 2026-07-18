"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import Input from "../components/Input";
import Button from "../components/Button";

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
            <Input
              placeholder="Enter Username"
              type="text"
              value={username}
              onChange={setUsername}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Password
            </span>
            <Input
              placeholder="Enter Password"
              type="password"
              value={password}
              onChange={setPassword}
            />
          </label>
        </div>

        <Button text="Login" type="submit" />

        {error && (
          <p className="mt-4 text-center text-sm font-medium text-red-500">
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
