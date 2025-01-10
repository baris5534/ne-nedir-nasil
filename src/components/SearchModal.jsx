import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SearchAutocomplete from './SearchAutocomplete';

export default function SearchModal({ isOpen, onClose, posts }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(true);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      onClose();
    }
  };

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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 z-50"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Yazılarda ara..."
                autoFocus
                className="w-full px-4 py-3 bg-gray-800/95 border border-blue-500/30 rounded-lg 
                         focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                         text-blue-100 placeholder-blue-400/50 transition-all duration-300
                         shadow-lg shadow-blue-500/20"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-400/60 
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