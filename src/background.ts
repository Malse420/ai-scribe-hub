/// <reference types="chrome" />
import { supabase } from "./lib/supabase";

// Message handler types for better type safety
type MessageHandler = {
  [key: string]: (message: any, sender: chrome.runtime.MessageSender) => Promise<any>;
};

const messageHandlers: MessageHandler = {
  NAVIGATE: async (message) => {
    await chrome.tabs.create({
      url: chrome.runtime.getURL(`index.html#/${message.action}`),
      active: true
    });
    return { success: true };
  },

  GET_PAGE_INFO: async (_, sender) => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    return {
      url: activeTab.url,
      title: activeTab.title
    };
  },

  EXECUTE_SCRIPT: async (message, sender) => {
    await chrome.scripting.executeScript({
      target: { tabId: sender.tab?.id || -1 },
      func: new Function(message.code) as () => void
    });
    return { success: true };
  },

  SYNC_DATA: async (message) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    const { data, error } = await supabase
      .from("user_data")
      .upsert(message.data);
      
    if (error) throw error;
    return { success: true, data };
  }
};

// Improved message listener with proper error handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message.type || !(message.type in messageHandlers)) {
    sendResponse({ error: 'Invalid message type' });
    return false;
  }

  messageHandlers[message.type](message, sender)
    .then(response => sendResponse(response))
    .catch(error => {
      console.error(`Error handling message ${message.type}:`, error);
      sendResponse({ error: error.message });
    });

  return true; // Keep channel open for async response
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

// Handle tab updates with proper error handling
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    chrome.tabs.sendMessage(tabId, {
      type: "TAB_UPDATED",
      url: tab.url
    }).catch(error => {
      console.error('Error sending tab update message:', error);
    });
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("index.html"),
    active: true
  }).catch(error => {
    console.error('Error creating new tab:', error);
  });
});