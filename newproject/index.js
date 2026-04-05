

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
let submission = {
    "name":"project namee", 
    "description":"descriptionnn", 
    "editor":"other", 
    "editorOther":"editor", 
    "category":"category", 
    "tags":"tags",
    "hackatimeProjectName":"", 
    "hackatimeStartedAt":null, 
    "hackatimeStoppedAt":null, 
    "hackatimeTotalSeconds":null, 
    "videoUrl":"vid.com", 
    "playableDemoUrl":"demo.com", 
    "codeUrl":"gh.com", 
    "screenshots":["demo.com", "demo.com", "demo.com"], 
    "creatorDeclaredOriginality":gei("originality-checkbox").checked, 
    "creatorDuplicateExplanation": !gei("originality-checkbox").checked && gei("not-original-checkbox").checked ? gei("overlap-details-textarea").value : "", 
    "creatorOriginalityRationale":!gei("originality-checkbox").checked && gei("not-original-checkbox").checked ? gei("uniqueness-rationale-textarea").value : ""
}
// extra
let next_button = gei("next-button")
let back_button = gei("back-button")
// sections
let originalitysection = gei("originality-declaration")
let infosection = gei("info-section")

// selectionj and nex button
let sectionon = infosection
let flow = [originalitysection, infosection]
let sections = dc.getElementsByClassName("section") 
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
}}

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
let hackatimeprojectslist = gei("hackatime-projects")

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
        hackatimeprojectslist.innerHTML = ""
    
    if (hackatimeprojects.length > 0) {
      for (let project of hackatimeprojects) {
        let option = dc.createElement("option")
        option.value = project.name
        option.textContent = project.name
        hackatimeprojectslist.appendChild(option)
      }
        } else {
            let option = dc.createElement("option")
            option.value = ""
            option.textContent = "No Hackatime projects found"
            hackatimeprojectslist.appendChild(option)
    }
  } catch (error) {
    console.error("Error parsing hackatime projects:", error)
  }
}).catch(error => {
  console.error("Failed to fetch hackatime projects:", error)
})


// hackatime stuff
