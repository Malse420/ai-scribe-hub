import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LocalStorageManager } from "@/utils/localStorageManager";

const StorageSettings = () => {
  const [preference, setPreference] = useState<"local" | "hybrid" | "cloud">(
    LocalStorageManager.getEncrypted("storage_preference") || "hybrid"
  );

  const handlePreferenceChange = (value: "local" | "hybrid" | "cloud") => {
    setPreference(value);
    LocalStorageManager.setEncrypted("storage_preference", value);
    toast.success("Storage preference updated");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage Settings</CardTitle>
        <CardDescription>
          Choose how you want to store your data and scripts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={preference}
          onValueChange={handlePreferenceChange as (value: string) => void}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="local" id="local" />
            <Label htmlFor="local">
              Local Storage Only
              <p className="text-sm text-muted-foreground">
                Store everything locally. Works offline but data isn't synced
                across devices.
              </p>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hybrid" id="hybrid" />
            <Label htmlFor="hybrid">
              Hybrid Storage
              <p className="text-sm text-muted-foreground">
                Store sensitive data locally, sync everything else to the cloud.
              </p>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cloud" id="cloud" />
            <Label htmlFor="cloud">
              Cloud Storage
              <p className="text-sm text-muted-foreground">
                Store everything in the cloud for seamless sync across devices.
              </p>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default StorageSettings;