# arribion-web-cms

```bash
Here are the routes extracted from the code you provided, organized by their full URL endpoints and HTTP methods.
## 📝 Blog Routes
These endpoints handle content management system (CMS) actions and public viewing. Assuming V1Router is mounted at /api/v1, the full paths for the Blog routes are:
## CMS Endpoints (Protected - Team Admin Only)

* POST /api/v1/blogs/ – Creates a new blog post (supports image upload).
* GET /api/v1/blogs/cms/all – Retrieves all blog posts, including drafts.
* GET /api/v1/blogs/:id – Retrieves a specific blog post by its ID.
* PATCH /api/v1/blogs/:id – Updates a specific blog post (supports image upload).
* DELETE /api/v1/blogs/:id – Deletes a blog post.
* POST /api/v1/blogs/:id/publish – Publishes a blog post.
* POST /api/v1/blogs/:id/unpublish – Unpublishes a blog post.
* POST /api/v1/blogs/:id/archive – Archives a blog post.

## Public Endpoints (No Auth Required / Optional Auth)

* GET /api/v1/blogs/ – Retrieves all published blog posts (Optional Auth).
* GET /api/v1/blogs/public/:slug – Retrieves a blog post by its slug (Optional Auth).
* GET /api/v1/blogs/category/:category – Retrieves blog posts filtered by category.
* GET /api/v1/blogs/author/:authorId – Retrieves blog posts filtered by author.

------------------------------
## 🌐 Global API Router Structure
The base endpoints mounted under the global V1 Router are:

| Route Path | Associated Router | Description |
|---|---|---|
| /api/v1/auth | authRouter | Authentication routes |
| /api/v1/projects | projectRouter | Portfolio projects routes |
| /api/v1/blogs | blogRouter | Blog routes (detailed above) |
| /api/v1/contact | contactRouter | Contact form routes |
| /api/v1/newsletter | newsletterRouter | Newsletter routes |
| /api/v1/schedule | scheduleRouter | Schedule and call routes |
| /api/v1/call-sessions | callSessionRouter | Call session management routes |
| /api/v1/call-requests | callRequestRouter | Call request management routes |
```
