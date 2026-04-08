// ============================================
// main.js - الوظائف الرئيسية للتطبيق
// مع تحسين البحث للانتقال إلى المنتج
// ============================================

class OrderSystem {
    constructor() {
        this.cart = [];
        this.groceries = [];
        this.deliveryFee = 0;
        this.deliveryPercentage = 10;
        this.selectedStore = null;
        this.selectedDeliveryOption = 'delivery';
        
        this.adminPhone = '963998028910';
        
        this.init();
    }

    init() {
        this.loadData();
        this.loadCartFromStorage();
        this.setupEventListeners();
        this.updateCartUI();
        this.setupScrollAnimations();
        this.setupOfferButtons();
        this.setupSocialLinks();
        this.setupFooterLinks();
        
        console.log('✅ نظام توصيلة جاهز');
        console.log('📱 رقم استلام الطلبات:', this.adminPhone);
        console.log('📊 نسبة التوصيل:', this.deliveryPercentage + '%');
    }

    loadData() {
        this.groceries = [
            {
                id: 401,
                name: "بقالة الرحمن",
                type: "grocery",
                rating: 4.8,
                deliveryTime: "20-30",
                image: "images/بقالة الرحمن.png",
                description: "جميع مستلزمات المنزل والمواد الغذائية بأسعار مناسبة",
                products: [
                    { id: 4001, name: "سكر أبيض", price: 80, category: "sugar", unit: "كيلو", description: "سكر ناعم درجة أولى" },
                    { id: 4002, name: "رز مصري", price: 100, category: "rice", unit: "كيلو", description: "أرز مصري أبيض" },
                    { id: 4003, name: "برغل ناعم", price: 100, category: "burghul", unit: "كيلو", description: "برغل ناعم درجة أولى" },
                    { id: 4004, name: "طحين أبيض", price: 60, category: "flour", unit: "كيلو", description: "طحين متعدد الاستخدامات" },
                    { id: 4005, name: "سميد ناعم", price: 80, category: "semolina", unit: "كيلو", description: "سميد ناعم للحلويات" },
                    { id: 4006, name: "زيت نباتي", price: 250, category: "oil", unit: "لتر", description: "زيت نباتي صافي" }
                ]
            }
        ];

        this.displayGroceries();
        this.displayOffers();
    }

    displayGroceries() {
        const container = document.getElementById('groceries-container');
        if (!container) return;

        container.innerHTML = this.groceries.map(grocery => `
            <div class="grocery-card" data-store-id="${grocery.id}" onclick="orderSystem.selectGrocery(${grocery.id})">
                <div class="card-image">
                    <img src="${grocery.image}" alt="${grocery.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=الرحمن'">
                    <span class="card-badge">🏪 بقالة</span>
                    <span class="delivery-time"><i class="fas fa-clock"></i> ${grocery.deliveryTime} دقيقة</span>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${grocery.name}</h3>
                    <div class="card-info">
                        <span class="rating"><i class="fas fa-star"></i> ${grocery.rating}</span>
                    </div>
                    <p class="card-description">${grocery.description}</p>
                </div>
            </div>
        `).join('');
    }

