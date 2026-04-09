# Mermaid Diagram Examples

Ready-to-use templates tailored to the Quick Blog stack (React + Express + MongoDB + JWT).

---

## 1. Flowchart — Blog Post Creation Flow

```mermaid
flowchart TD
    A((User)) --> B[Fill blog form]
    B --> C{Valid input?}
    C -->|No| D[Show validation errors]
    D --> B
    C -->|Yes| E[Upload image via Multer]
    E --> F{MIME type valid?}
    F -->|No| G[Reject file]
    G --> B
    F -->|Yes| H[Save to uploads/blogs/]
    H --> I[Create Blog document in MongoDB]
    I --> J[Return success response]
```

---

## 2. Sequence Diagram — JWT Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Client as React Client
    participant Server as Express API
    participant DB as MongoDB

    User->>Client: Enter credentials
    Client->>Server: POST /api/admin/login
    activate Server
    Server->>DB: findOne({ email, isActive: true })
    DB-->>Server: User document
    Server->>Server: bcrypt.compare(password, hash)
    alt Valid credentials
        Server->>Server: jwt.sign({ userId, email, role })
        Server-->>Client: 200 { token, user }
        Client->>Client: Store token in localStorage
    else Invalid credentials
        Server-->>Client: 401 { error: "Invalid credentials" }
    end
    deactivate Server
```

---

## 3. Sequence Diagram — Auth Middleware Chain

```mermaid
sequenceDiagram
    participant Client as React Client
    participant RL as Rate Limiter
    participant Auth as Auth Middleware
    participant Val as Validator
    participant Ctrl as Controller
    participant DB as MongoDB

    Client->>RL: POST /api/blog/add
    alt Rate limit exceeded
        RL-->>Client: 429 Too Many Requests
    else Within limit
        RL->>Auth: Pass through
        Auth->>Auth: Extract Bearer token
        Auth->>Auth: jwt.verify(token, secret)
        alt Token invalid/expired
            Auth-->>Client: 401 Unauthorized
        else Token valid
            Auth->>Val: req.user set, continue
            Val->>Val: Check title, description, category
            alt Validation fails
                Val-->>Client: 400 { errors: [...] }
            else Valid input
                Val->>Ctrl: next()
                Ctrl->>DB: Blog.create({...})
                DB-->>Ctrl: Blog document
                Ctrl-->>Client: 201 { success: true, blog }
            end
        end
    end
```

---

## 4. ER Diagram — Blog Database Schema

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string email UK "unique, lowercase"
        string password "bcrypt hash"
        string name
        string role "enum: admin, author"
        boolean isActive "soft delete"
        date createdAt
        date updatedAt
    }

    BLOG {
        ObjectId _id PK
        string title "min 3 chars"
        string description "min 10 chars"
        string category
        string image "uploads path"
        ObjectId author FK
        string authorName "denormalized"
        boolean isPublished
        date createdAt
        date updatedAt
    }

    COMMENT {
        ObjectId _id PK
        ObjectId blog FK
        string name "commenter name"
        string content "min 5 chars"
        boolean isApproved "moderation"
        date createdAt
        date updatedAt
    }

    USER ||--o{ BLOG : "writes"
    BLOG ||--o{ COMMENT : "has"
```

---

## 5. State Diagram — Blog Post Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: Author creates post
    Draft --> Published: Author publishes
    Published --> Draft: Author unpublishes
    Published --> Published: Author edits
    Draft --> Deleted: Author deletes
    Published --> Deleted: Admin deletes
    Deleted --> [*]

    state Published {
        [*] --> Active
        Active --> HasComments: Comment added
        HasComments --> Moderated: Admin approves
    }
```

---

## 6. Flowchart — File Upload Security Pipeline

```mermaid
flowchart LR
    A[Client sends file] --> B{MIME type check}
    B -->|Invalid| C[Reject: 400]
    B -->|Valid| D{Size check}
    D -->|> 5MB| E[Reject: 400]
    D -->|≤ 5MB| F[Generate server filename]
    F --> G[blog-timestamp-random.ext]
    G --> H[Save to uploads/blogs/]
    H --> I[Store path in MongoDB]
    I --> J[Return success]

    style C fill:#ff6b6b,color:#fff
    style E fill:#ff6b6b,color:#fff
    style J fill:#51cf66,color:#fff
