// content.js

const hostname = window.location.hostname;


function enableCopyPaste() {

    console.log("Allow Copy Paste active");


    // ===============================
    // Force text selection + highlight
    // ===============================

    const style = document.createElement("style");

    style.textContent = `
    * {
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
    }

    ::selection {
        background:#3390ff !important;
        color:white !important;
    }

    ::-moz-selection {
        background:#3390ff !important;
        color:white !important;
    }
    `;

    (document.head || document.documentElement).appendChild(style);



    // ===============================
    // Stop event blockers
    // ===============================

    [
        "contextmenu",
        "copy",
        "cut",
        "paste",
        "selectstart",
        "dragstart",
        "beforeinput",
        "input",
        "keydown",
        "keyup"
    ].forEach(type => {

        document.addEventListener(
            type,
            function(e) {

                e.stopImmediatePropagation();

            },
            true
        );

    });



    // ===============================
    // Fix Method 10
    // Block removeAllRanges deselection
    // ===============================

    Selection.prototype.removeAllRanges = function() {

        console.log("Blocked removeAllRanges");

        return;

    };



    // ===============================
    // Remove inline event blockers
    // ===============================

    function removeInlineBlocks() {

        document.querySelectorAll("*").forEach(el => {

            [
                "oncontextmenu",
                "onselectstart",
                "oncopy",
                "oncut",
                "onpaste",
                "oninput",
                "ondragstart",
                "onkeydown",
                "onkeyup"
            ].forEach(attr => {

                el.removeAttribute(attr);

            });

        });

    }



    // ===============================
    // Fix transparent overlay blockers
    // Method 13
    // ===============================

    function removeSelectionOverlays() {

        document.querySelectorAll("*").forEach(el => {

            const style = getComputedStyle(el);

            if (
                style.position === "absolute" &&
                style.inset === "0px"
            ) {

                el.style.pointerEvents = "none";

            }

        });

    }



    // ===============================
    // Fix paste rollback
    // Method 14
    // ===============================

    function fixPasteInputs() {

        document.querySelectorAll("input, textarea").forEach(input => {

            input.removeAttribute("onpaste");
            input.removeAttribute("oninput");


            input.addEventListener(
                "paste",
                function(e) {

                    e.stopImmediatePropagation();

                },
                true
            );


            input.addEventListener(
                "input",
                function(e) {

                    e.stopImmediatePropagation();

                },
                true
            );

        });

    }



    // ===============================
    // Run immediately
    // ===============================

    removeInlineBlocks();
    removeSelectionOverlays();
    fixPasteInputs();



    // ===============================
    // Keep fixing dynamic pages
    // ===============================

    new MutationObserver(() => {

        removeInlineBlocks();
        removeSelectionOverlays();
        fixPasteInputs();

    }).observe(
        document.documentElement,
        {
            childList:true,
            subtree:true
        }
    );

}



// ===============================
// Check if this site is enabled
// ===============================

chrome.storage.local.get(['EnabledSites'], (result) => {

    const enabledSites = result.EnabledSites || [];

    if (enabledSites.includes(hostname)) {

        enableCopyPaste();

    }

});



// ===============================
// Allow popup to enable instantly
// ===============================

chrome.runtime.onMessage.addListener((message) => {

    if (message.action === "updateState") {

        chrome.storage.local.get(['EnabledSites'], (result) => {

            const enabledSites = result.EnabledSites || [];

            if (enabledSites.includes(hostname)) {

                enableCopyPaste();

            }

        });

    }

});