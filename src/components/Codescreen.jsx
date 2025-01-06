import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeScreen({ code, title = "Terminal" }) {
  return (
    <div className="rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-gray-400 text-sm">{title}</span>
      </div>
      <SyntaxHighlighter
        language="javascript"
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
