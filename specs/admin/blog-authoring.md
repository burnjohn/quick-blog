# Spec: Admin blog authoring (Add Blog)
**Spec ID:** SPEC-AUTHOR-1   **Status:** As-built (branch chore/editorial-redesign-docs, 2026-11-20)
**Code:** `client/src/pages/admin/AddBlog/AddBlog.jsx`, `client/src/components/admin/blog/{CoverUpload,CategorySelect,PublishToggle,AiDraftButton}/*`, `client/src/components/ui/{Input,Button}/*`, `client/src/hooks/api/mutations/{useCreateBlog,useBlogGenerator}/*`, `client/src/hooks/core/useApiMutation/useApiMutation.js`, `client/src/constants/categories.js`, `server/src/routes/blogRoutes.js`, `server/src/controllers/blogController.js` (`addBlog`, `generateContent`), `server/src/validators/blogValidator.js` (`validateBlogInput`), `server/src/middleware/{multer,rateLimiter,errorHandler}.js`, `server/src/configs/gemini.js`, `server/src/models/Blog.js`, `server/src/utils/imageUrl.js`

Flow diagrams: [post-creation-flow.md](../../docs/flows/post-creation-flow.md), [post-creation-backend.md](../../docs/flows/post-creation-backend.md).

## Summary
`/admin/addBlog` is a two-panel editor. The left panel (`Headline`) holds the title, subtitle and a Quill rich-text body, with an AI drafting button that asks Google Gemini to write the body from the title. The dark right panel (`Cover & filing`) holds the cover image, the category, a `Publish Now` switch and the `Add Blog` submit button. The client validates the form, then sends it to `POST /api/blog/add` as multipart form data. The server stores the image with Multer and validates the fields before it creates the blog.

## Scope / Out of scope
**In scope:** the Add Blog page and its components, client validation, `POST /api/blog/add` (Multer, `validateBlogInput`, `addBlog`), and `POST /api/blog/generate` (Gemini).

**Out of scope:** editing existing blogs (not implemented), autosave, scheduling, multiple images, and the blog list ([blog-list.md](blog-list.md)).

## User-visible behavior
- The header shows the eyebrow `New story` and the title `Add Blog`. On the right, a status line reads `FILING AS DRAFT`, or `FILING TO THE FRONT PAGE` while `Publish Now` is on.
- **Headline panel:**
  - `Blog Title` (large serif input) and `Sub Title`, both with the placeholder `Type here`.
  - `Blog Description *` with a yellow `✦ GENERATE WITH AI` button and the hint `WRITE A HEADLINE FIRST TO ENABLE AI DRAFTING`. Once a title is typed, the hint changes to `AI DRAFTS THE BODY FROM YOUR HEADLINE`.
  - A Quill `snow` editor, 384 px tall.
- **Cover & filing panel:**
  - `Upload Thumbnail *`: a dashed halftone drop area with a `+` stamp, `Choose a cover image` and `PNG, JPG or WebP`. Once a file is chosen it shows a 16:10 preview and the file name.
  - `Blog Category *`.
  - The `Publish Now` switch, with the helper text `SAVED AS A DRAFT` / `GOES LIVE ON SAVE`.
  - A full-width yellow `ADD BLOG` button.
- While AI drafting runs, the button reads `Generating...` with a spinner, and a halftone overlay covers the editor with the text `Drafting from your headline…`.

## Acceptance criteria

