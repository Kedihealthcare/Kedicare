/**
 * Kedi Healthcare - UI Component: Currency Switcher (Glassmorphism)
 * Dynamically binds to the global reactive Store to issue currency transitions.
 */

class CurrencySwitcher {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'glass-currency-switcher';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255, 255, 255, 0.6);
            border-radius: 30px;
            padding: 5px 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        this.select = document.createElement('select');
        this.select.style.cssText = `
            background: transparent;
            border: none;
            outline: none;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 600;
            color: #111;
            cursor: pointer;
            -webkit-appearance: none;
        `;

        const currencies = [
            { code: 'USD', label: 'USD ($)' },
            { code: 'NGN', label: 'NGN (₦)' },
            { code: 'PI', label: 'Pi (π)' }
        ];

        currencies.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.code;
            opt.textContent = c.label;
            this.select.appendChild(opt);
        });

        // Set initial state from store
        if (window.KediStore) {
            this.select.value = window.KediStore.state.currency;
        }

        const icon = document.createElement('span');
        icon.innerHTML = '💵';
        icon.style.fontSize = '18px';

        this.container.appendChild(icon);
        this.container.appendChild(this.select);
        document.body.appendChild(this.container);

        this.initEventListeners();
    }

    initEventListeners() {
        this.select.addEventListener('change', (e) => {
            const newCurr = e.target.value;
            // Reactive State Dispatch
            if (window.KediStore) {
                window.KediStore.setCurrency(newCurr);
            }
        });

        // Sync with external state changes (e.g. if changed elsewhere)
        window.addEventListener('kedi:currencyUpdated', (e) => {
            if (this.select.value !== e.detail) {
                this.select.value = e.detail;
            }
        });

        // Hover aesthetics
        this.container.addEventListener('mouseenter', () => {
            this.container.style.background = 'rgba(255, 255, 255, 0.6)';
            this.container.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.15)';
        });
        this.container.addEventListener('mouseleave', () => {
            this.container.style.background = 'rgba(255, 255, 255, 0.4)';
            this.container.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
        });
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    window.CurrencySwitcherComponent = new CurrencySwitcher();
});
