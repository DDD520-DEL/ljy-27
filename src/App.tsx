import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MapPage } from "@/pages/MapPage";
import { AddBenchPage } from "@/pages/AddBenchPage";
import { FootprintPage } from "@/pages/FootprintPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ReportAdminPage } from "@/pages/ReportAdminPage";
import { AboutPage } from "@/pages/AboutPage";

export default function App() {
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
