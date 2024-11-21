/// <reference types="chrome" />
import { supabase } from "./lib/supabase";

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "NAVIGATE") {
    // Handle navigation actions from the sidebar
    chrome.tabs.create({
      url: chrome.runtime.getURL(`index.html#/${message.action}`),
      active: true
    });
  }

  if (message.type === "GET_PAGE_INFO") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      sendResponse({
        url: activeTab.url,
        title: activeTab.title
      });
    });
    return true;
  }

  if (message.type === "EXECUTE_SCRIPT") {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab?.id || -1 },
      func: new Function(message.code) as () => void
    });
  }

  if (message.type === "SYNC_DATA") {
    if (supabase) {
      // Handle the Promise properly with async/await
      void (async () => {
        try {
          const response = await supabase
            .from("user_data")
            .upsert(message.data);
          sendResponse({ success: true, data: response.data });
        } catch (error) {
          sendResponse({ success: false, error });
        }
      })();
      return true;
    }
  }
});

// Handle installation and updates
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.storage.local.set({
      settings: {
        theme: "light",
        autoSync: true,
        notifications: true
      }
    });
  }
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.tabs.sendMessage(tabId, {
      type: "TAB_UPDATED",
      url: tab.url
    });
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("index.html"),
    active: true
  });
});