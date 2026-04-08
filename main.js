// ============================================
// main.js - نظام توصيلة
// ============================================

class OrderSystem {
    constructor() {
        this.cart = [];
        this.groceries = [];
        this.deliveryFee = 0;
        this.deliveryPercentage = 10;
        this.selectedStore = null;
        this.selectedDeliveryOption = 'delivery';
        this.customerAddress = '';
        this.adminPhone = '963998028910';
        this.init();
    }

    init() {
        this.loadData();
        this.loadCartFromStorage();
        this.setupEventListeners();
        this.updateCartUI();
        this.setupOfferButtons();
        this.createFloatingCartButton();
        console.log('✅ نظام توصيلة جاهز');
    }

    createFloatingCartButton() {
        if (document.querySelector('.floating-cart-btn')) return;
        const btn = document.createElement('button');
        btn.className = 'floating-cart-btn';
        btn.innerHTML = `<i class="fas fa-shopping-cart"></i><span class="cart-count">0</span>`;
        btn.onclick = () => this.toggleCart();
        document.body.appendChild(btn);
        this.updateFloatingCartCount();
    }

    updateFloatingCartCount() {
        const btn = document.querySelector('.floating-cart-btn');
        if (btn) {
            const total = this.cart.reduce((s, i) => s + i.quantity, 0);
            const span = btn.querySelector('.cart-count');
            span.textContent = total;
            span.style.display = total > 0 ? 'inline-block' : 'none';
        }
    }

