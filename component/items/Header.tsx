// "use client";

// import { LogOut } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useUser } from "@/context/UserContext";
// import { useLogout } from "@/Query/useAuth";
// export default function Header() {
//   const { user } = useUser();
//   const { mutate: logout, isPending } = useLogout();
//   const logoutFun = () => {
//     logout();
//   };
//   return (
//     <nav className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-[#0f1117] text-white z-50">
//       {/* الجزء الأيسر: اللوجو */}
//       <Link href="/">
//         <div className="">
//           <Image
//             src="/icon/logo.svg"
//             alt="logo"
//             width={150}
//             height={100}
//             priority
//             loading="eager"
//           />
//         </div>
//       </Link>

//       {/* profile icon */}
//       <div className="flex items-center gap-2">
//         <Link href="/ProfilePage">
//           <div className="ml-1 relative w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white  text-xs cursor-pointer shadow-sm">
//             {user?.profile_image ? (
//               <Image
//                 src={user.profile_image}
//                 alt="Profile"
//                 width={36}
//                 height={36}
//                 className="rounded-full"
//                 sizes="36px"
//               />
//             ) : (
//               <p>{user?.username?.charAt(1)}</p>
//             )}
//           </div>
//         </Link>
//         <div
//           className="cursor-pointer text-gray-500 hover:text-gray-300"
//           onClick={() => logout()}
//         >
//           <LogOut />
//         </div>
//       </div>
//     </nav>
//   );
// }

"use client";

import { useState } from "react";
import {
  LogOut,
  Bookmark,
  X,
  Menu,
  Users,
  MessageCircle,
  BellRing,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useLogout } from "@/Query/useAuth";

export default function Header() {
  const { user } = useUser();
  const { mutate: logout } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-[#0f1117] text-white z-50">
        <Link href="/">
          <Image
            src="/icon/logo.svg"
            alt="logo"
            width={150}
            height={100}
            priority
            loading="eager"
          />
        </Link>

        <button
          onClick={() => setMenuOpen(true)}
          className="text-gray-400 hover:text-white transition"
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#0f1117] z-50 md:hidden transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profile */}
        <Link href="/ProfilePage" onClick={() => setMenuOpen(false)}>
          <div className="flex flex-col items-center gap-3 px-5 py-4 border-b border-gray-800 hover:bg-[#1a1a1b] transition">
            <div className="relative w-18 h-18 rounded-full bg-blue-700 flex items-center justify-center shrink-0 overflow-hidden">
              {user?.profile_image ? (
                <Image
                  src={user.profile_image}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover"
                  sizes="48px"
                />
              ) : (
                <p className="text-white font-bold text-lg">
                  {user?.username?.charAt(0).toUpperCase()}
                </p>
              )}
            </div>
            <div className="min-w-0 text-center">
              <p className="text-white font-semibold truncate">
                {user?.username}
              </p>
              <p className="text-gray-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </Link>

        {/* Menu Items */}
        <div className="flex flex-col mt-2">
          <Link
            href="/saved"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-5 py-4 text-gray-400 hover:text-white hover:bg-[#1a1a1b] transition"
          >
            <Bookmark className="w-5 h-5" />
            <span>Saved Posts</span>
          </Link>
          <Link
            href="/frinds"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-5 py-4 text-gray-400 hover:text-white hover:bg-[#1a1a1b] transition"
          >
            <Users className="w-5 h-5" />
            <span>Frinds</span>
          </Link>
          <Link
            href="/Messages"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-5 py-4 text-gray-400 hover:text-white hover:bg-[#1a1a1b] transition"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Messages</span>
          </Link>
          <Link
            href="/Notifications"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-5 py-4 text-gray-400 hover:text-white hover:bg-[#1a1a1b] transition"
          >
            <BellRing className="w-5 h-5" />
            <span>Notifications</span>
          </Link>

          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
            className="flex items-center gap-3 px-5 py-4 text-red-400 hover:text-red-300 hover:bg-[#1a1a1b] transition w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
