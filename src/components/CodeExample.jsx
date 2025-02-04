import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Özel CSS
const codeStyles = `
  .shiki {
    background: #282A36 !important; /* Dracula arka plan */
    border-radius: 8px;
    padding: 1rem !important;
    font-family: 'Fira Code', monospace !important;
    font-size: 14px !important;
    line-height: 1.6 !important;
  }

  .line-numbers {
    color: #6272A4; /* Dracula yorum rengi */
    user-select: none;
  }

  .code-container {
    position: relative;
    background: #282A36;
    border-radius: 8px;
    overflow: hidden;
  }

  .code-header {
    background: #21222C;
    border-bottom: 1px solid #44475A;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    color: #6272A4;
  }
`;

export default function CodeExample({ example }) {
    const [activeTab, setActiveTab] = useState('preview');
    const [isExpanded, setIsExpanded] = useState(false);

    const renderCode = (code, language = 'jsx') => {
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
        <motion.div 
            className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-gray-800"
            layout
        >
            {/* Başlık ve Açıklama */}
            <div className="p-6 border-b border-gray-800">
                <h3 className="font-medium text-xl text-gray-200">{example.title}</h3>
                {example.description && (
                    <p className="text-gray-400 mt-2">{example.description}</p>
                )}
            </div>

            {/* Sekmeler */}
            <div className="border-b border-gray-800">
                <div className="flex">
                    <motion.button
                        onClick={() => setActiveTab('preview')}
                        className={`px-6 py-3 relative ${activeTab === 'preview' ? 'text-blue-400' : 'text-gray-400'}`}
                        whileHover={{ color: '#60A5FA' }}
                    >
                        Önizleme
                        {activeTab === 'preview' && (
                            <motion.div 
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                                layoutId="activeTab"
                            />
                        )}
                    </motion.button>
                    <motion.button
                        onClick={() => setActiveTab('code')}
                        className={`px-6 py-3 relative ${activeTab === 'code' ? 'text-blue-400' : 'text-gray-400'}`}
                        whileHover={{ color: '#60A5FA' }}
                    >
                        Kod
                        {activeTab === 'code' && (
                            <motion.div 
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                                layoutId="activeTab"
                            />
                        )}
                    </motion.button>
                </div>
            </div>

            {/* İçerik */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="p-6"
                >
                    {activeTab === 'preview' ? (
                        <div className="bg-[#0D0D0D] rounded-lg p-4">
                            {/* StackBlitz Önizleme */}
                            {example.stackblitzUrl && (
                                <motion.div
                                    layout
                                    className="rounded-lg overflow-hidden"
                                    animate={{ height: isExpanded ? 500 : 300 }}
                                >
                                    <iframe
                                        src={`${example.stackblitzUrl}?embed=1&view=preview&hideNavigation=1`}
                                        className="w-full h-full border-0"
                                        title={example.title}
                                        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                                        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                                    />
                                </motion.div>
                            )}
                            {/* Genişlet/Daralt butonu */}
                            <motion.button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-4 text-sm text-gray-400 hover:text-gray-300 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isExpanded ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                        Daralt
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                        Genişlet
                                    </>
                                )}
                            </motion.button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {example.files.map((file, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-400">
                                            {file.name}
                                        </span>
                                        <motion.a
                                            href={example.stackblitzUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                            whileHover={{ x: 2 }}
                                        >
                                            Düzenle
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </motion.a>
                                    </div>
                                    <motion.div 
                                        className="relative"
                                        whileHover={{ scale: 1.01 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {renderCode(file.code, file.name.split('.').pop())}
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
} 