import { PageMeta } from "@/components/common/PageMeta";
import { FaEnvelope, FaGithub, FaZhihu, FaWeixin } from "react-icons/fa";

export default function Contact() {
  return (
    <>
      <PageMeta
        title="联系我 - 前端面试"
        description="通过各种渠道与我取得联系"
        keywords={["联系", "联系方式", "合作"]}
      />
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">联系我</h1>
            <p className="text-gray-600 text-center mb-12">
              欢迎通过以下方式与我取得联系，期待与您交流技术心得
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <FaEnvelope size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">邮箱</h3>
                    <p className="text-sm text-gray-600">最快的联系方式</p>
                  </div>
                </div>
                <a
                  href="mailto:example@email.com"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  example@email.com
                </a>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white">
                    <FaGithub size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">GitHub</h3>
                    <p className="text-sm text-gray-600">查看我的开源项目</p>
                  </div>
                </div>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-blue-600 font-medium"
                >
                  github.com/username
                </a>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                    <FaZhihu size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">知乎</h3>
                    <p className="text-sm text-gray-600">关注我的技术分享</p>
                  </div>
                </div>
                <a
                  href="https://zhihu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  知乎主页
                </a>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white">
                    <FaWeixin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">微信</h3>
                    <p className="text-sm text-gray-600">扫码添加好友</p>
                  </div>
                </div>
                <p className="text-gray-700 font-medium">微信号：frontend_dev</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">温馨提示</h3>
              <p className="text-gray-700">
                如果您有技术问题想要交流，建议先查阅我的博客文章，很多问题可能已经在那里得到了解答。对于合作咨询，请通过邮箱联系，我会尽快回复。
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
