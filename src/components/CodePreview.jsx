import { useState, useEffect } from 'react';
import CategoryIcon from './icons/CategoryIcons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function CodePreview({ exampleId }) {
    const [example, setExample] = useState(null);
    const [activeTab, setActiveTab] = useState('preview'); // 'preview' veya 'code'

    useEffect(() => {
        let isMounted = true;

        const fetchExample = async () => {
            try {
                const docRef = doc(db, 'codeExamples', exampleId);
                const docSnap = await getDoc(docRef);
                if (isMounted && docSnap.exists()) {
                    setExample(docSnap.data());
                }
            } catch (error) {
                console.error('Error fetching example:', error);
            }
        };

        if (exampleId) {
            fetchExample();
        }

        return () => {
            isMounted = false;
        };
    }, [exampleId]);

    if (!example) return null;

    const CustomButton = () => (
        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 
                         hover:from-blue-600 hover:to-indigo-600 
                         text-white font-medium rounded-lg
                         transform hover:scale-105 transition-all duration-300
                         shadow-lg hover:shadow-blue-500/25">
            Harika Buton
        </button>
    );

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
                    <div className="flex flex-wrap gap-4 items-center">
                        <CustomButton />
                    </div>
                ) : (
                    <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm text-blue-200">
{`// Gradient ve Hover Efektli Buton
<button 
    className="px-6 py-3 
              bg-gradient-to-r from-blue-500 to-indigo-500 
              hover:from-blue-600 hover:to-indigo-600 
              text-white font-medium rounded-lg
              transform hover:scale-105 transition-all duration-300
              shadow-lg hover:shadow-blue-500/25"
>
    Harika Buton
</button>`}
                        </code>
                    </pre>
                )}
            </div>
        </div>
    );
} 