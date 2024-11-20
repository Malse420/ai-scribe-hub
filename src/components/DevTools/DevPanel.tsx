import { useState, useEffect } from "react";
import { Code, Database, Terminal, FileCode, Crosshair } from "lucide-react";
import ScriptEditor from "./ScriptEditor";
import { VisualSelector } from "./VisualSelector";
import { SourceViewer } from "./SourceViewer/SourceViewer";
import { CodeTab } from "./Tabs/CodeTab";
import { ScrapingTab } from "./Tabs/ScrapingTab";
import { ConsoleTab } from "./Tabs/ConsoleTab";
import { extractPageSource } from "@/utils/sourceExtractor";

const DevPanel = () => {
  const [activeTab, setActiveTab] = useState("code");
  const [pageSource, setPageSource] = useState({
    html: "",
    css: "",
    javascript: ""
  });

  useEffect(() => {
    if (activeTab === "source") {
      const source = extractPageSource();
      setPageSource(source);
    }
  }, [activeTab]);

  const tabs = [
    { id: "code", label: "Code", icon: Code },
    { id: "scripts", label: "Scripts", icon: FileCode },
    { id: "selector", label: "Selector", icon: Crosshair },
    { id: "scraping", label: "Scraping", icon: Database },
    { id: "console", label: "Console", icon: Terminal },
    { id: "source", label: "Source", icon: FileCode },
  ];

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="flex border-b border-neutral-200">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === id
                ? "border-primary-500 text-primary-500"
                : "border-transparent"
            }`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <div className="p-4">
        {activeTab === "code" && <CodeTab />}
        {activeTab === "scripts" && <ScriptEditor />}
        {activeTab === "selector" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Visual Selector Tool</h2>
            <VisualSelector />
          </div>
        )}
        {activeTab === "scraping" && <ScrapingTab />}
        {activeTab === "console" && <ConsoleTab />}
        {activeTab === "source" && (
          <SourceViewer
            html={pageSource.html}
            css={pageSource.css}
            javascript={pageSource.javascript}
          />
        )}
      </div>
    </div>
  );
};

export default DevPanel;