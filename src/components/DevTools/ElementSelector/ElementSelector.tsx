import { useState, useCallback, useEffect } from "react";
import { Eye, Target, Save, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAIAssistant } from "@/contexts/AIAssistantContext";

interface SelectedElement {
  selector: string;
  element: HTMLElement;
  label?: string;
}

export const ElementSelector = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
  const [selectorHistory, setSelectorHistory] = useState<SelectedElement[]>([]);
  const { processQuery } = useAIAssistant();

  const handleElementSelect = useCallback(async (element: HTMLElement) => {
    try {
      const selector = await processQuery(
        `Generate a precise CSS selector for this element: ${element.outerHTML}`
      );

      const newElement = { selector, element };
      setSelectedElements((prev) => [...prev, newElement]);
      toast.success("Element selected");
    } catch (error) {
      toast.error("Failed to generate selector");
      console.error(error);
    }
  }, [processQuery]);

  const saveSelector = async (element: SelectedElement) => {
    try {
      const { error } = await supabase.from("element_selectors").insert({
        selector: element.selector,
        element_type: element.element.tagName.toLowerCase(),
        description: element.label,
      });

      if (error) throw error;
      setSelectorHistory((prev) => [...prev, element]);
      toast.success("Selector saved");
    } catch (error) {
      toast.error("Failed to save selector");
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isSelecting) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      target.style.outline = "2px solid #8B5CF6";
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      target.style.outline = "";
    };

    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      handleElementSelect(target);
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleClick, true);
    };
  }, [isSelecting, handleElementSelect]);

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setIsSelecting(!isSelecting)}
          variant={isSelecting ? "destructive" : "default"}
        >
          {isSelecting ? (
            <>
              <Target className="w-4 h-4 mr-2" />
              Stop Selecting
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Start Selecting
            </>
          )}
        </Button>
        <Button variant="outline" onClick={() => setSelectedElements([])}>
          Clear Selection
        </Button>
      </div>

      <ScrollArea className="h-[200px] border rounded-md p-4">
        <div className="space-y-2">
          {selectedElements.map((el, index) => (
            <div key={index} className="flex items-center justify-between">
              <code className="text-sm">{el.selector}</code>
              <Button size="sm" onClick={() => saveSelector(el)}>
                <Save className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <List className="w-4 h-4" />
          Selector History
        </h3>
        <ScrollArea className="h-[150px]">
          <div className="space-y-2">
            {selectorHistory.map((el, index) => (
              <div key={index} className="text-sm">
                <code>{el.selector}</code>
                {el.label && <span className="ml-2 text-muted-foreground">({el.label})</span>}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};