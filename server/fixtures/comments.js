// Comment fixture templates — pool of 35 name+content pairs
// Seed script draws from this pool and applies commentDistribution config

export const commentTemplates = [
  { name: 'Emma L.', content: 'Great read!' },
  { name: 'Daniel M.', content: 'Very informative. Thanks for sharing.' },
  { name: 'Sofia R.', content: 'This really helped me understand the topic better.' },
  { name: 'Lucas T.', content: 'I never thought about it that way. Great perspective.' },
  { name: 'Maya K.', content: 'Could you elaborate on the second point?' },
  { name: 'Oliver P.', content: 'Spot on. I\'ve been doing this for years and it works.' },
  { name: 'Ava C.', content: 'Excellent breakdown of complex topics.' },
  { name: 'Noah B.', content: 'Implementing these strategies already. Highly recommend!' },
  { name: 'Isabella H.', content: 'Love it.' },
  { name: 'Ethan W.', content: 'This article opened my eyes. Bookmarked for later.' },
  { name: 'Charlotte D.', content: 'Concise and actionable. Exactly what I needed.' },
  { name: 'James F.', content: 'Finally someone who gets it. Thank you!' },
  { name: 'Amelia G.', content: 'Would love to see more on this topic.' },
  { name: 'Henry J.', content: 'Clear, practical advice. No fluff.' },
  { name: 'Ella N.', content: 'I shared this with my team. Great resource.' },
  { name: 'Alexander S.', content: 'As a beginner, this was super helpful. The step-by-step approach made it easy to follow.' },
  { name: 'Grace V.', content: 'The examples really drove the point home.' },
  { name: 'Benjamin X.', content: 'Disagree on point 3, but overall solid. Would love to see the data behind that claim.' },
  { name: 'Chloe Z.', content: 'Quick question: does this apply to remote teams?' },
  { name: 'William A.', content: 'Saved. Will revisit when I have more time.' },
  { name: 'Harper B.', content: 'Been looking for something like this. Perfect.' },
  { name: 'Jack C.', content: 'Short and sweet. Exactly my style.' },
  { name: 'Scarlett E.', content: 'More of this, please. Quality content.' },
  { name: 'Leo F.', content: 'Interesting take. Hadn\'t considered that angle.' },
  { name: 'Zoey H.', content: 'Practical tips I can use tomorrow.' },
  { name: 'Mason I.', content: 'Well researched. Appreciate the sources.' },
  { name: 'Lily K.', content: 'This changed how I approach the problem.' },
  { name: 'Liam M.', content: 'Straight to the point. No wasted words.' },
  { name: 'Aria N.', content: 'Could use a follow-up on edge cases. Especially the part about handling legacy systems.' },
  { name: 'Elijah O.', content: 'Solid advice for anyone starting out.' },
  { name: 'Penelope Q.', content: 'Wish I\'d read this sooner. Game changer.' },
  { name: 'Sebastian R.', content: 'The timing of this post is perfect for me.' },
  { name: 'Avery U.', content: 'Simple yet effective. Well written.' },
  { name: 'Logan Y.', content: 'Thanks for breaking it down step by step.' }
]

/**
 * Configuration for comment distribution during seeding.
 * Seed script uses this to assign comment counts per post and approval rates.
 */
export const commentDistribution = {
  highCommentCount: { min: 8, max: 15 },
  medCommentCount: { min: 3, max: 7 },
  lowCommentCount: { min: 1, max: 3 },
  zeroCommentPosts: 2, // number of published posts with 0 comments
  approvalRate: 0.78 // 78% approved
}
