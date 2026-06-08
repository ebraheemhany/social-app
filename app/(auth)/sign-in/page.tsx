import { Suspense } from "react";
import SignInForm from "@/component/items/SignInForm";

const SignIn = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0c0849be] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-[#632fb1] opacity-40 blur-[100px]" />
        <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-[#4a46a7] opacity-50 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[#3d378d] opacity-20 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="bg-[#0c0849be]/60 backdrop-blur-md rounded-2xl px-8 pt-10 pb-0 shadow-2xl border border-white/5">
          <h1 className="text-center text-white text-3xl font-bold mb-8 tracking-wide">
            Sign in
          </h1>
          <Suspense fallback={<div>Loading...</div>}>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
