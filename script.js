// ===== ОСНОВНЫЕ ФУНКЦИИ КАРТЫ =====
function createCustomIcon(type, severity = 'medium') {
    const severityColors = {
        'low': '#10B981',
        'medium': '#F59E0B', 
        'high': '#F97316',
        'critical': '#EF4444'
    };
    
    const color = severityColors[severity] || '#EF4444';
    const size = [32, 32];
    
    // Новые иконки для 'trash', 'cleanup', 'planting'
    const icons = {
        'trash': L.divIcon({
            html: `<div style="background-color: ${color};" class="rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg border-2 border-white">
                <i class="fas fa-trash text-sm"></i>
            </div>`,
            iconSize: size,
            className: 'custom-marker'
        }),
        'cleanup': L.divIcon({
            html: `<div style="background-color: #10B981;" class="rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg border-2 border-white">
                <i class="fas fa-check text-sm"></i>
            </div>`,
            iconSize: size,
            className: 'custom-marker'
        }),
        'planting': L.divIcon({
            html: `<div style="background-color: #22C55E;" class="rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg border-2 border-white">
                <i class="fas fa-seedling text-sm"></i>
            </div>`,
            iconSize: size,
            className: 'custom-marker'
        }),
        'event': L.divIcon({
            html: `<div style="background-color: #8B5CF6;" class="rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg border-2 border-white">
                <i class="fas fa-calendar text-sm"></i>
            </div>`,
            iconSize: size,
            className: 'custom-marker'
        }),
        'pollution': L.divIcon({
            html: `<div style="background-color: ${color};" class="rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg border-2 border-white">
                <i class="fas fa-smog text-sm"></i>
            </div>`,
            iconSize: size,
            className: 'custom-marker'
        }),
        'damage': L.divIcon({
            html: `<div style="background-color: ${color};" class="rounded-full w-8 h-8 flex items-center justify-center text-white shadow-lg border-2 border-white">
                <i class="fas fa-tree text-sm"></i>
            </div>`,
            iconSize: size,
            className: 'custom-marker'
        })
    };
    
    return icons[type] || icons['trash'];
}

