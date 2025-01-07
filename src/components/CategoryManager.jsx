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
    if (!categoryName.trim()) {
      alert('Kategori adı boş olamaz');
      return;
    }

    setLoading(true);

    try {
      const categoryData = {
        name: categoryName,
        updatedAt: new Date().toISOString()
      };

      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), categoryData);
        alert('Kategori güncellendi!');
      } else {
        categoryData.createdAt = new Date().toISOString();
        await addDoc(collection(db, 'categories'), categoryData);
        alert('Kategori eklendi!');
      }
      
      // Formu sıfırla
      setCategoryName('');
      setEditingCategory(null);
      
      // Listeyi yenile
      await fetchCategories();
      if (onCategoryAdded) onCategoryAdded();

    } catch (error) {
      console.error('Hata:', error);
      alert(`Hata: ${error.message}`);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="mb-8 p-4 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Kategori Yönetimi</h2>

      {/* Kategori formu */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          placeholder="Kategori adı"
          required
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded transition-colors ${
              loading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                İşlem yapılıyor...
              </span>
            ) : (
              editingCategory ? 'Güncelle' : 'Ekle'
            )}
          </button>
          
          {editingCategory && (
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setCategoryName('');
              }}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
            >
              İptal
            </button>
          )}
        </div>
      </form>

      {/* Kategori listesi */}
      <div className="space-y-2 mt-4">
        {categories.map(category => (
          <div key={category.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
            <span>{category.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditingCategory(category);
                  setCategoryName(category.name);
                }}
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