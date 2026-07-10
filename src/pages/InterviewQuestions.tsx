import { useState } from "react";
import { PageMeta } from "@/components/common/PageMeta";
import { QuestionCard } from "@/components/generated/QuestionCard";
import { interviewQuestions, questionCategories, difficultyLevels } from "@/data/interviewQuestions";

export default function InterviewQuestions() {
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedDifficulty, setSelectedDifficulty] = useState("全部");

  const filteredQuestions = interviewQuestions.filter((question) => {
    const matchCategory = selectedCategory === "全部" || question.category === selectedCategory;
    const matchDifficulty = selectedDifficulty === "全部" || question.difficulty === selectedDifficulty;
    return matchCategory && matchDifficulty;
  });

  return (
    <>
      <PageMeta
        title="前端面试题 - 前端面试"
        description="精选前端面试题目，涵盖JavaScript、React、CSS等核心技术"
        keywords={["面试题", "前端面试", "JavaScript", "React", "CSS"]}
      />
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">前端面试题</h1>
          <p className="text-gray-600 mb-8">精选高频面试题目，助你备战前端面试</p>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">分类筛选</label>
              <div className="flex flex-wrap gap-2">
                {questionCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">难度筛选</label>
              <div className="flex flex-wrap gap-2">
                {difficultyLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedDifficulty(level.value)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
                      selectedDifficulty === level.value
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                id={question.id}
                title={question.title}
                category={question.category}
                difficulty={question.difficulty}
                tags={question.tags}
                date={question.date}
              />
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg">
              暂无符合条件的面试题
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            共 {filteredQuestions.length} 道题目
          </div>
        </div>
      </div>
    </>
  );
}
