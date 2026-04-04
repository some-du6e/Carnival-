function makeSidebarBetter() {
    // get rid of slop header in sidebar cuz it stinks
    const uglything = document.querySelector(".mt-2.text-xs.font-semibold.uppercase.tracking-\\[0\\.14em\\].text-\\[var\\(--platform-ink-muted\\)\\]")
    if (uglything) {
        // console.log(uglything)
        uglything.style.display = "none"
    } else {
        console.warn("Carnival+: theres no ugly header in the sidebar. pls remove this")
    }
}

window.addEventListener('pageChange', function() {
    setTimeout(makeSidebarBetter, 100)
});

makeSidebarBetter()
