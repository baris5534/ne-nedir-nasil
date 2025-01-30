import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchAutocomplete from './SearchAutocomplete';

const SearchResultSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex items-start space-x-3 p-3">
        <div className="h-6 w-6 bg-blue-400/20 rounded mt-1" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-blue-400/20 rounded w-3/4" />
          <div className="space-y-1">
            <div className="h-4 bg-blue-400/20 rounded w-full" />
            <div className="h-4 bg-blue-400/20 rounded w-5/6" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function SearchModal({ isOpen, onClose, posts }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(true);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      onClose();
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 h-screen backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 z-50 h-full"
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="sticky h-96 top-0 bg-gray-90 p-4 border-b border-blue-500/20">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Yazılarda ara..."
                  autoFocus
                  className="w-full absolute pl-4 pr-12 py-3 bg-gray-800/95 border border-blue-500/30 rounded-lg 
                           focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                           text-blue-100 placeholder-blue-400/50 transition-all duration-300
                           shadow-lg shadow-blue-500/20"
                />
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 py-2 px-6 text-blue-400/60 
                         hover:text-blue-400 transition-colors duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <SearchAutocomplete
                searchQuery={searchQuery}
                posts={posts}
                onSelect={() => {
                  setSearchQuery('');
                  onClose();
                }}
                isSearchFocused={isSearchFocused}
                setIsSearchFocused={setIsSearchFocused}
              />
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 