```

---

## 7. Flowchart — Error Handling Architecture

```mermaid
flowchart TD
    A[Express Request] --> B[Route Handler]
    B --> C{Wrapped in asyncHandler?}
    C -->|Yes| D[Execute controller]
    C -->|No| E[Unhandled rejection risk!]
    D --> F{Success?}
    F -->|Yes| G[Send response]
    F -->|No| H[Error thrown]
    H --> I[asyncHandler catches]
    I --> J[Forwards to global error handler]
    J --> K{NODE_ENV?}
    K -->|development| L[Return error + stack trace]
    K -->|production| M[Return generic message]
    J --> N[Log full error internally]

    style E fill:#ff6b6b,color:#fff
```

---

## 8. Class Diagram — Mongoose Models

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String email
        -String password
        +String name
        +String role
        +Boolean isActive
        +Date createdAt
        +comparePassword(candidate) Boolean
        +toJSON() Object
    }

    class Blog {
        +ObjectId _id
        +String title
        +String description
        +String category
        +String image
        +ObjectId author
        +String authorName
        +Boolean isPublished
        +Date createdAt
    }

    class Comment {
        +ObjectId _id
        +ObjectId blog
        +String name
        +String content
        +Boolean isApproved
        +Date createdAt
    }

    User "1" --> "*" Blog : writes
    Blog "1" --> "*" Comment : has
```

---

## 9. Flowchart — CORS Request Flow

```mermaid
flowchart TD
    A[Browser sends request] --> B{Origin header present?}
    B -->|No| C[Allow: server-to-server]
    B -->|Yes| D{Origin in allowlist?}
    D -->|Yes| E[Set Access-Control-Allow-Origin]
    D -->|No| F[CORS Error: blocked]
    E --> G{Preflight OPTIONS?}
    G -->|Yes| H[Return allowed methods/headers]
    G -->|No| I[Process request normally]

    style F fill:#ff6b6b,color:#fff
```

---

## 10. Gantt Chart — Feature Implementation Plan

```mermaid
gantt
    dateFormat YYYY-MM-DD
    title Blog Feature Implementation

    section Backend
        Database schema        :done, db, 2024-01-01, 2d
        Auth middleware         :done, auth, after db, 2d
        CRUD controllers       :active, crud, after auth, 3d
        Input validation       :val, after crud, 1d
        File upload            :upload, after val, 2d

    section Frontend
        Login page             :login, after auth, 2d
        Blog list component    :list, after crud, 2d
        Blog form component    :form, after list, 3d
        Comment section        :comment, after form, 2d

    section Testing
        Backend tests          :btest, after upload, 3d
        Frontend tests         :ftest, after comment, 3d
        Security review        :sec, after btest, 2d
```

---

## 11. Mindmap — Project Architecture

```mermaid
mindmap
  root((Quick Blog))
    Client
      React 19
      Vite 6
      Tailwind CSS 4
      React Router 7
      Axios
    Server
      Express 5
      Mongoose 8
      JWT Auth
      Multer uploads
      Rate limiting
    Database
      MongoDB
      Docker Compose
      migrate-mongo
    Features
      Blog CRUD
      Comments
      AI generation
      File uploads
      Admin panel
```

---

## 12. Pie Chart — OWASP Vulnerability Distribution

```mermaid
pie title OWASP Top 10:2025 App Impact
    "Broken Access Control" : 3.73
    "Security Misconfiguration" : 3.00
    "Cryptographic Failures" : 3.80
    "Injection" : 2.50
    "Insecure Design" : 2.00
    "Auth Failures" : 1.80
    "Integrity Failures" : 1.50
    "Logging Failures" : 1.20
    "Exceptional Conditions" : 1.00
    "Supply Chain" : 0.80
```
