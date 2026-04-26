/**
 * Blog JavaScript - Handles rendering and pagination of blog posts
 * Works with pre-built static site
 */

const CONFIG_URL = '/config.json';

// State
let allPosts = window.allPosts || [];
let currentPage = window.currentPage || 1;
let postsPerPage = window.postsPerPage || 5;

// Initialize blog
document.addEventListener('DOMContentLoaded', async () => {
    // If no posts data available, try to fetch from JSON
    if (!window.allPosts || allPosts.length === 0) {
        await loadPostsFromJSON();
    }

    // Load config for postsPerPage if not set
    if (!window.postsPerPage) {
        await loadConfig();
    }

    // Always render (even if empty, shows no posts message)
    renderBlog();
    initMobileMenu();
});

// Load posts from JSON file
async function loadPostsFromJSON() {
    try {
        const response = await fetch('./blog/posts.json');
        if (response.ok) {
            allPosts = await response.json();
            window.allPosts = allPosts;
        }
    } catch (error) {
        console.error('Failed to load posts JSON:', error);
        allPosts = [];
    }
}

// Load configuration
async function loadConfig() {
    try {
        const response = await fetch(CONFIG_URL);
        const config = await response.json();
        postsPerPage = config.blog?.postsPerPage || 5;
        window.postsPerPage = postsPerPage;
    } catch (error) {
        console.error('Failed to load config:', error);
    }
}

// Set active navigation link
function setActiveNavLink(path) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        }
    });
}

// Render blog posts
function renderBlog() {
    const blogList = document.getElementById('blogList');
    const pagination = document.getElementById('pagination');

    if (!blogList) return;

    // If we have no pre-rendered HTML in #blogList, render all posts
    const hasPreRendered = blogList.querySelector('.blog-card') !== null;
    const totalPages = Math.ceil(allPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = allPosts.slice(startIndex, endIndex);

    // Only render if not pre-rendered (first page already in HTML)
    if (!hasPreRendered || currentPage > 1) {
        if (postsToShow.length === 0) {
            blogList.innerHTML = '<p>No blog posts yet. Check back soon!</p>';
        } else {
            blogList.innerHTML = postsToShow.map(post => `
                <article class="blog-card">
                    <h3><a href="/blog/post${post.id}.html">${post.title}</a></h3>
                    <div class="meta">
                        Published on ${formatDate(post.date)} by ${post.author}
                    </div>
                    <p class="excerpt">${post.excerpt}</p>
                    <div class="tags">
                        ${post.tags.map(tag => `<span style="color: var(--primary-color); font-size: 0.875rem; margin-right: 0.5rem;">#${tag}</span>`).join('')}
                    </div>
                    <a href="/blog/post${post.id}.html" class="read-more">Read more →</a>
                </article>
            `).join('');
        }
    }

    // Re-render pagination
    if (pagination) {
        renderPagination(totalPages);
    }
}

// Render pagination controls
function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    if (!pagination || totalPages <= 1) {
        if (pagination) pagination.innerHTML = '';
        return;
    }

    let html = '';

    // Previous button
    html += `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            ← Previous
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        // Always show first, last, and adjacent pages
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `
                <button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span>...</span>`;
        }
    }

    // Next button
    html += `
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            Next →
        </button>
    `;

    pagination.innerHTML = html;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(allPosts.length / postsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    window.currentPage = currentPage;
    renderBlog();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Mobile menu
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

// Format date helper
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}
