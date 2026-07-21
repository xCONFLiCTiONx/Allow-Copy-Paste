console.log("MAIN WORLD FIX ACTIVE");


// Method 10 fix
// Block removeAllRanges attack

Selection.prototype.removeAllRanges = function(){

    console.log("Blocked removeAllRanges");

};


Selection.prototype.empty = function(){

    console.log("Blocked empty");

};


// Block collapse attacks

Selection.prototype.collapse = function(){

    console.log("Blocked collapse");

};


Selection.prototype.collapseToStart = function(){

    console.log("Blocked collapseToStart");

};


Selection.prototype.collapseToEnd = function(){

    console.log("Blocked collapseToEnd");

};


// Method 14 input rollback blocker

document.addEventListener(
"input",
function(e){

    e.stopImmediatePropagation();

},
true);


// Paste blocker

document.addEventListener(
"paste",
function(e){

    e.stopImmediatePropagation();

},
true);


// Select blocker

document.addEventListener(
"selectstart",
function(e){

    e.stopImmediatePropagation();

},
true);