export default function Loading() {
  return (
    <article className="max-w-4xl mx-auto px-6 py-12 animate-pulse">
      
      {/* Header Skeleton */}
      <header className="mb-10">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-6"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-full mb-3"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-6"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-full mb-3"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-5/6 mb-6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-40"></div>
      </header>

      {/* Main Image Skeleton */}
      <div className="w-full aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg mb-12 border-b-4 border-gray-300 dark:border-gray-700"></div>

      {/* Article Body Skeleton */}
      <div className="space-y-4 mb-12">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-11/12"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mt-6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5"></div>
      </div>

      {/* Author Box Skeleton */}
      <hr className="my-12 border-gray-200 dark:border-gray-800" />
      <div className="bg-gray-50 dark:bg-[#1a1b23] p-8 rounded-xl border-l-4 border-gray-300 dark:border-gray-700">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24 mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
      </div>

    </article>
  );
}