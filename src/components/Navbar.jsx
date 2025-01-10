import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import SearchAutocomplete from './SearchAutocomplete';
import SearchModal from './SearchModal';

export default function Navbar({ onMenuClick, isSidebarOpen }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    // Tüm postları getir
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
        }
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-900/95 border-b border-blue-500/20 backdrop-blur-sm z-40">
                <div className="h-full px-4 flex items-center justify-between">
                    {/* Sol Taraf - Menü Butonu ve Logo */}
                    <div className="flex items-center">
                        <button
                            onClick={onMenuClick}
                            className="p-2 hover:bg-blue-500/10 rounded-lg lg:hidden relative group"
                        >
                            <div className="absolute inset-0 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                            <svg className="w-6 h-6 text-blue-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <Link to="/" className="ml-4 text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Blog
                        </Link>
                    </div>

                    {/* Orta - Arama Çubuğu */}
                    <div className="hidden md:block flex-1 max-w-xl mx-8">
                        <form onSubmit={handleSearch} className="relative group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                placeholder="Yazılarda ara..."
                                className="w-full px-4 py-2 bg-gray-800/50 border border-blue-500/20 rounded-lg 
                                         focus:outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20
                                         text-blue-100 placeholder-blue-400/50 transition-all duration-300"
                            />
                            <motion.div
                                initial={false}
                                animate={{
                                    opacity: isSearchFocused ? 1 : 0,
                                    scale: isSearchFocused ? 1 : 0.95
                                }}
                                className="absolute inset-0 -z-10 bg-blue-500/5 rounded-lg blur-sm"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-400/60 
                                         hover:text-blue-400 transition-colors duration-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            <AnimatePresence>
                                <SearchAutocomplete
                                    searchQuery={searchQuery}
                                    posts={posts}
                                    onSelect={() => setSearchQuery('')}
                                    isSearchFocused={isSearchFocused}
                                    setIsSearchFocused={setIsSearchFocused}
                                />
                            </AnimatePresence>
                        </form>
                    </div>

                    {/* Sağ Taraf */}
                    <div className="flex items-center space-x-4">
                        {/* Mobil Arama Butonu */}
                        <button
                            onClick={() => setIsSearchModalOpen(true)}
                            className="md:hidden p-2 hover:bg-blue-500/10 rounded-lg relative group"
                        >
                            <div className="absolute inset-0 bg-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                            <svg className="w-6 h-6 text-blue-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobil Arama Modalı */}
            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                posts={posts}
            />
        </>
    );
} 