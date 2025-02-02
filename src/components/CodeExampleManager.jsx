import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function CodeExampleManager() {
    const [examples, setExamples] = useState([]);
    const [newExample, setNewExample] = useState({
        title: '',
        description: '',
        files: [{
            name: '',
            code: '',
            language: 'jsx'
        }],
        output: ''
    });

    // Örnekleri yükle
    useEffect(() => {
        const fetchExamples = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'codeExamples'));
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
    }, []);

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
                files: [{
                    name: '',
                    code: '',
                    language: 'jsx'
                }],
                output: ''
            });

            // Listeyi yenile
            const snapshot = await getDocs(collection(db, 'codeExamples'));
            const data = snapshot.docs.map(doc => {
                const docData = doc.data();
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
            console.error('Örnek eklenirken hata:', error);
            alert('Örnek eklenirken bir hata oluştu');
        }
    };

    // Örnek sil
    const handleDelete = async (id) => {
        if (!window.confirm('Bu örneği silmek istediğinize emin misiniz?')) return;
        try {
            await deleteDoc(doc(db, 'codeExamples', id));
            setExamples(examples.filter(example => example.id !== id));
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
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Kod Örnekleri</h2>

            {/* Yeni Örnek Formu */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                <div>
                    <label className="block text-sm font-medium mb-1">Başlık</label>
                    <input
                        type="text"
                        value={newExample.title}
                        onChange={(e) => setNewExample(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-800 rounded-lg"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Açıklama</label>
                    <textarea
                        value={newExample.description}
                        onChange={(e) => setNewExample(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-800 rounded-lg h-20"
                    />
                </div>

                {/* Dosyalar */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Dosyalar</h3>
                        <button
                            type="button"
                            onClick={addFile}
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
                        >
                            + Yeni Dosya
                        </button>
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
                                <button
                                    type="button"
                                    onClick={() => removeFile(index)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    Sil
                                </button>
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

                <div>
                    <label className="block text-sm font-medium mb-1">Çıktı (HTML/JSX)</label>
                    <textarea
                        value={newExample.output}
                        onChange={(e) => setNewExample(prev => ({ ...prev, output: e.target.value }))}
                        className="w-full px-4 py-2 bg-gray-800 rounded-lg h-40 font-mono"
                        placeholder="<div>Çıktı örneği</div>"
                        required
                    />
                </div>

                <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500"
                >
                    Örnek Ekle
                </button>
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
                            <button
                                onClick={() => handleDelete(example.id)}
                                className="text-red-400 hover:text-red-300"
                            >
                                Sil
                            </button>
                        </div>

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