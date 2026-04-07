

// let submission = {
//     "name":"project namee", 
//     "description":"descriptionnn", 
//     "editor":"other", 
//     "editorOther":"editor", 
//     "category":"category", 
//     "tags":"tags",
//     "hackatimeProjectName":"", 
//     "hackatimeStartedAt":null, 
//     "hackatimeStoppedAt":null, 
//     "hackatimeTotalSeconds":null, 
//     "videoUrl":"vid.com", 
//     "playableDemoUrl":"demo.com", 
//     "codeUrl":"gh.com", 
//     "screenshots":["demo.com", "demo.com", "demo.com"], 
//     "creatorDeclaredOriginality":true, 
//     "creatorDuplicateExplanation":"", 
//     "creatorOriginalityRationale":""
// }
// ^ this is when its pretty and stuff
let dc = document
let gei = document.getElementById.bind(document)
// SLOP BEGIN //
function buildCarnivalUrl(pathOrUrl) {
    if (typeof pathOrUrl !== "string" || pathOrUrl.trim() === "") {
        throw new Error("pathOrUrl must be a non-empty string")
    }

    if (pathOrUrl.startsWith("https://")) {
        return pathOrUrl
    }

    if (!pathOrUrl.startsWith("/")) {
        return "https://carnival.hackclub.com/" + pathOrUrl
    }

    return "https://carnival.hackclub.com" + pathOrUrl
}

function carnivalRequest(pathOrUrl, options = {}) {
    return new Promise(function(resolve, reject) {
        if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
            reject(new Error("chrome.runtime.sendMessage is not available"))
            return
        }

        let url
        try {
            url = buildCarnivalUrl(pathOrUrl)
        } catch (error) {
            reject(error)
            return
        }

        chrome.runtime.sendMessage(
            {
                type: "CARNIVAL_FETCH",
                payload: {
                    url,
                    method: options.method || "GET",
                    headers: options.headers || undefined,
                    body: options.body || undefined
                }
            },
            function(response) {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message))
                    return
                }

                if (!response || response.ok !== true) {
                    reject(new Error(response && response.error ? response.error : "Unknown request error"))
                    return
                }

                resolve(response)
            }
        )
    })
}

window.carnivalRequest = carnivalRequest
///////////////////////////////////////////////////////////////////
// slop end //

// extra
let next_button = gei("next-button")
let back_button = gei("back-button")
// sections
let originalitysection = gei("originality-declaration")
let infosection = gei("info-section")
let demosection = gei("demo-section")
let screenshotsection = gei("screenshot-section")
let submitsection = gei("submit-section")
// selectionj and nex button
let sectionon = originalitysection
let flow = [originalitysection, infosection, demosection, screenshotsection, submitsection]
let sections = dc.getElementsByClassName("section")

// DEBUG AUTOFILL
window.debugautofill = function() {
    // Fill all fields first
    gei("originality-checkbox").checked = true
    gei("overlap-details-textarea").value = "Test overlap details"
    gei("uniqueness-rationale-textarea").value = "Test uniqueness rationale"
    gei("project-name-input").value = "My Awesome Project"
    gei("project-description-input").value = "This is a test project description for debugging purposes."
    gei("project-editor-input").value = "VS Code"
    gei("hackatime-input").value = ""
    gei("project-category-input").value = "Web"
    gei("project-tags-input").value = "test, debug, carnival"
    gei("demo-vid-link-input").value = "https://youtube.com/watch?v=test"
    gei("playable-demo-link-input").value = "https://example.com/demo"
    gei("github-link-input").value = "https://github.com/test/project"

    // Navigate to demosection so renderSectionthing enables next_button
    sectionon = demosection
    renderSectionthing()

    // Force enable both buttons (bypass section logic)
    next_button.hidden = false
    next_button.disabled = false
    back_button.hidden = false
    back_button.disabled = false
}
 
function renderSectionthing() {
    if (sectionon === flow[0]) {
        back_button.hidden = true
    }else {
        back_button.hidden = false
    }
    for (let section of sections) {

        if (section === sectionon) {
            section.hidden = false
        }     else {
            section.hidden = true
        }
}
if (sectionon === submitsection) {
    next_button.hidden = true   
}else {
    next_button.hidden = false
}
if (sectionon === demosection || sectionon === screenshotsection) {
    next_button.disabled = false // demo section is optional    
}else {
    next_button.disabled = true // the section should enable it themself...
}
}

