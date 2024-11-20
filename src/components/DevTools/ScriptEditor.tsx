import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Play, Trash } from "lucide-react";
import { UserScript, saveScript, deleteScript } from "@/utils/scriptGeneration";

interface ScriptEditorProps {
  initialScript?: UserScript;
  onSave?: (script: UserScript) => void;
  onDelete?: (id: string) => void;
}

const ScriptEditor = ({ initialScript, onSave, onDelete }: ScriptEditorProps) => {
  const [script, setScript] = useState<UserScript>(
    initialScript || {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Script",
      description: "",
      code: "// Write your script here",
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    }
  );

  const handleSave = () => {
    const updatedScript = {
      ...script,
      modified: new Date().toISOString(),
    };
    saveScript(updatedScript);
    onSave?.(updatedScript);
  };

  const handleDelete = () => {
    if (script.id) {
      deleteScript(script.id);
      onDelete?.(script.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Script Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={script.name}
          onChange={(e) => setScript({ ...script, name: e.target.value })}
          placeholder="Script name"
          className="mb-2"
        />
        <textarea
          value={script.code}
          onChange={(e) => setScript({ ...script, code: e.target.value })}
          className="w-full h-64 p-2 font-mono text-sm border rounded-lg"
        />
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleDelete}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScriptEditor;