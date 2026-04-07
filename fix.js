const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove preloader which blocks scrolling
html = html.replace(/<!-- preloder start[\s\S]*?<!-- preloder end\s+-->/gi, '');

// 2. Replace all instances of the broken shopping basket icon with the Add to Cart button
const brokenBasketRegex = /<li>\s*<a\s+href="#!">\s*<i\s+class="far\s+fa-shopping-basket"><\/i>\s*<\/a>\s*<\/li>/gi;
const replacementButton = '<li><button class="btn btn-sm btn-success add-to-cart" style="font-size:12px; padding:6px 10px;">Add to Cart</button></li>';
html = html.replace(brokenBasketRegex, replacementButton);

const brokenCompressRegex = /<li>\s*<a\s+href="#!">\s*<i\s+class="far\s+fa-compress-alt"><\/i>\s*<\/a>\s*<\/li>/gi;
html = html.replace(brokenCompressRegex, '');

const brokenHeartRegex = /<li>\s*<a\s+href="#!">\s*<i\s+class="far\s+fa-heart"><\/i>\s*<\/a>\s*<\/li>/gi;
const replacementHeart = '<li><button class="btn btn-sm btn-outline-danger wishlist" style="font-size:12px; padding:6px 10px;">Wishlist</button></li>';
html = html.replace(brokenHeartRegex, replacementHeart);

// 3. Insert Map section before the footer
if (!html.includes('class="contact-map"')) {
    const mapSectionHtml = `
        <!-- Map Section -->
        <div id="section-contact" class="contact-map" style="width: 100%; height: 400px; display: block; overflow: hidden; position: relative;">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126830.40263442758!2d3.197992953282229!3d6.666991191544608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10364d1f2b238d2f%3A0xd68032da1e7c9f!2sAdekunle%20St%2C%20Ijoko%2C%20Ogun%20State%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
    `;
    html = html.replace('<footer class="footer"', mapSectionHtml + '\n        <footer class="footer"');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed index.html successfully!');
