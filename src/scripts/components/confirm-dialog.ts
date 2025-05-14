class ConfirmDialog extends HTMLElement {
    static observedAttributes = ["open", "title", "description"];
    _description = '';
    _title = "";
    _internals;
    _confirmFunc: (() => void) | null = null;
    constructor() {
        super();
        this._internals = this.attachInternals();
    }
    connectedCallback() {
        // console.log("Custom element added to page.");
        this._setShadowDom();
    }
    disconnectedCallback() {
        // console.log("Custom element removed from page.");
    }
    connectedMoveCallback() {
        // console.log("Custom element moved with moveBefore()");
    }
    adoptedCallback() {
        // console.log("Custom element moved to new page.");
    }
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        console.log(`Attribute ${name} has changed.`);
        if (!ConfirmDialog.observedAttributes.includes(name))
            return;
        switch (name) {
            case 'title': return this._title = newValue;
            case 'description': return this._description = newValue;
            default: return;
        }
    }
    openModal() {
        this._internals.states.add('open');
    }
    closeModal() {
        this._internals.states.delete('open');
    }
    set onConfirm(confirmFunc: () => void) {
        const confirmBtn = this.shadowRoot?.getElementById('confirm');
        if (!confirmBtn)
            return;
        if (this._confirmFunc)
            confirmBtn.removeEventListener('click', this._confirmFunc);
        confirmBtn.addEventListener('click', confirmFunc);
        this._confirmFunc = confirmFunc;
    }
    _setShadowDom() {
        const shadow = this.attachShadow({
            mode: 'open'
        });
        const stylesheet = new CSSStyleSheet();
        stylesheet.replaceSync(`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      :host {
        position: fixed;
        inset: 0;
        background-color: rgba(0,0,0,0.3);
        display: none;
        opacitiy: 0;
        align-items: center;
        justify-content: center;
        transition-property: display, opacity, background-color;
        transition: .3s ease;

        @starting-style {
          opacity: 0;
          display: none;
        }
      }

      :host(:state(open)) { 
        display: flex;
        opacitiy: 1;
      }

      .wrapper {
        width: 100%;
        max-width: 400px;
        background: #fff;
        padding: 24px 0;
        border-radius: 12px;
      }

      .header, .body, .footer { padding: 0 24px; }

      .header .title {
        font-size: 20px;
        font-weight: 800;
      }

      .body { padding: 24px; }

      .body .desc {
        padding: 12px 0;
        font-size: 14px;
        font-weight: 400;
      }

      .footer {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .footer .button {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 32px;
        border-radius: 4px;
        padding: 0 12px;
        border: none;
        font-family: inherit;
        background-color: var(--surface-primary-default);
        color: #fff;
        transition: background-color .3s ease;
        cursor: pointer;
      }

      .footer .button:hover { background-color: var(--surface-primary-hover); }
      .footer .button:active { background-color: var(--surface-primary-active); }

      .footer .button.close {
        --surface-primary-default: var(--gray-8);
        --surface-primary-hover: var(--gray-9);
        --surface-primary-active: var(--gray-10);
      }

      .footer .button.confirm {
        --surface-primary-default: var(--blue-8);
        --surface-primary-hover: var(--blue-9);
        --surface-primary-active: var(--blue-10);
      }
    `);
        const modal = document.createElement('div');
        modal.classList.add('wrapper');
        const header = document.createElement('div');
        header.classList.add('header');
        const title = document.createElement('p');
        title.classList.add('title');
        title.textContent = this._title;
        header.appendChild(title);
        const body = document.createElement('div');
        body.classList.add('body');
        const desc = document.createElement('p');
        desc.textContent = this._description;
        body.appendChild(desc);
        const footer = document.createElement('div');
        footer.classList.add('footer');
        const closeBtn = document.createElement('button');
        closeBtn.classList.add('button', 'close');
        const confirmBtn = document.createElement('button');
        confirmBtn.classList.add('button', 'confirm');
        confirmBtn.id = 'confirm';
        footer.append(closeBtn, confirmBtn);
        closeBtn.innerHTML = `<slot name="cancel-text"><span>Cancel</span></slot>`;
        confirmBtn.innerHTML = `<slot name="confirm-text"><span>Done</span></slot>`;
        closeBtn.addEventListener('click', () => this.closeModal());
        confirmBtn.addEventListener('click', () => this.closeModal());
        modal.append(header, body, footer);
        shadow.append(modal);
        shadow.adoptedStyleSheets = [stylesheet];
    }
}
export default ConfirmDialog;
