// Wedding Countdown Timer
var weddingDate = new Date("June 4, 2026 15:00:00").getTime();
var prevSeconds = null;

function updateCountdown() {
    var now = new Date().getTime();
    var distance = weddingDate - now;
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;

    var secondsItem = document.getElementById("seconds").parentElement;
    if (seconds !== prevSeconds) {
        secondsItem.classList.remove('pulse');
        void secondsItem.offsetWidth;
        secondsItem.classList.add('pulse');
        prevSeconds = seconds;
    }

    if (distance < 0) {
        clearInterval(x);
        document.getElementById("countdown").innerHTML = "<h2 class='text-white'>To dziś!</h2>";
    }
}

// Wedding OpenStreetMap
function initWeddingMap() {
    const church = [50.6532591, 20.0991871];
    const barn = [50.8000, 20.0500];

    const center = [
        (church[0] + barn[0]) / 2,
        (church[1] + barn[1]) / 2
    ];

    const map = L.map('map').setView(center, 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const myRenderer = L.canvas({ padding: 0.5 });

    fetch('../assets/swietokrzyskie.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error('GeoJSON not found');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.type) {
                const geoJsonData = data.type === 'Polygon' ? {
                    type: 'Feature',
                    geometry: data
                } : data;
                
                L.geoJSON(geoJsonData, {
                    style: {
                        color: '#3388ff',
                        weight: 2,
                        fillColor: '#e0eaff',
                        fillOpacity: 0.4
                    },
                    renderer: myRenderer
                }).addTo(map);
            }
        })
        .catch(error => {
            console.error('Error loading GeoJSON:', error);
        });

    L.marker(church).addTo(map)
        .bindTooltip('Kościół św. Stanisława BM w Rakoszynie', {
            permanent: true,
            direction: 'top',
            className: 'marker-tooltip'
        });

    L.marker(barn).addTo(map)
        .bindTooltip('Stodoła Ogarka', {
            permanent: true,
            direction: 'top',
            className: 'marker-tooltip'
        });

}

// Scroll animations
function initScrollAnimations() {
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
        element.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(element);
    });
}

// Carousel 3D
let currentIndex = 0;
let carousel3DItems = [];

function initCarousel3D() {
    carousel3DItems = Array.from(document.querySelectorAll('.carousel-3d-item'));
    const container = document.getElementById('carousel3D');

    if (!container) return;

    updateCarousel3D();
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

// Calendar button - hybrid approach (mobile: .ics, desktop: Google Calendar)
function initCalendarButton() {
    const calendarButton = document.getElementById('calendar-button');
    if (!calendarButton) return;

    // Detect mobile devices including iPad (which may report desktop UA on iPadOS 13+)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) // Touch-capable devices
        || /iPad|iPhone|iPod/.test(navigator.platform) // Explicit iOS platform check
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad with iPadOS 13+
    
    if (!isMobile) {
        // Desktop: use Google Calendar link
        const googleCalendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Viktoria+i+Pawe%C5%82+bior%C4%85+%C5%9Alub%21&dates=20260604T130000Z/20260604T140000Z&details=Viktoria+i+Pawe%C5%82+powiedz%C4%85+sobie+%E2%80%9Etak%E2%80%9D%2C+%C5%82%C4%85cz%C4%85c+swoje+serca+i+%C5%BCycie+na+zawsze.+Ten+dzie%C5%84+b%C4%99dzie+pocz%C4%85tkiem+ich+wsp%C3%B3lnej+drogi+pe%C5%82nej+mi%C5%82o%C5%9Bci%2C+szcz%C4%99%C5%9Bcia+i+pi%C4%99knych+chwil.&location=Ko%C5%9Bci%C3%B3%C5%82+%C5%9Bw.+Stanis%C5%82awa+BM+w+Rakoszynie%2C+28-362+Rakoszyn%2C+Polska';
        calendarButton.href = googleCalendarUrl;
        calendarButton.target = '_blank';
    }
    // Mobile: keep the default wedding.ics href
}

// Initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
    updateCountdown();

    if (document.getElementById('map')) {
        initWeddingMap();
    }

    initScrollAnimations();

    if (document.getElementById('carousel3D')) {
        initCarousel3D();
    }

    initCalendarButton();
});

setInterval(updateCountdown, 1000);
