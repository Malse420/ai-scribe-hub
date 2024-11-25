import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Editor, { Monaco } from "@monaco-editor/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileCode, FileText, Paintbrush } from "lucide-react";
import { toast } from "sonner";

interface SourceViewerProps {
  html: string;
  css: string;
  javascript: string;
}

export const SourceViewer = ({ html, css, javascript }: SourceViewerProps) => {
  const [activeTab, setActiveTab] = useState("html");

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: "on" as const,
    readOnly: true,
    automaticLayout: true,
    wordWrap: "on" as const,
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const handleEditorMount = (editor: any, monaco: Monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => {
      handleCopy(activeTab === "html" ? html : activeTab === "css" ? css : javascript);
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCode className="w-5 h-5" />
          Source Code Viewer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="html" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              HTML
            </TabsTrigger>
            <TabsTrigger value="css" className="flex items-center gap-2">
              <Paintbrush className="w-4 h-4" />
              CSS
            </TabsTrigger>
            <TabsTrigger value="javascript" className="flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              JavaScript
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[600px] rounded-md border">
            <TabsContent value="html" className="m-0">
              <Editor
                height="600px"
                language="html"
                value={html}
                options={editorOptions}
                theme="vs-dark"
                onMount={handleEditorMount}
              />
            </TabsContent>
            <TabsContent value="css" className="m-0">
              <Editor
                height="600px"
                language="css"
                value={css}
                options={editorOptions}
                theme="vs-dark"
                onMount={handleEditorMount}
              />
            </TabsContent>
            <TabsContent value="javascript" className="m-0">
              <Editor
                height="600px"
                language="javascript"
                value={javascript}
                options={editorOptions}
                theme="vs-dark"
                onMount={handleEditorMount}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};