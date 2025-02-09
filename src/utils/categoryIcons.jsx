import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../components/icons/index';

// Kategori sıralaması
export const categoryOrder = [
    'önerilenler',
    'yeni',
    'html',
    'css',
    'javascript',
    'typescript',
    'python',
    'react',
    'nextjs',
    'vitejs',
    'vite',
    'visualstudiocode',
    'framermotion',
    'tailwind',
    'mobile',
    'responsive',
    'performance',
    'seo'
];

// Kategori ikonlarını Icon bileşeninden al
export const CATEGORY_ICONS = {
    react: <Icon name="react" />,
    javascript: <Icon name="javascript" />,
    python: <Icon name="python" />,
    vue: <Icon name="vue" />,
    angular: <Icon name="angular" />,
    html: <Icon name="html" />,
    css: <Icon name="css" />,
    typescript: <Icon name="typescript" />,
    nextjs: <Icon name="nextjs" />,
    vitejs: <Icon name="vitejs" className="lg:hidden flex"/>,
    vite: <Icon name="vite" className="lg:flex hidden" />,
    reactrouter: <Icon name="react-router" />,
    vscode: <Icon name="vscode" />,
    seo: <Icon name="seo" />,
    önerilenler: <Icon name="önerilenler" />,
    yeni: <Icon name="yeni" />,
    default: <Icon name="default" />,
    github: <Icon name="github" />,
    supabase: <Icon name="supabase" />,
    firebase: <Icon name="firebase" />,
    mongodb: <Icon name="mongodb" />,
    mysql: <Icon name="mysql" />,
    postgresql: <Icon name="postgresql" />,
    redis: <Icon name="redis" />,
    
    
};

export const CategoryIcon = ({ name, size = 'sm' }) => {
    const normalizedName = name?.toLowerCase().replace(/[\s.]/g, '') || '';
    return <Icon name={normalizedName} size={size} />;
};

CategoryIcon.propTypes = {
    name: PropTypes.string,
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl'])
};

CategoryIcon.defaultProps = {
    name: '',
    size: 'sm'
};

export default CategoryIcon; 