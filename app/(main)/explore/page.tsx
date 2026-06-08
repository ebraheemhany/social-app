"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import LeftSection from "@/component/leftSection/leftSection";
import RighteSection from "@/component/righteSection/righteSection";
import ShowSomeUsers from "@/component/items/ShowSomeUsers";
import TreendingPosts from "@/component/items/TreendingPosts";
import { useSearch } from "@/Query/useSearch";
import SearchResults from "@/component/items/SearchResults"; // ✅ أضفنا الاستيراد
import Search_history from "@/component/items/Search_history";

const categories = [
  "كل شيء",
  "تريند",
  "تقنية",
  "رياضة",
  "فن وإبداع",
  "موسيقى",
  "سفر",
  "طعام",
  "أخبار",
];

export default function ExplorePage() {
  const [activeCat, setActiveCat] = useState("كل شيء"); // ✅ مرة واحدة بس
  const [query, setQuery] = useState("");
  const { data, isLoading } = useSearch(query);

  const saveSearchHistory = (term: string) => {
    if (!term.trim() || typeof window === "undefined") return;
    const savedHistory = localStorage.getItem("search_history");
    const history = savedHistory ? JSON.parse(savedHistory) : [];
    const normalized = term.trim();
    const updatedHistory = [
      normalized,
      ...history.filter((item: string) => item !== normalized),
    ].slice(0, 10);
    localStorage.setItem("search_history", JSON.stringify(updatedHistory));
  };

  const executeSearch = (term: string) => {
    if (!term.trim()) return;
    saveSearchHistory(term);
    setQuery(term);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[100%] md:w-[95%] lg:w-[90%] relative bg-black text-white">
        <div className="flex gap-4">
          {/* left section */}
          <div className="hidden md:block md:w-[30%] lg:w-[20%]">
            <div className="fixed top-0 h-screen md:w-[25%] lg:w-[16%]">
              <LeftSection />
            </div>
          </div>

          {/* main section */}
          <div className="w-[100%] md:w-[70%] lg:w-[60%] mt-22 md:mt-10">
            {/* 🔍 Search */}
            <div className="flex items-center gap-3 bg-[#1E1E22] border border-gray-700 rounded-xl px-4 py-2 mb-5">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                placeholder="Search for posts, hashtags, and people..."
                className="bg-transparent outline-none text-sm text-white w-full"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                onClick={() => executeSearch(query)}
                className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs"
              >
                Search
              </button>
            </div>{" "}
            {/* ✅ الـ div بتاع search اتقفل هنا صح */}
            {/* 🔎 Search Results */}
            <SearchResults
              users={data?.users || []}
              posts={data?.posts || []}
              loading={isLoading}
              query={query}
              executeSearch={executeSearch}
            />
            {/* باقي المحتوى بيتخفى لما يكون فيه بحث */}
            {!query.trim() && (
              <>
                {/* 🏷 Categories */}
                <div className="flex gap-2 overflow-x-auto mb-6 custom-scroll">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCat(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition mb-2.5
                        ${
                          activeCat === cat
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-[#1E1E22] text-gray-400 border-gray-600 hover:bg-gray-700"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* search history */}

                <Search_history />

                <ShowSomeUsers />
                <TreendingPosts />
              </>
            )}
          </div>

          {/* right section */}
          <div className="w-[20%] hidden lg:block">
            <div className="fixed top-0 w-[20%]">
              <RighteSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
