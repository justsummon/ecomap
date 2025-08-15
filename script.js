document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
    });

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
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

    // Check for saved user data
    const userPoints = localStorage.getItem('ecoUserPoints') || 0;
    document.querySelector('#user-points span').textContent = userPoints;
    
    // Update progress bar if on rewards page
    if (document.getElementById('progress-bar')) {
        const progressPercentage = Math.min((userPoints / 500) * 100, 100);
        document.getElementById('progress-bar').style.width = `${progressPercentage}%`;
    }
    
    // Login button functionality
    document.getElementById('login-btn').addEventListener('click', function() {
        const newPoints = 100; // Starting bonus
        localStorage.setItem('ecoUserPoints', newPoints);
        document.querySelector('#user-points span').textContent = newPoints;
        this.textContent = 'My Profile';
        
        if (document.getElementById('progress-bar')) {
            const newProgress = Math.min((newPoints / 500) * 100, 100);
            document.getElementById('progress-bar').style.width = `${newProgress}%`;
        }
    });
    
    // Map initialization if on index page
    if (document.getElementById('map')) {
        const map = L.map('map').setView([51.1605, 71.4704], 12);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create layers
        const trashLayer = L.layerGroup();
        const cleanedLayer = L.layerGroup();
        const plantingLayer = L.layerGroup();
        const eventsLayer = L.layerGroup();

        // Add all layers to the map by default
        trashLayer.addTo(map);
        cleanedLayer.addTo(map);
        plantingLayer.addTo(map);
        eventsLayer.addTo(map);

        // Toggle layers based on checkboxes
document.getElementById('toggleTrash').addEventListener('change', function () {
    if (this.checked) {
        map.addLayer(trashLayer);
    } else {
        map.removeLayer(trashLayer);
    }
});

document.getElementById('toggleCleaned').addEventListener('change', function () {
    if (this.checked) {
        map.addLayer(cleanedLayer);
    } else {
        map.removeLayer(cleanedLayer);
    }
});

document.getElementById('togglePlanting').addEventListener('change', function () {
    if (this.checked) {
        map.addLayer(plantingLayer);
    } else {
        map.removeLayer(plantingLayer);
    }
});

document.getElementById('toggleEvents').addEventListener('change', function () {
    if (this.checked) {
        map.addLayer(eventsLayer);
    } else {
        map.removeLayer(eventsLayer);
    }
});
        
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
        
        trashSpots.forEach(spot => {
            L.marker([spot.lat, spot.lng], { icon: trashIcon })
                .addTo(trashLayer)
                .bindPopup(`<b>${spot.title}</b><br>${spot.description}<br><span class="text-red-600">Severity: ${spot.severity}</span><br><button class="mt-2 bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700 transition">I'll Clean This</button>`);
        });
        
        cleanedAreas.forEach(area => {
            L.marker([area.lat, area.lng], { icon: cleanedIcon })
                .addTo(cleanedLayer)
                .bindPopup(`<b>${area.title}</b><br>${area.description}<br>Volunteers: ${area.volunteers}<br><span class="text-green-600">Area Cleaned</span>`);
        });
        
        plantingZones.forEach(zone => {
            L.marker([zone.lat, zone.lng], { icon: plantingIcon })
                .addTo(plantingLayer)
                .bindPopup(`<b>${zone.title}</b><br>${zone.description}<br>Date: ${zone.date}<br><button class="mt-2 bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700 transition">Join Planting</button>`);
        });
        
        events.forEach(event => {
            L.marker([event.lat, event.lng], { icon: eventIcon })
                .addTo(eventsLayer)
                .bindPopup(`<b>${event.title}</b><br>${event.description}<br>Participants: ${event.participants}<br><button class="mt-2 bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700 transition">RSVP</button>`);
        });

        // Add layers to the map by default
        trashLayer.addTo(map);
        cleanedLayer.addTo(map);
        plantingLayer.addTo(map);
        eventsLayer.addTo(map);
        
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
        document.querySelector('#knowledge button').addEventListener('click', function() {
            const currentPoints = parseInt(localStorage.getItem('ecoUserPoints') || 0);
            const newPoints = currentPoints + 25;
            localStorage.setItem('ecoUserPoints', newPoints);
            document.querySelector('#user-points span').textContent = newPoints;
            
            this.innerHTML = '<i class="fas fa-check mr-2"></i> Challenge Completed!';
            this.classList.remove('bg-green-600', 'hover:bg-green-700');
            this.classList.add('bg-gray-400', 'cursor-not-allowed');
            this.disabled = true;
        });
        
        // Quiz answer
        document.querySelector('#quiz-container button').addEventListener('click', function() {
            const selected = document.querySelector('input[name="quiz"]:checked');
            if (selected && selected.parentElement.textContent.trim().startsWith('9%')) {
                alert('Correct! Only about 9% of plastic waste is recycled globally.');
                
                const currentPoints = parseInt(localStorage.getItem('ecoUserPoints') || 0);
                const newPoints = currentPoints + 15;
                localStorage.setItem('ecoUserPoints', newPoints);
                document.querySelector('#user-points span').textContent = newPoints;
            } else {
                alert('Incorrect. The correct answer is 9%. Only a small fraction of plastic is recycled.');
            }
        });
    }
});
