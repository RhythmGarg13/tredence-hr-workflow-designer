import React from 'react';

export const Sidebar = () => {
  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const buttons = [
    { type: 'start', label: 'Start Step', color: 'bg-green-100 border-green-500 text-green-800' },
    { type: 'task', label: 'Human Task', color: 'bg-blue-100 border-blue-500 text-blue-800' },
    { type: 'approval', label: 'Approval Gate', color: 'bg-amber-100 border-amber-500 text-amber-800' },
    { type: 'automated', label: 'Automated Action', color: 'bg-purple-100 border-purple-500 text-purple-800' }
  ];

  return (
    <aside className="w-64 border-r bg-white p-4 flex flex-col gap-4 shadow-sm z-10">
      <h2 className="font-bold text-lg mb-2">Workflow Nodes</h2>
      <p className="text-sm text-gray-500 mb-4">Drag nodes to the canvas</p>
      {buttons.map((btn) => (
        <div 
          key={btn.type} 
          onDragStart={(e) => onDragStart(e, btn.type, btn.label)} 
          draggable
          className={`p-3 border-2 rounded-lg cursor-grab text-sm font-semibold shadow-sm hover:shadow-md transition-shadow ${btn.color}`}
        >
          {btn.label}
        </div>
      ))}
    </aside>
  );
};