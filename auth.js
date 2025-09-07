// Константы
const AUTH_KEY = 'isLoggedIn';

// Проверяем состояние авторизации при загрузке страницы
function checkAuthState() {
    const isLoggedIn = localStorage.getItem(AUTH_KEY) === 'true';
    const authBtn = document.getElementById('auth-btn');

    if (authBtn) {
        if (isLoggedIn) {
            authBtn.textContent = 'Profile';
            authBtn.onclick = function() {
                window.location.href = 'profile.html';
            };
        } else {
            authBtn.textContent = 'Sign In';
            authBtn.onclick = function() {
                openLoginModal();
            };
        }
    }
}

// Открытие модального окна входа
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Закрытие модального окна
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Функция входа
function loginUser() {
    // Здесь должен быть реальный запрос к серверу
    // Для демонстрации используем localStorage
    localStorage.setItem(AUTH_KEY, 'true');
    checkAuthState();
    closeLoginModal();
    
    // Обновляем страницу профиля если мы на ней
    if (window.location.pathname.includes('profile.html')) {
        window.location.reload();
    }
}

// Функция выхода
function logoutUser() {
    localStorage.setItem(AUTH_KEY, 'false');
    checkAuthState();
    window.location.href = 'index.html';
}

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик формы входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loginUser();
        });
    }

    // Закрытие модального окна по клику на крестик
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLoginModal);
    }

    // Закрытие модального окна по клику вне его
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('loginModal');
        if (e.target === modal) {
            closeLoginModal();
        }
    });

    // Проверяем авторизацию при загрузке
    checkAuthState();
});