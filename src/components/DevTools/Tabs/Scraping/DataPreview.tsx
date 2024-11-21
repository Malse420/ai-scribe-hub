import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrapedData } from "@/utils/webScraping";

interface DataPreviewProps {
  data: ScrapedData | null;
}

export const DataPreview = ({ data }: DataPreviewProps) => {
  if (!data || data.elements.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="data">
          <TabsList>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data">
            <ScrollArea className="h-[300px]">
              <pre className="text-sm">
                {JSON.stringify(data.elements, null, 2)}
              </pre>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="metadata">
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                <p><strong>URL:</strong> {data.url}</p>
                <p><strong>Timestamp:</strong> {data.timestamp}</p>
                <p><strong>Total Elements:</strong> {data.metadata?.totalElements}</p>
                <p><strong>Pages Scraped:</strong> {data.metadata?.totalPages}</p>
                <div className="mt-4">
                  <strong>Configuration:</strong>
                  <pre className="text-sm mt-2">
                    {JSON.stringify(data.metadata?.config, null, 2)}
                  </pre>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};