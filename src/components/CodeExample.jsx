import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function CodeExample({ exampleId }) {
    const [example, setExample] = useState(null);
    const [activeTab, setActiveTab] = useState('preview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExample = async () => {
            try {
                const docRef = doc(db, 'codeExamples', exampleId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setExample(docSnap.data());
                }
            } catch (error) {
                console.error('Kod örneği yüklenirken hata:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExample();
    }, [exampleId]);

    if (loading) return <div className="animate-pulse h-40 bg-gray-800/50 rounded-lg" />;
    if (!example) return null;

    return (
        <div className="border border-blue-500/20 rounded-lg overflow-hidden bg-gray-800/50">
            {/* Tab Bar */}
            <div className="flex border-b border-blue-500/20">
                <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-2 ${
                        activeTab === 'preview' 
                            ? 'bg-blue-500/10 text-blue-400' 
                            : 'text-blue-400/60 hover:text-blue-400'
                    }`}
                >
                    Önizleme
                </button>
                <button
                    onClick={() => setActiveTab('code')}
                    className={`px-4 py-2 ${
                        activeTab === 'code' 
                            ? 'bg-blue-500/10 text-blue-400' 
                            : 'text-blue-400/60 hover:text-blue-400'
                    }`}
                >
                    Kod
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {activeTab === 'preview' ? (
                    <div className="prose prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: example.output }} />
                    </div>
                ) : (
                    <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm text-blue-200">
                            {example.code}
                        </code>
                    </pre>
                )}
            </div>

            {/* Description */}
            {example.description && (
                <div className="px-4 pb-4 text-sm text-blue-400/80">
                    {example.description}
                </div>
            )}
        </div>
    );
} 