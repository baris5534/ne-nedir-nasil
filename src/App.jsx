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
      <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none"></div>
        
        {/* Grid Pattern */}
        <div 
          className="fixed inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59,130,246,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59,130,246,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>

        {/* Content */}
        <div className="relative">
          <Navbar 
            onMenuClick={toggleSidebar} 
            isSidebarOpen={isSidebarOpen}
          />

          <div className="flex">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
      </div>
    </Router>
  );
};

export default App;