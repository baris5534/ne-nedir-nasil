import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { CATEGORY_ICONS } from '../utils/categoryIcons.jsx';
import Icon from './icons';

// Kategori sıralaması
const categoryOrder = [
    'html',
    'css',
    'javascript',
    'typescript',
    'react',
    'nextjs',
    'vitejs',
    'tailwind',
    'framermotion',
    'visualstudiocode',
    'mobile',
    'responsive',
    'performance',
    'seo'
];

export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({ name: '', icon: 'default' });
    const [editingCategory, setEditingCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    // Kategorileri yükle
    const fetchCategories = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'categories'));
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCategories(data);
            setLoading(false);
        } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.name.trim()) return;

        try {
            await addDoc(collection(db, 'categories'), {
                ...newCategory,
                createdAt: new Date().toISOString()
            });
            setNewCategory({ name: '', icon: '⚡️' });
            fetchCategories(); // Kategorileri yeniden yükle
        } catch (error) {
            console.error('Kategori eklenirken hata:', error);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;

        try {
            await deleteDoc(doc(db, 'categories', id));
            fetchCategories(); // Kategorileri yeniden yükle
        } catch (error) {
            console.error('Kategori silinirken hata:', error);
        }
    };

    const handleUpdateCategory = (categoryId, iconName) => {
        // Kategori güncelleme işlemi
        console.log('Kategori güncellendi:', categoryId, iconName);
        setEditingCategory(null);
    };

    // Kategorileri sırala
    const sortedCategories = [...categories].sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.name.toLowerCase());
        const indexB = categoryOrder.indexOf(b.name.toLowerCase());
        
        // Eğer kategori sıralama listesinde yoksa en sona at
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        
        return indexA - indexB;
    });

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div className="p-4 max-lg:p-0">
            <h2 className="text-xl font-bold mb-4">Kategori Yönetimi</h2>

            <form onSubmit={handleAddCategory}>
                <div className="flex max-lg:max-w-[350px] flex-col gap-2">
                    <input
                        type="text"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Kategori adı"
                        className="w-full px-4 py-2 bg-gray-800 rounded-lg"
                    />
                    
                    <div className="flex items-center gap-2 overflow-x-auto p-2">
                        {Object.entries(CATEGORY_ICONS).map(([key, icon]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setNewCategory(prev => ({ ...prev, icon: key }))}
                                className={`p-2 rounded flex flex-col items-center min-w-[60px] text-clip ${
                                    newCategory.icon === key 
                                        ? 'bg-blue-500 text-white' 
                                        : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            >
                                <Icon name={key} />
                                <span className="mt-1 text-xs text-clip overflow-hidden whitespace-nowrap">{key}</span>
                            </button>
                        ))}
                    </div>

                    <button 
                        type="submit" 
                        className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
                    >
                        Ekle
                    </button>
                </div>
            </form>

            {/* Kategori Listesi */}
            <div className="space-y-4 mt-4">
                {sortedCategories.map((category) => (
                    <div key={category.id} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <Icon name={category.icon || 'default'} />
                                <span>{category.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setEditingCategory(editingCategory === category.id ? null : category.id)}
                                    className="p-2 text-blue-400 hover:text-blue-300"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(category.id)}
                                    className="p-2 text-red-400 hover:text-red-300"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>

                        {/* İkon düzenleme bölümü */}
                        {editingCategory === category.id && (
                            <div className="mt-2 border-t border-gray-700 pt-2">
                                <div className="flex items-center gap-2 overflow-x-auto py-2">
                                    {categoryOrder.map((iconName) => (
                                        <button
                                            key={iconName}
                                            type="button"
                                            onClick={() => handleUpdateCategory(category.id, iconName)}
                                            className={`p-2 rounded flex flex-col items-center min-w-[60px] ${
                                                category.icon === iconName 
                                                    ? 'bg-blue-500 text-white' 
                                                    : 'bg-gray-700 hover:bg-gray-600'
                                            }`}
                                        >
                                            <Icon name={iconName} />
                                            <span className="mt-1 text-xs whitespace-nowrap">{iconName}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
} 