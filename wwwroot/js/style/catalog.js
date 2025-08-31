// Данные продуктов для модального окна
let productsData = [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    // Получаем данные продуктов из серверного кода
    const productsScript = document.getElementById('products-data');
    if (productsScript) {
        try {
            productsData = JSON.parse(productsScript.textContent);
        } catch (e) {
            console.error('Ошибка парсинга данных продуктов:', e);
            productsData = [];
        }
    }

    // Инициализация всех анимаций
    initializeAnimations();
});

// Инициализация анимаций
function initializeAnimations() {
    // Анимация появления карточек товаров
    animateProductCards();

    // Анимация поисковой строки
    setupSearchAnimations();

    // Анимации категорий
    setupCategoryAnimations();

    // Анимации при прокрутке
    setupScrollAnimations();

    // Анимации наведения на карточки
    setupCardHoverEffects();
}

// Анимация карточек товаров при загрузке страницы
function animateProductCards() {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach((card, index) => {
        // Начальное состояние
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';

        // Анимация с задержкой
        setTimeout(() => {
            card.style.transition = 'all 0.8s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Настройка анимаций поисковой строки
function setupSearchAnimations() {
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (!searchBox || !searchInput) return;

    // Анимация при фокусе
    searchInput.addEventListener('focus', function () {
        searchBox.style.transform = 'scale(1.02)';
        searchBox.style.background = 'rgba(255, 255, 255, 0.2)';
        searchBox.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.3)';
    });

    // Анимация при потере фокуса
    searchInput.addEventListener('blur', function () {
        searchBox.style.transform = 'scale(1)';
        searchBox.style.background = 'rgba(255, 255, 255, 0.1)';
        searchBox.style.boxShadow = 'none';
    });

    // Анимация кнопки поиска
    if (searchBtn) {
        searchBtn.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1)';
        });

        searchBtn.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    }
}

// Настройка анимаций категорий
function setupCategoryAnimations() {
    const categoryPills = document.querySelectorAll('.category-pill');

    categoryPills.forEach(pill => {
        pill.addEventListener('mouseenter', function () {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-3px) scale(1.05)';
                this.style.background = 'rgba(255, 255, 255, 0.2)';
            }
        });

        pill.addEventListener('mouseleave', function () {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            }
        });

        // Анимация клика
        pill.addEventListener('click', function () {
            // Эффект пульсации при клике
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            }, 100);
        });
    });
}

// Настройка анимаций при прокрутке
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '50px' });

    // Наблюдаем за карточками товаров
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
}

// Настройка эффектов при наведении на карточки
function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3)';

            // Анимация изображения
            const img = this.querySelector('.product-image img');
            if (img) {
                img.style.transform = 'scale(1.1)';
            }
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';

            // Возврат изображения
            const img = this.querySelector('.product-image img');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });
}

// Анимация при добавлении в корзину
function addToCartAnimation(button) {
    if (button.disabled) return;

    const originalText = button.innerHTML;
    const spinner = '<span class="loading-spinner active"></span>';

    // Блокируем кнопку и показываем загрузку
    button.disabled = true;
    button.innerHTML = spinner + 'Добавляем...';
    button.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';

    // Эффект пульсации
    button.style.animation = 'pulse 1s infinite';

    // Имитация процесса (в реальности будет отправка формы)
    setTimeout(() => {
        button.innerHTML = '✓ Добавлено';
        button.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
        button.style.animation = 'none';

        // Возврат к исходному состоянию
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
            button.disabled = false;
        }, 2000);
    }, 1500);
}

// Анимация добавления в избранное
function addToWishlistAnimation(button) {
    // Анимация сердца
    const heart = button.textContent.trim();

    button.style.transform = 'scale(1.3)';
    button.style.color = '#ff6b6b';
    button.innerHTML = '❤️';

    // Эффект пульсации
    setTimeout(() => {
        button.style.transform = 'scale(1.1)';
    }, 100);

    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 300);

    // Возврат к исходному состоянию через время
    setTimeout(() => {
        button.style.color = '';
        button.innerHTML = heart;
    }, 2000);
}

