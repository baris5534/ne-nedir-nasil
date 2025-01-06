import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function CategoryManager({ onCategoryAdded }) {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        // Kategori güncelleme
        await updateDoc(doc(db, 'categories', editingCategory.id), {
          name: categoryName,
          updatedAt: new Date().toISOString()
        });
        alert('Kategori başarıyla güncellendi!');
        setEditingCategory(null);
      } else {
        // Yeni kategori ekleme
        await addDoc(collection(db, 'categories'), {
          name: categoryName,
          createdAt: new Date().toISOString()
        });
        alert('Kategori başarıyla eklendi!');
      }
      setCategoryName('');
      fetchCategories();
      if (onCategoryAdded) onCategoryAdded();
    } catch (error) {
      console.error('Hata:', error);
      alert(editingCategory ? 'Kategori güncellenirken bir hata oluştu' : 'Kategori eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      alert('Kategori başarıyla silindi!');
      fetchCategories();
      if (onCategoryAdded) onCategoryAdded();
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Kategori silinirken bir hata oluştu');
    }
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setCategoryName('');
  };

  return (
    <div className="mb-8 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Kategori Yönetimi</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-700 border border-gray-600"
          placeholder="Kategori adı"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        >
          {loading ? 'İşlem yapılıyor...' : (editingCategory ? 'Güncelle' : 'Ekle')}
        </button>
        {editingCategory && (
          <button
            type="button"
            onClick={cancelEditing}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
          >
            İptal
          </button>
        )}
      </form>

      {/* Kategori listesi */}
      <div className="space-y-2">
        {categories.map(category => (
          <div key={category.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
            <span>{category.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="text-blue-400 hover:text-blue-300"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-400 hover:text-red-300"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 