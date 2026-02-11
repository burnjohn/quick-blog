// Blog post fixtures — 18 posts across 4 categories
// Images cycle through /uploads/seed/blog_pic_1.png to blog_pic_10.png
// daysAgo = days in the past for createdAt; isPublished set per post
export const blogs = [
  // Technology (6) — 4 published, 2 drafts
  {
    title: 'Building Scalable APIs with Node.js and TypeScript',
    subTitle: 'A modern approach to server-side development',
    description: `<h2>Why TypeScript for APIs?</h2><p>TypeScript brings type safety to JavaScript, catching bugs at compile time rather than in production. When building APIs, this means fewer runtime errors and better IDE support.</p><h2>Setting Up Your Project</h2><p>Start with a clean Express or Fastify setup. Use strict mode and enable path aliases for cleaner imports. Structure your code into controllers, services, and repositories.</p><h2>Best Practices</h2><p>Validate input with Zod or Joi. Use dependency injection for testability. Log structured JSON. Rate limit public endpoints.</p>`,
    category: 'Technology',
    image: '/uploads/seed/blog_pic_1.png',
    daysAgo: 12,
    isPublished: true
  },
  {
    title: 'Getting Started with React Server Components',
    subTitle: 'The future of React rendering is here',
    description: `<h2>What Are RSCs?</h2><p>React Server Components run on the server, reducing client bundle size and enabling direct database access. They're a paradigm shift for React apps.</p><h2>Migration Strategy</h2><p>Start with new pages. Use 'use client' for interactive pieces. Keep data fetching in RSCs. Gradually convert leaf components.</p><h2>Common Pitfalls</h2><p>Don't pass non-serializable props. Be mindful of the network boundary. Use Suspense for streaming.</p>`,
    category: 'Technology',
    image: '/uploads/seed/blog_pic_2.png',
    daysAgo: 38,
    isPublished: true
  },
  {
    title: 'Docker vs Kubernetes: When to Use Which',
    subTitle: 'A practical guide for dev teams',
    description: `<h2>Docker: Containers for Everyone</h2><p>Docker simplifies packaging and running applications. Use it for local dev, CI/CD, and single-node deployments. Perfect for startups and small teams.</p><h2>Kubernetes: Orchestration at Scale</h2><p>When you need auto-scaling, self-healing, and multi-node deployments, Kubernetes shines. It adds complexity but pays off at scale.</p><h2>Choosing Wisely</h2><p>Start with Docker Compose. Move to Kubernetes when you hit scale limits or need multi-team coordination.</p>`,
    category: 'Technology',
    image: '/uploads/seed/blog_pic_3.png',
    daysAgo: 67,
    isPublished: false
  },
  {
    title: 'Automating Tests with Vitest and Playwright',
    subTitle: 'Fast, reliable testing for modern apps',
    description: `<h2>Vitest for Unit Tests</h2><p>Vitest is lightning-fast and Vite-native. Jest-compatible API means easy migration. Snapshots, mocks, and coverage built in.</p><h2>Playwright for E2E</h2><p>Cross-browser, reliable, flake-resistant. Use page object model. Run in CI with parallel workers.</p><h2>Putting It Together</h2><p>Unit tests for logic, integration for APIs, E2E for critical paths. Aim for fast feedback loops.</p>`,
    category: 'Technology',
    image: '/uploads/seed/blog_pic_4.png',
    daysAgo: 95,
    isPublished: true
  },
  {
    title: 'Understanding WebAuthn and Passwordless Auth',
    subTitle: 'Security and UX in the post-password era',
    description: `<h2>The Case for Passwordless</h2><p>Passwords are the weakest link. Phishing, reuse, and weak choices plague security. WebAuthn uses public-key crypto on your device.</p><h2>How It Works</h2><p>Register a credential with your authenticator. Sign challenges on login. No secrets leave the device. Works with passkeys.</p><h2>Implementation Tips</h2><p>Offer passkeys as an option alongside passwords. Use conditional UI for smooth UX. Fall back gracefully for older browsers.</p>`,
    category: 'Technology',
    image: '/uploads/seed/blog_pic_5.png',
    daysAgo: 128,
    isPublished: true
  },
  {
    title: 'GraphQL Federation: Beyond the Monolith',
    subTitle: 'Scaling GraphQL across microservices',
    description: `<h2>Why Federation?</h2><p>Single schema, multiple services. Each team owns a subgraph. Apollo or other gateways compose the schema. No central bottleneck.</p><h2>Designing Subgraphs</h2><p>Define entity keys. Extend types from other services. Use @key and @extends. Resolve references in your service.</p><h2>Operational Concerns</h2><p>Version schemas carefully. Monitor query complexity. Cache at the gateway. Handle partial failures.</p>`,
    category: 'Technology',
    image: '/uploads/seed/blog_pic_6.png',
    daysAgo: 162,
    isPublished: false
  },
  // Lifestyle (5) — 4 published, 1 draft
  {
    title: 'Morning Routines That Actually Stick',
    subTitle: 'Small habits for big impact',
    description: `<h2>Start Small</h2><p>One new habit at a time. Stack it onto something you already do. Five minutes is enough to begin.</p><h2>Common Morning Wins</h2><p>Hydration first. Movement before screens. Sunlight exposure. Mindful moments. Prep the night before.</p><h2>Sustaining the Routine</h2><p>Track it. Reward yourself. Be flexible on tough days. Consistency beats perfection.</p>`,
    category: 'Lifestyle',
    image: '/uploads/seed/blog_pic_7.png',
    daysAgo: 8,
    isPublished: true
  },
  {
    title: 'Digital Detox: A Week Without Social Media',
    subTitle: 'What I learned from unplugging',
    description: `<h2>Why I Did It</h2><p>Endless scrolling, comparison, and anxiety. I needed to reset my relationship with my phone.</p><h2>Day by Day</h2><p>First two days: withdrawal and boredom. By day four: clarity and focus. Reading and walks replaced scrolling.</p><h2>After the Week</h2><p>I reinstalled with limits. Curated feeds. Scheduled checks. The break changed my habits for good.</p>`,
    category: 'Lifestyle',
    image: '/uploads/seed/blog_pic_8.png',
    daysAgo: 42,
    isPublished: true
  },
  {
    title: 'Meal Prepping Without the Overwhelm',
    subTitle: 'Simple strategies for busy people',
    description: `<h2>Keep It Simple</h2><p>Batch cook one protein, one grain, lots of veggies. Sauces and dressings make repetition tolerable.</p><h2>Time-Saving Hacks</h2><p>Use a slow cooker. Roast trays of vegetables. Pre-portion snacks. Freeze portions for later.</p><h2>Sustainable Habits</h2><p>Start with two days of prep. Add more as it becomes routine. Your future self will thank you.</p>`,
    category: 'Lifestyle',
    image: '/uploads/seed/blog_pic_9.png',
    daysAgo: 78,
    isPublished: false
  },
  {
    title: 'Finding Flow: The Art of Deep Work',
    subTitle: 'Productivity through intentional focus',
    description: `<h2>What Is Deep Work?</h2><p>Uninterrupted, focused effort on cognitively demanding tasks. It's rare and valuable in a distracted world.</p><h2>Creating Conditions</h2><p>Block time. Eliminate notifications. Design your environment. Ritualize the start.</p><h2>Building the Muscle</h2><p>Start with 25-minute blocks. Gradually extend. Recover between sessions. Protect your focus ruthlessly.</p>`,
    category: 'Lifestyle',
    image: '/uploads/seed/blog_pic_10.png',
    daysAgo: 115,
    isPublished: true
  },
  {
    title: 'Minimalism Isn\'t About Owning Nothing',
    subTitle: 'It\'s about owning what matters',
    description: `<h2>Beyond the Stereotype</h2><p>Minimalism isn't white walls and 47 items. It's intentional curation. Keep what serves you. Let go of the rest.</p><h2>Practical Steps</h2><p>Audit one area at a time. Question each possession. Donate, sell, recycle. Prevent new clutter.</p><h2>Mental Clarity</h2><p>Less stuff, less decision fatigue. More space, more calm. It's a practice, not a destination.</p>`,
    category: 'Lifestyle',
    image: '/uploads/seed/blog_pic_1.png',
    daysAgo: 148,
    isPublished: true
  },
  // Startup (4) — 3 published, 1 draft
  {
    title: 'Finding Product-Market Fit: A Founder\'s Playbook',
    subTitle: 'Signals, metrics, and honest feedback',
    description: `<h2>Defining PMF</h2><p>Customers pull your product. Retention improves. Word of mouth grows. You feel it when you have it.</p><h2>Early Signals</h2><p>Rapid repeat usage. Unprompted referrals. "How did I live without this?" testimonials. Churn drops.</p><h2>Getting There</h2><p>Talk to users constantly. Pivot based on behavior, not opinions. Speed of learning beats speed of building.</p>`,
    category: 'Startup',
    image: '/uploads/seed/blog_pic_2.png',
    daysAgo: 22,
    isPublished: true
  },
  {
    title: 'Pricing Strategy for SaaS: What We Learned',
    subTitle: 'From $0 to $10K MRR',
    description: `<h2>Starting Out</h2><p>We undercharged at first. Free tier attracted tire-kickers. Paid tier felt like a leap for serious users.</p><h2>Experiments That Worked</h2><p>Usage-based add-ons. Annual discount. Clear value tiers. Transparent pricing page.</p><h2>Key Insight</h2><p>Price communicates value. Cheap can signal "not serious." Test regularly. Don't be afraid to raise.</p>`,
    category: 'Startup',
    image: '/uploads/seed/blog_pic_3.png',
    daysAgo: 58,
    isPublished: true
  },
  {
    title: 'Hiring Your First Engineer as a Non-Technical Founder',
    subTitle: 'What to look for and what to avoid',
    description: `<h2>The Challenge</h2><p>You need someone who can build, lead, and scale. But you can't evaluate code. Focus on outcomes and process.</p><h2>Evaluation Strategies</h2><p>Portfolio and past projects. Take-home that mirrors real work. References from previous employers.</p><h2>Red Flags</h2><p>Over-promising. Dismissive of users. No curiosity. Inability to explain tradeoffs in plain language.</p>`,
    category: 'Startup',
    image: '/uploads/seed/blog_pic_4.png',
    daysAgo: 102,
    isPublished: false
  },
  {
    title: 'Bootstrapping vs VC: Our Decision Framework',
    subTitle: 'Choosing the right path for your startup',
    description: `<h2>When to Bootstrap</h2><p>You have revenue or a path to it. You value control. You're patient. Market isn't winner-take-all.</p><h2>When to Raise</h2><p>Network effects matter. Speed is critical. You need capital for growth. You're okay with dilution.</p><h2>Our Choice</h2><p>We bootstrapped to $50K MRR. Then raised a small round for a specific growth bet. No one-size-fits-all.</p>`,
    category: 'Startup',
    image: '/uploads/seed/blog_pic_5.png',
    daysAgo: 138,
    isPublished: true
  },
  // Finance (3) — 2 published, 1 draft
  {
    title: 'Index Funds vs Picking Stocks: The Data Says',
    subTitle: 'A boring approach to wealth building',
    description: `<h2>The Evidence</h2><p>Most active managers underperform indexes over time. Fees eat returns. Simplicity wins.</p><h2>Why Indexing Works</h2><p>Diversification. Lower fees. Tax efficiency. No emotional trading. Time in market beats timing the market.</p><h2>Getting Started</h2><p>Pick a broad market fund. Automate contributions. Ignore the noise. Stay the course for decades.</p>`,
    category: 'Finance',
    image: '/uploads/seed/blog_pic_6.png',
    daysAgo: 35,
    isPublished: true
  },
  {
    title: 'Building an Emergency Fund: How Much Is Enough?',
    subTitle: 'Stress-free savings strategies',
    description: `<h2>The Rule of Thumb</h2><p>3–6 months of expenses. More if your income is variable. Less if you have other safety nets.</p><h2>Where to Keep It</h2><p>High-yield savings. Easy access. Separate from daily accounts. Automate contributions.</p><h2>Rebuilding After Use</h2><p>Priority after any emergency. Cut non-essentials temporarily. Slow and steady wins.</p>`,
    category: 'Finance',
    image: '/uploads/seed/blog_pic_7.png',
    daysAgo: 88,
    isPublished: false
  },
  {
    title: 'Tax-Advantaged Accounts: 401k, IRA, HSA Explained',
    subTitle: 'Maximize your savings, minimize taxes',
    description: `<h2>401(k) Basics</h2><p>Employer-sponsored. Pre-tax or Roth options. Match is free money. Max it if you can.</p><h2>IRAs for Everyone</h2><p>Traditional: deduct now, pay later. Roth: pay now, tax-free growth. Income limits apply.</p><h2>HSA: The Triple Tax Advantage</h2><p>Pre-tax contributions. Tax-free growth. Tax-free withdrawals for medical. Best account most people underuse.</p>`,
    category: 'Finance',
    image: '/uploads/seed/blog_pic_8.png',
    daysAgo: 155,
    isPublished: true
  }
]
