/**
 * Kedi Healthcare - UI Component: Shopping Cart (Glassmorphism)
 * Dynamically binds to the global reactive Store to display items, calculate totals, and toggle state.
 */

class CartComponent {
    constructor() {
        this.isOpen = false;
        this.createCartUI();
        // this.createCartTrigger(); // Removed for duplicate issue
        this.initEventListeners();
        this.render(); // Initial render
        window.KediCartToggle = () => this.toggleCart();
    }

    createCartTrigger() {
        this.triggerBtn = document.createElement('div');
        this.triggerBtn.className = 'glass-cart-trigger';
        this.triggerBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 180px; /* Offset from Currency Switcher */
            background: rgba(11, 155, 62, 0.2);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(11, 155, 62, 0.5);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        `;

        this.triggerBtn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0b9b3e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span class="cart-badge" style="
                position: absolute; top: -5px; right: -5px; background: #d32f2f; color: white;
                font-size: 11px; font-weight: bold; width: 20px; height: 20px; display: flex;
                align-items: center; justify-content: center; border-radius: 50%;
            ">0</span>
        `;
        document.body.appendChild(this.triggerBtn);
    }

    createCartUI() {
        this.drawer = document.createElement('div');
        this.drawer.id = 'glass-cart-drawer';
        this.drawer.style.cssText = `
            position: fixed;
            top: 0; right: -400px;
            width: 100%; max-width: 380px; height: 100vh;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-left: 1px solid rgba(255, 255, 255, 0.6);
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transition: right 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            display: flex; flex-direction: column;
            font-family: 'Inter', sans-serif;
            color: #333;
        `;

        this.drawer.innerHTML = `
            <div style="padding: 20px; border-bottom: 1px solid rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 20px; color: #0b9b3e;">Your Cart</h3>
                <button class="cart-close-btn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #666;">&times;</button>
            </div>
            
            <div class="cart-items-container" style="flex: 1; overflow-y: auto; padding: 20px;">
                <!-- Items Render Here -->
            </div>

            <div style="padding: 20px; background: rgba(255,255,255,0.5); border-top: 1px solid rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px;">
                    <span>Subtotal</span> <span class="cart-subtotal" style="font-weight: 600;">π 0.00</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 18px; font-weight: bold; color: #0b9b3e;">
                    <span>Total</span> <span class="cart-total">π 0.00</span>
                </div>
                <!-- Disclaimer as requested by the prompt -->
                <p style="font-size: 11px; color: #666; margin-bottom: 15px; text-align: center;">⚠️ Note: Selected health products are subject to confirmation by a Kedi representative. No medical claims are absolutely guaranteed.</p>
                <button style="width: 100%; padding: 15px; border-radius: 8px; border: none; background: #0b9b3e; color: white; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.3s;" onmouseover="this.style.background='#087a31'" onmouseout="this.style.background='#0b9b3e'">Proceed to Checkout</button>
            </div>
        `;

        document.body.appendChild(this.drawer);
        
        // Backdrop overlay
        this.overlay = document.createElement('div');
        this.overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.4); backdrop-filter: blur(2px);
            z-index: 9999; opacity: 0; pointer-events: none;
            transition: opacity 0.4s ease;
        `;
        document.body.appendChild(this.overlay);
    }

    initEventListeners() {
        };
        this.toggleCart = toggleCart;


        this.triggerBtn.addEventListener('click', toggleCart);
        this.drawer.querySelector('.cart-close-btn').addEventListener('click', toggleCart);
        this.overlay.addEventListener('click', toggleCart);

        // Reactive Listeners for global state sync
        window.addEventListener('kedi:cartUpdated', () => this.render());
        window.addEventListener('kedi:currencyUpdated', () => this.render());
        window.addEventListener('kedi:ratesLoaded', () => this.render());
    }

    render() {
        if (!window.KediStore) return;

        const store = window.KediStore.state;
        const items = store.cart;
        const container = this.drawer.querySelector('.cart-items-container');
        const badge = this.triggerBtn.querySelector('.cart-badge');
        
        let subtotalUSD = 0;
        let totalItems = 0;

        container.innerHTML = '';

        if (items.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #999; margin-top: 50px;">Your cart is empty.</div>';
        } else {
            items.forEach(item => {
                subtotalUSD += (item.basePriceUSD * item.quantity);
                totalItems += item.quantity;

                const formatter = window.ProductListComponent || { formatPrice: (p) => `π${p}` };
                const formattedPrice = formatter.formatPrice(item.basePriceUSD);

                const div = document.createElement('div');
                div.style.cssText = `
                    display: flex; gap: 15px; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed rgba(0,0,0,0.1);
                `;
                div.innerHTML = `
                    <div style="width: 60px; height: 60px; background: #f0f0f0; border-radius: 8px; overflow: hidden;">
                        <img src="${item.image || 'assets/img/product/1.jpg'}" style="width: 100%; height: 100%; object-fit: cover;" alt="${item.name}">
                    </div>
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px 0; font-size: 14px; font-weight: 600;">${item.name}</h4>
                        <div style="color: #0b9b3e; font-weight: bold; font-size: 13px; margin-bottom: 8px;">${formattedPrice}</div>
                        
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="display: flex; border: 1px solid #ddd; border-radius: 4px; overflow: hidden;">
                                <button onclick="window.KediStore.updateQuantity('${item.id}', ${item.quantity - 1})" style="border: none; background: #f9f9f9; padding: 2px 10px; cursor: pointer;">-</button>
                                <div style="padding: 2px 10px; font-size: 12px; border-left: 1px solid #ddd; border-right: 1px solid #ddd;">${item.quantity}</div>
                                <button onclick="window.KediStore.updateQuantity('${item.id}', ${item.quantity + 1})" style="border: none; background: #f9f9f9; padding: 2px 10px; cursor: pointer;">+</button>
                            </div>
                            <button onclick="window.KediStore.removeFromCart('${item.id}')" style="border: none; background: none; color: #d32f2f; font-size: 12px; cursor: pointer; text-decoration: underline;">Remove</button>
                        </div>
                    </div>
                `;
                container.appendChild(div);
            });
        }

        // Update Top Level Text / Counters
        badge.innerText = totalItems;
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);

        // Update Totals
        const formatter = window.ProductListComponent || { formatPrice: (p) => `π${p}` };
        const formattedTotal = formatter.formatPrice(subtotalUSD);
        
        this.drawer.querySelector('.cart-subtotal').innerText = formattedTotal;
        this.drawer.querySelector('.cart-total').innerText = formattedTotal;
    }
}

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
    window.CartComponentInstance = new CartComponent();
});
