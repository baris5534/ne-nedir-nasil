import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchAutocomplete({ 
  searchQuery, 
  posts, 
  onSelect,
  isSearchFocused,
  setIsSearchFocused 
}) {
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Dışarı tıklandığında önerileri kapat
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsSearchFocused]);

  useEffect(() => {
    if (searchQuery.trim() && isSearchFocused) {
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter(post => {
        const titleMatch = post.title?.toLowerCase().includes(query);
        const contentMatch = post.blocks?.[0]?.content?.toLowerCase().includes(query);
        const categoryMatch = post.categories?.some(cat => 
          cat.toLowerCase().includes(query)
        );
        return titleMatch || contentMatch || categoryMatch;
      }).slice(0, 5); // Sadece ilk 5 öneriyi göster

      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, posts, isSearchFocused]);

  if (!isSearchFocused || suggestions.length === 0) return null;

  return (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute left-0 right-0 top-full mt-2 bg-gray-800/95 border border-blue-500/20 rounded-lg overflow-hidden backdrop-blur-sm shadow-lg shadow-blue-500/10"
    >
      <div className="max-h-[300px] overflow-y-auto">
        {suggestions.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            onClick={() => {
              onSelect();
              setIsSearchFocused(false);
            }}
            className="block p-3 hover:bg-blue-500/10 transition-colors border-b border-blue-500/10 last:border-0"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-blue-100 truncate">
                  {post.title}
                </h3>
                {post.categories?.length > 0 && (
                  <p className="text-xs text-blue-400/80 mt-0.5">
                    {post.categories.join(', ')}
                  </p>
                )}
                {post.blocks?.[0]?.content && (
                  <p className="text-xs text-blue-300/60 mt-1 line-clamp-1">
                    {post.blocks[0].content}
                  </p>
                )}
              </div>
              <div className="text-blue-400/60">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
} 