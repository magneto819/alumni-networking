import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  User,
  Calendar,
  Newspaper,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();

  const navigation = [
    { name: t('nav.dashboard'), href: '/app', icon: Home },
    { name: t('nav.alumni'), href: '/app/alumni', icon: Users },
    { name: t('nav.profile'), href: '/app/profile', icon: User },
    { name: t('nav.events'), href: '/app/events', icon: Calendar },
    { name: t('nav.news'), href: '/app/news', icon: Newspaper },
  ];

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex items-center flex-shrink-0 px-4">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">{t('nav.brandName')}</span>
          </div>
          <nav className="mt-8 flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/app'}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-5 w-5"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};