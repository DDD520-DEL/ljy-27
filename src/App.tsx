import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MapPage } from '@/pages/MapPage';
import { AddBenchPage } from '@/pages/AddBenchPage';
import { FootprintPage } from '@/pages/FootprintPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ReportAdminPage } from '@/pages/ReportAdminPage';
import { AboutPage } from '@/pages/AboutPage';
import { useThemeStore } from '@/store/useThemeStore';

export default function App() {
  const { theme, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/add" element={<AddBenchPage />} />
        <Route path="/footprint" element={<FootprintPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin/reports" element={<ReportAdminPage />} />
      </Routes>
    </Router>
  );
}
