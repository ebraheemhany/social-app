"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpData } from "@/Schema/Schema";
import Input from "@/component/items/Input";
import { User, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRegister } from "@/Query/useAuth";

const SignUpForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { mutate, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpData) => {
    try {
      setLoading(true);

      await mutate({
        email: data.email,
        password: data.password,
        username: data.username,
      });

      // if (response.user?.id) {
      //   document.cookie = `auth_token=${response.user.id}; path=/; max-age=604800`;
      // }

      toast.success("Sign Up Successfully");
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || "Sign Up Failed");
      } else {
        toast.error("Sign Up Failed");
      }
    } finally {
      setLoading(false);
    }
  };
  // googe login
  const handleGoogleLogin = () => {
    window.location.href =
      "https://back-app-production-e21a.up.railway.app/api/auth/google";
  };

  return (
    <div>
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* username */}
          <Input
            name="username"
            placeholder="Full Name"
            icon={<User className="w-5 h-5 text-gray-400" />}
            register={register}
            error={errors.username}
          />

          {/* email */}
          <Input
            name="email"
            type="email"
            placeholder="Email"
            icon={<Mail className="w-5 h-5 text-gray-400" />}
            register={register}
          />

          {/* password */}
          <Input
            name="password"
            type="password"
            placeholder="Password"
            icon={<ShieldAlert className="w-5 h-5 text-gray-400" />}
            register={register}
            error={errors.password}
          />

          {/* confirm password */}
          <Input
            name="restpassword"
            type="password"
            placeholder="Confirm Password"
            icon={<ShieldAlert className="w-5 h-5 text-gray-400" />}
            register={register}
            error={errors.restpassword}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] active:scale-[0.98]
            text-white font-bold text-base tracking-wide transition-all duration-150
            disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4  active:scale-[0.98] hover:underline
            text-white font-bold cursor-pointer text-base"
        >
          Continue with Google
        </button>
        <div className="mt-6 -mx-8 bg-[#e8e6f0] rounded-t-3xl py-4 text-center">
          <Link
            href="/sign-in"
            className="text-[#3b3270] font-semibold text-base hover:text-[#6d28d9] transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