    toggleCart() {
        const sidebar = document.getElementById('cart-sidebar');
        const overlay = document.getElementById('cart-overlay');
        if (sidebar && overlay) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        }
    }

    loadData() {
        this.groceries = [{
            id: 401,
            name: "بقالة الرحمن",
            type: "grocery",
            rating: 4.8,
            deliveryTime: "20-30",
            image: "images/بقالة الرحمن.png",
            description: "جميع مستلزمات المنزل والمواد الغذائية",
            products: [
                { id: 4001, name: "سكر أبيض", price: 80, unit: "كيلو", description: "سكر ناعم درجة أولى" },
                { id: 4002, name: "رز مصري", price: 100, unit: "كيلو", description: "أرز مصري أبيض" },
                { id: 4003, name: "برغل ناعم", price: 100, unit: "كيلو", description: "برغل ناعم درجة أولى" },
                { id: 4004, name: "طحين أبيض", price: 60, unit: "كيلو", description: "طحين متعدد الاستخدامات" },
                { id: 4005, name: "سميد ناعم", price: 80, unit: "كيلو", description: "سميد ناعم للحلويات" },
                { id: 4006, name: "زيت نباتي", price: 250, unit: "لتر", description: "زيت نباتي صافي" }
            ]
        }];
        this.displayGroceries();
        this.displayOffers();
    }

    displayGroceries() {
        const container = document.getElementById('groceries-container');
        if (!container) return;
        container.innerHTML = this.groceries.map(g => `
            <div class="grocery-card" onclick="orderSystem.selectGrocery(${g.id})">
                <div class="card-image">
                    <img src="${g.image}" alt="${g.name}" onerror="this.src='https://placehold.co/300x200/4CAF50/white?text=الرحمن'">
                    <span class="card-badge">🏪 بقالة</span>
                    <span class="delivery-time"><i class="fas fa-clock"></i> ${g.deliveryTime} دقيقة</span>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${g.name}</h3>
                    <div class="card-info"><span class="rating"><i class="fas fa-star"></i> ${g.rating}</span></div>
                    <p class="card-description">${g.description}</p>
                </div>
            </div>
        `).join('');
    }

    displayOffers() {
        const container = document.getElementById('offers-container');
        if (!container) return;
        const offers = [
            { id: 1, title: "عروض البفلات", description: "تسوق بأقل الأسعار", image: "images/بفلة رياضية.jpg", oldPrice: 500, newPrice: 200, discount: 60, productName: "بفلة ناعمة", productPrice: 200, productUnit: "ربطة", storeId: 401 },
            { id: 2, title: "عروض السماعات", description: "سماعات بلوتوث", image: "images/سماعات محيطية.jpg", oldPrice: 400, newPrice: 300, discount: 25, productName: "سماعة بلوتوث", productPrice: 300, productUnit: "قطعة", storeId: 401 },
            { id: 6, title: "عرض التوصيل", description: "توصيل مجاني للطلبات فوق 1000 ليرة", image: "images/توصية لوغو.jpg", oldPrice: 100, newPrice: 0, discount: 100, productName: null, productPrice: null, storeId: null }
        ];
        container.innerHTML = offers.map(o => `
            <div class="offer-card">
                <div class="offer-badge">-${o.discount}%</div>
                <img src="${o.image}" alt="${o.title}" onerror="this.src='https://placehold.co/300x200/FF6B35/white?text=${o.title}'">
                <div class="offer-content">
                    <h3>${o.title}</h3>
                    <p>${o.description}</p>
                    <div class="offer-price">
                        <span class="old-price">${o.oldPrice} ليرة</span>
                        <span class="new-price">${o.newPrice === 0 ? 'مجاناً' : o.newPrice + ' ليرة'}</span>
                    </div>
                    <button class="btn-offer" data-offer='${JSON.stringify(o)}'>${o.newPrice === 0 ? 'اطلب الآن' : '🛒 تسوق الآن'}</button>
                </div>
            </div>
        `).join('');
    }

    addOfferToCart(offer) {
        if (!offer.productName) {
            this.showNotification('🎉 عرض التوصيل المجاني فعال!', 'success');
            return;
        }
        const store = this.groceries.find(g => g.id === offer.storeId);
        if (!store) return;
        this.selectedStore = store;
        const existing = this.cart.find(i => i.name === offer.productName);
        if (existing) existing.quantity++;
        else this.cart.push({ id: Date.now(), name: offer.productName, price: offer.productPrice, quantity: 1, unit: offer.productUnit, store: store.name, storeId: store.id });
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`✅ تم إضافة ${offer.productName}`, 'success');
        this.toggleCart();
    }

    selectGrocery(id) {
        this.selectedStore = this.groceries.find(g => g.id === id);
        this.showProductsModal();
    }

    showProductsModal() {
        const modalHtml = `
            <div id="products-modal" class="modal active">
                <div class="modal-content">
                    <div class="modal-header"><h2>🏪 ${this.selectedStore.name}</h2><span class="close" onclick="orderSystem.closeModal()">&times;</span></div>
                    <div class="modal-body">
                        ${this.selectedStore.products.map(p => `
                            <div class="menu-item" style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid #eee;">
                                <div><h3>${p.name}</h3><p class="description">${p.description || ''} | 📦 ${p.unit}</p><p class="price" style="color:var(--primary-color); font-weight:bold;">💰 ${p.price} ليرة</p></div>
                                <button onclick="orderSystem.addToCart(${p.id}, '${p.name}', ${p.price}, '${p.unit}')" class="btn-add" style="padding:8px 16px;"><i class="fas fa-plus"></i> أضف</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        const old = document.getElementById('products-modal');
        if (old) old.remove();
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    closeModal() { document.getElementById('products-modal')?.remove(); }

    addToCart(id, name, price, unit) {
        const existing = this.cart.find(i => i.id === id);
        if (existing) existing.quantity++;
        else this.cart.push({ id, name, price, quantity: 1, unit, store: this.selectedStore.name, storeId: this.selectedStore.id });
        this.saveCart();
        this.updateCartUI();
        this.showNotification(`✅ تم إضافة ${name}`, 'success');
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        const totalItems = this.cart.reduce((s, i) => s + i.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => el.textContent = totalItems);
        this.updateFloatingCartCount();
        
        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-basket"></i><p>السلة فارغة</p></div>`;
            } else {
                cartItems.innerHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-title">📦 ${item.name} ${item.unit ? `(${item.unit})` : ''}</div>
                            <div class="cart-item-price">💰 ${item.price} ليرة</div>
                            <div class="cart-item-restaurant">🏪 ${item.store}</div>
                        </div>
                        <div class="cart-item-quantity">
                            <button onclick="orderSystem.updateQuantity(${item.id}, -1)" class="quantity-btn">-</button>
                            <span style="min-width:30px; text-align:center;">${item.quantity}</span>
                            <button onclick="orderSystem.updateQuantity(${item.id}, 1)" class="quantity-btn">+</button>
                        </div>
                        <div class="cart-item-subtotal">💵 ${item.price * item.quantity} ليرة</div>
                    </div>
                `).join('');
            }
        }
        
        if (cartTotal) {
            const subtotal = this.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
            this.deliveryFee = this.selectedDeliveryOption === 'delivery' ? Math.ceil(subtotal * this.deliveryPercentage / 100) : 0;
            const total = subtotal + this.deliveryFee;
            cartTotal.innerHTML = `
                <div class="total-row"><span>المجموع الفرعي:</span><span>${subtotal} ليرة</span></div>
                <div class="total-row"><span>رسوم التوصيل (${this.deliveryPercentage}%):</span><span>${this.deliveryFee} ليرة</span></div>
                <div class="total-row grand-total"><span>الإجمالي:</span><span>${total} ليرة</span></div>
            `;
        }
    }

    updateQuantity(id, change) {
        const item = this.cart.find(i => i.id === id);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) this.cart = this.cart.filter(i => i.id !== id);
            this.saveCart();
            this.updateCartUI();
        }
    }

    setDeliveryOption(option) {
        this.selectedDeliveryOption = option;
        this.updateCartUI();
        document.querySelectorAll('.delivery-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelector(`.delivery-option[data-value="${option}"]`)?.classList.add('selected');
        const texts = { delivery: 'توصيل للمنزل', pickup: 'استلام شخصي', reservation: 'حجز مسبق' };
        this.showNotification(`✅ تم اختيار: ${texts[option]}`, 'success');
    }

    validatePhone(phone) {
        phone = phone.trim();
        const isValid = /^09\d{8}$/.test(phone);
        return { isValid, formatted: phone, international: isValid ? '963' + phone.substring(1) : null };
    }

    showPhoneDialog() {
        return new Promise((resolve) => {
            const html = `
                <div id="phone-dialog" class="modal active">
                    <div class="modal-content" style="max-width:400px;">
                        <div class="modal-header"><h3><i class="fas fa-phone-alt"></i> رقم الجوال</h3><span class="close" onclick="document.getElementById('phone-dialog').remove()">&times;</span></div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label>📱 أدخل رقم جوالك:</label>
                                <input type="tel" id="customer-phone" placeholder="0998028910" maxlength="10" style="text-align:center; font-size:18px; padding:12px; border:2px solid #FF6B35;">
                                <small style="color:#6C757D;">يجب أن يبدأ بـ 09 ويتكون من 10 أرقام</small>
                            </div>
                        </div>
                        <div class="modal-footer"><button id="confirm-phone" class="btn btn-primary" style="background:#28A745;">✓ تأكيد</button></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
            const dialog = document.getElementById('phone-dialog');
            const input = document.getElementById('customer-phone');
            const confirmBtn = document.getElementById('confirm-phone');
            setTimeout(() => input.focus(), 100);
            const submit = () => {
                const validation = this.validatePhone(input.value);
                if (validation.isValid) {
                    dialog.remove();
                    resolve(validation);
                } else {
                    input.style.borderColor = '#DC3545';
                    input.style.backgroundColor = '#FFF5F5';
                    const msg = document.createElement('div');
                    msg.className = 'form-error';
                    msg.style.color = '#DC3545';
                    msg.innerHTML = '⚠️ الرقم غير صحيح';
                    const old = input.parentElement.querySelector('.form-error');
                    if (old) old.remove();
                    input.parentElement.appendChild(msg);
                    setTimeout(() => { msg.remove(); input.style.borderColor = '#FF6B35'; input.style.backgroundColor = ''; }, 2000);
                }
            };
            confirmBtn.onclick = submit;
            input.onkeypress = (e) => { if (e.key === 'Enter') submit(); };
            dialog.onclick = (e) => { if (e.target === dialog) { dialog.remove(); resolve(null); } };
        });
    }

    showAddressDialog() {
        return new Promise((resolve) => {
            const html = `
                <div id="address-dialog" class="modal active">
                    <div class="modal-content" style="max-width:450px;">
                        <div class="modal-header"><h3><i class="fas fa-map-marker-alt"></i> عنوان التوصيل</h3><span class="close" onclick="document.getElementById('address-dialog').remove()">&times;</span></div>
                        <div class="modal-body">
                            <div class="address-input-container">
                                <label>📍 اكتب عنوانك بدقة:</label>
                                <textarea id="customer-address" rows="3" placeholder="مثال: حمورية - شارع البلدية - بناية رقم 5 - الطابق 3"></textarea>
                                <div class="address-note"><i class="fas fa-info-circle"></i> كتابة العنوان بدقة تساعد مندوب التوصيل للوصول بسرعة</div>
                            </div>
                        </div>
                        <div class="modal-footer"><button id="confirm-address" class="btn btn-primary" style="background:#28A745;">✓ تأكيد العنوان</button></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
            const dialog = document.getElementById('address-dialog');
            const input = document.getElementById('customer-address');
            const confirmBtn = document.getElementById('confirm-address');
            setTimeout(() => input.focus(), 100);
            const submit = () => {
                const address = input.value.trim();
                if (address) {
                    dialog.remove();
                    resolve(address);
                } else {
                    input.style.borderColor = '#DC3545';
                    const msg = document.createElement('div');
                    msg.className = 'form-error';
                    msg.style.color = '#DC3545';
                    msg.innerHTML = '⚠️ الرجاء إدخال العنوان';
                    const old = input.parentElement.querySelector('.form-error');
                    if (old) old.remove();
                    input.parentElement.appendChild(msg);
                    setTimeout(() => { msg.remove(); input.style.borderColor = ''; }, 2000);
                }
            };
            confirmBtn.onclick = submit;
            dialog.onclick = (e) => { if (e.target === dialog) { dialog.remove(); resolve(null); } };
        });
    }

    async checkout() {
        if (this.cart.length === 0) {
            this.showNotification('🛒 السلة فارغة', 'error');
            return;
        }
        
        const phoneValidation = await this.showPhoneDialog();
        if (!phoneValidation || !phoneValidation.isValid) {
            this.showNotification('❌ لم يتم إدخال رقم الجوال', 'error');
            return;
        }
        
        let address = '';
        if (this.selectedDeliveryOption === 'delivery') {
            address = await this.showAddressDialog();
            if (!address) {
                this.showNotification('❌ الرجاء إدخال عنوان التوصيل', 'error');
                return;
            }
        }
        
        const subtotal = this.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
        const deliveryFee = this.selectedDeliveryOption === 'delivery' ? Math.ceil(subtotal * this.deliveryPercentage / 100) : 0;
        const total = subtotal + deliveryFee;
        
        const orderId = Date.now();
        const itemsList = this.cart.map(i => `• ${i.name} : ${i.quantity} × ${i.price} = ${i.price * i.quantity} ليرة`).join('%0A');
        const deliveryText = { delivery: '🚚 توصيل للمنزل', pickup: '🏪 استلام شخصي', reservation: '📅 حجز مسبق' };
        
        let adminMsg = `🛍️ *طلب جديد من توصيلة* %0A%0A👤 *العميل:* ${phoneValidation.formatted}%0A`;
        if (address) adminMsg += `📍 *العنوان:* ${address}%0A%0A`;
        adminMsg += `📋 *الطلبات:*%0A${itemsList}%0A%0A💰 *المجموع:* ${subtotal} ليرة%0A🚚 *التوصيل:* ${deliveryFee} ليرة%0A💵 *الإجمالي:* ${total} ليرة%0A📍 *نوع التوصيل:* ${deliveryText[this.selectedDeliveryOption]}%0A🆔 *رقم الطلب:* ${orderId}`;
        
        window.open(`https://wa.me/${this.adminPhone}?text=${adminMsg}`, '_blank');
        
        const customerMsg = `✅ تم استلام طلبك رقم ${orderId}%0Aشكراً لتسوقك مع توصيلة%0Aسيتم التواصل معك قريباً`;
        setTimeout(() => window.open(`https://wa.me/${phoneValidation.international}?text=${customerMsg}`, '_blank'), 500);
        
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.showNotification('✅ تم إرسال الطلب بنجاح!', 'success');
        this.toggleCart();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const saved = localStorage.getItem('cart');
        if (saved) this.cart = JSON.parse(saved);
    }

    showNotification(msg, type = 'info') {
        const n = document.createElement('div');
        n.className = `notification notification-${type}`;
        const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
        n.innerHTML = `<i class="fas ${icons[type]}"></i><span>${msg}</span>`;
        document.body.appendChild(n);
        setTimeout(() => { n.classList.add('fade-out'); setTimeout(() => n.remove(), 300); }, 3500);
    }

    setupOfferButtons() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-offer');
            if (btn && btn.dataset.offer) {
                const offer = JSON.parse(btn.dataset.offer);
                this.addOfferToCart(offer);
            }
        });
    }

    setupEventListeners() {
        const search = document.getElementById('searchInput');
        if (search) {
            search.oninput = (e) => this.handleSearch(e.target.value);
            search.onkeypress = (e) => { if (e.key === 'Enter') this.handleSearch(search.value); };
        }
        document.querySelector('.btn-search')?.addEventListener('click', () => {
            const val = document.getElementById('searchInput')?.value;
            if (val) this.handleSearch(val);
        });
    }

    handleSearch(query) {
        if (!query || !query.trim()) {
            this.displayGroceries();
            return;
        }
        const term = query.toLowerCase().trim();
        let results = [];
        this.groceries.forEach(g => {
            g.products.forEach(p => {
                if (p.name.toLowerCase().includes(term)) results.push({ ...p, storeName: g.name, storeId: g.id });
            });
        });
        const container = document.getElementById('groceries-container');
        if (results.length > 0) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:20px;"><h3 style="color:#FF6B35;">🔍 نتائج البحث (${results.length})</h3></div>
                ${results.map(p => `
                    <div class="grocery-card" onclick="orderSystem.selectGroceryAndHighlight(${p.storeId}, '${p.name}')" style="border:2px solid #FF6B35;">
                        <div class="card-content"><h3>${p.name}</h3><p>${p.description || ''} - ${p.unit}</p><p style="color:#FF6B35; font-weight:bold;">💰 ${p.price} ليرة</p><p style="font-size:12px;">🏪 ${p.storeName}</p></div>
                    </div>
                `).join('')}`;
            this.showNotification(`🔍 تم العثور على ${results.length} منتج`, 'success');
        } else {
            this.displayGroceries();
            this.showNotification('🔍 لا توجد نتائج', 'info');
        }
    }

    selectGroceryAndHighlight(storeId, productName) {
        this.selectGrocery(storeId);
        setTimeout(() => {
            const modal = document.getElementById('products-modal');
            if (modal) {
                const items = modal.querySelectorAll('.menu-item');
                for (let item of items) {
                    if (item.querySelector('h3')?.innerText === productName) {
                        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        item.style.backgroundColor = '#FFF8F5';
                        item.style.border = '2px solid #FF6B35';
                        setTimeout(() => { item.style.backgroundColor = ''; item.style.border = ''; }, 2000);
                        break;
                    }
                }
            }
        }, 300);
    }
}

const orderSystem = new OrderSystem();
window.orderSystem = orderSystem;
window.toggleCart = () => orderSystem.toggleCart();
window.setDeliveryOption = (opt) => orderSystem.setDeliveryOption(opt);
window.checkout = () => orderSystem.checkout();

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 100);
    });
});