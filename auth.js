// ===== СИСТЕМА ПЕРЕВОДОВ ДЛЯ АУТЕНТИФИКАЦИИ =====
const authTranslations = {
    en: {
        "signin": "Sign In",
        "profile": "Profile",
        "welcome": "Welcome to EcoYard!",
        "logout": "Logout",
        "login_success": "Successfully logged in!",
        "logout_success": "Successfully logged out",
        "google_login": "Sign in with Google",
        "facebook_login": "Sign in with Facebook",
        "welcome_bonus": "Welcome bonus +50 points!"
    },
    ru: {
        "signin": "Войти",
        "profile": "Профиль", 
        "welcome": "Добро пожаловать в EcoYard!",
        "logout": "Выйти",
        "login_success": "Успешный вход!",
        "logout_success": "Успешный выход",
        "google_login": "Войти через Google",
        "facebook_login": "Войти через Facebook",
        "welcome_bonus": "Бонус приветствия +50 очков!"
    },
    kz: {
        "signin": "Кіру",
        "profile": "Профиль",
        "welcome": "EcoYard-ге қош келдіңіз!",
        "logout": "Шығу",
        "login_success": "Сәтті кірді!",
        "logout_success": "Сәтті шықты",
        "google_login": "Google арқылы кіру",
        "facebook_login": "Facebook арқылы кіру",
        "welcome_bonus": "Қош келдіңіз бонусы +50 ұпай!"
    }
};

// Функция для получения перевода в auth.js
function getAuthTranslation(key) {
    const currentLang = localStorage.getItem('selectedLanguage') || 'en';
    return authTranslations[currentLang]?.[key] || authTranslations.en[key] || key;
}

// Функция для обновления текста кнопок с учетом языка
function updateAuthButtonText() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authBtn = document.getElementById('auth-btn');
    const loginBtn = document.getElementById('login-btn');

    if (authBtn) {
        if (isLoggedIn) {
            authBtn.textContent = getAuthTranslation('profile');
        } else {
            authBtn.textContent = getAuthTranslation('signin');
        }
    }

    if (loginBtn) {
        if (isLoggedIn) {
            loginBtn.textContent = getAuthTranslation('profile');
        } else {
            loginBtn.textContent = getAuthTranslation('signin');
        }
    }
}

// Константы
const AUTH_KEY = 'isLoggedIn';

