class NotificationSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupServiceWorker();
        this.setupManifest();
    }

    // Показ всплывающих уведомлений
    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        } text-white max-w-sm`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${this.getIcon(type)} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, duration);
        
        // Клик для закрытия
        notification.addEventListener('click', () => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        });
    }

    getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // PWA Service Worker
    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker зарегистрирован');
            } catch (error) {
                console.log('Ошибка регистрации Service Worker:', error);
            }
        }
    }

    // PWA Manifest
    setupManifest() {
        const manifest = {
            "name": "EcoMap - Community Environmental Platform",
            "short_name": "EcoMap",
            "start_url": "/",
            "display": "standalone",
            "theme_color": "#16a34a",
            "background_color": "#ffffff",
            "icons": [
                {
                    "src": "/icons/icon-192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "/icons/icon-512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                }
            ]
        };

        const manifestElement = document.createElement('link');
        manifestElement.rel = 'manifest';
        manifestElement.href = 'data:application/manifest+json,' + encodeURIComponent(JSON.stringify(manifest));
        document.head.appendChild(manifestElement);
    }
}

window.notifications = new NotificationSystem();
