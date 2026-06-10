"use client";

import { usePathname } from "next/navigation";
import {
  House,
  Search,
  Bell,
  MessageSquare,
  Bookmark,
  Users,
  Star,
  TvMinimalPlay,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { useLogout } from "@/Query/useAuth";
const LeftSection = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  //  user data
  const { user } = useUser();

  // function to logout
  const { mutate: logout, isPending } = useLogout();

  const logoutFun = () => {
    logout();
  };

  // get messages count and notification Count from context
  const { messageCount, notificationCount } = useUser();

  return (
    <div className=" w-full h-full  bg-[#161618] border-r border-gray-600">
      <div>
        <Link href="/">
          <div className=" ml-3 ">
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
        <div className="w-full h-[1px] bg-gray-600 mt-2"></div>
        {/* <div className="">
          <input
            type="search"
            placeholder="Search..."
            className="w-[90%]
            ml-3
            mt-5
            bg-[#1E1E22]
            border
            border-gray-600
            rounded-lg
            outline-none px-3 py-1"
          />
        </div> */}
        <div className="mt-8 ml-3">
          <p className="text-[13px] text-gray-700">MAIN</p>

          <ul className="text-gray-500">
            <li
              className={`flex items-center gap-2 py-2 px-2 rounded-lg cursor-pointer transition
  ${isActive("/") ? "bg-gray-700 text-white" : "text-gray-500 hover:bg-gray-700 hover:text-white"}`}
            >
              <House className="w-5 h-5" />
              <Link href="/">
                <p>Home</p>
              </Link>
            </li>

            <li
              className={`flex items-center gap-2 py-2 px-2 rounded-lg cursor-pointer transition
  ${isActive("/explore") ? "bg-gray-700 text-white" : "text-gray-500 hover:bg-gray-700 hover:text-white"}`}
            >
              <Search className="w-5 h-5" />
              <Link href="/explore">
                <p>Explore</p>
              </Link>
            </li>

            <Link href="/Notifications">
              <li
                className={`flex justify-between items-center gap-2 py-2 px-2 rounded-lg cursor-pointer transition
  ${isActive("/Notifications") ? "bg-gray-700 text-white" : "text-gray-500 hover:bg-gray-700 hover:text-white"}`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 " />
                  <p>Notifications</p>
                </div>
                <div>
                  {notificationCount > 0 && (
                    <span className="bg-blue-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center mr-2">
                      {notificationCount}
                    </span>
                  )}
                </div>
              </li>
            </Link>
            <Link href="/Messages">
              <li
                className={`flex justify-between items-center gap-2 py-2 px-2 rounded-lg cursor-pointer transition
  ${isActive("/Messages") ? "bg-gray-700 text-white" : "text-gray-500 hover:bg-gray-700 hover:text-white"}`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  <p>Messages</p>
                </div>
                <div>
                  {messageCount > 0 && (
                    <span className="bg-blue-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center mr-2">
                      {messageCount}
                    </span>
                  )}
                </div>
              </li>
            </Link>
            <Link href="/saved">
              <li
                className={`flex items-center gap-2 py-2 px-2 rounded-lg cursor-pointer transition
    ${isActive("/saved") ? "bg-gray-700 text-white" : "text-gray-500 hover:bg-gray-700 hover:text-white"}`}
              >
                <Bookmark className="w-5 h-5" />
                <p>Saved</p>
              </li>
            </Link>
          </ul>
        </div>{" "}
        <div className="w-[90%] h-px mx-auto bg-gray-700 mt-2"></div>
        <div className="mt-8 ml-3">
          <p className="text-[13px] text-gray-700">DISCOVER</p>
          <ul className="text-gray-500">
            <Link href="/frinds">
              <li
                className={`flex items-center gap-2 py-1 px-2 rounded-lg cursor-pointer transition
  ${isActive("/frinds") ? "bg-gray-700 text-white" : "text-gray-500 hover:bg-gray-700 hover:text-white"}`}
              >
                <Users className="w-5 h-5" />
                <p>Friends</p>
              </li>
            </Link>
            <li className="flex items-center gap-2 py-1 px-2 mt-3  text-gray-500 hover:bg-gray-700 hover:text-white rounded-lg cursor-pointer transition">
              <Star className="w-5 h-5" />
              <p>CreaTor Studop</p>
            </li>
            <li className="flex items-center gap-2 py-1 px-2 mt-3  text-gray-500 hover:bg-gray-700 hover:text-white rounded-lg cursor-pointer transition">
              <TvMinimalPlay className="w-5 h-5" />
              <p>Live</p>
            </li>
          </ul>
        </div>
        <div className="w-[90%] h-px mx-auto bg-gray-700 mt-2"></div>
        <div
          onClick={() => logoutFun()}
          className="flex items-center gap-2 py-2 px-2  mt-3 ml-3  text-gray-500 hover:bg-gray-700 hover:text-white rounded-lg cursor-pointer transition"
        >
          <LogOut className="w-5 h-5" />
          <p>LogOut</p>
        </div>
        <div className="absolute bottom-0 w-full">
          <div className="w-full h-[1px] bg-gray-600 mt-2"></div>

          <Link href="/ProfilePage">
            <div className="flex items-center justify-between m-3">
              <div className="flex gap-2">
                <div className="relative w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
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
                    <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
                      {user?.username?.slice(0, 2)?.toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-[16px] text-white">{user?.username}</p>
                  <p className="text-gray-500 text-[14px]">
                    @{user?.email?.split("@")[0]}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-700 cursor-pointer" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftSection;
