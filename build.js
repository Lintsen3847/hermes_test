/**
 * Build Script for Kurumi's Website
 * Converts Markdown blog posts to static HTML pages
 * Generates posts.json for blog listing
 */

const fs = require('fs-extra');
const path = require('path');
const marked = require('marked');

const CONFIG_PATH = path.join(__dirname, 'config.json');
const BLOG_DIR = path.join(__dirname, 'blog', 'posts');
const OUTPUT_BLOG_DIR = path.join(__dirname, 'blog');

// Ensure directories exist
fs.ensureDirSync(BLOG_DIR);
fs.ensureDirSync(OUTPUT_BLOG_DIR);

// Read config
const config = fs.readJsonSync(CONFIG_PATH);

// Configure marked options
marked.setOptions({
    gfm: true,
    breaks: true,
    headerIds: true,
    mangle: false
});

/**
 * Main build function
 */
async function build() {
    console.log('🔨 Starting website build...');

    // Step 1: Load all markdown posts
    console.log('📖 Loading blog posts...');
    const posts = await loadPosts();

    // Step 2: Generate posts.json for blog listing
    console.log('📋 Generating posts.json...');
    const postsData = posts.map(p => ({
        id: p.id,
        title: p.title,
        date: p.date,
        author: p.author,
        excerpt: p.excerpt,
        tags: p.tags
    }));
    fs.writeJsonSync(path.join(OUTPUT_BLOG_DIR, 'posts.json'), postsData, { spaces: 2 });
    console.log(`  ✓ Generated posts.json with ${postsData.length} posts`);

    // Step 3: Generate individual blog post HTML pages
    console.log('📝 Generating blog post pages...');
    await generateBlogPosts(posts);

    console.log('✅ Build complete!');
    console.log(`📊 Generated ${posts.length} blog posts.`);
    console.log('🌐 To preview, run: npm run serve');
}

/**
 * Load all markdown files from blog/posts directory
 */
async function loadPosts() {
    const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
    const posts = [];

    for (const file of files) {
        const filePath = path.join(BLOG_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Parse frontmatter and content
        const { metadata, body } = parseMarkdown(content);

        const postNum = path.basename(file, '.md').replace('post', '') || (posts.length + 1);
        const postId = parseInt(postNum) || posts.length + 1;

        posts.push({
            id: postId,
            filename: file,
            title: metadata.title || 'Untitled',
            date: metadata.date || new Date().toISOString().split('T')[0],
            author: metadata.author || config.blog?.defaultAuthor || 'Anonymous',
            excerpt: metadata.excerpt || stripMarkdown(body).substring(0, 150) + '...',
            content: marked.parse(body),
            tags: metadata.tags || []
        });
    }

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    return posts;
}

/**
 * Parse markdown with YAML frontmatter
 */
function parseMarkdown(text) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = text.match(frontmatterRegex);

    if (match) {
        const yaml = match[1];
        const body = match[2];
        const metadata = parseYaml(yaml);
        return { metadata, body };
    }

    return { metadata: {}, body: text };
}

/**
 * Simple YAML parser for basic key-value pairs
 */
function parseYaml(yamlText) {
    const metadata = {};
    const lines = yamlText.split('\n');

    for (const line of lines) {
        const match = line.match(/^(\w+):\s*(.*)$/);
        if (match) {
            const key = match[1];
            let value = match[2].trim();

            // Strip surrounding quotes from simple string
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            // Parse arrays (basic)
            if (value.startsWith('[') && value.endsWith(']')) {
                try {
                    // Try parsing as JSON array
                    let arr = JSON.parse(value.replace(/'/g, '"'));
                    // Strip quotes from each element if needed
                    arr = arr.map(v => typeof v === 'string' && ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) ? v.slice(1, -1) : v);
                    value = arr;
                } catch {
                    // Fallback: split by comma
                    value = value.slice(1, -1).split(/\s*,\s*/).map(v => v.trim().replace(/^['"]|['"]$/g, ''));
                }
            }

            metadata[key] = value;
        }
    }

    return metadata;
}

/**
 * Strip markdown to plain text for excerpts
 */
function stripMarkdown(markdown) {
    return markdown
        .replace(/#+\s.*$/gm, '') // headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // bold
        .replace(/\*(.*?)\*/g, '$1') // italic
        .replace(/`(.*?)`/g, '$1') // inline code
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Generate individual blog post HTML pages
 */
async function generateBlogPosts(posts) {
    const templatePath = path.join(__dirname, 'templates', 'post-template.html');

    // Use embedded template if file not found
    let template;
    if (fs.existsSync(templatePath)) {
        template = fs.readFileSync(templatePath, 'utf-8');
    } else {
        template = getPostTemplate();
    }

    for (const post of posts) {
        let html = template
            .replace(/{{title}}/g, post.title)
            .replace(/{{excerpt}}/g, post.excerpt)
            .replace(/{{date}}/g, formatDate(post.date))
            .replace(/{{author}}/g, post.author)
            .replace(/{{content}}/g, post.content)
            .replace(/{{id}}/g, post.id);

        // Handle tags
        if (post.tags && post.tags.length) {
            const tagsHtml = post.tags.map(tag => `<span style="color: var(--primary-color); margin-right: 0.5rem;">#${tag}</span>`).join('');
            html = html.replace('{{#if tags}}', '').replace('{{/if}}', '');
            html = html.replace('{{#each tags}}<span style="color: var(--primary-color); margin-right: 0.5rem;">#{{this}}</span>{{/each}}', tagsHtml);
        } else {
            html = html.replace('{{#if tags}}<br>Tags: {{#each tags}}<span style="color: var(--primary-color); margin-right: 0.5rem;">#{{this}}</span>{{/each}}{{/if}}', '');
        }

        const outputPath = path.join(OUTPUT_BLOG_DIR, `post${post.id}.html`);
        fs.outputFileSync(outputPath, html);
        console.log(`  ✓ Generated post${post.id}.html: "${post.title}"`);
    }
}

/**
 * Get the HTML template for blog posts
 */
function getPostTemplate() {
    return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} - Kurumi's Blog</title>
    <meta name="description" content="{{excerpt}}">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <div class="container">
            <nav>
                <div class="logo">Kurumi</div>
                <ul class="nav-links" id="navLinks">
                    <li><a href="/">Home</a></li>
                    <li><a href="/blog.html" class="active">Blog</a></li>
                    <li><a href="/wallpapers.html">Wallpapers</a></li>
                </ul>
                <div class="menu-toggle" id="menuToggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </div>
    </header>

    <main class="container">
        <article class="blog-post">
            <a href="/blog.html" class="back-link">← Back to Blog</a>

            <header>
                <h1>{{title}}</h1>
                <div class="post-meta">
                    Published on {{date}} by {{author}}
                    {{#if tags}}<br>Tags: {{#each tags}}<span style="color: var(--primary-color); margin-right: 0.5rem;">#{{this}}</span>{{/each}}{{/if}}
                </div>
            </header>

            <div class="post-content">
                {{content}}
            </div>
        </article>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2025 Kurumi. All rights reserved.</p>
            <ul class="social-links">
                <li><a href="https://github.com/" title="GitHub">GitHub</a></li>
                <li><a href="https://discord.com/" title="Discord">Discord</a></li>
                <li><a href="https://steamcommunity.com/" title="Steam">Steam</a></li>
            </ul>
        </div>
    </footer>

    <script src="/js/main.js"></script>
</body>
</html>`;
}

/**
 * Format date to readable string
 */
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}

// Run build
build().catch(err => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});
