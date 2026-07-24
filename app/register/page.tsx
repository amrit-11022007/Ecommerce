"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { UserData } from "../types/definitions";
import Input from "../components/Input";
import Button from "../components/Button";

export default function RegisterPage() {
  const [userData, setUserData] = useState<UserData>({
    username: "",
    password: "",
    customerName: "",
    mobileNumber: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userData.username,
        password: userData.password,
        customer_name: userData.customerName,
        mobile_number: userData.mobileNumber,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data?.error) {
      const message =
        (typeof data?.error === "string" && data.error) ||
        (data?.error &&
        typeof data.error === "object" &&
        "message" in data.error
          ? String((data.error as { message?: unknown }).message)
          : "Registration failed");

      setError(message);
    } else {
      router.push("/");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Create account
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Register with your details below
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-400">
              Username
            </span>
            <Input
              placeholder="Enter your username"
              type="text"
              name="username"
              value={userData.username}
              onChange={(value, field) =>
                setUserData((prev) => ({
                  ...prev,
                  [field ?? "username"]: value,
                }))
              }
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-400">
              Password
            </span>
            <Input
              placeholder="Enter your password"
              type="password"
              name="password"
              value={userData.password}
              onChange={(value, field) =>
                setUserData((prev) => ({
                  ...prev,
                  [field ?? "password"]: value,
                }))
              }
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-400">
              Customer Name
            </span>
            <Input
              placeholder="Enter your full name"
              type="text"
              name="customerName"
              value={userData.customerName}
              onChange={(value, field) =>
                setUserData((prev) => ({
                  ...prev,
                  [field ?? "customerName"]: value,
                }))
              }
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-400">
              Mobile Number
            </span>
            <Input
              placeholder="Enter your mobile number"
              type="text"
              name="mobileNumber"
              value={userData.mobileNumber}
              onChange={(value, field) =>
                setUserData((prev) => ({
                  ...prev,
                  [field ?? "mobileNumber"]: value,
                }))
              }
            />
          </label>
        </div>

        <Button text="Register" type="submit" />

        {error && (
          <p className="mt-4 text-center text-sm font-medium text-red-400">
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
