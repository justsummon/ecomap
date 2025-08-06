document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');

    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
            console.log('Menu toggled');
        });
    } else {
        console.error('Menu toggle or nav-menu not found');
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
            console.log('Scrolled to top');
        });
    } else {
        console.error('Back to top button not found');
    }

    // Check for saved user data
    const userPoints = localStorage.getItem('ecoUserPoints') || 0;
    const pointsElement = document.querySelector('#user-points span');
    if (pointsElement) {
        pointsElement.textContent = userPoints;
        console.log('User points set to:', userPoints);
    } else {
        console.error('User points element not found');
    }
    
    // Update progress bar if on rewards page
    if (document.getElementById('progress-bar')) {
        const progressPercentage = Math.min((userPoints / 500) * 100, 100);
        document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
        console.log('Progress bar updated to:', progressPercentage, '%');
    }
    
    // Login button functionality
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const newPoints = 100;
            localStorage.setItem('ecoUserPoints', newPoints);
            pointsElement.textContent = newPoints;
            this.textContent = 'My Profile';
            
            if (document.getElementById('progress-bar')) {
                const newProgress = Math.min((newPoints / 500) * 100, 100);
                document.getElementById('progress-bar').style.width = `${newProgress}%`;
            }
            console.log('Login clicked, points updated to:', newPoints);
        });
    } else {
        console.error('Login button not found');
    }
    
    // Map initialization if on index page
    if (document.getElementById('map')) {
        console.log('Initializing map');
        const map = L.map('map').setView([51.1605, 71.4704], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Time slider
        const yearSlider = document.getElementById('year-slider');
        const selectedYear = document.getElementById('selected-year');
        if (yearSlider && selectedYear) {
            selectedYear.textContent = `Selected Year: ${yearSlider.value}`;
            yearSlider.addEventListener('input', function() {
                selectedYear.textContent = `Selected Year: ${this.value}`;
                updateMarkers(this.value);
                console.log('Year changed to:', this.value);
            });
        } else {
            console.error('Year slider or selected-year element not found');
        }

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
        
        const userIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        // Arrays to store markers with time data
        const trashMarkers = [];
        const cleanedMarkers = [];
        const plantingMarkers = [];
        const eventMarkers = [];
        const userMarkers = [];

        const trashSpots = [
            { lat: 51.1475, lng: 71.4225, title: "Park Trash Accumulation", description: "Plastic bottles and food wrappers", severity: "Medium" },
            { lat: 51.1520, lng: 71.4380, title: "Alleyway Dumping", description: "Furniture and household waste", severity: "High" },
            { lat: 51.1650, lng: 71.4450, title: "Riverbank Pollution", description: "Plastic bags and containers", severity: "High" },
            { lat: 51.1800, lng: 71.4300, title: "Street Litter", description: "Cigarette butts and small trash", severity: "Low" }
        ];
        
        const cleanedAreas = [
            { lat: 51.1400, lng: 71.4100, title: "Central Park Cleanup", description: "Completed June 5, 2023", volunteers: 15 },
            { lat: 51.1550, lng: 71.4500, title: "Esil River Cleanup", description: "Completed May 28, 2023", volunteers: 22 }
        ];
        
        const plantingZones = [
            { lat: 51.1700, lng: 71.4250, title: "Future Tree Planting", description: "50 native trees planned", date: "June 22, 2023" },
            { lat: 51.1600, lng: 71.4400, title: "Community Garden", description: "Vegetables and flowers", date: "Ongoing" }
        ];
        
        const events = [
            { lat: 51.1500, lng: 71.4350, title: "Park Cleanup Event", description: "June 15, 9AM-12PM", participants: 23 },
            { lat: 51.1750, lng: 71.4550, title: "Eco Workshop", description: "June 30, 6PM-8PM", participants: 18 }
        ];
        
        // Add markers to arrays and map
        function addMarkers() {
            trashSpots.forEach(spot => {
                const marker = L.marker([spot.lat, spot.lng], { icon: trashIcon })
                    .bindPopup(createPopup(spot));
                marker.addTo(map);
                trashMarkers.push(marker);
                console.log('Added trash marker:', spot.title);
            });
            
            cleanedAreas.forEach(area => {
                const marker = L.marker([area.lat, area.lng], { icon: cleanedIcon })
                    .bindPopup(createPopup(area));
                marker.addTo(map);
                cleanedMarkers.push(marker);
                console.log('Added cleaned marker:', area.title);
            });
            
            plantingZones.forEach(zone => {
                const marker = L.marker([zone.lat, zone.lng], { icon: plantingIcon })
                    .bindPopup(createPopup(zone));
                marker.addTo(map);
                plantingMarkers.push(marker);
                console.log('Added planting marker:', zone.title);
            });
            
            events.forEach(event => {
                const marker = L.marker([event.lat, event.lng], { icon: eventIcon })
                    .bindPopup(createPopup(event));
                marker.addTo(map);
                eventMarkers.push(marker);
                console.log('Added event marker:', event.title);
            });
        }

        // Create popup content with photo based on year
        function createPopup(data) {
            let content = `<b>${data.title}</b><br>${data.description}<br>`;
            if (data.severity) content += `<span class="text-red-600">Severity: ${data.severity}</span><br>`;
            if (data.volunteers) content += `Volunteers: ${data.volunteers}<br>`;
            if (data.date) content += `Date: ${data.date}<br>`;
            if (data.participants) content += `Participants: ${data.participants}<br>`;
            if (data.userMarker) content += `<button class="mt-2 bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700 transition">I'll Clean This</button>`;
            return content;
        }

        // Update markers with new photo based on selected year
        function updateMarkers(year) {
            [trashMarkers, cleanedMarkers, plantingMarkers, eventMarkers, userMarkers].forEach(markers => {
                markers.forEach(marker => {
                    const data = marker.options.data;
                    marker.setPopupContent(createPopup(data));
                });
            });
        }

        // Initialize markers
        addMarkers();
        trashMarkers.forEach(m => m.options.data = trashSpots[trashMarkers.indexOf(m)]);
        cleanedMarkers.forEach(m => m.options.data = cleanedAreas[cleanedMarkers.indexOf(m)]);
        plantingMarkers.forEach(m => m.options.data = plantingZones[plantingMarkers.indexOf(m)]);
        eventMarkers.forEach(m => m.options.data = events[eventMarkers.indexOf(m)]);

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
        
        // Checkbox event listeners
        const checkboxes = {
            'trash-spots': trashMarkers,
            'cleaned-areas': cleanedMarkers,
            'planting-zones': plantingMarkers,
            'events': eventMarkers,
            'user-markers': userMarkers
        };
        
        Object.keys(checkboxes).forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', function() {
                    toggleMarkers(checkboxes[id], this.checked);
                    console.log(`${id} checkbox changed, visibility:`, this.checked);
                });
            } else {
                console.error(`Checkbox with id ${id} not found`);
            }
        });
        
        // Function to toggle marker visibility
        function toggleMarkers(markers, isVisible) {
            markers.forEach(marker => {
                if (isVisible) {
                    marker.addTo(map);
                } else {
                    map.removeLayer(marker);
                }
            });
            console.log('Toggled markers, visible:', isVisible);
        }

        // Add marker functionality
        let currentPopup = null;
        const addMarkerBtn = document.getElementById('add-marker-btn');
        const issueType = document.getElementById('issue-type');
        if (addMarkerBtn && issueType) {
            addMarkerBtn.addEventListener('click', () => {
                map.on('click', onMapClick);
                addMarkerBtn.disabled = true;
                console.log('Map click listener enabled for adding marker');
            });

            function onMapClick(e) {
                if (currentPopup) {
                    map.removeLayer(currentPopup);
                }
                const popupContent = `
                    <div class="p-4 bg-white rounded-lg shadow-lg">
                        <p class="mb-2">Вы уверены?</p>
                        <button id="confirm-btn" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2">Подтвердить</button>
                        <button id="cancel-btn" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Нет</button>
                    </div>
                `;
                currentPopup = L.popup()
                    .setLatLng(e.latlng)
                    .setContent(popupContent)
                    .openOn(map);

                document.getElementById('confirm-btn').addEventListener('click', () => {
                    const year = yearSlider.value;
                    const issue = issueType.value;
                    const newMarker = L.marker(e.latlng, { icon: userIcon })
                        .bindPopup(createPopup({
                            title: `User Reported: ${issue}`,
                            description: `Reported on ${new Date().toLocaleDateString()}`,
                            userMarker: true
                        }));
                    newMarker.options.data = {
                        title: `User Reported: ${issue}`,
                        description: `Reported on ${new Date().toLocaleDateString()}`,
                        userMarker: true
                    };
                    newMarker.addTo(map);
                    userMarkers.push(newMarker);
                    map.removeLayer(currentPopup);
                    currentPopup = null;
                    map.off('click', onMapClick);
                    addMarkerBtn.disabled = false;
                    console.log('Marker added at:', e.latlng, 'for', issue);
                });

                document.getElementById('cancel-btn').addEventListener('click', () => {
                    map.removeLayer(currentPopup);
                    currentPopup = null;
                    map.off('click', onMapClick);
                    addMarkerBtn.disabled = false;
                    console.log('Marker addition cancelled');
                });
            }
        } else {
            console.error('Add marker button or issue type select not found');
        }
    }
    
    // Challenge button functionality if on knowledge page
    if (document.getElementById('knowledge')) {
        const challengeButton = document.querySelector('#knowledge button');
        if (challengeButton) {
            challengeButton.addEventListener('click', function() {
                const currentPoints = parseInt(localStorage.getItem('ecoUserPoints') || 0);
                const newPoints = currentPoints + 25;
                localStorage.setItem('ecoUserPoints', newPoints);
                pointsElement.textContent = newPoints;
                
                this.innerHTML = '<i class="fas fa-check mr-2"></i> Challenge Completed!';
                this.classList.remove('bg-green-600', 'hover:bg-green-700');
                this.classList.add('bg-gray-400', 'cursor-not-allowed');
                this.disabled = true;
                console.log('Challenge completed, points updated to:', newPoints);
            });
        } else {
            console.error('Challenge button not found');
        }
        
        // Quiz answer
        const quizButton = document.querySelector('#quiz-container button');
        if (quizButton) {
            quizButton.addEventListener('click', function() {
                const selected = document.querySelector('input[name="quiz"]:checked');
                if (selected && selected.parentElement.textContent.trim().startsWith('9%')) {
                    alert('Correct! Only about 9% of plastic waste is recycled globally.');
                    const currentPoints = parseInt(localStorage.getItem('ecoUserPoints') || 0);
                    const newPoints = currentPoints + 15;
                    localStorage.setItem('ecoUserPoints', newPoints);
                    pointsElement.textContent = newPoints;
                } else {
                    alert('Incorrect. The correct answer is 9%. Only a small fraction of plastic is recycled.');
                }
                console.log('Quiz submitted, selected answer:', selected ? selected.parentElement.textContent.trim() : 'none');
            });
        } else {
            console.error('Quiz button not found');
        }
    }
});