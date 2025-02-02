import React, { useState } from 'react';
import PropTypes from 'prop-types';

export function Tabs({ children, defaultValue }) {
    const [activeTab, setActiveTab] = useState(defaultValue);

    const tabs = [];
    const contents = [];

    // Children'ları ayır
    React.Children.forEach(children, (child) => {
        if (child.type === TabsList) tabs.push(child);
        if (child.type === TabsContent) contents.push(child);
    });

    const context = { activeTab, setActiveTab };

    return (
        <div className="w-full">
            {tabs.map((tab, i) => (
                React.cloneElement(tab, { ...context, key: i })
            ))}
            {contents.map((content, i) => (
                React.cloneElement(content, { ...context, key: i })
            ))}
        </div>
    );
}

export function TabsList({ children, activeTab, setActiveTab }) {
    return (
        <div className="flex space-x-1 border-b border-blue-500/20 mb-4">
            {React.Children.map(children, (child) =>
                React.cloneElement(child, { activeTab, setActiveTab })
            )}
        </div>
    );
}

export function Tab({ children, value, activeTab, setActiveTab }) {
    return (
        <button
            onClick={() => setActiveTab(value)}
            className={`px-4 py-2 rounded-t-lg ${
                activeTab === value
                    ? 'bg-blue-500/10 text-blue-400'
                    : 'text-blue-400/60 hover:text-blue-400'
            }`}
        >
            {children}
        </button>
    );
}

export function TabsContent({ children, value, activeTab }) {
    if (value !== activeTab) return null;
    return <div>{children}</div>;
}

// PropTypes
Tabs.propTypes = {
    children: PropTypes.node.isRequired,
    defaultValue: PropTypes.string.isRequired
};

TabsList.propTypes = {
    children: PropTypes.node.isRequired,
    activeTab: PropTypes.string,
    setActiveTab: PropTypes.func
};

Tab.propTypes = {
    children: PropTypes.node.isRequired,
    value: PropTypes.string.isRequired,
    activeTab: PropTypes.string,
    setActiveTab: PropTypes.func
};

TabsContent.propTypes = {
    children: PropTypes.node.isRequired,
    value: PropTypes.string.isRequired,
    activeTab: PropTypes.string
}; 