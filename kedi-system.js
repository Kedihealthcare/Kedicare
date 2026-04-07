/**
 * Kedi Health System Engine
 * Standardizes Cart, User Tracking, Gatekeeping, and UI Bindings
 */

(function() {

    // --- 1. Cart Management (Unified) ---
    function getCart() {
        return JSON.parse(localStorage.getItem('kedi_cart') || '[]');
    }

    function saveCart(cart) {
        localStorage.setItem('kedi_cart', JSON.stringify(cart));
        updateCartUI();
        window.dispatchEvent(new CustomEvent('kedi:cartUpdated', { detail: cart }));
    }

    window.addToCart = function(productName, price, image, description) {
        const cart = getCart();
        const product = {
            id: productName + '_' + Date.now(),
            name: productName,
            basePriceUSD: parseFloat(price) || 0,
            image: image || '/assets/img/product/1.jpg',
            description: description || ''
        };

        const existing = cart.find(i => i.name === product.name);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        saveCart(cart);
        showToast(`✅ ${productName} added to cart!`);
    };

    window.removeFromCart = function(productId) {
        const cart = getCart().filter(i => i.id !== productId);
        saveCart(cart);
    };

    function updateCartUI() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        // Update Badges
        document.querySelectorAll('#cart-badge, .cart-count, .kedi-cart-count').forEach(el => {
            el.textContent = totalItems;
            if (el.id === 'cart-badge') el.classList.toggle('hidden', totalItems === 0);
        });

        // Update Drawer
        const drawer = document.getElementById('cart-items-container');
        if (drawer) {
            if (cart.length === 0) {
                drawer.innerHTML = '<div class="text-center text-muted py-12">Your basket is empty.</div>';
                document.getElementById('cart-total-price').textContent = 'π0.00';
            } else {
                let total = 0;
                drawer.innerHTML = cart.map(item => {
                    const itemTotal = item.price * (item.quantity || 1);
                    total += itemTotal;
                    return `
                        <div class="cart-item border-b p-3 flex gap-3 items-center">
                            <img src="${item.image}" alt="${item.name}" width="50" class="rounded">
                            <div class="flex-1">
                                <div class="font-bold text-sm">${item.name}</div>
                                <div class="text-xs text-muted">π${item.price.toFixed(8)} x ${item.quantity}</div>
                            </div>
                            <button class="remove-item p-1 text-red-500" onclick="window.removeFromCart('${item.id}')">&times;</button>
                        </div>
                    `;
                }).join('');
                document.getElementById('cart-total-price').textContent = `π${total.toFixed(8)}`;
            }
        }
    }

    // --- 2. Gatekeeper Logic ---
    function checkIntakeStatus() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        const publicPages = ['index.html', 'quiz.html', 'qui.html', 'chat.html', 'faq.html', 'packs.html', 'checkout.html', 'combo-packs.html', 'ai-doc.html'];
        const isExempt = publicPages.some(p => path.toLowerCase() === p.toLowerCase() || path === '');
        if (isExempt) return;

        const lastQuizVersion = localStorage.getItem('kedi_quiz_completed');
        if (!lastQuizVersion) {
            console.log('[Kedi] Gatekeeper: Assessment required.');
            window.location.href = '/quiz.html';
        }
    }

    // --- 3. UI Helpers ---
    function showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background: #2563eb; color: white; padding: 12px 25px; border-radius: 30px;
            font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600;
            box-shadow: 0 5px 20px rgba(37,99,235,0.4); z-index: 99999;
            transition: all 0.3s ease; animation: fadeInUp 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    // --- 4. Initialization ---
    document.addEventListener('DOMContentLoaded', () => {
        updateCartUI();
        checkIntakeStatus();

        // Cart Drawer Toggles
        const cartIcon = document.getElementById('cart-icon-container');
        const closeBtn = document.getElementById('close-cart');
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('cart-overlay');

        if (cartIcon && drawer && overlay) {
            cartIcon.onclick = (e) => {
                e.preventDefault();
                drawer.classList.add('open');
                overlay.classList.add('show');
            };
            const closeCart = () => {
                drawer.classList.remove('open');
                overlay.classList.remove('show');
            };
            closeBtn.onclick = closeCart;
            overlay.onclick = closeCart;
        }

        // Global Add To Cart Binding
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-to-cart-btn, .btn-add-cart');
            if (btn) {
                const name = btn.dataset.name || 'Kedi Product';
                const price = parseFloat(btn.dataset.price) || 0;
                const image = btn.dataset.image || '';
                window.addToCart(name, price, image);
            }
        });
    });

})();
