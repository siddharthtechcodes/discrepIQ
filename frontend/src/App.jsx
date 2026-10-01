import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TopUtilityBar from './components/TopUtilityBar';
import Navbar from './components/Navbar';
import LeftSlidebar from './components/LeftSlidebar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import InspectorPage from './pages/InspectorPage';
import AuditHistoryPage from './pages/AuditHistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SupportBotPage from './pages/SupportBotPage';
import AccountPage from './pages/AccountPage';
import AuthPage from './pages/AuthPage';
import RobotAssistant from './components/RobotAssistant';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <DocumentProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
                
                {/* 1. First Bar: Top Utility Bar (Black & White macOS Apple style with Traffic Lights, Language, Contact Us, Support, My Account, Profile Dashboard) */}
                <TopUtilityBar />

                {/* 2. Second Bar: Horizontal Dashboard Navbar (macOS Dock styling with Left Slidebar Toggle, Pills, Dynamic Scroll Logo, Dark/Light Mode Switch) */}
                <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

                {/* 3. Left Slidebar (macOS Finder-style glass slidebar drawer) */}
                <LeftSlidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

                {/* Dynamic Multi-Page Router */}
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/inspect/:id" element={<InspectorPage />} />
                    <Route path="/history" element={<AuditHistoryPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/support" element={<SupportBotPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/login" element={<AuthPage initialMode="login" />} />
                    <Route path="/register" element={<AuthPage initialMode="register" />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>

                {/* Persistent Docked 3D Robot Assistant Guide */}
                <RobotAssistant />

              </div>
            </BrowserRouter>
          </DocumentProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