renderSectionthing()
next_button.addEventListener("click", function() {
    sectionon = flow[flow.indexOf(sectionon)+1]
    renderSectionthing()
})
back_button.addEventListener("click", function() {
    sectionon = flow[flow.indexOf(sectionon)-1]
    renderSectionthing()
})
// originality sutff
let originalcheckbox = gei("originality-checkbox")
let notoriginalcheckbox = gei("not-original-checkbox")
let notoriginaldetails = gei("originality-overlap-details")
let uniquenessrationale = gei("uniqueness-rationale-textarea")
originalcheckbox.addEventListener("change", function() {
    if (originalcheckbox.checked) {
        notoriginalcheckbox.checked = false
        next_button.disabled = false
        notoriginaldetails.hidden = true
    }else if (!notoriginalcheckbox.checked) {
        next_button.disabled = true
    }
})

notoriginalcheckbox.addEventListener("change", function() {
    if (notoriginalcheckbox.checked) {
        originalcheckbox.checked = false
        if (uniquenessrationale.value.trim() === "") {
            next_button.disabled = true
        }else {
            next_button.disabled = false
        }
        notoriginaldetails.hidden = false
    }else if (!originalcheckbox.checked) {
        next_button.disabled = true
        notoriginaldetails.hidden = true
    }
})

uniquenessrationale.addEventListener("input", function() {
    if (uniquenessrationale.value.trim() === "" && notoriginalcheckbox.checked) {
        next_button.disabled = true
    }else {
        next_button.disabled = false
    }
})


// info section
let projectname = gei("project-name-input")
let descrpition = gei("project-description-input")
let editor = gei("project-editor-input")
let hackatimeprojects = []
let hackatimeprojectsmap = {} // maps project names to their full data
let hackatimeinput = gei("hackatime-input")
let hackatimeprojectos = gei("hackatime-projects")
let projectcategory = gei("project-category-input")
let projecttags = gei("project-tags-input")

window.carnivalRequest("https://carnival.hackclub.com/api/hackatime/projects?returnTo=%2Fprojects%3Fnew%3D1", {
  "headers": {
    "accept": "*/*",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
  },
  "referrer": "https://carnival.hackclub.com/projects?new=1",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
}).then(response => {
  try {
    const data = typeof response.body === 'string' ? JSON.parse(response.body) : response.body
        hackatimeprojects = Array.isArray(data) ? data : (Array.isArray(data.projects) ? data.projects : [])
        hackatimeprojectos.innerHTML = ""
        hackatimeprojectsmap = {} // reset the map
    
    if (hackatimeprojects.length > 0) {
      for (let project of hackatimeprojects) {
        let option = dc.createElement("option")
        option.value = project.name
        option.textContent = project.name
        hackatimeprojectos.appendChild(option)
        // store the full project data in the map
        hackatimeprojectsmap[project.name] = {
          totalSeconds: project.totalSeconds,
          startedAt: project.startedAt,
          stoppedAt: project.stoppedAt
        }
      }
        } else {
            let option = dc.createElement("option")
            option.value = ""
            option.textContent = "No Hackatime projects found"
            hackatimeprojectos.appendChild(option)
    }
  } catch (error) {
    console.error("Error parsing hackatime projects:", error)
  }
}).catch(error => {
  console.error("Failed to fetch hackatime projects:", error)
})

// TODO write the logic for all the other ones not only for the project name
projectname.addEventListener("input", function() {
    if (uniquenessrationale.value.trim() === "" && notoriginalcheckbox.checked) {
        next_button.disabled = true
    }else {
        next_button.disabled = false
    }
})

// track selected hackatime project data
let selectedhackatimeproject = null
hackatimeinput.addEventListener("input", function() {
    const projectname = hackatimeinput.value.trim()
    if (hackatimeprojectsmap[projectname]) {
        selectedhackatimeproject = {
            name: projectname,
            ...hackatimeprojectsmap[projectname]
        }
    } else {
        selectedhackatimeproject = null
    }
})

// demo section
let demovidurlinput = gei("demo-vid-link-input")
let demoplayableurlinput = gei("playable-demo-link-input")
let githuburlinput = gei("github-link-input")

