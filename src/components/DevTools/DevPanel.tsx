import { useState, useEffect } from "react";
import { Code, Database, Terminal, FileCode, Eye, Bot, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScriptEditor from "./ScriptEditor";
import { ElementSelector } from "./ElementSelector/ElementSelector";
import { SourceViewer } from "./SourceViewer/SourceViewer";
import { CodeTab } from "./Tabs/CodeTab";
import { ScrapingTab } from "./Tabs/ScrapingTab";
import { ConsoleTab } from "./Tabs/ConsoleTab";
import { AIAssistantTab } from "./Tabs/AIAssistantTab";
import { extractPageSource } from "@/utils/sourceExtractor";
import { useToast } from "@/components/ui/use-toast";
import { usePreferences } from "@/hooks/usePreferences";

const DevPanel = () => {
  const [activeTab, setActiveTab] = useState("code");
  const [pageSource, setPageSource] = useState({
    html: "",
    css: "",
    javascript: ""
  });
  const { toast } = useToast();
  const { preferences } = usePreferences();

  useEffect(() => {
    if (activeTab === "source") {
      const source = extractPageSource();
      setPageSource(source);
    }
  }, [activeTab]);

  const tabs = [
    { id: "code", label: "Code", icon: Code },
    { id: "scripts", label: "Scripts", icon: FileCode },
    { id: "selector", label: "Element Selector", icon: Eye },
    { id: "scraping", label: "Scraping", icon: Database },
    { id: "console", label: "Console", icon: Terminal },
    { id: "source", label: "Source", icon: FileCode },
    { id: "ai", label: "AI Assistant", icon: Bot },
  ];

  return (
    <div className="h-[calc(100vh-4rem)]" data-theme={preferences?.theme || 'light'}>
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full border-b border-neutral-200">
          {tabs.map(({ id, label, icon: Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="flex items-center gap-2 px-4 py-2"
            >
              <Icon size={20} />
              <span>{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="p-4">
          <TabsContent value="code">
            <CodeTab />
          </TabsContent>
          <TabsContent value="scripts">
            <ScriptEditor />
          </TabsContent>
          <TabsContent value="selector">
            <ElementSelector />
          </TabsContent>
          <TabsContent value="scraping">
            <ScrapingTab />
          </TabsContent>
          <TabsContent value="console">
            <ConsoleTab />
          </TabsContent>
          <TabsContent value="source">
            <SourceViewer
              html={pageSource.html}
              css={pageSource.css}
              javascript={pageSource.javascript}
            />
          </TabsContent>
          <TabsContent value="ai">
            <AIAssistantTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DevPanel;