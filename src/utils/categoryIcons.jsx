import React from 'react';
import PropTypes from 'prop-types';
import { CategoryIcon } from '../components/icons/CategoryIcons';

// Kategori sıralaması
export const CATEGORY_ORDER = [
  'JavaScript',
  'React',
  'Vue',
  'Node.js',
  'Python',
  'Java',
  'Vite.js',
  'Next.js',
  'Visual Studio Code'
];

// Kategori ikonu bileşeni
export const Icon = ({ name, className }) => {
  return <CategoryIcon name={name} className={className} />;
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default Icon; 