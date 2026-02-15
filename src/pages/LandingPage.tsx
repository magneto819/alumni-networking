import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, Calendar, MessageCircle, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">校友网络平台</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                登录
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                注册
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            连接校友
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {' '}共创未来
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            打造专业的校友生态平台，汇聚全球校友资源，共享职业机会，传承校园精神
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            立即加入
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">智能校友目录</h3>
            <p className="text-gray-600">
              按届别、专业、地区、行业智能搜索，精准定位校友资源
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 mb-6">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">活动管理</h3>
            <p className="text-gray-600">
              线上线下活动一站式管理，轻松组织校友聚会与交流
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 mb-6">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">实时互动</h3>
            <p className="text-gray-600">
              动态发布、评论点赞，随时分享校友成就与行业洞察
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 mb-6">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">职业发展</h3>
            <p className="text-gray-600">
              职业机会共享，导师指导，助力校友职业成长
            </p>
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">准备好开启校友之旅了吗？</h2>
          <p className="text-xl text-blue-100 mb-8">
            加入我们，与优秀的校友们建立联系，共同成长，创造更多可能
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:scale-105 transition-transform"
          >
            免费注册，立即开始
            <ArrowRight className="ml-3 h-6 w-6" />
          </Link>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 校友网络平台. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
