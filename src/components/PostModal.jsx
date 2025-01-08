import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import CodeScreen from './Codescreen';

export default function PostModal({ post, isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              onClose();
              navigate(-1);
            }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="fixed inset-4 top-20 z-50 overflow-y-auto rounded-xl bg-gray-900/95 border border-blue-500/50"
            style={{
              boxShadow: `
                0 0 100px -30px rgba(59, 130, 246, 0.7),
                0 0 50px -20px rgba(59, 130, 246, 0.5),
                inset 0 0 50px -20px rgba(59, 130, 246, 0.5)
              `
            }}
          >
            {/* Top Gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/20 to-transparent pointer-events-none"></div>

            {/* Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none"></div>

            {/* Side Gradients */}
            <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-blue-500/20 to-transparent pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-blue-500/20 to-transparent pointer-events-none"></div>

            {/* Pulsing Border Effect */}
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <div 
                className="absolute inset-0 opacity-50"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
                  transform: 'translateX(-100%)',
                  animation: 'shimmer 3s infinite'
                }}
              ></div>
            </div>

            {/* Content Container */}
            <div className="relative p-6 max-w-4xl mx-auto">
              {/* Title */}
              <h1 
                className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400"
                style={{
                  textShadow: `
                    0 0 20px rgba(59, 130, 246, 0.8),
                    0 0 40px rgba(59, 130, 246, 0.6),
                    0 0 60px rgba(59, 130, 246, 0.4)
                  `
                }}
              >
                {post.title}
              </h1>

              {/* Meta Info */}
              <div 
                className="text-sm text-blue-400 mb-6"
                style={{ textShadow: '0 0 20px rgba(59, 130, 246, 0.6)' }}
              >
                {post.category && (
                  <>
                    Kategori: {post.category}
                    <span className="mx-2">•</span>
                  </>
                )}
                {post.createdAt && (
                  <>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</>
                )}
              </div>

              {/* Content */}
              <div className="space-y-6">
                {post.blocks?.map((block, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative"
                  >
                    {block.type === 'text' ? (
                      <div 
                        className="prose prose-invert max-w-none prose-p:text-blue-100/90 prose-headings:text-blue-200"
                        style={{
                          textShadow: '0 0 30px rgba(59, 130, 246, 0.3)'
                        }}
                      >
                        <ReactMarkdown>{block.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div 
                        className="rounded-lg overflow-hidden relative group"
                        style={{
                          boxShadow: `
                            0 0 30px -10px rgba(59, 130, 246, 0.5),
                            inset 0 0 20px -10px rgba(59, 130, 246, 0.3)
                          `
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CodeScreen code={block.code} title={block.codeTitle} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  onClose();
                  navigate(-1);
                }}
                className="fixed top-4 right-4 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700/80 transition-all duration-300 group"
                style={{
                  boxShadow: '0 0 30px -10px rgba(59, 130, 246, 0.6)'
                }}
              >
                <div className="absolute inset-0 rounded-full bg-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                <svg 
                  className="w-6 h-6 text-blue-400 relative z-10" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 