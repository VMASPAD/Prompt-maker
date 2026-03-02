import React from "react";
import { Drawer } from "gnome-ui/drawer";
import { X, Trash } from "lucide-react";
import { EdgeProps } from "@xyflow/react";

const inputBase =
  " flex h-10 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium leading-none transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50";

interface EdgeNoteProps {
  edges: EdgeProps[];
  setEdges: React.Dispatch<React.SetStateAction<EdgeProps[]>>;
  openEdgeContent: boolean;
  setOpenEdgeContent: (open: boolean) => void;
  selectedEdge: EdgeProps | null;
}

function EdgeNote({
  edges,
  setEdges,
  openEdgeContent,
  setOpenEdgeContent,
  selectedEdge,
}: EdgeNoteProps) {
  const currentEdge = edges.find((e) => e.id === selectedEdge?.id) || selectedEdge;

  const handleDelete = () => {
    setEdges((eds) => eds.filter((e) => e.id !== currentEdge?.id));
    setOpenEdgeContent(false);
  };

  return (
    <Drawer.Root
      swipeDirection="right"
      open={openEdgeContent}
      onOpenChange={setOpenEdgeContent}
    >
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 min-h-dvh bg-black/40 backdrop-blur-sm transition-all duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
        <Drawer.Viewport className="fixed inset-0 flex justify-end">
          <Drawer.Popup className="flex h-full w-xl flex-col border-l border-border bg-card shadow-2xl outline-none transition-transform duration-300 ease-out data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full">
            <Drawer.Content className="flex flex-1 flex-col overflow-y-auto">
              <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <Drawer.Title className="flex-1 text-base font-semibold text-foreground">
                  Edge Content
                </Drawer.Title>
                <Drawer.Close className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">
                  <X className="size-4" />
                </Drawer.Close>
              </div>

              <div className="flex flex-col divide-y divide-border">
                <label className="flex flex-col gap-1 px-5 py-4">
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Label
                  </span>
                  <input
                    className={inputBase}
                    value={(currentEdge?.data?.label as string) || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEdges((eds) => eds.map((edge) => edge.id === currentEdge?.id ? { ...edge, data: { ...edge.data, label: val } } : edge));
                    }}
                    placeholder="Edge label..."
                  />
                </label>
                <label className="flex flex-col gap-1 px-5 py-4">
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Content
                  </span>
                  <textarea
                    className={inputBase + " min-h-[100px]"}
                    value={(currentEdge?.data?.content as string) || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEdges((eds) => eds.map((edge) => edge.id === currentEdge?.id ? { ...edge, data: { ...edge.data, content: val } } : edge));
                    }}
                    placeholder="Type something here..."
                  />
                </label>
                <div className="px-5 py-4">
                   <button onClick={handleDelete} className={`${btnBase} h-9 w-full bg-destructive text-destructive-foreground hover:brightness-95`}>
                     <Trash className="size-4 mr-2 text-current" />
                     Delete Edge
                   </button>
                </div>
              </div>
            </Drawer.Content>

            <div className="border-t border-border px-5 py-3">
              <Drawer.Close
                className={`${btnBase} h-9 w-full bg-primary text-primary-foreground hover:brightness-95`}
              >
                Close
              </Drawer.Close>
            </div>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export default EdgeNote;
