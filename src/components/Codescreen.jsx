import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import PropTypes from 'prop-types';

// Dosya uzantılarına göre ikonlar
const fileIcons = {
  // React/Web
  'jsx': '⚛️',
  'tsx': '⚛️',
  'js': '📱',
  'ts': '📘',
  'html': '🌐',
  'css': '🎨',
  'scss': '🎨',
  'json': '📋',
  
  // Backend
  'php': '🐘',
  'py': '🐍',
  'rb': '💎',
  'java': '☕',
  
  // Config/Data
  'env': '⚙️',
  'yml': '⚙️',
  'yaml': '⚙️',
  'xml': '📰',
  'sql': '🗄️',
  'md': '📝',
  
  // Images
  'png': '🖼️',
  'jpg': '🖼️',
  'jpeg': '🖼️',
  'gif': '🖼️',
  'svg': '🎯',
  
  // Others
  'pdf': '📕',
  'zip': '📦',
  'exe': '⚡',
  'sh': '📜',
  'bat': '📜',
  
  // Default
  'folder': '📁',
  'default': '📄'
};

// Dosya ikonunu al
const getFileIcon = (fileName) => {
  if (!fileName.includes('.')) return fileIcons.default;
  const extension = fileName.split('.').pop().toLowerCase();
  return fileIcons[extension] || fileIcons.default;
};

export default function CodeScreen({ code, language, fileName, title = "Terminal" }) {
  // Dosya ağacını oluştur
  const renderFileTree = () => {
    if (!title.includes('/')) return null;

    const parts = title.split('/');
    const fileName = parts[parts.length - 1];
    const folders = parts.slice(0, -1);

    return (
      <div className="px-4 py-3 bg-gray-800/80 border-b border-blue-500/20 text-sm font-mono">
        <div className="text-blue-300/90">
          {folders.map((folder, index) => (
            <span key={index}>
              {index > 0 && <span className="text-gray-500 mx-1">→</span>}
              <span className="text-blue-400/90">
                <span className="mr-1">{fileIcons.folder}</span>
                {folder}
              </span>
            </span>
          ))}
          {folders.length > 0 && <span className="text-gray-500 mx-1">→</span>}
          <span className="text-blue-300">
            <span className="mr-1">{getFileIcon(fileName)}</span>
            {fileName}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-gray-400 text-sm">{title.includes('/') ? 'File Explorer' : title}</span>
      </div>

      {/* File Tree */}
      {renderFileTree()}

      {/* Code Content */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          backgroundColor: '#1e1e1e'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

CodeScreen.propTypes = {
  code: PropTypes.string.isRequired,
  language: PropTypes.string,
  fileName: PropTypes.string,
  title: PropTypes.string
};
