import { Handle, Position } from '@xyflow/react'
import React from 'react'
import { getIcon } from '@/lib/nodes'

interface NodeData {
  iconName?: string;
  toBeDeleted?: boolean;
}

function NodeMain({ data }: { data: NodeData }) {
  // eslint-disable-next-line react-hooks/static-components
  const Icon = getIcon(data?.iconName);
  const toBeDeleted = data?.toBeDeleted;
  
  return (
    <div 
      className="text-updater-node bg-background border-2 border-primary/50 rounded-lg p-2 transition-opacity"
      style={{ opacity: toBeDeleted ? 0.3 : 1 }}
    >
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Icon className="w-4 h-4 text-gray-600" />
      <Handle type="target" position={Position.Left} id="a" />
      <Handle type="source" position={Position.Right} id="b" />
      <Handle type="source" position={Position.Bottom} id="c" />
      <Handle type="target" position={Position.Top} id="d" />
    </div>
  )
}

export default NodeMain