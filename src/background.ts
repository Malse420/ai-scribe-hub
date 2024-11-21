/// <reference types="chrome" />
import { supabase } from "./lib/supabase";

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "EXECUTE_SCRIPT") {
    executeUserScript(message.scriptId, sender.tab?.id);
  }
  return true;
});

// Execute user script in the context of the web page
async function executeUserScript(scriptId: string, tabId?: number) {
  if (!tabId) return;

  try {
    // Fetch script from Supabase
    const { data: script, error } = await supabase
      .from("userscripts")
      .select("content")
      .eq("id", scriptId)
      .single();

    if (error) throw error;

    // Execute the script in the context of the web page
    await chrome.scripting.executeScript({
      target: { tabId },
      func: (scriptContent: string) => {
        try {
          new Function(scriptContent)();
        } catch (err) {
          console.error("Script execution error:", err);
        }
      },
      args: [script.content]
    });
  } catch (err) {
    console.error("Error executing script:", err);
  }
}