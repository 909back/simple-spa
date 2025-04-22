export interface Route {
  title: string,
  href: string,
  content: string
  style?: string
}
const routes: Route[] = [
  {
    title: "Draft",
    href: "/",
    content: `
      <ol class="draft-grid">
        <li class="draft-item">
            <draft-card
              title="Confirm Dialog"
              description="Build a custom confirm dialog component"
              link="/confirm-dialog"
            ></draft-card>
        </li>
      </ol>
    `,
    style: `
      .draft-grid {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
      }

      .draft-item {
        width: 250px;
      }
    `
  },
  {
    title: "Confirm-dialog",
    href: "/confirm-dialog",
    content: `
      <button id="trigger">
        <span class="label" data-label="open modal"></span>
      </button>
      <confirm-dialog title="Custom Element" description="One of the key features of web components is the ability to create custom elements: that is, HTML elements whose behavior is defined by the web developer, that extend the set of elements available in the browser."></confirm-dialog>
    `,
    style: `
        #trigger {
      --accent: #fff;
      --place-color: light-dark(
        color-mix(in hsl, canvas, canvasText 56%),
        color-mix(in hsl, canvas, canvasText 56%)
      );
      --chosen:  linear-gradient(295deg, #0000 calc(50% - (6 * 0.5ch)), var(--accent), #0000 calc(50% + (6 * 0.5ch)));
      --bg: var(--chosen) 0 0 / 300% 100% no-repeat border-box,
      linear-gradient(var(--place-color), var(--place-color)) padding-box;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      border: none;
      height: 36px;
      padding: 0 16px;
      margin: 36px auto 0;
      background-color: var(--gray-3);
      border: 2px solid var(--place-color);
      border-radius: 4px;

      .label {
        border-radius: inherit;
        &::before, &::after {
          background: var(--bg);
          animation: shimmer 3s infinite both ease-in-out;
        }
      
        &::before {
          content: attr(data-label);
          background-clip: text;
          color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          pointer-events: none;
          z-index: 2;
        }
      
        &::after {
          content: '';
          position: absolute;
          inset: -2px;
          mask: linear-gradient(#0000, #0000) padding-box,
            linear-gradient(#fff, #fff) border-box;
          border: 2px solid #0000;
          mask-composite: intersect;
          -webkit-mask-composite: source-in;
          z-index: 0;
        }
      }
    }

    @keyframes shimmer {
      0% {
        background-position: 100% 0;
      }
      50%,
      100% {
        background-position: 0% 0;
      }
}
    `
  },
];

export default routes;
