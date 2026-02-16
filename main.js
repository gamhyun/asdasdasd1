const cardTemplate = document.createElement('template');
cardTemplate.innerHTML = `
    <style>
        :host {
            display: block;
            position: relative;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: var(--shadow-elevation-high);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card-glow {
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--color-glow), transparent 40%);
            opacity: 0;
            transition: opacity 0.5s ease;
            pointer-events: none; /* Make sure it doesn't block mouse events on the card */
        }

        :host(:hover) .card-glow {
            opacity: 1;
        }

        .card-content {
            background-color: var(--color-card-bg);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 12px;
        }

        h2 {
            color: var(--color-accent);
            margin-top: 0;
            font-size: 2.5rem;
            font-weight: 700;
        }

        p {
            font-size: 1.2rem;
            line-height: 1.6;
        }
    </style>
    <div class="card-glow"></div>
    <div class="card-content">
        <h2 id="title"></h2>
        <p id="message"></p>
        <slot></slot>
    </div>
`;

class InteractiveCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(cardTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('#title').innerText = this.getAttribute('title');
        this.shadowRoot.querySelector('#message').innerText = this.getAttribute('message');

        this.addEventListener('mousemove', (e) => {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            this.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        });
    }
}

customElements.define('interactive-card', InteractiveCard);

const THEME_KEY = 'theme';
const themeToggle = document.querySelector('#theme-toggle');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function getInitialTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }
    return systemPrefersDark.matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
}

applyTheme(getInitialTheme());

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem(THEME_KEY, nextTheme);
    });
}
