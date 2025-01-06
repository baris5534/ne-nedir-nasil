import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import ReactMarkdown from 'react-markdown';
import CodeScreen from '../components/Codescreen';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
      <article className="prose prose-invert prose-sm sm:prose lg:prose-lg mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          {post.title}
        </h1>
        
        <div className="text-sm text-gray-400 mb-8">
          {post.category && (
            <>
              Kategori: {post.category}
              <br />
            </>
          )}
          {post.createdAt && (
            <>Tarih: {new Date(post.createdAt).toLocaleDateString('tr-TR')}</>
          )}
        </div>

        <div className="space-y-6 sm:space-y-8">
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
      </article>
    </div>
  );
} 