    displayOffers() {
        const container = document.getElementById('offers-container');
        if (!container) return;

        const offers = [
            {
                id: 1,
                title: "عروض البفلات",
                description: "تسوق بأقل الأسعار على البفلات اليوم",
                image: "images/بفلة رياضية.jpg",
                oldPrice: 500,
                newPrice: 200,
                discount: 60,
                productName: "بفلة ناعمة",
                productPrice: 200,
                productUnit: "ربطة",
                storeId: 401
            },
            {
                id: 2,
                title: "عروض السماعات",
                description: "تسوق بأقل الأسعار على سماعات البلوتوث اليوم",
                image: "images/سماعات محيطية.jpg",
                oldPrice: 400,
                newPrice: 300,
                discount: 25,
                productName: "سماعة بلوتوث",
                productPrice: 300,
                productUnit: "قطعة",
                storeId: 401
            },
            {
                id: 3,
                title: "عروض البفلات",
                description: "تسوق بأقل الأسعار على البفلات اليوم",
                image: "images/3إنش.jpg",
                oldPrice: 350,
                newPrice: 280,
                discount: 20,
                productName: "بفلة ناعمة فاخرة",
                productPrice: 280,
                productUnit: "ربطة",
                storeId: 401
            },
            {
                id: 4,
                title: "عروض البفلات",
                description: "استمتع بالصوت الضخم من سيبكر 8 إنش",
                image: "images/8إنش.jpg",
                oldPrice: 1600,
                newPrice: 1500,
                discount: 6,
                productName: "بفلة 8 إنش",
                productPrice: 1500,
                productUnit: "قطعة",
                storeId: 401
            },
            {
                id: 5,
                title: "عروض الألعاب",
                description: "احصل على كرة ميكاسا الفاخرة الآن",
                image: "images/ميكاسا.jpg",
                oldPrice: 500,
                newPrice: 450,
                discount: 10,
                productName: "كرة ميكاسا",
                productPrice: 450,
                productUnit: "قطعة",
                storeId: 401
            },
            {
                id: 6,
                title: "عرض التوصيل",
                description: `توصيل مجاني للطلبات فوق 1000 ليرة جديدة ضمن حمورية`,
                image: "images/توصية لوغو.jpg",
                oldPrice: 100,
                newPrice: 0,
                discount: 100,
                productName: null,
                productPrice: null,
                storeId: null
            }
        ];

        container.innerHTML = offers.map(offer => `
            <div class="offer-card">
                <div class="offer-badge">-${offer.discount}%</div>
                <img src="${offer.image}" alt="${offer.title}" onerror="this.src='https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=${offer.title}'">
                <div class="offer-content">
                    <h3>${offer.title}</h3>
                    <p>${offer.description}</p>
                    <div class="offer-price">
                        <span class="old-price">${offer.oldPrice} ليرة جديدة</span>
                        <span class="new-price">${offer.newPrice === 0 ? 'مجاناً' : offer.newPrice + ' ليرة جديدة'}</span>
                    </div>
                    <button class="btn-offer" data-offer='${JSON.stringify(offer)}'>${offer.newPrice === 0 ? 'اطلب الآن' : '🛒 تسوق الآن'}</button>
                </div>
            </div>
        `).join('');
    }

