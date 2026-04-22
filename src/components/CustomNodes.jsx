import { Handle, Position } from 'reactflow';
import { Play, CheckSquare, UserCheck, Zap } from 'lucide-react';

const nodeStyles = {
  start: 'border-green-500 bg-green-50',
  task: 'border-blue-500 bg-blue-50',
  approval: 'border-amber-500 bg-amber-50',
  automated: 'border-purple-500 bg-purple-50'
};

const NodeWrapper = ({ title, type, icon: Icon, children }) => (
  <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 min-w-[150px] ${nodeStyles[type]}`}>
    <div className="flex items-center gap-2 mb-2">
      <Icon size={16} />
      <div className="font-bold text-sm">{title}</div>
    </div>
    <div className="text-xs text-gray-500">{children}</div>
  </div>
);

export const StartNode = ({ data }) => (
  <>
    <NodeWrapper title={data.label} type="start" icon={Play}>Entry Point</NodeWrapper>
    <Handle type="source" position={Position.Right} className="w-3 h-3" />
  </>
);

export const TaskNode = ({ data }) => (
  <>
    <Handle type="target" position={Position.Left} className="w-3 h-3" />
    <NodeWrapper title={data.label} type="task" icon={CheckSquare}>
      {data.assignee && <div>Assignee: {data.assignee}</div>}
    </NodeWrapper>
    <Handle type="source" position={Position.Right} className="w-3 h-3" />
  </>
);

export const ApprovalNode = ({ data }) => (
  <>
    <Handle type="target" position={Position.Left} className="w-3 h-3" />
    <NodeWrapper title={data.label} type="approval" icon={UserCheck}>
      {data.role && <div>Role: {data.role}</div>}
    </NodeWrapper>
    <Handle type="source" position={Position.Right} className="w-3 h-3" />
  </>
);

export const AutomatedNode = ({ data }) => (
  <>
    <Handle type="target" position={Position.Left} className="w-3 h-3" />
    <NodeWrapper title={data.label} type="automated" icon={Zap}>
      {data.action && <div>Action: {data.action}</div>}
    </NodeWrapper>
    <Handle type="source" position={Position.Right} className="w-3 h-3" />
  </>
);

export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
};