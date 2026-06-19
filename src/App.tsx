import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MapPage } from "@/pages/MapPage";
import { AddBenchPage } from "@/pages/AddBenchPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/add" element={<AddBenchPage />} />
      </Routes>
    </Router>
  );
}
