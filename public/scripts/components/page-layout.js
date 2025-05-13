class PageLayout extends HTMLElement {
    static observedAttributes = ["title"];
    _internals;
    pageTitle = "";
    constructor() {
        super();
        this._internals = this.attachInternals();
    }
    connectedCallback() {
        this.render();
    }
    disconnectedCallback() {
    }
    connectedMoveCallback() {
    }
    adoptedCallback() {
    }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "title":
                this.pageTitle = newValue;
                this.update.title(newValue);
                break;
            default:
                break;
        }
    }
    update = {
        title: this.rerender.bind(this, "h1"),
        content: this.rerender.bind(this, "main"),
        style: (style) => {
            const stylesheet = new CSSStyleSheet();
            stylesheet.replaceSync(style);
            const root = this.shadowRoot;
            if (!root)
                return;
            root.adoptedStyleSheets = [
                ...(root.adoptedStyleSheets ?? []),
                stylesheet,
            ];
        },
    };
    updateContent = this.update.content;
    updateStyle = this.update.style;
    rerender(selector, content) {
        const target = this.shadowRoot?.querySelector(selector);
        if (!target)
            throw Error("Can not rerender");
        target.innerHTML = content;
    }
    createElement(tag, { className, id } = {}) {
        const el = document.createElement(tag);
        if (className)
            el.classList.add(...(Array.isArray(className) ? className : [className]));
        if (id)
            el.id = id;
        return el;
    }
    render() {
        const shadow = this.attachShadow({ mode: "open" });
        const stylesheet = new CSSStyleSheet();
        stylesheet.replaceSync(`
		*, *::after, *::before {
			padding: 0;
			margin: 0;
			box-sizing: border-box;
		}
		ol, ul, li { list-style: none };
		:host {
			--headerH: 54px;
			--footerH: 24px;
		}
		#main {
			position: relative;
			z-index: 1;
			background-color: #fffef8;
			background-image: radial-gradient(#c3d4f7 1px, transparent 1px);
			background-size: 20px 20px;

			height: 100%;
			font-size: 14px;

			display: flex;
			flex-direction: column;
		}

		#main::before {
			content: "";
			position: absolute;
			inset: 0;
			background-image: linear-gradient(134deg, transparent 5% 1%, #fff);
			z-index: -1;
		}

		header,
		main,
		footer {
			width: 100%;
			max-width: 800px;
			margin: 0 auto;
		}

		header {
			flex: 0 0 var(--headerH);
			height: var(---headerH);
			display: flex;
			align-items: center;
			justify-content: center;
		}

		header h1 {
			font-size: 1.6rem;
		}

		main {
			flex: 1 0 auto;
			min-height: 0px;
		}

		footer {
			flex: 0 0 var(--footerH);
			height: var(---footerH);
			display: flex;
			align-items: center;
		}

		footer .copy {
			color: var(--gray-10);
			font-size: 12px;
		}

  `);
        const wrapper = this.createElement("div", { id: "main" }), header = this.createElement("header"), h1 = this.createElement("h1"), main = this.createElement("main"), footer = this.createElement("footer"), copy = this.createElement("span", { className: "copy" });
        h1.textContent = this.pageTitle;
        header.appendChild(h1);
        main.innerHTML = `<p>loading...</p>`;
        copy.innerHTML = `&copy; bis909`;
        footer.appendChild(copy);
        wrapper.append(header, main, footer);
        shadow.adoptedStyleSheets = [stylesheet];
        shadow.appendChild(wrapper);
    }
}
export default PageLayout;
