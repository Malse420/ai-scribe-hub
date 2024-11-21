import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

interface ElementHighlighterProps {
  isActive: boolean;
  onElementSelect: (element: HTMLElement) => void;
}

export const ElementHighlighter = ({ isActive, onElementSelect }: ElementHighlighterProps) => {
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [persistentHighlight, setPersistentHighlight] = useState<HTMLElement | null>(null);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isActive || !highlightedElement) return;

    // Enter to select
    if (e.key === "Enter") {
      onElementSelect(highlightedElement);
      toast.success("Element selected");
    }

    // Space to toggle persistent highlight
    if (e.key === " ") {
      e.preventDefault();
      setPersistentHighlight(prev => {
        if (prev) {
          toast.info("Highlight removed");
          return null;
        } else {
          toast.info("Highlight locked");
          return highlightedElement;
        }
      });
    }

    // Arrow keys to navigate DOM
    if (e.key.startsWith("Arrow")) {
      e.preventDefault();
      let nextElement: HTMLElement | null = null;

      switch (e.key) {
        case "ArrowUp":
          nextElement = highlightedElement.parentElement as HTMLElement;
          break;
        case "ArrowDown":
          nextElement = highlightedElement.firstElementChild as HTMLElement;
          break;
        case "ArrowLeft":
          nextElement = highlightedElement.previousElementSibling as HTMLElement;
          break;
        case "ArrowRight":
          nextElement = highlightedElement.nextElementSibling as HTMLElement;
          break;
      }

      if (nextElement) {
        highlightedElement.style.outline = "";
        nextElement.style.outline = "2px solid #8B5CF6";
        setHighlightedElement(nextElement);
      }
    }
  }, [isActive, highlightedElement, onElementSelect]);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      if (!isActive || persistentHighlight) return;
      const target = e.target as HTMLElement;
      
      if (highlightedElement) {
        highlightedElement.style.outline = "";
      }
      
      target.style.outline = "2px solid #8B5CF6";
      setHighlightedElement(target);
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!isActive || persistentHighlight) return;
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
      document.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isActive, handleKeyPress, persistentHighlight]);

  useEffect(() => {
    if (!isActive && persistentHighlight) {
      persistentHighlight.style.outline = "";
      setPersistentHighlight(null);
    }
  }, [isActive]);

  return null;
};