import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SearchAutocomplete({ 
    searchQuery, 
    posts, 
    onSelect,
    isSearchFocused,
    setIsSearchFocused,
    isMobile = false
}) {
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsSearchFocused]);

    const filteredPosts = searchQuery.trim() 
        ? posts.filter(post => {
            const query = searchQuery.toLowerCase();
            return (
                post.title?.toLowerCase().includes(query) ||
                post.blocks?.[0]?.content?.toLowerCase().includes(query) ||
                post.categories?.some(cat => cat.toLowerCase().includes(query))
            );
        }).slice(0, 5)
        : [];

    if (!searchQuery.trim() || !isSearchFocused || filteredPosts.length === 0) return null;

    return (
        <motion.div
            ref={wrapperRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute ${isMobile ? 'left-4 right-4' : 'left-0 right-0'} 
                       top-full mt-2 bg-gray-800 border border-blue-500/20 
                       rounded-lg shadow-lg overflow-hidden z-50`}
        >
            <div className="py-2">
                {filteredPosts.map(post => (
                    <button
                        key={post.id}
                        onClick={() => onSelect(post.id)}
                        className="w-full text-left px-4 py-2 hover:bg-blue-500/10"
                    >
                        <div className="font-medium text-blue-100">{post.title}</div>
                        {post.categories?.length > 0 && (
                            <div className="text-sm text-blue-400/80 mt-1">
                                {post.categories.join(', ')}
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </motion.div>
    );
} 