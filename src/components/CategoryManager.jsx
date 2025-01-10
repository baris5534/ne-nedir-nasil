import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const CATEGORY_ICONS = {
  react: (
    <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
      <path d="M18.6789 15.9759C18.6789 14.5415 17.4796 13.3785 16 13.3785C14.5206 13.3785 13.3211 14.5415 13.3211 15.9759C13.3211 17.4105 14.5206 18.5734 16 18.5734C17.4796 18.5734 18.6789 17.4105 18.6789 15.9759Z" fill="#53C1DE"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M24.7004 11.1537C25.2661 8.92478 25.9772 4.79148 23.4704 3.39016C20.9753 1.99495 17.7284 4.66843 16.0139 6.27318C14.3044 4.68442 10.9663 2.02237 8.46163 3.42814C5.96751 4.82803 6.73664 8.8928 7.3149 11.1357C4.98831 11.7764 1 13.1564 1 15.9759C1 18.7874 4.98416 20.2888 7.29698 20.9289C6.71658 23.1842 5.98596 27.1909 8.48327 28.5877C10.9973 29.9932 14.325 27.3945 16.0554 25.7722C17.7809 27.3864 20.9966 30.0021 23.4922 28.6014C25.9956 27.1963 25.3436 23.1184 24.7653 20.8625C27.0073 20.221 31 18.7523 31 15.9759C31 13.1835 26.9903 11.7923 24.7004 11.1537ZM24.4162 19.667C24.0365 18.5016 23.524 17.2623 22.8971 15.9821C23.4955 14.7321 23.9881 13.5088 24.3572 12.3509C26.0359 12.8228 29.7185 13.9013 29.7185 15.9759C29.7185 18.07 26.1846 19.1587 24.4162 19.667ZM22.85 27.526C20.988 28.571 18.2221 26.0696 16.9478 24.8809C17.7932 23.9844 18.638 22.9422 19.4625 21.7849C20.9129 21.6602 22.283 21.4562 23.5256 21.1777C23.9326 22.7734 24.7202 26.4763 22.85 27.526ZM9.12362 27.5111C7.26143 26.47 8.11258 22.8946 8.53957 21.2333C9.76834 21.4969 11.1286 21.6865 12.5824 21.8008C13.4123 22.9332 14.2816 23.9741 15.1576 24.8857C14.0753 25.9008 10.9945 28.557 9.12362 27.5111ZM2.28149 15.9759C2.28149 13.874 5.94207 12.8033 7.65904 12.3326C8.03451 13.5165 8.52695 14.7544 9.12123 16.0062C8.51925 17.2766 8.01977 18.5341 7.64085 19.732C6.00369 19.2776 2.28149 18.0791 2.28149 15.9759Z" fill="#53C1DE"/>
    </svg>
  ),
  framermotion: (
    <svg className="w-6 h-6" viewBox="3.7 3.7 43.6 43.6" xmlns="http://www.w3.org/2000/svg">
      <path d="m47.3 3.7v21.8l-10.9 10.9-10.9 10.9-10.9-10.9 10.9-10.9v.1-.1z" fill="#59529d"/>
      <path d="m47.3 25.5v21.8l-10.9-10.9z" fill="#5271b4"/>
      <path d="m25.5 25.5-10.9 10.9-10.9 10.9v-43.6l10.9 10.9z" fill="#bb4b96"/>
    </svg>
  ),
  default: (
    
<svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="code">
  <rect  fill="wight"></rect>
  <polyline fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" points="64 88 16 128 64 168"></polyline>
  <polyline fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24" points="192 88 240 128 192 168"></polyline>
  <line x1="160" x2="96" y1="40" y2="216" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
</svg>

  )
};

export default function CategoryManager({ onCategoryAdded }) {
  const [categoryName, setCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('default');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

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
      console.log('Mevcut kategoriler:', categoriesData);
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
      const newCategory = {
        name: categoryName,
        icon: selectedIcon, // Sadece ikon adını saklayalım
        createdAt: new Date().toISOString()
      };

      console.log('Eklenen kategori:', newCategory);

      await addDoc(collection(db, 'categories'), newCategory);
      alert('Kategori eklendi!');
      
      setCategoryName('');
      setSelectedIcon('default');
      
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Kategori Adı:</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
          />
        </div>

        <div>
          <label className="block mb-2">İkon Seçin:</label>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(CATEGORY_ICONS).map(([key, icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedIcon(key)}
                className={`p-2 rounded flex flex-col items-center ${
                  selectedIcon === key 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {icon}
                <span className="mt-1 text-sm">{key}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded transition-colors ${
            loading 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'İşlem yapılıyor...' : 'Ekle'}
        </button>
      </form>

      <div className="space-y-2 mt-4">
        {categories.map(category => (
          <div key={category.id} className="flex items-center justify-between bg-gray-700 p-2 rounded">
            <div className="flex items-center">
              {CATEGORY_ICONS[category.icon] || CATEGORY_ICONS.default}
              <span className="ml-2">{category.name}</span>
            </div>
            <div className="space-x-2">
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