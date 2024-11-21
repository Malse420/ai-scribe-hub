import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const ElementSelector = () => {
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [selector, setSelector] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      e.preventDefault();
      const target = e.target as Element;
      target.classList.add('ai-scribe-highlight');
    };

    const handleMouseOut = (e: MouseEvent) => {
      e.preventDefault();
      const target = e.target as Element;
      target.classList.remove('ai-scribe-highlight');
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      const target = e.target as Element;
      setSelectedElement(target);
      const generatedSelector = generateSelector(target);
      setSelector(generatedSelector);
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const generateSelector = (element: Element): string => {
    // Generate a unique selector for the element
    const id = element.id;
    if (id) return `#${id}`;

    const classes = Array.from(element.classList).join('.');
    if (classes) return `.${classes}`;

    let selector = element.tagName.toLowerCase();
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(element);
      selector += `:nth-child(${index + 1})`;
    }

    return selector;
  };

  const saveSelector = async () => {
    try {
      const { error } = await supabase
        .from('element_selectors')
        .insert([
          {
            selector,
            element_type: selectedElement?.tagName.toLowerCase() || 'unknown',
            description,
            metadata: {
              innerHTML: selectedElement?.innerHTML,
              outerHTML: selectedElement?.outerHTML,
            }
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Selector saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save selector",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <Label>Current Selector</Label>
          <Input value={selector} onChange={(e) => setSelector(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Input 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe this selector's purpose..."
          />
        </div>

        {selectedElement && (
          <div className="space-y-2">
            <Label>Selected Element Preview</Label>
            <Card className="p-2 bg-secondary/10">
              <pre className="text-sm overflow-x-auto">
                {selectedElement.outerHTML}
              </pre>
            </Card>
          </div>
        )}

        <Button onClick={saveSelector} disabled={!selector}>
          Save Selector
        </Button>
      </CardContent>
    </Card>
  );
};