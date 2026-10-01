import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import InspectorPage from './pages/InspectorPage';
import AuditHistoryPage from './pages/AuditHistoryPage';
import SupportBotPage from './pages/SupportBotPage';
import AccountPage from './pages/AccountPage';
import AuthPage from './pages/AuthPage';
import RobotAssistant from './components/RobotAssistant';
import { AuthProvider } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';

export default function App() {
  return (
    <AuthProvider>
      <DocumentProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#0b1329] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
            
            {/* Global Sticky Executive Navbar */}
            <Navbar />

            {/* Dynamic Multi-Page Router */}
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/inspect/:id" element={<InspectorPage />} />
                <Route path="/history" element={<AuditHistoryPage />} />
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
  );
}
