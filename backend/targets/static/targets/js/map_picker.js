(function() {
    'use strict';

    function initMapPicker() {
        if (typeof L === 'undefined') {
            console.error('Leaflet not loaded');
            return;
        }

        const mapContainer = document.getElementById('location-map-picker');
        if (!mapContainer) {
            return;
        }

        const latInput = document.getElementById('id_latitude');
        const lngInput = document.getElementById('id_longitude');
        
        if (!latInput || !lngInput) {
            console.error('Latitude or longitude input not found');
            return;
        }

        let initialLat = parseFloat(latInput.value) || 49.0;
        let initialLng = parseFloat(lngInput.value) || 31.0;
        let initialZoom = latInput.value && lngInput.value ? 13 : 6;

        const map = L.map('location-map-picker').setView([initialLat, initialLng], initialZoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        let marker = null;
        
        if (latInput.value && lngInput.value) {
            marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
            setupMarkerDrag(marker);
        }

        function setupMarkerDrag(m) {
            m.on('dragend', function(e) {
                const pos = m.getLatLng();
                updateInputs(pos.lat, pos.lng);
            });
        }

        function updateInputs(lat, lng) {
            latInput.value = lat.toFixed(6);
            lngInput.value = lng.toFixed(6);
            
            latInput.dispatchEvent(new Event('change'));
            lngInput.dispatchEvent(new Event('change'));
        }

        map.on('click', function(e) {
            const { lat, lng } = e.latlng;
            
            if (marker) {
                marker.setLatLng([lat, lng]);
            } else {
                marker = L.marker([lat, lng], { draggable: true }).addTo(map);
                setupMarkerDrag(marker);
            }
            
            updateInputs(lat, lng);
        });

        function onInputChange() {
            const lat = parseFloat(latInput.value);
            const lng = parseFloat(lngInput.value);
            
            if (!isNaN(lat) && !isNaN(lng)) {
                if (marker) {
                    marker.setLatLng([lat, lng]);
                } else {
                    marker = L.marker([lat, lng], { draggable: true }).addTo(map);
                    setupMarkerDrag(marker);
                }
                map.setView([lat, lng], map.getZoom() < 10 ? 13 : map.getZoom());
            }
        }

        latInput.addEventListener('change', onInputChange);
        lngInput.addEventListener('change', onInputChange);

        const searchContainer = document.createElement('div');
        searchContainer.className = 'map-search-container';
        searchContainer.innerHTML = `
            <input type="text" id="map-search-input" placeholder="Search address..." class="form-control" style="margin-bottom: 10px; width: 100%;">
            <button type="button" id="map-search-btn" class="btn btn-primary btn-sm" style="margin-bottom: 10px;">🔍 Find</button>
            <button type="button" id="map-locate-btn" class="btn btn-secondary btn-sm" style="margin-bottom: 10px; margin-left: 5px;">📍 My location</button>
        `;
        mapContainer.parentNode.insertBefore(searchContainer, mapContainer);

        const searchInput = document.getElementById('map-search-input');
        const searchBtn = document.getElementById('map-search-btn');
        const locateBtn = document.getElementById('map-locate-btn');

        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (!query) return;

            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
                .then(response => response.json())
                .then(data => {
                    if (data && data.length > 0) {
                        const result = data[0];
                        const lat = parseFloat(result.lat);
                        const lng = parseFloat(result.lon);
                        
                        if (marker) {
                            marker.setLatLng([lat, lng]);
                        } else {
                            marker = L.marker([lat, lng], { draggable: true }).addTo(map);
                            setupMarkerDrag(marker);
                        }
                        
                        map.setView([lat, lng], 15);
                        updateInputs(lat, lng);
                    } else {
                        alert('Address not found');
                    }
                })
                .catch(err => {
                    console.error('Geocoding error:', err);
                    alert('Search error');
                });
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchBtn.click();
            }
        });

        locateBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        
                        if (marker) {
                            marker.setLatLng([lat, lng]);
                        } else {
                            marker = L.marker([lat, lng], { draggable: true }).addTo(map);
                            setupMarkerDrag(marker);
                        }
                        
                        map.setView([lat, lng], 15);
                        updateInputs(lat, lng);
                    },
                    function(error) {
                        alert('Could not determine location: ' + error.message);
                    }
                );
            } else {
                alert('Geolocation is not supported by this browser');
            }
        });

        setTimeout(function() {
            map.invalidateSize();
        }, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMapPicker);
    } else {
        initMapPicker();
    }

    window.addEventListener('load', function() {
        setTimeout(initMapPicker, 200);
    });
})();
