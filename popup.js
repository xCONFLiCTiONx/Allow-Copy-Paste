const toggleBtn = document.getElementById('toggle-btn');
const refreshBtn = document.getElementById('refresh-btn');
const testBtn = document.getElementById('test-btn');
const domainTitle = document.getElementById('domain-title');
const refreshNotice = document.getElementById('refresh-notice');

testBtn.onclick = () => {
    chrome.tabs.create({ url: 'https://xconflictionx.cc/test-right-click' });
};

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

    const tab = tabs[0];

    if (!tab || !tab.url || !tab.url.startsWith('http')) {
        domainTitle.textContent = "Unavailable";
        toggleBtn.disabled = true;
        refreshBtn.disabled = true;
        return;
    }

    try {

        const url = new URL(tab.url);
        const hostname = url.hostname;

        domainTitle.textContent = hostname;


        chrome.storage.local.get(['EnabledSites'], (result) => {

            const enabledSites = result.EnabledSites || [];

            const isEnabled = enabledSites.includes(hostname);

            updateButtonState(isEnabled);


            toggleBtn.onclick = () => {

                chrome.storage.local.get(['EnabledSites'], (res) => {

                    let sites = res.EnabledSites || [];

                    const currentlyEnabled = sites.includes(hostname);


                    if (currentlyEnabled) {

                        // Disable site
                        sites = sites.filter(h => h !== hostname);

                    } else {

                        // Enable site
                        sites.push(hostname);

                    }


                    chrome.storage.local.set(
                        { EnabledSites: sites },
                        () => {

                            updateButtonState(!currentlyEnabled);

                            refreshNotice.style.display = "block";


                            chrome.tabs.sendMessage(
                                tab.id,
                                { action: "updateState" },
                                () => {

                                    if (chrome.runtime.lastError) {}

                                }
                            );

                        }
                    );

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

        toggleBtn.textContent = "Disable for Site";
        toggleBtn.className = "enabled";

    } else {

        toggleBtn.textContent = "Enable for Site";
        toggleBtn.className = "disabled";

    }

}