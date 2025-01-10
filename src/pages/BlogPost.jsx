import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import PostModal from '../components/PostModal';
import { Helmet } from 'react-helmet-async';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Yazı bulunamadı');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Yazı yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center p-4">Yükleniyor...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!post) return <div className="text-center p-4">Yazı bulunamadı</div>;

  return (
    <>
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
    </>
  );
} 