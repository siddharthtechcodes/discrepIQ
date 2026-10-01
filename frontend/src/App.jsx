import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import InspectorPage from './pages/InspectorPage';
import AuthPage from './pages/AuthPage';
import RobotAssistant from './components/RobotAssistant';
import { AuthProvider } from './context/AuthContext';
import { DocumentProvider } from './context/DocumentContext';

export default function App() {
  return (
    <AuthProvider>
      <DocumentProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-slate-800 selection:text-white">
            
            {/* Global Sticky Navbar */}
            <Navbar />

            {/* Dynamic Routed Pages */}
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/inspect/:id" element={<InspectorPage />} />
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
