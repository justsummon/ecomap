document.addEventListener('DOMContentLoaded', function () {
    // ===== LANGUAGE FUNCTIONALITY =====
    const languageToggle = document.getElementById('language-toggle');
    const languageDropdown = document.getElementById('language-dropdown');
    const currentLanguageElement = document.getElementById('current-language');
    
    // Language translations
    const translations = {
        en: {
            // Header
            'home': 'Home',
            'rewards': 'Rewards',
            'knowledge': 'Eco-Knowledge',
            'community': 'Community',
            'signin': 'Sign In',
            'myprofile': 'My Profile',
            
            // Hero section
            'join-revolution': 'Join the Green Revolution',
            'hero-text': 'Track environmental issues, participate in cleanups, earn rewards, and make your community cleaner and greener!',
            'explore-map': 'Explore Map',
            'report-issue': 'Report Issue',
            
            // Map section
            'interactive-map': 'Interactive Eco Map',
            'map-filters': 'Map Filters',
            'trash-spots': 'Trash Spots',
            'cleaned-areas': 'Cleaned Areas',
            'planting-zones': 'Planting Zones',
            'polluted-zones': 'Polluted Zones',
            'upcoming-events': 'Upcoming Events',
            'report-an-issue': 'Report an Issue',
            'select-issue-type': 'Select issue type',
            'trash-accumulation': 'Trash accumulation',
            'illegal-dumping': 'Illegal dumping',
            'polluted-water': 'Polluted water',
            'other': 'Other',
            'add-description': 'Add description...',
            'submit-report': 'Submit Report',
            
            // Footer
            'footer-tagline': 'Connecting communities for a cleaner, greener planet.',
            'quick-links': 'Quick Links',
            'about-us': 'About Us',
            'how-it-works': 'How It Works',
            'success-stories': 'Success Stories',
            'get-involved': 'Get Involved',
            'resources': 'Resources',
            'eco-tips': 'Eco Tips',
            'recycling-guide': 'Recycling Guide',
            'volunteer-handbook': 'Volunteer Handbook',
            'partner-with-us': 'Partner With Us',
            'connect': 'Connect',
            'subscribe-newsletter': 'Subscribe to our newsletter',
            'your-email': 'Your email',
            'privacy-policy': 'Privacy Policy',
            'terms-of-service': 'Terms of Service',

            // Knowledge page
            'knowledge-hub': 'Eco Knowledge Hub',
            'todays-challenge': 'Today\'s Eco Challenge',
            'energy-saving': 'Energy Saving',
            'water-conservation': 'Water Conservation',
            'recycling-facts': 'Recycling Facts',
            'learn-more': 'Learn more →',
            'quick-eco-lessons': 'Quick Eco Lessons',
            'test-knowledge': 'Test Your Eco Knowledge',
            'mark-complete': 'Mark as Complete',
            'submit-answer': 'Submit Answer',

            // Community page
            'community-title': 'Eco Community',
            'eco-heroes': 'This Month\'s Eco Heroes',
            'top-contributor': 'Top Contributor',
            'eco-educator': 'Eco Educator',
            'waste-warrior': 'Waste Warrior',
            'rsvp': 'RSVP',
            'attending': 'attending',
            'our-partners': 'Our Partners',

            // Rewards page
            'rewards-title': 'Earn Rewards for Green Actions',
            'cleanup-participation': 'Cleanup Participation',
            'tree-planting': 'Tree Planting',
            'eco-challenges': 'Eco Challenges',
            'your-progress': 'Your Progress',
            'redeem-points': 'Redeem Points with Our Partners',
            'points-to-next': 'points to next reward',
            'unlock-reward': 'Earn 500 points to unlock your first reward!'
        },
        ru: {
            // Header
            'home': 'Главная',
            'rewards': 'Награды',
            'knowledge': 'Эко-Знания',
            'community': 'Сообщество',
            'signin': 'Войти',
            'myprofile': 'Мой профиль',
            
            // Hero section
            'join-revolution': 'Присоединяйтесь к Зеленой Революции',
            'hero-text': 'Отслеживайте экологические проблемы, участвуйте в уборках, зарабатывайте награды и делайте свое сообщество чище и зеленее!',
            'explore-map': 'Исследовать карту',
            'report-issue': 'Сообщить о проблеме',
            
            // Map section
            'interactive-map': 'Интерактивная Эко Карта',
            'map-filters': 'Фильтры карта',
            'trash-spots': 'Мусорные точки',
            'cleaned-areas': 'Очищенные зоны',
            'planting-zones': 'Зоны посадки',
            'polluted-zones': 'Загрязненные зоны',
            'upcoming-events': 'Предстоящие события',
            'report-an-issue': 'Сообщить о проблеме',
            'select-issue-type': 'Выберите тип проблемы',
            'trash-accumulation': 'Скопление мусора',
            'illegal-dumping': 'Незаконный сброс',
            'polluted-water': 'Загрязненная вода',
            'other': 'Другое',
            'add-description': 'Добавить описание...',
            'submit-report': 'Отправить отчет',
            
            // Footer
            'footer-tagline': 'Объединяем сообщества для более чистого и зеленого мира.',
            'quick-links': 'Быстрые ссылки',
            'about-us': 'О нас',
            'how-it-works': 'Как это работает',
            'success-stories': 'Истории успеха',
            'get-involved': 'Принять участие',
            'resources': 'Ресурсы',
            'eco-tips': 'Эко-советы',
            'recycling-guide': 'Руководство по переработке',
            'volunteer-handbook': 'Руководство волонтера',
            'partner-with-us': 'Стать партнером',
            'connect': 'Связь',
            'subscribe-newsletter': 'Подпишитесь на рассылку',
            'your-email': 'Ваш email',
            'privacy-policy': 'Политика конфиденциальности',
            'terms-of-service': 'Условия использования',

            // Knowledge page
            'knowledge-hub': 'Центр Эко Знаний',
            'todays-challenge': 'Сегодняшний Эко Вызов',
            'energy-saving': 'Экономия энергии',
            'water-conservation': 'Сохранение воды',
            'recycling-facts': 'Факты о переработке',
            'learn-more': 'Узнать больше →',
            'quick-eco-lessons': 'Быстрые уроки экологии',
            'test-knowledge': 'Проверьте свои экознания',
            'mark-complete': 'Отметить как выполненное',
            'submit-answer': 'Отправить ответ',

            // Community page
            'community-title': 'Эко Сообщество',
            'eco-heroes': 'Эко Герои месяца',
            'top-contributor': 'Лучший участник',
            'eco-educator': 'Эко педагог',
            'waste-warrior': 'Борец с отходами',
            'rsvp': 'Подтвердить участие',
            'attending': 'участников',
            'our-partners': 'Наши партнеры',

            // Rewards page
            'rewards-title': 'Зарабатывайте награды за экодействия',
            'cleanup-participation': 'Участие в уборках',
            'tree-planting': 'Посадка деревьев',
            'eco-challenges': 'Эко испытания',
            'your-progress': 'Ваш прогресс',
            'redeem-points': 'Обменивайте баллы у партнеров',
            'points-to-next': 'баллов до следующей награды',
            'unlock-reward': 'Заработайте 500 баллов чтобы открыть первую награду!'
        },
        kz: {
            // Header
            'home': 'Басты',
            'rewards': 'Марапаттар',
            'knowledge': 'Эко-Білім',
            'community': 'Қоғамдастық',
            'signin': 'Кіру',
            'myprofile': 'Менің профилім',
            
            // Hero section
            'join-revolution': 'Жасыл Төңкеріске Қосылыңыз',
            'hero-text': 'Экологиялық мәселелерді бақылаңыз, тазалау жұмыстарына қатысыңыз, сыйлықтар жинаңыз және қоғамдастығыңызды тазартыңыз және жасылдандырыңыз!',
            'explore-map': 'Картаны зерттеу',
            'report-issue': 'Мәселе туралы хабарлау',
            
            // Map section
            'interactive-map': 'Интерактивті Эко Карта',
            'map-filters': 'Карта сүзгілері',
            'trash-spots': 'Қоқыс нүктелері',
            'cleaned-areas': 'Тазартылған аймақтар',
            'planting-zones': 'Отырғызу аймақтары',
            'polluted-zones': 'Ласанды аймақтар',
            'upcoming-events': 'Алдағы оқиғалар',
            'report-an-issue': 'Мәселе туралы хабарлау',
            'select-issue-type': 'Мәселе түрін таңдаңыз',
            'trash-accumulation': 'Қоқыс жиналуы',
            'illegal-dumping': 'Заңсыз құю',
            'polluted-water': 'Ласанды су',
            'other': 'Басқа',
            'add-description': 'Сипаттама қосу...',
            'submit-report': 'Есепті жіберу',
            
            // Footer
            'footer-tagline': 'Тазар әрі жасыл әлем үшін қоғамдастықтарды біріктіреміз.',
            'quick-links': 'Жыллам сілтемелер',
            'about-us': 'Біз туралы',
            'how-it-works': 'Қалай жұмыс істейді',
            'success-stories': 'Табыс жағдайлары',
            'get-involved': 'Қатысу',
            'resources': 'Ресурстар',
            'eco-tips': 'Эко-кеңестер',
            'recycling-guide': 'Қайта өңдеу бойынша нұсқаулық',
            'volunteer-handbook': 'Еріктілер нұсқаулығы',
            'partner-with-us': 'Серіктес болу',
            'connect': 'Байланыс',
            'subscribe-newsletter': 'Жаңалықтарға жазылыңыз',
            'your-email': 'Сіздің email',
            'privacy-policy': 'Құпиялылық саясаты',
            'terms-of-service': 'Қызмет көрсету шарттары',

            // Knowledge page
            'knowledge-hub': 'Эко Білім Орталығы',
            'todays-challenge': 'Бүгінгі Эко Қиындық',
            'energy-saving': 'Энергия үнемдеу',
            'water-conservation': 'Су үнемдеу',
            'recycling-facts': 'Қайта өңдеу туралы фактілер',
            'learn-more': 'Көбірек білу →',
            'quick-eco-lessons': 'Жыллам эко сабақтар',
            'test-knowledge': 'Эко біліміңізді тексеріңіз',
            'mark-complete': 'Аяқталған деп белгілеу',
            'submit-answer': 'Жауапты жіберу',

            // Community page
            'community-title': 'Эко Қоғамдастық',
            'eco-heroes': 'Айдың Эко Батырлары',
            'top-contributor': 'Жетекші үлес қосушы',
            'eco-educator': 'Эко білімберуші',
            'waste-warrior': 'Қоқыспен күрескер',
            'rsvp': 'Қатысуын растау',
            'attending': 'қатысушы',
            'our-partners': 'Біздің серіктестер',

            // Rewards page
            'rewards-title': 'Жасыл әрекеттер үшін сыйлықтар жинаңыз',
            'cleanup-participation': 'Тазалауға қатысу',
            'tree-planting': 'Ағаш отырғызу',
            'eco-challenges': 'Эко сынақтар',
            'your-progress': 'Сіздің прогрессіңіз',
            'redeem-points': 'Серіктестерімізден ұпайларды айырбастаңыз',
            'points-to-next': 'келесі сыйлыққа дейін ұпай',
            'unlock-reward': 'Алғашқы сыйлықты ашу үшін 500 ұпай жинаңыз!'
        }
    };

    function changeLanguage(lang) {
        // Update all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        
        // Update placeholder texts
        document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
            const key = element.getAttribute('data-translate-placeholder');
            if (translations[lang] && translations[lang][key]) {
                element.setAttribute('placeholder', translations[lang][key]);
            }
        });
        
        // Update button texts
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            if (loginBtn.textContent.includes('Sign In') || loginBtn.textContent.includes('Войти') || loginBtn.textContent.includes('Кіру')) {
                loginBtn.textContent = translations[lang]['signin'];
            } else if (loginBtn.textContent.includes('My Profile') || loginBtn.textContent.includes('Мой профиль') || loginBtn.textContent.includes('Менің профилім')) {
                loginBtn.textContent = translations[lang]['myprofile'];
            }
        }
        
        // Save language preference
        localStorage.setItem('ecoLanguage', lang);
        
        // Update current language indicator
        if (currentLanguageElement) {
            currentLanguageElement.textContent = lang.toUpperCase();
        }
    }

    // Initialize language functionality
    if (languageToggle && languageDropdown) {
        languageToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('hidden');
        });

        document.querySelectorAll('#language-dropdown button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = button.getAttribute('data-lang');
                changeLanguage(lang);
                languageDropdown.classList.add('hidden');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (languageDropdown && !languageDropdown.contains(e.target) && languageToggle && !languageToggle.contains(e.target)) {
                languageDropdown.classList.add('hidden');
            }
        });
    }

    // Load saved language preference
    const savedLanguage = localStorage.getItem('ecoLanguage') || 'en';
    if (currentLanguageElement) {
        currentLanguageElement.textContent = savedLanguage.toUpperCase();
    }
    changeLanguage(savedLanguage);

    // ===== EXISTING FUNCTIONALITY =====
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
        });
    }

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.remove('hidden');
            } else {
                backToTop.classList.add('hidden');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Check for saved user data
    const userPointsElement = document.querySelector('#user-points span');
    if (userPointsElement) {
        const userPoints = localStorage.getItem('ecoUserPoints') || 0;
        userPointsElement.textContent = userPoints;
    }

    // Update progress bar if on rewards page
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const userPoints = parseInt(localStorage.getItem('ecoUserPoints') || 0);
        const progressPercentage = Math.min((userPoints / 500) * 100, 100);
        progressBar.style.width = `${progressPercentage}%`;
    }

    // Login button functionality
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function () {
            const newPoints = 100; // Starting bonus
            localStorage.setItem('ecoUserPoints', newPoints);
            
            if (userPointsElement) {
                userPointsElement.textContent = newPoints;
            }
            
            // Get current language for translation
            const currentLang = localStorage.getItem('ecoLanguage') || 'en';
            this.textContent = translations[currentLang]['myprofile'] || 'My Profile';

            if (progressBar) {
                const newProgress = Math.min((newPoints / 500) * 100, 100);
                progressBar.style.width = `${newProgress}%`;
            }
        });
    }

    // Map initialization if on index page
    if (document.getElementById('map')) {
        const map = L.map('map').setView([51.1605, 71.4704], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create custom icons
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

        // Add markers data
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

        // Add markers to map - UPDATED CODE WITH LOGOS
        trashSpots.forEach(spot => {
            L.marker([spot.lat, spot.lng], { icon: trashIcon })
            .addTo(map)
            .bindPopup(`
                <img src="logos/trash-logo.png" class="popup-logo" style="width: 50px; height: 50px;">
                <div class="ml-0">
                    <b>${spot.title}</b><br>
                    ${spot.description}<br>
                    <span class="text-red-600">Severity: ${spot.severity}</span>
                </div>
            `);
        });

        cleanedAreas.forEach(area => {
            L.marker([area.lat, area.lng], { icon: cleanedIcon })
            .addTo(map)
            .bindPopup(`
    <img src="logos/bin-logo.png" class="popup-logo" style="width: 50px; height: 50px;">
    <div class="ml-0">
        <b>${area.title}</b><br>
        ${area.description}<br>
        Volunteers: ${area.volunteers}<br>
        <span class="text-green-600">Area Cleaned</span><br>
        
        <!-- Before/After slider -->
        <div class="before-after-container">
            <div class="before-image">
                <img src="images/${area.title === 'Central Park Cleanup' ? 'a-before.jpg' : 'c-before.jpg'}" alt="Before cleanup" />
            </div>
            <div class="after-image">
                <img src="images/${area.title === 'Central Park Cleanup' ? 'b-after.jpg' : 'd-after.jpg'}" alt="After cleanup" />
            </div>
            <input type="range" min="0" max="100" value="50" class="slider" />
        </div>
        <div class="mt-2 text-xs text-gray-500">
            Drag slider to see before/after comparison
        </div>
    </div>
`);
        plantingZones.forEach(zone => {
            L.marker([zone.lat, zone.lng], { icon: plantingIcon })
                .addTo(map)
                .bindPopup(`
                    <img src="logos/event-logo.png" class="popup-logo">
                    <div class="ml-0">
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
                    <img src="logos/event-logo.png" class="popup-logo">
                    <div class="ml-0">
                        <b>${event.title}</b><br>
                        ${event.description}<br>
                        Participants: ${event.participants}<br>
                        <button class="mt-2 bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700 transition">RSVP</button>
                    </div>
                `);
        });

        // Add circles
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

    // Challenge button functionality if on knowledge page
    if (document.getElementById('knowledge')) {
        const challengeBtn = document.querySelector('#knowledge button');
        if (challengeBtn) {
            challengeBtn.addEventListener('click', function () {
                const currentPoints = parseInt(localStorage.getItem('ecoUserPoints') || 0);
                const newPoints = currentPoints + 25;
                localStorage.setItem('ecoUserPoints', newPoints);
                
                if (userPointsElement) {
                    userPointsElement.textContent = newPoints;
                }

                this.innerHTML = '<i class="fas fa-check mr-2"></i> Challenge Completed!';
                this.classList.remove('bg-green-600', 'hover:bg-green-700');
                this.classList.add('bg-gray-400', 'cursor-not-allowed');
                this.disabled = true;
            });
        }

        // Quiz answer
        const quizBtn = document.querySelector('#quiz-container button');
        if (quizBtn) {
            quizBtn.addEventListener('click', function () {
                const selected = document.querySelector('input[name="quiz"]:checked');
                if (selected && selected.parentElement.textContent.trim().startsWith('9%')) {
                    alert('Correct! Only about 9% of plastic waste is recycled globally.');
                    const currentPoints = parseInt(localStorage.getItem('ecoUserPoints') || 0);
                    const newPoints = currentPoints + 15;
                    localStorage.setItem('ecoUserPoints', newPoints);
                    
                    if (userPointsElement) {
                        userPointsElement.textContent = newPoints;
                    }
                } else {
                    alert('Incorrect. The correct answer is 9%. Only a small fraction of plastic is recycled.');
                }
            });
        }
    }

    // Slider logic for "before/after" images
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('slider')) {
            const afterImg = e.target.parentElement.querySelector('.after-image');
            if (afterImg) {
                afterImg.style.clipPath = `inset(0 0 0 ${e.target.value}%)`;
            }
        }
    });
});
