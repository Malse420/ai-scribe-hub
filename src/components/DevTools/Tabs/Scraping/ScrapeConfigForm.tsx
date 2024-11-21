import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrapingConfig } from "@/utils/scraping";
import { BasicConfigForm } from "./Forms/BasicConfigForm";
import { AdvancedConfigForm } from "./Forms/AdvancedConfigForm";
import { ValidationConfigForm } from "./Forms/ValidationConfigForm";
import { TransformConfigForm } from "./Forms/TransformConfigForm";

interface ScrapeConfigFormProps {
  config: ScrapingConfig;
  onConfigChange: (config: ScrapingConfig) => void;
}

export const ScrapeConfigForm = ({ config, onConfigChange }: ScrapeConfigFormProps) => {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <Card className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="transform">Transform</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <BasicConfigForm config={config} onConfigChange={onConfigChange} />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedConfigForm config={config} onConfigChange={onConfigChange} />
        </TabsContent>

        <TabsContent value="validation">
          <ValidationConfigForm config={config} onConfigChange={onConfigChange} />
        </TabsContent>

        <TabsContent value="transform">
          <TransformConfigForm config={config} onConfigChange={onConfigChange} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};