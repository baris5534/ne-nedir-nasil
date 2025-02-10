import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import CodePreview from '../components/CodePreview';
import CodeExample from '../components/CodeExample';
import CategoryIcon from '../components/icons/CategoryIcons';

export default function BlogPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [codeExamples, setCodeExamples] = useState([]);

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

  // Kod örneklerini yükle
  useEffect(() => {
    const fetchCodeExamples = async () => {
      if (post?.codeExampleIds?.length) {
        try {
          const examples = await Promise.all(
            post.codeExampleIds.map(async (id) => {
              const docRef = doc(db, 'codeExamples', id);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
              }
              return null;
            })
          );
          setCodeExamples(examples.filter(Boolean));
        } catch (error) {
          console.error('Kod örnekleri yüklenirken hata:', error);
        }
      }
    };

    fetchCodeExamples();
  }, [post]);

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

  // Post içeriğini render et
  const renderContent = (block, index) => {
    switch (block.type) {
      case 'text':
        return (
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{block.content}</ReactMarkdown>
          </div>
        );
      case 'code':
        return (
          <div className="rounded-lg overflow-hidden bg-gray-900 p-4">
            <pre className="text-sm text-blue-200">
              <code>{block.code}</code>
            </pre>
          </div>
        );
      case 'codeExample':
        // Kod örneği bloğu
        return (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4">
              {block.title && (
                <h3 className="font-medium text-lg mb-2">{block.title}</h3>
              )}
              {block.description && (
                <p className="text-sm text-gray-400">{block.description}</p>
              )}
            </div>
            
            {/* Kod bloğu */}
            <div className="p-4 bg-gray-900">
              {block.files?.map((file, fileIndex) => (
                <div key={fileIndex} className="mb-4">
                  <h4 className="text-sm font-medium mb-2">{file.name}</h4>
                  <pre className="overflow-x-auto">
                    <code className="text-sm text-blue-200">
                      {file.code}
                    </code>
                  </pre>
                </div>
              ))}
            </div>

            {/* StackBlitz önizleme */}
            {block.stackblitzUrl && (
              <div className="p-4 border-t border-gray-700">
                <iframe
                  src={`${block.stackblitzUrl}?embed=1&view=preview&hideNavigation=1`}
                  className="w-full h-[300px] border-0 rounded-lg"
                  title={block.title || 'Preview'}
                  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
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
              {renderContent(block, index)}
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

      <div className="my-8">
        <h2 className="text-xl font-bold mb-4">VSCode İkonu Örneği</h2>
        <CodePreview />
      </div>

      {/* Kod örneklerini göster */}
      {codeExamples.length > 0 && (
        <div className="my-12 space-y-12">
          <h2 className="text-2xl font-bold mb-6">Kod Örnekleri</h2>
          {codeExamples.map((example) => (
            <CodeExample 
              key={example.id} 
              example={example}
            />
          ))}
        </div>
      )}
    </div>
  );
} 