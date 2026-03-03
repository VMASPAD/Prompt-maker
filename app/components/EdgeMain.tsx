import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useInternalNode,
  EdgeProps,
} from '@xyflow/react';
  
export default function EdgeMain({ id, source, sourceX, sourceY, target, targetX, targetY, data, markerEnd }: EdgeProps) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  const toBeDeleted =
    data?.toBeDeleted || sourceNode?.data?.toBeDeleted || targetNode?.data?.toBeDeleted;
 
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ opacity: toBeDeleted ? 0.3 : 1, transition: 'opacity 0.2s' }}
      />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              opacity: toBeDeleted ? 0.3 : 1,
              transition: 'opacity 0.2s',
            }}
            className="nodrag nopan bg-background px-2 py-1 rounded-md text-xs border border-border"
          >
            {data.label as string}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}