import React, { useState } from 'react';
import { CodeSnippet } from '../types';
import { Copy, Check } from './Icons';

interface CodeViewerProps {
  snippet: CodeSnippet;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ snippet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-brand-50 border border-brand-200 rounded-lg p-4 text-sm text-brand-900 shadow-sm">
        <p><strong className="text-brand-600">Explanation:</strong> {snippet.explanation}</p>
      </div>
      
      <div className="rounded-xl overflow-hidden border border-ui-border bg-gray-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-ui-border">
          <span className="text-xs font-mono text-gray-600 font-medium">{snippet.filename}</span>
          <button 
            onClick={handleCopy}
            className="text-gray-500 hover:text-gray-800 transition-colors flex items-center gap-1 text-xs font-medium"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm font-mono text-gray-800 leading-relaxed">
            <code>{snippet.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};