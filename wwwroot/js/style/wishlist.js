// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    initWishlist();
    animateCardsOnScroll();
    initFilters();
});

// Инициализация избранного
function initWishlist() {
    // Анимация появления карточек
    const cards = document.querySelectorAll('.wishlist-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Анимация статистики
    animateStats();
}

// Анимация чисел в статистике
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const isPrice = finalValue.includes('₽');
        let currentValue = 0;

        if (isPrice) {
            const numericValue = parseFloat(stat.dataset.value);
            const increment = numericValue / 30;

            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    currentValue = numericValue;
                    clearInterval(timer);
                }
                stat.textContent = new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB'
                }).format(currentValue);
            }, 30);
        } else if (!isNaN(finalValue)) {
            const numericValue = parseInt(finalValue);
            const increment = Math.ceil(numericValue / 30);

            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    currentValue = numericValue;
                    clearInterval(timer);
                }
                stat.textContent = currentValue;
            }, 30);
        }
    });
}

// Фильтрация товаров
function filterWishlist(filter) {
    const cards = document.querySelectorAll('.wishlist-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // Обновление активной кнопки
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.onclick && btn.onclick.toString().includes(filter)) {
            btn.classList.add('active');
        }
    });

    // Фильтрация карточек
    cards.forEach(card => {
        card.style.display = 'none';
        setTimeout(() => {
            let shouldShow = false;

            switch (filter) {
                case 'all':
                    shouldShow = true;
                    break;
                case 'available':
                    shouldShow = !card.classList.contains('out-of-stock');
                    break;
            }

            if (shouldShow) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }
        }, 300);
    });
}

// Анимация удаления из избранного
function removeAnimation(button, event) {
    event.preventDefault();
    event.stopPropagation();

    const card = button.closest('.wishlist-card');
    const form = button.closest('form');

    // Добавляем класс анимации
    card.classList.add('removing');

    // Обновляем статистику
    updateStatsOnRemove(card);

    // Отправляем форму после анимации
    setTimeout(() => {
        form.submit();
    }, 500);
}

// Обновление статистики при удалении
function updateStatsOnRemove(card) {
    const totalItemsStat = document.querySelector('.stat-number');
    if (totalItemsStat) {
        const currentCount = parseInt(totalItemsStat.textContent);
        animateNumber(totalItemsStat, currentCount, currentCount - 1);
    }
}

// Анимация изменения числа
function animateNumber(element, from, to) {
    const duration = 300;
    const start = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        const current = from + (to - from) * progress;
        element.textContent = Math.round(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// Анимация добавления в корзину
function addToCartAnimation(button, event) {
    event.preventDefault();
    event.stopPropagation();

    const form = button.closest('form');

    // Анимация кнопки
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);

    // Создаем летящую иконку
    const icon = document.createElement('div');
    icon.innerHTML = '🛒';
    icon.style.cssText = `
        position: fixed;
        font-size: 2rem;
        z-index: 9999;
        pointer-events: none;
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    `;

    const rect = button.getBoundingClientRect();
    icon.style.left = rect.left + rect.width / 2 - 15 + 'px';
    icon.style.top = rect.top + rect.height / 2 - 15 + 'px';

    document.body.appendChild(icon);

    // Анимация полета к корзине
    setTimeout(() => {
        icon.style.transform = 'translate(300px, -300px) scale(0)';
        icon.style.opacity = '0';
    }, 100);

    // Показываем уведомление
    setTimeout(() => {
        showNotification('Товар добавлен в корзину');
        icon.remove();
        form.submit();
    }, 900);
}

// Показ уведомления
function showNotification(message) {
    const notification = document.getElementById('cartNotification');
    if (notification) {
        const textElement = notification.querySelector('.notification-text');
        if (textElement) {
            textElement.textContent = message;
        }

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Уведомить о наличии
function notifyWhenAvailable(productId) {
    // Здесь будет логика подписки на уведомления
    showNotification('Мы уведомим вас, когда товар появится в наличии');

    // Анимация кнопки
    const button = event.target.closest('button');
    if (button) {
        button.style.background = 'linear-gradient(45deg, #00d2ff, #3a7bd5)';
        button.innerHTML = '<span class="btn-icon">✓</span><span class="btn-text">Подписано</span>';
        button.disabled = true;
    }
}

// Подтверждение очистки избранного
function confirmClear() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.classList.add('active');

        // Останавливаем стандартную отправку формы
        return false;
    }
    return false;
}

// Подтверждение действия
function confirmAction() {
    // Находим форму очистки и отправляем
    const clearForm = document.querySelector('form[action*="ClearWishlist"]');
    if (clearForm) {
        clearForm.submit();
    }
}

// Инициализация фильтров
function initFilters() {
    // Добавляем обработчики для фильтров категорий если они есть
    const categoryFilters = document.querySelectorAll('[data-category-filter]');
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', function () {
            const category = this.dataset.categoryFilter;
            filterByCategory(category);
        });
    });
}

// Фильтрация по категории
function filterByCategory(category) {
    const cards = document.querySelectorAll('.wishlist-card');

    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
            }, 50);
        } else {
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Анимация при прокрутке
function animateCardsOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.recommendation-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
}

// Эффект параллакса для фона
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.bg-animation');
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Добавление эффекта ряби при клике
document.addEventListener('click', function (e) {
    if (e.target.matches('.btn-primary, .btn-secondary, .filter-btn')) {
        const button = e.target;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s linear;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }
});