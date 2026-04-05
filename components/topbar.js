function betterTopbar() {
    let sidethingwiththepfpandtokens = document.getElementsByClassName("flex items-center gap-3 sm:gap-6")[0]
    if (!sidethingwiththepfpandtokens) {
        console.error("Topbar element not found, something has changed!")
        return
    }
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

    // get le values
    let tokens = document.getElementsByClassName("bg-carnival-blue/15 border border-border text-foreground px-4 py-2 rounded-full font-semibold inline-flex items-center gap-2")[0].children[0].textContent.replace("🪙 ", "") // ! really hardcoded
    let usdreal = parseInt(tokens, 10) * onetoken2usd
    let hours = localStorage.getItem("hours") || '...'
    let predictedUSD = "wait"
    if (hours !== "...") {
        predictedUSD = (parseFloat(hours) * onehour2usd).toFixed(2)
    }else {
        predictedUSD = "..."
    }

    // get rid of the wierd thing all in one with a converter thing
    // TODO: figure out what to do with the convert button thing
    let wierdtokenthing = document.getElementsByClassName("bg-carnival-blue/15 border border-border text-foreground px-4 py-2 rounded-full font-semibold inline-flex items-center gap-2")[0]
    if (!wierdtokenthing) {
        console.error("Token element not found, something has changed!")
        return
    }
    wierdtokenthing.style.display = "none" // bye bud


    // create our own now
    // let tailwindpillthing = "inline-flex items-center gap-1.5 px-3 py-1.25 bg-secondary border border-1.5 border-border rounded-full text-xs font-semibold text-text-primary tabular-nums transition-all duration-200"
    // let customTokenElement = document.createElement("div")
    // customTokenElement.className = tailwindpillthing
    // customTokenElement.innerHTML = `🪙 ${tokens}`
    // sidethingwiththepfpandtokens.prepend(customTokenElement)
    // ^ stinky
    let order = {}

    function render() {
        if (localStorage.getItem("larpingUSD") === "true") {
            order = [hours, predictedUSD, tokens]
        }else {
            order = [hours, usdreal, tokens]
        }
        let possibleOldThings = sidethingwiththepfpandtokens.querySelectorAll(".topbar-pill")
        for (let thing of possibleOldThings) {
            thing.remove()
        }
        for (let sigma of order) {
            let divv = document.createElement(sigma === usdreal || sigma === predictedUSD ? "a" : "div")
            // V half of these classes can probably be deleted
            divv.className = "topbar-pill inline-flex items-center gap-2 px-4 py-1 border border-border bg-[#f8fafc] border-[1.5px] border-solid border-[#e2e8f0] rounded-[20px] text-[13px] font-semibold text-[#0f172a] tabular-nums transition-all duration-200 ease-out bg-carnival-blue/15 rounded-full"
            if (sigma === usdreal || sigma === predictedUSD) {
                divv.href = "javascript:void(0)"
                divv.onclick  = function() {
                    if (localStorage.getItem("larpingUSD") === "true") {
                        localStorage.setItem("larpingUSD", "false")
                        render()
                     }else {
                        localStorage.setItem("larpingUSD", "true")
                        render()
                     }
                }
            }
            let emoji = "🫠"
            if (sigma === tokens) {
                emoji = "🪙"
            }else if (sigma === usdreal) {
                emoji = "💵"
            }else if (sigma === hours) {
                emoji = "⏱️"
            }else if (sigma === predictedUSD) {
                emoji = "💸"
            }
            divv.innerHTML = `
                <span class="text-[14px] leading-none opacity-90">${emoji}</span>
                <span class="text-[13px] font-bold text-[#0f172a] tabular-nums">${sigma}</span>
            `
            sidethingwiththepfpandtokens.prepend(divv)
        }
        sidethingwiththepfpandtokens.classList.remove("sm:gap-6")
    }
    render()
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