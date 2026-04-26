/**
 * Main JavaScript for Kurumi's Personal Website
 */

// Configuration
const CONFIG_URL = '/config.json';

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    loadWallpaperPreview();
});

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

// Load wallpaper preview on homepage
async function loadWallpaperPreview() {
    try {
        const response = await fetch(CONFIG_URL);
        const config = await response.json();
        const previewGrid = document.getElementById('wallpaperPreview');

        if (previewGrid && config.wallpapers && config.wallpapers.steamWorkshopLinks) {
            // Show first 3 wallpapers
            const previewWallpapers = config.wallpapers.steamWorkshopLinks.slice(0, 3);

            previewGrid.innerHTML = previewWallpapers.map(wp => `
                <div class="wallpaper-card">
                    <img src="https://img.icons8.com/color/480/steam.png" alt="${wp.title}" loading="lazy">
                    <div class="content">
                        <h3>${wp.title}</h3>
                        <p>${wp.description}</p>
                        <a href="${wp.steamUrl}" target="_blank" class="steam-btn">View on Steam</a>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('無法載入桌布預覽:', error);
    }
}

// Show Discord Bot Info
function showDiscordInfo() {
    alert('KurumiBot - Your friendly Discord assistant!\n\n' +
          'Features:\n' +
          '• Server moderation\n' +
          '• Fun commands\n' +
          '• Utility tools\n\n' +
          'Invite link: https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID\n\n' +
          'Replace YOUR_CLIENT_ID with your actual bot client ID.');
}

// Utility: Smooth scroll to element
function smoothScroll(targetId) {
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Utility: Set active navigation link
function setActiveNavLink(path) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        }
    });
}

// Animate elements on scroll
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

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});