function initMapWithEcoYardStyle() {
    if (!document.getElementById('map')) return;

    // Убедитесь, что карта имеет правильные размеры
    const mapContainer = document.getElementById('map');
    mapContainer.style.height = '500px';
    mapContainer.style.width = '100%';
    
    const map = L.map('map').setView([51.1605, 71.4704], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; EcoMap Community'
    }).addTo(map);

    // Принудительно обновляем размер карты после загрузки
    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    // Добавляем обработчик для ресайза окна
    window.addEventListener('resize', function() {
        setTimeout(() => {
            map.invalidateSize();
        }, 100);
    });

    // ===== СИСТЕМА ОТЧЕТОВ О ПРОБЛЕМАХ =====
    function initReportSystem() {
        // Кнопка для сообщения о проблеме
        const reportButton = L.control({position: 'topright'});
        reportButton.onAdd = function(map) {
            const div = L.DomUtil.create('div', 'report-button-container');
            div.innerHTML = `
                <button class="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-200 flex items-center"
                        onclick="window.location.href='report-issue.html'">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    Report Issue
                </button>
            `;
            return div;
        };
        reportButton.addTo(map);

        // Загрузка и отображение существующих отчетов
        loadAndDisplayReports(map);
    }

    // Загрузка и отображение отчетов
    function loadAndDisplayReports(map) {
        const reports = JSON.parse(localStorage.getItem('ecoMapReports') || '[]');
        
        reports.forEach((report, index) => {
            if (report.location && report.status !== 'resolved') {
                const icon = getReportIcon(report.type, report.severity);
                const marker = L.marker([report.location.lat, report.location.lng], {icon: icon})
                    .addTo(map)
                    .bindPopup(createReportPopup(report, index));
                    
                // Добавляем обработчик для слайдеров в отчетах
                marker.on('popupopen', function() {
                    initPopupSliders(this.getPopup());
                });
            }
        });
    }

    // Получение иконки для типа отчета
    function getReportIcon(type, severity) {
        const size = [30, 30];
        const severityColors = {
            'low': '#10B981',
            'medium': '#F59E0B', 
            'high': '#F97316',
            'critical': '#EF4444'
        };
        
        const color = severityColors[severity] || '#EF4444';
        
        const icons = {
            'trash': L.divIcon({
                html: `<div style="background-color: ${color};" class="rounded-full w-8 h-8 flex items-center justify-center text-white">
                    <i class="fas fa-trash"></i>
                </div>`,
                iconSize: size,
                className: 'report-marker'
            }),
            'pollution': L.divIcon({
                html: `<div style="background-color: ${color};" class="rounded-full w-8 h-8 flex items-center justify-center text-white">
                    <i class="fas fa-smog"></i>
                </div>`,
                iconSize: size,
                className: 'report-marker'
            }),
            'damage': L.divIcon({
                html: `<div style="background-color: ${color};" class="rounded-full w-8 h-8 flex items-center justify-center text-white">
                    <i class="fas fa-tree"></i>
                </div>`,
                iconSize: size,
                className: 'report-marker'
            }),
            'other': L.divIcon({
                html: `<div style="background-color: ${color};" class="rounded-full w-8 h-8 flex items-center justify-center text-white">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>`,
                iconSize: size,
                className: 'report-marker'
            })
        };
        
        return icons[type] || icons['other'];
    }

    // Создание попапа для отчета
    function createReportPopup(report, index) {
        const statusBadge = report.status === 'verified' ? 
            '<span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Verified</span>' :
            '<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Pending</span>';
        
        const severityColors = {
            'low': 'green-500',
            'medium': 'yellow-500',
            'high': 'orange-500',
            'critical': 'red-500'
        };
        
        const colorClass = severityColors[report.severity] || 'red-500';
        
        return `
            <div class="report-popup p-3 max-w-xs">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-gray-800">${report.title}</h4>
                    ${statusBadge}
                </div>
                
                <div class="flex items-center mb-2">
                    <span class="inline-block w-3 h-3 rounded-full bg-${colorClass} mr-2"></span>
                    <span class="text-sm text-gray-600 capitalize">${report.severity} severity</span>
                </div>
                
                <p class="text-sm text-gray-600 mb-3">${report.description}</p>
                
                <div class="text-xs text-gray-500 mb-3">
                    Reported: ${new Date(report.timestamp).toLocaleDateString()}
                </div>
                
                <div class="flex space-x-2">
                    <button class="flex-1 bg-green-600 text-white py-1 px-2 rounded text-sm hover:bg-green-700 transition"
                            onclick="verifyReport(${index})">
                        <i class="fas fa-check mr-1"></i> Verify
                    </button>
                    <button class="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-sm hover:bg-blue-700 transition"
                            onclick="resolveReport(${index})">
                        <i class="fas fa-flag mr-1"></i> Resolve
                    </button>
                </div>
            </div>
        `;
    }

    // Инициализация системы отчетов
    initReportSystem();

    // ===== СУЩЕСТВУЮЩИЕ МАРКЕРЫ (УДАЛЕНИЕ createEcoYardMarker) =====
    // УДАЛЕНА: const createEcoYardMarker = (color, emoji) => { ... };

    const locations = [
        {
            coords: [51.1475, 71.4225],
            type: 'trash',
            title: 'Park Cleanup Opportunity',
            description: 'Help clean this beautiful park from plastic waste. Every bottle collected makes a difference!',
            image: 'https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=300&h=200&fit=crop',
            points: 50
        },
        {
            coords: [51.1286, 71.4307], // Координаты стадиона им. Мунайтпасова на Кенесары
            type: 'cleanup',
            title: 'Стадион им. Мунайтпасова',
            description: 'This stadium area was transformed by 22 volunteers last month. See the amazing cleanup results!',
            beforeImage: 'https://github.com/justsummon/ecomap/blob/main/images/photo_stadium_before.jpg?raw=true',
            afterImage: 'https://github.com/justsummon/ecomap/blob/main/images/photo_stadium_after.jpg?raw=true',
            points: 75
        },
        {
            coords: [51.1700, 71.4250],
            type: 'planting',
            title: 'Tree Planting Zone',
            description: 'Perfect spot for oak trees. Join us this weekend to plant the future!',
            image: 'https://images.unsplash.com/photo-1574263867128-39eaed201e1c?w=300&h=200&fit=crop',
            points: 100
        }
    ];

    locations.forEach(location => {
        // ИЗМЕНЕНИЕ: Используем createCustomIcon вместо createEcoYardMarker
        const icon = createCustomIcon(location.type, 'high'); // Используем 'high' для примера
        
        const marker = L.marker(location.coords, {
            icon: icon
        }).addTo(map);

        let popupContent = `
            <h3 class="font-bold text-lg mb-2">${location.title}</h3>
            <p class="text-gray-600 mb-3">${location.description}</p>
        `;

        if (location.type === 'cleanup') {
            popupContent += `
                <div class="before-after-container mb-3">
                    <img src="${location.beforeImage}" alt="Before" class="before-image">
                    <img src="${location.afterImage}" alt="After" class="after-image">
                    <input type="range" min="0" max="100" value="50" class="slider">
                </div>
            `;
        } else {
            popupContent += `<img src="${location.image}" alt="${location.title}" class="w-full h-32 object-cover rounded mb-3">`;
        }

        popupContent += `
            <button onclick="handleLocationAction('${location.type}', ${location.points}, '${location.title}')" 
                    class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200">
                <i class="fas fa-seedling mr-2"></i>
                Earn ${location.points} Points
            </button>
        `;

        marker.bindPopup(createBeautifulPopup(popupContent, location.type));

        // Добавляем обработчик для слайдеров
        marker.on('popupopen', function() {
            initPopupSliders(this.getPopup());
        });
    });

    // Добавление стандартных маркеров с кастомными иконками
    addStandardMarkers(map);
    
    // Инициализация слайдеров
    initSliders();
}

