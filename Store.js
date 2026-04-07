/**
 * Kedi Healthcare - Reactive Global Store
 * Manages Cart State, Currency Exchange Rates, and Event Dispatching
 */

class KediStore {
    constructor() {
        this.state = {
            cart: JSON.parse(localStorage.getItem('kedi_cart')) || [],
            currency: localStorage.getItem('kedi_currency') || 'USD',
            exchangeRates: {
                USD: 1,
                PI: 0.000003183, // 1 Pi = 314,159 USD -> so rate is 1 / 314159
                NGN: 1500 // Fallback NGN rate, updated live via API
            }
        };

        this.initExchangeRates();
    }

    // --- State Mutations ---
    
    setCurrency(newCurrency) {
        if (this.state.currency !== newCurrency) {
            this.state.currency = newCurrency;
            localStorage.setItem('kedi_currency', newCurrency);
            this.notify('currencyUpdated', this.state.currency);
        }
    }

    addToCart(product) {
        const existing = this.state.cart.find(item => item.id === product.id || item.name === product.name);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            this.state.cart.push({ ...product, quantity: 1 });
        }
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.state.cart.find(i => i.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    removeFromCart(productId) {
        this.state.cart = this.state.cart.filter(item => item.id !== productId);
        this.saveCart();
    }

    saveCart() {
        localStorage.setItem('kedi_cart', JSON.stringify(this.state.cart));
        this.notify('cartUpdated', this.state.cart);
    }

    // --- Event Dispatcher ---
    notify(eventName, detail) {
        const event = new CustomEvent(`kedi:${eventName}`, { detail });
        window.dispatchEvent(event);
    }

    // --- Live API Fetch ---
    async initExchangeRates() {
        try {
            // Fetch live USD to NGN rate
            const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await res.json();
            if (data && data.rates && data.rates.NGN) {
                this.state.exchangeRates.NGN = data.rates.NGN;
                console.log(`Live NGN Rate Updated: ₦${data.rates.NGN}`);
                // Notify components that rates have loaded
                this.notify('ratesLoaded', this.state.exchangeRates);
            }
        } catch (e) {
            console.warn("Failed to fetch live exchange rates, using fallback.", e);
        }
    }
}

// Instantiate globally
window.KediStore = new KediStore();
