import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Folder, Tag } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface ScriptTemplate {
  id: string;
  title: string;
  description?: string;
  content: string;
  category?: string;
  tags?: string[];
  is_public: boolean;
}

export const ScriptTemplateManager = () => {
  const [newTemplate, setNewTemplate] = useState<Partial<ScriptTemplate>>({
    title: "",
    content: "",
    category: "",
    tags: [],
    is_public: false
  });
  const [newTag, setNewTag] = useState("");
  const queryClient = useQueryClient();

  const { data: templates } = useQuery({
    queryKey: ["script-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("script_templates")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ScriptTemplate[];
    }
  });

  const createTemplate = useMutation({
    mutationFn: async (template: Partial<ScriptTemplate>) => {
      const { data, error } = await supabase
        .from("script_templates")
        .insert(template)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["script-templates"] });
      toast.success("Template created successfully");
      setNewTemplate({ title: "", content: "", category: "", tags: [] });
    },
    onError: () => {
      toast.error("Failed to create template");
    }
  });

  const handleAddTag = () => {
    if (!newTag) return;
    setNewTemplate(prev => ({
      ...prev,
      tags: [...(prev.tags || []), newTag]
    }));
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewTemplate(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Script Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Template Title"
              value={newTemplate.title}
              onChange={e => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
            />
            <div className="flex items-center space-x-2">
              <Folder className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Category"
                value={newTemplate.category}
                onChange={e => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center space-x-2">
              <Tag className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Add tag"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                onKeyPress={e => e.key === "Enter" && handleAddTag()}
              />
            </div>
            <Button onClick={handleAddTag} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Tag
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {newTemplate.tags?.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => handleRemoveTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
          <textarea
            className="w-full h-32 p-2 border rounded"
            placeholder="Template Content"
            value={newTemplate.content}
            onChange={e => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
          />
          <Button onClick={() => createTemplate.mutate(newTemplate)} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </div>

        <div className="mt-8 space-y-4">
          {templates?.map(template => (
            <Card key={template.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{template.title}</h3>
                  {template.category && (
                    <Badge variant="outline" className="mt-1">
                      <Folder className="w-3 h-3 mr-1" />
                      {template.category}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  {template.tags?.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};