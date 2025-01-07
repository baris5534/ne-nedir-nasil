import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isOpen, onClose }) {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCategories, setOpenCategories] = useState({});
    const location = useLocation();

    useEffect(() => {
        if (isOpen) onClose();
    }, [location.pathname]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesSnapshot = await getDocs(
                    query(collection(db, 'categories'), orderBy('createdAt', 'asc'))
                );
                const categoriesData = categoriesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCategories(categoriesData);

                const q = query(collection(db, 'posts'), orderBy('createdAt', 'asc'));
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPosts(postsData);
            } catch (error) {
                console.error('Veri yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const postsByCategory = posts.reduce((acc, post) => {
        if (!post.category) return acc;
        if (!acc[post.category]) acc[post.category] = [];
        acc[post.category].push(post);
        return acc;
    }, {});

    const toggleCategory = (category) => {
        setOpenCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    return (
        <>
            {/* Mobil Overlay */}
            <div 
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div 
                className={`fixed top-20 left-0 h-[calc(100vh-4rem)] w-[280px] bg-gray-900 border-r border-white/10 
                    transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto
                    lg:translate-x-0 lg:z-30 lg:fixed
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="h-full">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                                Blog
                            </h1>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg lg:hidden"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-8">
                            {/* Ana Menü */}
                            <div>
                                <h2 className="text-xs uppercase text-gray-400 font-medium mb-4">
                                    Menü
                                </h2>
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            to="/"
                                            className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                            onClick={onClose}
                                        >
                                            Ana Sayfa
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/admin"
                                            className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                            onClick={onClose}
                                        >
                                            Admin Panel
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Kategoriler */}
                            <div>
                                <h2 className="text-xs uppercase text-gray-400 font-medium mb-4">
                                    Kategoriler
                                </h2>
                                {loading ? (
                                    <div className="text-sm text-gray-500">Yükleniyor...</div>
                                ) : (
                                    <ul className="space-y-1">
                                        {categories.map(category => (
                                            <li key={category.id}>
                                                <button
                                                    onClick={() => toggleCategory(category.name)}
                                                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                                                >
                                                    <span>{category.name}</span>
                                                    <span className="text-xs text-gray-400">
                                                        ({postsByCategory[category.name]?.length || 0})
                                                    </span>
                                                </button>

                                                {openCategories[category.name] && (
                                                    <ul className="ml-4 mt-1 space-y-1">
                                                        {postsByCategory[category.name]?.map(post => (
                                                            <li key={post.id}>
                                                                <Link
                                                                    to={`/blog/${post.id}`}
                                                                    className="block px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                                                                    onClick={onClose}
                                                                >
                                                                    {post.title}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}