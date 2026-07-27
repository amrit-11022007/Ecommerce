"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Phone,
  UserCircle,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

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

    setIsLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F0F8FF] via-white to-[#F8F0FF] px-4 py-8">
      <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-[#6C63FF]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-linear-to-tr from-[#2874F0]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <form
        onSubmit={handleRegister}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] p-10 shadow-2xl shadow-[#6C63FF]/10 flex flex-col gap-5"
      >
        <div className="mb-2 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-[#6C63FF] to-[#2874F0] shadow-lg shadow-[#6C63FF]/30 mb-5">
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#2D3436] tracking-tight">
            Create account
          </h1>
          <p className="mt-2 text-gray-500 font-medium">
            Join us and start shopping
          </p>
        </div>

        <div className="space-y-4">
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
                placeholder="Choose a username"
                type="text"
                name="username"
                value={userData.username}
                onChange={(value, field) =>
                  setUserData((prev) => ({
                    ...prev,
                    [field ?? "username"]: value,
                  }))
                }
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
                placeholder="Create a password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={userData.password}
                onChange={(value, field) =>
                  setUserData((prev) => ({
                    ...prev,
                    [field ?? "password"]: value,
                  }))
                }
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

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-600">
              Full Name
            </span>
            <div className="relative">
              <UserCircle
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
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
                style="w-full rounded-2xl border-2 border-gray-100 bg-white px-5 py-3.5 pl-12 text-sm text-[#2D3436] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 focus:shadow-lg focus:shadow-[#6C63FF]/10 hover:border-gray-200"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-gray-600">
              Mobile Number
            </span>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
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
                style="w-full rounded-2xl border-2 border-gray-100 bg-white px-5 py-3.5 pl-12 text-sm text-[#2D3436] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 focus:shadow-lg focus:shadow-[#6C63FF]/10 hover:border-gray-200"
              />
            </div>
          </label>
        </div>

        <Button
          text={isLoading ? "Creating account..." : "Create Account"}
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
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="font-semibold text-[#6C63FF] hover:text-[#2874F0] transition-colors duration-300"
          >
            Sign in
          </button>
        </p>
      </form>
    </main>
  );
}
