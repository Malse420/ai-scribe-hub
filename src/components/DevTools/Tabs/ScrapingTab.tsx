import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Filter, Play, Plus } from "lucide-react";
import { toast } from "sonner";
import { generateSelector } from "@/utils/pageAnalysis";
import { scrapeData, exportData, downloadData, ScrapingConfig } from "@/utils/webScraping";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ScrapingTab = () => {
  const [elementDescription, setElementDescription] = useState("");
  const [scrapingConfig, setScrapingConfig] = useState<ScrapingConfig>({
    selector: "",
    attributes: [],
    filters: [],
    pagination: {
      nextButton: "",
      maxPages: 1
    }
  });
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'csv' | 'xml'>('json');

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

  const handlePreviewData = async () => {
    try {
      const data = await scrapeData(scrapingConfig);
      setPreviewData(data.elements);
      toast.success("Data preview generated");
    } catch (error) {
      toast.error("Failed to generate preview");
    }
  };

  const handleScrapeData = async () => {
    try {
      const data = await scrapeData(scrapingConfig);
      const exportedData = exportData(data, selectedFormat);
      downloadData(exportedData, `scraped-data.${selectedFormat}`);
      toast.success("Data scraped and downloaded successfully");
    } catch (error) {
      toast.error("Failed to scrape data");
    }
  };

  const addAttribute = () => {
    setScrapingConfig({
      ...scrapingConfig,
      attributes: [...(scrapingConfig.attributes || []), ""]
    });
  };

  const addFilter = () => {
    setScrapingConfig({
      ...scrapingConfig,
      filters: [...(scrapingConfig.filters || []), { field: "", operator: "equals", value: "" }]
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Web Scraping Configuration</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Element Description</label>
            <div className="flex gap-2">
              <Input
                value={elementDescription}
                onChange={(e) => setElementDescription(e.target.value)}
                placeholder="Describe the element (e.g., 'main heading')"
              />
              <Button onClick={handleGenerateSelector}>Generate Selector</Button>
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Attributes to Extract</label>
              <Button variant="outline" size="sm" onClick={addAttribute}>
                <Plus className="w-4 h-4 mr-2" />
                Add Attribute
              </Button>
            </div>
            {scrapingConfig.attributes?.map((attr, index) => (
              <Input
                key={index}
                value={attr}
                onChange={(e) => {
                  const newAttributes = [...(scrapingConfig.attributes || [])];
                  newAttributes[index] = e.target.value;
                  setScrapingConfig({ ...scrapingConfig, attributes: newAttributes });
                }}
                placeholder="Enter attribute name (e.g., href, src)"
              />
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Filters</label>
              <Button variant="outline" size="sm" onClick={addFilter}>
                <Filter className="w-4 h-4 mr-2" />
                Add Filter
              </Button>
            </div>
            {scrapingConfig.filters?.map((filter, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={filter.field}
                  onChange={(e) => {
                    const newFilters = [...(scrapingConfig.filters || [])];
                    newFilters[index] = { ...filter, field: e.target.value };
                    setScrapingConfig({ ...scrapingConfig, filters: newFilters });
                  }}
                  placeholder="Field name"
                />
                <select
                  className="px-3 py-2 rounded-md border"
                  value={filter.operator}
                  onChange={(e) => {
                    const newFilters = [...(scrapingConfig.filters || [])];
                    newFilters[index] = { ...filter, operator: e.target.value as any };
                    setScrapingConfig({ ...scrapingConfig, filters: newFilters });
                  }}
                >
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                  <option value="greater">Greater than</option>
                  <option value="less">Less than</option>
                </select>
                <Input
                  value={filter.value}
                  onChange={(e) => {
                    const newFilters = [...(scrapingConfig.filters || [])];
                    newFilters[index] = { ...filter, value: e.target.value };
                    setScrapingConfig({ ...scrapingConfig, filters: newFilters });
                  }}
                  placeholder="Value"
                />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Pagination</label>
            <div className="flex gap-2">
              <Input
                value={scrapingConfig.pagination?.nextButton}
                onChange={(e) => setScrapingConfig({
                  ...scrapingConfig,
                  pagination: { ...scrapingConfig.pagination, nextButton: e.target.value }
                })}
                placeholder="Next button selector"
              />
              <Input
                type="number"
                min="1"
                value={scrapingConfig.pagination?.maxPages}
                onChange={(e) => setScrapingConfig({
                  ...scrapingConfig,
                  pagination: { ...scrapingConfig.pagination, maxPages: parseInt(e.target.value) }
                })}
                placeholder="Max pages"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button onClick={handlePreviewData} variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Preview Data
          </Button>
          <select
            className="px-3 py-2 rounded-md border"
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as any)}
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xml">XML</option>
          </select>
          <Button onClick={handleScrapeData}>
            <Download className="w-4 h-4 mr-2" />
            Scrape and Download
          </Button>
        </div>
      </Card>

      {previewData.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
          <ScrollArea className="h-[300px]">
            <pre className="text-sm">
              {JSON.stringify(previewData, null, 2)}
            </pre>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};