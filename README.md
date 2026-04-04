# Modern Portfolio Website

A modern, responsive portfolio website built with Next.js 16, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern Design**: Clean, professional design with glassmorphism effects and gradient accents
- **Smooth Animations**: Powered by Framer Motion for engaging user experience
- **Responsive**: Fully responsive design that works on all devices
- **Scroll Animations**: Intersection Observer API for scroll-triggered animations
- **Type-Safe**: Built with TypeScript for better code quality
- **Component-Based**: Reusable components for easy content management
- **Shadcn UI**: Modern UI components with Radix UI primitives
- **Easy to Customize**: Centralized data configuration for quick updates

## 📦 Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **UI Components**: Shadcn UI + Radix UI
- **Icons**: React Icons, Lucide React
- **Fonts**: Inter, JetBrains Mono

## 🛠️ Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Customization

### Update Personal Information

Edit `/lib/portfolio-data.ts` to update:

- Personal information (name, email, title, etc.)
- About section content
- Skills and technologies
- Work experience and education
- Projects
- Social media links

### Add New Projects

In `/lib/portfolio-data.ts`, add a new project to the `projects` array:

```typescript
{
  title: "PROJECT NAME",
  description: "Project description...",
  image: "/assets/images/project.png",
  technologies: ["Tech 1", "Tech 2"],
  demoLink: "https://demo-link.com",
  githubLink: "https://github.com/username/repo",
}
```

### Update Skills

Add new skills in `/lib/portfolio-data.ts` under the `skills` object:

```typescript
frontend: [
  { name: "SKILL NAME", icon: "/assets/icons/skill.png" },
  // ...
];
```

### Change Colors

The color scheme uses CSS variables defined in `/app/globals.css`. Main colors:

- Primary: Purple (`#fc00ff`)
- Secondary: Cyan (`#00dbde`)

To change colors, update the gradient values in:

- `/app/globals.css` (CSS variables)
- `/components/ui/gradient-text.tsx` (default gradient)

## 📁 Project Structure

```
personal-new/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── layout/
│   │   ├── navigation.tsx   # Navigation menu
│   │   └── profile-card.tsx # Profile sidebar
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   ├── about-section.tsx
│   │   ├── resume-section.tsx
│   │   ├── skills-section.tsx
│   │   ├── portfolio-section.tsx
│   │   └── contact-section.tsx
│   └── ui/
│       ├── gradient-text.tsx
│       ├── section.tsx
│       ├── tech-icon.tsx
│       ├── project-card.tsx
│       └── ... (shadcn components)
├── lib/
│   ├── portfolio-data.ts    # Content configuration
│   └── utils.ts             # Utility functions
└── public/
    └── assets/
        ├── icons/           # Technology icons
        ├── images/          # Project images
        └── ...
```

## 🎨 Key Components

### Reusable Components

- **GradientText**: Text with gradient color effect
- **Section**: Wrapper for page sections with scroll snap
- **TechIcon**: Technology icon with hover effects
- **ProjectCard**: Project showcase card with image and details

### Section Components

- **HeroSection**: Landing section with introduction
- **AboutSection**: About me and technical vision
- **ResumeSection**: Work experience and education timeline
- **SkillsSection**: Technologies and tools showcase
- **PortfolioSection**: Project portfolio with cards
- **ContactSection**: Contact form and information

### Layout Components

- **ProfileCard**: Sidebar with profile picture and social links (desktop only)
- **Navigation**: Sticky navigation menu (responsive)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms

Build the production version:

```bash
npm run build
npm start
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1450px (shows profile card)

## 🎯 Performance

- Optimized images with Next.js Image component
- Lazy loading for sections
- Minimal JavaScript bundle
- CSS-in-JS with Tailwind
- Server-side rendering

## 📄 License

This project is open source and available for personal use.

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio!

## 📧 Contact

For questions or suggestions, reach out via the contact form on the website.

---

Built with ❤️ using Next.js and modern web technologies.