function autofillDemoLink() {
    if (!githuburlinput.value.startsWith("https://github.com/") || !githuburlinput.value.startsWith("http://github.com/") || !githuburlinput.value.trim() === "") { alert("Thats not a github url bud"); return}
    let ghurl = githuburlinput.value.trim()
    if (ghurl.endsWith("/")) {ghurl = ghurl.slice(0, -1)}
    let releaseurl = ghurl + "/releases/latest"
    if (confirm("Do you want to autofill the playable demo link with the latest release from your github?")) {
        demoplayableurlinput.value = releaseurl
    }else {
        alert("ok bud")
    }
}

let autofillLink = gei("autofill-demo-link")
if (autofillLink) {
    autofillLink.addEventListener("click", function(e) {
        e.preventDefault()
        autofillDemoLink()
    })
}       

// screenshots
// todo: do not make it a text area and make it a proper uploader
let screenshots = [
    "https://placehold.co/600x400?text=Screenshot-1",
    "https://placehold.co/600x400?text=Screenshot-2",
    "https://placehold.co/600x400?text=Screenshot-3"
]
let screenshotstextarea = gei("screenshot-links-input")
screenshotstextarea.addEventListener("input", function() {
    screenshots = []
    screenshotstextarea.value.split(/\r?\n/).forEach((line, index) => {
        if (line.trim() !== "") {
            screenshots.push(line.trim())
        }
    })
    if (screenshots.length < 3) {
        // console.log("bud didnt add 3 screenshots, adding placeholders")
        while (screenshots.length < 3) {
            screenshots.push("https://placehold.co/600x400?text=Screenshot-" + (screenshots.length + 1))
        }
    }
    // console.log("Updated screenshots array:", screenshots)
})


// submit
let submitbutton = gei("submit-button")
submitbutton.addEventListener("click", function() {
    // fill the demo links with placeholders if they are empty
    if (demovidurlinput.value.trim() === "") {
        demovidurlinput.value = "https://placehold.co/600x400?text=Demo+Video"
    }
    if (demoplayableurlinput.value.trim() === "") {
        demoplayableurlinput.value = "https://placehold.co/600x400?text=Playable+Demo"
    }
    if (githuburlinput.value.trim() === "") {
        githuburlinput.value = "https://placehold.co/600x400?text=GitHub+Repo"
    }

    let submission = {
        "name":projectname.value, 
        "description":descrpition.value, 
        "editor":"other", // TODO: get official values cuz this is hella hacky 
        "editorOther":editor.value, 
        "category":projectcategory.value, 
        "tags":projecttags.value,
        "hackatimeProjectName": selectedhackatimeproject ? selectedhackatimeproject.name : "", 
        "hackatimeStartedAt": selectedhackatimeproject ? selectedhackatimeproject.startedAt : null, 
        "hackatimeStoppedAt": selectedhackatimeproject ? selectedhackatimeproject.stoppedAt : null, 
        "hackatimeTotalSeconds": selectedhackatimeproject ? selectedhackatimeproject.totalSeconds : null, 
        "videoUrl":demovidurlinput.value, 
        "playableDemoUrl":demoplayableurlinput.value, 
        "codeUrl":githuburlinput.value, 
        "screenshots": screenshots, 
        "creatorDeclaredOriginality":gei("originality-checkbox").checked, 
        "creatorDuplicateExplanation": !gei("originality-checkbox").checked && gei("not-original-checkbox").checked ? gei("overlap-details-textarea").value : "", 
        "creatorOriginalityRationale":!gei("originality-checkbox").checked && gei("not-original-checkbox").checked ? gei("uniqueness-rationale-textarea").value : ""
    }

    console.log("Final submission object:", submission)
    const choice = confirm("Are you sure? Check the console for what is going to be sent.")
    if (choice) {
        window.carnivalRequest("https://carnival.hackclub.com/api/projects", {
          "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,es;q=0.8",
            "content-type": "application/json",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
          },
          "referrer": "https://carnival.hackclub.com/projects?new=1",
          "body": JSON.stringify(submission),
          "method": "POST",
          "mode": "cors",
          "credentials": "include" 
        }).then(response => {
            console.log("Submission successful:", response)
            alert("Project submitted successfully!")
        })
    }else {
        alert("alright")
    }
})