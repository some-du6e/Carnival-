// window.dispatchEvent(new Event('pageChange'));

// const observer = new MutationObserver((mutations) => {
//     // We call it on every mutation, but makeSidebarBetter is fast
//     console.log("Carnival+: location changed via DOM mutation")
//     window.dispatchEvent(new Event('pageChange'));
// });

// observer.observe(document.body, {
//     childList: true,
//     subtree: true
// });


// // function testinsmth() {
// //     document.createElement("script").content = `
// //     console.log("Carnival+: testinsmth ran")`

// // }


// // document.addEventListener("DOMContentLoaded", () => {
// //     testinsmth()
// // })



const originalPushState = history.pushState;
history.pushState = function() {
    originalPushState.apply(this, arguments);
    window.dispatchEvent(new Event('locationchange'));
};

function alittlebitofgoop() {
    window.dispatchEvent(new Event('pageChange'));
}
window.addEventListener('locationchange', function() {
    setTimeout(alittlebitofgoop, 300); // TODO: see if i can do better than a timeout here
});