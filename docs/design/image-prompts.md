# Cover photo prompts (Gemini)

Each of the 42 posts gets its own photographic cover, all in one visual
language, so the home page reads like a photo-led magazine.

## How to use

1. For each row below, paste **Style block + Subject** into Gemini. Ask for a
   **4:3 landscape** image, ideally 1600×1200 or larger.
2. Save the result as `server/uploads/seed/photos/<file>.jpg`, using the name
   from the `File` column. `.png` and `.webp` also work.
3. Re-run the seed: `cd server && npm run seed`. It wipes and recreates the
   local database. A post picks up its photo automatically when the file
   exists (see `withPhotoCover` in `server/fixtures/blogs.js`). Posts without
   a photo keep their current cover, so you can do this in batches.

## Style block (prepend to every prompt)

```
Editorial magazine cover photograph, 4:3 landscape. Calm, considered composition
with generous negative space on one side for a headline overlay. Soft natural
daylight, warm off-white and paper-beige tones (#F4F1EA), deep near-black
shadows (#111111), muted neutrals; exactly ONE vivid signal-yellow (#FFCE00)
accent object in the scene. Shot on a 35mm lens, shallow depth of field, fine
film grain, matte finish. Realistic, not illustrated, not 3D-rendered.
No text, no letters, no logos, no watermarks, no UI screenshots, no recognizable
real people or brands; if people appear, show hands or figures from behind.
```

## Subjects

