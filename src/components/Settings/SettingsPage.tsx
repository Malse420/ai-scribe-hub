import ApiKeySettings from "./ApiKeySettings";
import StorageSettings from "./StorageSettings";
import AIAssistantSettings from "./AIAssistantSettings";

const SettingsPage = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>
        <p className="text-neutral-600">
          Customize your development environment preferences
        </p>
      </div>

      <AIAssistantSettings />
      <StorageSettings />
      <ApiKeySettings />

      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Theme</label>
              <select className="w-full p-2 border border-neutral-200 rounded-lg">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Language</label>
              <select className="w-full p-2 border border-neutral-200 rounded-lg">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">AI Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Default AI Model
              </label>
              <select className="w-full p-2 border border-neutral-200 rounded-lg">
                <option>GPT-4</option>
                <option>Claude</option>
                <option>Gemini</option>
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-neutral-300" />
                <span className="text-sm">Enable AI suggestions</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;