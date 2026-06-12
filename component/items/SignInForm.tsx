"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, SignInData } from "@/Schema/Schema";
import Input from "@/component/items/Input";
import { Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useLogin } from "@/Query/useAuth";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

const SignInForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInData) => {
    mutate({ email: data.email, password: data.password });
  };

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");

    if (token) {
      Cookies.set("accessToken", token, {
        expires: 1 / 96,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      Cookies.set("isLoggedIn", "true", {
        expires: 7,
        secure: false,
        sameSite: "lax",
        path: "/",
      });

      window.history.replaceState({}, "", "/sign-in");
      router.push("/");
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href =
      "https://back-app-production-e21a.up.railway.app/api/auth/google";
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          name="email"
          type="email"
          placeholder="Email"
          icon={<Mail className="w-5 h-5 text-gray-400" />}
          register={register}
          error={errors.email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          icon={<ShieldAlert className="w-5 h-5 text-gray-400" />}
          register={register}
          error={errors.password}
        />
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-800 text-white py-2 rounded-xl w-full cursor-pointer"
            disabled={isPending}
          >
            Sign In
          </button>
        </div>
      </form>

      <button
        onClick={handleGoogleLogin}
        className="w-full mt-4 active:scale-[0.98] hover:underline text-white font-bold cursor-pointer text-base"
      >
        Continue with Google
      </button>

      <Link
        href="/forget-password"
        className="text-blue-500 text-[12px] hover:underline w-full block text-center"
      >
        Forgot Password?
      </Link>

      <div className="mt-6 -mx-8 bg-[#e8e6f0] rounded-t-3xl py-4 text-center">
        <Link
          href="/sign-up"
          className="text-[#3b3270] font-semibold text-base hover:text-[#6d28d9] transition"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignInForm;
