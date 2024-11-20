import { useState } from "react";
import { Code, Database, Terminal, FileCode, Download, Crosshair } from "lucide-react";
import ScriptEditor from "./ScriptEditor";
import { VisualSelector } from "./VisualSelector";
import { analyzeDOMStructure, generateSelector, findElementByDescription } from "@/utils/pageAnalysis";
import { scrapeData, exportData, downloadData, ScrapingConfig } from "@/utils/webScraping";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DevPanel = () => {
  const [activeTab, setActiveTab] = useState("code");
  const [domAnalysis, setDomAnalysis] = useState<Record<string, number>>({});
  const [elementDescription, setElementDescription] = useState("");
  const [scrapingConfig, setScrapingConfig] = useState<ScrapingConfig>({
    selector: "",
    attributes: [],
  });

  const handleAnalyzeDOM = () => {
    const structure = analyzeDOMStructure();
    setDomAnalysis(structure);
    toast.success("DOM analysis complete");
  };

  const handleGenerateSelector = () => {
    if (!elementDescription) {
      toast.error("Please enter an element description");
      return;
    }
    const selectors = generateSelector(elementDescription);
    if (selectors.length > 0) {
      setScrapingConfig({ ...scrapingConfig, selector: selectors[0] });
      toast.success(`Generated ${selectors.length} potential selectors`);
    } else {
      toast.error("No matching elements found");
    }
  };

  const handleScrapeData = async () => {
    try {
      const data = await scrapeData(scrapingConfig);
      const jsonData = exportData(data, 'json');
      downloadData(jsonData, 'scraped-data.json');
      toast.success("Data scraped and downloaded successfully");
    } catch (error) {
      toast.error("Failed to scrape data");
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="flex border-b border-neutral-200">
        <button
          onClick={() => setActiveTab("code")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "code"
              ? "border-primary-500 text-primary-500"
              : "border-transparent"
          }`}
        >
          <Code size={20} />
          <span>Code</span>
        </button>
        <button
          onClick={() => setActiveTab("scripts")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "scripts"
              ? "border-primary-500 text-primary-500"
              : "border-transparent"
          }`}
        >
          <FileCode size={20} />
          <span>Scripts</span>
        </button>
        <button
          onClick={() => setActiveTab("selector")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "selector"
              ? "border-primary-500 text-primary-500"
              : "border-transparent"
          }`}
        >
          <Crosshair size={20} />
          <span>Selector</span>
        </button>
        <button
          onClick={() => setActiveTab("scraping")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "scraping"
              ? "border-primary-500 text-primary-500"
              : "border-transparent"
          }`}
        >
          <Database size={20} />
          <span>Scraping</span>
        </button>
        <button
          onClick={() => setActiveTab("console")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "console"
              ? "border-primary-500 text-primary-500"
              : "border-transparent"
          }`}
        >
          <Terminal size={20} />
          <span>Console</span>
        </button>
      </div>
      <div className="p-4">
        {activeTab === "code" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Source Code Analysis</h2>
            <Button onClick={handleAnalyzeDOM}>
              Analyze DOM Structure
            </Button>
            <pre className="p-4 bg-neutral-100 rounded-lg overflow-x-auto">
              <code>{JSON.stringify(domAnalysis, null, 2)}</code>
            </pre>
          </div>
        )}
        {activeTab === "scripts" && (
          <div className="space-y-4">
            <ScriptEditor />
          </div>
        )}
        {activeTab === "selector" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Visual Selector Tool</h2>
            <VisualSelector />
          </div>
        )}
        {activeTab === "scraping" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Web Scraping</h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Element Description</label>
              <div className="flex gap-2">
                <Input
                  value={elementDescription}
                  onChange={(e) => setElementDescription(e.target.value)}
                  placeholder="Describe the element (e.g., 'main heading')"
                />
                <Button onClick={handleGenerateSelector}>
                  Generate Selector
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">CSS Selector</label>
              <Input
                value={scrapingConfig.selector}
                onChange={(e) => setScrapingConfig({ ...scrapingConfig, selector: e.target.value })}
                placeholder="Enter CSS selector"
              />
            </div>
            <Button onClick={handleScrapeData} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Scrape and Download Data
            </Button>
          </div>
        )}
        {activeTab === "console" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Console Output</h2>
            <div className="bg-neutral-900 text-white p-4 rounded-lg font-mono">
              <p>$ npm start</p>
              <p className="text-green-400">Starting development server...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevPanel;