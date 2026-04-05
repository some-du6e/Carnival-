function betterTopbar() {
    ///////////////////////////////////////////////////////////////////////////////
    // get rid of name and arrow in topbar cuz they stinky and we dont need them //
    ///////////////////////////////////////////////////////////////////////////////
    // pfp
    let kindapfpthing = document.getElementsByClassName("h-9 w-9 rounded-full bg-carnival-blue/15 border border-border flex items-center justify-center text-foreground font-bold")[0]
    if (!kindapfpthing) {
        console.error("Profile picture element not found, something has changed!")
        return
    }
    kindapfpthing.classList.add("profile-pic")
    // name
    let name = document.getElementsByClassName("text-foreground font-medium max-w-[220px] truncate")[0]
    if (!name) {
        console.error("Name element not found, something has changed!")
        return
    }
    name.classList.add("profile-name")
    
    // stupid arrow
    let possibleArrows = document.getElementsByClassName("text-carnival-blue") 
    let arrow = null
    for (let elem of possibleArrows) {
        if (elem.innerHTML.includes("▼")) {
            arrow = elem
            break
        }
    }
    if (!arrow) {
        console.error("Arrow element not found, something has changed!")
        return
    }   
    arrow.classList.add("profile-arrow")

    // now we have all the elements we need, let's get rid of them
    name.style.display = "none"
    arrow.style.display = "none"



    /////////////////////////////////////////////////////
    // 

    let tokens = document.getElementsByClassName("bg-carnival-blue/15 border border-border text-foreground px-4 py-2 rounded-full font-semibold inline-flex items-center gap-2")[0].children[0].textContent.replace("🪙 ", "") // ! really hardcoded
    let usdreal = parseInt(tokens, 10) * onetoken2usd
    let hours = localStorage.getItem("hours") || 0
}

function waitForSessionCheck() {
    const checkingElement = document.querySelector("div.flex.items-center.gap-3.sm\\:gap-6");
    if (checkingElement && checkingElement.textContent.includes("Checking session")) {
        setTimeout(waitForSessionCheck, 100);
        // console.error("Carnival+: still checking session, waiting to enhance topbar...")
    } else {
        betterTopbar();
    }
}

window.addEventListener('pageChange', function() {
    setTimeout(waitForSessionCheck, 300);
});

waitForSessionCheck();