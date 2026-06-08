"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useLogout } from "@/Query/useAuth";
export default function Header() {
  const { user } = useUser();
  const { mutate: logout, isPending } = useLogout();
  const logoutFun = () => {
    logout();
  };
  return (
    <nav className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-[#0f1117] text-white z-50">
      {/* الجزء الأيسر: اللوجو */}
      <Link href="/">
        <div className="">
          <Image
            src="/icon/logo.svg"
            alt="logo"
            width={150}
            height={100}
            priority
            loading="eager"
          />
        </div>
      </Link>

      {/* profile icon */}
      <div className="flex items-center gap-2">
        <Link href="/ProfilePage">
          <div className="ml-1 relative w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white  text-xs cursor-pointer shadow-sm">
            {user?.profile_image ? (
              <Image
                src={user.profile_image}
                alt="Profile"
                width={36}
                height={36}
                className="rounded-full"
                sizes="36px"
              />
            ) : (
              <p>{user?.username?.charAt(1)}</p>
            )}
          </div>
        </Link>
        <div
          className="cursor-pointer text-gray-500 hover:text-gray-300"
          onClick={() => logout()}
        >
          <LogOut />
        </div>
      </div>
    </nav>
  );
}
