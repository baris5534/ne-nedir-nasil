import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import MDEditor from '@uiw/react-md-editor';

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'posts'));
            const postsData = querySnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
            
            setPosts(postsData);
        } catch (error) {
            console.error("Yazılar yüklenirken hata:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) {
            try {
                await deleteDoc(doc(db, 'posts', id));
                await fetchPosts();
                alert('Yazı başarıyla silindi');
            } catch (error) {
                console.error("Silme hatası:", error);
                alert('Yazı silinirken bir hata oluştu');
            }
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post);
    };

    const handleUpdate = async () => {
        if (!editingPost) return;

        try {
            await updateDoc(doc(db, 'posts', editingPost.id), {
                title: editingPost.title,
                blocks: editingPost.blocks,
                categories: editingPost.categories
            });

            await fetchPosts();
            setEditingPost(null);
            alert('Yazı başarıyla güncellendi');
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            alert('Yazı güncellenirken bir hata oluştu');
        }
    };

    const updateBlock = (index, field, value) => {
        setEditingPost(prev => ({
            ...prev,
            blocks: prev.blocks.map((block, i) => 
                i === index ? { ...block, [field]: value } : block
            )
        }));
    };

    const addBlock = (type) => {
        setEditingPost(prev => ({
            ...prev,
            blocks: [...prev.blocks, {
                type,
                content: type === 'text' ? '' : undefined,
                code: type === 'code' ? '' : undefined,
                codeTitle: type === 'code' ? '' : undefined
            }]
        }));
    };

    const removeBlock = (index) => {
        setEditingPost(prev => ({
            ...prev,
            blocks: prev.blocks.filter((_, i) => i !== index)
        }));
    };

    if (loading) return <div>Yazılar yükleniyor...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Mevcut Yazılar</h2>
            {posts.map(post => (
                <div key={post.id} className="bg-gray-800 p-4 rounded-lg">
                    {editingPost?.id === post.id ? (
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={editingPost.title}
                                onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                                className="w-full p-2 bg-gray-700 rounded"
                            />
                            
                            {editingPost.blocks.map((block, index) => (
                                <div key={index} className="bg-gray-700 p-4 rounded">
                                    {block.type === 'text' ? (
                                        <MDEditor
                                            value={block.content}
                                            onChange={(value) => updateBlock(index, 'content', value)}
                                        />
                                    ) : (
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={block.codeTitle}
                                                onChange={(e) => updateBlock(index, 'codeTitle', e.target.value)}
                                                className="w-full p-2 bg-gray-600 rounded"
                                                placeholder="Kod başlığı"
                                            />
                                            <textarea
                                                value={block.code}
                                                onChange={(e) => updateBlock(index, 'code', e.target.value)}
                                                className="w-full p-2 bg-gray-600 rounded font-mono"
                                                rows="5"
                                            />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => removeBlock(index)}
                                        className="mt-2 text-red-500 text-sm"
                                    >
                                        Bloğu Sil
                                    </button>
                                </div>
                            ))}

                            <div className="flex gap-2">
                                <button
                                    onClick={() => addBlock('text')}
                                    className="bg-gray-600 px-3 py-1 rounded"
                                >
                                    + Yazı Bloğu
                                </button>
                                <button
                                    onClick={() => addBlock('code')}
                                    className="bg-gray-600 px-3 py-1 rounded"
                                >
                                    + Kod Bloğu
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleUpdate}
                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                >
                                    Kaydet
                                </button>
                                <button
                                    onClick={() => setEditingPost(null)}
                                    className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                                >
                                    İptal
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-semibold">{post.title}</h3>
                                <div className="text-sm text-gray-400 mt-1">
                                    {post.categories?.join(', ')}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    {post.createdAt?.seconds ? 
                                        new Date(post.createdAt.seconds * 1000).toLocaleDateString('tr-TR') 
                                        : 'Tarih yok'}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(post)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    Düzenle
                                </button>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Sil
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
} 