import routes from "../routes/index.js";
class SinglePage {
    currentPath = "/";
    app = null;
    appId = "app";
    constructor(page) {
        this.app = document.getElementById(this.appId);
        this.setupEventListeners();
        this.handleInitialLoad();
    }
    setupEventListeners() {
        window.navigation.addEventListener("navigate", (event) => {
            const navigateEvent = event;
            if (shouldInterceptNavigation(navigateEvent)) {
                const url = new URL(navigateEvent.destination.url);
                const path = url.pathname;
                navigateEvent.intercept({
                    handler: async () => {
                        this.navigate(path);
                    },
                });
            }
        });
    }
    handleInitialLoad() {
        const path = window.location.pathname;
        this.navigate(path);
    }
    navigate(path) {
        if (path === "/") {
            this.renderContent(routes[0]);
            this.currentPath = "/";
            return;
        }
        const normalizedPath = path.startsWith("/") ? path.substring(1) : path;
        const route = routes.find((r) => {
            const routePath = r.href.startsWith("/") ? r.href.substring(1) : r.href;
            return routePath === normalizedPath;
        });
        if (route) {
            this.renderContent(route);
            this.currentPath = path;
        }
        else {
            this.renderNotFound();
        }
    }
    renderContent(route) {
        if (this.app) {
            document.title = `${route.title}`;
            this.render(route);
        }
    }
    renderNotFound() {
        if (this.app) {
            this.app.innerHTML = `
        <div class="not-found">
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for doesn't exist.</p>
          <a href="/">Go back to home</a>
        </div>
      `;
            document.title = "404 Not Found";
        }
    }
    render(page) {
        const appEl = this.app;
        if (!appEl)
            throw Error("Cant not find containerEl");
        const prevContent = Array.from(appEl.children);
        if (prevContent.length)
            prevContent.forEach((prev) => prev.remove());
        const layout = document.createElement("page-layout");
        appEl.appendChild(layout);
        layout.setAttribute("title", page.title);
        layout.updateContent(page.content);
        if (page.style)
            layout.updateStyle(page.style);
        const trigger = layout.findElement("#trigger");
        const modal = layout.findElement("confirm-dialog");
        console.log(trigger);
        trigger?.addEventListener("click", () => {
            modal.openModal();
        });
    }
}
function shouldInterceptNavigation(navigateEvent) {
    return (navigateEvent.canIntercept &&
        navigateEvent.destination.url.startsWith(window.location.origin) &&
        !navigateEvent.downloadRequest &&
        !navigateEvent.formData);
}
export default SinglePage;
