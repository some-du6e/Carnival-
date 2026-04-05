function betterProjects() {
    if (window.location.pathname !== "/projects") return;

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
        console.log(project)

    }
}

window.addEventListener('pageChange', function() {
    setTimeout(betterProjects, 300);
});

betterProjects()