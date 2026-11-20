// Comment fixtures
// `forTitle` (optional) ties a topic-specific comment to the post with that exact title;
// templates without it are generic and can land on any published post.
export const comments = [
  {
    name: 'Emma L.',
    content: 'Read this twice. The examples make it so much easier to apply.',
    isApproved: true
  },
  {
    name: 'Daniel M.',
    content: 'Thoughtful and practical. Sent it to two friends already.',
    isApproved: true
  },
  {
    name: 'Sofia R.',
    content: 'This is the kind of writing I come back to this blog for.',
    isApproved: true
  },
  {
    name: 'Lucas T.',
    content: 'Short, clear, and actually useful. Thanks for writing it.',
    isApproved: true
  },
  {
    name: 'Maya K.',
    content: 'I disagree with one point but the overall argument is strong.',
    isApproved: true
  },
  {
    name: 'Lucas T.',
    content: 'Would love a follow-up post that goes deeper on this.',
    isApproved: false
  },
  {
    name: 'Oliver P.',
    content: 'This article opened my eyes to new possibilities. Thank you for sharing!',
    isApproved: true
  },
  {
    name: 'Ava C.',
    content: 'Excellent breakdown of complex topics. Really helpful for beginners.',
    isApproved: false
  },
  {
    name: 'Noah B.',
    content: 'I implemented these strategies and already seeing results. Highly recommend!',
    isApproved: true
  },
  {
    name: 'Isabella H.',
    content: 'Could you elaborate more on the third point? Very curious about that aspect.',
    isApproved: false
  },
  // --- 25 new comment templates ---
  { name: 'James W.', content: 'Great article! Bookmarked for future reference.', isApproved: true },
  { name: 'Emma S.', content: 'I wish I had read this earlier. Super helpful!', isApproved: true },
  { name: 'Michael R.', content: 'The section on Docker was exactly what I needed. Thanks!', forTitle: 'Getting started with Docker and containerization', isApproved: true },
  { name: 'Sarah K.', content: 'Has anyone tried this with Kubernetes? Would love to hear experiences.', forTitle: 'Getting started with Docker and containerization', isApproved: true },
  { name: 'David L.', content: 'Clear and concise. More content like this please.', isApproved: true },
  { name: 'Jennifer M.', content: 'Totally changed my perspective. Sharing with my team.', isApproved: true },
  { name: 'Chris P.', content: 'The 50/30/20 rule changed how I manage my money.', forTitle: 'Budgeting 101: Take control of your finances', isApproved: true },
  { name: 'Amanda T.', content: 'Any recommendations for index funds in Europe?', forTitle: 'Index funds vs individual stocks', isApproved: true },
  { name: 'Robert H.', content: 'This helped me finally understand product-market fit.', forTitle: 'Finding product-market fit: A framework', isApproved: true },
  { name: 'Lisa G.', content: 'Bootstrap all the way! Great to see this perspective.', forTitle: 'Bootstrapping vs VC: Making the right choice', isApproved: true },
  { name: 'Kevin B.', content: 'The morning routine tips actually work. On week 3 now!', forTitle: 'Morning routines that actually stick', isApproved: true },
  { name: 'Michelle F.', content: 'Minimalism has been life-changing for me. Great write-up.', forTitle: 'Minimalism: Less stuff, more freedom', isApproved: true },
  { name: 'Thomas N.', content: 'Could you expand on the WebAssembly section?', forTitle: 'WebAssembly: The future of web performance?', isApproved: false },
  { name: 'Rachel C.', content: 'Interesting take on AI coding tools. Still skeptical but curious.', forTitle: 'The rise of AI-assisted coding tools', isApproved: true },
  { name: 'Brian J.', content: 'Emergency fund saved me last month. Everyone should have one.', forTitle: 'Building an emergency fund', isApproved: true },
  { name: 'Patricia D.', content: 'Credit score tips were gold. Already seeing improvement.', forTitle: 'Understanding credit scores', isApproved: true },
  { name: 'Steven V.', content: 'What about the downsides of indexing? Missing out on big winners?', forTitle: 'Index funds vs individual stocks', isApproved: false },
  { name: 'Nancy O.', content: 'Digital detox changed my productivity. Highly recommend trying it.', forTitle: 'Digital detox: Unplugging without guilt', isApproved: true },
  { name: 'Paul Z.', content: 'More real startup stories please. These are inspiring.', forTitle: 'From idea to launch: A startup founder\'s journey', isApproved: true },
  { name: 'Carol A.', content: 'The validation framework is spot on. Wish I had this years ago.', forTitle: 'Finding product-market fit: A framework', isApproved: true },
  { name: 'Mark E.', content: 'Any advice for someone considering a career switch to tech?', forTitle: 'Learning new technology to boost your career in software', isApproved: false },
  { name: 'Susan I.', content: 'The budget template suggestion would be helpful. Can you share one?', forTitle: 'Budgeting 101: Take control of your finances', isApproved: true },
  { name: 'Jason Y.', content: 'Product-market fit section was the clearest explanation I have read.', forTitle: 'Finding product-market fit: A framework', isApproved: true },
  { name: 'Linda U.', content: 'Love the practical, no-fluff approach. Keep it up!', isApproved: true },
  { name: 'Richard Q.', content: 'Do you have data on bootstrapped vs VC startup success rates?', forTitle: 'Bootstrapping vs VC: Making the right choice', isApproved: false },
  { name: 'Karen X.', content: 'Tried the minimalist approach. Donated 5 bags of stuff. Feels amazing.', forTitle: 'Minimalism: Less stuff, more freedom', isApproved: true },
  { name: 'George W.', content: 'Would love a follow-up on Kubernetes for beginners.', forTitle: 'Getting started with Docker and containerization', isApproved: true },
  // --- archive comment templates (topic-specific) ---
  { name: 'Hannah V.', content: 'We had a "known flaky" list with 30 tests on it. Sharing this with my lead today.', forTitle: 'The quiet cost of flaky tests', isApproved: true },
  { name: 'Omar S.', content: 'The quarantine-with-expiry rule is brilliant. Deleting a test nobody trusts is underrated.', forTitle: 'The quiet cost of flaky tests', isApproved: true },
  { name: 'Felix D.', content: 'Injecting a clock fixed half our flaky tests. Wish we had done it years ago.', forTitle: 'The quiet cost of flaky tests', isApproved: true },
  { name: 'Grace N.', content: 'Love the decision memo format. Writing down reversal conditions is such a good idea.', forTitle: 'Postgres or MongoDB? The decision memo we actually used', isApproved: true },
  { name: 'Tomasz K.', content: 'Exclusion constraints in Postgres are a hidden gem. Great example.', forTitle: 'Postgres or MongoDB? The decision memo we actually used', isApproved: true },
  { name: 'Leah P.', content: 'The five-alert rule is going straight into our next retro.', forTitle: 'Interview: running an on-call rotation people don\'t dread', isApproved: true },
  { name: 'Arjun M.', content: 'Urgent, actionable, novel. Simple and memorable. Thanks for this interview.', forTitle: 'Interview: running an on-call rotation people don\'t dread', isApproved: true },
  { name: 'Ruth B.', content: 'How do you handle on-call for very small teams with only three engineers?', forTitle: 'Interview: running an on-call rotation people don\'t dread', isApproved: false },
  { name: 'Nikolai F.', content: 'Point 4 about commenting on your own PR has caught so many of my bugs.', forTitle: 'Seven habits of readable pull requests', isApproved: true },
  { name: 'Chloe W.', content: '400 lines is generous! Our team aims for 250 and reviews are much faster.', forTitle: 'Seven habits of readable pull requests', isApproved: true },
  { name: 'Sam O.', content: 'The N+1 cache story is painfully familiar. Great write-up.', forTitle: 'What a 40ms regression taught us about caching', isApproved: true },
  { name: 'Yuki T.', content: 'Counting calls per request in traces is such a simple and useful check.', forTitle: 'What a 40ms regression taught us about caching', isApproved: true },
  { name: 'Diego R.', content: 'We had 300+ flags before an audit. Expiry dates in CI were the only thing that worked.', forTitle: 'Feature flags are a debt instrument', isApproved: true },
  { name: 'Ellen J.', content: 'Kill switches vs release flags is the distinction most teams miss.', forTitle: 'Feature flags are a debt instrument', isApproved: true },
  { name: 'Victor H.', content: 'Could you share an example pino config with redaction?', forTitle: 'A practical guide to structured logging in Node.js', isApproved: false },
  { name: 'Priscilla A.', content: 'The field vocabulary section saved me from a userId vs user_id mess.', forTitle: 'A practical guide to structured logging in Node.js', isApproved: true },
  { name: 'Marcus L.', content: 'Logging at info for everything... guilty. Fixing it this sprint.', forTitle: 'A practical guide to structured logging in Node.js', isApproved: true },
  { name: 'Ingrid S.', content: 'Our rotation is pasta Tuesday and soup Thursday. Can confirm, it removes so much stress.', forTitle: 'The case for a boring weeknight dinner', isApproved: true },
  { name: 'Benji C.', content: 'Never thought of a dinner rotation as a kindness to my future self. Love that.', forTitle: 'The case for a boring weeknight dinner', isApproved: true },
  { name: 'Alma G.', content: 'Charging my phone in the kitchen got me reading again. Twelve books this year!', forTitle: 'How to build a reading habit in twenty minutes a day', isApproved: true },
  { name: 'Joel E.', content: 'Permission to quit a book was the advice I needed. Thank you.', forTitle: 'How to build a reading habit in twenty minutes a day', isApproved: true },
  { name: 'Rosa M.', content: 'Beautiful interview. The box of failed pieces is such a lovely idea.', forTitle: 'Interview: a ceramicist on the value of slowness', isApproved: true },
  { name: 'Kenji W.', content: 'Where can I find a beginner pottery class like this?', forTitle: 'Interview: a ceramicist on the value of slowness', isApproved: false },
  { name: 'Tara L.', content: 'Raised my monitor this morning. My neck already thanks you.', forTitle: 'Ten small upgrades for a calmer home office', isApproved: true },
  { name: 'Owen B.', content: 'The end-of-day ritual tip is underrated. Laptop in the drawer, day is done.', forTitle: 'Ten small upgrades for a calmer home office', isApproved: true },
  { name: 'Mira F.', content: 'I started walking to work two days a week after reading this. The evenings feel different.', forTitle: 'What a year of walking to work changed', isApproved: true },
  { name: 'Caleb R.', content: 'Good shoes really are the whole game. Learned that the hard way.', forTitle: 'What a year of walking to work changed', isApproved: true },
  { name: 'Anja K.', content: 'Fifty names, ten conversations, a few customers. That ratio matched our experience exactly.', forTitle: 'Your first ten customers will not come from ads', isApproved: true },
  { name: 'Luis P.', content: 'Asking for advice instead of a sale doubled our reply rate.', forTitle: 'Your first ten customers will not come from ads', isApproved: true },
  { name: 'Ivy C.', content: 'The \'what would you do if this disappeared?\' question is gold for pricing.', forTitle: 'Case study: how a two-person team priced a B2B tool', isApproved: true },
  { name: 'Hugo D.', content: 'We are at $15/month and terrified to raise prices. This helped.', forTitle: 'Case study: how a two-person team priced a B2B tool', isApproved: true },
  { name: 'Nadia Y.', content: 'Grandfathering existing customers for 12 months is a really fair approach.', forTitle: 'Case study: how a two-person team priced a B2B tool', isApproved: true },
  { name: 'Peter Q.', content: 'Rare to read an honest piece about closing a company. Thank you for this.', forTitle: 'Interview: a founder on shutting down well', isApproved: true },
  { name: 'Selin A.', content: 'Building an export tool before shutdown is such a respectful move toward customers.', forTitle: 'Interview: a founder on shutting down well', isApproved: true },
  { name: 'Wes T.', content: 'As a non-technical founder, question 6 is the one I wish I had asked earlier.', forTitle: 'Eight questions to ask before hiring your first engineer', isApproved: true },
  { name: 'Frida N.', content: 'Is there a good way to assess a take-home project if I can\'t code?', forTitle: 'Eight questions to ask before hiring your first engineer', isApproved: false },
  { name: 'Zane M.', content: 'The rule of 72 explained in one paragraph. Bookmarked for my kids.', forTitle: 'A plain-language guide to compound interest', isApproved: true },
  { name: 'Clara H.', content: 'The Amira vs Ben example finally made it click for me.', forTitle: 'A plain-language guide to compound interest', isApproved: true },
  { name: 'Duncan R.', content: 'Sinking funds changed our December. Gifts were already paid for!', forTitle: 'Sinking funds: the budgeting trick for irregular expenses', isApproved: true },
  { name: 'Elif O.', content: 'We use bank \'pots\' for this and it works great.', forTitle: 'Sinking funds: the budgeting trick for irregular expenses', isApproved: true },
  { name: 'Maeve L.', content: 'Checking our fund fees saved us more than I expected. Great tip.', forTitle: 'Interview: a fee-only planner on the mistakes she sees most', isApproved: true },
  { name: 'Andre S.', content: 'Do you have recommendations for finding a fee-only planner?', forTitle: 'Interview: a fee-only planner on the mistakes she sees most', isApproved: false },
  { name: 'Lina B.', content: 'The $150 no-questions threshold has saved my partner and me so many arguments.', forTitle: 'Six money conversations every couple should have', isApproved: true },
  { name: 'Rafael G.', content: 'Starting with how money felt growing up is such a good first conversation.', forTitle: 'Six money conversations every couple should have', isApproved: true },
  { name: 'Bea W.', content: 'Proportional splitting made things feel so much fairer for us.', forTitle: 'Six money conversations every couple should have', isApproved: true },
  { name: 'Gus T.', content: 'Check out my channel for crypto tips!!!', isApproved: false },
  { name: 'Ola J.', content: 'Interesting read but I\'d love sources for the statistics mentioned.', isApproved: false },
  { name: 'Simon E.', content: 'Printed this one out for the office kitchen.', isApproved: true }
]

// Total comments generated by the seed (spread randomly across published posts)
export const commentConfig = { total: { min: 200, max: 260 } }
