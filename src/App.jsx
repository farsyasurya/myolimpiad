import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Splash from './pages/Splash';
import Home from './pages/Home';
import WorldMap from './pages/WorldMap';
import Gameplay from './pages/Gameplay';
import Result from './pages/Result';
import Settings from './pages/Settings';
import About from './pages/About';

export default function App() {
  return (
    <Router>
      {/* Outer Desktop Wrapper: Centers mobile portrait frame on wide screens */}
      <div className="h-[100dvh] w-full bg-slate-950 flex items-center justify-center p-0 md:py-4 overflow-hidden">
        {/* Mobile Portrait Frame: max-w-md, 100% height of screen or mobile aspect ratio */}
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

            {/* 6. Settings */}
            <Route path="/settings" element={<Settings />} />

            {/* 7. About */}
            <Route path="/about" element={<About />} />

            {/* Fallback to splash */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