// Анимация кнопки "Загрузить еще"
function loadMoreAnimation(link) {
    const spinner = link.querySelector('.loading-spinner');
    const originalText = link.innerHTML;

    // Показываем спиннер
    if (spinner) {
        spinner.style.opacity = '1';
        spinner.classList.add('active');
    }

    // Блокируем ссылку временно для визуального эффекта
    link.style.pointerEvents = 'none';
    link.style.opacity = '0.7';

    // Возвращаем через короткое время (реальная загрузка произойдет по ссылке)
    setTimeout(() => {
        if (spinner) {
            spinner.style.opacity = '0';
            spinner.classList.remove('active');
        }
        link.style.pointerEvents = 'auto';
        link.style.opacity = '1';
    }, 1000);
}

// Открытие модального окна товара
function openProductModal(productId) {
    const product = productsData.find(p => p.id == productId);
    if (!product) {
        console.error('Продукт не найден:', productId);
        return;
    }

    const modal = document.getElementById('productModal');
    if (!modal) return;

    // Заполняем модальное окно данными
    populateModal(product);

    modal.style.display = 'flex';
    modal.style.opacity = '0';

    setTimeout(() => {
        modal.style.opacity = '1';
        modal.classList.add('active');

        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'scale(1)';
        }
    }, 10);

    // Блокируем прокрутку страницы
    document.body.style.overflow = 'hidden';
}

// Заполнение модального окна данными продукта
function populateModal(product) {
    const elements = {
        image: document.getElementById('modalImage'),
        title: document.getElementById('modalTitle'),
        stars: document.getElementById('modalStars'),
        reviews: document.getElementById('modalReviews'),
        price: document.getElementById('modalPrice'),
        description: document.getElementById('modalDescription'),
        productId: document.getElementById('modalProductId'),
        wishlistProductId: document.getElementById('modalWishlistProductId')
    };

    // Заполняем элементы если они существуют
    if (elements.image) elements.image.src = product.imageUrl || '';
    if (elements.title) elements.title.textContent = product.title || '';
    if (elements.reviews) elements.reviews.textContent = `(${product.reviewsCount || 0} отзывов)`;
    if (elements.description) elements.description.textContent = product.description || '';
    if (elements.productId) elements.productId.value = product.id;
    if (elements.wishlistProductId) elements.wishlistProductId.value = product.id;

    // Формируем звезды рейтинга
    if (elements.stars) {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            const starClass = i <= (product.rating || 0) ? 'star-filled' : 'star-empty';
            starsHtml += `<span class="${starClass}">★</span>`;
        }
        elements.stars.innerHTML = starsHtml;
    }

    // Форматируем цену
    if (elements.price && product.price) {
        try {
            elements.price.textContent = new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB'
            }).format(product.price);
        } catch (e) {
            elements.price.textContent = product.price + ' ₽';
        }
    }
}

// Закрытие модального окна
function closeModal() {
    const modal = document.getElementById('productModal');
    if (!modal) return;

    const modalContent = modal.querySelector('.modal-content');

    // Анимация исчезновения
    if (modalContent) {
        modalContent.style.transform = 'scale(0.9)';
    }
    modal.style.opacity = '0';

    setTimeout(() => {
        modal.classList.remove('active');
        modal.style.display = 'none';
        if (modalContent) {
            modalContent.style.transform = 'scale(0.9)';
        }
    }, 300);

    // Восстанавливаем прокрутку страницы
    document.body.style.overflow = 'auto';
}

// Эффект при клике на карточку
function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';

    element.appendChild(ripple);

    // Удаляем эффект через время анимации
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.remove();
        }
    }, 600);
}

// Обработчик кликов для эффектов
document.addEventListener('click', function (event) {
    // Эффект ряби для карточек товаров
    const productCard = event.target.closest('.product-card');
    if (productCard) {
        createRippleEffect(event, productCard);
    }

    // Анимация для кнопок категорий
    const categoryPill = event.target.closest('.category-pill');
    if (categoryPill) {
        categoryPill.style.transform = 'scale(0.95)';
        setTimeout(() => {
            categoryPill.style.transform = '';
        }, 150);
    }
});

