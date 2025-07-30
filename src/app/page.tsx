import Image from "next/image";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"> {/* Changed from max-w-7xl to max-w-3xl for consistency */}
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            hello, Matt here<span className="text-blue-500">|</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            your average boba enjoyer from socal trying to document the struggles of
            becoming a software engineer.
          </p>
          <div className="mt-8">
            <a 
              href="#" 
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
            >
              View My Work
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
