import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import CodeScreen from './Codescreen';
import { useEffect, useState } from 'react';

// Skeleton bileşeni
const Skeleton = () => (
  <div className="animate-pulse space-y-6">
    {/* Başlık Skeleton */}
    <div className="h-10 bg-blue-400/20 rounded-lg w-3/4" />
    
    {/* Meta Bilgiler Skeleton */}
    <div className="flex space-x-2">
      <div className="h-4 bg-blue-400/20 rounded w-20" />
      <div className="h-4 bg-blue-400/20 rounded w-20" />
      <div className="h-4 bg-blue-400/20 rounded w-32" />
    </div>
    
    {/* İçerik Blokları Skeleton */}
    <div className="space-y-4">
      <div className="h-24 bg-blue-400/20 rounded-lg" />
      <div className="h-32 bg-blue-400/20 rounded-lg" />
      <div className="h-48 bg-blue-400/20 rounded-lg" />
    </div>
  </div>
);

export default function PostModal({ post, isOpen, onClose, categoryPosts }) {
  const navigate = useNavigate();
  const [currentPost, setCurrentPost] = useState(post);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Post değiştiğinde current post'u güncelle
  useEffect(() => {
    setCurrentPost(post);
  }, [post]);

  // Mevcut postun kategorideki index'ini bul
  const currentIndex = categoryPosts?.findIndex(p => p.id === currentPost.id);
  const previousPost = currentIndex > 0 ? categoryPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < categoryPosts.length - 1 ? categoryPosts[currentIndex + 1] : null;

  // Post değiştirme fonksiyonu
  const changePost = async (newPost) => {
    setIsTransitioning(true);
    setIsLoading(true);
    navigate(`/blog/${newPost.id}`, { replace: true });
    setCurrentPost(newPost);
    setTimeout(() => {
      setIsTransitioning(false);
      setIsLoading(false);
    }, 500);
  };

  // Scroll kontrolü
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
            onClick={() => {
              onClose();
              navigate(-1);
            }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="fixed inset-4 top-20 z-50 p-3 rounded-xl bg-gray-900/95 border border-blue-500/50 flex flex-col"
            style={{
              boxShadow: `
                0 0 100px -30px rgba(59, 130, 246, 0.7),
                0 0 50px -20px rgba(59, 130, 246, 0.5),
                inset 0 0 50px -20px rgba(59, 130, 246, 0.5)
              `
            }}
          >
            {/* Kaydırılabilir İçerik Alanı */}
            <div className="flex-1 overflow-y-auto relative">
              
              

              {/* Efekt Katmanı */}
               <div className="absolute inset-0 pointer-events-none">
                {/* Gradientler  */}
                {/* <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/20 to-transparent" />
                <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-blue-500/20 to-transparent" />
                <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-blue-500/20 to-transparent" /> */}

                 {/* Yanıp Sönen Kenarlık  */}
                {/* <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div 
                    className="absolute inset-0 opacity-50"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
                      transform: 'translateX(-100%)',
                      animation: 'shimmer 3s infinite'
                    }}
                  />
                </div> */}
              </div> 

              {/* Ana İçerik */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPost.id}
                  initial={{ opacity: 0, x: isTransitioning ? 100 : 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isTransitioning ? -100 : 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 500 }}
                  className="relative p-6 max-w-4xl mx-auto"
                >
                  {isLoading ? (
                    <Skeleton />
                  ) : (
                    <>
                      <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400"
                          style={{
                            textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.6)'
                          }}>
                        {currentPost.title}
                      </h1>

                      <div className="text-sm text-blue-400 mb-6">
                        {currentPost.categories?.map((category, index) => (
                          <span key={category}>
                            {category}
                            {index < currentPost.categories.length - 1 && <span className="mx-2">•</span>}
                          </span>
                        ))}
                        {currentPost.createdAt && (
                          <>
                            <span className="mx-2">•</span>
                            {new Date(currentPost.createdAt).toLocaleDateString('tr-TR')}
                          </>
                        )}
                      </div>

                      <div className="space-y-6">
                        {currentPost.blocks?.map((block, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="overflow-x-auto"
                          >
                            {block.type === 'text' ? (
                              <div className="prose prose-invert max-w-none">
                                <ReactMarkdown>{block.content}</ReactMarkdown>
                              </div>
                            ) : (
                              <div className="rounded-lg overflow-hidden">
                                <CodeScreen code={block.code} title={block.codeTitle} />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </motion.div>
              
              </AnimatePresence>
              
              {/* Navigasyon Butonları */}
              <div className="xl:fixed text-ellipsis xl:px-10 xl:left-8 xl:right-8 xl:top-1/2 xl:-translate-y-1/2 flex xl:justify-between justify-around max-lg:pb-16 lg:flex pointer-events-none z-10">
                {previousPost && (
                  <div className="flex items-center space-x-2 pointer-events-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        changePost(previousPost);
                      }}
                      className="p-3 max-lg:max-w-36 w-[200px] max-h-16 text-left rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors group flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5 transform rotate-180 text-blue-400 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <div className="text-sm">
                        <div className="text-blue-400/60 font-medium">Önceki Yazı</div>
                        <div className="text-blue-300 line-clamp-1 max-w-[200px]">{previousPost.title}</div>
                      </div>
                    </button>
                  </div>
                )}
                
                {nextPost && (
                  <div className="flex items-center space-x-2 pointer-events-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        changePost(nextPost);
                      }}
                      className="p-3 max-lg:max-w-36 w-[200px] max-h-16 text-left rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors group flex items-center space-x-2"
                    >
                      <div className="text-sm">
                        <div className="text-blue-400/60 font-medium">Sonraki Yazı</div>
                        <div className="text-blue-300 line-clamp-1 max-w-[200px]">{nextPost.title}</div>
                      </div>
                      <svg className="w-5 h-5 text-blue-400 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Kapatma Butonu */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                onClose();
                navigate(-1);
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors group"
            >
              <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 