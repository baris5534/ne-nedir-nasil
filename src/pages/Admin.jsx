import React from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Admin() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'posts'));
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
            try {
                await deleteDoc(doc(db, 'posts', id));
                setPosts(posts.filter(post => post.id !== id));
                alert('Yazı başarıyla silindi');
            } catch (error) {
                console.error("Error deleting post:", error);
                alert('Yazı silinirken bir hata oluştu');
            }
        }
    };

    if (loading) return <div className="p-4">Yükleniyor...</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <Link 
                    to="/admin/new" 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Yeni Yazı
                </Link>
            </div>

            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="bg-gray-800 p-4 rounded">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl">{post.title}</h2>
                            <div className="space-x-2">
                                <Link 
                                    to={`/admin/edit/${post.id}`}
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    Düzenle
                                </Link>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Sil
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 