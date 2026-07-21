const events = [
    "copy",
    "cut",
    "paste",
    "contextmenu",
    "selectstart",
    "mousedown",
    "mouseup",
    "keydown",
    "keypress",
    "keyup",
    "dragstart"
];

for (const type of events) {

    window.addEventListener(type, e => {
        e.stopImmediatePropagation();
    }, true);

    document.addEventListener(type, e => {
        e.stopImmediatePropagation();
    }, true);
}

// Remove inline handlers
const clearHandlers = node => {

    const attrs = [
        "oncopy",
        "oncut",
        "onpaste",
        "oncontextmenu",
        "onselectstart",
        "ondragstart",
        "onmousedown",
        "onmouseup",
        "onkeydown",
        "onkeypress",
        "onkeyup"
    ];

    for (const attr of attrs)
        node.removeAttribute(attr);
};

const observer = new MutationObserver(() => {
    document.querySelectorAll("*").forEach(clearHandlers);
});

observer.observe(document, {
    childList: true,
    subtree: true
});

document.querySelectorAll("*").forEach(clearHandlers);
