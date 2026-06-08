// component/ForgetPasswordForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useSendOTP,
  useVerifyOTP,
  useResetPassword,
} from "@/Query/useForgetPassword";
import {
  emailSchema,
  otpSchema,
  resetPasswordSchema,
} from "@/Schema/forgetPassword";
import type {
  EmailData,
  OtpData,
  ResetPasswordData,
} from "@/Schema/forgetPassword";
import { Eye, EyeOff } from "lucide-react";

const ForgetPasswordForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: sendOTP, isPending: sendingOTP } = useSendOTP();
  const { mutate: verifyOTP, isPending: verifyingOTP } = useVerifyOTP();
  const { mutate: resetPassword, isPending: resettingPassword } =
    useResetPassword();

  // Step 1 - Email
  const emailForm = useForm<EmailData>({
    resolver: zodResolver(emailSchema),
  });

  // Step 2 - OTP
  const otpForm = useForm<OtpData>({
    resolver: zodResolver(otpSchema),
  });

  // Step 3 - New Password
  const passwordForm = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSendOTP = (data: EmailData) => {
    sendOTP(data.email, {
      onSuccess: () => {
        setEmail(data.email);
        toast.success("OTP sent to your email");
        setStep(2);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to send OTP");
      },
    });
  };

  const onVerifyOTP = (data: OtpData) => {
    verifyOTP(
      { email, otp: data.otp },
      {
        onSuccess: () => {
          toast.success("OTP verified");
          setStep(3);
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Invalid OTP");
        },
      },
    );
  };

  const onResetPassword = (data: ResetPasswordData) => {
    resetPassword(
      { email, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success("Password reset successfully");
          router.push("/sign-in");
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message || "Failed to reset password",
          );
        },
      },
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Progress */}
      <div className="flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all ${
              s <= step ? "bg-[#6d28d9]" : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Step 1 - Email */}
      {step === 1 && (
        <form
          onSubmit={emailForm.handleSubmit(onSendOTP)}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-[#3b3270]">Enter Your Email</h2>
          <input
            {...emailForm.register("email")}
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#6d28d9]"
          />
          {emailForm.formState.errors.email && (
            <p className="text-red-500 text-sm">
              {emailForm.formState.errors.email.message}
            </p>
          )}
          <button
            type="submit"
            disabled={sendingOTP}
            className="w-full py-3 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] text-white font-bold disabled:opacity-70"
          >
            {sendingOTP ? "Sending..." : "Send OTP"}
          </button>
        </form>
      )}

      {/* Step 2 - OTP */}
      {step === 2 && (
        <form
          onSubmit={otpForm.handleSubmit(onVerifyOTP)}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-[#3b3270]">Enter OTP Code</h2>
          <p className="text-gray-500 text-sm">Sent to {email}</p>
          <input
            {...otpForm.register("otp")}
            type="text"
            maxLength={6}
            placeholder="000000"
            className="w-full text-white px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#6d28d9] text-center text-2xl tracking-widest"
          />
          {otpForm.formState.errors.otp && (
            <p className="text-red-500 text-sm">
              {otpForm.formState.errors.otp.message}
            </p>
          )}
          <button
            type="submit"
            disabled={verifyingOTP}
            className="w-full py-3 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] text-white font-bold disabled:opacity-70"
          >
            {verifyingOTP ? "Verifying..." : "Verify OTP"}
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full text-sm text-gray-500 hover:text-[#6d28d9]"
          >
            Back
          </button>
        </form>
      )}

      {/* Step 3 - New Password */}
      {step === 3 && (
        <form
          onSubmit={passwordForm.handleSubmit(onResetPassword)}
          className="space-y-4"
        >
          <h2 className="text-xl font-bold text-[#3b3270]">New Password</h2>
          <div className="relative">
            <input
              {...passwordForm.register("newPassword")}
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="w-full text-white px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:border-[#6d28d9]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {passwordForm.formState.errors.newPassword && (
            <p className="text-red-500 text-sm">
              {passwordForm.formState.errors.newPassword.message}
            </p>
          )}
          <div className="relative">
            <input
              {...passwordForm.register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full text-white px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#6d28d9]"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {passwordForm.formState.errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {passwordForm.formState.errors.confirmPassword.message}
            </p>
          )}
          <button
            type="submit"
            disabled={resettingPassword}
            className="w-full py-3 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] text-white font-bold disabled:opacity-70"
          >
            {resettingPassword ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgetPasswordForm;
