import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SelectorType, generateXPathSelector } from "@/utils/selectorUtils";
import { ElementHighlighter } from "../VisualSelector/ElementHighlighter";
import { useUser } from "@supabase/auth-helpers-react";

interface SelectedElement {
  element: Element;
  selector: string;
  type: SelectorType;
}

export const ElementSelector = () => {
  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
  const [selector, setSelector] = useState("");
  const [description, setDescription] = useState("");
  const [selectorType, setSelectorType] = useState<SelectorType>("css");
  const [selectionHistory, setSelectionHistory] = useState<SelectedElement[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { toast } = useToast();
  const user = useUser();

  const handleElementSelect = (element: HTMLElement) => {
    const newSelector = selectorType === "css" 
      ? generateSelector(element)
      : generateXPathSelector(element);

    const newElement: SelectedElement = {
      element,
      selector: newSelector,
      type: selectorType
    };

    setSelectedElements(prev => [...prev, newElement]);
    setSelector(newSelector);
    
    // Add to history
    const newHistory = [...selectionHistory.slice(0, historyIndex + 1), newElement];
    setSelectionHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousElement = selectionHistory[historyIndex - 1];
      setSelectedElements([previousElement]);
      setSelector(previousElement.selector);
    }
  };

  const handleRedo = () => {
    if (historyIndex < selectionHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextElement = selectionHistory[historyIndex + 1];
      setSelectedElements([nextElement]);
      setSelector(nextElement.selector);
    }
  };

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
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save selectors",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('element_selectors')
        .insert({
          selector,
          element_type: selectedElements[0]?.element.tagName.toLowerCase() || 'unknown',
          description,
          user_id: user.id,
          metadata: {
            selector_type: selectorType,
            is_group: selectedElements.length > 1,
            group_elements: selectedElements.map(el => ({
              selector: el.selector,
              type: el.type,
              tagName: el.element.tagName.toLowerCase()
            })),
            selection_history: selectionHistory.map(el => ({
              selector: el.selector,
              type: el.type
            }))
          }
        });

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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Label>Selector Type</Label>
            <Switch
              checked={selectorType === "xpath"}
              onCheckedChange={(checked) => setSelectorType(checked ? "xpath" : "css")}
            />
            <span>{selectorType.toUpperCase()}</span>
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={handleUndo}
              disabled={historyIndex <= 0}
            >
              Undo
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRedo}
              disabled={historyIndex >= selectionHistory.length - 1}
            >
              Redo
            </Button>
          </div>
        </div>

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

        {selectedElements.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Elements ({selectedElements.length})</Label>
            <ScrollArea className="h-[200px] rounded-md border p-2">
              {selectedElements.map((el, index) => (
                <Card key={index} className="mb-2 p-2">
                  <pre className="text-sm overflow-x-auto">
                    {el.element.outerHTML}
                  </pre>
                </Card>
              ))}
            </ScrollArea>
          </div>
        )}

        <Button onClick={saveSelector} disabled={!selector}>
          Save Selector
        </Button>

        <ElementHighlighter
          isActive={true}
          onElementSelect={handleElementSelect}
        />
      </CardContent>
    </Card>
  );
};