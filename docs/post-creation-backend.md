# Post Creation — Backend Flow (API → Database)

## Request Lifecycle

```mermaid
sequenceDiagram
    participant C as Client
    participant Auth as auth
    participant Multer as multer
    participant V as validateBlogInput
    participant Ctrl as addBlog
    participant DB as MongoDB

    C->>Auth: POST /api/blog/add<br/>(multipart/form-data + JWT)

    Auth->>Auth: jwt.verify(token)
    Note right of Auth: req.user = { userId, name }
    Auth->>Multer: next()

    Multer->>Multer: Validate type & size
    Note right of Multer: jpeg/png/gif/webp, ≤ 5 MB
    Multer->>Multer: Save to uploads/blogs/
    Note right of Multer: req.file = { filename }
    Multer->>V: next()

    V->>V: JSON.parse(req.body.blog)
    Note right of V: title ≥ 3, desc ≥ 10,<br/>category required, file exists
    V->>Ctrl: next()

    Ctrl->>Ctrl: Build image path
    Ctrl->>DB: Blog.create({ title, subTitle,<br/>description, category, image,<br/>isPublished, author, authorName })
    Note right of DB: Schema defaults:<br/>isPublished=false, timestamps

    DB-->>Ctrl: Blog document (_id)
    Ctrl->>Ctrl: transformBlogImage()
    Ctrl-->>C: 201 { success, blog }
```

## Request Enrichment

```mermaid
flowchart LR
    A["Raw HTTP Request"] -->|auth| B["+ req.user"]
    B -->|multer| C["+ req.file"]
    C -->|validator| D["Validated body"]
    D -->|controller| E["Blog.create()"]
    E -->|insertOne| F[("MongoDB")]
```

## Error Responses

| Middleware | Cause | Status |
|-----------|-------|--------|
| `apiLimiter` | > 100 req/min per IP | 429 |
| `auth` | Missing / expired / invalid JWT | 401 |
| `multer` | Wrong file type or > 5 MB | 500 |
| `validateBlogInput` | title < 3, desc < 10, no category, no file | 400 |
| `addBlog` | Missing required fields | 400 |
| Mongoose | Schema validation failure | 500 |

## Blog Document (MongoDB)

```mermaid
erDiagram
    USER ||--o{ BLOG : authors

    BLOG {
        ObjectId _id PK
        String title "required"
        String subTitle "optional"
        String description "required"
        String category "required"
        String image "required"
        Boolean isPublished "default: false"
        ObjectId author FK "ref: User"
        String authorName "denormalized"
        Date createdAt "auto"
        Date updatedAt "auto"
    }
```
