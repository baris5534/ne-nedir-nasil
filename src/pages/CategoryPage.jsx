import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { CategoryIcon } from '../components/icons/CategoryIcons';

const CategoryPageSkeleton = () => (
  <div className="animate-pulse max-w-4xl mx-auto p-4">
    {/* Başlık Skeleton */}
    <div className="h-12 bg-blue-400/20 rounded-lg w-1/2 mb-8" />
    
    {/* İçerik Grid */}
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="relative">
          <div className="absolute -inset-0.5 bg-blue-500/20 rounded-xl blur"></div>
          <div className="relative p-6 bg-gray-800/80 rounded-xl border border-blue-500/20">
            <div className="h-7 bg-blue-400/20 rounded-lg w-3/4 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-blue-400/20 rounded w-full" />
              <div className="h-4 bg-blue-400/20 rounded w-5/6" />
              <div className="h-4 bg-blue-400/20 rounded w-4/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function CategoryPage() {
    const { categoryName } = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(
                    collection(db, 'posts'),
                    where('categories', 'array-contains', categoryName),
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'categories'));
                const categoriesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log('CategoryPage - Categories:', categoriesData);
                setCategories(categoriesData);
                
                // Mevcut kategoriyi bul
                const current = categoriesData.find(cat => cat.name === categoryName);
                console.log('Current Category:', current);
                setCurrentCategory(current);
            } catch (error) {
                console.error('Kategoriler yüklenirken hata:', error);
            }
        };

        fetchCategories();
    }, [categoryName]);

    if (loading) return <CategoryPageSkeleton />;

    return (
        <>
            <Helmet>
                <title>{categoryName} Yazıları - Next.js Blog</title>
                <meta 
                    name="description" 
                    content={`${categoryName} kategorisindeki tüm yazılar. React, Next.js ve modern web teknolojileri hakkında bilgiler.`} 
                />
                <meta name="keywords" content={`${categoryName}, react, nextjs, javascript, web development`} />
            </Helmet>
            
            <div className="max-w-4xl mx-auto p-4">
                <div className="flex items-center space-x-3 mb-8">
                    <CategoryIcon 
                        name={categoryName} 
                        className="w-8 h-8"
                    />
                    <h1 className="text-3xl font-bold">{categoryName} Yazıları</h1>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map(post => (
                        <Link
                            key={post.id}
                            to={`/blog/${post.id}`}
                            className="block group"
                        >
                            <div className="p-6 bg-gray-800 rounded-xl hover:bg-gray-700/50 transition">
                                <div className="flex items-center space-x-3 mb-4">
                                    <CategoryIcon 
                                        name={categoryName} 
                                        className="w-5 h-5 text-blue-400"
                                    />
                                    <h2 className="text-xl font-semibold group-hover:text-blue-400 transition">
                                        {post.title}
                                    </h2>
                                </div>
                                
                                {/* Post içeriği */}
                                <div className="text-gray-400">
                                    {post.blocks?.[0]?.content?.slice(0, 100)}...
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
} 