### Server: create (`POST /api/blog/add`)
| ID | Requirement |
|----|-------------|
| AC-AUTHOR-01 | THE endpoint SHALL require a valid JWT from any role ([auth.md](auth.md)). |
| AC-AUTHOR-02 | THE endpoint SHALL accept `multipart/form-data` with a text field `blog` (a JSON string `{ title, subTitle, description, category, isPublished }`) and one file field `image`. |
| AC-AUTHOR-03 | THE upload middleware SHALL accept only the MIME types `image/jpeg`, `image/jpg`, `image/png`, `image/gif` and `image/webp`, each up to 5 MB (`5 * 1024 * 1024` bytes). |
| AC-AUTHOR-04 | THE upload middleware SHALL store the file in `server/uploads/blogs/` (creating the folder if it is missing) as `blog-<Date.now()>-<random 0…1e9><original extension>`. |
| AC-AUTHOR-05 | IF the file type is not allowed THEN THE SYSTEM SHALL respond `500 { success:false, message:'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' }`. IF the file exceeds 5 MB THEN it SHALL respond `500 { success:false, message:'File too large' }`. |
| AC-AUTHOR-06 | THE SYSTEM SHALL validate after the upload has run and collect every applicable error: `title` missing or trimmed length < 3 → `Title must be at least 3 characters`; `description` missing or trimmed length < 10 → `Description must be at least 10 characters`; `category` empty → `Category is required`; no file → `Image is required`. |
| AC-AUTHOR-07 | IF any of the AC-AUTHOR-06 checks fail THEN THE SYSTEM SHALL respond `400 { success:false, message:'Validation failed', errors:[…] }`. |
| AC-AUTHOR-08 | WHEN the input is valid THE SYSTEM SHALL create a Blog with the submitted `title`, `subTitle`, `description`, `category` and `isPublished`, plus `image = '/uploads/blogs/<filename>'`, `author = req.user.userId` and `authorName = req.user.name`. |
| AC-AUTHOR-09 | WHEN the Blog is created THE SYSTEM SHALL respond `201 { success:true, message:'Blog added successfully', blog }`, with `blog.image` turned into an absolute URL (`SERVER_URL`, or else `<protocol>://<host>` of the request). |
| AC-AUTHOR-10 | `subTitle` SHALL be optional on the server. `isPublished` SHALL default to `false` when it is omitted. |

### Server: AI draft (`POST /api/blog/generate`)
| ID | Requirement |
|----|-------------|
| AC-AUTHOR-11 | THE endpoint SHALL require a valid JWT. |
| AC-AUTHOR-12 | THE endpoint SHALL allow at most 3 requests per minute per IP. WHEN the limit is exceeded it SHALL respond `429 { success:false, message:'Too many generation requests. Please wait a moment.' }`. |
| AC-AUTHOR-13 | IF `prompt` is missing or blank THEN THE SYSTEM SHALL respond `400 { success:false, message:'Prompt is required' }`. |
| AC-AUTHOR-14 | WHEN `prompt` is valid THE SYSTEM SHALL call Gemini model `gemini-2.0-flash` with `<prompt> + ' Generate a blog content for this topic in simple text format'` (using `GEMINI_API_KEY`) and respond `200 { success:true, content:<response.text> }`. |
| AC-AUTHOR-15 | IF the Gemini call throws THEN THE SYSTEM SHALL pass the error to the global error handler, which responds `500 { success:false, message:<error message> }`. |

### Data
| ID | Requirement |
|----|-------------|
| AC-AUTHOR-16 | THE `Blog` model SHALL require `title`, `description`, `category`, `author` (ObjectId ref `User`), `authorName` and `image`. `subTitle` SHALL be optional, `isPublished` SHALL default to `false`, and the model SHALL keep `createdAt`/`updatedAt` timestamps. |

