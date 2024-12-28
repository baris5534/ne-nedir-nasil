import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { motion } from "framer-motion";

const CodeDisplay = ({ title, code }) => {
  return (
    <motion.div
      className="w-full max-w-3xl bg-gray-900 rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}                                                                                                        
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
        <h3 className="text-sm text-gray-300 font-medium">{title}</h3>
      </div>

      {/* Code Section */}
      <div className="p-4">
        <SyntaxHighlighter
          language="javascript"
          style={dracula}
          showLineNumbers
          lineNumberStyle={{ color: "#4CAF50", marginRight: "10px" }}
          className="rounded-md text-sm"
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  );
};

export default CodeDisplay;
