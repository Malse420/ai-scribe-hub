import { useState } from "react";
import { Code, Database, Terminal, FileCode } from "lucide-react";
import ScriptEditor from "./ScriptEditor";
import { analyzeDOMStructure, generateSelector } from "@/utils/pageAnalysis";
import { scrapeData, exportData } from "@/utils/webScraping";
import { toast } from "sonner";

const DevPanel = () => {
  const [activeTab, setActiveTab] = useState("code");
  const [domAnalysis, setDomAnalysis] = useState<Record<string, number>>({});

  const handleAnalyzeDOM = () => {
    const structure = analyzeDOMStructure();
    setDomAnalysis(structure);
    toast.success("DOM analysis complete");
  };

  const handleGenerateSelector = (description: string) => {
    const selectors = generateSelector(description);
    toast.success(`Generated ${selectors.length} potential selectors`);
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
          onClick={() => setActiveTab("network")}
          className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
            activeTab === "network"
              ? "border-primary-500 text-primary-500"
              : "border-transparent"
          }`}
        >
          <Database size={20} />
          <span>Network</span>
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
            <h2 className="text-lg font-semibold">Source Code</h2>
            <button
              onClick={handleAnalyzeDOM}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Analyze DOM Structure
            </button>
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
        {activeTab === "network" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Network Requests</h2>
            <div className="border border-neutral-200 rounded-lg">
              <div className="p-4 border-b border-neutral-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium">GET /api/data</span>
                  <span className="text-green-500">200 OK</span>
                </div>
              </div>
            </div>
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