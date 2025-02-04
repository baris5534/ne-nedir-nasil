import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import MDEditor from '@uiw/react-md-editor';
import CategoryManager from '../components/CategoryManager';
import { useNavigate } from 'react-router-dom';
import CodeExampleManager from '../components/CodeExampleManager';
import { Tabs, TabsList, Tab, TabsContent } from '../components/ui/tabs';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Varsayılan dosya yapısı
const defaultFileStructure = {
  name: 'src',
  type: 'folder',
  children: [
    {
      name: 'app',
      type: 'folder',
      children: [
        { name: 'layout.tsx', type: 'file' },
        { name: 'page.tsx', type: 'file' }
      ]
    },
    {
      name: 'components',
      type: 'folder',
      children: [
        {
          name: 'ui',
          type: 'folder',
          children: [
            { name: 'button.tsx', type: 'file' }
          ]
        },
        { name: 'header.tsx', type: 'file' },
        { name: 'footer.tsx', type: 'file' }
      ]
    }
  ]
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
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

  const [fileStructure, setFileStructure] = useState(defaultFileStructure);
  const [editingNode, setEditingNode] = useState(null);
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeType, setNewNodeType] = useState('file');

  const [codeExamples, setCodeExamples] = useState([]);
  const [selectedCodeExamples, setSelectedCodeExamples] = useState([]);
  const [availableCodeExamples, setAvailableCodeExamples] = useState([]);

  const [highlighter, setHighlighter] = useState(null);

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin-login');
    }
  }, [navigate]);

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

  useEffect(() => {
    getHighlighter({
        theme: 'dracula',
        langs: ['javascript', 'jsx', 'html', 'css', 'typescript']
    }).then(h => setHighlighter(h));
  }, []);

  // Blok içeriğini güncelle
  const updateBlock = (index, field, value) => {
    setBlocks(blocks.map((block, i) => {
      if (i === index) {
        return { ...block, [field]: value };
      }
      return block;
    }));
  };

  // Blok ekleme fonksiyonunu güncelle
  const addBlock = (type) => {
    const newBlock = {
        type,
        content: '',
        code: type === 'code' ? '' : undefined,
        codeTitle: type === 'code' ? 'Terminal' : undefined,
        language: type === 'code' ? 'bash' : undefined
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  const removeBlock = (index) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
        alert('Lütfen bir başlık girin');
        return;
    }
    if (blocks.length === 0) {
        alert('En az bir içerik bloğu eklemelisiniz!');
        return;
    }
    if (selectedCategories.length === 0) {
        alert('En az bir kategori seçmelisiniz!');
        return;
    }

    setLoading(true);
    try {
        const postData = {
            title: title.trim(),
            categories: selectedCategories,
            blocks: blocks.map(block => {
                if (block.type === 'codeExample') {
                    return {
                        type: 'codeExample',
                        title: block.title,
                        description: block.description,
                        files: block.files,
                        stackblitzUrl: block.stackblitzUrl,
                        exampleId: block.exampleId
                    };
                }
                return block;
            }),
            createdAt: new Date().toISOString()
        };

        await addDoc(collection(db, 'posts'), postData);
        
        // Formu temizle
        setTitle('');
        setSelectedCategories([]);
        setBlocks([]);
        setCurrentBlock({
            type: 'text',
            content: '',
            code: '',
            codeTitle: 'Terminal'
        });
        
        alert('Yazı başarıyla yayınlandı!');
    } catch (error) {
        console.error('Error:', error);
        alert('Bir hata oluştu!');
    } finally {
        setLoading(false);
    }
  };

  // Yazıları getir
  const fetchPosts = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      const postsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Eğer categories yoksa veya dizi değilse, boş dizi olarak ayarla
          categories: Array.isArray(data.categories) ? data.categories : []
        };
      });
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
    setBlocks(post.blocks || []);
    setSelectedCategories(post.categories || []); // Mevcut kategorileri yükle
  };

  // Düzenlemeyi iptal et
  const cancelEditing = () => {
    setEditingPost(null);
    setTitle('');
    setSelectedCategories([]);
    setBlocks([]);
  };

  // Yazı güncelleme
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingPost) return;

    if (blocks.length === 0) {
      alert('En az bir içerik bloğu eklemelisiniz!');
      return;
    }

    if (selectedCategories.length === 0) {
      alert('En az bir kategori seçmelisiniz!');
      return;
    }

    setLoading(true);
    try {
      const postData = {
        title,
        categories: selectedCategories,
        blocks,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'posts', editingPost.id), postData);
      alert('Yazı güncellendi!');
      
      // Formu sıfırla
      setTitle('');
      setSelectedCategories([]);
      setBlocks([]);
      setEditingPost(null);
      
      // Yazıları yeniden yükle
      fetchPosts();
    } catch (error) {
      console.error('Error:', error);
      alert('Güncelleme sırasında bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  // Yeni düğüm ekleme
  const addNode = (parentPath = []) => {
    if (!newNodeName) return;

    const newStructure = {...fileStructure};
    let current = newStructure;

    // Parent klasöre git
    for (const index of parentPath) {
      current = current.children[index];
    }

    // Yeni düğümü ekle
    if (!current.children) current.children = [];
    current.children.push({
      name: newNodeName,
      type: newNodeType,
      children: newNodeType === 'folder' ? [] : undefined
    });

    setFileStructure(newStructure);
    setNewNodeName('');
  };

  // Düğüm silme
  const deleteNode = (path) => {
    const newStructure = {...fileStructure};
    let current = newStructure;
    
    // Son eleman hariç parent'a git
    for (let i = 0; i < path.length - 1; i++) {
      current = current.children[path[i]];
    }

    // Son elemanı sil
    current.children.splice(path[path.length - 1], 1);
    setFileStructure(newStructure);
  };

  // Ağaç yapısını recursive olarak render et
  const renderTree = (node, path = []) => {
    return (
      <div key={node.name} className="ml-4">
        <div className="flex items-center space-x-2 my-1">
          <span>{node.type === 'folder' ? '📁' : '📄'}</span>
          <span className="text-blue-300">{node.name}</span>
          <button 
            onClick={() => deleteNode(path)}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Sil
          </button>
          {node.type === 'folder' && (
            <button
              onClick={() => setEditingNode(path)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Ekle
            </button>
          )}
        </div>
        {node.children?.map((child, index) => 
          renderTree(child, [...path, index])
        )}
        {editingNode?.join(',') === path.join(',') && (
          <div className="ml-8 mt-2 space-y-2">
            <input
              type="text"
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              placeholder="Dosya/Klasör adı"
              className="bg-gray-800 px-2 py-1 rounded text-sm"
            />
            <select
              value={newNodeType}
              onChange={(e) => setNewNodeType(e.target.value)}
              className="bg-gray-800 px-2 py-1 rounded text-sm ml-2"
            >
              <option value="file">Dosya</option>
              <option value="folder">Klasör</option>
            </select>
            <button
              onClick={() => {
                addNode(editingNode);
                setEditingNode(null);
              }}
              className="bg-blue-500 px-2 py-1 rounded text-sm ml-2"
            >
              Ekle
            </button>
          </div>
        )}
      </div>
    );
  };

  // Kategori seçimi işleyicisi
  const handleCategoryChange = (categoryId) => {
    console.log('Kategori değiştiriliyor:', categoryId); // Debug için
    console.log('Mevcut seçili kategoriler:', selectedCategories); // Debug için

    setSelectedCategories(prev => {
      let newCategories;
      if (prev.includes(categoryId)) {
        // Eğer zaten seçiliyse kaldır
        newCategories = prev.filter(id => id !== categoryId);
      } else if (prev.length < 2) {
        // Eğer 2'den az seçili varsa ekle
        newCategories = [...prev, categoryId];
      } else {
        // 2 seçili varsa ve yeni bir seçim yapılıyorsa, ilkini çıkar yenisini ekle
        newCategories = [prev[1], categoryId];
      }
      console.log('Yeni kategori listesi:', newCategories); // Debug için
      return newCategories;
    });
  };

  // Kod örneklerini yükle
  useEffect(() => {
    const fetchCodeExamples = async () => {
      const snapshot = await getDocs(collection(db, 'codeExamples'));
      const examples = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAvailableCodeExamples(examples);
    };
    fetchCodeExamples();
  }, []);

  // Kod örneği seçildiğinde çağrılacak fonksiyon
  const handleCodeExampleSelect = (exampleId) => {
    const example = availableCodeExamples.find(ex => ex.id === exampleId);
    if (example) {
      const newBlock = {
        type: 'codeExample',
        title: example.title,
        description: example.description,
        files: example.files,
        stackblitzUrl: example.stackblitzUrl,
        exampleId: example.id
      };
      setBlocks(prev => [...prev, newBlock]);
    }
  };

  // Kod bloğunu render et
  const renderCode = (code, language = 'javascript') => {
    return (
        <div className="relative bg-[#282A36] rounded-lg overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 text-xs text-[#6272A4] bg-[#21222C] rounded-bl">
                {language}
            </div>
            <div className="pt-8">
                <SyntaxHighlighter
                    language={language}
                    style={dracula}
                    showLineNumbers
                    customStyle={{
                        margin: 0,
                        background: 'transparent',
                        padding: '1rem',
                        fontSize: '14px',
                        fontFamily: "'Fira Code', monospace"
                    }}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      <Tabs defaultValue="posts">
        <TabsList>
          <Tab value="posts">Yazılar</Tab>
          <Tab value="categories">Kategoriler</Tab>
          <Tab value="code-examples">Kod Örnekleri</Tab>
        </TabsList>

        <TabsContent value="posts">
          <h1 className="text-2xl font-bold mb-6">İçerik Yönetimi</h1>
          
          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4">
              Hata: {error}
            </div>
          )}

          {/* Mevcut yazıların listesi */}
          <div className="mb-8 mt-6 ">
            <h2 className="text-xl font-bold mb-4">Mevcut Yazılar</h2>
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="text-sm text-gray-400">
                        Kategoriler: {post.categories?.length > 0 
                          ? post.categories.join(', ') 
                          : 'Kategorisiz'
                        }
                        <span className="mx-2">•</span>
                        {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="space-x-2 amx-lg:max-w-[350px] flex items-center">
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
                className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-blue-400/80 mb-2">
                Kategoriler
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategories(prev => {
                        if (prev.includes(category.name)) {
                          return prev.filter(cat => cat !== category.name);
                        } else {
                          return [...prev, category.name];
                        }
                      });
                    }}
                    className={`px-3 py-1.5 rounded text-sm transition-colors ${
                      selectedCategories.includes(category.name)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-blue-300 hover:bg-gray-600'
                    }`}
                  >
                    {category.name}
                    {selectedCategories.includes(category.name) && (
                      <span className="ml-2">✓</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-blue-400/60 mt-1">
                Seçili kategoriler: {selectedCategories.join(', ') || 'Yok'}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">İçerik Blokları</h2>
              
              {/* Mevcut blokların listesi */}
              <div className="space-y-4">
                {blocks.map((block, index) => (
                  <div key={index} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">
                        {block.type === 'text' ? 'Metin' : 
                         block.type === 'code' ? 'Kod' : 
                         'Kod Örneği'}
                      </span>
                      <button
                        onClick={() => removeBlock(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Sil
                      </button>
                    </div>

                    {block.type === 'text' && (
                      <MDEditor
                        value={block.content}
                        onChange={(value) => updateBlock(index, 'content', value)}
                        preview="edit"
                        className="bg-gray-900"
                      />
                    )}

                    {block.type === 'code' && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={block.codeTitle}
                            onChange={(e) => updateBlock(index, 'codeTitle', e.target.value)}
                            placeholder="Başlık (örn: Terminal)"
                            className="flex-1 px-3 py-2 bg-gray-900 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div className="relative bg-[#282A36] rounded-lg overflow-hidden">
                          <div className="absolute top-0 right-0 px-3 py-1 text-xs text-[#6272A4] bg-[#21222C] rounded-bl">
                            {block.codeTitle || 'Terminal'}
                          </div>
                          <div className="pt-8 relative">
                            <div className="absolute inset-0 pt-8">
                              <textarea
                                value={block.code}
                                onChange={(e) => updateBlock(index, 'code', e.target.value)}
                                placeholder="Kodu buraya yazın..."
                                className="w-full h-full p-4 bg-transparent text-gray-200 font-mono text-sm focus:outline-none resize-y"
                                style={{
                                  caretColor: '#fff',
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  zIndex: 2
                                }}
                              />
                            </div>
                            <div style={{ pointerEvents: 'none' }}>
                              <SyntaxHighlighter
                                language="bash"
                                style={dracula}
                                showLineNumbers
                                customStyle={{
                                  margin: 0,
                                  background: 'transparent',
                                  padding: '1rem',
                                  fontSize: '14px',
                                  fontFamily: "'Fira Code', monospace",
                                  minHeight: '8rem'
                                }}
                              >
                                {block.code || ' '}
                              </SyntaxHighlighter>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {block.type === 'codeExample' && (
                      <div>
                        <h3 className="font-medium mb-2">{block.title}</h3>
                        <p className="text-sm text-gray-400">{block.description}</p>
                        {block.files?.map((file, fileIndex) => (
                          <div key={fileIndex} className="mt-2">
                            <div className="text-sm text-blue-400">{file.name}</div>
                            {renderCode(file.code, file.name.split('.').pop())}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Blok ekleme butonları */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => addBlock('text')}
                  className="px-3 py-1 bg-blue-600 rounded-lg text-sm"
                >
                  + Metin Ekle
                </button>
                <button
                  type="button"
                  onClick={() => addBlock('code')}
                  className="px-3 py-1 bg-blue-600 rounded-lg text-sm"
                >
                  + Kod Ekle
                </button>
                <select
                  onChange={(e) => handleCodeExampleSelect(e.target.value)}
                  className="px-3 py-1 bg-gray-700 rounded-lg text-sm"
                  value=""
                >
                  <option value="" disabled>+ Kod Örneği Ekle</option>
                  {availableCodeExamples.map(example => (
                    <option key={example.id} value={example.id}>
                      {example.title}
                    </option>
                  ))}
                </select>
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
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManager onCategoryAdded={fetchCategories} />
        </TabsContent>

        <TabsContent value="code-examples">
          <CodeExampleManager />
        </TabsContent>
      </Tabs>
    </div>
  );
} 