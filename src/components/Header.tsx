import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link, NavLink } from 'react-router-dom';
import { LogOut, Bell, Menu, X, GraduationCap, Home, Users, User, Calendar, Newspaper, Globe, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Header: React.FC = () => {
  const { signOut, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAvatar();
    }
  }, [user]);

  const loadAvatar = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user?.id)
        .maybeSingle();

      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error loading avatar:', error);
    }
  };

  const navigation = [
    { name: t('nav.dashboard'), href: '/app', icon: Home },
    { name: t('nav.alumni'), href: '/app/alumni', icon: Users },
    { name: t('nav.events'), href: '/app/events', icon: Calendar },
    { name: t('nav.news'), href: '/app/news', icon: Newspaper },
    { name: t('nav.profile'), href: '/app/profile', icon: User },
  ];

  const languages = [
    { code: 'zh' as const, name: '中文', flag: '🇨🇳' },
    { code: 'en' as const, name: 'English', flag: '🇬🇧' },
    { code: 'km' as const, name: 'ភាសាខ្មែរ', flag: '🇰🇭' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/app" className="flex items-center flex-shrink-0">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {t('nav.brandName')}
                </span>
              </Link>

              <div className="hidden lg:ml-10 lg:flex lg:space-x-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={item.href === '/app'}
                    className={({ isActive }) =>
                      `inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'text-blue-700 bg-blue-50 shadow-sm'
                          : 'text-gray-700 hover:text-blue-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="whitespace-nowrap">{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex lg:items-center lg:space-x-3">
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5" />
              </button>

              <div className="h-6 w-px bg-gray-200" />

              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  <span className="mr-1">{currentLanguage?.flag}</span>
                  <span>{currentLanguage?.name}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>

                {languageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setLanguageMenuOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                            language === lang.code
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="mr-3 text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                          {language === lang.code && (
                            <span className="ml-auto text-blue-700">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="h-6 w-px bg-gray-200" />

              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 leading-tight">{user?.email?.split('@')[0]}</span>
                  <span className="text-xs text-gray-500">{t('profile.online')}</span>
                </div>
                <button
                  onClick={signOut}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('nav.logout')}
                </button>
              </div>
            </div>

            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/app'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-3 text-base font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-blue-700 bg-blue-50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-4 mb-3">
                <div className="text-sm font-medium text-gray-500 mb-2">{t('nav.brandName')}</div>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user?.email}</div>
                    <div className="text-sm text-gray-500">{t('profile.online')}</div>
                  </div>
                </div>
              </div>

              <div className="px-2 space-y-1">
                <div className="px-3 py-2">
                  <div className="text-sm font-medium text-gray-500 mb-2">Language / 语言</div>
                  <div className="space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          language === lang.code
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-3 text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                        {language === lang.code && (
                          <span className="ml-auto text-blue-700">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center w-full px-3 py-3 text-base font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  {t('nav.logout')}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {languageMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setLanguageMenuOpen(false)}
        />
      )}
    </>
  );
};
