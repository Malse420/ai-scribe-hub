import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Play, Trash } from "lucide-react";
import Editor from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { UserScript } from "@/types/script";
import { toast } from "sonner";

interface ScriptEditorContentProps {
  script: UserScript;
  setScript: (script: UserScript) => void;
  handleSave: () => void;
  handleDelete: () => void;
  handleEditorChange: (value: string | undefined) => void;
  editorOptions: editor.IStandaloneEditorConstructionOptions;
}

const ScriptEditorContent = ({
  script,
  setScript,
  handleSave,
  handleDelete,
  handleEditorChange,
  editorOptions,
}: ScriptEditorContentProps) => {
  const handleRun = async () => {
    try {
      // Create a new Function from the script content
      const scriptFunction = new Function(script.content);
      await scriptFunction();
      toast.success("Script executed successfully");
    } catch (error) {
      console.error("Script execution error:", error);
      toast.error("Failed to execute script: " + (error as Error).message);
    }
  };

  return (
    <CardContent className="space-y-4">
      <Input
        value={script.title}
        onChange={(e) => setScript({ ...script, title: e.target.value })}
        placeholder="Script name"
        className="mb-2"
      />
      <div className="h-[500px] border rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={script.content}
          onChange={handleEditorChange}
          options={editorOptions}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleDelete}>
          <Trash className="w-4 h-4 mr-2" />
          Delete
        </Button>
        <Button variant="outline" onClick={handleRun}>
          <Play className="w-4 h-4 mr-2" />
          Run
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </CardContent>
  );
};

export default ScriptEditorContent;