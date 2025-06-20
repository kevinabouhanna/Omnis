# OMNIS - Fashion E-commerce Website

## Project Overview

OMNIS is a modern fashion e-commerce website built with React and TypeScript. The site features smooth animations, responsive design, and a minimalist aesthetic focused on premium clothing.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/kevinabouhanna/Omnis)

### Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui (UI components)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Contentful (headless CMS for product management)

## Image Management

### UI and Static Images

Static images for UI elements are organized in the public directory:

```
public/images/
├── hero/           # Hero section background images
├── backgrounds/    # Background images for various sections
├── about/          # Images for the about section
└── og/             # Open Graph images for social media sharing
```

### Product Images

Product images are managed through Contentful CMS:

- Images are uploaded and stored in Contentful's media library
- Each product references its image through the Contentful API
- Images are served through Contentful's global CDN for optimal performance
- Image URLs are automatically formatted with proper dimensions and optimizations

### Lazy Loading

All images use lazy loading for improved performance:

- A custom `LazyImage` component is used throughout the site
- The component uses both native `loading="lazy"` and Intersection Observer API
- Images only load when they enter the viewport (or approach it)
- A placeholder is shown until the image loads
- Smooth fade-in transition when images appear

## Email System

OMNIS uses a centralized email template system for all transactional emails:

### Email Templates

All email templates are defined in `functions/email-templates.js`:

- **Welcome Email**: Sent when a user subscribes to the newsletter
- **Order Confirmation Email**: Sent when a customer places an order

### Email Customization

For detailed instructions on customizing email templates, see the [Email Customization Guide](docs/email-customization-guide.md).

## Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Route-based page components
├── lib/               # Utilities and hooks
├── contexts/          # React context providers
├── services/          # API services and external integrations
└── styles/            # Global styles and Tailwind config
docs/
└── email-customization-guide.md  # Guide for customizing email templates
```

### Key Directories and Files

- `src/components/`: UI components including Navbar, Footer, and product-related components
- `src/contexts/`: Context providers for state management
  - `ContentfulProductsProvider.tsx`: Manages product data from Contentful
  - `ProductContext.tsx`: Manages shopping cart state
- `src/services/`: External API integrations
  - `contentful.ts`: Handles fetching product data from Contentful
- `functions/`: Netlify serverless functions
  - `subscribe.js`: Handles newsletter subscriptions and sends welcome emails
  - `order-confirmation.js`: Sends order confirmation emails
  - `email-templates.js`: Contains all email templates

## User Authentication & Order Tracking (Supabase)

OMNIS now supports secure user authentication and order tracking using Supabase:

- **Sign Up & Log In:** Users can create accounts and log in securely.
- **Order Tracking:** After placing an order, users receive a unique order number. They can track their order status from the "Track Order" page.
- **Security:** Only authenticated users can view their own orders. Row Level Security (RLS) is enforced in Supabase.
- **Order Confirmation:** Order numbers are shown on the checkout and confirmation pages, and sent via email (Resend integration).

**Setup & Integration:**
- See [docs/supabase-auth-order-tracking-guide.md](docs/supabase-auth-order-tracking-guide.md) for full setup and integration instructions.
