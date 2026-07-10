import { PageMeta } from "@/components/common/PageMeta";
import { FaGithub, FaZhihu, FaEnvelope } from "react-icons/fa";

const skills = [
  { name: "JavaScript", level: 95 },
  { name: "React", level: 90 },
  { name: "TypeScript", level: 85 },
  { name: "CSS/Tailwind", level: 88 },
  { name: "Node.js", level: 80 },
  { name: "Vue", level: 75 },
];

const experiences = [
  {
    year: "2023 - 至今",
    company: "某互联网公司",
    role: "高级前端工程师",
    description: "负责核心业务系统的前端架构设计与开发，带领团队完成多个重要项目。",
  },
  {
    year: "2020 - 2023",
    company: "某科技公司",
    role: "前端工程师",
    description: "参与电商平台前端开发，优化页面性能，提升用户体验。",
  },
  {
    year: "2018 - 2020",
    company: "某创业公司",
    role: "初级前端工程师",
    description: "负责公司官网和后台管理系统的前端开发工作。",
  },
];

export default function About() {
  return (
    <>
      <PageMeta
        title="关于我 - 前端面试"
        description="了解我的技术背景和工作经历"
        keywords={["关于", "个人介绍", "前端工程师"]}
      />
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="text-center mb-12">
              <img
                src="https://baas-api.wanwang.xin/toc/image/preview/professional-developer-avatar.jpg?w=200&h=200"
                alt="头像"
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
              />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">前端开发者</h1>
              <p className="text-gray-600">热爱技术，专注前端领域</p>
            </div>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">个人简介</h2>
              <p className="text-gray-700 leading-relaxed">
                我是一名拥有多年经验的前端工程师，专注于Web应用开发和用户体验优化。热衷于探索新技术，喜欢通过博客分享学习心得和实践经验。相信持续学习和分享能够帮助自己和他人共同成长。
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">技术栈</h2>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-700">{skill.name}</span>
                      <span className="text-gray-500">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">工作经历</h2>
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="border-l-4 border-blue-600 pl-6">
                    <div className="text-sm text-blue-600 font-medium mb-1">{exp.year}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{exp.role}</h3>
                    <div className="text-gray-600 mb-2">{exp.company}</div>
                    <p className="text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">联系我</h2>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:example@email.com"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FaEnvelope />
                  example@email.com
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FaGithub />
                  GitHub
                </a>
                <a
                  href="https://zhihu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FaZhihu />
                  知乎
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
