function qol() {
    // just noticed this shit is so fucking stupid and i want to get rid of it
    let possibleuglyheaders = document.getElementsByClassName("platform-page-heading mb-8 px-6 py-5")
    let foundheader = false
    for (let possibleuglyheader of possibleuglyheaders) {
        if (possibleuglyheader.tagName === "HEADER") {
            possibleuglyheader.style.display = "none"
            foundheader = true
        }
    }
    if (!foundheader) {
        console.error("Carnival+: No ugly header found, please change in qol.js")
    }
}



window.addEventListener('pageChange', function() {
    setTimeout(qol, 300);
});

qol();