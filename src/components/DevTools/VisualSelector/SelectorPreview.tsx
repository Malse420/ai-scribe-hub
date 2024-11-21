import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SelectorPreviewProps {
  selector: string;
  elementType: string;
  attributes: Record<string, string>;
}

export const SelectorPreview = ({ selector, elementType, attributes }: SelectorPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Element Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Selector</p>
            <Badge variant="secondary" className="font-mono text-xs">
              {selector}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Element Type</p>
            <Badge variant="outline" className="text-xs">
              {elementType}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Attributes</p>
            <ScrollArea className="h-32 rounded-md border">
              <div className="p-4">
                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-1">
                    <span className="text-sm font-medium text-muted-foreground">{key}</span>
                    <span className="text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};