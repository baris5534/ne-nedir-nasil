import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import CategoryIcon from './icons/CategoryIcons';

// Kategori sıralaması
const categoryOrder = [
    'html',
    'css',
    'javascript',
    'typescript',
    'react',
    'nextjs',
    'vitejs',
    'vite',
    'tailwind',
    'framermotion',
    'visualstudiocode'
];

export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            await addDoc(collection(db, 'categories'), {
                name: newCategory,
                createdAt: new Date().toISOString()
            });
            setNewCategory('');
            fetchCategories(); // Kategorileri yeniden yükle
        } catch (error) {
            console.error('Kategori eklenirken hata:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;

        try {
            await deleteDoc(doc(db, 'categories', id));
            fetchCategories(); // Kategorileri yeniden yükle
        } catch (error) {
            console.error('Kategori silinirken hata:', error);
        }
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
        <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-white">Kategoriler</h2>
            
            {/* Kategori Listesi */}
            <div className="space-y-2 mb-4">
                {sortedCategories.map(category => (
                    <div key={category.id} 
                        className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-2">
                            <CategoryIcon name={category.name} className="w-6 h-6 text-blue-400" />
                            <span className="text-white">{category.name}</span>
                        </div>
                        <button
                            onClick={() => handleDelete(category.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                        >
                            Sil
                        </button>
                    </div>
                ))}
            </div>

            {/* Yeni Kategori Formu */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Yeni kategori adı"
                    className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Ekleniyor...' : 'Ekle'}
                </button>
            </form>

            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
} 