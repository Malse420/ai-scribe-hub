import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crosshair, Save, Search, Code, Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { ElementHighlighter } from "./VisualSelector/ElementHighlighter";
import { SelectorPreview } from "./VisualSelector/SelectorPreview";
import { findElementByDescription } from "@/utils/nlpSelector";
import { useAIAssistant } from "@/contexts/AIAssistantContext";

interface ElementInfo {
  selector: string;
  element_type: string;
  attributes: Record<string, string>;
}

export const VisualSelector = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedElement, setSelectedElement] = useState<ElementInfo | null>(null);
  const [description, setDescription] = useState("");
  const [searchResults, setSearchResults] = useState<HTMLElement[]>([]);
  const { processQuery } = useAIAssistant();

  const handleElementSelect = useCallback(async (element: HTMLElement) => {
    try {
      const selector = await processQuery(`Generate a robust CSS selector for this element: ${element.outerHTML}`);
      const attributes = Array.from(element.attributes).reduce(
        (acc, attr) => ({ ...acc, [attr.name]: attr.value }),
        {}
      );

      setSelectedElement({
        selector,
        element_type: element.tagName.toLowerCase(),
        attributes,
      });
      setIsSelecting(false);

      // Get explanation from AI
      const explanation = await processQuery(`Explain this element's role and attributes: ${element.outerHTML}`);
      toast.success("Element selected successfully");
      toast.info(explanation);
    } catch (error) {
      toast.error("Failed to process element selection");
      console.error(error);
    }
  }, [processQuery]);

  const handleSearch = async () => {
    if (!description) {
      toast.error("Please enter an element description");
      return;
    }

    try {
      const enhancedQuery = await processQuery(`Convert this description to a technical selector query: ${description}`);
      const matches = findElementByDescription(enhancedQuery);
      setSearchResults(matches);

      if (matches.length > 0) {
        matches[0].scrollIntoView({ behavior: "smooth", block: "center" });
        handleElementSelect(matches[0]);
        toast.success(`Found ${matches.length} matching elements`);
      } else {
        toast.error("No matching elements found");
      }
    } catch (error) {
      toast.error("Failed to process search");
      console.error(error);
    }
  };

  const saveSelector = async () => {
    if (!selectedElement) {
      toast.error("No element selected");
      return;
    }

    try {
      const { error } = await supabase.from("element_selectors").insert({
        selector: selectedElement.selector,
        element_type: selectedElement.element_type,
        description: description || undefined,
        metadata: { attributes: selectedElement.attributes },
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

  const createScriptTemplate = async () => {
    if (!selectedElement) {
      toast.error("No element selected");
      return;
    }

    try {
      const scriptContent = `// Script template for interacting with ${selectedElement.element_type} element
const element = document.querySelector("${selectedElement.selector}");
if (element) {
  // Add your interaction code here
  console.log("Element found:", element);
} else {
  console.error("Element not found");
}`;

      const { error } = await supabase.from("script_templates").insert({
        title: `Interact with ${selectedElement.element_type}`,
        description: description || `Template for interacting with ${selectedElement.element_type} element`,
        content: scriptContent,
        category: "Element Interaction",
        tags: ["selector", selectedElement.element_type],
      });

      if (error) throw error;
      toast.success("Script template created successfully");
    } catch (error) {
      toast.error("Failed to create script template");
      console.error(error);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <Button
          onClick={() => setIsSelecting(!isSelecting)}
          variant={isSelecting ? "destructive" : "default"}
          className="w-full md:w-auto"
        >
          <Crosshair className="w-4 h-4 mr-2" />
          {isSelecting ? "Cancel Selection" : "Select Element"}
        </Button>
        <div className="flex-1 flex flex-col md:flex-row gap-2 w-full">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the element (e.g., 'main search button in the header')"
            className="flex-1"
          />
          <Button onClick={handleSearch} variant="outline" className="w-full md:w-auto">
            <Search className="w-4 h-4 mr-2" />
            Find Element
          </Button>
        </div>
      </div>

      <ElementHighlighter isActive={isSelecting} onElementSelect={handleElementSelect} />

      {selectedElement && (
        <>
          <SelectorPreview
            selector={selectedElement.selector}
            elementType={selectedElement.element_type}
            attributes={selectedElement.attributes}
          />
          <div className="flex flex-col md:flex-row gap-2">
            <Button onClick={saveSelector} className="w-full md:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Selector
            </Button>
            <Button onClick={createScriptTemplate} variant="outline" className="w-full md:w-auto">
              <Code className="w-4 h-4 mr-2" />
              Create Script Template
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};