    addOfferToCart(offer) {
        if (!offer.productName || !offer.productPrice) {
            this.showNotification('🎉 عرض التوصيل المجاني فعال!', 'success');
            return;
        }
        
        const store = this.groceries.find(g => g.id === offer.storeId);
        if (!store) {
            this.showNotification('❌ حدث خطأ في إضافة المنتج', 'error');
            return;
        }
        
        this.selectedStore = store;
        
        const existingItem = this.cart.find(item => item.name === offer.productName);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                id: Date.now() + Math.random(),
                name: offer.productName,
                price: offer.productPrice,
                quantity: 1,
                unit: offer.productUnit || 'قطعة',
                store: store.name,
                storeId: store.id,
                type: 'grocery'
            });
        }
        
        this.saveCartToStorage();
        this.updateCartUI();
        this.showNotification(`✅ تم إضافة ${offer.productName} (${offer.productPrice} ليرة) إلى السلة`, 'success');
        
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
        }
    }

    selectGrocery(groceryId) {
        this.selectedStore = this.groceries.find(g => g.id === groceryId);
        this.selectedStore.type = 'grocery';
        this.showProductsModal();
    }

    showProductsModal() {
        const products = this.selectedStore.products;
        
        const modalHtml = `
            <div id="products-modal" class="modal active">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>🏪 ${this.selectedStore.name}</h2>
                        <span class="close" onclick="orderSystem.closeModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        ${products.map(product => `
                            <div class="menu-item" data-product-name="${product.name}">
                                <div class="menu-item-info">
                                    <h3>${product.name}</h3>
                                    <p class="description">${product.description || ''}</p>
                                    <p class="description">📦 الوحدة: ${product.unit}</p>
                                    <p class="price">💰 ${product.price} ليرة جديدة</p>
                                </div>
                                <button onclick="orderSystem.addToCart(${product.id}, '${product.name}', ${product.price}, '${product.unit}')" class="btn-add">
                                    <i class="fas fa-plus"></i> أضف
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        const existingModal = document.getElementById('products-modal');
        if (existingModal) existingModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        const modal = document.getElementById('products-modal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const modal = document.getElementById('products-modal');
        if (modal) modal.remove();
    }

    addToCart(itemId, itemName, price, unit = '') {
        const existingItem = this.cart.find(item => item.id === itemId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                id: itemId,
                name: itemName,
                price: price,
                quantity: 1,
                unit: unit,
                store: this.selectedStore.name,
                storeId: this.selectedStore.id,
                type: this.selectedStore.type
            });
        }
        
        this.saveCartToStorage();
        this.updateCartUI();
        this.showNotification(`✅ تم إضافة ${itemName} إلى السلة`, 'success');
        
        const addButton = event?.target?.closest('.btn-add');
        if (addButton) {
            addButton.classList.add('add-to-cart-animation');
            setTimeout(() => addButton.classList.remove('add-to-cart-animation'), 500);
        }
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
        
        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-basket"></i>
                        <p>🛒 سلة المشتريات فارغة</p>
                        <span>أضف بعض المنتجات للبدء</span>
                    </div>
                `;
            } else {
                cartItems.innerHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <div class="cart-item-title">📦 ${item.name} ${item.unit ? `(${item.unit})` : ''}</div>
                            <div class="cart-item-price">💰 ${item.price} ليرة جديدة</div>
                            <div class="cart-item-restaurant">🏪 ${item.store}</div>
                        </div>
                        <div class="cart-item-quantity">
                            <button onclick="orderSystem.updateQuantity(${item.id}, -1)" class="quantity-btn">-</button>
                            <span style="font-weight: bold; min-width: 30px; text-align: center;">${item.quantity}</span>
                            <button onclick="orderSystem.updateQuantity(${item.id}, 1)" class="quantity-btn">+</button>
                        </div>
                        <div class="cart-item-subtotal">
                            💵 ${(item.price * item.quantity)} ليرة
                        </div>
                    </div>
                `).join('');
            }
        }
        
        if (cartTotal) {
            const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            if (this.selectedDeliveryOption === 'delivery') {
                this.deliveryFee = Math.ceil(subtotal * this.deliveryPercentage / 100);
            } else {
                this.deliveryFee = 0;
            }
            
            const total = subtotal + this.deliveryFee;
            
            cartTotal.innerHTML = `
                <div class="total-row">
                    <span>🛍️ المجموع الفرعي:</span>
                    <span>${subtotal} ليرة جديدة</span>
                </div>
                <div class="total-row">
                    <span>🚚 رسوم التوصيل (${this.deliveryPercentage}%):</span>
                    <span>${this.deliveryFee} ليرة جديدة</span>
                </div>
                <div class="total-row grand-total">
                    <span>💰 الإجمالي:</span>
                    <span>${total} ليرة جديدة</span>
                </div>
            `;
        }
    }

    updateQuantity(itemId, change) {
        const item = this.cart.find(i => i.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.cart = this.cart.filter(i => i.id !== itemId);
                this.showNotification(`🗑️ تم إزالة ${item.name} من السلة`, 'info');
            }
            this.saveCartToStorage();
            this.updateCartUI();
        }
    }

    setDeliveryOption(option) {
        this.selectedDeliveryOption = option;
        this.updateCartUI();
        
        document.querySelectorAll('.delivery-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        const selectedElement = document.querySelector(`.delivery-option[data-value="${option}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
        }
        
        const deliveryText = {
            'delivery': 'توصيل للمنزل',
            'pickup': 'استلام شخصي',
            'reservation': 'حجز مسبق'
        };
        
        this.showNotification(`✅ تم اختيار: ${deliveryText[option]}`, 'success');
    }

    validateSyrianPhone(phone) {
        phone = phone.trim();
        const phonePattern = /^09\d{8}$/;
        
        if (phonePattern.test(phone)) {
            return {
                isValid: true,
                formatted: phone,
                international: '963' + phone.substring(1)
            };
        }
        
        return {
            isValid: false,
            formatted: phone,
            international: null
        };
    }

    showPhoneInputDialog() {
        return new Promise((resolve) => {
            const dialogHtml = `
                <div id="phone-dialog" class="modal active">
                    <div class="modal-content" style="max-width: 400px;">
                        <div class="modal-header">
                            <h3><i class="fas fa-phone-alt"></i> رقم الجوال</h3>
                            <span class="close" onclick="document.getElementById('phone-dialog').remove()">&times;</span>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label style="font-size: 16px; font-weight: 600;">📱 الرجاء إدخال رقم جوالك للتواصل:</label>
                                <input type="tel" id="customer-phone" 
                                       placeholder="مثال: 0998028910" 
                                       maxlength="10"
                                       style="text-align: center; font-size: 20px; padding: 14px; color: #000000; background: #ffffff; border: 2px solid #FF6B35;">
                                <small style="color: #6C757D; display: block; margin-top: 10px;">
                                    <i class="fas fa-info-circle"></i> يجب أن يبدأ الرقم بـ 09 ويتكون من 10 أرقام
                                </small>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button id="confirm-phone" class="btn btn-primary" style="background: #28A745; padding: 12px 24px;">✓ تأكيد الطلب</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', dialogHtml);
            
            const dialog = document.getElementById('phone-dialog');
            const phoneInput = document.getElementById('customer-phone');
            const confirmBtn = document.getElementById('confirm-phone');
            
            setTimeout(() => phoneInput.focus(), 100);
            
            const confirmHandler = () => {
                const phone = phoneInput.value.trim();
                const validation = this.validateSyrianPhone(phone);
                
                if (validation.isValid) {
                    dialog.remove();
                    resolve(validation);
                } else {
                    phoneInput.style.borderColor = '#DC3545';
                    phoneInput.style.backgroundColor = '#FFF5F5';
                    
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'form-error';
                    errorMsg.style.color = '#DC3545';
                    errorMsg.style.fontWeight = '500';
                    errorMsg.style.marginTop = '8px';
                    errorMsg.innerHTML = '<i class="fas fa-exclamation-circle"></i> ⚠️ الرقم غير صحيح. يجب أن يبدأ بـ 09 ويتكون من 10 أرقام';
                    
                    const existingError = phoneInput.parentElement.querySelector('.form-error');
                    if (existingError) existingError.remove();
                    phoneInput.parentElement.appendChild(errorMsg);
                    
                    setTimeout(() => {
                        if (errorMsg.parentElement) errorMsg.remove();
                        phoneInput.style.borderColor = '#FF6B35';
                        phoneInput.style.backgroundColor = '#ffffff';
                    }, 3000);
                    
                    phoneInput.focus();
                }
            };
            
            phoneInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    confirmHandler();
                }
            });
            
            confirmBtn.addEventListener('click', confirmHandler);
            
            dialog.addEventListener('click', (e) => {
                if (e.target === dialog) {
                    e.stopPropagation();
                }
            });
        });
    }

    async sendOrderViaWhatsApp(orderDetails) {
        let phoneValidation;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
            try {
                phoneValidation = await this.showPhoneInputDialog();
                if (phoneValidation.isValid) {
                    break;
                }
            } catch (e) {
                this.showNotification('⚠️ الرجاء إدخال رقم الجوال لإتمام الطلب', 'warning');
                attempts++;
            }
        }
        
        if (!phoneValidation || !phoneValidation.isValid) {
            this.showNotification('❌ لم يتم إدخال رقم الجوال. لم يتم إرسال الطلب.', 'error');
            return false;
        }
        
        orderDetails.customerPhone = phoneValidation.formatted;
        orderDetails.customerPhoneInternational = phoneValidation.international;
        
        const itemsList = orderDetails.items.map(item => 
            `• ${item.name} ${item.unit ? `(${item.unit})` : ''} : ${item.quantity} × ${item.price} = ${item.price * item.quantity} ليرة`
        ).join('%0A');
        
        const deliveryText = {
            'delivery': '🚚 توصيل للمنزل',
            'pickup': '🏪 استلام شخصي',
            'reservation': '📅 حجز مسبق'
        };
        
        const adminMessage = `🛍️ *طلب جديد من توصيلة* %0A%0A` +
            `👤 *العميل:* ${orderDetails.customerPhone}%0A%0A` +
            `📋 *تفاصيل الطلب:*%0A${itemsList}%0A%0A` +
            `💰 *المجموع الفرعي:* ${orderDetails.subtotal} ليرة جديدة%0A` +
            `🚚 *رسوم التوصيل (${this.deliveryPercentage}%):* ${orderDetails.deliveryFee} ليرة جديدة%0A` +
            `💵 *الإجمالي:* ${orderDetails.total} ليرة جديدة%0A%0A` +
            `📍 *طريقة الاستلام:* ${deliveryText[orderDetails.deliveryOption]}%0A%0A` +
            `🆔 *رقم الطلب:* ${orderDetails.id}%0A` +
            `📅 *تاريخ الطلب:* ${new Date(orderDetails.timestamp).toLocaleString('ar')}`;
        
        const adminWhatsappUrl = `https://wa.me/${this.adminPhone}?text=${adminMessage}`;
        window.open(adminWhatsappUrl, '_blank');
        
        const customerMessage = `✅ *تم استلام طلبك رقم ${orderDetails.id}* %0A%0A` +
            `شكراً لتسوقك مع توصيلة%0A` +
            `سيتم التواصل معك قريباً على رقم ${orderDetails.customerPhone} لتأكيد الطلب.%0A%0A` +
            `📞 للاستفسار: 0998028910`;
        
        setTimeout(() => {
            window.open(`https://wa.me/${orderDetails.customerPhoneInternational}?text=${customerMessage}`, '_blank');
        }, 500);
        
        return true;
    }

    async checkout() {
        if (this.cart.length === 0) {
            this.showNotification('🛒 الرجاء إضافة منتجات إلى السلة أولاً', 'error');
            return;
        }
        
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (this.selectedDeliveryOption === 'delivery') {
            this.deliveryFee = Math.ceil(subtotal * this.deliveryPercentage / 100);
        } else {
            this.deliveryFee = 0;
        }
        
        const total = subtotal + this.deliveryFee;
        
        const orderDetails = {
            id: Date.now(),
            items: [...this.cart],
            subtotal: subtotal,
            deliveryFee: this.deliveryFee,
            total: total,
            deliveryOption: this.selectedDeliveryOption,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
        
        let orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderDetails);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        this.showNotification('⏳ جاري معالجة الطلب...', 'info');
        
        const sent = await this.sendOrderViaWhatsApp(orderDetails);
        
        if (sent) {
            this.cart = [];
            this.saveCartToStorage();
            this.updateCartUI();
            
            this.showNotification('✅ تم إرسال الطلب بنجاح! سيتم التواصل معك قريباً', 'success');
            
            const cartSidebar = document.getElementById('cart-sidebar');
            const cartOverlay = document.getElementById('cart-overlay');
            if (cartSidebar) cartSidebar.classList.remove('active');
            if (cartOverlay) cartOverlay.classList.remove('active');
        }
    }

    saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        if (type === 'warning') icon = 'fa-exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas ${icon}" style="font-size: 18px;"></i>
            <span style="font-size: 14px; font-weight: 500;">${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    setupOfferButtons() {
        document.addEventListener('click', (e) => {
            const offerButton = e.target.closest('.btn-offer');
            if (offerButton) {
                e.stopPropagation();
                const offerData = offerButton.getAttribute('data-offer');
                if (offerData) {
                    const offer = JSON.parse(offerData);
                    this.addOfferToCart(offer);
                }
            }
        });
    }

    setupSocialLinks() {
        const socialUrls = {
            'facebook': 'https://www.facebook.com/profile.php?id=61573960290258',
            'instagram': 'https://www.instagram.com/tawaselasy',
            'twitter': 'https://twitter.com/tawaselasy',
            'whatsapp': 'https://wa.me/963998028910?text=مرحباً، بك في توصيلة'
        };
        
        document.querySelectorAll('.social-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const social = link.getAttribute('data-social');
                if (social && socialUrls[social]) {
                    window.open(socialUrls[social], '_blank');
                }
            });
        });
    }

    setupFooterLinks() {
        document.querySelectorAll('[data-footer]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const action = link.getAttribute('data-footer');
                
                switch(action) {
                    case 'call':
                        window.location.href = 'tel:0998028910';
                        break;
                    case 'faq':
                        this.showFAQ();
                        break;
                    case 'privacy':
                        this.showPrivacyPolicy();
                        break;
                    case 'terms':
                        this.showTerms();
                        break;
                }
            });
        });
    }

    showFAQ() {
        alert(`📋 الأسئلة الشائعة:

❓ كيف يمكنني طلب منتج؟
💡 اختر المنتج من المحلات، أو من العروض، أضفه للسلة، ثم أكمل الطلب.

❓ ما هي طرق الدفع المتاحة؟
💡 الدفع عند الاستلام نقداً.

❓ كم تستغرق عملية التوصيل؟
💡 التوصيل خلال 20-30 دقيقة حسب الموقع.

❓ هل التوصيل مجاني؟
💡 التوصيل مجاني للطلبات فوق 1000 ليرة ضمن حمورية (نسبة التوصيل ${this.deliveryPercentage}% من قيمة الطلب).

📞 للاستفسار: 0998028910`);
    }

    showPrivacyPolicy() {
        alert(`🔒 سياسة الخصوصية:

نحن في توصيلة نلتزم بحماية خصوصية بياناتك. يتم استخدام معلوماتك فقط لتوصيل الطلبات وتحسين الخدمة.`);
    }

    showTerms() {
        alert(`📜 شروط الاستخدام:

1. الطلبات غير قابلة للاسترجاع بعد التوصيل.
2. الحد الأدنى للطلب 500 ليرة جديدة.
3. الأسعار تشمل الضريبة.
4. نضمن جودة المنتجات من المحلات المعتمدة.`);
    }

    // ==================== تحسين البحث مع الانتقال للمنتج ====================
    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        
        if (searchInput) {
            const self = this;
            searchInput.oninput = function(e) {
                self.handleSearch(e.target.value);
            };
            
            searchInput.onkeypress = function(e) {
                if (e.key === 'Enter') {
                    self.handleSearch(searchInput.value);
                }
            };
        }
        
        const searchButton = document.querySelector('.btn-search');
        if (searchButton) {
            const self = this;
            searchButton.onclick = function() {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    self.handleSearch(searchInput.value);
                }
            };
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                const cartSidebar = document.getElementById('cart-sidebar');
                const cartOverlay = document.getElementById('cart-overlay');
                if (cartSidebar && cartSidebar.classList.contains('active')) {
                    cartSidebar.classList.remove('active');
                    cartOverlay.classList.remove('active');
                }
            }
        });
    }

    // معالجة البحث مع الانتقال للمنتج
    handleSearch(query) {
        if (!query || !query.trim()) {
            this.displayGroceries();
            this.displayOffers();
            return;
        }
        
        const searchTerm = query.toLowerCase().trim();
        
        let foundProducts = [];
        let foundStore = null;
        
        this.groceries.forEach(grocery => {
            grocery.products.forEach(product => {
                if (product.name.toLowerCase().includes(searchTerm)) {
                    foundProducts.push({
                        ...product,
                        storeName: grocery.name,
                        storeId: grocery.id,
                        store: grocery
                    });
                    foundStore = grocery;
                }
            });
        });
        
        if (foundProducts.length > 0) {
            // عرض نتائج البحث
            this.showSearchResults(foundProducts);
            this.showNotification(`🔍 تم العثور على ${foundProducts.length} منتج`, 'success');
            
            // الانتقال إلى قسم المحلات
            const groceriesSection = document.getElementById('groceries');
            if (groceriesSection) {
                groceriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // تمييز المنتج الموجود
                setTimeout(() => {
                    const productCards = document.querySelectorAll('.grocery-card');
                    productCards.forEach(card => {
                        card.style.transition = 'all 0.3s ease';
                        card.style.boxShadow = '0 0 0 2px #FF6B35';
                        setTimeout(() => {
                            card.style.boxShadow = '';
                        }, 2000);
                    });
                }, 500);
            }
        } else {
            this.showNotification('🔍 لا توجد نتائج مطابقة لـ "' + searchTerm + '"', 'info');
            this.displayGroceries();
            this.displayOffers();
        }
    }

    showSearchResults(products) {
        const container = document.getElementById('groceries-container');
        if (!container) return;
        
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: var(--spacing-xl); background: linear-gradient(135deg, #FFF8F5, #FFFFFF); border-radius: var(--radius-lg); margin-bottom: var(--spacing-lg);">
                <h3 style="color: #FF6B35; font-size: 24px;">🔍 نتائج البحث (${products.length} منتج)</h3>
                <p style="color: #6C757D; margin-top: 8px;">انقر على المنتج لطلب ما تبحث عنه</p>
            </div>
            ${products.map(product => `
                <div class="grocery-card" onclick="orderSystem.selectGroceryAndHighlight(${product.storeId}, '${product.name}')" style="border: 2px solid #FF6B35; animation: pulse 0.5s ease;">
                    <div class="card-image">
                        <img src="images/بقالة الرحمن.jpg" onerror="this.src='https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=${product.storeName}'">
                        <span class="card-badge" style="background: #28A745;">✓ مطابق</span>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${product.name}</h3>
                        <p class="card-description">${product.description || ''} - ${product.unit}</p>
                        <div class="price" style="color: #FF6B35; font-weight: bold; margin-top: var(--spacing-sm); font-size: 20px;">
                            💰 ${product.price} ليرة جديدة
                        </div>
                        <div style="margin-top: 8px; color: #6C757D; font-size: 12px;">
                            🏪 ${product.storeName}
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
    }

    // دالة لاختيار المتجر وتسليط الضوء على المنتج المطلوب
    selectGroceryAndHighlight(storeId, productName) {
        this.selectGrocery(storeId);
        
        // بعد فتح المودال، قم بالتمرير إلى المنتج المطلوب
        setTimeout(() => {
            const modal = document.getElementById('products-modal');
            if (modal) {
                const products = modal.querySelectorAll('.menu-item');
                for (let product of products) {
                    const title = product.querySelector('h3')?.innerText;
                    if (title === productName) {
                        product.style.backgroundColor = '#FFF8F5';
                        product.style.border = '2px solid #FF6B35';
                        product.style.borderRadius = '8px';
                        product.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                        setTimeout(() => {
                            product.style.backgroundColor = '';
                            product.style.border = '';
                        }, 3000);
                        break;
                    }
                }
            }
        }, 300);
    }

    setupScrollAnimations() {
        const fadeElements = document.querySelectorAll('.grocery-card, .offer-card, .step-card, .join-us-container');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });
        
        fadeElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }
}

const orderSystem = new OrderSystem();
window.orderSystem = orderSystem;

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ تم تحميل توصيلة بنجاح');
    console.log('📊 نسبة التوصيل: 10%');
    
    const footerBottom = document.querySelector('.footer-bottom p');
    if (footerBottom) {
        const year = new Date().getFullYear();
        footerBottom.innerHTML = footerBottom.innerHTML.replace('2026', year);
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});