| # | File | Category | Post | Subject |
|---|---|---|---|---|
| 01 | `a-detailed-step-by-step-guide-to-manage-your-lifestyle` | Lifestyle | A detailed step by step guide to manage your lifestyle | An open paper planner on a linen tablecloth beside a glass of water and a yellow pencil, morning light across the page |
| 02 | `how-to-create-an-effective-startup-roadmap-or-ideas` | Startup | How to create an effective startup roadmap or ideas | A long wall of sticky notes and string forming a timeline in an empty loft office, one yellow note at the far end |
| 03 | `learning-new-technology-to-boost-your-career-in-software` | Technology | Learning new technology to boost your career in software | A stack of well-worn programming books with paper bookmarks, a laptop half-closed behind, a yellow highlighter on top |
| 04 | `the-ultimate-guide-to-work-life-balance-in-2025` | Lifestyle | The ultimate guide to work-life balance in 2025 | A closed laptop on a desk by an open window, a yellow bicycle leaning outside in the evening light |
| 05 | `understanding-modern-javascript-frameworks-in-depth` | Technology | Understanding modern JavaScript frameworks in depth | Close-up of interlocking wooden building blocks forming layered towers on a desk, one yellow block in the middle layer |
| 06 | `from-idea-to-launch-a-startup-founder-s-journey` | Startup | From idea to launch: A startup founder's journey | A cardboard prototype on a workbench next to a polished finished product, a yellow cutting mat beneath |
| 07 | `getting-started-with-docker-and-containerization` | Technology | Getting started with Docker and containerization | Neat rows of stacked shipping containers at a port at dawn from a high angle, one yellow container |
| 08 | `the-rise-of-ai-assisted-coding-tools` | Technology | The rise of AI-assisted coding tools | Two hands on a mechanical keyboard, a second pair of robotic-looking hands mirrored in the monitor glow, yellow keycap on Enter |
| 09 | `webassembly-the-future-of-web-performance` | Technology | WebAssembly: The future of web performance? | A long-exposure photo of light trails on a dark highway at night, one streak yellow, shot from an overpass |
| 10 | `minimalism-less-stuff-more-freedom` | Lifestyle | Minimalism: Less stuff, more freedom | A nearly empty white room with one chair and one yellow cushion, long shadow from a window |
| 11 | `morning-routines-that-actually-stick` | Lifestyle | Morning routines that actually stick | A coffee cup, a folded newspaper and a yellow alarm clock on a kitchen counter at sunrise |
| 12 | `digital-detox-unplugging-without-guilt` | Lifestyle | Digital detox: Unplugging without guilt | A smartphone face-down in a wicker basket on a porch step, a yellow paperback open beside it |
| 13 | `finding-product-market-fit-a-framework` | Startup | Finding product-market fit: A framework | A single yellow puzzle piece fitting into an almost complete monochrome puzzle on a table |
| 14 | `bootstrapping-vs-vc-making-the-right-choice` | Startup | Bootstrapping vs VC: Making the right choice | Two paths diverging in a pale gravel field from above, one path lined by a yellow rope |
| 15 | `budgeting-101-take-control-of-your-finances` | Finance | Budgeting 101: Take control of your finances | A row of labelled-free envelopes with coins and folded bills on a desk, a yellow calculator |
| 16 | `index-funds-vs-individual-stocks` | Finance | Index funds vs individual stocks | A large basket of assorted fruit next to a single yellow lemon on a plain table, studio daylight |
| 17 | `building-an-emergency-fund` | Finance | Building an emergency fund | A glass jar filled with coins on a windowsill during rain, a yellow umbrella blurred in the background |
| 18 | `understanding-credit-scores` | Finance | Understanding credit scores | A row of credit cards fanned out face-down on dark slate, one card yellow, raking light |
| 19 | `the-quiet-cost-of-flaky-tests` | Technology | The quiet cost of flaky tests | A row of lab test tubes in a rack, one slightly tipped and glowing yellow, clean white bench |
| 20 | `the-case-for-a-boring-weeknight-dinner` | Lifestyle | The case for a boring weeknight dinner | A simple bowl of pasta on a wooden table with a yellow linen napkin, overhead, warm lamp light |
| 21 | `your-first-ten-customers-will-not-come-from-ads` | Startup | Your first ten customers will not come from ads | A hand writing a note on a small card at a café table, a stack of ten envelopes tied with yellow string |
| 22 | `a-plain-language-guide-to-compound-interest` | Finance | A plain-language guide to compound interest | A young sapling and a mature tree side by side in a field, a yellow watering can at the base |
| 23 | `postgres-or-mongodb-the-decision-memo-we-actually-used` | Technology | Postgres or MongoDB? The decision memo we actually used | Two neat stacks of paper files on a meeting table, a yellow pen lying between them, chairs pushed in |
| 24 | `how-to-build-a-reading-habit-in-twenty-minutes-a-day` | Lifestyle | How to build a reading habit in twenty minutes a day | An armchair with an open book and a yellow kitchen timer on the armrest, afternoon window light |
| 25 | `case-study-how-a-two-person-team-priced-a-b2b-tool` | Startup | Case study: how a two-person team priced a B2B tool | Two coffee mugs on a whiteboard-covered desk, a yellow price tag hanging from a desk lamp |
| 26 | `sinking-funds-the-budgeting-trick-for-irregular-expenses` | Finance | Sinking funds: the budgeting trick for irregular expenses | Several small ceramic jars of different sizes in a row on a shelf, one yellow, coins visible |
| 27 | `interview-running-an-on-call-rotation-people-don-t-dread` | Technology | Interview: running an on-call rotation people don't dread | A pager-style phone on a nightstand next to a calm sleeping-mask and a yellow lamp, dim night |
| 28 | `interview-a-ceramicist-on-the-value-of-slowness` | Lifestyle | Interview: a ceramicist on the value of slowness | Clay-covered hands shaping a bowl on a potter's wheel, a yellow glazed bowl drying on the shelf |
| 29 | `interview-a-founder-on-shutting-down-well` | Startup | Interview: a founder on shutting down well | An empty office at dusk with chairs stacked, a single yellow box packed on the desk |
| 30 | `interview-a-fee-only-planner-on-the-mistakes-she-sees-most` | Finance | Interview: a fee-only planner on the mistakes she sees most | A tidy consultation desk with two chairs, a notepad and a yellow folder, figure seen from behind |
| 31 | `seven-habits-of-readable-pull-requests` | Technology | Seven habits of readable pull requests | Printed pages of code with red and yellow margin notes spread on a desk, a pen resting on top |
| 32 | `ten-small-upgrades-for-a-calmer-home-office` | Lifestyle | Ten small upgrades for a calmer home office | A tidy home office corner with a plant, a lamp, and a yellow desk mat, soft morning light |
| 33 | `eight-questions-to-ask-before-hiring-your-first-engineer` | Startup | Eight questions to ask before hiring your first engineer | Two chairs facing each other at a small round table, a yellow notebook open with a question list (no legible text) |
| 34 | `six-money-conversations-every-couple-should-have` | Finance | Six money conversations every couple should have | Two hands holding mugs across a kitchen table with a household bill and a yellow sticky note between them |
| 35 | `what-a-40ms-regression-taught-us-about-caching` | Technology | What a 40ms regression taught us about caching | A stopwatch on a server rack shelf, blurred blinking server lights, one yellow cable |
| 36 | `what-a-year-of-walking-to-work-changed` | Lifestyle | What a year of walking to work changed | Worn walking shoes on a city sidewalk crossing at morning, a yellow crosswalk stripe |
| 37 | `the-pitch-deck-is-not-the-company` | Startup | The pitch deck is not the company | An empty presentation room with a blank projector screen and one yellow chair in the front row |
| 38 | `why-your-raise-disappeared-a-case-study-in-lifestyle-creep` | Finance | Why your raise disappeared: a case study in lifestyle creep | A shopping bag spilling small luxury items onto a hallway floor, a yellow receipt curling |
| 39 | `feature-flags-are-a-debt-instrument` | Technology | Feature flags are a debt instrument | A panel of physical toggle switches on a vintage control board, one switch yellow and flipped |
| 40 | `against-productivity-content` | Lifestyle | Against productivity content | A hammock in a garden with an unopened stack of self-help books on the grass, a yellow blanket |
| 41 | `a-practical-guide-to-structured-logging-in-node-js` | Technology | A practical guide to structured logging in Node.js | Neatly sawn logs stacked in an ordered woodpile, one log end painted yellow, overcast light |
| 42 | `local-first-software-explained-without-the-hype` | Technology | Local-first software, explained without the hype | A laptop on a train table by a window with countryside passing, a yellow notebook, no network in sight |

## Optional: images inside articles

If you also want one illustration in the middle of each article, generate a
second image per post with the same style block, the subject plus
"detail shot, different angle", and save it as `<file>-inline.jpg`. Tell me
when they're in place: inserting them into the article HTML is a separate
small seed change.
