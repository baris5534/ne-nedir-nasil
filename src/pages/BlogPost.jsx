import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Helmet } from 'react-helmet-async';
import { CATEGORY_ICONS } from '../utils/categoryIcons.jsx';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Post ve ilgili kategorideki diğer postları getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const postDoc = await getDoc(doc(db, 'posts', id));
        
        if (postDoc.exists()) {
          const postData = { id: postDoc.id, ...postDoc.data() };
          setPost(postData);

          if (postData.categories?.length > 0) {
            const postsSnapshot = await getDocs(collection(db, 'posts'));
            const allPosts = postsSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            
            const relatedPosts = allPosts.filter(p => 
              p.categories?.some(cat => postData.categories.includes(cat))
            );
            setCategoryPosts(relatedPosts);
          }
        } else {
          setError('Yazı bulunamadı');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Yazı yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // id değiştiğinde yeniden yükle

  // Önceki ve sonraki postu bul
  const currentIndex = categoryPosts.findIndex(p => p.id === id);
  const previousPost = currentIndex > 0 ? categoryPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < categoryPosts.length - 1 ? categoryPosts[currentIndex + 1] : null;

  // Geri dönüş fonksiyonu
  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-blue-400/20 rounded-lg w-3/4" />
          <div className="flex space-x-2">
            <div className="h-4 bg-blue-400/20 rounded w-20" />
            <div className="h-4 bg-blue-400/20 rounded w-20" />
            <div className="h-4 bg-blue-400/20 rounded w-32" />
          </div>
          <div className="space-y-4">
            <div className="h-24 bg-blue-400/20 rounded-lg" />
            <div className="h-32 bg-blue-400/20 rounded-lg" />
            <div className="h-48 bg-blue-400/20 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div>Yazı bulunamadı</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.blocks?.[0]?.content?.slice(0, 160)} />
      </Helmet>

      {/* Navigasyon Butonları */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Geri Dön</span>
        </button>

        <div className="flex space-x-4">
          {previousPost && (
            <Link
              to={`/blog/${previousPost.id}`}
              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Önceki Yazı</span>
            </Link>
          )}

          {nextPost && (
            <Link
              to={`/blog/${nextPost.id}`}
              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span className="hidden sm:inline">Sonraki Yazı</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      <article className="bg-gray-800/50 rounded-xl p-6 shadow-lg border border-blue-500/20">
        <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400"
            style={{
              textShadow: '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.6)'
            }}>
          {post.title}
        </h1>
        
        <div className="text-sm text-blue-400 mb-6">
          {post.categories?.map((category, index) => (
            <span key={category}>
              {category}
              {index < post.categories.length - 1 && <span className="mx-2">•</span>}
            </span>
          ))}
          {post.createdAt && (
            <>
              <span className="mx-2">•</span>
              {new Date(post.createdAt).toLocaleDateString('tr-TR')}
            </>
          )}
        </div>

        <div className="space-y-6">
          {post.blocks?.map((block, index) => (
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
                <div className="rounded-lg overflow-hidden bg-gray-900 p-4">
                  <pre className="text-sm text-blue-200">
                    <code>{block.code}</code>
                  </pre>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </article>

      {/* Alt Navigasyon */}
      <div className="mt-8 flex justify-between items-center">
        {previousPost && (
          <Link
            to={`/blog/${previousPost.id}`}
            className="flex-1 p-4 bg-gray-800/50 rounded-lg border border-blue-500/20 hover:bg-gray-800/70 transition-colors mr-4"
          >
            <div className="text-sm text-blue-400">← Önceki Yazı</div>
            <div className="text-lg font-semibold line-clamp-1">{previousPost.title}</div>
          </Link>
        )}

        {nextPost && (
          <Link
            to={`/blog/${nextPost.id}`}
            className="flex-1 p-4 bg-gray-800/50 rounded-lg border border-blue-500/20 hover:bg-gray-800/70 transition-colors text-right"
          >
            <div className="text-sm text-blue-400">Sonraki Yazı →</div>
            <div className="text-lg font-semibold line-clamp-1">{nextPost.title}</div>
          </Link>
        )}
      </div>
    </div>
  );
} 