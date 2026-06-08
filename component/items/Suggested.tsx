"use client";

import { useGetSuggestedUsers } from "@/Query/useUsers";
import { SuggestedUserCard } from "./SuggestedUserCard";

export const Suggested = () => {
  const { data, isLoading, error } = useGetSuggestedUsers();

  if (isLoading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error loading users</div>;
  }

  return (
    <div className="bg-[#161618] border border-gray-700 rounded-xl">
      <div className="p-3">
        <p className="text-[13px] text-gray-700">SUGGESTED</p>

        {data?.slice(0, 7).map((user) => (
          <SuggestedUserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};
