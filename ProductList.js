/**
 * Kedi Healthcare - Reactive Product List
 * Automatically recalculates and animates all DOM prices dynamically using KediStore.
 */

class ProductList {
    constructor() {
        this.initEventListeners();
        // Initial scan and format
        this.updateAllPrices();
    }

    initEventListeners() {
        window.addEventListener('kedi:currencyUpdated', () => this.updateAllPrices());
        window.addEventListener('kedi:ratesLoaded', () => this.updateAllPrices());
    }

    formatPrice(baseUSD) {
        const store = window.KediStore.state;
        const c = store.currency;
        const rate = store.exchangeRates[c];
        
        if (c === 'USD') {
            return `${baseUSD.toFixed(6)} π`;
        } else if (c === 'NGN') {
            const converted = baseUSD * rate;
            return `₦${converted.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        } else if (c === 'PI') {
            const converted = baseUSD * rate;
            return `${converted.toFixed(6)} π`;
        }
        return `${baseUSD.toFixed(6)} π`;
    }

    updateAllPrices() {
        // Find all elements marked with data-price-usd
        const priceElements = document.querySelectorAll('[data-price-usd]');
        
        priceElements.forEach(el => {
            const baseUsd = parseFloat(el.getAttribute('data-price-usd'));
            if (!isNaN(baseUsd)) {
                const newPrice = this.formatPrice(baseUsd);
                
                // Only update DOM if changed to prevent unnecessary re-renders (Performance)
                if (el.innerText !== newPrice) {
                    el.innerText = newPrice;
                    
                    // Smooth animation feedback
                    el.style.opacity = '0.5';
                    el.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'scale(1)';
                        el.style.transition = 'all 0.3s ease';
                    }, 50);
                }
            }
        });
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    if(window.KediStore) window.ProductListComponent = new ProductList();
});
