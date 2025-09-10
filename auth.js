// Константы
const AUTH_KEY = 'isLoggedIn';

// Функция для обновления навигации на всех страницах
function updateNavigation() {
    const isLoggedIn = localStorage.getItem(AUTH_KEY) === 'true';
    const authBtn = document.getElementById('auth-btn');
    const loginBtn = document.getElementById('login-btn');

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

    if (loginBtn) {
        if (isLoggedIn) {
            loginBtn.textContent = 'Profile';
            loginBtn.onclick = function() {
                window.location.href = 'profile.html';
            };
        } else {
            loginBtn.textContent = 'Sign In';
            loginBtn.onclick = function() {
                window.location.href = 'profile.html';
            };
        }
    }
}

// Проверяем состояние авторизации при загрузке страницы
function checkAuthState() {
    const isLoggedIn = localStorage.getItem(AUTH_KEY) === 'true';
    updateNavigation();
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
    localStorage.setItem(AUTH_KEY, 'true');
    updateNavigation();
    closeLoginModal();
}

// Функция выхода
function logoutUser() {
    localStorage.setItem(AUTH_KEY, 'false');
    updateNavigation();
    window.location.href = 'index.html';
}

// Функции для социального входа (заглушки)
function signInWithGoogle() {
    alert('Google Sign In would be implemented here');
    localStorage.setItem(AUTH_KEY, 'true');
    updateNavigation();
    closeLoginModal();
}

function signInWithFacebook() {
    alert('Facebook Sign In would be implemented here');
    localStorage.setItem(AUTH_KEY, 'true');
    updateNavigation();
    closeLoginModal();
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

    // Закрытие модального окна
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
