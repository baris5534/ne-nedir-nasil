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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="fixed inset-4 top-20 z-50 overflow-y-auto rounded-xl bg-gray-900/95 border border-white/10"
          >
            <div className="p-6 max-w-4xl mx-auto">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                {post.title}
              </h1>

              <div className="text-sm text-gray-400 mb-6">
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

              <div className="space-y-6">
                {post.blocks?.map((block, index) => (
                  <div key={index} className="overflow-x-auto">
                    {block.type === 'text' ? (
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{block.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="rounded-lg overflow-hidden">
                        <CodeScreen code={block.code} title={block.codeTitle} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  onClose();
                  navigate(-1);
                }}
                className="fixed top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 