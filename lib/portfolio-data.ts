export const personalInfo = {
  name: 'Juan Carlo Senin',
  title: 'Full Stack Developer | AI & Automation',
  email: 'senin.juancarlo@gmail.com',
  tagline: 'Building the future, one line at a time.',
  subtitle:
    'Full Stack Developer — from pixel-perfect UIs to scalable cloud infrastructure.',
  focus: 'I ship products that work.',
  profileImage: '/assets/informal picture-resized.png',
  copyright: '© 2026 Juan Carlo Senin. All Rights Reserved',
  social: {
    linkedin: 'https://www.linkedin.com/in/jcarlo-senin/',
    github: 'https://github.com/jcarlo-vs',
  },
};

export const aboutContent = {
  heading: "I don't just write code —",
  highlight: 'I craft digital experiences',
  paragraphs: [
    'While others see lines of code, I see opportunities to solve real problems. I transform complex business challenges into elegant, performant applications that users actually love to use.',
    "Every project I touch becomes faster, cleaner, and more intuitive. I obsess over the details that separate good software from exceptional software — because your users will notice the difference, even if they can't explain why.",
  ],
  technicalVision: {
    title: 'My Approach',
    description:
      'I believe great software is invisible — it just works. My mission is to build applications that feel effortless, scale infinitely, and make businesses more profitable. No over-engineering, no technical debt, just clean solutions that stand the test of time.',
  },
  motto: ['Clean code.', 'Real results.'],
};

export const stats = [
  { value: 4, suffix: '+', label: 'Years Experience' },
  { value: 20, suffix: '+', label: 'Projects Built' },
  { value: 15, suffix: '+', label: 'Technologies' },
];

export const skills = {
  frontend: [
    { name: 'JAVASCRIPT' },
    { name: 'TYPESCRIPT' },
    { name: 'REACT JS' },
    { name: 'NEXT JS' },
    { name: 'VUE JS' },
    { name: 'ANGULAR' },
    { name: 'TAILWIND' },
    { name: 'FRAMER MOTION' },
  ],
  backend: [
    { name: 'NODE JS' },
    { name: 'EXPRESS JS' },
    { name: 'NEST JS' },
    { name: 'PHP - laravel' },
    { name: 'MONGODB' },
    { name: 'POSTGRESQL' },
    { name: 'MYSQL' },
    { name: 'REDIS' },
    { name: 'FIREBASE' },
  ],
  tools: [
    { name: 'GIT' },
    { name: 'AWS' },
    { name: 'DOCKER' },
    { name: 'CLOUDFLARE' },
  ],
};

export const experience = [
  {
    period: '2024 – 2025',
    title: 'Full Stack Developer',
    company: 'Independent Contractor',
  },
  {
    period: '2023 – 2024',
    title: 'Software Engineer',
    company: 'Pointwest Squad Inc.',
  },
  {
    period: '2022 – 2023',
    title: 'Software Engineer',
    company: 'Vtimetech Consulting Inc.',
  },
  {
    period: '2022',
    title: 'Software Engineer',
    company: 'Lobster Technologies',
  },
  {
    period: '2017 – 2021',
    title: 'Research Analyst',
    company: 'SEAL Capital',
  },
  {
    period: '2013 – 2018',
    title: 'BS Computer Engineering',
    company: 'University of Pangasinan',
  },
];

export const projects = [
  {
    title: 'NOTELIFY APP',
    description:
      'A full-stack note-taking application with secure user authentication, personal data storage, and a clean interface that lets users organize thoughts and plans effortlessly.',
    image: '/assets/images/notelifyv1.png',
    technologies: ['MONGODB', 'EXPRESS JS', 'REACT JS', 'NODE JS'],
    demoLink: 'https://notelify-app.vercel.app/landing',
    githubLink: 'https://github.com/jcarlo-vs/NOTELIFY-APP',
  },
  {
    title: 'CRYPTO METER',
    description:
      'An all-in-one cryptocurrency library for browsing exchanges, tracking thousands of coins, reading crypto news, and calculating conversions — all in a single, responsive dashboard.',
    image: '/assets/images/cryptometerv1.png',
    technologies: ['REACT JS', 'REDUX', 'REST APIS'],
    demoLink: 'https://crypto-meter.vercel.app/',
    githubLink: 'https://github.com/jcarlo-vs/CRYPTO-METER',
  },
  {
    title: 'PICABOOK',
    description:
      'A social media platform for sharing photos publicly, adding captions, and browsing user profiles — built with a full MERN stack and real-time data syncing.',
    image: '/assets/images/picabookv1.png',
    technologies: ['MONGODB', 'EXPRESS JS', 'REACT JS', 'NODE JS'],
    demoLink: 'https://picabook-app.vercel.app/login',
    githubLink: 'https://github.com/jcarlo-vs/picabook-app',
  },
];

export const currentlyBuilding = [
  {
    name: 'Familia Tree',
    description: 'Interactive family tree builder with drag-and-drop nodes',
    link: 'https://familia-tree.vercel.app/',
    status: 'In Progress' as const,
  },
  {
    name: 'Portfolio v2',
    description: 'This site — compact, dark, command-palette-powered',
    link: null,
    status: 'Shipping' as const,
  },
];

export const navigationItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'resume', label: 'Resume' },
  { id: 'skills', label: 'Tech' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];
