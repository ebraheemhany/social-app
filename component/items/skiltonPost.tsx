export const PostSkeleton = () => {
  return (
    <div className="bg-[#1a1a1a] rounded-xl p-4 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-20"></div>
        </div>
      </div>

      {/* Content */}
      <div className="h-4 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>

      {/* Image */}
      <div className="h-80 bg-gray-700 rounded-lg"></div>

      {/* Actions */}
      <div className="flex gap-6 mt-4">
        <div className="h-4 w-12 bg-gray-700 rounded"></div>
        <div className="h-4 w-12 bg-gray-700 rounded"></div>
        <div className="h-4 w-12 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};
