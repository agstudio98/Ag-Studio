/**
 * Ag Studio - Portfolio Website JavaScript
 * Monochromatic Theme
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functions
    initThemeToggle();
    initCustomCursor();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initCounterAnimation();
    initContactForm();
    initCatalogFilters();
});

/**
 * Catalog Filtering and Pagination
 * Handles search, relevance filter, tech filter, and pagination
 */
function initCatalogFilters() {
    const catalogGrid = document.getElementById('catalogGrid');
    if (!catalogGrid) return; // Only run on catalog page

    const searchInput = document.getElementById('projectSearch');
    const relevanceFilter = document.getElementById('relevanceFilter');
    const techFilter = document.getElementById('techFilter');
    const projectCount = document.getElementById('projectCount');
    const paginationContainer = document.getElementById('pagination');

    const projectsPerPage = 6;
    let currentPage = 1;
    let filteredProjects = [];

    // Store all projects initially
    const allProjects = Array.from(catalogGrid.querySelectorAll('.portfolio-item'));

    function updateCatalog() {
        const searchTerm = searchInput.value.toLowerCase();
        const relevanceTerm = relevanceFilter.value;
        const techTerm = techFilter.value;

        // Filter projects
        filteredProjects = allProjects.filter(project => {
            const title = project.querySelector('h3').textContent.toLowerCase();
            const description = project.querySelector('p').textContent.toLowerCase();
            const relevance = project.dataset.relevance;
            const tech = project.dataset.tech;

            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesRelevance = relevanceTerm === 'all' || relevance === relevanceTerm;
            const matchesTech = techTerm === 'all' || tech === techTerm;

            return matchesSearch && matchesRelevance && matchesTech;
        });

        // Update count
        projectCount.textContent = filteredProjects.length;

        // Reset to first page when filtering
        renderPagination();
        showPage(1);
    }

    function showPage(page) {
        currentPage = page;
        const startIndex = (page - 1) * projectsPerPage;
        const endIndex = startIndex + projectsPerPage;

        // Hide all
        allProjects.forEach(p => p.style.display = 'none');

        // Show slice
        filteredProjects.slice(startIndex, endIndex).forEach(p => {
            p.style.display = 'block';
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
        });

        // Update active class on pagination buttons
        const buttons = paginationContainer.querySelectorAll('.btn-page');
        buttons.forEach((btn) => {
            if (parseInt(btn.textContent) === page) {
                btn.style.background = 'var(--text-primary)';
                btn.style.color = 'var(--text-contrast)';
            } else {
                btn.style.background = 'var(--bg-tertiary)';
                btn.style.color = 'var(--text-primary)';
            }
        });

        // Scroll to the top of the catalog explorer section, not the top of the page
        const explorerSection = document.getElementById('explorar-todo');
        if (explorerSection) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const targetPosition = explorerSection.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    }

    function renderPagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

        if (totalPages <= 1) return;

        // Previous Arrow
        if (currentPage > 1) {
            const prevBtn = createPageBtn('<i class="fas fa-chevron-left"></i>', () => showPage(currentPage - 1));
            paginationContainer.appendChild(prevBtn);
        }

        // Show a sliding window of page numbers
        const maxVisible = 12; // Show more buttons as requested
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const btn = createPageBtn(i, () => showPage(i));
            if (i === currentPage) {
                btn.style.background = 'var(--text-primary)';
                btn.style.color = 'var(--text-contrast)';
            }
            paginationContainer.appendChild(btn);
        }

        // Next Arrow
        if (currentPage < totalPages) {
            const nextBtn = createPageBtn('<i class="fas fa-chevron-right"></i>', () => showPage(currentPage + 1));
            paginationContainer.appendChild(nextBtn);
        }
    }

    function createPageBtn(content, onClick) {
        const btn = document.createElement('button');
        btn.innerHTML = content;
        btn.className = 'btn btn-page';
        btn.style.cssText = `
            padding: 8px 16px;
            background: var(--bg-tertiary);
            color: var(--text-primary);
            border: 1px solid var(--border-strong);
            border-radius: 4px;
            cursor: pointer;
            transition: var(--transition-fast);
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 45px;
        `;
        btn.addEventListener('click', onClick);
        return btn;
    }

    // Event listeners
    searchInput.addEventListener('input', updateCatalog);
    relevanceFilter.addEventListener('change', updateCatalog);
    techFilter.addEventListener('change', updateCatalog);

    // Initial load
    updateCatalog();
}

/**
 * Theme Toggle Functionality
 * Switches between dark and light themes
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const htmlElement = document.documentElement;
    
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    
    // Check for system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update icon
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
}

/**
 * Header scroll effect
 * Changes header style on scroll
 */
