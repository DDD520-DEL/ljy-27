import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MapPage } from "@/pages/MapPage";
import { AddBenchPage } from "@/pages/AddBenchPage";
import { FootprintPage } from "@/pages/FootprintPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/add" element={<AddBenchPage />} />
        <Route path="/footprint" element={<FootprintPage />} />
      </Routes>
    </Router>
  );
}
