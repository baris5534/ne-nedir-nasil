import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      const filtered = posts.filter(post => {
        const titleMatch = post.title?.toLowerCase().includes(query.toLowerCase());
        const contentMatch = post.blocks?.some(block => 
          block.content?.toLowerCase().includes(query.toLowerCase())
        );
        const categoryMatch = post.categories?.some(category =>
          category.toLowerCase().includes(query.toLowerCase())
        );
        
        return titleMatch || contentMatch || categoryMatch;
      });
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts([]);
    }
  }, [query, posts]);

  return (
    <>
      <Helmet>
        <title>Arama: {query} - Next.js Blog</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            {query ? `"${query}" için arama sonuçları` : 'Arama'}
          </h1>

          {loading ? (
            <div className="text-center text-blue-400">Yükleniyor...</div>
          ) : query ? (
            filteredPosts.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {filteredPosts.map(post => (
                  <motion.div
                    key={post.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-gray-800/50 rounded-lg p-6 hover:bg-gray-800/70 transition-colors"
                  >
                    <Link to={`/blog/${post.id}`} className="block">
                      <h2 className="text-xl font-semibold mb-2 text-blue-100">
                        {post.title}
                      </h2>
                      <div className="text-sm text-blue-400 mb-2">
                        {post.categories?.join(', ')}
                      </div>
                      <p className="text-blue-200/80 line-clamp-2">
                        {post.blocks?.[0]?.content}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center text-blue-400">
                "{query}" için sonuç bulunamadı
              </div>
            )
          ) : (
            <div className="text-center text-blue-400">
              Arama yapmak için yukarıdaki arama çubuğunu kullanın
            </div>
          )}
        </div>
      </div>
    </>
  );
} 