// ===== ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ ОТЧЕТАМИ =====
window.verifyReport = function(index) {
    if (!localStorage.getItem('isLoggedIn') || localStorage.getItem('isLoggedIn') !== 'true') {
        alert('Please log in to verify reports');
        return;
    }

    const reports = JSON.parse(localStorage.getItem('ecoMapReports') || '[]');
    if (reports[index]) {
        reports[index].status = 'verified';
        reports[index].verifiedBy = localStorage.getItem('userName') || 'Anonymous';
        reports[index].verifiedAt = new Date().toISOString();
        localStorage.setItem('ecoMapReports', JSON.stringify(reports));
        
        // Награда за верификацию
        addPoints('VERIFY_ISSUE', `Verified report: ${reports[index].title}`);
        
        alert('Report verified successfully! +15 points awarded');
        window.location.reload();
    }
}

window.resolveReport = function(index) {
    if (!localStorage.getItem('isLoggedIn') || localStorage.getItem('isLoggedIn') !== 'true') {
        alert('Please log in to resolve reports');
        return;
    }

    const reports = JSON.parse(localStorage.getItem('ecoMapReports') || '[]');
    if (reports[index]) {
        reports[index].status = 'resolved';
        reports[index].resolvedBy = localStorage.getItem('userName') || 'Anonymous';
        reports[index].resolvedAt = new Date().toISOString();
        localStorage.setItem('ecoMapReports', JSON.stringify(reports));
        
        // Награда за решение проблемы
        addPoints('RESOLVE_ISSUE', `Resolved report: ${reports[index].title}`);
        
        alert('Report marked as resolved! +25 points awarded');
        window.location.reload();
    }
}

