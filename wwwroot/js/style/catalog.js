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