function initHeader() {
    const header = document.getElementById('header');
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Mobile menu toggle
 * Opens/closes mobile navigation
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = menuToggle.querySelectorAll('span');
        if (nav.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll animations using Intersection Observer
 * Animates elements when they come into view
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 1000);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial setup for sections and fade-in elements
    const sections = document.querySelectorAll('.about, .services, .portfolio, .contact, .fade-in');
    sections.forEach(section => {
        if (!section.classList.contains('fade-in')) {
            section.classList.add('fade-in');
        }
        observer.observe(section);
    });

    // Animate service cards with stagger
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    cardObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        cardObserver.observe(card);
    });

    // Animate portfolio items with stagger
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item, index) => {
        // Initial state for grid items that are not handled by pagination JS
        if (item.style.display !== 'none') {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `opacity 0.5s ease ${(index % 6) * 0.1}s, transform 0.5s ease ${(index % 6) * 0.1}s`;

            const itemObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        itemObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            itemObserver.observe(item);
        }
    });
}

/**
 * Counter animation for statistics
 * Counts up from 0 to target number
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    const animationDuration = 2000; // 2 seconds
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / animationDuration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const current = Math.floor(easeOutQuart * target);
            counter.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    };
    
    // Start animation when stats section is visible
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    counters.forEach(counter => animateCounter(counter));
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
}

/**
 * Contact form handling
 * Uses EmailJS API to send emails directly to Gmail
 */
function initContactForm() {
    // Initialize EmailJS with your public key
    (function() {
        emailjs.init("MowAI7bgLOqjBGYue");
    })();

    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Basic validation
        if (!data.name || !data.email || !data.subject || !data.message) {
            showNotification('Por favor, completa todos los campos', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Por favor, ingresa un email válido', 'error');
            return;
        }
        
        // Send email via EmailJS
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // EmailJS template parameters
        const templateParams = {
            to_email: 'agustinnicolasgallardorios@gmail.com',
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message
        };
        
        try {
            // Using EmailJS service
            const response = await emailjs.send('service_qwj2t5l', 'template_86nxtw6', templateParams);
            
            showNotification('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
            form.reset();
        } catch (error) {
            console.error('EmailJS Error:', error);
            showNotification('Error al enviar. Intenta de nuevo.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type of notification (success/error)
 */
function showNotification(message, type) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles dynamically
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#1a1a1a' : '#2a1a1a'};
        border: 1px solid ${type === 'success' ? '#333' : '#3a2a2a'};
        border-left: 3px solid ${type === 'success' ? '#27c93f' : '#ff5f56'};
        color: #e5e5e5;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: #888;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

/**
 * Lazy loading for images (if needed in future)
 */
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Parallax effect for hero section (optional, subtle)
 */
function initParallax() {
    const hero = document.querySelector('.hero');
    
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.3;
        
        hero.style.backgroundPosition = `center ${rate}px`;
    });
}

// Initialize parallax (optional)
// initParallax();

/**
 * Preloader functionality (optional)
 * Shows a loading screen while page loads
 */
function initPreloader() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">Ag<span>Studio</span></div>
            <div class="preloader-spinner"></div>
        </div>
    `;
    
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #0a0a0a;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    const logoStyle = `
        font-size: 2rem;
        font-weight: 700;
        color: #fff;
        margin-bottom: 20px;
    `;
    
    const spinnerStyle = `
        width: 40px;
        height: 40px;
        border: 3px solid #2a2a2a;
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    `;
    
    const keyframes = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `;
    
    preloader.querySelector('.preloader-logo').style = logoStyle;
    preloader.querySelector('.preloader-spinner').style = spinnerStyle;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(preloader);
    
    // Hide preloader when page loads
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 500);
    });
}

// Uncomment to enable preloader
// initPreloader();

/**
 * Custom cursor functionality
 * Rounded cursor that follows mouse movement
 */
function initCustomCursor() {
    const cursor = document.createElement('div');
    const cursorDot = document.createElement('div');
    
    cursor.className = 'cursor';
    cursorDot.className = 'cursor-dot';
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth cursor animation
    function animateCursor() {
        const ease = 0.15;
        
        cursorX += (mouseX - cursorX) * ease;
        cursorY += (mouseY - cursorY) * ease;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        cursorDot.style.left = mouseX - 3 + 'px';
        cursorDot.style.top = mouseY - 3 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Hover effects on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .service-card, .portfolio-item, .feature-card, input, textarea');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
    
    // Hide cursor when leaving the window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
    });
}

console.log('Ag Studio Portfolio - JavaScript initialized');

