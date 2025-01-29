import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CategoryIcon } from '../components/icons/CategoryIcons';
import { motion } from 'framer-motion';

export default function CategoryPage() {
    const { categoryName } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const postsRef = collection(db, 'posts');
                const q = query(postsRef, where('categories', 'array-contains', categoryName));
                const querySnapshot = await getDocs(q);
                
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setPosts(postsData);
            } catch (error) {
                console.error('Error fetching posts:', error);
                setError('Yazılar yüklenirken bir hata oluştu');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [categoryName]);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-blue-400/20 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <Helmet>
                <title>{categoryName} Yazıları</title>
            </Helmet>

            <div className="mb-8 flex items-center gap-3">
                <CategoryIcon name={categoryName} className="w-8 h-8 text-blue-400" />
                <h1 className="text-2xl font-bold text-blue-100">
                    {categoryName} Yazıları
                </h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map(post => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link 
                            to={`/blog/${post.id}`}
                            className="block bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 
                                     border border-blue-500/20 hover:border-blue-500/40 
                                     transition-all duration-300"
                        >
                            <h2 className="text-xl font-bold mb-3 text-blue-100">
                                {post.title}
                            </h2>
                            <p className="text-blue-200/70 text-sm mb-4 line-clamp-3">
                                {post.blocks?.[0]?.content}
                            </p>
                            <div className="text-sm text-blue-400">
                                {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="text-center py-12 text-blue-400">
                    Bu kategoride henüz yazı bulunmuyor.
                </div>
            )}
        </div>
    );
} 