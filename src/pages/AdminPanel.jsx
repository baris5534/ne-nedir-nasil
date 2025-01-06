import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import MDEditor from '@uiw/react-md-editor';
import CategoryManager from '../components/CategoryManager';
import CodeScreen from '../components/Codescreen';

export default function AdminPanel() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // İçerik blokları için yeni state
  const [blocks, setBlocks] = useState([]);
  const [currentBlock, setCurrentBlock] = useState({
    type: 'text',
    content: '',
    code: '',
    codeTitle: 'Terminal'
  });

  // Yazıları tutmak için yeni state
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  const fetchCategories = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addBlock = () => {
    setBlocks([...blocks, currentBlock]);
    setCurrentBlock({
      type: 'text',
      content: '',
      code: '',
      codeTitle: 'Terminal'
    });
  };

  const removeBlock = (index) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (blocks.length === 0) {
      alert('En az bir içerik bloğu eklemelisiniz!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        title,
        category: categories.find(cat => cat.id === category)?.name || category,
        blocks,
        createdAt: new Date().toISOString()
      });

      setTitle('');
      setCategory('');
      setBlocks([]);
      setCurrentBlock({
        type: 'text',
        content: '',
        code: '',
        codeTitle: 'Terminal'
      });
      alert('Yazı başarıyla eklendi!');
    } catch (error) {
      console.error('Hata:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Yazıları getir
  const fetchPosts = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Yazılar yüklenirken hata:', error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Yazı silme fonksiyonu
  const handleDelete = async (postId) => {
    if (!window.confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDoc(doc(db, 'posts', postId));
      alert('Yazı başarıyla silindi!');
      fetchPosts(); // Listeyi güncelle
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('Yazı silinirken bir hata oluştu');
    }
  };

  // Düzenleme moduna geç
  const startEditing = (post) => {
    setEditingPost(post);
    setTitle(post.title);
    setCategory(post.category);
    setBlocks(post.blocks || []);
  };

  // Düzenlemeyi iptal et
  const cancelEditing = () => {
    setEditingPost(null);
    setTitle('');
    setCategory('');
    setBlocks([]);
  };

  // Yazı güncelleme
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (blocks.length === 0) {
      alert('En az bir içerik bloğu eklemelisiniz!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'posts', editingPost.id), {
        title,
        category,
        blocks,
        updatedAt: new Date().toISOString()
      });

      alert('Yazı başarıyla güncellendi!');
      fetchPosts();
      cancelEditing();
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">İçerik Yönetimi</h1>
      
      <CategoryManager onCategoryAdded={fetchCategories} />

      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          Hata: {error}
        </div>
      )}

      {/* Mevcut yazıların listesi */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Mevcut Yazılar</h2>
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-400">
                    Kategori: {post.category}
                    <span className="mx-2">•</span>
                    {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => startEditing(post)}
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
            </div>
          ))}
        </div>
      </div>

      {/* Yazı ekleme/düzenleme formu */}
      <form onSubmit={editingPost ? handleUpdate : handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold">
          {editingPost ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}
        </h2>

        <div>
          <label className="block mb-2">Başlık:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2">Kategori:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            required
          >
            <option value="">Kategori Seçin</option>
            {categories.length === 0 ? (
              <option disabled>Kategoriler yükleniyor...</option>
            ) : (
              categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">İçerik Blokları</h2>
          
          {/* Mevcut blokların listesi */}
          {blocks.map((block, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-800 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                  {block.type === 'text' ? 'Metin Bloğu' : 'Kod Bloğu'}
                </span>
                <button
                  type="button"
                  onClick={() => removeBlock(index)}
                  className="text-red-500 hover:text-red-400"
                >
                  Sil
                </button>
              </div>
              {block.type === 'text' ? (
                <div className="prose prose-invert max-w-none">
                  <MDEditor.Markdown source={block.content} />
                </div>
              ) : (
                <CodeScreen code={block.code} title={block.codeTitle} />
              )}
            </div>
          ))}

          {/* Yeni blok ekleme formu */}
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setCurrentBlock({ ...currentBlock, type: 'text' })}
                className={`px-4 py-2 rounded ${
                  currentBlock.type === 'text' ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                Metin
              </button>
              <button
                type="button"
                onClick={() => setCurrentBlock({ ...currentBlock, type: 'code' })}
                className={`px-4 py-2 rounded ${
                  currentBlock.type === 'code' ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                Kod
              </button>
            </div>

            {currentBlock.type === 'text' ? (
              <div>
                <label className="block mb-2">Metin İçeriği:</label>
                <MDEditor
                  value={currentBlock.content}
                  onChange={(value) => setCurrentBlock({ ...currentBlock, content: value })}
                  preview="edit"
                  height={200}
                />
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <label className="block mb-2">Kod Başlığı:</label>
                  <input
                    type="text"
                    value={currentBlock.codeTitle}
                    onChange={(e) => setCurrentBlock({ ...currentBlock, codeTitle: e.target.value })}
                    className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    placeholder="Örn: Terminal, src/App.jsx"
                  />
                </div>
                <label className="block mb-2">Kod:</label>
                <textarea
                  value={currentBlock.code}
                  onChange={(e) => setCurrentBlock({ ...currentBlock, code: e.target.value })}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 h-48 font-mono"
                  placeholder="Kodunuzu buraya yazın..."
                />
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Önizleme:</h3>
                  <CodeScreen code={currentBlock.code} title={currentBlock.codeTitle} />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={addBlock}
              className="mt-4 w-full p-2 bg-green-600 hover:bg-green-700 rounded"
            >
              Bloğu Ekle
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || blocks.length === 0}
            className={`flex-1 p-2 rounded ${
              loading || blocks.length === 0
                ? 'bg-gray-600'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors`}
          >
            {loading ? 'İşlem yapılıyor...' : (editingPost ? 'Güncelle' : 'Yayınla')}
          </button>

          {editingPost && (
            <button
              type="button"
              onClick={cancelEditing}
              className="flex-1 p-2 bg-gray-600 rounded hover:bg-gray-700"
            >
              İptal
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 