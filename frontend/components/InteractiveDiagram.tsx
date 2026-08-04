import React, { useState } from 'react';
import { DiagramData, DiagramNode } from '../types';
import { Database, Server, Smartphone, Zap, X } from './Icons';

interface InteractiveDiagramProps {
  data: DiagramData;
}

export const InteractiveDiagram: React.FC<InteractiveDiagramProps> = ({ data }) => {
  const [selectedNode, setSelectedNode] = useState<DiagramNode | null>(null);

  const getNodeIcon = (type?: string) => {
    switch (type) {
      case 'database': return <Database size={24} className="text-emerald-500" />;
      case 'server': return <Server size={24} className="text-brand-500" />;
      case 'client': return <Smartphone size={24} className="text-purple-500" />;
      default: return <Zap size={24} className="text-amber-500" />;
    }
  };

  const getCenter = (nodeId: string) => {
    const node = data.nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    const width = node.width || 160;
    const height = node.height || 80;
    return { x: node.x + width / 2, y: node.y + height / 2 };
  };

  return (
    <div className="relative w-full h-[600px] bg-ui-surface rounded-xl border border-ui-border overflow-hidden flex shadow-sm">
      
      {/* Diagram Area */}
      <div className="flex-1 relative overflow-auto bg-ui-bg/50">
        <svg width="1000" height="600" className="absolute top-0 left-0">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
            <marker id="arrowhead-animated" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
            </marker>
          </defs>

          {/* Edges */}
          {data.edges.map(edge => {
            const start = getCenter(edge.from);
            const end = getCenter(edge.to);
            
            return (
              <g key={edge.id}>
                <line 
                  x1={start.x} y1={start.y} 
                  x2={end.x} y2={end.y} 
                  stroke={edge.animated ? "#3b82f6" : "#94a3b8"} 
                  strokeWidth="2"
                  markerEnd={`url(#${edge.animated ? 'arrowhead-animated' : 'arrowhead'})`}
                  strokeDasharray={edge.animated ? "5,5" : "none"}
                  className={edge.animated ? "animate-[dash_1s_linear_infinite]" : ""}
                />
                {edge.label && (
                  <rect 
                    x={(start.x + end.x) / 2 - 45} 
                    y={(start.y + end.y) / 2 - 12} 
                    width="90" height="24" 
                    fill="#f8fafc" rx="4" 
                    stroke="#e2e8f0"
                  />
                )}
                {edge.label && (
                  <text 
                    x={(start.x + end.x) / 2} 
                    y={(start.y + end.y) / 2 + 4} 
                    textAnchor="middle" 
                    className="fill-gray-600 text-[10px] font-medium"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {data.nodes.map(node => {
            const width = node.width || 160;
            const height = node.height || 80;
            const isSelected = selectedNode?.id === node.id;

            return (
              <g 
                key={node.id} 
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <rect 
                  width={width} 
                  height={height} 
                  rx="12" 
                  className={`
                    fill-white stroke-2 transition-colors
                    ${isSelected ? 'stroke-brand-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'stroke-ui-border hover:stroke-gray-400'}
                  `}
                  style={{ filter: isSelected ? 'drop-shadow(0 4px 6px rgba(59, 130, 246, 0.2))' : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05))' }}
                />
                <foreignObject width={width} height={height}>
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                    <div className="mb-2 p-2 bg-gray-50 rounded-full border border-gray-100">
                      {getNodeIcon(node.type)}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 leading-tight">
                      {node.label}
                    </span>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dash {
            to { stroke-dashoffset: -10; }
          }
        `}} />
      </div>

      {/* Info Panel */}
      {selectedNode && (
        <div className="w-80 bg-ui-surface border-l border-ui-border p-6 flex flex-col animate-in slide-in-from-right-8 duration-300 shadow-lg z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                {getNodeIcon(selectedNode.type)}
              </div>
              <h3 className="text-lg font-bold text-gray-900">{selectedNode.label}</h3>
            </div>
            <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {selectedNode.description}
              </p>
            </div>
            
            {selectedNode.type === 'server' && (
              <div className="p-3 bg-brand-50 border border-brand-100 rounded-lg">
                <h4 className="text-xs font-semibold text-brand-600 mb-1">Tech Stack</h4>
                <p className="text-sm text-gray-800">Python, FastAPI, Uvicorn</p>
              </div>
            )}
            {selectedNode.type === 'database' && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                <h4 className="text-xs font-semibold text-emerald-600 mb-1">Schema</h4>
                <p className="text-sm text-gray-800">Users, Messages, Sessions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};