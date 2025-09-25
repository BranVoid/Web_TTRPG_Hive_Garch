import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/skill-tree-static">Skill Tree (Estático)</Link>
      <Link to="/skill-tree-builder">Skill Tree (Constructor)</Link>
    </nav>
  );
}