// Обработчик нажатия клавиши Escape для закрытия модального окна
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Плавная прокрутка к каталогу при переходе между категориями
function smoothScrollToCatalog() {
    const catalogSection = document.querySelector('.catalog');
    if (catalogSection) {
        catalogSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Анимация загрузки новых товаров (для AJAX загрузки, если потребуется)
function animateNewProducts(newCards) {
    newCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';

        setTimeout(() => {
            card.style.transition = 'all 0.8s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/* ------- Начало: Wishlist (только добавить этот блок) ------- */
(() => {
    const STORAGE_KEY = 'dh_wishlist_v1';

    // localStorage helpers
    function loadWishlist() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed.map(Number) : [];
        } catch (e) {
            console.warn('Ошибка чтения избранного:', e);
            return [];
        }
    }
    function saveWishlist(arr) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(new Set(arr))));
        } catch (e) {
            console.warn('Ошибка сохранения избранного:', e);
        }
    }

    // CRUD
    function isInWishlist(id) { return loadWishlist().indexOf(Number(id)) !== -1; }
    function addToWishlist(id) {
        const list = loadWishlist();
        if (list.indexOf(Number(id)) === -1) {
            list.push(Number(id));
            saveWishlist(list);
            dispatchChanged(list);
        }
    }
    function removeFromWishlist(id) {
        const list = loadWishlist().filter(x => x !== Number(id));
        saveWishlist(list);
        dispatchChanged(list);
    }
    function toggleWishlist(id) {
        if (isInWishlist(id)) removeFromWishlist(id);
        else addToWishlist(id);
    }
    function dispatchChanged(list) {
        document.dispatchEvent(new CustomEvent('dh:wishlist:changed', { detail: { list } }));
    }

    // Установка состояния кнопки (класс, aria-pressed, title)
    function setBtnState(btn, favorited) {
        if (!btn) return;
        btn.classList.toggle('favorited', Boolean(favorited));
        btn.setAttribute('aria-pressed', favorited ? 'true' : 'false');
        btn.title = favorited ? 'Убрать из избранного' : 'Добавить в избранное';
    }

    // Инициализация кнопок на карточках каталога
    function initWishlistCatalogCards() {
        const cards = document.querySelectorAll('.product-card');
        if (!cards.length) return;

        cards.forEach(card => {
            const productId = card.dataset.productId || card.getAttribute('data-product-id');
            if (!productId) return;

            // Найдем серверную форму wishlist (если есть) и превратим её в JS-кнопку
            const wishlistForm = card.querySelector('form[action*="Wishlist"]');
            let wishlistBtn = wishlistForm ? wishlistForm.querySelector('button') : null;

            // клик — toggle
            wishlistBtn.addEventListener('click', (ev) => {
                ev.stopPropagation();
                ev.preventDefault();
                try { if (typeof addToWishlistAnimation === 'function') addToWishlistAnimation(wishlistBtn); } catch (e) { }
                toggleWishlist(productId);
            });

            // начальное состояние
            setBtnState(wishlistBtn, isInWishlist(productId));
        });

        // при изменении списка — обновляем все кнопки
        document.addEventListener('dh:wishlist:changed', () => {
            document.querySelectorAll('.product-card').forEach(card => {
                const pid = card.dataset.productId || card.getAttribute('data-product-id');
                if (!pid) return;
                const btn = card.querySelector('button.wishlist-toggle') || card.querySelector('form[action*="Wishlist"] button');
                setBtnState(btn, isInWishlist(pid));
            });
            // обновляем страницу избранного, если она открыта
            renderFavoritesOnPage();
        });
    }

    // Обработка кнопки в модальном окне
    function initModalWishlist() {
        const modal = document.getElementById('productModal');
        if (!modal) return;

        const wishlistForm = modal.querySelector('#modalWishlistForm');
        const wishlistBtn = wishlistForm ? wishlistForm.querySelector('button') : null;
        const wishlistProductIdInput = modal.querySelector('#modalWishlistProductId');

        // Если есть серверная форма — перехватим submit
        if (wishlistForm && wishlistBtn) {
            wishlistForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = wishlistProductIdInput ? wishlistProductIdInput.value : null;
                if (!id) return;
                toggleWishlist(id);
            });
        }

        // Обновляем состояние кнопки внутри модалки при событии открытия
        document.addEventListener('dh:product:opened', (ev) => {
            const id = ev.detail && ev.detail.id;
            if (!id) return;
            if (wishlistForm) {
                // обновим скрытое поле
                if (wishlistProductIdInput) wishlistProductIdInput.value = id;
            }
            if (wishlistBtn) setBtnState(wishlistBtn, isInWishlist(id));
        });

        // также обновляем, когда глобальный список изменяется
        document.addEventListener('dh:wishlist:changed', () => {
            // если модал открыт — обновим кнопку
            const id = modal.querySelector('#modalWishlistProductId') && modal.querySelector('#modalWishlistProductId').value;
            if (id && wishlistBtn) setBtnState(wishlistBtn, isInWishlist(id));
        });
    }

    // Рендер страницы "Избранное" (контейнер .favorites-grid)
    async function renderFavoritesOnPage() {
        const grid = document.querySelector('.favorites-grid');
        if (!grid) return;

        grid.innerHTML = '';
        const list = loadWishlist();
        if (!list.length) {
            grid.innerHTML = `
        <div class="favorites-empty">
          <h3>Пока нет избранных товаров</h3>
          <p>Добавьте товары в избранное — они появятся здесь.</p>
        </div>`;
            return;
        }

        // параллельные запросы к вашему API
        const promises = list.map(id =>
            fetch(`/Catalog/GetProductJson?id=${encodeURIComponent(id)}`, { headers: { 'Accept': 'application/json' } })
                .then(r => r.ok ? r.json() : null)
                .catch(() => null)
        );

        const products = (await Promise.all(promises)).filter(Boolean);
        if (!products.length) {
            grid.innerHTML = `<div class="favorites-empty"><p>Не удалось загрузить товары.</p></div>`;
            return;
        }

        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'favorite-card';
            card.innerHTML = `
        <div class="fav-left"><img src="${p.imageUrl || ''}" alt="${escapeHtml(p.title || '')}" loading="lazy"></div>
        <div class="fav-main">
          <h4 class="fav-title">${escapeHtml(p.title || '')}</h4>
          <div class="fav-price">${(p.price || 0).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</div>
          <p class="fav-desc">${escapeHtml((p.description || '').slice(0, 180))}${(p.description || '').length > 180 ? '…' : ''}</p>
          <div class="fav-actions">
            <button class="fav-remove" data-product-id="${p.id}" type="button" aria-label="Убрать из избранного">Убрать</button>
          </div>
        </div>
      `;
            grid.appendChild(card);
        });

        grid.querySelectorAll('button.fav-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.productId;
                removeFromWishlist(id);
                const el = btn.closest('.favorite-card');
                if (el) {
                    el.style.transition = 'opacity .25s, height .25s, margin .25s';
                    el.style.opacity = '0';
                    el.style.height = '0';
                    el.style.margin = '0';
                    setTimeout(() => {
                        if (el.parentNode) el.parentNode.removeChild(el);
                        if (!loadWishlist().length) renderFavoritesOnPage();
                    }, 300);
                }
            });
        });
    }

    // вспомогательная функция (экранирование)
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    // инициализация (выполняется после DOMContentLoaded)
    function initWishlist() {
        initWishlistCatalogCards();
        initModalWishlist();
        renderFavoritesOnPage();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWishlist);
    } else {
        initWishlist();
    }

    // expose for debug/console
    window.DHWishlist = {
        list: loadWishlist,
        add: id => addToWishlist(id),
        remove: id => removeFromWishlist(id),
        toggle: id => toggleWishlist(id),
        isIn: id => isInWishlist(id)
    };
})();
/* ------- Конец: Wishlist ------- */
