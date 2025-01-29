import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import SearchAutocomplete from './SearchAutocomplete';

export default function Navbar({ onMenuClick }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'posts'));
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPosts(postsData);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsSearchFocused(false);
            setShowMobileSearch(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setIsSearchFocused(true);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-blue-500/20 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Sol Kısım: Menü Butonu ve Logo */}
                    <div className="flex items-center gap-4">
                        {/* Mobil Menü Butonu */}
                        <button
                            onClick={onMenuClick}
                            className="lg:hidden p-2 text-blue-400 hover:text-blue-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        
                        {/* Logo - Mobilde ve Normal Ekranda */}
                        <div className="hidden lg:block lg:ml-[280px]"> {/* Büyük ekranda sidebar genişliği kadar margin */}
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">N</span>
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                                    NE?
                                </span>
                            </Link>
                        </div>

                        {/* Mobil Logo */}
                        <div className="lg:hidden">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold">N</span>
                                </div>
                                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                                    NE?
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Masaüstü Arama */}
                    <div className="hidden md:block flex-1 max-w-xl mx-8">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setIsSearchFocused(true)}
                                placeholder="Yazılarda ara..."
                                className="w-full px-4 py-2 bg-gray-800/50 border border-blue-500/20 rounded-lg 
                                         focus:outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20
                                         text-blue-100 placeholder-blue-400/50 transition-all duration-300"
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-400/60 hover:text-blue-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            <SearchAutocomplete
                                searchQuery={searchQuery}
                                posts={posts}
                                isSearchFocused={isSearchFocused}
                                setIsSearchFocused={setIsSearchFocused}
                                onSelect={(postId) => {
                                    setSearchQuery('');
                                    setIsSearchFocused(false);
                                    navigate(`/blog/${postId}`);
                                }}
                            />
                        </form>
                    </div>

                    {/* Mobil Arama Butonu */}
                    <button
                        onClick={() => setShowMobileSearch(!showMobileSearch)}
                        className="md:hidden p-2 text-blue-400 hover:text-blue-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </div>

                {/* Mobil Arama Alanı */}
                <AnimatePresence>
                    {showMobileSearch && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden overflow-hidden border-t border-blue-500/20"
                        >
                            <div className="relative">
                                <form onSubmit={handleSearch} className="relative p-4">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => setIsSearchFocused(true)}
                                        placeholder="Yazılarda ara..."
                                        className="w-full px-4 py-2 bg-gray-800/50 border border-blue-500/20 rounded-lg 
                                                 focus:outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20
                                                 text-blue-100 placeholder-blue-400/50"
                                        autoFocus
                                    />
                                    <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-blue-400/60 hover:text-blue-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </button>
                                </form>
                                <SearchAutocomplete
                                    searchQuery={searchQuery}
                                    posts={posts}
                                    isSearchFocused={isSearchFocused}
                                    setIsSearchFocused={setIsSearchFocused}
                                    onSelect={(postId) => {
                                        setSearchQuery('');
                                        setIsSearchFocused(false);
                                        setShowMobileSearch(false);
                                        navigate(`/blog/${postId}`);
                                    }}
                                    isMobile={true}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
} 