### UI: form
| ID | Requirement |
|----|-------------|
| AC-AUTHOR-17 | THE page SHALL be one `<form noValidate>` with the header eyebrow `New story` and an `h1` `Add Blog`. |
| AC-AUTHOR-18 | THE header status line SHALL read `Filing to the front page` WHILE `Publish Now` is on and `Filing as draft` otherwise. |
| AC-AUTHOR-19 | THE Headline panel SHALL contain the text inputs `Blog Title` and `Sub Title` (placeholder `Type here`), the label `Blog Description` with a `*` marker, and a Quill editor with the `snow` theme that is created only once per mount. |
| AC-AUTHOR-20 | THE CoverUpload SHALL be a `<label for="image">` that wraps a visually hidden `<input type="file" id="image" accept="image/*">`. Before a file is chosen it SHALL show `Choose a cover image` and `PNG, JPG or WebP`. After a file is chosen it SHALL show an `<img alt="Upload preview">` (16:10, object-cover) built with `URL.createObjectURL`, and the file name. |
| AC-AUTHOR-21 | THE CategorySelect SHALL be a `<select id="category">` labeled `Blog Category` with a `*` marker. Its options SHALL be `Technology`, `Startup`, `Lifestyle` and `Finance` (`BLOG_CATEGORIES` without `All`), and the default SHALL be `Startup`. |
| AC-AUTHOR-22 | THE PublishToggle SHALL be a native checkbox (`id="isPublished"`, visually hidden) labeled `Publish Now`, drawn as a switch. It SHALL default to unchecked. Its helper text SHALL read `Goes live on save` WHEN checked and `Saved as a draft` otherwise. |
| AC-AUTHOR-23 | WHEN the form is submitted THE client SHALL validate in this order and stop at the first failure with an error toast: title blank (after trim) → `Please enter a blog title`; subtitle blank → `Please enter a sub title`; no image → `Please select an image`; category empty → `Please select a category`; editor HTML empty or `<p><br></p>` → `Please add blog description`. |
| AC-AUTHOR-24 | WHEN client validation passes THE client SHALL `POST /api/blog/add` with a `FormData` body: `blog = JSON.stringify({ title, subTitle, description: <Quill root innerHTML>, category, isPublished })` and `image = <File>`. The title and subtitle SHALL be sent untrimmed. |
| AC-AUTHOR-25 | WHILE the create request is in flight THE `Add Blog` button SHALL show a spinner with `Loading...` and be disabled. The category select and the publish switch SHALL be disabled too. |
| AC-AUTHOR-26 | WHEN creation succeeds THE client SHALL toast `Blog created successfully!` and reset the form: image cleared, title and subtitle emptied, editor emptied, category `Startup`, publish switch off. |
| AC-AUTHOR-27 | IF creation fails THEN THE client SHALL toast the server `message` (for example `Validation failed`), or else the transport error message, or else `Failed to create blog.`, and SHALL keep every field as it was. |

### UI: AI draft
| ID | Requirement |
|----|-------------|
| AC-AUTHOR-28 | THE `✦ Generate with AI` button SHALL be disabled WHILE the title is empty, WHILE generating, and WHILE creating. Its hint text (linked through `aria-describedby="ai-draft-hint"`) SHALL read `Write a headline first to enable AI drafting` WHEN the title is empty and `AI drafts the body from your headline` otherwise. |
| AC-AUTHOR-29 | WHEN the button is clicked and the title is not blank after trimming THE client SHALL `POST /api/blog/generate` with `{ prompt: <title> }`. IF the title is only whitespace THEN it SHALL toast `Please enter a title` and send nothing. |
| AC-AUTHOR-30 | WHILE generating THE button SHALL read `Generating...` with a spinner and set `aria-busy="true"`. An overlay (`role="status"`) with the text `Drafting from your headline…` SHALL cover the editor, and the `Add Blog` button SHALL be disabled. |
| AC-AUTHOR-31 | WHEN generation succeeds THE client SHALL toast `Content generated successfully!`, convert the returned Markdown to HTML with `marked.parse` and store it in the hook, then assign the value returned by `generateContent` to the editor's root `innerHTML`. Known gaps describes what this actually inserts. |
| AC-AUTHOR-32 | IF generation fails THEN THE client SHALL toast the server `message` (for example the rate-limit text), or else the transport error message, or else `Something went wrong. Please try again.`, and leave the editor unchanged. |

### Accessibility & motion
| ID | Requirement |
|----|-------------|
| AC-AUTHOR-33 | THE title and subtitle inputs SHALL have associated `<label>`s. The cover drop area and the publish switch SHALL show a 3 px signal focus outline WHEN their hidden input has `:focus-visible`. |
| AC-AUTHOR-34 | THE publish switch knob SHALL slide 20 px over 0.4 s WHEN toggled. The AI button label SHALL cross-fade with a 6 px vertical slide between idle and busy. |
| AC-AUTHOR-35 | THE two panels SHALL rise in on mount (20 px, 0.5 s), the second one 0.06 s after the first. |

