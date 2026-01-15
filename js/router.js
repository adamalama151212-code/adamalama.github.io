// Konfiguracja routingu [cite: 83]
let pageUrls = {
    about: '/index.html?about',
    gallery: '/index.html?gallery',
    contact: '/index.html?contact'
};

function OnStartUp() {
    popStateHandler();
}
OnStartUp();

// --- Event Listenery dla nawigacji [cite: 91, 131] ---

document.querySelector('#about-link').addEventListener('click', () => {
    let stateObj = { page: 'about' };
    document.title = 'About';
    history.pushState(stateObj, "about", "?about");
    RenderAboutPage();
});

document.querySelector('#gallery-link').addEventListener('click', () => {
    let stateObj = { page: 'gallery' };
    document.title = 'Gallery';
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
});

document.querySelector('#contact-link').addEventListener('click', () => {
    let stateObj = { page: 'contact' };
    document.title = 'Contact';
    history.pushState(stateObj, "contact", "?contact");
    RenderContactPage();
});

// --- Obsługa Dark Mode (Step 8) [cite: 173] ---
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// --- Funkcje Renderujące ---

function RenderAboutPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">About Me</h1>
        <p>To jest aplikacja SPA stworzona w ramach laboratorium. Wykorzystuje Vanilla JS i History API.</p>`;
}

// Implementacja Galerii (Step 10) [cite: 222, 223, 224]
function RenderGalleryPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Gallery</h1>
        <div class="gallery-grid" id="gallery-container">
            </div>
    `;

    const galleryContainer = document.getElementById('gallery-container');
    // Używamy placeholderów z picsum.photos dla demonstracji
    const imageUrls = [
        'https://picsum.photos/600/600?random=1',
        'https://picsum.photos/600/600?random=2',
        'https://picsum.photos/600/600?random=3',
        'https://picsum.photos/600/600?random=4',
        'https://picsum.photos/600/600?random=5',
        'https://picsum.photos/600/600?random=6',
        'https://picsum.photos/600/600?random=7',
        'https://picsum.photos/600/600?random=8',
        'https://picsum.photos/600/600?random=9'
    ];

    // Lazy Loading z IntersectionObserver [cite: 224]
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                // Ładowanie asynchroniczne jako BLOB [cite: 223]
                fetch(src)
                    .then(response => response.blob())
                    .then(blob => {
                        const objectURL = URL.createObjectURL(blob);
                        img.src = objectURL;
                    });
                
                observer.unobserve(img);
            }
        });
    });

    imageUrls.forEach(url => {
        const img = document.createElement('img');
        img.classList.add('gallery-item');
        img.setAttribute('data-src', url); // URL jest w data-src, src jest puste na początku
        
        // Obsługa Modala po kliknięciu [cite: 225]
        img.addEventListener('click', () => {
            const modal = document.getElementById('image-modal');
            const modalImg = document.getElementById("img01");
            modal.style.display = "block";
            modalImg.src = img.src;
        });

        galleryContainer.appendChild(img);
        observer.observe(img); // Rozpocznij obserwację dla lazy loading
    });

    // Zamykanie modala [cite: 226]
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('image-modal').style.display = "none";
    });
    
    // Zamknięcie po kliknięciu poza obrazem
    window.onclick = function(event) {
        const modal = document.getElementById('image-modal');
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

// Implementacja Kontaktu z walidacją (Step 11) [cite: 142, 227, 228]
function RenderContactPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Contact with me</h1>
        <form id="contact-form">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required minlength="3">
            
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            
            <label for="message">Message:</label>
            <textarea id="message" name="message" required minlength="10"></textarea>
            
            <div class="g-recaptcha" data-sitekey="6LcRzkssAAAAALYhIjQSkk0w-pGLzH-j8st6mgma"></div>
            
            <button type="submit">Send</button>
        </form>`;

    document.getElementById('contact-form').addEventListener('submit', (event) => {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Prosta walidacja JS [cite: 228]
        if (name.length < 3) {
            alert("Imię jest za krótkie!");
            return;
        }
        if (!email.includes('@')) {
            alert("Niepoprawny email!");
            return;
        }
        if (message.length < 10) {
            alert("Wiadomość musi mieć minimum 10 znaków.");
            return;
        }

        // Symulacja sprawdzenia reCAPTCHA
        // W prawdziwej aplikacji sprawdzamy grecaptcha.getResponse()
        alert('Formularz zwalidowany poprawnie i wysłany!');
    });
}

// Obsługa przycisków Wstecz/Dalej w przeglądarce [cite: 114, 139]
function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];
    
    // Obsługa braku parametru (strona główna)
    if (!loc || loc === '/' || loc === '/index.html') {
        RenderAboutPage();
        return;
    }

    if (loc.includes('contact')) { RenderContactPage(); }
    else if (loc.includes('gallery')) { RenderGalleryPage(); }
    else if (loc.includes('about')) { RenderAboutPage(); }
}

window.onpopstate = popStateHandler;
