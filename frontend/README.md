# SEOWebster - Astro SEO Agency Website

A professional SEO agency website built with Astro, Tailwind CSS, and content collections for managing blog posts and service pages.

## 🚀 Project Structure

```
/
├── public/
│   └── images/             # Future image assets
├── src/
│   ├── components/
│   │   ├── Navbar.astro    # Navigation component
│   │   └── Footer.astro    # Footer component
│   ├── content/
│   │   ├── config.ts       # Content collections configuration
│   │   ├── blog/           # Blog posts (markdown files)
│   │   ├── services/       # Service pages (markdown files)
│   │   ├── cms-seo/        # CMS SEO guides (markdown files)
│   │   └── industry-seo/   # Industry-specific SEO guides (markdown files)
│   ├── layouts/
│   │   └── BaseLayout.astro # Base layout with Navbar and Footer
│   └── pages/
│       ├── index.astro     # Homepage
│       ├── contact.astro   # Contact page
│       ├── shop.astro      # Shop page
│       ├── blog/
│       │   └── [slug].astro # Dynamic blog post pages
│       ├── services/
│       │   └── [slug].astro # Dynamic service pages
│       ├── cms-seo/
│       │   └── [slug].astro # Dynamic CMS SEO pages
│       └── industry-seo/
│           └── [slug].astro # Dynamic industry SEO pages
├── astro.config.mjs        # Astro configuration
├── tailwind.config.cjs     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 📝 Content Management

### Blog Posts
Add new blog posts by creating markdown files in `src/content/blog/`. Each file should include frontmatter with:
- `title`: Post title
- `description`: Meta description
- `publishDate`: Publication date
- `author`: Author name
- `tags`: Array of tags

### Services
Add new services by creating markdown files in `src/content/services/`. Same frontmatter structure as blog posts.

### CMS SEO Guides
Add CMS-specific SEO guides in `src/content/cms-seo/`.

### Industry SEO Guides
Add industry-specific SEO guides in `src/content/industry-seo/`.

## 🎨 Styling

The project uses Tailwind CSS for styling. The design system includes:
- Blue primary color scheme (`blue-600`)
- Responsive design for all screen sizes
- Clean, professional layout
- Consistent spacing and typography

## 🔧 Features

- **Fast Performance**: Built with Astro for optimal loading speeds
- **SEO Optimized**: Meta tags, structured URLs, and semantic HTML
- **Content Collections**: Type-safe content management with Astro
- **Responsive Design**: Mobile-first responsive layout
- **Dynamic Routing**: Automatic page generation for content
- **Professional Design**: Clean, modern design for an SEO agency

## 📁 Sample Content

The project includes sample content files:
- `intro-to-seo.md` - Blog post about SEO basics
- `local-seo.md` - Service page for local SEO
- `wordpress-seo.md` - CMS guide for WordPress SEO
- `ecommerce-seo.md` - Industry guide for e-commerce SEO

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:4321](http://localhost:4321) in your browser

4. Start adding your content and customizing the design!

## 📦 Deployment

Build the project for production:

```bash
npm run build
```

The built site will be in the `./dist/` folder, ready to be deployed to any static hosting service.

## 🛠️ Customization

- Modify colors and styling in Tailwind classes
- Add new content types by extending the content collections in `src/content/config.ts`
- Customize the layout by editing `src/layouts/BaseLayout.astro`
- Add new pages in the `src/pages/` directory

## 📧 Contact

For more information about SEOWebster or this project, visit the contact page or reach out through the website.

---

Built with ❤️ using [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/) 