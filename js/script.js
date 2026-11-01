// ===================================
// Mobile Navigation Toggle
// ===================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const portalDropdown = document.querySelector('.dropdown');
const portalToggle = document.querySelector('.dropdown-toggle');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

if (portalDropdown && portalToggle) {
    const closePortalMenu = () => {
        portalDropdown.classList.remove('open');
        portalToggle.setAttribute('aria-expanded', 'false');
    };

    portalToggle.addEventListener('click', () => {
        const isOpen = portalDropdown.classList.toggle('open');
        portalToggle.setAttribute('aria-expanded', String(isOpen));
    });

    portalToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePortalMenu();
    });

    portalDropdown.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', closePortalMenu);
    });

    document.addEventListener('click', (e) => {
        if (!portalDropdown.contains(e.target)) closePortalMenu();
    });
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger || !navMenu) return;

    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// ===================================
// Smooth Scrolling for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        const target = document.getElementById(decodeURIComponent(href.slice(1)));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            // Close mobile menu if open
            if (navMenu) navMenu.classList.remove('active');
        }
    });
});

// ===================================
// Navbar Scroll Effect
// ===================================
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.pageYOffset > 100
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.15)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    });
}

// ===================================
// Contact Form Handler
// ===================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        if (!data.contactName || !data.contactEmail || !data.contactMessage) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        const subject = encodeURIComponent(data.contactSubject || 'Website enquiry');
        const body = encodeURIComponent(
            `Name: ${data.contactName}\nEmail: ${data.contactEmail}\n\n${data.contactMessage}`
        );
        window.location.href = `mailto:info@kitoohighschool.ac.ke?subject=${subject}&body=${body}`;
        showNotification('Your email application should open with this message ready to send.', 'info');
    });
}

// ===================================
// Notification System
// ===================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', type === 'error' ? 'alert' : 'status');
    const content = document.createElement('div');
    const icon = document.createElement('i');
    const text = document.createElement('span');
    content.className = 'notification-content';
    icon.className = `fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`;
    icon.setAttribute('aria-hidden', 'true');
    text.textContent = message;
    content.append(icon, text);
    notification.appendChild(content);
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
`;
document.head.appendChild(style);

// ===================================
// Scroll Animations (Intersection Observer)
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.module-card, .about-card, .academics-card, .gallery-item, .step');
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

// ===================================
// Module Cards Interactive Effect
// ===================================
document.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===================================
// Gallery Lightbox (Basic Implementation)
// ===================================
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const title = this.querySelector('.gallery-overlay h4').textContent;
        
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${img.src}" alt="${title}">
                <h3>${title}</h3>
            </div>
        `;
        
        // Add styles
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Close on click outside or close button
        const closeLightbox = () => {
            lightbox.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                lightbox.remove();
                document.body.style.overflow = '';
            }, 300);
        };
        
        lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    });
});

// Add lightbox animation styles
const lightboxStyle = document.createElement('style');
lightboxStyle.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        text-align: center;
    }
    
    .lightbox-content img {
        max-width: 100%;
        max-height: 80vh;
        border-radius: 8px;
    }
    
    .lightbox-content h3 {
        color: white;
        margin-top: 1rem;
        font-size: 1.5rem;
    }
    
    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 3rem;
        cursor: pointer;
        line-height: 1;
        transition: transform 0.3s ease;
    }
    
    .lightbox-close:hover {
        transform: rotate(90deg);
    }
`;
document.head.appendChild(lightboxStyle);

// ===================================
// Form Input Enhancements
// ===================================
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
        if (this.value) {
            this.parentElement.classList.add('has-value');
        } else {
            this.parentElement.classList.remove('has-value');
        }
    });
});

// ===================================
// Active Navigation Highlight
// ===================================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
});

// Add active link style
const navLinkStyle = document.createElement('style');
navLinkStyle.textContent = `
    .nav-menu a.active {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
    }
`;
document.head.appendChild(navLinkStyle);
