import React, { useState, useRef, useCallback } from 'react';
import { ReactFlowProvider, addEdge, useNodesState, useEdgesState } from 'reactflow';
import { X, CheckCircle2 } from 'lucide-react';
import 'reactflow/dist/style.css';

import { Sidebar } from './components/SideBar';
import { ConfigPanel } from './components/ConfigurationPanel';
import { CanvasArea } from './components/CanvasArea';

const HrWorkflow = () => {
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  
  const [simLogs, setSimLogs] = useState([]);
  const [showSim, setShowSim] = useState(false);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const dataString = event.dataTransfer.getData('application/reactflow');
    if (!dataString) return;
    
    const { type, label } = JSON.parse(dataString);
    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    const newNode = {
      id: `node_${new Date().getTime()}`,
      type, position, data: { label: label },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, setNodes]);

  const updateNodeData = (nodeId, key, value) => {
    setNodes((nds) => nds.map((node) => {
      if (node.id === nodeId) {
        return { ...node, data: { ...node.data, [key]: value } };
      }
      return node;
    }));
  };

 
  const [isSimulating, setIsSimulating] = useState(false);

  
  const clearCanvas = () => {
    if (window.confirm("Are you sure you want to clear the entire workspace?")) {
      setNodes([]);
      setEdges([]);
    }
  };

  const handleSimulate = async () => {
    const { validateWorkflow } = await import('./utils/workflowValidator');
    const validation = validateWorkflow(nodes, edges);
    
    if (!validation.isValid) {
      alert("Workflow Validation Failed:\n\n" + validation.errors.map((e, i) => `${i + 1}. ${e}`).join("\n"));
      return; 
    }

    setIsSimulating(true); 
    try {
      const { mockApi } = await import('./services/api');
      const payload = { nodes, edges };
      const response = await mockApi.simulateWorkflow(payload);
      
      setSimLogs(response.logs);
      setShowSim(true);
    } catch (error) {
      alert(error.message); 
    } finally {
      setIsSimulating(false); 
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 relative">
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center shrink-0 shadow-md z-20">
        <h1 className="font-bold text-xl tracking-tight">Tredence HR Workflow Designer</h1>
        <div className="flex gap-3">
          <button onClick={clearCanvas} className="bg-red-600 hover:bg-red-500 px-5 py-2 rounded text-sm font-bold transition-colors shadow">
            Clear Canvas
          </button>
          <button 
            onClick={handleSimulate} 
            disabled={isSimulating}
            className={`${isSimulating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'} px-5 py-2 rounded text-sm font-bold transition-colors shadow flex items-center gap-2`}
          >
            {isSimulating ? 'Processing on Server' : 'Simulate Workflow (Sandbox)'}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <CanvasArea 
          nodes={nodes} edges={edges} 
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onConnect={onConnect} setReactFlowInstance={setReactFlowInstance} 
          onDrop={onDrop} onDragOver={onDragOver} 
          setSelectedNodeId={setSelectedNodeId} reactFlowWrapper={reactFlowWrapper} 
        />
        <ConfigPanel 
          selectedNode={nodes.find(n => n.id === selectedNodeId)} 
          updateNodeData={updateNodeData} 
        />
      </div>

      {showSim && (
        <div className="absolute inset-0 bg-gray-900/40 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-[450px] max-h-[80vh] flex flex-col border border-gray-100 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                <CheckCircle2 className="text-green-500" size={24} />
                Execution Log Sandbox
              </h3>
              <button onClick={() => setShowSim(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-1 flex flex-col gap-3 bg-white">
              {simLogs.map((log, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-md text-sm text-gray-700 font-mono">
                  {log}
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex flex-col gap-3">
              <button onClick={() => setShowSim(false)} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700">
                Close Sandbox
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return <ReactFlowProvider><HrWorkflow /></ReactFlowProvider>;
}