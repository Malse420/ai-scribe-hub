import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

interface ElementHighlighterProps {
  isActive: boolean;
  onElementSelect: (element: HTMLElement) => void;
}

export const ElementHighlighter = ({ isActive, onElementSelect }: ElementHighlighterProps) => {
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [persistentHighlight, setPersistentHighlight] = useState<HTMLElement | null>(null);

  const clearHighlight = (element: HTMLElement) => {
    element.style.removeProperty('outline');
    element.style.removeProperty('background-color');
  };

  const setHighlight = (element: HTMLElement, isPersistent = false) => {
    element.style.outline = '2px solid #8B5CF6';
    element.style.backgroundColor = isPersistent ? 'rgba(139, 92, 246, 0.1)' : 'transparent';
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!isActive || !highlightedElement) return;

    if (e.key === "Enter") {
      onElementSelect(highlightedElement);
      toast.success("Element selected");
    }

    if (e.key === " ") {
      e.preventDefault();
      setPersistentHighlight((prev) => {
        if (prev) {
          clearHighlight(prev);
          toast.info("Highlight removed");
          return null;
        } else {
          setHighlight(highlightedElement, true);
          toast.info("Highlight locked");
          return highlightedElement;
        }
      });
    }

    // DOM Navigation
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
        clearHighlight(highlightedElement);
        setHighlight(nextElement);
        setHighlightedElement(nextElement);
        nextElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [isActive, highlightedElement, onElementSelect]);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      if (!isActive || persistentHighlight) return;
      const target = e.target as HTMLElement;
      
      if (highlightedElement) {
        clearHighlight(highlightedElement);
      }
      
      setHighlight(target);
      setHighlightedElement(target);
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (!isActive || persistentHighlight) return;
      const target = e.target as HTMLElement;
      clearHighlight(target);
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
      clearHighlight(persistentHighlight);
      setPersistentHighlight(null);
    }
  }, [isActive]);

  return null;
};