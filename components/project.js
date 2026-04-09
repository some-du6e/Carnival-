function betterProjectPage() {
    if (!window.location.pathname.startsWith("/projects/")) {console.log("Carnival+: not on project page..."); return};
    console.log("Carnival+: betterProjectPage ran") // TODO: remove this log

    // inputs1
    let editorname = null
    let projectname = null
    let category = null
    let tags = null
    let videolink = null
    let playabledemo = null
    let repolink = null
    // inputs2
    let description = null
    // TODO: proper set ALL the variables, we are checking for the ones that could be placeholders

    // this is for the name, the editor, the category and the tags 
    let inputs1 = document.getElementsByClassName("w-full bg-background border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-carnival-blue/40")
    for (let input of inputs1) {
        if (input.tagName !== "INPUT") {continue}

        if (input.placeholder === "My awesome game") { projectname = input.value }
        if (input.placeholder === "e.g. JetBrains, Sublime, ...") { editorname = input.value }
        if (input.placeholder === "e.g. Productivity, Game Dev") { category = input.value }
        if (input.placeholder === "e.g. ai, web, multiplayer") { tags = input.value }
        if (input.placeholder === "https://youtu.be/... or https://...") { videolink = input.value }
        if (input.placeholder === "https://mygame.example.com or https://itch.io/...") { playabledemo = input.value }
        if (input.placeholder === "https://github.com/me/mygame") { repolink = input.value }


    }

    // this is for the description
    let inputs2 = document.getElementsByClassName("w-full bg-background border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-carnival-blue/40")
    for (let input of inputs2) {
        if (input.tagName !== "TEXTAREA") {continue}
        if (input.placeholder === "What are you building?") { description = input.value }
    }

    let screenshotssludge = null
    let possibleslop = document.getElementsByClassName("space-y-3") // yes bro we are finding it using a single class
    for (let slop of possibleslop) {
        // if (slop.classList === "space-y-3") {
        //     screenshotssludge = slop
        //     break
        // }
        // ^ didnt work
        if (slop.parentElement.children[0].innerText === "Screenshots") {
            screenshotssludge = slop
            break
        }
    }
    console.log("================== Project page info =================")
    console.log("Project name:", projectname)
    console.log("Editor name:", editorname)
    console.log("Category:", category)
    console.log("Tags:", tags)
    console.log("Description:", description)
    console.log("Video link:", videolink)
    console.log("Playable demo:", playabledemo)
    console.log("Repo link:", repolink)
    


    // check for placeholders now...
    function checkPlaceholders() {
        let placeholder = "placeholder"
        let placeholderforlinks = "placehold.co"
        let offenders = []

        // normal placeholders (like "placeholder" or "PLACEHOLDER")
        if (editorname.toLowerCase() === placeholder) { offenders.push("editor name") }
        if (projectname.toLowerCase() === placeholder) { offenders.push("project name") }
        if (category.toLowerCase() === placeholder) { offenders.push("category") }
        if (tags.toLowerCase() === placeholder) { offenders.push("tags")}

        // link placeholders (like "https://placehold.co/600x400?text=Playable+Demo")
        if (videolink.toLowerCase().includes(placeholderforlinks)) { offenders.push("video link") }
        if (playabledemo.toLowerCase().includes(placeholderforlinks)) { offenders.push("playable demo")}
        if (repolink.toLowerCase().includes(placeholderforlinks)) { offenders.push("repo link") }
        
        // THIS IS EXTREMELY HACKY 
        // todo: make this less wierd and less likely to break
        if (screenshotssludge) {
            if (screenshotssludge.innerHTML.toLowerCase().includes(placeholderforlinks)) {
                offenders.push("screenshots")
            }
        }


        return offenders

    }  
    let offenders = checkPlaceholders()
    console.log("Offenders:", offenders)



    // inject/or idk how its called but make the button check
    let possiblesubmitbuttons = document.getElementsByClassName("inline-flex items-center justify-center bg-carnival-blue hover:bg-carnival-blue/80 disabled:bg-carnival-blue/50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-full font-bold transition-colors")
    for (let button of possiblesubmitbuttons) {
        if (button.tagName !== "BUTTON") {continue}
        if (button.innerText !== "Submit for review") {continue}
        button.addEventListener("click", function(event) {
            let offenders = checkPlaceholders()

            if (offenders.length === 0) {
                console.log("Carnival+: no placeholders found, good to go!")
                return
            }else {
                event.preventDefault()
            }
            
            let wordinglist = ""
            for (let offender of offenders) {
                if (offenders[offenders.length - 1] === offender) {
                    wordinglist += "and " + offender
                } else {
                    wordinglist += offender + ", "

                }
            }

            alert("You have these still as a placeholder: " + wordinglist + "\nPlease fix them before submitting.")


        })
    }

}

window.addEventListener('pageChange', function() {
    setTimeout(betterProjectPage, 1000);
});


setTimeout(betterProjectPage, 400);