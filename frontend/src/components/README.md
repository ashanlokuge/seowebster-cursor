# Component Organization Structure

This document outlines the organized structure of components for better maintainability and scalability.

## 📁 Folder Structure

### 🏠 `homepage/` - Homepage-specific components
Components that are only used on the homepage:

- **Hero.astro** - Main hero section with CTA and dashboard visual
- **Partners.astro** - Partner logos section
- **Services.astro** - "What We Offer" services grid
- **WhyChoose.astro** - "Why Partner with SEOWebster" section
- **FAQ.astro** - Frequently Asked Questions accordion
- **EducationPromoSection.astro** - SEO Learning Hub promotion
- **ServiceCard.astro** - Individual service card component (used by Services.astro)

### 🧭 `navigation/` - Navigation components
Components related to site navigation that are used across multiple pages:

- **Navbar.astro** - Main navigation bar with sticky behavior
- **ServicesMegaMenu.astro** - Services dropdown mega menu
- **CMSSEOMegaMenu.astro** - CMS SEO dropdown mega menu
- **IndustrySEODropdown.astro** - Industry SEO dropdown menu
- **ServicesMenu.astro** - General services menu component

### 🎨 `layout/` - Layout components
Components that provide overall page structure and are used across multiple pages:

- **Footer.astro** - Site footer with links, social media, and newsletter signup

## 📝 Import Paths

### From Pages (e.g., `pages/index.astro`):
```astro
import Hero from '../components/homepage/Hero.astro';
import Partners from '../components/homepage/Partners.astro';
import Services from '../components/homepage/Services.astro';
import WhyChoose from '../components/homepage/WhyChoose.astro';
import FAQ from '../components/homepage/FAQ.astro';
import EducationPromoSection from '../components/homepage/EducationPromoSection.astro';
```

### From Layouts (e.g., `layouts/BaseLayout.astro`):
```astro
import Navbar from '../components/navigation/Navbar.astro';
import Footer from '../components/layout/Footer.astro';
```

### Within Component Folders (relative imports):
```astro
// In navigation/Navbar.astro
import ServicesMegaMenu from './ServicesMegaMenu.astro';
import CMSSEOMegaMenu from './CMSSEOMegaMenu.astro';
import IndustrySEODropdown from './IndustrySEODropdown.astro';

// In homepage/Services.astro
import ServiceCard from './ServiceCard.astro';
```

## 🚀 Benefits of This Organization

1. **Scalability** - Easy to add new pages without cluttering the main components folder
2. **Maintainability** - Clear separation of concerns makes it easier to find and update components
3. **Reusability** - Navigation and layout components can be easily reused across different pages
4. **Team Collaboration** - Developers can quickly understand the component structure
5. **Future Growth** - Easy to add new folders for specific page types (e.g., `blog/`, `products/`, etc.)

## 🔄 Future Expansion

When adding new pages, consider creating new folders:
- `blog/` - Blog-specific components
- `products/` - Product page components
- `contact/` - Contact page components
- `ui/` - Reusable UI components (buttons, modals, etc.)
- `forms/` - Form-related components

## 📋 Component Status

✅ **Organized**: All components are now properly organized into their respective folders
✅ **Imports Updated**: All import paths have been updated to reflect the new structure
✅ **Testing Ready**: The site should work correctly with the new organization 