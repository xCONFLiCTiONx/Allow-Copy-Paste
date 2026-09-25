// renderIcon.js
function renderIcon() {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function updateTheme() {
        // Check if extension context is valid
        if (!chrome.runtime?.id) {
            mediaQuery.removeEventListener("change", updateTheme);
            return;
        }

        const isDarkMode = mediaQuery.matches;

        // Tell background script to update the extension toolbar icon safely
        try {
            chrome.runtime.sendMessage({ action: "updateIcon", isDarkMode }, () => {
                if (chrome.runtime.lastError) {
                    // Extension context was invalidated or background script is unreachable
                    mediaQuery.removeEventListener("change", updateTheme);
                }
            });
        } catch (e) {
            // Extension context invalidated
            mediaQuery.removeEventListener("change", updateTheme);
        }
    }

    // Run on load and listen for theme shifts
    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);
}