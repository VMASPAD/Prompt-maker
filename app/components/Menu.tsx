import { Button } from "gnome-ui";
import React, { useState } from "react";
import { PanelRight, X } from "lucide-react";
import { Drawer } from "gnome-ui/drawer";
import { Node } from "@xyflow/react";
import { navItems } from "@/lib/nodes";



interface MenuProps {
  node: (n: Node) => void;
}

function Menu({node}: MenuProps) {
  const btnBase =
    "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium leading-none transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50";

  const addNewNode = ({label, content, iconName}: {label: string, content: string, iconName: string}) => {
    const newNode: Node = {
      // eslint-disable-next-line react-hooks/purity
      id: `node-${Date.now()}`,
      // eslint-disable-next-line react-hooks/purity
      position: { x: Math.random() * 100, y: Math.random() * 100 },
      data: { label, content, iconName },
      type: "main",
    };
    node(newNode);
  }
  return (
    <div className="">
      <Drawer.Root swipeDirection="left">
        <Drawer.Trigger
          className={`${btnBase} absolute z-10 h-9 border border-border bg-card px-4 text-foreground hover:bg-accent`}
        >
          <PanelRight className="size-4 shrink-0 scale-x-[-1]" />
        </Drawer.Trigger>

        <Drawer.Portal className={"z-20 absolute"}>
          <Drawer.Backdrop className="fixed inset-0 min-h-dvh bg-black/40 backdrop-blur-sm transition-all duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
          <Drawer.Viewport className="fixed inset-0 flex justify-start">
            <Drawer.Popup className="flex h-full w-72 flex-col border-r border-border bg-sidebar shadow-2xl outline-none transition-transform duration-300 ease-out data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full">
              <Drawer.Content className="flex flex-1 flex-col overflow-y-auto">
                <div className="flex items-center gap-3 border-b border-sidebar-border px-4 py-4">
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-sidebar-foreground truncate">
                      Add new card
                    </p>
                  </div>
                  <Drawer.Close className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">
                    <X className="size-3.5" />
                  </Drawer.Close>
                </div>

                <div className="px-3 pb-1 pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Places
                  </p>
                </div>

                <div className="flex flex-col px-2">
                  {navItems.map(({ icon:Icon,title, img, content, index}) => (
                    <div
                      key={index}
                      className={`cursor-pointer hover:bg-accent-foreground/20 flex flex-col w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring `}
                      onClick={() => addNewNode({label: title, content, iconName: title})}
                    >
                      <Icon className="w-10 h-10" /> 
                      {title}
                    </div>
                  ))}
                </div>
              </Drawer.Content>

              <Drawer.Description className="border-t border-sidebar-border px-4 py-3 text-xs text-muted-foreground">
                
              </Drawer.Description>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}

export default Menu;
