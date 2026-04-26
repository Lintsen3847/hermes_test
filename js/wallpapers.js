/**
 * Wallpapers Page JavaScript
 * Loads wallpaper data from config.json and displays the gallery
 */

const CONFIG_URL = '/config.json';

document.addEventListener('DOMContentLoaded', async () => {
    await loadWallpapers();
    initMobileMenu();
});

// Load wallpapers from config
async function loadWallpapers() {
    try {
        const response = await fetch(CONFIG_URL);
        const config = await response.json();
        const grid = document.getElementById('wallpaperGrid');

        if (grid && config.wallpapers && config.wallpapers.steamWorkshopLinks) {
            grid.innerHTML = config.wallpapers.steamWorkshopLinks.map(wp => `
                <div class="wallpaper-card">
                    <img src="https://img.icons8.com/color/480/steam.png" alt="${wp.title}" loading="lazy">
                    <div class="content">
                        <h3>${wp.title}</h3>
                        <p>${wp.description}</p>
                        <a href="${wp.steamUrl}" target="_blank" class="steam-btn">View on Steam Workshop</a>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('無法載入桌布:', error);
        const grid = document.getElementById('wallpaperGrid');
        if (grid) {
            grid.innerHTML = '<p class="text-center">Failed to load wallpapers. Please try again later.</p>';
        }
    }
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}
