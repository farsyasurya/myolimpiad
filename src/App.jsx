import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { bgm } from './utils/bgmManager';

// Standard Pages
import Splash from './pages/Splash';
import Home from './pages/Home';
import WorldMap from './pages/WorldMap';
import Gameplay from './pages/Gameplay';
import Result from './pages/Result';
import Settings from './pages/Settings';
import About from './pages/About';
import Leaderboard from './pages/Leaderboard';

// Admin / Event Organizer Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEventManage from './pages/admin/AdminEventManage';

// User / Participant Pages
import UserLogin from './pages/user/UserLogin';
import UserRegister from './pages/user/UserRegister';
import JoinEvent from './pages/user/JoinEvent';

export default function App() {
  useEffect(() => {
    bgm.start();
  }, []);

  return (
    <AuthProvider>
      <Router>
        {/* Outer Desktop Wrapper: Centers mobile portrait frame on wide screens */}
        <div
          onClickCapture={() => {
            if (!bgm.isPlaying && bgm.isSoundEnabled()) {
              bgm.start();
            }
          }}
          className="h-[100dvh] w-full bg-slate-950 flex items-center justify-center p-0 md:py-4 overflow-hidden"
        >
          {/* Mobile Portrait Frame */}
          <div className="w-full max-w-md h-full md:h-[844px] md:max-h-[92vh] bg-slate-900 md:rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden border-0 md:border-4 md:border-slate-800 flex flex-col">
            <Routes>
              {/* 1. Splash Screen */}
              <Route path="/" element={<Splash />} />

              {/* 2. Main Menu */}
              <Route path="/home" element={<Home />} />

              {/* 3. World Map */}
              <Route path="/map" element={<WorldMap />} />

              {/* 4. Gameplay / Quiz */}
              <Route path="/level/:levelId" element={<Gameplay />} />

              {/* 5. Result Screen */}
              <Route path="/result/:levelId" element={<Result />} />

              {/* 6. Settings & About */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/about" element={<About />} />

              {/* 7. Leaderboard */}
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/leaderboard/:eventId" element={<Leaderboard />} />

              {/* 8. Admin / Penyelenggara Flow */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/event/:eventId" element={<AdminEventManage />} />

              {/* 9. User / Peserta Flow */}
              <Route path="/user/login" element={<UserLogin />} />
              <Route path="/user/register" element={<UserRegister />} />
              <Route path="/join" element={<JoinEvent />} />

              {/* Fallback to splash */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}
