let lastRightClickedElement = null;
let lastRightClickedHostname = null;

chrome.runtime.onInstalled.addListener(() => {
    try {
        chrome.contextMenus.create({
            id: "RighClickEnabler",
            title: "RighClickEnabler",
            contexts: []
        });
    } catch (err) {}
});

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "saveTarget") {
        lastRightClickedElement = request.path;
        lastRightClickedHostname = request.hostname;
    }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "RighClickEnabler" && lastRightClickedElement) {
        if (!tab || !tab.id) return;

        chrome.storage.local.get(['DisabledSites'], (res) => {
            const disabledSites = res.DisabledSites || [];
            if (disabledSites.includes(lastRightClickedHostname)) return;

            chrome.tabs.sendMessage(tab.id, { 
                action: "hideConfirmed", 
                path: lastRightClickedElement,
                hostname: lastRightClickedHostname
            }, () => {
                if (!chrome.runtime.lastError) {
                    lastRightClickedElement = null;
                    lastRightClickedHostname = null;
                }
            });
        });
    }
});