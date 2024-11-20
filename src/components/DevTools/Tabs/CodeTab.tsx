import { Button } from "@/components/ui/button";
import { analyzeDOMStructure } from "@/utils/pageAnalysis";
import { toast } from "sonner";

export const CodeTab = () => {
  const [domAnalysis, setDomAnalysis] = useState<Record<string, number>>({});

  const handleAnalyzeDOM = () => {
    const structure = analyzeDOMStructure();
    setDomAnalysis(structure);
    toast.success("DOM analysis complete");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Source Code Analysis</h2>
      <Button onClick={handleAnalyzeDOM}>Analyze DOM Structure</Button>
      <pre className="p-4 bg-neutral-100 rounded-lg overflow-x-auto">
        <code>{JSON.stringify(domAnalysis, null, 2)}</code>
      </pre>
    </div>
  );
};