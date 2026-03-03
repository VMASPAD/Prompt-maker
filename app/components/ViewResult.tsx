import React, { useEffect, useState } from 'react'
import { Dialog } from 'gnome-ui/dialog';
import { X, Pencil, Notebook } from 'lucide-react';
import TurndownService from 'turndown';
import Editor from './Editor';
import { Tabs } from "gnome-ui/tabs";

const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium leading-none transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50';
const inputBase =
  "flex min-h-[300px] w-full resize-none rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground shadow-sm transition-colors focus-visible:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ViewResult({ nodes, edges }: { nodes: any[], edges: any[] }) {
  const [htmlComplete, setHtmlComplete] = useState<string>('');
  const [markdownComplete, setMarkdownComplete] = useState<string>('');

  const getTextComplete = () => {
    if (!nodes || nodes.length === 0) {
      setHtmlComplete("");
      setMarkdownComplete("");
      return;
    }

    let rootNode = nodes.find((n) => !(edges || []).some((e) => e.target === n.id));
    if (!rootNode) rootNode = nodes[0];

    let resultHtml = "";
    let currentNode = rootNode;
    const visitedNodes = new Set();
    
    while (currentNode && !visitedNodes.has(currentNode.id)) {
      visitedNodes.add(currentNode.id);
      
      const content = currentNode.data?.content || "";
      if (typeof content === "string" && content.trim() !== "") {
        resultHtml += content.trim() + "<br><br>";
      }

      const outgoingEdge = (edges || []).find((e) => e.source === currentNode.id);
      if (outgoingEdge) {
        const edgeContent = outgoingEdge.data?.content || "";
        if (typeof edgeContent === "string" && edgeContent.trim() !== "") {
          resultHtml += edgeContent.trim() + "<br><br>";
        }
        currentNode = nodes.find((n) => n.id === outgoingEdge.target);
      } else {
        currentNode = undefined;
      }
    }

    const finalHtml = resultHtml;
    setHtmlComplete(finalHtml);
    
    // Convert to Markdown
    try {
      const turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
      const md = turndownService.turndown(finalHtml);
      setMarkdownComplete(md);
    } catch (e) {
      setMarkdownComplete(finalHtml); // fallback
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getTextComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges])

  const hasContent = nodes && nodes.length > 0;

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className={`${btnBase} relative h-10 px-4 shadow-md ${
          hasContent
            ? 'bg-primary text-primary-foreground hover:brightness-95'
            : 'border border-border bg-card text-foreground hover:bg-accent'
        }`}
        title="Assemble and view your final AI prompt"
      >
        {/* Pulsing dot when there is content ready */}
        {hasContent && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-60" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-foreground opacity-90" />
          </span>
        )}
        <Notebook className="size-4 shrink-0" />
        <span>View Prompt</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 min-h-dvh py-8 overflow-y-auto bg-black/40 backdrop-blur-sm transition-all duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute flex justify-center items-center z-50">
          <Dialog.Popup className="w-full max-w-2xl mx-auto overflow-hidden rounded-xl border border-border bg-card shadow-xl outline-none transition-all duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Pencil className="size-4 shrink-0 text-primary" />
              <Dialog.Title className="flex-1 text-base font-semibold text-foreground">
                Final Content
              </Dialog.Title>
              <Dialog.Close className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">
                <X className="size-4" />
              </Dialog.Close>
            </div>

            <div className="flex flex-col px-5 py-4">
              <Dialog.Description className="text-sm leading-relaxed text-muted-foreground mb-4">
                This is the accumulated output generated from your flow diagram.
              </Dialog.Description> 

              <Tabs.Root defaultValue="preview" className="w-full">
                <Tabs.List className="flex rounded-xl bg-muted p-1 mb-4">
                  <Tabs.Tab value="preview" className={
                            "flex-1 items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-all text-muted-foreground " +
                            "data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-sm"
                          }
                  >
                    Visual Preview
                  </Tabs.Tab>
                  <Tabs.Tab value="code" className={
                            "flex-1 items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-all text-muted-foreground " +
                            "data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-sm"
                          }
                  >
                    Markdown Code
                  </Tabs.Tab>
                  <Tabs.Indicator /> 
                </Tabs.List>

                <Tabs.Panel value="preview" className="outline-none">
                  <Editor text={htmlComplete} />
                </Tabs.Panel>
                
                <Tabs.Panel value="code" className="outline-none pt-2">
                  <textarea
                    readOnly
                    className={inputBase}
                    value={markdownComplete} 
                  />
                  <div className="mt-2 text-right">
                   <button 
                     onClick={() => {
                        navigator.clipboard.writeText(markdownComplete);
                        alert("Copied to clipboard!");
                     }}
                     className={`${btnBase} h-8 bg-primary/10 px-3 text-xs text-primary hover:bg-primary/20`}
                   >
                     Copy Markdown
                   </button>
                  </div>
                </Tabs.Panel>
              </Tabs.Root>
            </div>
            
            <div className="flex justify-end gap-2 border-t border-border bg-muted/30 px-5 py-4">
              <Dialog.Close className={`${btnBase} h-9 border border-border bg-card px-4 text-foreground hover:bg-accent`}>
                Close
              </Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Backdrop>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default ViewResult