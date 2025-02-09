import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import CategoryIcon from '../components/icons/CategoryIcons';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Kategorileri getir
        const categorySnapshot = await getDocs(collection(db, 'categories'));
        const categoryData = categorySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoryData);

        // Yazıları getir
        const postSnapshot = await getDocs(
          query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
        );
        const postData = postSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          categories: doc.data().categories || []
        }));
        setPosts(postData);
      } catch (error) {
        console.error('Veri yüklenirken hata:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Yazıları kategorilere göre grupla
  const postsByCategory = categories.reduce((acc, category) => {
    acc[category.name] = posts.filter(post => 
      post.categories?.includes(category.name)
    );
    return acc;
  }, {});

  if (loading) return <HomeSkeleton />;
  if (error) return <div className="text-red-500 text-center p-4">Hata: {error}</div>;

  return (
    <>
      <Helmet>
        <title>Next.js Blog - Modern Web Teknolojileri</title>
        <meta name="description" content="React, Next.js ve modern web teknolojileri hakkında güncel bilgiler." />
      </Helmet>

      <div className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-10 mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10" />
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl md:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400"
              >
                Modern Web Teknolojileri
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-base md:text-lg text-blue-200/80"
              >
                React, Next.js ve daha fazlası
              </motion.p>
            </div>
          </div>
        </section>

        <div>
          {/* Kategorileri Listele */}
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map(category => (
              <Link 
                key={category.id}
                to={`/category/${category.name}`}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-full p-2 hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-1 text-center justify-center w-auto">
                  <CategoryIcon name={category.name} className="w-6 h-6 text-blue-400" />
                  <span className="font-medium text-xs text-white">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Kategorilere Göre Yazılar */}
        <div className="max-w-7xl mx-auto px-4 space-y-12">
          {categories.map(category => {
            const categoryPosts = postsByCategory[category.name] || [];
            if (categoryPosts.length === 0) return null;

            return (
              <section key={category.id} className="relative">
                {/* Kategori Başlığı */}
                <div className="flex items-center gap-3 mb-6">
                  <CategoryIcon name={category.name} className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-blue-100">{category.name}</h2>
                  <Link 
                    to={`/category/${category.name}`}
                    className="ml-auto text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Tümünü Gör →
                  </Link>
                </div>

                {/* Kategori Yazıları */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryPosts.slice(0, 3).map(post => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      categories={categories}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}

function PostCard({ post, categories }) {
  const location = useLocation();
  
  return (
    <Link 
      to={`/blog/${post.id}`}
      state={{ from: location.pathname }}
      className="group"
    >
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-full"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-2xl 
                      transform group-hover:scale-[1.02] transition-transform duration-300" />
        <div className="relative bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 
                      group-hover:border-blue-500/40 rounded-2xl p-6 h-full
                      transition-all duration-300 flex flex-col">
          {/* Kategori Etiketleri */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories?.map(categoryName => {
              const category = categories.find(c => c.name === categoryName);
              return category && (
                <span
                  key={category.name}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                           bg-blue-500/10 text-blue-300/90 text-sm"
                >
                  <CategoryIcon name={category.name} className="w-4 h-4" />
                  {category.name}
                </span>
              );
            })}
          </div>

          {/* Başlık */}
          <h2 className="text-xl font-bold mb-3 text-blue-100 group-hover:text-blue-300 transition-colors">
            {post.title}
          </h2>

          {/* Özet */}
          <p className="text-blue-200/70 text-sm mb-4 line-clamp-3">
            {post.blocks?.[0]?.content}
          </p>

          {/* Alt Bilgiler */}
          <div className="mt-auto flex items-center justify-between text-sm">
            <div className="text-blue-400/80">
              {new Date(post.createdAt).toLocaleDateString('tr-TR')}
            </div>
            
            <div className="flex items-center gap-2">
              {post.blocks?.some(block => block.type === 'code') && (
                <span className="text-blue-400/80 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Kod İçerir
                </span>
              )}
              <span className="text-blue-400 group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

function HomeSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Skeleton */}
      <div className="py-20 mb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="h-12 bg-blue-400/20 rounded-lg w-3/4 mx-auto" />
            <div className="h-6 bg-blue-400/20 rounded-lg w-2/4 mx-auto" />
          </div>
        </div>
      </div>

      {/* Category Filter Skeleton */}
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-10 w-24 bg-blue-400/20 rounded-full" />
          ))}
        </div>
      </div>

      {/* Posts Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-800/50 rounded-2xl p-6 h-[300px]">
                <div className="space-y-4">
                  <div className="h-4 bg-blue-400/20 rounded w-1/3" />
                  <div className="h-6 bg-blue-400/20 rounded w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-blue-400/20 rounded w-full" />
                    <div className="h-4 bg-blue-400/20 rounded w-5/6" />
                    <div className="h-4 bg-blue-400/20 rounded w-4/6" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}