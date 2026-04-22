import React from 'react';

export const ConfigPanel = ({ selectedNode, updateNodeData }) => {
  if (!selectedNode) return (
    <div className="w-80 border-l bg-white p-6 shadow-sm flex items-center justify-center text-gray-400 text-center">
      Click on any node on the canvas to configure its settings
    </div>
  );

  const handleChange = (e) => updateNodeData(selectedNode.id, e.target.name, e.target.value);

  return (
    <div className="w-80 border-l bg-white p-6 shadow-sm flex flex-col gap-5 overflow-y-auto">
      <div className="border-b pb-3">
        <h3 className="font-bold text-lg text-gray-800">Node Configuration</h3>
        <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{selectedNode.type} step</p>
      </div>
      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700">Title</label>
        <input name="label" value={selectedNode.data.label} onChange={handleChange} className="border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
      </div>

      {selectedNode.type === 'task' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Assignee</label>
          <input name="assignee" value={selectedNode.data.assignee || ''} onChange={handleChange} placeholder="e.g. John Doe" className="border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>
      )}

      {selectedNode.type === 'approval' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Approver Role</label>
          <select name="role" value={selectedNode.data.role || ''} onChange={handleChange} className="border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
            <option value="">Select Role...</option>
            <option value="Manager">Manager</option>
            <option value="HRBP">HRBP</option>
            <option value="Director">Director</option>
          </select>
        </div>
      )}

      {selectedNode.type === 'automated' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700">Action</label>
          <select name="action" value={selectedNode.data.action || ''} onChange={handleChange} className="border border-gray-300 p-2.5 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white">
            <option value="">Select Action...</option>
            <option value="Send Email">Send Email</option>
            <option value="Generate PDF">Generate PDF</option>
          </select>
        </div>
      )}
    </div>
  );
};