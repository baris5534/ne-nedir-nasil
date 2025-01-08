import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Navbar({ onMenuClick, isSidebarOpen }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesSnapshot = await getDocs(
                    query(collection(db, 'categories'), orderBy('createdAt', 'asc'))
                );
                const categoriesData = categoriesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCategories(categoriesData);
            } catch (error) {
                console.error('Kategoriler yüklenirken hata:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-40">
            {/* Neon alt çizgi efekti */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-blue-500/50">
                <div className="absolute inset-0 bg-blue-500 animate-pulse blur-sm"></div>
                <div className="absolute -bottom-1 left-0 right-0 h-4 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
            </div>

            <nav className="h-16 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
                <div className="h-full flex items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto relative">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="text-xl font-bold relative group"
                    >
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent animate-neon-glow">
                            Ne-Nedir
                        </span>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </Link>

                    {/* Desktop Categories */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {categories.map(category => (
                            <Link
                                key={category.id}
                                to={`/category/${category.name.toLowerCase()}`}
                                className="relative group"
                            >
                                <span className="text-sm text-blue-100/80 transition-colors duration-300 group-hover:text-blue-400 animate-neon-glow">
                                    {category.name}
                                </span>
                                {/* Hover efekti */}
                                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 opacity-50 blur transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg transition-all duration-300 relative group lg:hidden"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                        <svg
                            className="w-6 h-6 text-blue-400 relative z-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isSidebarOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>
            </nav>
        </div>
    );
} 