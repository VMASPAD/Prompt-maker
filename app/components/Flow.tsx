/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react";
import useUndoable from "use-undoable";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  EdgeProps,
  Panel,
  Node,
  Controls,
  ReactFlowProvider,
  SelectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Menu from "./Menu";
import DataNote from "./DataNote";
import ViewResult from "./ViewResult";
import NodeMain from "./NodeMain";
import { MousePointer2, Eraser as EraserIcon, Lasso, Undo2, Redo2 } from "lucide-react";
import EdgeMain from "./EdgeMain";
import EdgeNote from "./EdgeNote";
import { Tooltip } from "gnome-ui/tooltip";
import { Eraser } from "./Eraser";
import { useTour } from "./useTour";
import { MarkerType } from "@xyflow/react";
export default function Flow() {
  const initialNodes: Node[] = [];
  const initialEdges: EdgeProps[] = [];
  const edgeTypes = {
    EdgeMain: EdgeMain,
  };
  const defaultEdgeOptions = {
    markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
  };
  const [elements, setElements, { undo, canUndo, redo, canRedo }] = useUndoable(
    { nodes: initialNodes as Node[], edges: [] as EdgeProps[] },
    {
      behavior: "destroyFuture",
    }
  );
  
  const nodes = elements.nodes;
  const edges = elements.edges;

  const triggerUpdate = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (t: any, v: any, ignore = false) => {
      setElements(
        (e: any) => ({
          nodes: t === "nodes" ? v : e.nodes,
          edges: t === "edges" ? v : e.edges,
        }),
        "destroyFuture",
        ignore
      );
    },
    [setElements]
  );

  const setNodes = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (action: any) => {
      setElements((e: any) => ({
        ...e,
        nodes: typeof action === "function" ? action(e.nodes) : action,
      }));
    },
    [setElements]
  );

  const setEdges = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (action: any) => {
      setElements((e: any) => ({
        ...e,
        edges: typeof action === "function" ? action(e.edges) : action,
      }));
    },
    [setElements]
  );
  const [openContent, setOpenContent] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [openEdgeContent, setOpenEdgeContent] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<EdgeProps | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toolMode, setToolMode] = useState<"default" | "lasso" | "eraser">(
    "default",
  );

  useTour(isLoaded);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isWiping, setIsWiping] = useState(false);
  const [clipboard, setClipboard] = useState<Node[]>([]);

  // Keyboard Shortcuts for Copy/Paste
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if we aren't typing in an input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && toolMode === "lasso") {
        if (e.key === 'c') {
          const selectedNodes = nodes.filter(n => n.selected);
          if (selectedNodes.length > 0) {
            setClipboard(selectedNodes);
          }
        } else if (e.key === 'v') {
          if (clipboard.length > 0) {
            const newNodes = clipboard.map(node => ({
              ...node,
              id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              position: {
                x: node.position.x + 50,
                y: node.position.y + 50
              },
              selected: true,
            }));
            
            setNodes((nds: Node[]) => {
              // Deselect current nodes
              const unselectedNodes = nds.map((n: Node) => ({...n, selected: false}));
              return [...unselectedNodes, ...newNodes];
            });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, clipboard, toolMode, setNodes]);

  // Global mouse up to catch when user releases mouse outside of nodes/edges
  useEffect(() => {
    const handleMouseUp = () => setIsWiping(false);
    window.addEventListener("pointerup", handleMouseUp);
    return () => window.removeEventListener("pointerup", handleMouseUp);
  }, []);

  useEffect(() => {
    const savedNodes = localStorage.getItem("flow-nodes");
    const savedEdges = localStorage.getItem("flow-edges");
    if (savedNodes) {
      try {
        setNodes(JSON.parse(savedNodes));
      } catch (_e) {
        setNodes(initialNodes);
      }
    }
    if (savedEdges) {
      try {
        setEdges(JSON.parse(savedEdges));
      } catch (_e) {
        setEdges(initialEdges);
      }
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("flow-nodes", JSON.stringify(nodes));
      localStorage.setItem("flow-edges", JSON.stringify(edges));
    }
  }, [nodes, edges, isLoaded]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleKeyPress = (event: any) => {
    // Solo manejar si no estamos escribiendo en un input
    if (['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement).tagName)) {
      return;
    }

    if (canUndo && event.ctrlKey && event.keyCode === 90) {
      if (event.shiftKey) redo(); 
      else undo();
    } else if (canRedo && event.ctrlKey && event.keyCode === 89) {
      redo();
    }
  };

  const onNodesChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (changes: any) => {
      if (!changes || changes.length === 0) return;
      let ignore = ["dimensions", "position"].includes(changes[0].type);

      if (!changes[0].dragging && changes[0].type === "position") {
        ignore = false;
      }
      
      triggerUpdate("nodes", applyNodeChanges(changes, elements.nodes), ignore);
    },
    [triggerUpdate, elements.nodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) => {
      if (!changes || changes.length === 0) return;
      const ignore = ["select"].includes(changes[0].type);
      triggerUpdate("edges", applyEdgeChanges(changes, elements.edges), ignore);
    },
    [triggerUpdate, elements.edges]
  );
  const onConnect = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (connection: any) => {
      setElements((e: any) => ({
        ...e,
        edges: addEdge(connection, e.edges),
      }));
    },
    [setElements]
  );

  const getNewNode = (node: Node) => {
    setNodes((prevNodes: Node[]) => [...prevNodes, node]);
  };
  const popupCls =
    "rounded-xl bg-[oklch(0.25_0.02_330)] px-2.5 py-1.5 text-xs font-medium text-white shadow-lg outline-none transition-all duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 origin-[var(--transform-origin)]";
  const nodeTypes = { main: NodeMain };
  return (
    <div className="w-screen h-screen">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onKeyDown={handleKeyPress}
          panOnDrag={toolMode === "default" || toolMode === "eraser"}
          selectionOnDrag={toolMode === "lasso"}
          selectionMode={SelectionMode.Partial}
          panOnScroll={true}
          onNodeClick={(event, node) => {
            if (toolMode === "eraser") return;
            setSelectedNode(node);
            setOpenContent(true);
          }}
          onEdgeClick={(event, edge) => {
            if (toolMode === "eraser") return;
            setSelectedEdge(edge as EdgeProps);
            setOpenEdgeContent(true);
          }}
          fitView
        >
          <Panel
            position="top-center"
            id="tour-toolbar"
            className="bg-background border border-border rounded-xl shadow-sm flex items-center p-1 gap-1"
          >
            <Tooltip.Provider delay={300}> 
                <Tooltip.Root>
                  <Tooltip.Trigger
                    onClick={() => undo()}
                    disabled={!canUndo}
                    className={`p-2 rounded-lg transition-colors hover:bg-accent text-muted-foreground disabled:opacity-50`}
                  >
                    <Undo2 className="size-4" />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Positioner side="bottom" sideOffset={8}>
                      <Tooltip.Popup className={popupCls}>
                        <Tooltip.Arrow />
                        Undo
                      </Tooltip.Popup>
                    </Tooltip.Positioner>
                  </Tooltip.Portal>
                </Tooltip.Root> 
            </Tooltip.Provider>
            
            <Tooltip.Provider delay={300}> 
                <Tooltip.Root>
                  <Tooltip.Trigger
                    onClick={() => redo()}
                    disabled={!canRedo}
                    className={`p-2 rounded-lg transition-colors hover:bg-accent text-muted-foreground disabled:opacity-50`}
                  >
                    <Redo2 className="size-4" />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Positioner side="bottom" sideOffset={8}>
                      <Tooltip.Popup className={popupCls}>
                        <Tooltip.Arrow />
                        Redo
                      </Tooltip.Popup>
                    </Tooltip.Positioner>
                  </Tooltip.Portal>
                </Tooltip.Root> 
            </Tooltip.Provider>

            <div className="w-px h-4 bg-border mx-1" />
            <Tooltip.Provider delay={300}> 
                <Tooltip.Root>
                  <Tooltip.Trigger
                    onClick={() => setToolMode("default")}
                    className={`p-2 rounded-lg transition-colors ${toolMode === "default" ? "bg-primary/10 text-primary" : "hover:bg-accent text-muted-foreground"}`}
                  >
                    <MousePointer2 className="size-4" />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Positioner side="bottom" sideOffset={8}>
                      <Tooltip.Popup className={popupCls}>
                        <Tooltip.Arrow />
                        Edit Nodes
                      </Tooltip.Popup>
                    </Tooltip.Positioner>
                  </Tooltip.Portal>
                </Tooltip.Root> 
            </Tooltip.Provider>
            <Tooltip.Provider delay={300}> 
                <Tooltip.Root>
                  <Tooltip.Trigger
                    onClick={() => setToolMode("lasso")}
                    className={`p-2 rounded-lg transition-colors ${toolMode === "lasso" ? "bg-primary/10 text-primary" : "hover:bg-accent text-muted-foreground"}`}
                  >
              <Lasso className="size-4" />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Positioner side="bottom" sideOffset={8}>
                      <Tooltip.Popup className={popupCls}>
                        <Tooltip.Arrow />
                        Select
                      </Tooltip.Popup>
                    </Tooltip.Positioner>
                  </Tooltip.Portal>
                </Tooltip.Root> 
            </Tooltip.Provider>
                        <Tooltip.Provider delay={300}> 
                <Tooltip.Root>
                  <Tooltip.Trigger
                    onClick={() => setToolMode("eraser")}
                    className={`p-2 rounded-lg transition-colors ${toolMode === "eraser" ? "bg-destructive/10 text-destructive" : "hover:bg-accent text-muted-foreground"}`}
                  >
              <EraserIcon className="size-4" />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Positioner side="bottom" sideOffset={8}>
                      <Tooltip.Popup className={popupCls}>
                        <Tooltip.Arrow />
                        Delete
                      </Tooltip.Popup>
                    </Tooltip.Positioner>
                  </Tooltip.Portal>
                </Tooltip.Root> 
            </Tooltip.Provider>
          </Panel>
          <Panel position="top-left" >
            <Menu node={getNewNode} />
          </Panel>
          <Panel position="bottom-right" id="tour-view-result">
            <ViewResult nodes={nodes} edges={edges} />
          </Panel>
          <Background />
          <Controls />
          {toolMode === "eraser" && <Eraser />}
        </ReactFlow>
        <DataNote
          nodes={nodes}
          setNodes={setNodes}
          openContent={openContent}
          setOpenContent={setOpenContent}
          selectedNode={selectedNode}
        />
        <EdgeNote
          edges={edges}
          setEdges={setEdges}
          openEdgeContent={openEdgeContent}
          setOpenEdgeContent={setOpenEdgeContent}
          selectedEdge={selectedEdge}
        />
      </ReactFlowProvider>
    </div>
  );
}
