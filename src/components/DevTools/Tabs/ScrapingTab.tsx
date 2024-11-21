import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ScrapingConfig, scrapeData, ScrapedData } from "@/utils/webScraping";
import { ScrapeConfigForm } from "./Scraping/ScrapeConfigForm";
import { DataPreview } from "./Scraping/DataPreview";
import { ExportOptions } from "./Scraping/ExportOptions";
import { FilterConfig } from "./Scraping/FilterConfig";

export const ScrapingTab = () => {
  const [scrapingConfig, setScrapingConfig] = useState<ScrapingConfig>({
    selector: "",
    attributes: [],
    pagination: {
      nextButton: "",
      maxPages: 1
    }
  });
  const [previewData, setPreviewData] = useState<ScrapedData | null>(null);

  const handleScrape = async () => {
    if (!scrapingConfig.selector) {
      toast.error("Please enter a CSS selector");
      return;
    }

    try {
      const data = await scrapeData(scrapingConfig);
      setPreviewData(data);
      toast.success("Data scraped successfully");
    } catch (error) {
      toast.error("Failed to scrape data");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <ScrapeConfigForm 
        config={scrapingConfig}
        onConfigChange={setScrapingConfig}
      />
      
      <FilterConfig
        config={scrapingConfig}
        onConfigChange={setScrapingConfig}
      />
      
      <div className="flex justify-end">
        <ExportOptions
          data={previewData}
          onExport={() => toast.success("Data exported successfully")}
        />
      </div>

      <DataPreview data={previewData} />
    </div>
  );
};