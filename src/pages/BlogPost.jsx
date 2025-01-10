import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/config';
import PostModal from '../components/PostModal';
import { Helmet } from 'react-helmet-async';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Yazı bulunamadı');
        }

        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesData = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error:', error);
        setError('Veri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div className="text-center p-4">Yükleniyor...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!post) return <div className="text-center p-4">Yazı bulunamadı</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      
      <div className="flex items-center space-x-3 mb-6">
        {post.categories?.map(categoryName => {
          const category = categories.find(c => c.name === categoryName);
          return category && (
            <div 
              key={category.name}
              className="flex items-center space-x-2 text-blue-300/80"
            >
              <img src={category.icon} alt={category.name} className="w-6 h-6" />
              <span>{category.name}</span>
            </div>
          );
        })}
      </div>

      <Helmet>
        <title>{post.title} - Next.js Blog</title>
        <meta name="description" content={post.blocks?.[0]?.content?.slice(0, 160)} />
        <meta name="keywords" content={post.categories?.join(', ')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.blocks?.[0]?.content?.slice(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.createdAt} />
        <meta property="article:modified_time" content={post.updatedAt} />
        <meta property="article:section" content={post.categories?.[0]} />
        <meta property="article:tag" content={post.categories?.join(', ')} />
      </Helmet>
      
      <PostModal 
        post={post} 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          navigate(-1);
        }} 
      />
    </div>
  );
} 