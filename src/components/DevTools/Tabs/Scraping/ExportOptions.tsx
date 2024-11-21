import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { ScrapedData, exportData, downloadData } from "@/utils/webScraping";
import { toast } from "sonner";

interface ExportOptionsProps {
  data: ScrapedData | null;
  onExport: () => void;
}

export const ExportOptions = ({ data, onExport }: ExportOptionsProps) => {
  const [format, setFormat] = useState<'json' | 'csv' | 'xml'>('json');

  const handleExport = async () => {
    if (!data) {
      toast.error("No data to export");
      return;
    }

    try {
      const exportedData = exportData(data, format);
      downloadData(exportedData, `scraped-data.${format}`);
      onExport();
    } catch (error) {
      toast.error("Failed to export data");
      console.error(error);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Select value={format} onValueChange={(value: 'json' | 'csv' | 'xml') => setFormat(value)}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="json">JSON</SelectItem>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="xml">XML</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleExport} disabled={!data}>
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
    </div>
  );
};