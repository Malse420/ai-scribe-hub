import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ElementHighlighterProps {
  isActive: boolean;
  onElementSelect: (element: HTMLElement) => void;
}

export const ElementHighlighter = ({ isActive, onElementSelect }: ElementHighlighterProps) => {
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      if (!isActive) return;
      const target = e.target as HTMLElement;
      
      // Remove previous highlight
      if (highlightedElement) {
        highlightedElement.style.outline = "";
      }
      
      // Add new highlight
      target.style.outline = "2px solid #8B5CF6";
      setHighlightedElement(target);
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!isActive) return;
      const target = e.target as HTMLElement;
      target.style.outline = "";
    };

    const handleClick = (e: MouseEvent) => {
      if (!isActive) return;
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLElement;
      onElementSelect(target);
      toast.success("Element selected");
    };

    if (isActive) {
      document.addEventListener("mouseover", handleMouseOver);
      document.addEventListener("mouseout", handleMouseOut);
      document.addEventListener("click", handleClick, true);
    }

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleClick, true);
    };
  }, [isActive, onElementSelect]);

  return null;
};