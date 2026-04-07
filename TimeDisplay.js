/**
 * Kedi Healthcare - Live Real-Time Date & Time Display
 * Smart mode: If the page has data-live-date / data-live-time placeholders,
 * it updates those directly. Otherwise it injects a slim top announcement bar.
 * Ticks every second — no flicker, no layout shift.
 */

class TimeDisplay {
    constructor() {
        this.hasPlaceholders = false;
        this.bar = null;

        // Check if page already has dedicated time slots (e.g. index.html header)
        const liveDateEls  = document.querySelectorAll('[data-live-date]');
        const liveTimeEls  = document.querySelectorAll('[data-live-time]');
        this.hasPlaceholders = liveDateEls.length > 0 || liveTimeEls.length > 0;

        // Only inject the floating bar on pages without dedicated slots
        if (!this.hasPlaceholders) {
            this._createBar();
        }

        // Start ticking immediately then every second
        this._tick();
        setInterval(() => this._tick(), 1000);
    }

    _createBar() {
        this.bar = document.createElement('div');
        this.bar.id = 'kedi-live-clock-bar';
        this.bar.style.cssText = `
            width: 100%;
            background: linear-gradient(90deg, #0b9b3e 0%, #087a31 100%);
            color: white;
            font-family: 'Inter', 'Segoe UI', sans-serif;
            font-size: 13px;
            font-weight: 500;
            text-align: center;
            padding: 6px 20px;
            letter-spacing: 0.5px;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            flex-wrap: wrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        `;
        document.body.insertBefore(this.bar, document.body.firstChild);
    }

    _tick() {
        const now = new Date();

        // ── 24-hour HH:MM:SS in Nigeria Time (UTC+1) ──
        const options = { timeZone: 'Africa/Lagos', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const timeStr = now.toLocaleTimeString('en-GB', options);

        // Day, DD Month YYYY
        const dateStr = now.toLocaleDateString('en-NG', {
            timeZone: 'Africa/Lagos',
            weekday: 'long',
            day:     '2-digit',
            month:   'long',
            year:    'numeric'
        });

        // ── Update dedicated page elements ──
        document.querySelectorAll('[data-live-date]').forEach(el => {
            el.textContent = dateStr;
        });
        document.querySelectorAll('[data-live-time]').forEach(el => {
            el.textContent = timeStr;
        });

        // ── Update the injected bar (only present on pages without placeholders) ──
        if (this.bar) {
            this.bar.innerHTML = `
                <span>🕐 <strong>${timeStr}</strong></span>
                <span style="opacity:0.5;">|</span>
                <span>${dateStr}</span>
                <span style="opacity:0.5;">|</span>
                <span style="font-size:11px;opacity:0.8;">⏱ Live • Kedi Healthcare</span>
            `;
        }
    }
}

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.TimeDisplayComponent = new TimeDisplay();
});
