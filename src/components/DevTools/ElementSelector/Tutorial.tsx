import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const tutorialSteps = [
  {
    title: "Welcome to Element Selector",
    description: "Learn how to effectively select and manage page elements.",
  },
  {
    title: "Selecting Elements",
    description: "Hover over any element on the page and click to select it. The element will be highlighted as you hover.",
  },
  {
    title: "CSS vs XPath",
    description: "Toggle between CSS and XPath selectors using the switch. CSS selectors are simpler but XPath can be more powerful for complex selections.",
  },
  {
    title: "Multi-Select",
    description: "Select multiple elements to group them together. Each selection is added to the list below.",
  },
  {
    title: "Undo/Redo",
    description: "Made a mistake? Use the undo/redo buttons to navigate through your selection history.",
  }
];

export const ElementSelectorTutorial = () => {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  const nextStep = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      setOpen(false);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Show Tutorial</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tutorialSteps[step].title}</DialogTitle>
          <DialogDescription>
            {tutorialSteps[step].description}
          </DialogDescription>
        </DialogHeader>
        <Card className="p-4 mt-4">
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 0}
            >
              Previous
            </Button>
            <Button onClick={nextStep}>
              {step === tutorialSteps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};