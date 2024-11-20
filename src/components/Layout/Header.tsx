import { useState, useEffect } from "react";
import StorageIndicator from "../Storage/StorageIndicator";
import { LocalStorageManager } from "@/utils/localStorageManager";

const Header = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [storageType, setStorageType] = useState<"local" | "hybrid" | "cloud">(
    LocalStorageManager.getEncrypted("storage_preference") || "hybrid"
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <header className="fixed top-0 right-0 left-64 h-16 border-b border-neutral-200 bg-white z-50">
      <div className="flex items-center justify-between h-full px-6">
        <h1 className="text-lg font-semibold">AI Scribe Hub</h1>
        <div className="flex items-center gap-4">
          <StorageIndicator isOnline={isOnline} storageType={storageType} />
        </div>
      </div>
    </header>
  );
};

export default Header;