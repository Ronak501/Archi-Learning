import React, { useState } from 'react';
import { FolderNode } from '../types';
import { FolderTree as FolderIcon, Code, ChevronRight } from './Icons';

interface FolderTreeProps {
  data: FolderNode[];
}

const TreeNode: React.FC<{ node: FolderNode; depth: number }> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFolder = node.type === 'folder';

  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-1.5 px-2 hover:bg-gray-50 rounded-md cursor-pointer group transition-colors`}
        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        <div className="w-4 h-4 mr-1.5 flex items-center justify-center text-gray-400">
          {isFolder && (
            <ChevronRight size={14} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          )}
        </div>
        
        {isFolder ? (
          <FolderIcon size={16} className="text-brand-500 mr-2" />
        ) : (
          <Code size={16} className="text-gray-500 mr-2" />
        )}
        
        <span className={`text-sm ${isFolder ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
          {node.name}
        </span>

        {node.description && (
          <span className="ml-4 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity truncate">
            — {node.description}
          </span>
        )}
      </div>

      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child, idx) => (
            <TreeNode key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FolderTreeViewer: React.FC<FolderTreeProps> = ({ data }) => {
  return (
    <div className="bg-ui-surface border border-ui-border rounded-xl p-4 font-mono overflow-x-auto shadow-sm">
      {data.map((node, idx) => (
        <TreeNode key={idx} node={node} depth={0} />
      ))}
    </div>
  );
};