// Система уровней
const levelSystem = {
    levels: {
        1: { points: 0, title: "Eco-Beginner", badge: "🌱", rewards: [] },
        2: { points: 100, title: "Eco-Enthusiast", badge: "♻️", rewards: ["5% discount at partners"] },
        3: { points: 300, title: "Green Warrior", badge: "🌍", rewards: ["10% discount", "Early access to events"] },
        4: { points: 600, title: "Eco-Champion", badge: "🏆", rewards: ["15% discount", "Special badge", "Featured on community page"] },
        5: { points: 1000, title: "Planet Guardian", badge: "🛡️", rewards: ["20% discount", "All previous rewards", "Community leader status"] }
    },

    achievements: {
        first_report: { name: "First Report", description: "Submit your first environmental issue", points: 25, icon: "📝" },
        cleanup_hero: { name: "Cleanup Hero", description: "Participate in 5 cleanup events", points: 100, icon: "🧹" },
        tree_planter: { name: "Tree Planter", description: "Plant 10 trees", points: 150, icon: "🌳" },
        community_leader: { name: "Community Leader", description: "Verify 20 reports", points: 200, icon: "👑" },
        eco_educator: { name: "Eco Educator", description: "Complete all eco-knowledge quizzes", points: 75, icon: "📚" }
    },

    init() {
        this.loadUserProgress();
    },

    loadUserProgress() {
        this.userPoints = parseInt(localStorage.getItem('userPoints') || '0');
        this.userAchievements = JSON.parse(localStorage.getItem('userAchievements') || '{}');
        this.userLevel = this.calculateCurrentLevel();
    },

    calculateCurrentLevel() {
        let currentLevel = 1;
        for (const [level, data] of Object.entries(this.levels)) {
            if (this.userPoints >= data.points) {
                currentLevel = parseInt(level);
            } else {
                break;
            }
        }
        return currentLevel;
    },

    addPoints(points, action, description) {
        const oldLevel = this.userLevel;
        this.userPoints += points;
        this.userLevel = this.calculateCurrentLevel();
        
        localStorage.setItem('userPoints', this.userPoints.toString());
        
        // Проверка достижений
        this.checkAchievements(action);
        
        // Уведомление о новом уровне
        if (this.userLevel > oldLevel) {
            this.handleLevelUp(oldLevel, this.userLevel);
        }
        
        this.updateLevelDisplay();
        
        // Показ уведомления
        if (window.showNotification) {
            window.showNotification(`+${points} points! ${description}`, 'success');
        }
        
        return points;
    },

    checkAchievements(action) {
        const achievementKeys = {
            'REPORT_ISSUE': 'first_report',
            'ATTEND_EVENT': 'cleanup_hero',
            'PLANT_TREE': 'tree_planter',
            'VERIFY_ISSUE': 'community_leader',
            'COMPLETE_QUIZ': 'eco_educator'
        };

        const achievementKey = achievementKeys[action];
        if (achievementKey && !this.userAchievements[achievementKey]) {
            this.unlockAchievement(achievementKey);
        }
    },

    unlockAchievement(achievementKey) {
        const achievement = this.achievements[achievementKey];
        this.userAchievements[achievementKey] = {
            unlocked: true,
            unlockedAt: new Date().toISOString()
        };
        
        localStorage.setItem('userAchievements', JSON.stringify(this.userAchievements));
        
        // Показать уведомление о достижении
        if (window.showNotification) {
            window.showNotification(
                `🎉 Achievement Unlocked: ${achievement.name} +${achievement.points} points!`,
                'success',
                5000
            );
        }
        
        // Добавить очки за достижение
        this.addPoints(achievement.points, 'ACHIEVEMENT', achievement.name);
    },

    handleLevelUp(oldLevel, newLevel) {
        const newLevelData = this.levels[newLevel];
        
        if (window.showNotification) {
            window.showNotification(
                `🎊 Level Up! You are now ${newLevelData.title} ${newLevelData.badge}`,
                'success',
                5000
            );

            // Разблокировать награды
            if (newLevelData.rewards.length > 0) {
                setTimeout(() => {
                    window.showNotification(
                        `🎁 New Rewards: ${newLevelData.rewards.join(', ')}`,
                        'info',
                        5000
                    );
                }, 1000);
            }
        }
    },

    updateLevelDisplay() {
        // Обновление отображения уровня на странице
        const levelElements = document.querySelectorAll('.user-level, #user-level');
        const progressElements = document.querySelectorAll('.level-progress, #level-progress');
        
        const currentLevelData = this.levels[this.userLevel];
        const nextLevelData = this.levels[this.userLevel + 1];
        const progress = nextLevelData ? 
            ((this.userPoints - currentLevelData.points) / (nextLevelData.points - currentLevelData.points)) * 100 : 100;

        levelElements.forEach(element => {
            element.textContent = `${currentLevelData.title} ${currentLevelData.badge}`;
        });

        progressElements.forEach(element => {
            element.style.width = `${progress}%`;
            if (element.textContent) {
                element.textContent = `${Math.round(progress)}%`;
            }
        });

        // Обновление очков
        updatePointsDisplay();
    }
};

