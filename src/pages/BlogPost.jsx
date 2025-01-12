import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import PostModal from '../components/PostModal';
import { Helmet } from 'react-helmet-async';
import { CATEGORY_ICONS } from '../utils/categoryIcons.jsx';


export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Modal kapatma ve navigasyon
  const handleClose = () => {
    setIsModalOpen(false);
    // Eğer state'de from varsa oraya dön, yoksa ana sayfaya git
    if (location.state?.from) {
      navigate(location.state.from, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  // Post ve ilgili kategorideki diğer postları getir
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setIsModalOpen(true); // Her yeni post için modalı aç
        
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

  if (loading) {
    return <div className="animate-pulse">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!post) {
    return <div>Yazı bulunamadı</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.blocks?.[0]?.content?.slice(0, 160)} />
      </Helmet>

      {/* Normal görünüm */}
      <div className={`transition-opacity duration-300 ${isModalOpen ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        
        {/* Meta bilgileri */}
        <div className="mb-4 text-blue-400">
          {post.categories?.map((category, index) => (
            <span key={category}>
              {category}
              {index < post.categories.length - 1 && ' • '}
            </span>
            
            
          ))}
          {post.createdAt && (
            <>
              <span className="mx-2">•</span>
              {new Date(post.createdAt).toLocaleDateString('tr-TR')}
            </>
          )}
        </div>

        {/* İçerik */}
        <div className="prose prose-invert max-w-none">
          {post.blocks?.map((block, index) => (
            <div key={index} className="mb-6">
              {block.type === 'text' && block.content}
              {block.type === 'code' && (
                <pre className="bg-gray-800 p-4 rounded-lg">
                  <code>{block.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <PostModal
        post={post}
        isOpen={isModalOpen}
        onClose={handleClose}
        categoryPosts={categoryPosts}
      />
    </div>
  );
} 