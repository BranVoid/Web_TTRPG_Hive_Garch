import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SkillTreeStatic from "./pages/SkillTreeStatic";
import SkillTreeBuilder from "./pages/SkillTreeBuilder";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/skill-tree-static" element={<SkillTreeStatic />} />
        <Route path="/skill-tree-builder" element={<SkillTreeBuilder />} />
      </Routes>
    </Router>
  );
}

export default App;