// Система уведомлений
function showNotification(message, type = 'info', duration = 3000) {
    // Создаем контейнер для уведомлений если его нет
    let container = document.getElementById('notifications-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notifications-container';
        container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    notification.className = `notification transform transition-transform duration-300 translate-x-full ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
    } text-white p-4 rounded-lg shadow-lg max-w-sm`;
    
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <i class="fas fa-${getNotificationIcon(type)} mr-2"></i>
                <span>${message}</span>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    container.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    
    // Автоматическое скрытие
    if (duration > 0) {
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
    
    return notification;
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Функция для обновления навигации на всех страницах
function updateNavigation() {
    const isLoggedIn = localStorage.getItem(AUTH_KEY) === 'true';
    const authBtn = document.getElementById('auth-btn');
    const loginBtn = document.getElementById('login-btn');

    if (authBtn) {
        if (isLoggedIn) {
            authBtn.textContent = getAuthTranslation('profile');
            authBtn.onclick = function() {
                window.location.href = 'profile.html';
            };
        } else {
            authBtn.textContent = getAuthTranslation('signin');
            authBtn.onclick = function() {
                openLoginModal();
            };
        }
    }

    if (loginBtn) {
        if (isLoggedIn) {
            loginBtn.textContent = getAuthTranslation('profile');
            loginBtn.onclick = function() {
                window.location.href = 'profile.html';
            };
        } else {
            loginBtn.textContent = getAuthTranslation('signin');
            loginBtn.onclick = function() {
                openLoginModal();
            };
        }
    }
    
    // Обновление отображения очков и уровня
    updatePointsDisplay();
    if (window.levelSystem) {
        window.levelSystem.updateLevelDisplay();
    }
}

// Проверяем состояние авторизации при загрузке страницы
function checkAuthState() {
    const isLoggedIn = localStorage.getItem(AUTH_KEY) === 'true';
    
    // Инициализация системы уровней
    if (!window.levelSystem) {
        window.levelSystem = levelSystem;
        window.levelSystem.init();
    }
    
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
    
    // Инициализация данных пользователя при первом входе
    if (!localStorage.getItem('userPoints')) {
        localStorage.setItem('userPoints', '0');
    }
    if (!localStorage.getItem('userActivities')) {
        localStorage.setItem('userActivities', '[]');
    }
    if (!localStorage.getItem('userAchievements')) {
        localStorage.setItem('userAchievements', '{}');
    }
    if (!localStorage.getItem('userName')) {
        const email = document.querySelector('#loginForm input[type="email"]')?.value || 'user';
        localStorage.setItem('userName', email.split('@')[0]);
    }
    
    // Инициализация системы уровней
    if (window.levelSystem) {
        window.levelSystem.init();
    }
    
    // Уведомление об успешном входе
    if (window.showNotification) {
        window.showNotification(getAuthTranslation('welcome'), 'success');
    }
    
    updateNavigation();
    closeLoginModal();
}

// Функция выхода
function logoutUser() {
    localStorage.setItem(AUTH_KEY, 'false');
    if (window.showNotification) {
        window.showNotification(getAuthTranslation('logout_success'), 'info');
    }
    updateNavigation();
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Обновленная функция добавления очков
function addPoints(action, description) {
    if (!window.levelSystem) {
        // Если система уровней не загружена, используем старую систему
        const pointValues = {
            'REPORT_ISSUE': 25,
            'VERIFY_ISSUE': 15,
            'RESOLVE_ISSUE': 25,
            'ATTEND_EVENT': 50,
            'COMMUNITY_HELP': 20,
            'VERIFY_ACTION': 30,
            'SHARE_ACHIEVEMENT': 10,
            'COMPLETE_CHALLENGE': 25,
            'PLANT_TREE': 100
        };

        const points = pointValues[action] || 10;
        let userPoints = parseInt(localStorage.getItem('userPoints') || '0');
        userPoints += points;
        localStorage.setItem('userPoints', userPoints.toString());
        
        // Логирование действия
        const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
        activities.unshift({
            action: action,
            description: description,
            points: points,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('userActivities', JSON.stringify(activities));
        
        updatePointsDisplay();
        if (window.showNotification) {
            window.showNotification(`+${points} points! ${description}`, 'success');
        }
        return points;
    }
    
    // Используем правильные значения очков для системы уровней
    const pointValues = {
        'REPORT_ISSUE': 25,
        'VERIFY_ISSUE': 15,
        'RESOLVE_ISSUE': 25,
        'ATTEND_EVENT': 50,
        'COMMUNITY_HELP': 20,
        'VERIFY_ACTION': 30,
        'SHARE_ACHIEVEMENT': 10,
        'COMPLETE_CHALLENGE': 25,
        'PLANT_TREE': 100,
        'SOCIAL_LOGIN': 50
    };

    const points = pointValues[action] || 10;
    return window.levelSystem.addPoints(points, action, description);
}

// Функции для социального входа
function signInWithGoogle() {
    if (window.showNotification) {
        window.showNotification(getAuthTranslation('google_login'), 'info');
    }
    
    setTimeout(() => {
        localStorage.setItem(AUTH_KEY, 'true');
        
        // Инициализация данных пользователя
        if (!localStorage.getItem('userPoints')) {
            localStorage.setItem('userPoints', '50'); // Бонус за социальный вход
        }
        if (!localStorage.getItem('userActivities')) {
            localStorage.setItem('userActivities', '[]');
        }
        if (!localStorage.getItem('userAchievements')) {
            localStorage.setItem('userAchievements', '{}');
        }
        if (!localStorage.getItem('userName')) {
            localStorage.setItem('userName', 'Google User');
        }
        
        // Инициализация системы уровней
        if (window.levelSystem) {
            window.levelSystem.init();
            window.levelSystem.addPoints(50, 'SOCIAL_LOGIN', getAuthTranslation('welcome_bonus'));
        }
        
        updateNavigation();
        closeLoginModal();
        
        if (window.showNotification) {
            window.showNotification(getAuthTranslation('login_success') + ' +50 ' + getAuthTranslation('welcome_bonus'), 'success');
        }
    }, 1500);
}

function signInWithFacebook() {
    if (window.showNotification) {
        window.showNotification(getAuthTranslation('facebook_login'), 'info');
    }
    
    setTimeout(() => {
        localStorage.setItem(AUTH_KEY, 'true');
        
        // Инициализация данных пользователя
        if (!localStorage.getItem('userPoints')) {
            localStorage.setItem('userPoints', '50'); // Бонус за социальный вход
        }
        if (!localStorage.getItem('userActivities')) {
            localStorage.setItem('userActivities', '[]');
        }
        if (!localStorage.getItem('userAchievements')) {
            localStorage.setItem('userAchievements', '{}');
        }
        if (!localStorage.getItem('userName')) {
            localStorage.setItem('userName', 'Facebook User');
        }
        
        // Инициализация системы уровней
        if (window.levelSystem) {
            window.levelSystem.init();
            window.levelSystem.addPoints(50, 'SOCIAL_LOGIN', getAuthTranslation('welcome_bonus'));
        }
        
        updateNavigation();
        closeLoginModal();
        
        if (window.showNotification) {
            window.showNotification(getAuthTranslation('login_success') + ' +50 ' + getAuthTranslation('welcome_bonus'), 'success');
        }
    }, 1500);
}

// Функция для обновления отображения очков
function updatePointsDisplay() {
    const pointsElements = document.querySelectorAll('#user-points span, #points-count');
    const userPoints = parseInt(localStorage.getItem('userPoints') || '0');
    
    pointsElements.forEach(element => {
        if (element.id === 'points-count' || element.parentElement.id === 'user-points') {
            element.textContent = userPoints;
        }
    });
}

// PWA функциональность
function initializePWA() {
    // Добавляем манифест
    const manifest = {
        "name": "EcoYard - Environmental Platform",
        "short_name": "EcoYard",
        "start_url": "/",
        "display": "standalone",
        "theme_color": "#16a34a",
        "background_color": "#ffffff",
        "icons": [
            {
                "src": "https://github.com/justsummon/ecomap/blob/main/EcoYardlogo.png?raw=true",
                "sizes": "192x192",
                "type": "image/png"
            }
        ]
    };

    const manifestElement = document.createElement('link');
    manifestElement.rel = 'manifest';
    manifestElement.href = 'data:application/manifest+json,' + encodeURIComponent(JSON.stringify(manifest));
    document.head.appendChild(manifestElement);

    // Регистрируем Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    }
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

    // Инициализация PWA
    initializePWA();

    // Проверяем авторизацию при загрузке
    checkAuthState();

    // Обновляем текст кнопок при загрузке
    updateAuthButtonText();
});

// Глобальные экспорты
window.levelSystem = levelSystem;
window.showNotification = showNotification;
window.addPoints = addPoints;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.signInWithGoogle = signInWithGoogle;
window.signInWithFacebook = signInWithFacebook;
window.updateAuthButtonText = updateAuthButtonText;
window.checkAuthState = checkAuthState;
window.updateNavigation = updateNavigation;
