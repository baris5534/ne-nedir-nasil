import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import ReactMarkdown from 'react-markdown';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
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

  // İlk metin bloğundan özet oluşturma fonksiyonu
  const getPostSummary = (blocks) => {
    const firstTextBlock = blocks.find(block => block.type === 'text');
    if (firstTextBlock) {
      return firstTextBlock.content.substring(0, 150) + '...';
    }
    return 'İçerik yok';
  };

  // Kod bloğu var mı kontrolü
  const hasCodeBlock = (blocks) => {
    return blocks.some(block => block.type === 'code');
  };

  if (loading) return <div>Yazılar yükleniyor...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Blog Yazıları</h1>
      <div className="grid gap-6">
        {posts.map(post => (
          <Link 
            key={post.id} 
            to={`/blog/${post.id}`}
            className="block bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
          >
            <article>
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <div className="text-sm text-gray-400 mb-4">
                Kategori: {post.category}
                <span className="mx-2">•</span>
                {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                {hasCodeBlock(post.blocks) && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-blue-400">Kod içerir</span>
                  </>
                )}
              </div>
              <div className="text-gray-300 prose prose-invert max-w-none">
                <ReactMarkdown>
                  {getPostSummary(post.blocks)}
                </ReactMarkdown>
              </div>
              <div className="mt-4 text-blue-400 hover:text-blue-300">
                Devamını Oku →
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
} 