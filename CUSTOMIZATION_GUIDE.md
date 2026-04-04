# Portfolio Customization Guide

This guide will help you quickly customize your portfolio with your own content.

## 🎯 Quick Start

All content is managed in one file: `/lib/portfolio-data.ts`

## 📝 Step-by-Step Customization

### 1. Update Personal Information

```typescript
export const personalInfo = {
  name: "Your Name",                    // Your full name
  title: "Your Title",                  // e.g., "Full Stack Developer"
  email: "your.email@example.com",      // Your email
  tagline: "Your Tagline",              // Main headline
  subtitle: "Your subtitle",            // Secondary text
  focus: "Your focus areas",            // What you specialize in
  profileImage: "/assets/profile.png",  // Path to your profile image
  copyright: "© 2024 Your Name",        // Footer copyright
  social: {
    linkedin: "https://linkedin.com/in/yourprofile",
    github: "https://github.com/yourusername",
    twitter: "https://twitter.com/yourhandle",
  },
};
```

### 2. Update About Section

```typescript
export const aboutContent = {
  heading: "Your main heading",
  highlight: "Highlighted text",
  paragraphs: [
    "First paragraph about yourself...",
    "Second paragraph...",
  ],
  technicalVision: {
    title: "Technical Vision",
    description: "Your technical vision statement...",
  },
  motto: ["WORD1.", "WORD2.", "WORD3."],
};
```

### 3. Add Your Skills

```typescript
export const skills = {
  frontend: [
    { name: "SKILL NAME", icon: "/assets/icons/skill.png" },
    // Add more skills...
  ],
  backend: [
    { name: "SKILL NAME", icon: "/assets/icons/skill.png" },
    // Add more skills...
  ],
  tools: [
    { name: "TOOL NAME", icon: "/assets/icons/tool.png" },
    // Add more tools...
  ],
};
```

**To add skill icons:**
1. Place icon images in `/public/assets/icons/`
2. Reference them as `/assets/icons/filename.png`

### 4. Update Experience & Education

```typescript
export const experience = [
  {
    period: "START DATE - END DATE",
    title: "Job Title or Degree",
    company: "Company Name or University",
  },
  // Add more entries...
];
```

**Tips:**
- List in reverse chronological order (newest first)
- Use consistent date format
- Education entries are automatically detected if title includes "Bachelor", "Master", etc.

### 5. Add Your Projects

```typescript
export const projects = [
  {
    title: "PROJECT NAME",
    description: "Detailed project description...",
    image: "/assets/images/project-screenshot.png",
    technologies: ["Tech1", "Tech2", "Tech3"],
    demoLink: "https://your-project.com",
    githubLink: "https://github.com/you/project",
  },
  // Add more projects...
];
```

**To add project images:**
1. Place screenshots in `/public/assets/images/`
2. Recommended size: 1200x800px
3. Format: PNG or WebP for best quality

### 6. Update Background Image

Replace `/public/assets/images/bg2.webp` with your own background image.

**Recommended specs:**
- Resolution: 1920x1080 or higher
- Format: WebP or JPG
- Keep file size under 500KB for performance

### 7. Update Profile Picture

Replace `/public/assets/informal picture-resized.png` with your photo.

**Recommended specs:**
- Square aspect ratio (1:1)
- Resolution: 400x400px minimum
- Format: PNG with transparent background (optional)

## 🎨 Styling Customization

### Change Color Scheme

Edit `/app/globals.css` to change the gradient colors:

```css
/* Find and replace these values */
#00dbde  /* Cyan - replace with your color */
#fc00ff  /* Purple - replace with your color */
```

Also update in `/components/ui/gradient-text.tsx`:

```typescript
from = "#00dbde",  // Default cyan
to = "#fc00ff",    // Default purple
```

### Change Fonts

Edit `/app/layout.tsx`:

```typescript
import { YourFont, YourMonoFont } from "next/font/google";

const yourFont = YourFont({
  variable: "--font-your-font",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
```

## 📱 Adding New Sections

### Create a New Section Component

1. Create file in `/components/sections/your-section.tsx`:

```typescript
"use client";

import { Section } from "@/components/ui/section";
import { GradientText } from "@/components/ui/gradient-text";

export function YourSection() {
  return (
    <Section id="your-section">
      <h2 className="text-4xl font-bold mb-8">
        <GradientText>Your Section Title</GradientText>
      </h2>
      {/* Your content here */}
    </Section>
  );
}
```

2. Add to `/app/page.tsx`:

```typescript
import { YourSection } from "@/components/sections/your-section";

// In the main component:
<YourSection />
```

3. Add to navigation in `/components/layout/navigation.tsx`:

```typescript
const navItems = [
  // ... existing items
  { id: "your-section", label: "Your Label", icon: YourIcon },
];
```

## 🔧 Common Customizations

### Change Animation Speed

Edit animation duration in section components:

```typescript
transition={{ duration: 0.6 }}  // Change 0.6 to your preferred speed
```

### Disable Scroll Snap

In `/app/globals.css`, comment out:

```css
/* .scroll-container {
  scroll-snap-type: y proximity;
} */
```

### Change Navigation Position

Edit `/components/layout/navigation.tsx`:

```typescript
// Desktop navigation position
className="fixed right-6 bottom-1/3"  // Change right-6 or bottom-1/3

// Mobile navigation position
className="fixed bottom-0 left-0 right-0"  // Adjust as needed
```

### Hide Profile Card on Desktop

In `/app/page.tsx`, comment out:

```typescript
{/* <ProfileCard /> */}
```

## 📊 Content Tips

### Writing Good Project Descriptions

- Start with what the project does
- Mention key features
- Keep it under 3 sentences
- Use active voice

### Choosing Technologies to Display

- Focus on your strongest skills
- Group related technologies
- Keep frontend/backend separate
- Include tools you use regularly

### Professional Photo Tips

- Use good lighting
- Neutral or professional background
- Dress appropriately
- Smile naturally
- Face the camera directly

## 🐛 Troubleshooting

### Images Not Showing

- Check file path (case-sensitive)
- Ensure image is in `/public/` directory
- Use forward slashes in paths
- Verify file extension matches

### Animations Not Working

- Check if `framer-motion` is installed
- Ensure component is marked as `"use client"`
- Check browser console for errors

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## 📞 Need Help?

- Check the main README.md
- Review component files for examples
- Check Next.js documentation
- Inspect browser console for errors

---

Happy customizing! 🎉


