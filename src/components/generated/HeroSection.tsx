import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 to-purple-800 text-white py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">前端面试</h1>
        <p className="text-xl md:text-2xl mb-4 text-blue-200">
          技术分享 · 知识沉淀 · 成长记录
        </p>
        <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
          专注前端技术深度分享，记录学习与实践中的思考与总结
        </p>
        <Link
          to="/articles"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          浏览文章
        </Link>
      </div>
    </section>
  );
}
