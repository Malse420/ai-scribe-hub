// Enhanced background script with error handling and logging

// Log installation event
chrome.runtime.onInstalled.addListener(() => {
    console.log('AI Scribe Hub extension installed successfully.');
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    try {
        if (message.type === "GET_PAGE_INFO") {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (chrome.runtime.lastError) {
                    console.error("Error querying tabs:", chrome.runtime.lastError);
                    sendResponse({ error: "Failed to query tabs." });
                    return;
                }

                const activeTab = tabs[0];
                if (activeTab) {
                    sendResponse({ url: activeTab.url, title: activeTab.title });
                } else {
                    sendResponse({ error: "No active tab found." });
                }
            });
        } else {
            console.warn("Unhandled message type:", message.type);
            sendResponse({ error: "Unhandled message type." });
        }
    } catch (error) {
        console.error("Unexpected error in background script:", error);
        sendResponse({ error: "An unexpected error occurred." });
    }

    // Indicate asynchronous response
    return true;
});

// General error listener for debugging
window.onerror = (message, source, lineno, colno, error) => {
    console.error("Global error captured:", { message, source, lineno, colno, error });
};