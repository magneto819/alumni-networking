import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Calendar,
  MessageCircle,
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Award,
  ChevronRight,
  Check,
  Star,
  Network,
  Briefcase,
  Heart,
  Languages,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const LandingPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showLangMenu && !target.closest('.language-selector')) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLangMenu]);

  const languageOptions = [
    { code: 'zh' as const, name: '中文', flag: '🇨🇳' },
    { code: 'en' as const, name: 'English', flag: '🇺🇸' },
    { code: 'km' as const, name: 'ខ្មែរ', flag: '🇰🇭' }
  ];

  const currentLang = languageOptions.find(l => l.code === language) || languageOptions[0];

  const features = [
    {
      icon: Users,
      titleKey: 'landing.feature1Title',
      descKey: 'landing.feature1Desc',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Calendar,
      titleKey: 'landing.feature2Title',
      descKey: 'landing.feature2Desc',
      gradient: 'from-teal-500 to-cyan-500'
    },
    {
      icon: MessageCircle,
      titleKey: 'landing.feature3Title',
      descKey: 'landing.feature3Desc',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Network,
      titleKey: 'landing.feature4Title',
      descKey: 'landing.feature4Desc',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Briefcase,
      titleKey: 'landing.feature5Title',
      descKey: 'landing.feature5Desc',
      gradient: 'from-sky-500 to-blue-500'
    },
    {
      icon: Shield,
      titleKey: 'landing.feature6Title',
      descKey: 'landing.feature6Desc',
      gradient: 'from-slate-500 to-gray-500'
    }
  ];

  const benefitKeys = [
    'landing.benefit1',
    'landing.benefit2',
    'landing.benefit3'
  ];

  const testimonials = [
    {
      nameKey: 'landing.testimonial1Name',
      titleKey: 'landing.testimonial1Title',
      companyKey: 'landing.testimonial1Company',
      contentKey: 'landing.testimonial1Content',
      avatar: '👨‍💼'
    },
    {
      nameKey: 'landing.testimonial2Name',
      titleKey: 'landing.testimonial2Title',
      companyKey: 'landing.testimonial2Company',
      contentKey: 'landing.testimonial2Content',
      avatar: '👩‍💻'
    },
    {
      nameKey: 'landing.testimonial3Name',
      titleKey: 'landing.testimonial3Title',
      companyKey: 'landing.testimonial3Company',
      contentKey: 'landing.testimonial3Content',
      avatar: '👩‍🎓'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-lg shadow-md' : 'bg-transparent'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {t('landing.universityName')}
                </span>
                <span className="text-xs text-gray-600 font-medium">{t('landing.alumniNetwork')}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="relative language-selector">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Languages className="h-4 w-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">{currentLang.flag} {currentLang.name}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-700 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
                </button>

                {showLangMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                    {languageOptions.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors ${
                          language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/login"
                className="hidden sm:inline-flex px-6 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                {t('landing.hasAccount').split('?')[1] || 'Login'}
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                {t('landing.joinNow').split('，')[0]}
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 opacity-70" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg mb-8">
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {t('landing.connectAlumni')}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              {t('landing.everyMeeting')}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                {' '}{t('landing.encounter')}{' '}
              </span>
              <br />
              {t('landing.fullOf')}
              <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
                {' '}{t('landing.possibility')}
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed">
              {t('landing.subtitle1')}
              <br />
              {t('landing.subtitle2')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group relative inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  {t('landing.joinNow')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300"
              >
                {t('landing.hasAccount')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            <div className="mt-16 flex items-center justify-center space-x-8 text-sm text-gray-600">
              {benefitKeys.slice(0, 3).map((key, index) => (
                <div key={index} className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="font-medium">{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 mb-4">
              <Zap className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-blue-600">{t('landing.coreFeatures')}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('landing.forAlumni')}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"> {t('landing.comprehensivePlatform')}</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              {t('landing.featuresDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t(feature.titleKey)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(feature.descKey)}</p>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {t('landing.dataSpeak')}
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              {t('landing.dataDesc')}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '1,200+', labelKey: 'landing.stat1', icon: Users },
              { value: '850+', labelKey: 'landing.stat2', icon: TrendingUp },
              { value: '120+', labelKey: 'landing.stat3', icon: Calendar },
              { value: '300+', labelKey: 'landing.stat4', icon: Award }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-lg text-blue-100 font-medium">{t(stat.labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-rose-50 mb-4">
              <Heart className="h-4 w-4 text-rose-600 mr-2" />
              <span className="text-sm font-semibold text-rose-600">{t('landing.testimonialTitle')}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('landing.testimonialSubtitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold text-gray-900">{t(testimonial.nameKey)}</div>
                    <div className="text-sm text-gray-600">{t(testimonial.titleKey)}</div>
                    <div className="text-sm text-blue-600 font-medium">{t(testimonial.companyKey)}</div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed italic">"{t(testimonial.contentKey)}"</p>
                <div className="flex mt-6 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {t('landing.ctaTitle')}
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              {t('landing.ctaSubtitle')}
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-10 py-4 rounded-xl bg-white text-blue-600 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              {t('landing.ctaButton')}
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-blue-100">
              {benefitKeys.slice(0, 3).map((key, index) => (
                <div key={index} className="flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  <span>{t(key)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-bold">{t('landing.universityName')}{t('landing.alumniNetwork')}</div>
                <div className="text-sm text-gray-400">{t('landing.footerTagline')}</div>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {t('landing.footerCopyright')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
