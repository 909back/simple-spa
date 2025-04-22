import { router } from "./contranst.js";
function shouldNotIntercept(navigationEvent) {
    return (!navigationEvent.canIntercept ||
        navigationEvent.hashChange ||
        navigationEvent.downloadRequest ||
        navigationEvent.formData);
}
window.navigation.addEventListener('navigate', ev => {
    const url = new URL(ev.destination.url);
    if (shouldNotIntercept(ev))
        return;
    if (location.origin !== url.origin)
        return;
    const pathname = url.pathname;
    const route = router.find(r => r.href === pathname) ?? { href: "/notFound", title: 'Not Found' };
    ev.intercept({
        scroll: "manual",
        handler: async () => {
            await renderPage(route);
        }
    });
});
function adoptedStyleSheets(href) {
    const linkEls = document.querySelectorAll(`link`);
    linkEls.forEach(linkEl => {
        console.dir(linkEl);
        if (linkEl.title === 'default')
            return;
        linkEl.remove();
    });
    if (href?.length)
        href.forEach(href => {
            const linkEl = document.createElement('link');
            linkEl.rel = 'stylesheet';
            linkEl.href = href;
            document.head.append(linkEl);
        });
}
async function renderPage(route) {
    const res = await fetch('/pages' + route.href);
    console.log(res);
    const content = await res.text();
    updateContent(content);
    adoptedStyleSheets(route.stylesheets);
}
function updateContent(content) {
    const containerEl = document.getElementById('main') ?? document.body;
    containerEl.innerHTML = content;
}
