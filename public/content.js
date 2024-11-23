// Enhanced content script with sidebar functionality
console.log('Content script loaded');

// Inject a sidebar into the page if not already present
if (!document.querySelector('#ai-scribe-sidebar')) {
    const sidebar = document.createElement('div');
    sidebar.id = 'ai-scribe-sidebar';
    sidebar.style = `
        position: fixed;
        top: 0;
        right: 0;
        width: 300px;
        height: 100%;
        background: #f9f9f9;
        box-shadow: -2px 0 5px rgba(0,0,0,0.2);
        z-index: 100000;
        display: flex;
        flex-direction: column;
        padding: 10px;
        overflow-y: auto;
        transition: transform 0.3s ease;
        transform: translateX(100%);
    `;

    // Toggle Button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '≡';
    toggleButton.style = `
        position: absolute;
        left: -30px;
        top: 10px;
        background: #0078d7;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    toggleButton.onclick = () => {
        sidebar.style.transform = 
            sidebar.style.transform === 'translateX(0%)' 
            ? 'translateX(100%)' 
            : 'translateX(0%)';
    };

    // Sidebar Content
    const header = document.createElement('h2');
    header.textContent = 'AI Scribe Hub';
    header.style = 'margin-bottom: 10px;';

    const content = document.createElement('div');
    content.id = 'ai-scribe-content';
    content.innerHTML = '<p>Welcome to AI Scribe Hub</p>'; // Add dynamic content here

    // Assemble Sidebar
    sidebar.appendChild(toggleButton);
    sidebar.appendChild(header);
    sidebar.appendChild(content);
    document.body.appendChild(sidebar);
}

// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_PAGE_INFO") {
        try {
            const pageInfo = {
                url: window.location.href,
                title: document.title,
            };
            sendResponse(pageInfo);
        } catch (error) {
            console.error("Error retrieving page info:", error);
            sendResponse({ error: "Failed to retrieve page info" });
        }
    }
});