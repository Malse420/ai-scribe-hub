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
    <Card className="bg-card/50 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Element Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1 text-muted-foreground">Selector</p>
          <Badge variant="secondary" className="font-mono text-xs break-all">
            {selector}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-medium mb-1 text-muted-foreground">Element Type</p>
          <Badge variant="outline" className="text-xs">
            {elementType}
          </Badge>
        </div>
        <div>
          <p className="text-sm font-medium mb-1 text-muted-foreground">Attributes</p>
          <ScrollArea className="h-32 rounded-md border bg-card">
            <div className="p-4 space-y-2">
              {Object.entries(attributes).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-muted-foreground truncate">{key}</span>
                  <span className="text-sm truncate max-w-[200px]">{value}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};