### Responsive
| ID | Requirement |
|----|-------------|
| AC-AUTHOR-36 | BELOW `lg` (1024 px) THE Cover & filing panel SHALL stack below the Headline panel. FROM `lg` up the panels SHALL sit side by side (`1fr` / 360 px) and the filing panel SHALL be sticky, 24 px from the top. |
| AC-AUTHOR-37 | THE editor container SHALL be 384 px tall (`h-96`), with 48 px of bottom padding below `sm` and 40 px from `sm` up. |

## Contracts

```http
POST /api/blog/add
Authorization: <token>
Content-Type: multipart/form-data; boundary=…
  blog  = {"title":"…","subTitle":"…","description":"<p>…</p>","category":"Technology","isPublished":false}
  image = <file>

201 { "success": true, "message": "Blog added successfully", "blog": Blog }
400 { "success": false, "message": "Validation failed", "errors": ["Image is required"] }
500 { "success": false, "message": "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." | "File too large" }

POST /api/blog/generate
Authorization: <token>
{ "prompt": "My headline" }

200 { "success": true, "content": "## Markdown …" }
400 { "success": false, "message": "Prompt is required" }
429 { "success": false, "message": "Too many generation requests. Please wait a moment." }
```

The global `/api` limiter (100 requests/min/IP, `server.js` only) also applies to both endpoints.

## Edge cases
- **No image chosen but everything else filled:** the client blocks the request with `Please select an image`. A direct API call without `image` gets `400 Image is required`.
- **Choosing a file and then cancelling the picker:** `e.target.files[0]` is `undefined`. The image is cleared, and the drop area returns to `Choose a cover image`.
- **An SVG or AVIF file** passes the client's `accept="image/*"` but is rejected by the server with `500 Invalid file type…`.
- **A 1- or 2-character title** passes client validation but the server rejects it (`Title must be at least 3 characters`). The client toasts only `Validation failed`.
- **A short body** such as `<p>Hi</p>` passes the client, and also passes the server's 10-character check, because the HTML tags count toward the length.

## Known gaps
- **AI draft wipes the editor on first use.** `useBlogGenerator.generateContent` returns `generatedContent` from a stale closure (still `null`), so the editor's HTML is set to empty on the first success. Each later click inserts the *previous* result.
- **Multer runs before validation.** On a `400`, the uploaded file stays on disk (orphan). Multer errors come back as `500`, not `400`/`413`.
- **A malformed `blog` JSON** makes `JSON.parse` throw, which returns `500`. The field is also parsed twice (validator and controller).
- **Loose server validation.** `category` is not checked against the category list, `isPublished` is stored as Mongoose casts it, there are no maximum lengths, and the `description` length counts HTML tags.
- **Stored XSS.** `description` HTML is stored and later rendered without sanitizing.
- **Client and server disagree on several rules.** The client requires `subTitle` but the server does not. CoverUpload says `PNG, JPG or WebP`, accepts `image/*`, and does not mention that GIF is allowed. The client does not enforce the server's minimum lengths, and it does not show `errors[]`, only `Validation failed`.
- **The cover input is never disabled.** CoverUpload has a `disabled` prop, but AddBlog does not pass it, so the cover can be changed during submit.
- **Object URLs leak.** A new `URL.createObjectURL` is created on every render and never revoked.
- **Debug logging.** `AddBlog` and `useCreateBlog` `console.log` the full payload and the file on every submit.
- **The public list goes stale.** After a successful create, `AppContext.blogs` is not refreshed.
- **Abandoned drafts are lost.** There is no "unsaved changes" prompt, and the form state is lost on navigation.

## Related specs
- [blog-list.md](blog-list.md): where the new blog appears, and publish/unpublish later.
- [dashboard.md](dashboard.md): `✦ Write a story` links here; the counts include the new blog.
- [auth.md](auth.md): token and 401 handling.
