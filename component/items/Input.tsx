"use client";

import { useState } from "react";
import {
  FieldError,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  register: UseFormRegister<T>;
  error?: FieldError;
};

const Input = <T extends FieldValues>({
  name,
  type = "text",
  placeholder,
  icon,
  register,
  error,
}: InputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <div
        className="w-full px-4 py-3 rounded-xl bg-[#e8e6f0] text-[#3b3270] placeholder-[#9490b8] flex items-center gap-2
            text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/60 transition"
      >
        {icon}
        <input
          type={inputType}
          {...register(name)}
          className="w-full outline-none bg-transparent"
          placeholder={placeholder}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-[#9490b8] hover:text-[#6d28d9] transition cursor-pointer"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-[11px] ml-3">{error.message}</p>
      )}
    </div>
  );
};

export default Input;
