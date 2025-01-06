import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

export default function CategoryPage() {
    const { categoryName } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(
                    collection(db, 'posts'),
                    where('category', '==', categoryName),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPosts(postsData);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [categoryName]);

    if (loading) return <div className="text-center">Yükleniyor...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                {categoryName} Yazıları
            </h1>

            {posts.length === 0 ? (
                <div className="text-center text-gray-400">
                    Bu kategoride henüz yazı bulunmuyor.
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map(post => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Link
                                to={`/blog/${post.id}`}
                                className="block p-6 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all duration-300"
                            >
                                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                                <div className="text-sm text-gray-400 mb-4">
                                    {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                                </div>
                                <div className="text-gray-300 text-sm line-clamp-3">
                                    <ReactMarkdown>
                                        {post.blocks?.[0]?.content || ''}
                                    </ReactMarkdown>
                                </div>
                                <div className="mt-4 text-blue-400 text-sm">
                                    Devamını Oku →
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
} 