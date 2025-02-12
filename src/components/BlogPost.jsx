import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function BlogPost({ post }) {
    // Debug için tüm post verisini kontrol et
    console.log('BlogPost bileşenine gelen post:', post);

    if (!post) {
        console.log('Post verisi yok!');
        return null;
    }

    // Post içeriğini render et
    const renderContent = () => {
        // Blocks array'i var mı kontrol et
        if (!Array.isArray(post.blocks)) {
            console.log('Blocks array bulunamadı!');
            return null;
        }

        return post.blocks.map((block, index) => {
            console.log('Render edilen block:', block); // Her bloğu kontrol et

            if (block.type === 'code') {
                return (
                    <div key={index} className="my-6">
                        <div className="rounded-lg overflow-hidden bg-gray-800">
                            {/* Dil Bilgisi */}
                            <div className="bg-gray-700 px-4 py-2">
                                <span className="text-sm text-gray-300">
                                    {block.language || 'text'}
                                </span>
                            </div>

                            {/* Açıklama */}
                            {block.description && (
                                <div className="px-4 py-2 bg-gray-750 text-sm text-gray-300">
                                    {block.description}
                                </div>
                            )}

                            {/* Kod */}
                            <div className="p-4">
                                <SyntaxHighlighter
                                    language={block.language || 'text'}
                                    style={vscDarkPlus}
                                    showLineNumbers={true}
                                    customStyle={{
                                        margin: 0,
                                        background: 'transparent',
                                    }}
                                >
                                    {block.content || ''}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>
                );
            } else {
                // Text bloğu
                return (
                    <div key={index} className="my-6 prose prose-invert max-w-none">
                        <MDEditor.Markdown source={block.content || ''} />
                    </div>
                );
            }
        });
    };

    return (
        <article className="space-y-6">
            {/* Başlık */}
            <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

            {/* Kategoriler */}
            {post.categories && post.categories.length > 0 && (
                <div className="flex gap-2 mb-6">
                    {post.categories.map((category, index) => (
                        <span 
                            key={index}
                            className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                        >
                            {category}
                        </span>
                    ))}
                </div>
            )}

            {/* İçerik */}
            <div className="space-y-6">
                {renderContent()}
            </div>

            {/* Tarih */}
            {post.createdAt && (
                <div className="text-sm text-gray-400 mt-8">
                    {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                </div>
            )}
        </article>
    );
} 