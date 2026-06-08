// component/items/SearchResults.tsx
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {
  users: any[];
  posts: any[];
  loading: boolean;
  query: string;
  executeSearch: (term: string) => void;
};

const SearchResults = ({
  users,
  posts,
  loading,
  query,
  executeSearch,
}: Props) => {
  const router = useRouter();

  if (!query.trim()) return null;

  if (loading) {
    return (
      <div className="bg-[#1E1E22] border border-gray-700 rounded-xl p-4 mb-5">
        <p className="text-gray-400 text-sm text-center">جاري البحث...</p>
      </div>
    );
  }

  if (!users.length && !posts.length) {
    return (
      <div className="bg-[#1E1E22] border border-gray-700 rounded-xl p-4 mb-5">
        <p className="text-gray-400 text-sm text-center">
          لا توجد نتائج لـ "{query}"
        </p>
      </div>
    );
  }



  return (
    <div className="bg-[#1E1E22] border border-gray-700 rounded-xl p-4 mb-5 flex flex-col gap-4">
      {/* Users */}
      {users.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">أشخاص</p>
          <div className="flex flex-col gap-2">
            {users.map((user) => (
              <div
                onClick={() => {
                  executeSearch(user.username); // 1. حفظ في السجل
                  router.push(`/OuherProfile/${user.id}`); // 2. الانتقال
                }}
                key={user.id}
                className="flex items-center gap-3 cursor-pointer hover:bg-[#2a2a2e] p-2 rounded-lg transition"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                  {user.avatar_url && (
                    <Image
                      src={user.avatar_url}
                      alt={user.username}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="text-white text-sm">@{user.username}</p>
                  {user.bio && (
                    <p className="text-gray-400 text-xs truncate max-w-[200px]">
                      {user.bio}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts */}
      {posts.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">منشورات</p>
          <div className="flex flex-col gap-2">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  // هنا سنحفظ نص البحث الأصلي الذي استخدمه المستخدم للعثور على هذا البوست
                  executeSearch(query);
                  router.push(`/posts/${post.id}`);
                }}
                className="border border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-[#2a2a2e] transition"
              >
                <p className="text-white text-sm">{post.content}</p>
                <div className="flex gap-2 text-xs text-gray-400 mt-1">
                  <span>❤️ {post.likes_count}</span>
                  <span>💬 {post.comments_count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
