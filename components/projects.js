function betterProjects() {
    if (window.location.pathname !== "/projects") {console.log("Carnival+: not on projects page..."); return};
    console.log("Carnival+: betterProjects ran") // TODO: remove this log

    let projects = {
        // "072d665d-78fd-4ae3-b70d-3d302e652383": {
        //     "name": "Carnival+",
        //     "description": "A browser extension that makes Carnival better.",
        //     "status": "In review",
        //     "hours": "0h15m"
        // }
    }

    let whereAllTheProjectsAre = document.getElementsByClassName("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6")[0]

    for (let project of whereAllTheProjectsAre.children) {
        // console.log(project)
        // name and description are easy to get
        let name = project.getElementsByClassName("text-foreground font-bold text-xl truncate")[0].innerText
        let description = project.getElementsByClassName("text-muted-foreground mt-2 overflow-hidden")[0].innerText
        // hours is not...
        // thinking after writing this and maybe i should have just checked if the classname is exactly the same
        let hoursregex = /^\d{1,3}h\d{1,3}m$/; // ai generated cuz i could never ever figure this out
        let possiblehours = project.getElementsByClassName("text-foreground font-semibold")
        let hours = "Unknown"
        for (let possiblehour of possiblehours) {
            // console.log("Possible hour:", possiblehour.innerText)
            let cleanedhour = possiblehour.innerText.replace(" ", "")
            if (cleanedhour.match(hoursregex)) {
                hours = cleanedhour
            }
        }
        // convert it into a number of hours fr
        let hourss = hours.split("h")[0]
        hourss = parseInt(hourss, 10)
        let minutes = hours.split("h")[1].replace("m", "")
        minutes = parseInt(minutes, 10)

        hours = hourss + (minutes / 60)
        // only allow 2 decimal places
        hours = Math.round(hours * 100) / 100
        if (hours === "Unknown") {console.error("Something changed! Couldn't find hours for project", name)}
        // editor is ez too
        let editor = project.getElementsByClassName("inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold whitespace-nowrap bg-muted text-foreground border-border")[0].innerText
        // status a little bit harder
        let status = project.getElementsByClassName("flex flex-col items-end gap-2 shrink-0")[0].children[1].innerText

        // id is a tiny bit harder 
        let id = project.href.replace("/projects/", "").replace(location.origin, "")

        // log all of them TEMP
        // console.log("Name:", name)
        // console.log("Description:", description)
        // console.log("Hours:", hours)
        // console.log("Hourss:", hourss)
        // console.log("Minutes:", minutes)
        // console.log("Editor:", editor)
        // console.log("Status:", status)
        // console.log("ID:", id)
        // console.log("---------------------------------------")

        // add that stuff
        projects[id] = {
            "name": name,
            "description": description,
            "hours": hours,
            "editor": editor,
            "status": status
        }
    }
    console.log("Carnival+: projects", projects)

    // should save hours first...
    let totalHours = 0
    for (let project in projects) {
        totalHours += projects[project].hours
    }
    console.log("Carnival+: total hours", totalHours)
    localStorage.setItem("hours", totalHours)
    

    // change the add project button to our own...
    /// i dont think there are several but just in case
    let possibleaddprojectbuttons = document.getElementsByClassName("fixed bottom-6 right-6 h-14 w-14 rounded-full bg-carnival-red hover:bg-carnival-red/80 text-white flex items-center justify-center shadow-xl border border-border carnival-glow transition-all hover:scale-105")

    console.log("Carnival+: location.origin:", location.origin)
    for (let possibleaddprojectbutton of possibleaddprojectbuttons) {
        // change it fr now
        possibleaddprojectbutton.href = chrome.runtime.getURL("newproject/index.html")
        // change the onclick thing too
        possibleaddprojectbutton.onclick = function(e) {
            e.preventDefault() // prevent the default action of the link
            // open a new tab
            window.open(chrome.runtime.getURL("newproject/index.html"), "_blank")
        }
        console.log("possible add button: ",possibleaddprojectbutton)
    }

}

window.addEventListener('pageChange', function() {
    setTimeout(betterProjects, 1000);
});


setTimeout(betterProjects, 1000);