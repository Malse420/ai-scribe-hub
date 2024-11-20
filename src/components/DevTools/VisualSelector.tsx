import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Crosshair, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ElementInfo {
  selector: string;
  element_type: string;
  description?: string;
}

export const VisualSelector = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedElement, setSelectedElement] = useState<ElementInfo | null>(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    const handleElementSelect = (event: MouseEvent) => {
      if (!isSelecting) return;
      
      event.preventDefault();
      event.stopPropagation();
      
      const element = event.target as HTMLElement;
      const selector = generateUniqueSelector(element);
      
      setSelectedElement({
        selector,
        element_type: element.tagName.toLowerCase(),
      });
      setIsSelecting(false);
    };

    if (isSelecting) {
      document.addEventListener("click", handleElementSelect, true);
      document.body.style.cursor = "crosshair";
    } else {
      document.removeEventListener("click", handleElementSelect, true);
      document.body.style.cursor = "default";
    }

    return () => {
      document.removeEventListener("click", handleElementSelect, true);
      document.body.style.cursor = "default";
    };
  }, [isSelecting]);

  const generateUniqueSelector = (element: HTMLElement): string => {
    // Start with the element's tag
    let selector = element.tagName.toLowerCase();
    
    // Add id if present
    if (element.id) {
      return `#${element.id}`;
    }
    
    // Add classes
    if (element.classList.length) {
      selector += `.${Array.from(element.classList).join('.')}`;
    }
    
    // Add position if needed
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children);
      const index = siblings.indexOf(element);
      selector += `:nth-child(${index + 1})`;
    }
    
    return selector;
  };

  const saveSelector = async () => {
    if (!selectedElement) {
      toast.error("No element selected");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in to save selectors");
      return;
    }

    try {
      const { error } = await supabase
        .from('element_selectors')
        .insert({
          selector: selectedElement.selector,
          element_type: selectedElement.element_type,
          description: description || undefined,
          user_id: user.id
        });

      if (error) throw error;

      toast.success("Selector saved successfully");
      setSelectedElement(null);
      setDescription("");
    } catch (error) {
      toast.error("Failed to save selector");
      console.error(error);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setIsSelecting(!isSelecting)}
          variant={isSelecting ? "destructive" : "default"}
        >
          <Crosshair className="w-4 h-4 mr-2" />
          {isSelecting ? "Cancel Selection" : "Select Element"}
        </Button>
        {selectedElement && (
          <Button onClick={saveSelector}>
            <Save className="w-4 h-4 mr-2" />
            Save Selector
          </Button>
        )}
      </div>

      {selectedElement && (
        <div className="space-y-2">
          <div>
            <label className="text-sm font-medium">Selector:</label>
            <Input value={selectedElement.selector} readOnly />
          </div>
          <div>
            <label className="text-sm font-medium">Element Type:</label>
            <Input value={selectedElement.element_type} readOnly />
          </div>
          <div>
            <label className="text-sm font-medium">Description (optional):</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this element..."
            />
          </div>
        </div>
      )}
    </Card>
  );
};