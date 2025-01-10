import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase/config';
import ReactMarkdown from 'react-markdown';
import CodeScreen from '../components/Codescreen';
import { Helmet } from 'react-helmet-async';

// Animasyon varyantları
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Kategorileri getir
        const categorySnapshot = await getDocs(collection(db, 'categories'));
        const categoryData = categorySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoryData);

        // Yazıları getir
        const postSnapshot = await getDocs(
          query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
        );
        const postData = postSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          categories: doc.data().categories || [] // Kategorileri diziye çevir
        }));
        setPosts(postData);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Yazıları kategorilere göre grupla ve boş kategorileri filtrele
  const postsByCategory = categories.reduce((acc, category) => {
    const categoryPosts = posts.filter(post => 
      post.categories?.includes(category.name)
    );
    
    // Sadece yazı olan kategorileri ekle
    if (categoryPosts.length > 0) {
      acc[category.name] = categoryPosts;
    }
    return acc;
  }, {});

  // Yazı olan kategorileri bul
  const activeCategories = categories.filter(category => 
    postsByCategory[category.name]?.length > 0
  );

  if (loading) return <div className="text-center p-4">Yükleniyor...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Hata: {error}</div>;

  return (
    <>
      <Helmet>
        <title>Next.js Blog - Modern Web Teknolojileri</title>
        <meta 
          name="description" 
          content="React, Next.js ve modern web teknolojileri hakkında güncel bilgiler, öğreticiler ve kod örnekleri." 
        />
        <meta 
          name="keywords" 
          content="react, nextjs, javascript, typescript, web development, frontend, backend, fullstack" 
        />
      </Helmet>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-900"
      >
        <div className="max-w-[1200px] mx-auto p-4 pt-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-16"
          >
            {selectedCategory === 'all' ? (
              // Sadece yazı olan kategorileri göster
              activeCategories.map(category => (
                <div key={category.id}>
                  <h2 className="text-xl font-bold mb-4">
                    {category.name}
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    {postsByCategory[category.name]?.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Seçili kategoriyi göster
              postsByCategory[selectedCategory] && (
                <motion.div variants={itemVariants}>
                  <h2 className="text-3xl font-bold mb-8 pb-2 text-white"
                      style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)' }}>
                    {selectedCategory}
                  </h2>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {postsByCategory[selectedCategory].map(post => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </motion.div>
              )
            )}
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

function PostCard({ post }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <motion.div 
        variants={itemVariants}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.02 }}
        className="relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-20 group-hover:opacity-50 transition-opacity duration-500 blur"></div>
        <div className="relative block rounded-xl overflow-hidden cursor-pointer">
          <article className="p-6 h-[320px] bg-gray-800/80 backdrop-blur-sm border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300 flex flex-col shadow-[0_0_30px_-15px] shadow-blue-500/20 group-hover:shadow-[0_0_30px_-10px] group-hover:shadow-blue-500/40">
            <h3 className="text-xl font-bold line-clamp-1 text-white mb-3"
                style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.3)' }}>
              {post?.title || 'Untitled Post'}
            </h3>

            <div className="text-sm text-blue-300 mb-2">
              {post?.createdAt ? new Date(post.createdAt).toLocaleDateString('tr-TR') : '-'}
            </div>
            
            <div className="prose prose-sm prose-invert max-w-none flex-1 overflow-hidden">
              <div className="line-clamp-3 text-sm text-blue-100/80">
                {post.blocks?.[0]?.content?.substring(0, 150) || ''}...
              </div>
            </div>

            {post.blocks?.[0]?.type === 'code' && (
              <div className="text-xs text-blue-400 flex items-center mt-auto mb-2"
                   style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.3)' }}>
                <span className="mr-2">⌨️</span>
                <span>Kod içerir</span>
              </div>
            )}

            <div className="text-sm text-blue-400 font-medium group-hover:text-blue-300 transition-colors"
                 style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.3)' }}>
              Devamını Oku →
            </div>
          </article>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: 100 }}
              transition={{ type: "spring", duration: 0.5 }}
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
                  onClick={() => setIsOpen(false)}
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
    </>
  );
}