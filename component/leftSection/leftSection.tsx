"use client";

import Image from "next/image";
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
  Settings,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
const LeftSection = () => {
  const pathname = usePathname();
  const isActive = (path:string) => pathname === path;
  return (
    <div className=" w-full h-full  bg-[#161618] border-r border-gray-600">
      <div>
        <Link href="/">
          <div className="relative w-[150px] h-[70px] ml-3 ">
            <Image src="/icon/logo.svg" alt="logo" fill />
          </div>
        </Link>

        <div className="w-full h-[1px] bg-gray-600 mt-2"></div>

        <div className="">
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
        </div>

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
                  <Bell className="w-5 h-5" />
                  <p>Notifications</p>
                </div>
                <div>
                  <span className="bg-blue-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
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
                  <span className="bg-blue-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </div>
              </li>
            </Link>
            <li className="flex items-center gap-2 py-2 cursor-pointer">
              <Bookmark className="w-5 h-5" />
              <p>Saved</p>
            </li>
          </ul>
        </div>
        <div className="w-[90%] h-px mx-auto bg-gray-700 mt-2"></div>

        <div className="mt-8 ml-3">
          <p className="text-[13px] text-gray-700">DISCOVER</p>

          <ul className="text-gray-500">
            <Link href="/frinds">
              <li
                className={`flex items-center gap-2 py-2 px-2 rounded-lg cursor-pointer transition
  ${isActive("/frinds") ? "bg-gray-700 text-white" : "text-gray-500 hover:bg-gray-700 hover:text-white"}`}
              >
                <Users className="w-5 h-5" />
                <p>Friends</p>
              </li>
            </Link>
            <li className="flex items-center gap-2 py-2 cursor-pointer">
              <Star className="w-5 h-5" />
              <p>CreaTor Studop</p>
            </li>
            <li className="flex items-center gap-2 py-2 cursor-pointer">
              <TvMinimalPlay className="w-5 h-5" />
              <p>Live</p>
            </li>
          </ul>
        </div>

        <div className="w-[90%] h-px mx-auto bg-gray-700 mt-2"></div>

        <div className="flex items-center gap-2 py-2 cursor-pointer mt-3 ml-3 text-gray-500">
          <Settings className="w-5 h-5" />
          <p>Settings</p>
        </div>

        <div className="absolute bottom-0 w-full">
          <div className="w-full h-[1px] bg-gray-600 mt-2"></div>

          <Link href="/ProfilePage">
            <div className="flex items-center justify-between m-3">
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
                  Ah
                </div>

                <div>
                  <p className="text-[16px] text-white">Ahmed M.</p>
                  <p className="text-gray-500 text-[14px]">@ahmedm</p>
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
