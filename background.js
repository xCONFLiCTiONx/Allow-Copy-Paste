chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateIcon") {
        updateExtensionIcon(request.isDarkMode);
    }
});

function createIconImageData(size, iconColor) {
    const canvas = new OffscreenCanvas(size, size);
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = iconColor;

    ctx.save();
    const scale = size / 24;
    ctx.scale(scale, scale);
    const p = new Path2D(
        "M10.25 2H13.75C14.9079 2 15.8616 2.87472 15.9862 3.99944L17.75 4C18.9926 4 20 5.00736 20 6.25V11.4982C19.2304 11.1772 18.3859 11 17.5 11C13.9101 11 11 13.9101 11 17.5C11 19.2465 11.6888 20.8321 12.8096 22H6.25C5.00736 22 4 20.9926 4 19.75V6.25C4 5.00736 5.00736 4 6.25 4L8.01379 3.99944C8.13841 2.87472 9.09205 2 10.25 2ZM13.75 3.5H10.25C9.83579 3.5 9.5 3.83579 9.5 4.25C9.5 4.66421 9.83579 5 10.25 5H13.75C14.1642 5 14.5 4.66421 14.5 4.25C14.5 3.83579 14.1642 3.5 13.75 3.5ZM23 17.5C23 20.5376 20.5376 23 17.5 23C14.4624 23 12 20.5376 12 17.5C12 14.4624 14.4624 12 17.5 12C20.5376 12 23 14.4624 23 17.5ZM20.8536 15.1464C20.6583 14.9512 20.3417 14.9512 20.1464 15.1464L16.5 18.7929L14.8536 17.1464C14.6583 16.9512 14.3417 16.9512 14.1464 17.1464C13.9512 17.3417 13.9512 17.6583 14.1464 17.8536L16.1464 19.8536C16.3417 20.0488 16.6583 20.0488 16.8536 19.8536L20.8536 15.8536C21.0488 15.6583 21.0488 15.3417 20.8536 15.1464Z"
    );
    ctx.fill(p);
    ctx.restore();

    return ctx.getImageData(0, 0, size, size);
}

async function updateExtensionIcon(isDarkMode) {
    const iconColor = isDarkMode ? "#FFFFFF" : "#000000";

    try {
        await chrome.action.setIcon({
            imageData: {
                16: createIconImageData(16, iconColor),
                32: createIconImageData(32, iconColor),
                48: createIconImageData(48, iconColor)
            }
        });
    } catch (err) {
        console.error("Failed to set extension icon:", err);
    }
}

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