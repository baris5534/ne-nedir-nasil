import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

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

    if (!isSearchFocused || filteredPosts.length === 0) return null;

    return (
        <>
            {/* Blur Overlay */}
            <div 
                className="fixed h-screen inset-0 bg-black/30 backdrop-blur-sm z-[45]"
                onClick={() => setIsSearchFocused(false)}
            />

            {/* Results */}
            <motion.div
                ref={wrapperRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`${isMobile 
                    ? 'fixed left-4 right-4 top-36' 
                    : 'absolute left-0 right-0 top-full mt-2'} 
                    bg-gray-800/90 backdrop-blur-sm border border-blue-500/20 
                    rounded-lg shadow-lg overflow-y-auto z-[70] max-h-[1000px]`}
            >
                <div className="py-2">
                    {filteredPosts.map(post => (
                        <button
                            key={post.id}
                            onClick={() => onSelect(post.id)}
                            className="w-full text-left px-4 py-3 hover:bg-blue-500/10 transition-colors
                                     border-b border-blue-500/10 last:border-b-0"
                        >
                            <div className="font-medium text-blue-100 line-clamp-1">{post.title}</div>
                            {post.categories?.length > 0 && (
                                <div className="text-sm text-blue-400/80 mt-1">
                                    {post.categories.join(', ')}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </motion.div>
        </>
    );
}

SearchAutocomplete.propTypes = {
    searchQuery: PropTypes.string.isRequired,
    posts: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    isSearchFocused: PropTypes.bool.isRequired,
    setIsSearchFocused: PropTypes.func.isRequired,
    isMobile: PropTypes.bool
};

SearchAutocomplete.defaultProps = {
    isMobile: false
}; 