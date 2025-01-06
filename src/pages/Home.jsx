import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import ReactMarkdown from 'react-markdown';
import CodeScreen from '../components/Codescreen';

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
      try {
        // Kategorileri getir
        const categoriesSnapshot = await getDocs(
          query(collection(db, 'categories'), orderBy('createdAt', 'asc'))
        );
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);

        // Yazıları getir
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'asc'));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Yazıları kategorilere göre grupla
  const postsByCategory = posts.reduce((acc, post) => {
    if (!post.category) return acc;
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {});

  const getPostSummary = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return '';
    const firstTextBlock = blocks.find(block => block.type === 'text');
    if (firstTextBlock && firstTextBlock.content) {
      const content = String(firstTextBlock.content);
      return content.length > 150 ? content.substring(0, 150) + '...' : content;
    }
    return '';
  };

  if (loading) return <div className="text-center p-4">Yükleniyor...</div>;
  if (error) return <div className="text-red-500 text-center p-4">Hata: {error}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      <div className="max-w-[1200px] mx-auto p-4 pt-8">
        {/* Kategori filtreleme */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12 flex justify-center flex-wrap gap-3"
        >
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full backdrop-blur-md transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Tüm Yazılar
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-6 py-2 rounded-full backdrop-blur-md transition-all duration-300 ${
                selectedCategory === category.name
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>

        {/* Yazılar */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-16"
        >
          {selectedCategory === 'all' ? (
            // Tüm kategorileri göster
            categories.map(category => (
              <motion.div key={category.id} variants={itemVariants}>
                {postsByCategory[category.name]?.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-8 pb-2 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                      {category.name}
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {postsByCategory[category.name].map(post => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            // Seçili kategoriyi göster
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold mb-8 pb-2 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                {selectedCategory}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {postsByCategory[selectedCategory]?.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Post kartı bileşeni
function PostCard({ post }) {
  return (
    <motion.div variants={itemVariants}>
      <Link 
        to={`/blog/${post.id}`}
        className="block rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300"
      >
        <article className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10">
          <h3 className="text-xl font-bold mb-3 line-clamp-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {post.title}
          </h3>
          <div className="text-sm text-gray-400 mb-4">
            {new Date(post.createdAt).toLocaleDateString('tr-TR')}
          </div>
          <div className="prose prose-sm prose-invert max-w-none mb-4 text-gray-300">
            <ReactMarkdown>{post.blocks?.[0]?.content || ''}</ReactMarkdown>
          </div>
          {post.blocks?.[0]?.type === 'code' && (
            <div className="text-xs text-blue-400 mb-4 flex items-center">
              <span className="mr-2">⌨️</span>
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Kod içerir
              </span>
            </div>
          )}
          <div className="text-sm bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent font-medium">
            Devamını Oku →
          </div>
        </article>
      </Link>
    </motion.div>
  );
}