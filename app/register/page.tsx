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
  MapPin,
  Building2,
  Globe,
} from "lucide-react";

import Button from "../components/Button";

interface FormData {
  username: string;
  password: string;
  customerName: string;
  mobileNumber: string;
  city: string;
  state: string;
  country: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    customerName: "",
    mobileNumber: "",
    city: "",
    state: "",
    country: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters";
    if (!formData.customerName.trim())
      newErrors.customerName = "Full name is required";
    if (!formData.mobileNumber.trim())
      newErrors.mobileNumber = "Mobile number is required";
    else if (!/^\d{10}$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Enter valid 10-digit number";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setIsLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
        customer_name: formData.customerName,
        mobile_number: formData.mobileNumber,
        city: formData.city,
        state: formData.state,
        country: formData.country,
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

      setServerError(message);
    } else {
      router.push("/");
    }

    setIsLoading(false);
  }

  const inputClass =
    "w-full rounded-2xl border-2 border-gray-100 bg-white px-5 py-3.5 pl-12 text-sm text-[#2D3436] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 focus:shadow-lg focus:shadow-[#6C63FF]/10 hover:border-gray-200";

  const errorClass = "border-red-300 focus:border-red-400 focus:ring-red-200";

  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#F0F8FF] via-white to-[#F8F0FF] px-4 py-8">
      <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-[#6C63FF]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-linear-to-tr from-[#2874F0]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <form
        onSubmit={handleRegister}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2.5rem] p-10 shadow-2xl shadow-[#6C63FF]/10 flex flex-col gap-4"
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

        <div className="space-y-3.5">
          <div>
            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              />
              <input
                placeholder="Choose a username"
                type="text"
                value={formData.username}
                onChange={(e) => updateField("username", e.target.value)}
                className={`${inputClass} ${errors.username ? errorClass : ""}`}
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-xs font-medium text-red-500 pl-4">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              />
              <input
                placeholder="Create a password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                className={`${inputClass} pr-12 ${errors.password ? errorClass : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6C63FF] transition-colors duration-300 z-10"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs font-medium text-red-500 pl-4">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <UserCircle
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              />
              <input
                placeholder="Enter your full name"
                type="text"
                value={formData.customerName}
                onChange={(e) => updateField("customerName", e.target.value)}
                className={`${inputClass} ${errors.customerName ? errorClass : ""}`}
              />
            </div>
            {errors.customerName && (
              <p className="mt-1 text-xs font-medium text-red-500 pl-4">
                {errors.customerName}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              />
              <input
                placeholder="Enter your mobile number"
                type="text"
                value={formData.mobileNumber}
                onChange={(e) => updateField("mobileNumber", e.target.value)}
                className={`${inputClass} ${errors.mobileNumber ? errorClass : ""}`}
              />
            </div>
            {errors.mobileNumber && (
              <p className="mt-1 text-xs font-medium text-red-500 pl-4">
                {errors.mobileNumber}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                />
                <input
                  placeholder="City"
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className={`w-full rounded-2xl border-2 border-gray-100 bg-white px-4 py-3.5 pl-10 text-sm text-[#2D3436] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 focus:shadow-lg hover:border-gray-200 ${errors.city ? errorClass : ""}`}
                />
              </div>
              {errors.city && (
                <p className="mt-1 text-[10px] font-medium text-red-500 pl-2">
                  {errors.city}
                </p>
              )}
            </div>
            <div>
              <div className="relative">
                <Building2
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                />
                <input
                  placeholder="State"
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  className={`w-full rounded-2xl border-2 border-gray-100 bg-white px-4 py-3.5 pl-10 text-sm text-[#2D3436] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 focus:shadow-lg hover:border-gray-200 ${errors.state ? errorClass : ""}`}
                />
              </div>
              {errors.state && (
                <p className="mt-1 text-[10px] font-medium text-red-500 pl-2">
                  {errors.state}
                </p>
              )}
            </div>
            <div>
              <div className="relative">
                <Globe
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                />
                <input
                  placeholder="Country"
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className={`w-full rounded-2xl border-2 border-gray-100 bg-white px-4 py-3.5 pl-10 text-sm text-[#2D3436] placeholder:text-gray-400 outline-none transition-all duration-300 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 focus:shadow-lg hover:border-gray-200 ${errors.country ? errorClass : ""}`}
                />
              </div>
              {errors.country && (
                <p className="mt-1 text-[10px] font-medium text-red-500 pl-2">
                  {errors.country}
                </p>
              )}
            </div>
          </div>
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

        {serverError && (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-red-50 border border-red-200 p-4">
            <p className="text-sm font-semibold text-red-500">{serverError}</p>
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
