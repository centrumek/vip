// Data ślubu - 4 czerwca 2026, 14:00
var weddingDate = new Date("June 4, 2026 14:00:00").getTime();

// Przechowuj poprzednią wartość sekund
var prevSeconds = null;

function updateCountdown() {
    var now = new Date().getTime();
    var distance = weddingDate - now;

    // Obliczenia dla dni, godzin, minut i sekund
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Wyświetlanie wyników
    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;

    // Dodanie animacji pulse do sekundnika
    var secondsItem = document.getElementById("seconds").parentElement;
    if (seconds !== prevSeconds) {
        secondsItem.classList.remove('pulse');
        // Wymuszenie reflow, by animacja zawsze się odpalała
        void secondsItem.offsetWidth;
        secondsItem.classList.add('pulse');
        prevSeconds = seconds;
    }

    // Jeśli odliczanie się zakończyło
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "<h2 class='text-white'>To dziś!</h2>";
    }
}

function initWeddingMap() {
    // Współrzędne miejsc
    const kosciol = [50.7682, 20.0881]; // Kościół MB Częstochowskiej
    const stodola = [50.8000, 20.0500]; // Stodoła Ogarka

    // Środek mapy
    const center = [
        (kosciol[0] + stodola[0]) / 2,
        (kosciol[1] + stodola[1]) / 2
    ];

    // Inicjalizacja mapy
    const map = L.map('map').setView(center, 12);

    // Przykład pobrania GeoJSON województwa (np. z pliku lub URL)
    fetch('../assets/swietokrzyskie.geojson')
        .then(response => response.json())
        .then(data => {
            L.geoJSON(data, {
                style: {
                    color: '#3388ff',      // kolor obramowania
                    weight: 2,             // grubość linii
                    fillColor: '#e0eaff',  // kolor wypełnienia
                    fillOpacity: 0.4       // przezroczystość tła
                }
            }).addTo(map);
        });

    // Warstwa mapy OSM
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Markery
    L.marker(kosciol).addTo(map)
        .bindTooltip('Kościół MB Częstochowskiej', {
            permanent: true,
            direction: 'top',
            className: 'marker-tooltip'
        });

    L.marker(stodola).addTo(map)
        .bindTooltip('Stodoła Ogarka', {
            permanent: true,
            direction: 'top',
            className: 'marker-tooltip'
        });

}

// Intersection Observer dla animacji elementów
function initScrollAnimations() {
    // Wybierz wszystkie elementy do animacji
    const elements = document.querySelectorAll('section h2, section .lead, section .card, section .swiadek-box, section #map, section .carousel-3d-wrapper');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                entry.target.classList.remove('section-hidden');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });
    
    elements.forEach((element, index) => {
        element.classList.add('section-hidden');
        // Dodaj opóźnienie dla efektu kaskadowego
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// Automatyczne uruchomienie po załadowaniu DOM, jeśli element mapy istnieje
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('map')) {
        initWeddingMap();
    }
    
    // Inicjalizuj animacje scrollu
    initScrollAnimations();
});

// Od razu po załadowaniu strony
updateCountdown();

// Potem co sekundę
setInterval(updateCountdown, 1000);

// Karuzela 3D
let currentIndex = 0;
let carousel3DItems = [];
let startX = 0;
let isDragging = false;

function initCarousel3D() {
    carousel3DItems = Array.from(document.querySelectorAll('.carousel-3d-item'));
    const container = document.getElementById('carousel3D');
    
    if (!container) return;
    
    // Obsługa myszki
    container.addEventListener('mousedown', startDrag);
    container.addEventListener('mousemove', drag);
    container.addEventListener('mouseup', endDrag);
    container.addEventListener('mouseleave', endDrag);
    
    // Obsługa dotyku
    container.addEventListener('touchstart', startDrag);
    container.addEventListener('touchmove', drag);
    container.addEventListener('touchend', endDrag);
    
    updateCarousel3D();
}

function startDrag(e) {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
}

function drag(e) {
    if (!isDragging) return;
    
    const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const diff = currentX - startX;
    
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            moveCarousel3D(-1);
        } else {
            moveCarousel3D(1);
        }
        isDragging = false;
    }
}

function endDrag() {
    isDragging = false;
}

function moveCarousel3D(direction) {
    currentIndex = (currentIndex + direction + carousel3DItems.length) % carousel3DItems.length;
    updateCarousel3D();
}

function updateCarousel3D() {
    const total = carousel3DItems.length;
    
    carousel3DItems.forEach((item, index) => {
        item.className = 'carousel-3d-item';
        
        let position = index - currentIndex;
        
        // Zapętlenie pozycji
        if (position < -Math.floor(total / 2)) {
            position += total;
        } else if (position > Math.ceil(total / 2)) {
            position -= total;
        }
        
        if (position === 0) {
            item.classList.add('active');
        } else if (position === -1) {
            item.classList.add('prev-1');
        } else if (position === -2) {
            item.classList.add('prev-2');
        } else if (position === 1) {
            item.classList.add('next-1');
        } else if (position === 2) {
            item.classList.add('next-2');
        } else {
            item.classList.add('hidden');
        }
    });
}

// Inicjalizacja karuzeli po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('carousel3D')) {
        initCarousel3D();
    }
});
