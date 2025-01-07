import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import './App.css';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import BlogPost from "./pages/BlogPost";
import CategoryPage from "./pages/CategoryPage";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="bg-gray-950 min-h-screen text-white">
        {/* Navbar */}
        <Navbar 
          onMenuClick={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
        />

        {/* Main Layout */}
        <div className="flex">
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          {/* Main Content */}
          <main className="flex-1 ml-0 lg:ml-[280px] min-h-screen pt-16">
            <div className="max-w-[100%] mx-auto p-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/blog/:id" element={<BlogPost />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;