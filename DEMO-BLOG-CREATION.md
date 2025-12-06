# Demo: Implementing Blog Creation Page with Cursor

This guide demonstrates how to implement a complete blog creation feature in QuickBlog using Cursor's AI capabilities, Figma integration, and local image uploads.

## Overview

In this demo, you'll learn how to:
- Use Cursor's **Planning Mode** to analyze and implement Figma designs
- Create a full-featured blog creation page with rich text editor
- Handle image uploads with local storage
- Build backend API endpoints for blog creation
- Test the complete blog creation workflow

## Prerequisites

Before starting, ensure you have:
- QuickBlog server running (`npm run server` in `server/`)
- QuickBlog client running (`npm run dev` in `client/`)
- MongoDB running via Docker

---

## Step-by-Step Implementation

### 1. Checkout Feature Branch

Create and switch to the feature branch for this work:

```bash
git checkout -b feature/implement-post-creation
```

### 2. Review Figma Design

Navigate to the QuickBlog Figma design file and review the blog creation page:
- **Design URL**: [QuickBlog - Add Blog Page](https://www.figma.com/design/b0ILCMLfSEsx7NUclZAg3E/QuickBlog?node-id=37-304&t=osyxYXSbOYRVkpdS-4)
- Go through the layout, form fields, and interaction patterns
- Note the required fields: thumbnail, title, subtitle, description (rich text), category, publish status

### 3. Use Cursor's Agent Mode in Planning Mode

This is where the magic happens! Follow these steps carefully:

1. **Open a new Cursor chat**
2. **Switch to Planning Mode** within Agent Mode
3. **Attach relevant folders** using `@` mention:
   - `@client/src` (for UI implementation)
   - `@server/src` (for backend implementation)
   - `@server/src/routes` (for API routes)
4. **Paste the prompt below** into the chat

#### The Prompt

**Important**: Feel free to write your prompt in your own style! The key is to attach the design image/screenshot and provide clear context. Here's an example prompt you can use or adapt:

```
Implement the next design with functionality for creating a blog post.

We have to implement UI @client/src and server functionality @server/src

For UI:
- It should be a separate page
- Check current pages and components structure
- Follow the code style guidelines
- Use the rich text editor from our @package.json (Quill)
- Use local file upload for images

For the backend:
- Check existing routes structure @server/src/routes
- Follow the code style guidelines
- Use existing DB methods
- Images are stored locally in public/uploads/blogs

Make sure to handle all loading states, form validation, and error cases properly.
```

> **Tip**: Attach a screenshot or the Figma design link along with your prompt. Cursor's AI will understand the design and implement accordingly. The more context you provide through attached files (`@client/src`, `@server/src`), the better the results!

### 4. Review the Plan

Cursor will generate a detailed implementation plan. Carefully review it and ensure:
- ✅ All UI components are identified (page, form fields, editor)
- ✅ Backend API endpoints are planned (create blog)
- ✅ Local image upload handling is included
- ✅ Form validation is considered
- ✅ Authentication middleware is included
- ✅ Rich text editor (Quill) setup is planned
- ✅ Error handling is comprehensive
- ✅ Routing and navigation updates are included

If you notice any gaps or want to adjust the approach, provide feedback to Cursor before proceeding.

### 5. Compare AI Models (Recommended)

For the best results, it's recommended to test this feature implementation with multiple AI models:

**Recommended Models**:
1. **Claude 4.5 Sonnet** - Excellent at understanding complex requirements and generating clean, well-structured code
2. **Composer-1** - Great at following project conventions and maintaining consistency

**How to Compare**:
1. Run the same prompt with both models (create separate branches if needed)
2. Compare the generated code quality
3. Check which model better follows your project's code style
4. Evaluate error handling and edge cases
5. Choose the implementation you prefer or combine the best parts

### 6. Execute the Plan

Once you're satisfied with the plan:
1. Click **"Run Plan"** or **"Start Building"**
2. Cursor will create/modify the necessary files
3. Monitor the progress and review changes as they're made
4. Approve file changes when prompted

Cursor will:
- Create the blog creation page component
- Set up the Quill rich text editor
- Handle local image uploads via Multer
- Create/update backend API routes
- Add authentication middleware
- Update navigation and routing
- Add proper error handling

### 7. Test the Blog Creation Workflow

Once implementation is complete, thoroughly test the feature:

#### 7.1 Login as Admin

1. Navigate to: `http://localhost:5173/admin`
2. Get admin credentials from `server/fixtures/users.js`:
   - **Email**: `admin@quickblog.com`
   - **Password**: `admin123`
3. Log in to the admin panel

#### 7.2 Navigate to Add Blog Page

1. Click on **"Add blogs"** in the sidebar navigation
2. Navigate to: `http://localhost:5173/admin/add-blog`
3. Verify the page loads correctly and matches the Figma design

#### 7.3 Test Image Upload

1. Click on the **"Upload Thumbnail"** area
2. Select an image from your computer (JPG, PNG, GIF, or WebP)
3. Verify the image preview appears
4. Try uploading different image formats and sizes
5. Ensure the preview updates correctly

#### 7.4 Fill in Blog Details

1. **Blog Title**: Enter a descriptive title (e.g., "Getting Started with React Hooks")
2. **Sub Title**: Enter a subtitle (e.g., "A comprehensive guide for beginners")
3. **Blog Description**: 
   - Click inside the rich text editor
   - Try the formatting options (bold, italic, lists, links)
   - Add some sample content

#### 7.5 Complete the Form

1. **Blog Category**: Select a category from the dropdown (e.g., "Technology")
2. **Publish Now**: Check or uncheck based on whether you want to publish immediately
3. Review all fields to ensure everything is filled in correctly

#### 7.6 Submit the Blog

1. Click the **"Add Blog"** button
2. You should see a loading state on the button
3. Wait for the success toast notification: "Blog added successfully!"
4. The form should reset to empty state after successful submission
5. If there are validation errors, appropriate error messages should appear

#### 7.7 Verify Blog in Database

1. Navigate to: `http://localhost:5173/admin/list-blog`
2. Your newly created blog should appear in the list
3. Verify all fields are correct:
   - Image displays properly
   - Title and subtitle are correct
   - Category is correct
   - Published status matches your selection

#### 7.8 View Blog on Public Site

1. If you published the blog, navigate to: `http://localhost:5173`
2. Find your blog in the blog grid
3. Click to open the blog detail page
4. Verify:
   - Image loads correctly from local storage
   - Title and subtitle display correctly
   - Rich text content renders with proper formatting
   - Category is displayed
   - All HTML formatting is preserved

#### 7.9 Test Edge Cases

**Test Form Validation**:
- Try submitting without an image → Should show error
- Try submitting without a title → Should show error
- Try submitting without a subtitle → Should show error
- Try submitting with empty description → Should show error
- Try submitting without selecting category → Should show error

**Test Error Handling**:
- Disconnect internet and try to submit → Should show network error
- Try uploading a very large image (>10MB) → Should show file size error
- Log out and try to access the page → Should redirect to login

**Test Rich Text Editor**:
- Add bold, italic, underline text
- Create ordered and unordered lists
- Add links
- Try all formatting options
- Copy/paste formatted content from Word or Google Docs

---

## Expected Results

After completing all steps, you should have:
- ✅ A fully functional blog creation page matching the Figma design
- ✅ Working image upload with local storage
- ✅ Rich text editor with formatting toolbar
- ✅ Complete form validation with helpful error messages
- ✅ Proper loading states during submission
- ✅ Success/error notifications using React Hot Toast
- ✅ Responsive design that works on mobile and desktop
- ✅ Backend API endpoints for blog creation
- ✅ Proper authentication and authorization
- ✅ Database integration with MongoDB
- ✅ Complete error handling throughout
