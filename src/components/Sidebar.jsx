import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CategoryIcon from './icons/CategoryIcons';

export default function Sidebar({ isOpen, onClose, categories }) {
  return (
    <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed top-0 left-0 z-40 w-64 h-screen transition-transform`}>
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50">
        {/* ... diğer sidebar içeriği ... */}
        
        {/* Kategoriler */}
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category.id}>
              <Link
                to={`/category/${category.name}`}
                className="flex items-center p-2 text-base font-normal text-gray-200 rounded-lg hover:bg-gray-700"
                onClick={onClose}
              >
                <CategoryIcon name={category.name} className="w-6 h-6 text-blue-400" />
                <span className="ml-3">{category.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired
};