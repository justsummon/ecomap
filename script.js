// ===== ОСНОВНЫЕ ФУНКЦИИ КАРТЫ =====
function initMapWithEcoYardStyle() {
    if (!document.getElementById('map')) return;

    const map = L.map('map').setView([51.1605, 71.4704], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; EcoYard Community'
    }).addTo(map);

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

    // ===== СУЩЕСТВУЮЩИЕ МАРКЕРЫ =====
    const createEcoYardMarker = (color, emoji) => {
        return L.divIcon({
            html: `
                <div style="background-color: ${color};" class="eco-yard-marker rounded-full w-10 h-10 flex items-center justify-center text-white font-bold shadow-lg border-2 border-white">
                    ${emoji}
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
    };

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
            coords: [51.1550, 71.4500],
            type: 'cleanup',
            title: 'Successful River Restoration',
            description: 'This area was cleaned by 22 volunteers last month. See the amazing transformation!',
            beforeImage: 'https://images.unsplash.com/photo-1564053489984-317bbd824340?w=300&h=200&fit=crop',
            afterImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop',
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
        const marker = L.marker(location.coords, {
            icon: createEcoYardMarker(
                location.type === 'trash' ? '#DC143C' : 
                location.type === 'cleanup' ? '#3CB371' : '#2E8B57',
                location.type === 'trash' ? '🗑️' : 
                location.type === 'cleanup' ? '✨' : '🌳'
            )
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
    });

    // Добавление стандартных маркеров
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

function initSliders() {
    document.querySelectorAll('.slider').forEach(slider => {
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

// ===== СТАНДАРТНЫЕ МАРКЕРЫ =====
function addStandardMarkers(map) {
    // Создание кастомных иконок
    const trashIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const cleanedIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const plantingIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const eventIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Данные маркеров
    const trashSpots = [
        { lat: 51.1475, lng: 71.4225, title: "Park Trash Accumulation", description: "Plastic bottles and food wrappers", severity: "Medium" },
        { lat: 51.1520, lng: 71.4380, title: "Alleyway Dumping", description: "Furniture and household waste", severity: "High" },
        { lat: 51.1650, lng: 71.4450, title: "Riverbank Pollution", description: "Plastic bags and containers", severity: "High" },
        { lat: 51.1800, lng: 71.4300, title: "Street Litter", description: "Cigarette butts and small trash", severity: "Low" }
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

    // Добавление маркеров
    trashSpots.forEach(spot => {
        L.marker([spot.lat, spot.lng], { icon: trashIcon })
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
        let beforePhoto = "https://via.placeholder.com/250x150/ff0000/ffffff?text=Before";
        let afterPhoto = "https://via.placeholder.com/250x150/00ff00/ffffff?text=After";

        L.marker([area.lat, area.lng], { icon: cleanedIcon })
            .addTo(map)
            .bindPopup(`
                <div class="p-2">
                    <b>${area.title}</b><br>
                    ${area.description}<br>
                    Volunteers: ${area.volunteers}<br>
                    <span class="text-green-600">Area Cleaned</span><br>
                    
                    <div class="before-after-container">
                        <div class="before-image">
                            <img src="${beforePhoto}" alt="Before cleanup"/>
                        </div>
                        <div class="after-image">
                            <img src="${afterPhoto}" alt="After cleanup"/>
                        </div>
                        <input type="range" min="0" max="100" value="50" class="slider" />
                    </div>
                    <div class="mt-2 text-xs text-gray-500">
                        Drag slider to see before/after comparison
                    </div>
                </div>
            `);
    });

    plantingZones.forEach(zone => {
        L.marker([zone.lat, zone.lng], { icon: plantingIcon })
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
        L.marker([event.lat, event.lng], { icon: eventIcon })
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