import React from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { nodeTypes } from './CustomNodes';

export const CanvasArea = ({ 
  nodes, edges, onNodesChange, onEdgesChange, onConnect, 
  setReactFlowInstance, onDrop, onDragOver, setSelectedNodeId, reactFlowWrapper 
}) => {
  return (
    <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange}
        onConnect={onConnect} 
        onInit={setReactFlowInstance} 
        onDrop={onDrop} 
        onDragOver={onDragOver}
        onSelectionChange={(elements) => setSelectedNodeId(elements.nodes[0]?.id || null)}
        nodeTypes={nodeTypes} 
        fitView
      >
        <Background color="#cbd5e1" gap={16} size={2} />
        <Controls />
        <MiniMap zoomable pannable className="border-2 border-gray-200 rounded-md shadow-sm" />
      </ReactFlow>
    </div>
  );
};