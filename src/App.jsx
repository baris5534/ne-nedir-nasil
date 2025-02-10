import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import './App.css';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import AdminPanel from "./pages/AdminPanel";
import BlogPost from "./pages/BlogPost";
import CategoryPage from "./pages/CategoryPage";
import { HelmetProvider } from 'react-helmet-async';
import SearchPage from './pages/SearchPage';
import AdminLogin from './pages/AdminLogin';
import AuthGuard from './components/AuthGuard';
import ErrorBoundary from './components/ErrorBoundary';

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-gray-900 text-white">
            <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            
            <div className="flex pt-16">
              <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
              />
              
              <main className="flex-1 lg:ml-[280px] min-h-[calc(100vh-4rem)]">
                <div className="container mx-auto px-4 py-6">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AuthGuard><AdminPanel /></AuthGuard>} />
                    <Route path="/blog/:id" element={<BlogPost />} />
                    <Route path="/category/:categoryName" element={<CategoryPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="*" element={
                      <div className="text-center py-20">
                        <h1 className="text-3xl font-bold text-blue-400 mb-4">Sayfa Bulunamadı</h1>
                        <p className="text-blue-300">Aradığınız sayfa mevcut değil.</p>
                      </div>
                    } />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
};

export default App;