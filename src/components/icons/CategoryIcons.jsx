import React from 'react';
import PropTypes from 'prop-types';

const ICON_SIZES = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10'
};

const CategoryIcon = ({ name, size = 'sm', className = '' }) => {
  const sizeClass = ICON_SIZES[size] || ICON_SIZES.sm;
  const combinedClassName = `${sizeClass} ${className} hidden md:block`.trim();

  // İkon adını normalize et
  const normalizedName = name?.toLowerCase()
    .replace('visual studio code', 'vscode')
    .replace('visualstudiocode', 'vscode')
    .replace('vitejs', 'vite')
    .replace('vite.js', 'vite')
    .replace('vite js', 'vite')
    .replace(/[\s.]/g, '') || '';

  const icons = {
    'vite': (
      <svg xmlns="http://www.w3.org/2000/svg" className={combinedClassName} viewBox="0 0 410 404" fill="none">
        <defs>
          <linearGradient id='#41D1FF' x1="-.828%" y1="7.652%" x2="57.636%" y2="78.411%">
            <stop offset="0%" stopColor="#41D1FF" />
            <stop offset="100%" stopColor="#BD34FE" />
          </linearGradient>
          <linearGradient id='#ffea83' x1="43.376%" y1="2.242%" x2="50.316%" y2="89.03%">
            <stop offset="0%" stopColor="#FFEA83" />
            <stop offset="8.333%" stopColor="#FFDD35" />
            <stop offset="100%" stopColor="#FFA800" />
          </linearGradient>
        </defs>
        <g transform="translate(2, 2) scale(0.09)">
          <path 
            fill='#BD34FE'
            d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 002.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62z"
          />
          <path 
            fill='#FFA800'
            d="M185.432.063L96.44 17.501a3.268 3.268 0 00-2.634 3.014l-5.474 92.456a3.268 3.268 0 003.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028 72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113z"
          />
        </g>
      </svg>
    ),
    'default': (
      <svg className={combinedClassName} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    )
  };

  return icons[normalizedName] || icons['default'];
};

CategoryIcon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  className: PropTypes.string
};

export default CategoryIcon; 