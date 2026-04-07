/**
 * KEDI HEALTH — Wishlist & Cart Engine
 * Features:
 *  - Persistent wishlist (localStorage)
 *  - Cart with quantity management
 *  - Abandon cart recovery popup
 *  - Save for later / move between cart & wishlist
 *  - Share wishlist via WhatsApp
 *  - Toast notification system
 *  - Back-in-stock / notify me
 *  - Coupon code UI
 *  - Live badge sync across all header icons
 */
(function () {
    'use strict';

    /* ══════════════════════════════════
       STATE MANAGEMENT
       ══════════════════════════════════ */
    const CART_KEY      = 'kedi_cart_v2';
    const WISH_KEY      = 'kedi_wishlist_v2';
    const ABANDON_KEY   = 'kedi_abandon_ts';
    const AB_LOG_KEY    = 'kedi_abandoned_v2'; // Admin Log
    const COUPON_KEY    = 'kedi_coupon';
    const ABANDON_DELAY = 120000; // 2 minutes of idle triggers intent

    let state = {
        cart:     JSON.parse(localStorage.getItem(CART_KEY))     || [],
        wishlist: JSON.parse(localStorage.getItem(WISH_KEY))     || [],
        coupon:   JSON.parse(localStorage.getItem(COUPON_KEY))   || null,
        activePane: 'cart', // 'cart' | 'wishlist'
        drawerOpen: false,
        lastAction: Date.now()
    };

    const COUPONS = {
        'KEDI10': 0.10,
        'HEALTH20': 0.20,
        'WELCOME15': 0.15,
        'PI-POWER': 0.30 // Special Pi Coupon
    };

    /* ══════════════════════════════════
       PERSIST STATE
       ══════════════════════════════════ */
    function saveState() {
        localStorage.setItem(CART_KEY,   JSON.stringify(state.cart));
        localStorage.setItem(WISH_KEY,   JSON.stringify(state.wishlist));
        localStorage.setItem(COUPON_KEY, JSON.stringify(state.coupon));
        
        // Advanced Abandon Tracking: If cart not empty, log as potential abandon
        if (state.cart.length > 0) {
            const abLog = JSON.parse(localStorage.getItem(AB_LOG_KEY) || '[]');
            // Simplified: Update existing or add new session
            const session = {
                id: Date.now(),
                items: state.cart,
                total: getSubtotal(),
                abandonedAt: new Date().toISOString()
            };
            // Keep last 20 abandoned sessions for admin
            abLog.unshift(session);
            if(abLog.length > 20) abLog.pop();
            localStorage.setItem(AB_LOG_KEY, JSON.stringify(abLog));
        }
    }

    /* ══════════════════════════════════
       DOM BOOTSTRAP
       ══════════════════════════════════ */
    function bootstrap() {
        injectDrawerHTML();
        injectToastContainer();
        injectAbandonPopup();
        bindDrawerEvents();
        bindProductButtons();
        render();
        syncBadges();
        
        // Listen for activity
        document.addEventListener('mousemove', () => state.lastAction = Date.now());
        document.addEventListener('keypress',  () => state.lastAction = Date.now());
        
        scheduleAbandonCheck();
        // Re-bind whenever new product cards appear (e.g. sliders settle)
        setTimeout(bindProductButtons, 1500);
        setTimeout(bindProductButtons, 3000);
    }

    /* ══════════════════════════════════
       DRAWER HTML
       ══════════════════════════════════ */
    function injectDrawerHTML() {
        if (document.getElementById('kedi-side-drawer')) return;
        const overlay = document.createElement('div');
        overlay.className = 'kedi-overlay';
        overlay.id = 'kedi-overlay';
        overlay.onclick = closeDrawer;
        document.body.appendChild(overlay);

        const drawer = document.createElement('div');
        drawer.className = 'kedi-drawer';
        drawer.id = 'kedi-side-drawer';
        drawer.innerHTML = `
            <div class="kdi-drawer-hd">
                <h2>
                    <span id="kdi-drawer-icon">🛒</span>
                    <span id="kdi-drawer-title">Shopping Cart</span>
                    <span class="kdi-count-pill" id="kdi-count-pill">0</span>
                </h2>
                <button class="kdi-close-btn" onclick="KediShop.closeDrawer()">✕</button>
            </div>
            <div class="kdi-tabs">
                <button class="kdi-tab active" id="tab-cart"     onclick="KediShop.switchPane('cart')">🛒 Cart <span id="tab-cart-n"></span></button>
                <button class="kdi-tab"         id="tab-wishlist" onclick="KediShop.switchPane('wishlist')">❤️ Wishlist <span id="tab-wish-n"></span></button>
            </div>
            <div class="kdi-drawer-body" id="kdi-body"></div>
            <div class="kdi-drawer-footer" id="kdi-footer"></div>`;
        document.body.appendChild(drawer);
    }

    function injectToastContainer() {
        if (document.getElementById('kdi-toasts')) return;
        const c = document.createElement('div');
        c.className = 'kdi-toast-container';
        c.id = 'kdi-toasts';
        document.body.appendChild(c);
    }

    function injectAbandonPopup() {
        if (document.getElementById('kdi-abandon-popup')) return;
        const p = document.createElement('div');
        p.className = 'kdi-abandon-popup';
        p.id = 'kdi-abandon-popup';
        p.innerHTML = `
            <button class="popup-dismiss" onclick="KediShop.dismissAbandon()">✕</button>
            <div style="font-size:32px;margin-bottom:8px;">🛒</div>
            <h4>You left items in your cart!</h4>
            <p>Don't miss out — your selected health packs are waiting for you.</p>
            <div class="popup-actions">
                <button class="btn-yes" onclick="KediShop.openDrawer('cart')">View Cart</button>
                <button class="btn-no"  onclick="KediShop.dismissAbandon()">Not now</button>
            </div>`;
        document.body.appendChild(p);
    }

    /* ══════════════════════════════════
       RENDER ENGINE
       ══════════════════════════════════ */
    function render() {
        const body   = document.getElementById('kdi-body');
        const footer = document.getElementById('kdi-footer');
        if (!body || !footer) return;

        if (state.activePane === 'cart') {
            renderCart(body, footer);
        } else {
            renderWishlist(body, footer);
        }
        updateTabs();
        syncBadges();
    }

    function renderCart(body, footer) {
        if (state.cart.length === 0) {
            body.innerHTML = `
                <div class="kdi-empty">
                    <div class="kdi-empty-icon">🛒</div>
                    <p>Your cart is empty</p>
                    <a href="combo-packs.html">Browse Health Packs</a>
                </div>`;
            footer.innerHTML = '';
            return;
        }
        // Abandon cart recovery banner
        let html = `
            <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; border-bottom:1px dashed #eee; margin-bottom:12px;">
                <span style="font-size:11px; color:#999; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Capacity: Unlimited ✨</span>
                <button onclick="KediShop.clearCart()" style="background:none; border:none; color:var(--kedi-red); font-size:11px; font-weight:700; cursor:pointer;">🗑 Clear Bag</button>
            </div>
        `;
        if (state.cart.length > 0) {
            const abandonTs = localStorage.getItem(ABANDON_KEY);
            if (abandonTs && (Date.now() - parseInt(abandonTs)) > 60000) {
                html += `
                <div class="kdi-abandon-banner">
                    <div class="icon">⚡</div>
                    <div>
                        <p><strong>Almost there!</strong> You had items in your cart.
                        Complete your order and save up to 35%.</p>
                        <button class="kdi-recover-btn" onclick="KediShop.showToast('Apply code KEDI10 for 10% off!','info')">
                            🎁 Get 10% Off Now
                        </button>
                    </div>
                </div>`;
            }
        }

        html += state.cart.map(item => `
            <div class="kdi-item" id="cart-item-${item.id}">
                <img class="kdi-item-img" src="${item.image || 'Reishi.png'}" alt="${item.name}" onerror="this.src='Reishi.png'">
                <div class="kdi-item-info">
                    <p class="kdi-item-name">${item.name}</p>
                    <p class="kdi-item-cat">${item.category || 'Health Pack'}</p>
                    <div class="kdi-item-price">
                        ${item.symbol || '₦'}${formatPrice(item.price * item.qty, item.symbol)}
                        ${item.originalPrice ? `<span class="original">${item.symbol || '₦'}${formatPrice(item.originalPrice, item.symbol)}</span>` : ''}
                        ${item.savings ? `<span class="kdi-item-savings">-${item.savings}</span>` : ''}
                    </div>
                    <div class="kdi-qty">
                        <button class="kdi-qty-btn" onclick="KediShop.updateQty('${item.id}',-1)">−</button>
                        <span class="kdi-qty-val">${item.qty}</span>
                        <button class="kdi-qty-btn" onclick="KediShop.updateQty('${item.id}',1)">+</button>
                    </div>
                </div>
                <div class="kdi-item-actions">
                    <button class="kdi-rm-btn" onclick="KediShop.removeFromCart('${item.id}')" title="Remove">✕</button>
                    <button class="kdi-move-btn" onclick="KediShop.moveToWishlist('${item.id}')">💾 Save</button>
                </div>
            </div>`).join('');

        body.innerHTML = html;

        // Footer
        const subtotal = getSubtotal();
        const discount = state.coupon ? subtotal * COUPONS[state.coupon] : 0;
        const shipping  = subtotal > 10000 ? 0 : 1500;
        const total     = subtotal - discount + shipping;
        const cartMsg   = buildWhatsAppCartMessage();

        footer.innerHTML = `
            <div class="kdi-coupon">
                <input id="kdi-coupon-in" type="text" placeholder="Coupon code (e.g. KEDI10)" value="${state.coupon || ''}">
                <button onclick="KediShop.applyCoupon()">Apply</button>
            </div>
            <div style="margin-top:12px">
                <div class="kdi-summary-row"><span>Subtotal</span><span>₦${formatPrice(subtotal)}</span></div>
                ${discount > 0 ? `<div class="kdi-summary-row" style="color:#22c55e"><span>Discount (${state.coupon})</span><span>-₦${formatPrice(discount)}</span></div>` : ''}
                <div class="kdi-summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span style="color:#22c55e">FREE</span>' : '₦' + formatPrice(shipping)}</span></div>
                <div class="kdi-summary-row total"><span>Total</span><span>₦${formatPrice(total)}</span></div>
            </div>
            <button class="kdi-checkout-btn" onclick="KediShop.checkout()">
                💳 Proceed to Checkout
            </button>
            <button class="kdi-wa-btn" onclick="window.open('https://wa.me/2348114270136?text=${encodeURIComponent(cartMsg)}','_blank')">
                <i class="fab fa-whatsapp"></i> Order via WhatsApp
            </button>`;
    }

    function renderWishlist(body, footer) {
        if (state.wishlist.length === 0) {
            body.innerHTML = `
                <div class="kdi-empty">
                    <div class="kdi-empty-icon">❤️</div>
                    <p>Your wishlist is empty</p>
                    <a href="combo-packs.html">Discover Health Packs</a>
                </div>`;
            footer.innerHTML = '';
            return;
        }

        const html = `
            <div class="kdi-wishlist-toolbar">
                <button class="kdi-toolbar-btn" onclick="KediShop.addAllToCart()">🛒 Add All to Cart</button>
                <button class="kdi-toolbar-btn" onclick="KediShop.shareWishlist()">📤 Share</button>
                <button class="kdi-toolbar-btn" onclick="KediShop.clearWishlist()">🗑 Clear</button>
            </div>
            ${state.wishlist.map(item => `
            <div class="kdi-item" id="wish-item-${item.id}">
                <img class="kdi-item-img" src="${item.image || 'Reishi.png'}" alt="${item.name}" onerror="this.src='Reishi.png'">
                <div class="kdi-item-info">
                    <p class="kdi-item-name">${item.name}</p>
                    <p class="kdi-item-cat">${item.category || 'Health Pack'}</p>
                    <div class="kdi-item-price">
                        ${item.symbol || '₦'}${formatPrice(item.price, item.symbol)}
                        ${item.originalPrice ? `<span class="original">${item.symbol || '₦'}${formatPrice(item.originalPrice, item.symbol)}</span>` : ''}
                        ${item.savings ? `<span class="kdi-item-savings">-${item.savings}</span>` : ''}
                    </div>
                    <p class="kdi-saved-date">Saved ${timeAgo(item.savedAt)}</p>
                    <div class="kdi-wishlist-actions">
                        <button class="kdi-wish-to-cart" onclick="KediShop.moveToCart('${item.id}')">
                            🛒 Add to Cart
                        </button>
                    </div>
                </div>
                <div class="kdi-item-actions">
                    <button class="kdi-rm-btn" onclick="KediShop.removeFromWishlist('${item.id}')" title="Remove">✕</button>
                </div>
            </div>`).join('')}`;

        body.innerHTML = html;
        footer.innerHTML = `
            <div class="kdi-summary-row"><span>Items saved</span><span>${state.wishlist.length}</span></div>
            <button class="kdi-checkout-btn" onclick="KediShop.addAllToCart()">
                🛒 Move All to Cart
            </button>
            <button class="kdi-wa-btn" onclick="KediShop.shareWishlist()">
                <i class="fab fa-whatsapp"></i> Share Wishlist
            </button>`;
    }

    function updateTabs() {
        const tc = document.getElementById('tab-cart');
        const tw = document.getElementById('tab-wishlist');
        const tn = document.getElementById('tab-cart-n');
        const twn= document.getElementById('tab-wish-n');
        if (!tc) return;
        tc.className = 'kdi-tab' + (state.activePane === 'cart' ? ' active' : '');
        tw.className = 'kdi-tab' + (state.activePane === 'wishlist' ? ' active' : '');
        tn.textContent  = state.cart.length     ? `(${state.cart.length})`     : '';
        twn.textContent = state.wishlist.length  ? `(${state.wishlist.length})` : '';

        const icon  = document.getElementById('kdi-drawer-icon');
        const title = document.getElementById('kdi-drawer-title');
        const pill  = document.getElementById('kdi-count-pill');
        if (state.activePane === 'cart') {
            if (icon) icon.textContent  = '🛒';
            if (title) title.textContent = 'Shopping Cart';
            if (pill) pill.textContent  = state.cart.length;
        } else {
            if (icon) icon.textContent  = '❤️';
            if (title) title.textContent = 'My Wishlist';
            if (pill) pill.textContent  = state.wishlist.length;
        }
    }

    function kediToast(msg, type='success') {
        const toast = document.createElement('div');
        toast.className = `kedi-toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${type==='success' ? '✓' : '❤️'}</div>
            <div class="toast-msg">${msg}</div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    /* ══════════════════════════════════
       PUBLIC API
       ══════════════════════════════════ */
    const ShopAPI = {

        openDrawer(pane = 'cart') {
            state.activePane = pane;
            state.drawerOpen = true;
            document.getElementById('kedi-side-drawer').classList.add('open');
            document.getElementById('kedi-overlay').classList.add('open');
            document.body.style.overflow = 'hidden';
            dismissAbandonInternal();
            render();
        },

        closeDrawer,

        switchPane(pane) {
            state.activePane = pane;
            render();
        },

        addToCart(product) {
            const existing = state.cart.find(i => i.id === product.id);
            if (existing) {
                existing.qty = (existing.qty || 1) + 1;
            } else {
                state.cart.push({ ...product, qty: 1, addedAt: Date.now() });
            }
            // Remove from wishlist if present
            state.wishlist = state.wishlist.filter(i => i.id !== product.id);
            saveState();
            render();
            showToast(`✅ ${product.name} added to cart`, 'success');
            syncBadges();
            localStorage.setItem(ABANDON_KEY, Date.now().toString());
        },

        addToWishlist(product) {
            if (state.wishlist.find(i => i.id === product.id)) {
                showToast('Already in your wishlist ❤️', 'info');
                return;
            }
            state.wishlist.push({ ...product, savedAt: Date.now() });
            saveState();
            render();
            showToast(`❤️ ${product.name} added to wishlist`, 'info');
            syncBadges();
        },

        removeFromCart(id) {
            state.cart = state.cart.filter(i => i.id !== id);
            saveState();
            render();
            syncBadges();
        },

        removeFromWishlist(id) {
            state.wishlist = state.wishlist.filter(i => i.id !== id);
            saveState();
            render();
            syncBadges();
        },

        updateQty(id, delta) {
            const item = state.cart.find(i => i.id === id);
            if (!item) return;
            item.qty = Math.max(1, (item.qty || 1) + delta);
            saveState();
            render();
        },

        moveToWishlist(id) {
            const item = state.cart.find(i => i.id === id);
            if (!item) return;
            state.cart = state.cart.filter(i => i.id !== id);
            if (!state.wishlist.find(i => i.id === id)) {
                state.wishlist.push({ ...item, savedAt: Date.now() });
            }
            saveState();
            render();
            syncBadges();
            showToast('💾 Saved for later', 'info');
        },

        moveToCart(id) {
            const item = state.wishlist.find(i => i.id === id);
            if (!item) return;
            state.wishlist = state.wishlist.filter(i => i.id !== id);
            const existing = state.cart.find(i => i.id === id);
            if (existing) { existing.qty++; } else { state.cart.push({ ...item, qty: 1 }); }
            saveState();
            render();
            syncBadges();
            showToast(`🛒 ${item.name} moved to cart`, 'success');
        },

        addAllToCart() {
            state.wishlist.forEach(item => {
                const existing = state.cart.find(i => i.id === item.id);
                if (existing) { existing.qty++; } else { state.cart.push({ ...item, qty: 1 }); }
            });
            state.wishlist = [];
            saveState();
            state.activePane = 'cart';
            render();
            syncBadges();
            showToast('🛒 All items moved to cart!', 'success');
        },

        clearWishlist() {
            state.wishlist = [];
            saveState();
            render();
            syncBadges();
            showToast('🗑 Wishlist cleared', 'info');
        },

        clearCart() {
            if(confirm('Are you sure you want to clear your shopping bag?')) {
                state.cart = [];
                saveState();
                render();
                syncBadges();
                showToast('🗑 Shopping bag cleared', 'info');
            }
        },

        shareWishlist() {
            const lines = state.wishlist.map(i => `• ${i.name} — ₦${formatPrice(i.price)}`).join('\n');
            const msg = `❤️ My Kedi Health Wishlist:\n\n${lines}\n\nShop now: https://kedihealth.com/combo-packs.html`;
            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
        },

        applyCoupon() {
            const code = (document.getElementById('kdi-coupon-in')?.value || '').trim().toUpperCase();
            if (COUPONS[code]) {
                state.coupon = code;
                saveState();
                render();
                showToast(`🎉 Coupon ${code} applied! ${COUPONS[code] * 100}% off`, 'success');
            } else {
                showToast('❌ Invalid coupon code', 'warning');
            }
        },

        checkout() {
            if (state.cart.length === 0) {
                showToast('Your cart is empty!', 'warning');
                return;
            }
            window.location.href = 'checkout.html';
        },

        placeOrder(formData) {
            const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
            const order = {
                id: orderId,
                customer: formData,
                items: state.cart,
                subtotal: getSubtotal(),
                total: getSubtotal() + (getSubtotal() > 10000 ? 0 : 1500),
                status: 'Pending',
                createdAt: new Date().toISOString()
            };

            // Log to Admin Orders
            const orders = JSON.parse(localStorage.getItem('kedi_orders_v2') || '[]');
            orders.unshift(order);
            localStorage.setItem('kedi_orders_v2', JSON.stringify(orders.slice(0, 100)));

            // Build WhatsApp Message
            const itemLines = state.cart.map(i => `• ${i.qty}x ${i.name} (${i.symbol}${formatPrice(i.price * i.qty, i.symbol)})`).join('\n');
            const msg = `🚀 *NEW ORDER: ${orderId}*\n\n` +
                        `👤 *Customer:* ${formData.firstName} ${formData.lastName}\n` +
                        `📞 *Phone:* ${formData.phone}\n` +
                        `📍 *Address:* ${formData.address}\n\n` +
                        `📦 *Items:*\n${itemLines}\n\n` +
                        `💰 *Total:* ₦${formatPrice(order.total)}\n\n` +
                        `_Please confirm my order and send payment details._`;

            // Clear Cart after some time or redirect
            setTimeout(() => {
                state.cart = [];
                saveState();
                render();
                syncBadges();
            }, 2000);

            window.open(`https://wa.me/2348114270136?text=${encodeURIComponent(msg)}`, '_blank');
            return orderId;
        },

        dismissAbandon() { dismissAbandonInternal(); },

        getCartCount() { return state.cart.reduce((s, i) => s + (i.qty || 1), 0); },
        getWishCount()  { return state.wishlist.length; },

        // Expose for external calls (e.g. product pages)
        state,
        formatPrice
    };
    window.KediShop = ShopAPI;

    /* ══════════════════════════════════
       PRODUCT BUTTON BINDING
       (Scans page for Add to Cart / Wishlist buttons)
       ══════════════════════════════════ */
    function bindProductButtons() {
        // Generic "add to cart" buttons on product cards
        document.querySelectorAll('[data-kedi-add-cart]').forEach(btn => {
            if (btn.dataset.bound) return;
            btn.dataset.bound = '1';
            btn.addEventListener('click', () => {
                const product = extractProductFromEl(btn);
                window.KediShop.addToCart(product);
            });
        });
        // Generic "add to wishlist" buttons
        document.querySelectorAll('[data-kedi-add-wish]').forEach(btn => {
            if (btn.dataset.bound) return;
            btn.dataset.bound = '1';
            btn.addEventListener('click', () => {
                const product = extractProductFromEl(btn);
                window.KediShop.addToWishlist(product);
            });
        });
        // Existing theme cart buttons (shopping bag icon in header)
        document.querySelectorAll('.cart_btn').forEach(btn => {
            if (btn.dataset.shopBound) return;
            btn.dataset.shopBound = '1';
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.KediShop.openDrawer('cart');
            });
        });
        // Wishlist icons
        document.querySelectorAll('.wishlist-icon').forEach(btn => {
            if (btn.dataset.shopBound) return;
            btn.dataset.shopBound = '1';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.KediShop.openDrawer('wishlist');
            });
        });
        // Product card wishlist & cart actions (fa-heart, fa-shopping-bag on tx-product)
        document.querySelectorAll('.tx-product .product__add_to_wish, .tx-product .add_to_wishlist, .tx-product .wishlist').forEach(btn => {
            if (btn.dataset.shopBound) return;
            btn.dataset.shopBound = '1';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = btn.closest('.tx-product, .tab-product__item, .product__item');
                const product = extractProductFromCard(card);
                window.KediShop.addToWishlist(product);
            });
        });
        document.querySelectorAll('.tx-product .add_to_cart, .tx-product .add-to-cart, .tx-product .product__add_btn, .add-to-cart-btn').forEach(btn => {
            if (btn.dataset.shopBound) return;
            btn.dataset.shopBound = '1';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const card = btn.closest('.tx-product, .tab-product__item, .product__item');
                const product = extractProductFromCard(card);
                window.KediShop.addToCart(product);
            });
        });
    }

    function extractProductFromEl(el) {
        return {
            id:   el.dataset.id            || el.closest('[data-id]')?.dataset.id || genId(),
            name: el.dataset.name          || el.closest('[data-name]')?.dataset.name || 'Kedi Product',
            price: parseFloat(el.dataset.price || el.closest('[data-price]')?.dataset.price || 0),
            originalPrice: parseFloat(el.dataset.original || 0) || null,
            savings: el.dataset.savings    || null,
            image:  el.dataset.image       || el.closest('[data-image]')?.dataset.image || 'Reishi.png',
            category: el.dataset.category  || 'Health Pack',
            symbol: el.dataset.symbol      || (el.dataset.price?.includes('π') ? 'π' : '₦'),
        };
    }

    function extractProductFromCard(card) {
        if (!card) return { id: genId(), name: 'Kedi Product', price: 0, qty: 1 };
        const nameEl  = card.querySelector('.title a, h2 a, h3 a, .product-title, .title, h3, h4');
        const priceEl = card.querySelector('.new, .product__price .new, .price__new, .price, .item_price');
        const imgEl   = card.querySelector('img');
        
        // Robust price parsing for π or ₦
        const priceText = priceEl?.textContent || '0';
        const priceMatch = priceText.match(/[\d\.]+/);
        const price = priceMatch ? parseFloat(priceMatch[0]) : 0;

        const originalText = card.querySelector('.old, .price__old')?.textContent || '0';
        const originalMatch = originalText.match(/[\d\.]+/);
        const originalPrice = originalMatch ? parseFloat(originalMatch[0]) : null;

        return {
            id:    card.dataset.id || nameEl?.textContent?.trim()?.replace(/\s+/g,'_').toLowerCase() || genId(),
            name:  nameEl?.textContent?.split('\n')[0]?.trim() || 'Kedi Product',
            price: price,
            originalPrice: originalPrice,
            image: imgEl?.src || 'Reishi.png',
            category: card.dataset.category || 'Health Pack',
            symbol: priceText.includes('π') ? 'π' : '₦',
        };
    }

    /* ══════════════════════════════════
       HELPERS
       ══════════════════════════════════ */
    function closeDrawer() {
        state.drawerOpen = false;
        document.getElementById('kedi-side-drawer')?.classList.remove('open');
        document.getElementById('kedi-overlay')?.classList.remove('open');
        document.body.style.overflow = '';
    }

    function syncBadges() {
        const cartCount = window.KediShop ? window.KediShop.getCartCount() : 0;
        const wishCount = window.KediShop ? window.KediShop.getWishCount() : 0;

        // Header badges (our new system)
        const cartBadge = document.getElementById('cart-item-count');
        const wishBadge = document.getElementById('wishlist-count');
        const mobCart   = document.getElementById('mob-cart-count');

        if (cartBadge) {
            cartBadge.textContent = cartCount;
            cartBadge[cartCount > 0 ? 'removeAttribute' : 'setAttribute']('data-zero', 'true');
        }
        if (wishBadge) {
            wishBadge.textContent = wishCount;
            wishBadge[wishCount > 0 ? 'removeAttribute' : 'setAttribute']('data-zero', 'true');
        }
        if (mobCart) {
            mobCart.textContent  = cartCount;
            mobCart.style.display = cartCount > 0 ? '' : 'none';
        }

        // Legacy theme .count spans
        document.querySelectorAll('.cart_btn .count, .cart_btn span.count').forEach(s => s.textContent = cartCount);
        document.querySelectorAll('.wishlist-icon .count').forEach(s => s.textContent = wishCount);
    }

    function getSubtotal() {
        return state.cart.reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0);
    }

    function buildWhatsAppCartMessage() {
        const lines = state.cart.map(i => `• ${i.name} x${i.qty} — ${i.symbol || '₦'}${formatPrice(i.price * i.qty, i.symbol)}`).join('\n');
        const total = getSubtotal(); // Note: totals are mixed if currency is mixed, but assuming majority or primary
        return `🛒 *Kedi Health Order Request*\n\n${lines}\n\n💰 Subtotal: ${state.cart[0]?.symbol || '₦'}${formatPrice(total, state.cart[0]?.symbol)}\n\nPlease confirm availability and shipping.`;
    }
    
    function formatPrice(n, symbol = '₦') {
        const fraction = (symbol === 'π') ? 8 : 0;
        return Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: fraction });
    }

    function parsePi(str) {
        return parseFloat((str || '').replace(/[^0-9.]/g, '')) || 0;
    }

    function genId() {
        return 'kd_' + Math.random().toString(36).slice(2, 9);
    }

    function timeAgo(ts) {
        const diff = Date.now() - ts;
        const m = Math.floor(diff / 60000);
        if (m < 1)   return 'just now';
        if (m < 60)  return `${m}m ago`;
        if (m < 1440) return `${Math.floor(m/60)}h ago`;
        return `${Math.floor(m/1440)}d ago`;
    }

    function showToast(msg, type = 'success') {
        const c = document.getElementById('kdi-toasts');
        if (!c) return;
        const t = document.createElement('div');
        t.className = `kdi-toast ${type}`;
        const icons = { success: '✅', info: 'ℹ️', warning: '⚠️' };
        t.innerHTML = `<span>${icons[type] || '✅'}</span><span>${msg}</span>`;
        c.appendChild(t);
        setTimeout(() => t.remove(), 3500);
    }

    /* Abandon cart recovery */
    let abandonTimer;
    function scheduleAbandonCheck() {
        if (state.cart.length === 0) return;
        clearTimeout(abandonTimer);
        abandonTimer = setTimeout(() => {
            if (!state.drawerOpen && state.cart.length > 0) {
                const popup = document.getElementById('kdi-abandon-popup');
                if (popup) popup.classList.add('visible');
                localStorage.setItem(ABANDON_KEY, Date.now().toString());
            }
        }, ABANDON_DELAY);

        // Reset timer on user activity
        ['mousemove','keydown','scroll','touchstart'].forEach(ev => {
            document.addEventListener(ev, () => {
                clearTimeout(abandonTimer);
                abandonTimer = setTimeout(() => {
                    if (!state.drawerOpen && state.cart.length > 0) {
                        const popup = document.getElementById('kdi-abandon-popup');
                        if (popup) popup.classList.add('visible');
                    }
                }, ABANDON_DELAY);
            }, { passive: true, once: false });
        });
    }

    function dismissAbandonInternal() {
        const popup = document.getElementById('kdi-abandon-popup');
        if (popup) popup.classList.remove('visible');
    }

    function bindDrawerEvents() {
        // Keyboard close
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && state.drawerOpen) closeDrawer();
        });
        // FAB cart button
        document.querySelectorAll('.cart_fab_btn').forEach(b => {
            if (b.dataset.shopBound) return;
            b.dataset.shopBound = '1';
            b.addEventListener('click', () => window.KediShop.openDrawer('cart'));
        });
    }

    /* ── Init on DOM ready ── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }

})();
