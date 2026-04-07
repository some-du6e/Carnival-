function betterProjectPage() {
    if (!window.location.pathname.startsWith("/projects/")) {console.log("Carnival+: not on project page..."); return};
    console.log("Carnival+: betterProjectPage ran") // TODO: remove this log

    // set le variables
    // TODO: proper set ALL the variables, we are checking for the ones that could be placeholders
    

}

window.addEventListener('pageChange', function() {
    setTimeout(betterProjectPage, 1000);
});


setTimeout(betterProjectPage, 1000);