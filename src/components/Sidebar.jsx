import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORY_ICONS } from '../utils/categoryIcons.jsx';


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
                    ...doc.data(),
                    categories: doc.data().categories || []
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

    const postsByCategory = categories.reduce((acc, category) => {
        const categoryPosts = posts.filter(post => 
            post.categories?.includes(category.name)
        );
        if (categoryPosts.length > 0) {
            acc[category.name] = categoryPosts;
        }
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
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div 
                className={`fixed left-0 h-[calc(120%-4rem)] w-[280px] bg-gray-900/95 border-r border-blue-500/20 
                    transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto
                    lg:translate-x-0 lg:z-30 lg:fixed shadow-[5px_0_30px_-15px] shadow-blue-500/20
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="h-full">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent animate-neon-glow">
                                Blog
                            </h1>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-blue-500/10 rounded-lg lg:hidden relative group"
                            >
                                <div className="absolute inset-0 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                                <svg className="w-6 h-6 text-blue-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="space-y-8">
                            {/* Ana Menü */}
                            <div>
                                <h2 className="text-xs uppercase text-blue-400/80 font-medium mb-4 animate-neon-glow">
                                    Menü
                                </h2>
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            to="/"
                                            className="flex items-center px-3 py-2 rounded-lg transition-all duration-300 relative group hover:bg-blue-500/10"
                                            onClick={onClose}
                                        >
                                            <span className="text-blue-100/80 group-hover:text-blue-400 transition-colors">
                                                Ana Sayfa
                                            </span>
                                            <div className="absolute inset-0 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                                        </Link>
                                    </li>
                                    {/* Admin linki için koşullu render */}
                                    {sessionStorage.getItem('isAdminAuthenticated') === 'true' && (
                                        <li>
                                            <Link
                                                to="/admin"
                                                className="flex items-center px-3 py-2 rounded-lg transition-all duration-300 relative group hover:bg-blue-500/10"
                                                onClick={onClose}
                                            >
                                                <span className="text-blue-100/80 group-hover:text-blue-400 transition-colors">
                                                    Admin Panel
                                                </span>
                                                <div className="absolute inset-0 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* Kategoriler */}
                            <div>
                                <h2 className="text-xs uppercase text-blue-400/80 font-medium mb-4 animate-neon-glow">
                                    Kategoriler
                                </h2>
                                {loading ? (
                                    <div className="text-sm text-blue-300/50">Yükleniyor...</div>
                                ) : (
                                    <ul className="space-y-1">
                                        {categories.map(category => (
                                            postsByCategory[category.name]?.length > 0 && (
                                                <li key={category.id}>
                                                    <button
                                                        onClick={() => toggleCategory(category.name)}
                                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300 relative group hover:bg-blue-500/10"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                        <span className="w-6 h-6">
                            {CATEGORY_ICONS[category.icon] || CATEGORY_ICONS.default}
                        </span>
                                                            <span className="text-blue-100/80 group-hover:text-blue-400 transition-colors">
                                                                {category.name}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-blue-400/60 group-hover:text-blue-400/80 transition-colors">
                                                            ({postsByCategory[category.name]?.length || 0})
                                                        </span>
                                                        <div className="absolute inset-0 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                                                    </button>

                                                    {openCategories[category.name] && (
                                                        <ul className="ml-4 mt-1 space-y-1">
                                                            {postsByCategory[category.name]?.map(post => (
                                                                <li key={post.id}>
                                                                    <Link
                                                                        to={`/blog/${post.id}`}
                                                                        className="block px-3 py-1 text-sm text-blue-300/60 hover:text-blue-400 transition-colors"
                                                                        onClick={onClose}
                                                                    >
                                                                        {post.title}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </li>
                                            )
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