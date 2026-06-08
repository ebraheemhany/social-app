"use client";

import {
  FieldError,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";

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
  return (
    <div>
      <div
        className="w-full px-4 py-3 rounded-xl bg-[#e8e6f0] text-[#3b3270] placeholder-[#9490b8] flex items-center gap-2
            text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/60 transition"
      >
        {icon}
        <input
          type={type}
          {...register(name)}
          className="w-full outline-none bg-transparent"
          placeholder={placeholder}
        />
      </div>
      {error && (
        <p className="text-red-400 text-[11px] ml-3">{error.message}</p>
      )}
    </div>
  );
};

export default Input;
