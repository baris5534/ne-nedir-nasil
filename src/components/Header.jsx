import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-[80px] bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 z-40">
      <div className="flex items-center justify-between h-full px-4">
        <div className="lg:ml-[280px]">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              NE?
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
} 