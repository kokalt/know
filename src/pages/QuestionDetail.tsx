import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { PageMeta } from "@/components/common/PageMeta";
import { interviewQuestions } from "@/data/interviewQuestions";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";

const difficultyColors = {
  "简单": "bg-green-100 text-green-700",
  "中等": "bg-yellow-100 text-yellow-700",
  "困难": "bg-red-100 text-red-700",
};

export default function QuestionDetail() {
  const { id } = useParams<{ id: string }>();
  const [showAnswer, setShowAnswer] = useState(false);

  const question = id ? interviewQuestions.find((q) => q.id === id) : null;

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">题目不存在</h1>
          <Link to="/interview" className="text-blue-600 hover:underline">
            返回面试题列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`${question.title} - 前端面试题`}
        description={question.content.substring(0, 150)}
        keywords={question.tags}
      />
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/interview"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <FaArrowLeft />
            返回面试题列表
          </Link>

          <article className="bg-white rounded-2xl shadow-lg p-8">
            <header className="mb-8 pb-6 border-b">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-blue-600 font-medium">{question.category}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[question.difficulty]}`}>
                  {question.difficulty}
                </span>
                <span className="text-sm text-gray-500">{question.date}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{question.title}</h1>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">题目描述</h2>
              <p className="text-gray-700 leading-relaxed">{question.content}</p>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">参考答案</h2>
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showAnswer ? (
                    <>
                      <FaEyeSlash />
                      隐藏答案
                    </>
                  ) : (
                    <>
                      <FaEye />
                      查看答案
                    </>
                  )}
                </button>
              </div>

              {showAnswer ? (
                <div className="prose prose-lg max-w-none">
                  <div
                    className="bg-gray-50 rounded-lg p-6"
                    dangerouslySetInnerHTML={{ __html: formatAnswer(question.answer) }}
                  />
                </div>
              ) : (
                <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                  点击上方按钮查看参考答案
                </div>
              )}
            </section>
          </article>
        </div>
      </div>
    </>
  );
}

function formatAnswer(content: string): string {
  return content
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${lang || ""}">${escapeHtml(code.trim())}</code></pre>`;
    })
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split("|").filter(Boolean).map((cell) => cell.trim());
      if (cells.every((cell) => /^[-]+$/.test(cell))) {
        return "";
      }
      return `<table class="min-w-full border-collapse border border-gray-300 my-4"><tbody><tr>${cells.map((cell) => `<td class="border border-gray-300 px-4 py-2">${cell}</td>`).join("")}</tr></tbody></table>`;
    })
    .replace(/\n/g, "<br />");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
