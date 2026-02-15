import React from 'react';
import { Link } from 'react-router-dom';

export const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          测试页面正常工作！
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          如果你能看到这个页面，说明应用正在运行
        </p>
        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            访问首页
          </Link>
          <Link
            to="/login"
            className="block w-full py-3 px-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            访问登录页
          </Link>
        </div>
      </div>
    </div>
  );
};
