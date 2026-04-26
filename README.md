# Kurumi's Personal Website

A clean, responsive personal website featuring a blog with Markdown support and a wallpaper gallery collection.

## Features

- **Homepage**: Introduction, personal mottos, and Discord bot promotion
- **Blog**: Markdown-based articles with pagination and tag support
- **Wallpapers**: Steam Workshop gallery integration
- **Responsive Design**: Mobile-friendly with hamburger menu
- **Static Site**: Fast, secure, and easy to host

## Tech Stack

- **HTML5** semantic markup
- **CSS3** with custom properties, Flexbox, and Grid
- **Vanilla JavaScript** for interactivity
- **Node.js** build system with `marked` for Markdown parsing
- **Static files**: Can be hosted on GitHub Pages, Netlify, Vercel, etc.

## Project Structure

```
website/
├── config.json           # Site configuration (author, wallpapers, blog settings)
├── package.json          # Node.js dependencies
├── build.js              # Build script to convert Markdown to HTML
│
├── index.html            # Homepage
├── blog.html             # Blog listing page
├── wallpapers.html       # Wallpaper gallery page
│
├── css/
│   └── style.css         # All styles (responsive, mobile-first)
│
├── js/
│   ├── main.js           # Homepage JavaScript (mobile menu, wallpaper preview)
│   ├── blog.js           # Blog listing page (pagination, dynamic loading)
│   └── wallpapers.js     # Wallpaper gallery page (loads from config)
│
├── blog/
│   ├── posts.json        # Auto-generated: all blog posts metadata
│   ├── post1.html        # Auto-generated: individual blog post pages
│   ├── post2.html
│   └── ... (more posts)
│
└── blog/
    └── posts/
        ├── post1.md      # Source Markdown for blog post 1
        ├── post2.md
        └── ... (more posts)
```

## Getting Started

### Prerequisites

- Node.js (v14+) and npm installed

### Installation

1. Clone or download this repository
2. Install dependencies:

```bash
cd website
npm install
```

### Development

Run a local development server:

```bash
npm run serve
```

Then open http://localhost:8080 in your browser.

### Building

Convert Markdown posts to static HTML:

```bash
npm run build
```

This will:
- Read all `.md` files from `blog/posts/`
- Convert to HTML using `marked`
- Generate individual blog post pages in `/blog/`
- Create `blog/posts.json` for the blog listing

### Content Management

#### Adding a New Blog Post

1. Create a new Markdown file in `blog/posts/` named `postN.md` where N is the next number
2. Use the following frontmatter format:

```markdown
---
title: "Your Post Title"
date: 2025-04-20
author: Kurumi
excerpt: "A brief description of your post"
tags: ["tag1", "tag2", "tag3"]
---

Your content here in Markdown format...
```

3. Run `npm run build` to generate the HTML page
4. The post will automatically appear on the blog listing page

#### Updating Wallpapers

Edit `config.json` and modify the `wallpapers.steamWorkshopLinks` array:

```json
{
  "wallpapers": {
    "steamWorkshopLinks": [
      {
        "id": "1234567890",
        "title": "Wallpaper Name",
        "description": "Description text",
        "steamUrl": "https://steamcommunity.com/sharedfiles/filedetails/?id=1234567890"
      }
    ]
  }
}
```

## Customization

### Site Settings

Edit `config.json` to change:

- Site title and description
- Author information
- Discord bot invite link
- Blog posts per page
- Wallpaper collection

### Styling

All styles are in `css/style.css`. CSS custom properties (variables) are defined at the top for easy theming:

```css
:root {
    --primary-color: #6366f1;    /* Main accent color */
    --text-dark: #1f2937;        /* Text color */
    --bg-light: #ffffff;         /* Background */
    /* ... */
}
```

## Deployment

### GitHub Pages

1. Push repository to GitHub
2. Enable GitHub Pages in repository settings
3. Set source to `main` branch, folder `/root` or `/docs`
4. Your site will be live at `https://<username>.github.io/<repo>/`

### Netlify / Vercel

1. Drag and drop the `website/` folder to Netlify or connect your Git repository
2. No build command needed (files are pre-built)
3. Deploy!

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to use this template for your own website!

## Credits

- Design inspired by modern minimal aesthetics
- Icons from [Icons8](https://icons8.com/)
- Fonts: System UI fonts for performance

---

Made with ❤️ by Kurumi
