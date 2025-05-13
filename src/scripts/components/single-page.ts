import type { Route } from "../routes";
import type PageLayout from "./page-layout";
import routes from "../routes/index.js";
import type ConfirmDialog from "./confirm-dialog";

class SinglePage {
  private currentPath: string = "/";
  private app: HTMLElement | null = null;
  private appId = "app";

  constructor(page: Route) {
    this.app = document.getElementById(this.appId);
    this.setupEventListeners();
    this.handleInitialLoad();
  }

  private setupEventListeners(): void {
    // Navigation API 이벤트 리스너 등록
    window.navigation.addEventListener("navigate", (event: any) => {
      const navigateEvent = event as NavigateEvent;

      // 같은 오리진에서의 이동만 처리
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

  private handleInitialLoad(): void {
    // 초기 로드 처리
    const path = window.location.pathname;
    this.navigate(path);
  }

  private navigate(path: string): void {
    // 기본 경로 처리
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
    } else {
      // 404 처리
      this.renderNotFound();
    }
  }

  private renderContent(route: Route): void {
    if (this.app) {
      document.title = `${route.title}`;
      this.render(route);
    }
  }

  private renderNotFound(): void {
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

  render(page: Route) {
    const appEl = this.app;
    if (!appEl) throw Error("Cant not find containerEl");
    const prevContent = Array.from(appEl.children);
    if (prevContent.length) prevContent.forEach((prev) => prev.remove());
    // app init
    const layout = document.createElement("page-layout") as PageLayout;
    appEl.appendChild(layout);
    layout.setAttribute("title", page.title);
    layout.updateContent(page.content);
    if (page.style) layout.updateStyle(page.style);
  }
}

function shouldInterceptNavigation(navigateEvent: NavigateEvent): boolean {
  // 같은 오리진 내에서 발생한 일반 탐색만 처리
  return (
    navigateEvent.canIntercept &&
    navigateEvent.destination.url.startsWith(window.location.origin) &&
    !navigateEvent.downloadRequest &&
    !navigateEvent.formData
  );
}

export default SinglePage;
