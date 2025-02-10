import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import CategoryIcon from './icons/CategoryIcons';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

export default function Sidebar({ isOpen, onClose }) {
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesSnapshot, postsSnapshot] = await Promise.all([
                    getDocs(collection(db, 'categories')),
                    getDocs(collection(db, 'posts'))
                ]);

                const categoriesData = categoriesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCategories(categoriesData);

                const postsData = postsSnapshot.docs.map(doc => ({
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

    // Yazıları kategorilere göre grupla
    const postsByCategory = categories.reduce((acc, category) => {
        acc[category.name] = posts.filter(post => 
            post.categories?.includes(category.name)
        );
        return acc;
    }, {});

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo ve Başlık */}
            <div className="pt-6 px-6 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 
                                  rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-xl font-bold">N</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-blue-100">NE?</h1>
                        <p className="text-sm text-blue-400/80">Blog & Döküman</p>
                    </div>
                </div>
            </div>

            {/* Ana Menü */}
            <div className="px-3 py-2">
                <Link 
                    to="/"
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                              ${location.pathname === '/' 
                                ? 'bg-blue-500/20 text-blue-300' 
                                : 'text-blue-400/80 hover:bg-blue-500/10 hover:text-blue-300'}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Ana Sayfa</span>
                </Link>
            </div>

            {/* Kategoriler */}
            <div className="flex-1 overflow-y-auto px-3 py-2">
                <div className="text-xs font-medium text-blue-400/60 px-3 py-2 uppercase">
                    Kategoriler
                </div>
                {loading ? (
                    <div className="space-y-2 px-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-10 bg-blue-400/10 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-1">
                        {categories.map(category => (
                            <Link
                                key={category.id}
                                to={`/category/${category.name}`}
                                onClick={onClose}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg
                                          group transition-colors
                                          ${location.pathname === `/category/${category.name}`
                                            ? 'bg-blue-500/20 text-blue-300'
                                            : 'text-blue-400/80 hover:bg-blue-500/10 hover:text-blue-300'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <CategoryIcon name={category.name} className="w-5 h-5" />
                                    <span>{category.name}</span>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400/60">
                                    {postsByCategory[category.name]?.length || 0}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Mobil Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Mobil Sidebar */}
            <motion.aside
                initial={{ x: -280 }}
                animate={{ x: isOpen ? 0 : -280 }}
                transition={{ duration: 0.2 }}
                className="fixed top-0 left-0 h-screen w-[280px] bg-gray-900/95 backdrop-blur-md z-50
                          border-r border-blue-500/20 lg:hidden"
            >
                <SidebarContent />
            </motion.aside>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed top-0 left-0 h-screen w-[280px] bg-gray-900/95 
                            backdrop-blur-md z-50 border-r border-blue-500/20">
                <SidebarContent />
            </aside>
        </>
    );
}

Sidebar.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};