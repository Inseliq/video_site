// wwwroot/js/sign.js
// Обработчик переключения форм (если уже есть — оставь свой)
function switchToRegister() {
    document.querySelector('.login-form').style.display = 'none';
    document.querySelector('.register-form').style.display = 'block';
    document.getElementById('loginToggle').classList.remove('active');
    document.getElementById('registerToggle').classList.add('active');
    const ind = document.getElementById('toggleIndicator');
    if (ind) ind.style.transform = 'translateX(100%)';
}

function switchToLogin() {
    document.querySelector('.login-form').style.display = 'block';
    document.querySelector('.register-form').style.display = 'none';
    document.getElementById('loginToggle').classList.add('active');
    document.getElementById('registerToggle').classList.remove('active');
    const ind = document.getElementById('toggleIndicator');
    if (ind) ind.style.transform = 'translateX(0)';
}

// AJAX submit: использует FormData (включая __RequestVerificationToken из @Html.AntiForgeryToken())
async function submitForm(e, mode) {
    e.preventDefault();
    const form = mode === 'login' ? document.getElementById('loginForm') : document.getElementById('registerForm');
    if (!form) return;

    // простая валидация на клиенте
    const inputs = form.querySelectorAll('input[required]');
    for (let input of inputs) {
        if (!input.value) {
            showErrors(['Заполните все поля.']);
            return;
        }
    }

    const fd = new FormData(form);
    fd.set('mode', mode);

    // Показать спиннер (если есть): добавляем класс loading
    const btn = form.querySelector('.submit-btn');
    if (btn) btn.classList.add('loading');

    try {
        const res = await fetch(form.action, {
            method: 'POST',
            body: fd,
            credentials: 'same-origin'
        });

        // Если сервер вернул JSON (AJAX путь)
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
            const data = await res.json();
            if (data.success) {
                window.location.href = data.redirectUrl || '/';
            } else {
                if (data.errors) {
                    // ModelState errors
                    const arr = [];
                    for (const k in data.errors) {
                        if (Array.isArray(data.errors[k])) {
                            arr.push(...data.errors[k]);
                        } else {
                            arr.push(data.errors[k]);
                        }
                    }
                    showErrors(arr);
                } else {
                    showErrors([data.message || 'Ошибка при отправке формы']);
                }
            }
        } else {
            // HTML ответ (редирект) — просто загрузим его
            const text = await res.text();
            document.open();
            document.write(text);
            document.close();
        }
    } catch (err) {
        showErrors(['Серверная ошибка: ' + (err.message || err)]);
    } finally {
        if (btn) btn.classList.remove('loading');
    }
}

function showErrors(arr) {
    const box = document.getElementById('formErrors');
    if (!box) return;
    box.style.display = 'block';
    box.innerHTML = '<ul>' + arr.map(x => `<li>${escapeHtml(x)}</li>`).join('') + '</ul>';
}

function escapeHtml(unsafe) {
    return unsafe
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

// По умолчанию показываем форму входа
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.login-form') && document.querySelector('.register-form')) {
        switchToLogin();
    }
});