// ===== СИСТЕМА БАЛЛОВ =====
function addPoints(action, description) {
    const pointValues = {
        'REPORT_ISSUE': 25,
        'VERIFY_ISSUE': 15,
        'RESOLVE_ISSUE': 25,
        'ATTEND_EVENT': 50,
        'COMMUNITY_HELP': 20,
        'VERIFY_ACTION': 30,
        'SHARE_ACHIEVEMENT': 10
    };

    const points = pointValues[action] || 10;
    
    // Обновление очков пользователя
    let userPoints = parseInt(localStorage.getItem('userPoints') || '0');
    userPoints += points;
    localStorage.setItem('userPoints', userPoints.toString());
    
    // Обновление отображения очков
    updatePointsDisplay();
    
    // Логирование действия
    const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
    activities.unshift({
        action: action,
        description: description,
        points: points,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('userActivities', JSON.stringify(activities));
    
    console.log(`+${points} points for: ${description}`);
}

function updatePointsDisplay() {
    const pointsElements = document.querySelectorAll('#user-points span, #points-count');
    const userPoints = parseInt(localStorage.getItem('userPoints') || '0');
    
    pointsElements.forEach(element => {
        element.textContent = userPoints;
    });
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function createBeautifulPopup(content, type) {
    const colors = {
        'trash': 'red',
        'cleanup': 'green',
        'planting': 'green'
    };
    
    const color = colors[type] || 'green';
    
    return `
        <div class="eco-popup bg-white rounded-lg shadow-xl p-4 max-w-sm">
            <div class="border-l-4 border-${color}-500 pl-3">
                ${content}
            </div>
        </div>
    `;
}

// ===== ФУНКЦИЯ ДЛЯ ИНИЦИАЛИЗАЦИИ СЛАЙДЕРОВ В ПОПАПАХ =====
function initPopupSliders(popup) {
    // Ждем пока попап полностью откроется
    setTimeout(() => {
        const sliders = popup.getElement().querySelectorAll('.slider');
        sliders.forEach(slider => {
            // Устанавливаем начальное значение
            const afterImage = slider.parentElement.querySelector('.after-image');
            if (afterImage) {
                afterImage.style.clipPath = `inset(0 0 0 ${slider.value}%)`;
            }
            
            // Добавляем обработчик события
            slider.addEventListener('input', function() {
                const container = this.parentElement;
                const afterImage = container.querySelector('.after-image');
                if (afterImage) {
                    afterImage.style.clipPath = `inset(0 0 0 ${this.value}%)`;
                }
            });
        });
    }, 100);
}

function initSliders() {
    document.querySelectorAll('.slider').forEach(slider => {
        // Устанавливаем начальное значение
        const afterImage = slider.parentElement.querySelector('.after-image');
        if (afterImage) {
            afterImage.style.clipPath = `inset(0 0 0 ${slider.value}%)`;
        }
        
        // Добавляем обработчик события
        slider.addEventListener('input', function() {
            const container = this.parentElement;
            const afterImage = container.querySelector('.after-image');
            if (afterImage) {
                afterImage.style.clipPath = `inset(0 0 0 ${this.value}%)`;
            }
        });
    });
}

// ===== ОБРАБОТЧИК ДЕЙСТВИЙ ДЛЯ МАРКЕРОВ =====
window.handleLocationAction = function(locationType, points, description) {
    if (!localStorage.getItem('isLoggedIn') || localStorage.getItem('isLoggedIn') !== 'true') {
        alert('Please log in to earn points!');
        return;
    }

    const actionMap = {
        'trash': 'COMMUNITY_HELP',
        'cleanup': 'VERIFY_ACTION',
        'planting': 'ATTEND_EVENT'
    };

    addPoints(actionMap[locationType] || 'COMMUNITY_HELP', description);
    alert(`+${points} points for: ${description}`);
};

// ===== СТАНДАРТНЫЕ МАРКЕРЫ С КАСТОМНЫМИ ИКОНКАМИ =====
function addStandardMarkers(map) {
    // Данные маркеров
    const trashSpots = [
        { lat: 51.1475, lng: 71.4225, title: "Park Trash Accumulation", description: "Plastic bottles and food wrappers", severity: "medium" },
        { lat: 51.1520, lng: 71.4380, title: "Alleyway Dumping", description: "Furniture and household waste", severity: "high" },
        { lat: 51.1650, lng: 71.4450, title: "Riverbank Pollution", description: "Plastic bags and containers", severity: "high" },
        { lat: 51.1800, lng: 71.4300, title: "Street Litter", description: "Cigarette butts and small trash", severity: "low" }
    ];

    const cleanedAreas = [
        { lat: 51.1400, lng: 71.4100, title: "Central Park Cleanup", description: "Completed June 5, 2025", volunteers: 15 },
        { lat: 51.1550, lng: 71.4500, title: "Esil River Cleanup", description: "Completed May 28, 2025", volunteers: 22 }
    ];

    const plantingZones = [
        { lat: 51.1700, lng: 71.4250, title: "Future Tree Planting", description: "50 native trees planned", date: "June 22, 2025" },
        { lat: 51.1600, lng: 71.4400, title: "Community Garden", description: "Vegetables and flowers", date: "Ongoing" }
    ];

    const events = [
        { lat: 51.1500, lng: 71.4350, title: "Park Cleanup Event", description: "June 15, 9AM-12PM", participants: 23 },
        { lat: 51.1750, lng: 71.4550, title: "Eco Workshop", description: "June 30, 6PM-8PM", participants: 18 }
    ];

    // Добавление маркеров с кастомными иконками
    trashSpots.forEach(spot => {
        L.marker([spot.lat, spot.lng], { 
            icon: createCustomIcon('trash', spot.severity.toLowerCase())
        })
            .addTo(map)
            .bindPopup(`
                <div class="p-2">
                    <b>${spot.title}</b><br>
                    ${spot.description}<br>
                    <span class="text-red-600">Severity: ${spot.severity}</span>
                </div>
            `);
    });

    cleanedAreas.forEach(area => {
        L.marker([area.lat, area.lng], { 
            icon: createCustomIcon('cleanup')
        })
            .addTo(map)
            .bindPopup(`
                <div class="p-2">
                    <b>${area.title}</b><br>
                    ${area.description}<br>
                    Volunteers: ${area.volunteers}<br>
                    <span class="text-green-600">Area Cleaned</span>
                </div>
            `);
    });

    plantingZones.forEach(zone => {
        L.marker([zone.lat, zone.lng], { 
            icon: createCustomIcon('planting')
        })
            .addTo(map)
            .bindPopup(`
                <div class="p-2">
                    <b>${zone.title}</b><br>
                    ${zone.description}<br>
                    Date: ${zone.date}<br>
                    <button class="mt-2 bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700 transition">Join Planting</button>
                </div>
            `);
    });

    events.forEach(event => {
        L.marker([event.lat, event.lng], { 
            icon: createCustomIcon('event')
        })
            .addTo(map)
            .bindPopup(`
                <div class="p-2">
                    <b>${event.title}</b><br>
                    ${event.description}<br>
                    Participants: ${event.participants}<br>
                    <button class="mt-2 bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700 transition">RSVP</button>
                </div>
            `);
    });

    // Добавление кругов
    L.circle([51.1900, 71.4000], {
        color: 'orange',
        fillColor: 'yellow',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map).bindPopup("<b>Industrial Zone</b><br>Area with air quality concerns");

    L.circle([51.1450, 71.4150], {
        color: 'blue',
        fillColor: 'cyan',
        fillOpacity: 0.5,
        radius: 300
    }).addTo(map).bindPopup("<b>Improved Zone</b><br>Former polluted area now restored by volunteers");
}

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =====
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация карты
    if (document.getElementById('map')) {
        initMapWithEcoYardStyle();
    }
    
    // Обновление отображения очков
    updatePointsDisplay();
    
    // Инициализация системы аутентификации
    if (typeof checkAuthState === 'function') {
        checkAuthState();
    }
    
    // Инициализация кнопки "Наверх"
    initBackToTop();
    
    // Инициализация мобильного меню
    initMobileMenu();
});

// ===== КНОПКА "НАВЕРХ" =====
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('hidden');
            } else {
                backToTopButton.classList.add('hidden');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ===== МОБИЛЬНОЕ МЕНЮ =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('hidden');
            navMenu.classList.toggle('flex');
        });
    }
}

// ===== ПРОВЕРКА АУТЕНТИФИКАЦИИ =====
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Если не на странице профиля и не на главной, проверяем авторизацию
    const currentPage = window.location.pathname.split('/').pop();
    if (!['profile.html', 'index.html', 'login.html', ''].includes(currentPage)) {
        if (!isLoggedIn) {
            window.location.href = 'login.html';
        }
    }
});

// ===== ОБРАБОТКА ОШИБОК КАРТЫ =====
function handleMapErrors() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Проверяем, загрузилась ли карта
        setTimeout(() => {
            if (mapElement.querySelector('.leaflet-container') === null) {
                console.error('Карта не загрузилась');
                // Можно показать сообщение об ошибке
            }
        }, 2000);
    }
}

// Вызовите эту функцию после инициализации карты
document.addEventListener('DOMContentLoaded', function() {
    handleMapErrors();
});