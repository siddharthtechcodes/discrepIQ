import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LeftSlidebar from './components/LeftSlidebar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import InspectorPage from './pages/InspectorPage';
import AuditHistoryPage from './pages/AuditHistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SupportBotPage from './pages/SupportBotPage';
import AccountPage from './pages/AccountPage';
import AuthPage from './pages/AuthPage';
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
              <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-zinc-900 selection:text-white">
                
                {/* Top Navbar */}
                <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

                {/* Left Slide-over Navigation */}
                <LeftSlidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

                {/* Page Router */}
                <div className="flex-1">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<AuthPage initialMode="login" />} />
                    <Route path="/register" element={<AuthPage initialMode="register" />} />

                    {/* Protected routes — user must be signed in */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute><DashboardPage /></ProtectedRoute>
                    } />
                    <Route path="/inspect/:id" element={
                      <ProtectedRoute><InspectorPage /></ProtectedRoute>
                    } />
                    <Route path="/history" element={
                      <ProtectedRoute><AuditHistoryPage /></ProtectedRoute>
                    } />
                    <Route path="/analytics" element={
                      <ProtectedRoute><AnalyticsPage /></ProtectedRoute>
                    } />
                    <Route path="/support" element={
                      <ProtectedRoute><SupportBotPage /></ProtectedRoute>
                    } />
                    <Route path="/account" element={
                      <ProtectedRoute><AccountPage /></ProtectedRoute>
                    } />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>

              </div>
            </BrowserRouter>
          </DocumentProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
