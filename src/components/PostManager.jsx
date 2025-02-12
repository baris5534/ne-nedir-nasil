import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import MDEditor from '@uiw/react-md-editor';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export default function PostManager() {
    const [posts, setPosts] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editingPost, setEditingPost] = useState({
        title: '',
        categories: [],
        blocks: []
    });

    // Yazıları getir
    const fetchPosts = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'posts'));
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => 
                b.createdAt?.toDate?.() - a.createdAt?.toDate?.() || 0
            );
            setPosts(data);
        } catch (error) {
            console.error('Yazılar yüklenirken hata:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Yazı silme
    const handleDelete = async (postId) => {
        if (!window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return;

        try {
            await deleteDoc(doc(db, 'posts', postId));
            await fetchPosts();
            alert('Yazı başarıyla silindi');
        } catch (error) {
            console.error('Yazı silinirken hata:', error);
            alert('Yazı silinirken bir hata oluştu');
        }
    };

    // Düzenleme modunu aç
    const handleEdit = (post) => {
        setEditMode(true);
        setEditingPostId(post.id);
        setEditingPost({
            title: post.title,
            categories: post.categories || [],
            blocks: post.blocks || []
        });
    };

    // Yazı güncelleme
    const handleUpdate = async () => {
        try {
            const postRef = doc(db, 'posts', editingPostId);
            await updateDoc(postRef, {
                title: editingPost.title,
                categories: editingPost.categories,
                blocks: editingPost.blocks,
                updatedAt: new Date()
            });

            setEditMode(false);
            setEditingPostId(null);
            setEditingPost({ title: '', categories: [], blocks: [] });
            await fetchPosts();
            alert('Yazı başarıyla güncellendi');
        } catch (error) {
            console.error('Yazı güncellenirken hata:', error);
            alert('Yazı güncellenirken bir hata oluştu');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Yazı Yönetimi</h2>

            {/* Yazı Listesi */}
            <div className="space-y-4">
                {posts.map(post => (
                    <div key={post.id} className="bg-gray-800 p-4 rounded-lg">
                        {editMode && editingPostId === post.id ? (
                            // Düzenleme Formu
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={editingPost.title}
                                    onChange={(e) => setEditingPost(prev => ({
                                        ...prev,
                                        title: e.target.value
                                    }))}
                                    className="w-full p-2 bg-gray-700 rounded"
                                />

                                {/* Blok Düzenleme */}
                                {editingPost.blocks.map((block, index) => (
                                    <div key={index} className="space-y-2">
                                        {block.type === 'code' ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={block.codeTitle}
                                                    onChange={(e) => {
                                                        const newBlocks = [...editingPost.blocks];
                                                        newBlocks[index] = {
                                                            ...block,
                                                            codeTitle: e.target.value
                                                        };
                                                        setEditingPost(prev => ({
                                                            ...prev,
                                                            blocks: newBlocks
                                                        }));
                                                    }}
                                                    placeholder="Başlık"
                                                    className="w-full p-2 bg-gray-700 rounded"
                                                />
                                                <textarea
                                                    value={block.code}
                                                    onChange={(e) => {
                                                        const newBlocks = [...editingPost.blocks];
                                                        newBlocks[index] = {
                                                            ...block,
                                                            code: e.target.value
                                                        };
                                                        setEditingPost(prev => ({
                                                            ...prev,
                                                            blocks: newBlocks
                                                        }));
                                                    }}
                                                    className="w-full p-2 bg-gray-700 rounded font-mono"
                                                    rows="5"
                                                />
                                            </>
                                        ) : (
                                            <MDEditor
                                                value={block.content}
                                                onChange={(value) => {
                                                    const newBlocks = [...editingPost.blocks];
                                                    newBlocks[index] = {
                                                        ...block,
                                                        content: value || ''
                                                    };
                                                    setEditingPost(prev => ({
                                                        ...prev,
                                                        blocks: newBlocks
                                                    }));
                                                }}
                                            />
                                        )}
                                        
                                        {/* Blok Silme Butonu */}
                                        <button
                                            onClick={() => {
                                                const newBlocks = editingPost.blocks.filter((_, i) => i !== index);
                                                setEditingPost(prev => ({
                                                    ...prev,
                                                    blocks: newBlocks
                                                }));
                                            }}
                                            className="text-red-500 text-sm"
                                        >
                                            Bloğu Sil
                                        </button>
                                    </div>
                                ))}

                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleUpdate}
                                        className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                                    >
                                        Güncelle
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setEditingPostId(null);
                                        }}
                                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                                    >
                                        İptal
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // Yazı Görünümü
                            <div>
                                <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                                    >
                                        Sil
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 