import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AlumniDirectoryPage } from './pages/AlumniDirectoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { EventsPage } from './pages/EventsPage';
import { NewsPage } from './pages/NewsPage';
import { TestPage } from './pages/TestPage';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">加载中...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/app" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardPage />} />
                <Route path="alumni" element={<AlumniDirectoryPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="news" element={<NewsPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;