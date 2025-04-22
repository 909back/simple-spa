class DraftCard extends HTMLElement {
    static observedAttributes = ["title", "description", "link"];
    _title = '';
    _description = '';
    _link = '';
    constructor() {
        super();
    }
    connectedCallback() {
        this._render();
    }
    disconnectedCallback() {
    }
    connectedMoveCallback() {
    }
    adoptedCallback() {
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        switch (name) {
            case "title":
                this._title = newValue;
                break;
            case "description":
                this._description = newValue;
                break;
            case "link":
                this._link = newValue;
                break;
            default: break;
        }
    }
    _createElement(tag: any, className?: any) {
        const el = document.createElement(tag);
        if (className)
            Array.isArray(className) ? el.classList.add(...className) : el.classList.add(className);
        return el;
    }
    _render() {
        const shadow = this.attachShadow({
            mode: "open",
        });
        const stylesheet = new CSSStyleSheet();
        stylesheet.replaceSync(`
          *, *::after, *::before {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          :host {
              --maskUrl: url("data:image/svg+xml;utf8,<svg viewBox='0 0 84 68' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M75.333 8.99984H41.9997L36.108 3.10817C34.5455 1.54567 32.4247 0.666504 30.2163 0.666504H8.66634C4.08301 0.666504 0.333008 4.4165 0.333008 8.99984V58.9998C0.333008 63.5832 4.08301 67.3332 8.66634 67.3332H75.333C79.9163 67.3332 83.6663 63.5832 83.6663 58.9998V17.3332C83.6663 12.7498 79.9163 8.99984 75.333 8.99984Z' fill='white'/></svg>");
              --coverMaskUrl: url("data:image/svg+xml;utf8,<svg viewBox='0 0 84 68' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M75,0h-33.33S41.67,0,41.67,0H8.33C3.75,0,0,3.75,0,8.33v41.67c0,3.44,2.11,6.41,5.1,7.68,1,.42,2.09.66,3.24.66h66.67c4.58,0,8.33-3.75,8.33-8.33V8.33C83.33,3.75,79.58,0,75,0Z' fill='white'/></svg>");
              --tipH: 12.25%;
              --folderBg: linear-gradient(0deg, var(--gray-10) 10%, var(--gray-8));
              --content-padH: 16px;
          }
          .container {
            width: 100%;
            aspect-ratio: 1/1;
            padding: 18.92% 0 0;
          }

          .container:hover .inner .cover {
            transform: rotateX(8deg);
          }

          .container:hover .inner .paper {
            transform: translateY(-20px);
          }

          .inner {
            width: 100%;
            aspect-ratio: 1/0.8108;
            position: relative;
            display: flex;
          }

          .inner:before {
            position: absolute;
            z-index: -1;
            inset: 0;
            content: "";
            background-image: var(--folderBg);
            mask-image: var(--maskUrl);
            mask-size: 100% 100%;
            -webkit-mask-size: 100% 100%;
            mask-repeat: no-repeat;
            mask-size: contain;
          }

          .cover {
            position: absolute;
            height: calc(100% - var(--tipH));
            top: var(--tipH);
            left:0;
            right: 0;
            background-image: var(--folderBg);
            mask-image: var(--coverMaskUrl);
            mask-repeat: no-repeat;
            mask-size: cover;
            box-shadow: -10px -42px 75px -45px rgba(17,17,26,0.44);
            padding: 8%;
            transition: transform .3s ease;
          }

          .cover .title {
            color: var(--gray-1);
            font-size: 16px;
            margin: 0 0 12px;
          }

          .cover .desc {
            color: var(--gray-2);
            font-size: 12px;
            line-height: 1.4;
          }

          .paper {
            position: relative;
            width: calc(100% - (var(--content-padH) * 2));
            height: calc(100% - var(--tipH));
            margin: 0 auto;
            border-radius: 8px;
            background: #fff;
            box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.05) 0px 8px 32px;
            transform: translate3d(0, calc(var(--tipH) - 5px), 0);
            transition: transform .3s ease;
          }
    `);
        const link = this._createElement('a'), container = this._createElement('div', 'container'), inner = this._createElement('div', 'inner'), cover = this._createElement('div', 'cover'), title = this._createElement('p', 'title'), desc = this._createElement('p', 'desc'), paper = this._createElement('div', 'paper');
        link.setAttribute('href', this._link);
        title.append(this._title);
        desc.append(this._description);
        cover.append(title, desc);
        inner.append(paper, cover);
        container.append(inner);
        link.appendChild(container);
        shadow.appendChild(link);
        shadow.adoptedStyleSheets = [stylesheet];
    }
}
export default DraftCard;
