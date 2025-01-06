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
        <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-900/80 backdrop-blur-md border-b border-white/10 z-40">
            <div className="h-full flex items-center justify-between px-4 lg:px-8 max-w-7xl mx-auto">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                    Ne-Nedir
                </Link>

                {/* Desktop Categories */}
                <div className="hidden lg:flex items-center space-x-6">
                    {categories.map(category => (
                        <Link
                            key={category.id}
                            to={`/category/${category.name.toLowerCase()}`}
                            className="text-sm text-gray-300 hover:text-white transition-colors"
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
                >
                    <svg
                        className="w-6 h-6 text-white"
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
    );
} 