# 🚀 Quick Start Guide

Get your portfolio up and running in 5 minutes!

## Step 1: View Your Portfolio (1 min)

```bash
cd /Users/juancarlosenin/Desktop/Personal/personal-new
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 2: Update Your Content (2 min)

Open `/lib/portfolio-data.ts` and update:

### Your Basic Info

```typescript
export const personalInfo = {
  name: "Your Name Here",
  email: "your.email@example.com",
  // ... update other fields
};
```

### Your Social Links

```typescript
social: {
  linkedin: "https://linkedin.com/in/YOUR-PROFILE",
  github: "https://github.com/YOUR-USERNAME",
  twitter: "https://twitter.com/YOUR-HANDLE",
}
```

Save the file and see changes instantly! 🎉

## Step 3: Add Your Photo (1 min)

1. Replace this file with your photo:

   - `/public/assets/informal picture-resized.png`

2. Recommended: Square image, 400x400px minimum

## Step 4: Update Projects (1 min)

In `/lib/portfolio-data.ts`, update the `projects` array:

```typescript
export const projects = [
  {
    title: "YOUR PROJECT NAME",
    description: "What does it do?",
    image: "/assets/images/your-project.png",
    technologies: ["React", "Node.js", "etc"],
    demoLink: "https://your-project.com",
    githubLink: "https://github.com/you/project",
  },
  // Add more projects...
];
```

## Step 5: Deploy (Optional - 2 min)

### Deploy to Vercel (Easiest)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

Done! Your portfolio is live! 🌐

---

## 📚 Need More Help?

- **Full Documentation**: See `README.md`
- **Customization Guide**: See `CUSTOMIZATION_GUIDE.md`
- **Project Overview**: See `PROJECT_SUMMARY.md`

## 🎨 Quick Customizations

### Change Colors

Edit `/app/globals.css` and find/replace:

- `#00dbde` (cyan) with your color
- `#fc00ff` (purple) with your color

### Add More Skills

In `/lib/portfolio-data.ts`:

```typescript
export const skills = {
  frontend: [
    { name: "NEW SKILL", icon: "/assets/icons/skill.png" },
    // ...
  ],
};
```

### Update Experience

In `/lib/portfolio-data.ts`:

```typescript
export const experience = [
  {
    period: "JAN 2024 - PRESENT",
    title: "Your Job Title",
    company: "Company Name",
  },
  // ...
];
```

---

## ✅ Checklist

Before deploying, make sure you've:

- [ ] Updated your name and email
- [ ] Added your profile photo
- [ ] Updated social media links
- [ ] Added your projects
- [ ] Updated skills section
- [ ] Updated experience section
- [ ] Tested on mobile (responsive)
- [ ] Checked all links work

---

## 🎉 You're Ready!

Your modern portfolio is set up and ready to impress!

**Questions?** Check the other documentation files or the code comments.

**Good luck with your job search!** 💼✨

