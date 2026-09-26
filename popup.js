const toggleBtn = document.getElementById('toggle-btn');
const refreshBtn = document.getElementById('refresh-btn');
const testBtn = document.getElementById('test-btn');
const domainTitle = document.getElementById('domain-title');
const refreshNotice = document.getElementById('refresh-notice');

if (testBtn) {
    testBtn.onclick = () => {
        chrome.tabs.create({ url: 'https://xconflictionx.cc/tools/allow-copy-paste' });
    };
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];

  if (!tab || !tab.url || !tab.url.startsWith("http")) {
    domainTitle.textContent = "Unavailable";
    toggleBtn.disabled = true;
    refreshBtn.disabled = true;
    return;
  }

  try {
    const url = new URL(tab.url);
    const pageUrl = url.href.split('#')[0];
    const displayTitle = url.href.replace(/^https?:\/\//, '').split('#')[0];

    domainTitle.textContent = displayTitle;

    chrome.storage.local.get(["EnabledPages"], (result) => {
      const enabledPages = result.EnabledPages || [];

      const isEnabled = enabledPages.includes(pageUrl);

      updateButtonState(isEnabled);

      toggleBtn.onclick = () => {
        chrome.storage.local.get(["EnabledPages"], (res) => {
          let pages = res.EnabledPages || [];

          const currentlyEnabled = pages.includes(pageUrl);

          if (currentlyEnabled) {
            // Disable for page
            pages = pages.filter((p) => p !== pageUrl);
          } else {
            // Enable for page
            pages.push(pageUrl);
          }

          chrome.storage.local.set({ EnabledPages: pages }, () => {
            updateButtonState(!currentlyEnabled);

            refreshNotice.style.display = "block";

            chrome.tabs.sendMessage(tab.id, { action: "updateState" }, () => {
              if (chrome.runtime.lastError) {
              }
            });
          });
        });
      };

      refreshBtn.onclick = () => {
        chrome.tabs.reload(tab.id, () => {
          window.close();
        });
      };
    });
  } catch (e) {
    domainTitle.textContent = "Invalid URL";
    toggleBtn.disabled = true;
    refreshBtn.disabled = true;
  }
});

function updateButtonState(isActive) {
  if (isActive) {
    toggleBtn.textContent = "Disable for Page";
    toggleBtn.className = "enabled";
  } else {
    toggleBtn.textContent = "Enable for Page";
    toggleBtn.className = "disabled";
  }
}
