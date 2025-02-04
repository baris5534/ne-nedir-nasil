import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

export default function CodeExampleManager() {
    const [examples, setExamples] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [newExample, setNewExample] = useState({
        title: '',
        description: '',
        stackblitzUrl: '',
        files: [{
            name: 'App.jsx',
            code: `import React from 'react'

export default function App() {
  return (
    <div>
      <h1>Merhaba Dünya</h1>
    </div>
  )
}`
        }],
        output: '<div><h1>Merhaba Dünya</h1></div>'
    });

    // Örnekleri yükle - orderBy ile sıralama ekle
    useEffect(() => {
        const fetchExamples = async () => {
            try {
                // Tarihe göre sıralı sorgu oluştur
                const q = query(
                    collection(db, 'codeExamples'),
                    orderBy('createdAt', 'desc')
                );
                
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => {
                    const docData = doc.data();
                    // Eğer files array'i yoksa, varsayılan bir array oluştur
                    if (!docData.files) {
                        docData.files = [{
                            name: 'main.jsx',
                            code: docData.code || '',
                            language: 'jsx'
                        }];
                    }
                    return {
                        id: doc.id,
                        ...docData
                    };
                });
                setExamples(data);
            } catch (error) {
                console.error('Örnekler yüklenirken hata:', error);
            }
        };
        fetchExamples();
    }, [refreshTrigger]);

    // StackBlitz URL'i oluştur
    const createSandboxUrl = (files) => {
        try {
            // Ana dosyayı al
            const mainCode = files[0]?.code || `
export default function App() {
    return <h1>Merhaba Dünya</h1>;
}`;

            // Rastgele bir ID oluştur
            const randomId = Math.random().toString(36).substring(7);
            
            // StackBlitz URL'i oluştur
            return `https://stackblitz.com/fork/react?file=src/App.js&title=React%20Example&description=React%20Code%20Example&hideNavigation=1&view=editor`;

        } catch (error) {
            console.error('URL oluşturulurken hata:', error);
            // Hata durumunda React template'i ile yeni bir proje aç
            return 'https://stackblitz.com/fork/react';
        }
    };

    // Yeni örnek ekle
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newExample.title || !newExample.files.some(f => f.code)) {
            alert('Lütfen başlık ve en az bir dosya için kod ekleyin');
            return;
        }

        try {
            // Boş dosyaları filtrele
            const cleanedFiles = newExample.files.filter(file => file.name && file.code);
            
            await addDoc(collection(db, 'codeExamples'), {
                ...newExample,
                files: cleanedFiles,
                createdAt: new Date().toISOString()
            });

            setNewExample({
                title: '',
                description: '',
                stackblitzUrl: '',
                files: [{
                    name: '',
                    code: '',
                    language: 'jsx'
                }],
                output: ''
            });

            // Listeyi yenilemek için refreshTrigger'ı güncelle
            setRefreshTrigger(prev => prev + 1);

        } catch (error) {
            console.error('Örnek eklenirken hata:', error);
            alert('Örnek eklenirken bir hata oluştu');
        }
    };

    // Örnek sil
    const handleDelete = async (id) => {
        if (!window.confirm('Bu örneği silmek istediğinize emin misiniz?')) return;
        try {
            await deleteDoc(doc(db, 'codeExamples', id));
            // Listeyi yenilemek için refreshTrigger'ı güncelle
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Örnek silinirken hata:', error);
        }
    };

    // Yeni dosya ekle
    const addFile = () => {
        setNewExample(prev => ({
            ...prev,
            files: [...prev.files, {
                name: '',
                code: '',
                language: 'jsx'
            }]
        }));
    };

    // Dosya sil
    const removeFile = (index) => {
        setNewExample(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    // Dosya güncelle
    const updateFile = (index, field, value) => {
        setNewExample(prev => ({
            ...prev,
            files: prev.files.map((file, i) => 
                i === index ? { ...file, [field]: value } : file
            )
        }));
    };

    return (
        <div className="p-4 max-lg:max-w-96">
            <h2 className="text-xl font-bold mb-4">Kod Örnekleri</h2>

            {/* Yeni Örnek Formu */}
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="space-y-4">
                    <input
                        type="text"
                        value={newExample.title}
                        onChange={(e) => setNewExample(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Örnek başlığı"
                        className="w-full px-4 py-2 bg-gray-800 rounded-lg"
                        required
                    />

                    <textarea
                        value={newExample.description}
                        onChange={(e) => setNewExample(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Açıklama"
                        className="w-full px-4 py-2 bg-gray-800 rounded-lg"
                    />

                    {/* StackBlitz URL alanı */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            StackBlitz URL
                        </label>
                        <input
                            type="url"
                            value={newExample.stackblitzUrl}
                            onChange={(e) => setNewExample(prev => ({ 
                                ...prev, 
                                stackblitzUrl: e.target.value 
                            }))}
                            placeholder="https://stackblitz.com/edit/..."
                            className="w-full px-4 py-2 bg-gray-800 rounded-lg"
                        />
                        <p className="mt-1 text-sm text-gray-400">
                            StackBlitz'te projenizi oluşturduktan sonra URL'yi buraya yapıştırın
                        </p>
                    </div>

                    {/* Dosyalar */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">Dosyalar</h3>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={addFile}
                                    className="px-3 py-1 bg-blue-600 rounded-lg text-sm"
                                >
                                    + Yeni Dosya
                                </button>
                                <a
                                    href="https://stackblitz.com/fork/react?file=src/App.js"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1 bg-green-600 rounded-lg text-sm flex items-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    StackBlitz'te Test Et
                                </a>
                            </div>
                        </div>

                        {newExample.files.map((file, index) => (
                            <div key={index} className="p-4 bg-gray-900 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <input
                                        type="text"
                                        value={file.name}
                                        onChange={(e) => updateFile(index, 'name', e.target.value)}
                                        placeholder="Dosya adı (örn: App.jsx)"
                                        className="bg-gray-800 px-3 py-1 rounded"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    value={file.code}
                                    onChange={(e) => updateFile(index, 'code', e.target.value)}
                                    className="w-full h-40 bg-gray-800 p-3 rounded font-mono"
                                    placeholder="// Kodunuzu buraya yazın"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Çıktı */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Çıktı (HTML/JSX)</label>
                        <textarea
                            value={newExample.output}
                            onChange={(e) => setNewExample(prev => ({ ...prev, output: e.target.value }))}
                            className="w-full px-4 py-2 bg-gray-800 rounded-lg h-40 font-mono"
                            placeholder="<div>Çıktı örneği</div>"
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
                    >
                        Örnek Ekle
                    </button>
                </div>
            </form>

            {/* Örnekler Listesi */}
            <div className="space-y-4">
                {examples.map(example => (
                    <div key={example.id} className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-medium text-lg">{example.title}</h3>
                                <p className="text-sm text-gray-400">{example.description}</p>
                                <div className="mt-1">
                                    <code className="text-xs bg-gray-900 px-2 py-1 rounded text-blue-400">
                                        ID: {example.id}
                                    </code>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {example.stackblitzUrl && (
                                    <a
                                        href={example.stackblitzUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300"
                                    >
                                        StackBlitz'te Aç
                                    </a>
                                )}
                                <button
                                    onClick={() => handleDelete(example.id)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    Sil
                                </button>
                            </div>
                        </div>

                        {/* Sadece StackBlitz önizlemesi */}
                        {example.stackblitzUrl && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium mb-2">Önizleme:</h4>
                                <iframe
                                    src={`${example.stackblitzUrl}?embed=1&view=preview&hideNavigation=1`}
                                    className="w-full h-[300px] border-0 rounded-lg"
                                    title={example.title}
                                    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                                    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                                />
                            </div>
                        )}

                        {/* Dosyalar */}
                        <div className="mt-4 space-y-4">
                            {example.files.map((file, index) => (
                                <div key={index}>
                                    <h4 className="text-sm font-medium mb-2">{file.name}</h4>
                                    <pre className="bg-gray-900 p-3 rounded overflow-x-auto">
                                        <code>{file.code}</code>
                                    </pre>
                                </div>
                            ))}
                        </div>

                        {/* Çıktı */}
                        <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Çıktı:</h4>
                            <div className="bg-gray-900 p-3 rounded">
                                <div dangerouslySetInnerHTML={{ __html: example.output }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 