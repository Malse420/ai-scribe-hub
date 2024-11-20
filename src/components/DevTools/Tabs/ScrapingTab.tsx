import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { generateSelector } from "@/utils/pageAnalysis";
import { scrapeData, exportData, downloadData, ScrapingConfig } from "@/utils/webScraping";

export const ScrapingTab = () => {
  const [elementDescription, setElementDescription] = useState("");
  const [scrapingConfig, setScrapingConfig] = useState<ScrapingConfig>({
    selector: "",
    attributes: [],
  });

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
      <Button onClick={handleScrapeData} className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Scrape and Download Data
      </Button>
    </div>
  );
};