const projectsData = {
  yt_playlist_downloader: {
    title: "YouTube Playlist Downloader",
    tagline:
      "Desktop GUI app for selective, parallel YouTube playlist downloads with auto-translated subtitle embedding.",
    img: "image/yt_playlist_downloader-cover.png",
    gallery: [],
    live: "#",
    code: "https://github.com/FadyASadek/YouTube-Playlist-Downloader",
    overview:
      "YouTube Playlist Downloader is a multi-threaded desktop application designed to streamline batch downloading of videos and playlists from YouTube. Built with Python and CustomTkinter, the system provides a clean two-column dashboard with a persistent settings sidebar and a scrollable media queue. It decouples metadata extraction from media downloads, allowing users to inspect playlist contents and selectively choose videos before initiating downloads. Under the hood, the application orchestrates yt-dlp through a synchronized multi-worker queue using Python condition variables to handle concurrent downloads without freezing the GUI. A dedicated post-processing pipeline detects and drives FFmpeg to merge high-resolution video and audio streams, extract captions, and embed multi-track subtitles. Additionally, it integrates automated chunked subtitle translation into Arabic via Google Translate web endpoint and manages local state persistence across sessions using JSON.",
    problem:
      "Downloading entire YouTube playlists often leads to wasted bandwidth and disk space when users only need specific videos or require translated multi-track subtitles. This application provides selective downloading, automated Arabic caption translation, and stream multiplexing in an intuitive desktop interface.",
    architecture: [
      "Producer-Consumer Concurrency: Uses a thread-safe collections.deque job queue synchronized with threading.Condition to run 1-5 concurrent download workers off the main UI thread.",
      "Two-Stage Download Pipeline: Decouples playlist metadata inspection (via yt-dlp flat extraction) from file downloads, enabling dynamic checkbox-driven item selection before queueing.",
      "Media Multiplexing Pipeline: Employs FFmpeg subprocess commands to merge DASH video and audio streams, extract embedded subtitles, convert formats to SRT, and embed multi-track captions with metadata.",
      "Progress Normalization & UI Throttling: Weighted dual-stream progress (80% video / 20% audio) with GUI updates throttled to one per 300 ms.",
    ],
    stackByCategory: {
      Backend: ["Python"],
      Frontend: ["CustomTkinter", "Tkinter"],
      Integrations: ["yt-dlp", "FFmpeg", "Google Translate web endpoint"],
    },
    features: [
      "Selective Playlist Downloading: Fetches playlist metadata to display an interactive checkbox list, allowing granular selection of specific videos before downloading.",
      "Parallel Worker Pool: Configurable multi-threaded concurrent downloads (1 to 5 workers) managed through a synchronized thread-safe queue.",
      "High-Resolution & Audio Modes: Supports resolutions up to 1080p with stream multiplexing via FFmpeg, as well as MP3 audio extraction at 192 kbps.",
      "Automated Subtitle Translation & Embedding: Downloads captions, translates English subtitles to Arabic in 30-item chunks, and embeds multi-track subtitles into the video container.",
      "Resolution Pre-Check: Verifies requested resolution availability against video formats with a 10% tolerance before committing download resources.",
      "Preferences Persistence: Saves and restores user configuration (save folder, quality, subtitle preferences, and worker count) across application launches via settings.json.",
    ],
    challenges: [
      {
        title: "Thread-Safe Parallel Worker Pool and GUI Synchronization",
        detail:
          "Orchestrating concurrent yt-dlp download workers alongside the Tkinter event loop required managing worker lifecycle through threading.Condition, dynamic worker scaling, and thread-safe UI dispatches via after(). Progress callbacks calculate active speeds and weight separate video and audio downloads (80/20) while throttling UI rendering to 300ms intervals to eliminate GUI freezing.",
      },
      {
        title: "Automated Batch Subtitle Translation and Multi-Track Muxing",
        detail:
          "To provide Arabic subtitles when only English captions exist, the app parses SRT files into timing blocks, batches subtitle text into 30-item chunks separated by delimiters, and queries the Google Translate web endpoint, falling back to line-by-line requests. It then invokes FFmpeg to remux video streams, stripping obsolete tracks and embedding Arabic and English tracks with default disposition and language tags.",
      },
      {
        title: "Runtime FFmpeg Discovery and Resolution Pre-Validation",
        detail:
          "Downloading separate 1080p video and audio tracks requires FFmpeg. The app searches local folders, WinGet package directories, and system paths at launch to automatically inject FFmpeg into PATH. Additionally, it queries video format lists with a 10% height tolerance before starting downloads to handle non-standard YouTube vertical dimensions (such as 1020p).",
      },
    ],
  },
  hemam: {
    title:
      "Hemam: Visual Learning Management Platform for Deaf & Hard of Hearing",
    tagline:
      "An accessible visual learning and assessment platform tailored for deaf and hard-of-hearing students.",
    img: "image/hemam-cover.png",
    gallery: [],
    live: "#",
    code: "#",
    overview:
      "Hemam is an accessible, web-based visual learning management platform built for deaf and hard-of-hearing learners through structured, media-first Arabic vocabulary acquisition. Built on .NET 10 with ASP.NET Core MVC, the system is architected across a clean three-tier separation comprising presentation, business logic (BLL), and data access (DAL) layers. The core curriculum is structured hierarchically into sequential learning levels, themed topical categories, and interactive flashcard lessons containing visual media such as images, animated GIFs, local MP4 videos, and embedded YouTube streams. Students reinforce their vocabulary retention through an interactive dual-mode quiz engine supporting both image-to-word and word-to-image assessments with automatic scoring. Learning progression is governed by strict prerequisites where subsequent levels remain locked until learners successfully achieve passing grades across prerequisite categories. Administrators manage the entire platform through a dedicated dashboard featuring KPI counters, curriculum authoring tools, and student account moderation.",
    problem:
      "Traditional e-learning platforms rely heavily on spoken audio and text-heavy explanations, creating significant educational barriers for deaf and hard-of-hearing students. Hemam eliminates these barriers by providing an intuitive, media-first curriculum with visual flashcards, interactive multi-format quizzes, and prerequisite-driven progression.",
    architecture: [
      "Three-tier architecture cleanly separating ASP.NET Core MVC presentation (Hemam), business domain services and DTOs (Hemam.BLL), and EF Core persistence (Hemam.DAL).",
      "Repository and Unit of Work patterns abstracting data access with explicit Entity Framework Core tracking controls (AsNoTracking for reads, AsTracking for transactional updates).",
      "Cascading relational data model linking Levels -> Categories -> Lessons and Quiz Questions with automated BaseEntity audit timestamps (CreatedAt, UpdatedAt).",
      "ASP.NET Core Identity authentication with cookie session management, localized Arabic error describer, role-based authorization (Admin/Student), and student account lockout controls.",
      "Decoupled media management service abstracting local file storage and directory structures away from controllers and views.",
    ],
    stackByCategory: {
      Backend: [
        ".NET 10",
        "ASP.NET Core 10 MVC",
        "Entity Framework Core 10",
        "ASP.NET Core Identity 10",
      ],
      Database: ["SQL Server"],
      Frontend: ["Razor Views", "Bootstrap 5.3 (RTL)", "SweetAlert2"],
    },
    features: [
      "Sequential Level Progression: Structured curriculum levels that unlock progressively as students successfully complete and pass all prerequisite category quizzes.",
      "Multimedia Flashcard Lessons: Visual lesson player delivering vocabulary via images, animated GIFs, HTML5 video loops, and responsive YouTube video embeds.",
      "Dual-Format Interactive Quizzes: Self-evaluating assessment engine supporting both Image-to-Word and Word-to-Image questions with immediate feedback.",
      "Progress Tracking & Score Protection: Automated quiz evaluation calculating percentage scores against configurable passing thresholds while protecting student records from score regression.",
      "Administrative Control Center: Role-protected dashboard displaying KPI counters, recent activity logs, full curriculum CRUD operations, and student account moderation.",
    ],
    challenges: [
      {
        title: "Duplicate-Safe Quiz Progress Recording",
        detail:
          "Rapid or concurrent submissions could create duplicate progress rows for one student and category. Quiz evaluation detects duplicates, keeps the student's best score, removes the redundant rows, and never lets a score or completion status regress.",
      },
      {
        title: "Sequential Gating and Aggregated Level Completion Algorithm",
        detail:
          "Determining level accessibility across a deep hierarchy (Levels -> Categories -> UserProgress) required dynamic evaluation without corrupting lock states. GetActiveLevelsForUserAsync queries levels with filtered eager loading, verifies that every child category possesses a passing record, computes rounded average quiz scores across categories, and propagates sequential lock flags across the level sequence.",
      },
      {
        title: "Adaptive Multimedia Embedding and Asset Pipeline",
        detail:
          "Deaf learners depend entirely on diverse visual media forms, including custom-uploaded graphics and external sign-language video tutorials. the system handles isolated media ingestion to dedicated directories and dynamically parses YouTube URL variations (transforming watch and short URLs into clean embed endpoints) for seamless responsive playback.",
      },
    ],
  },
  gdg_dashboard: {
    title: "GDG Community Dashboard",
    tagline:
      "A community learning platform managing cohort roadmaps, anti-cheat assessments, and AI resume parsing.",
    img: "image/gdg_dashboard-cover.png",
    gallery: ["image/gdg_dashboard-01.png"],
    live: "https://gdgdashboard.runasp.net/",
    code: "https://github.com/FadyASadek/GDG-Dashboard",
    overview:
      "GDG Community Dashboard is a web application engineered for developer communities to organize study cohorts, track structured learning curriculums, and evaluate student milestones. The backend is structured using a clean 3-tier architecture with ASP.NET Core 10, comprising presentation, business logic, and data access layers. Data persistence is managed through Entity Framework Core and SQL Server, utilizing repository abstractions, global soft-delete query filters, and sequential GUID primary keys to eliminate index fragmentation. Instructors design modular roadmaps containing multi-type resources and gatekeeper quizzes, which students progress through with atomic transaction-wrapped completion tracking. The platform integrates Google Gemini AI and PdfPig to automatically parse uploaded PDF resumes into structured career profile records. The presentation layer delivers role-tailored experiences via ASP.NET Core Identity, featuring responsive Tailwind CSS dashboards and client-side anti-cheat telemetry during quiz execution.",
    problem:
      "Community chapters lack a unified tool to manage student cohorts, publish sequential learning roadmaps, and verify student competence across external study resources. Instructors struggle with manual onboarding, untracked progress across mixed media, and unproctored knowledge checks without administrative visibility.",
    architecture: [
      "Strict 3-Tier Layered Architecture: Clean separation of concerns across GDG DashBoard (ASP.NET Core MVC presentation and controllers), GDG DashBoard.BLL (domain business services and DTOs), and GDG DashBoard.DAL (persistence, entities, and repositories).",
      "Repository Pattern with Transaction-Safe Progress Engine: Generic asynchronous repositories and dedicated group-member repositories with explicit database transactions ensuring atomic multi-step updates during node and resource progression toggles.",
      "Relational Modeling and Index Optimization: Entity Framework Core with SQL Server, NEWSEQUENTIALID() keys to avoid GUID index fragmentation, and global query filters for soft-deleted records.",
      "Multi-Role RBAC & Anti-Cheat Session State: ASP.NET Core Identity with cookie authentication enforcing role hierarchies (Admin, Instructor/Mentor, Organizer, Member) coupled with browser visibility and clipboard telemetry logged during timed quiz sessions.",
    ],
    stackByCategory: {
      Backend: [".NET 10", "ASP.NET Core 10 MVC", "ASP.NET Core Identity 10"],
      Database: ["SQL Server", "Entity Framework Core 10"],
      "DevOps / Infra": ["Web Deploy (MSDeploy)"],
      Frontend: ["Razor Views", "Tailwind CSS", "JavaScript"],
      Integrations: ["Google Gemini", "PdfPig", "MailKit"],
    },
    features: [
      "Interactive Roadmap Progression: Multi-level curriculum viewer supporting videos, articles, tasks, and quizzes, with dual-granularity progress tracking and automatic level completion upon finishing all subordinate resources.",
      "Automated AI CV Parsing: In-browser PDF upload analyzed via PdfPig and Google Gemini AI to extract experiences, education, and skills directly into user profiles.",
      "Proctored Knowledge Checks & Anti-Cheat: Quizzes with passing thresholds, client-side event tracking for tab switches and copy/paste violations, automatic submission upon threshold violations, and server-side cooldown enforcement.",
      "Cohort & Classroom Management: Group creation with 6-character join codes, join-by-code, and bulk member enrollment.",
      "Role-Based Administration & Onboarding: Secure member provisioning with automated email invitation tokens via MailKit/SMTP, role assignment, and an admin dashboard with member, enrollment, and roadmap counts.",
    ],
    challenges: [
      {
        title: "Dual-Granularity Progress Tracking in Atomic Transactions",
        detail:
          "Progress is tracked both per resource and per roadmap level. When a member completes an item or passes a quiz, LearningProgressService runs one database transaction that updates the resource record, auto-completes the parent level once every sibling resource is done, and recalculates the roadmap percentage from resource counts as the single source of truth.",
      },
      {
        title:
          "Anti-Cheat Telemetry with Cooldown Enforcement and Soft-Delete Preservation",
        detail:
          "Maintaining academic integrity during browser-based assessments required coordinating client-side event listeners with server-side rate limits. During a quiz, JavaScript traps window blur, tab switching, and clipboard events, dispatching CSRF-validated violation logs via /Quiz/LogViolation and auto-submitting after three infractions. On the backend, QuizService calculates recent violation velocity over a rolling 30-minute window to enforce a 10-minute cooldown period, while preserving historical quiz attempts via soft deletion during quiz updates to protect student academic records.",
      },
      {
        title: "Avoiding GUID Index Fragmentation and Cascade Cycles",
        detail:
          "In AppDbContext, GUID primary keys are generated with NEWSEQUENTIALID() so inserts stay sequential on disk instead of fragmenting the clustered index. Foreign keys are split between DeleteBehavior.Cascade for owned entities (questions, options) and DeleteBehavior.Restrict for relational links (enrollments, levels), avoiding SQL Server cascade-path cycles.",
      },
      {
        title:
          "Resilient Structured Data Extraction from Unstructured CVs via Gemini AI",
        detail:
          "Extracting complex resume data into relational entities required handling PDF formatting irregularities and transient LLM API throttling. GeminiCvParserService extracts raw text in-memory using PdfPig, constructs a strict JSON-only schema prompt, and calls Google Gemini AI. The service strips extraneous markdown wrappers, validates response parts, and implements specialized error interception that gracefully maps quota or transient 503 errors to user-friendly retry guidance.",
      },
    ],
  },
  clickit: {
    title: "ClickIt — Multi-Vendor E-Commerce Platform Remediation",
    tagline:
      "Multi-vendor e-commerce platform audited and hardened with 90+ security, memory, and query optimizations.",
    role: "Freelance · Performance & security remediation",
    img: "image/clickit-cover.png",
    gallery: [],
    live: "#",
    code: "https://github.com/FadyASadek/Clickit",
    overview:
      "ClickIt is a comprehensive multi-vendor e-commerce platform built on Laravel 10 and PHP 8.1, serving customers, independent sellers, delivery personnel, and platform administrators. The backend is structured around a Service-Repository design pattern with dedicated modules, managing complex catalogs, order processing, multi-channel payment gateways, and real-time order tracking. The system exposes multi-versioned REST APIs alongside server-rendered Blade web interfaces for vendor management and customer portals. As part of an extensive system audit and engineering stabilization engagement, over 90 critical performance bottlenecks and security vulnerabilities were systematically identified and resolved across the live production codebase. Key remediation efforts encompassed eliminating severe N+1 database queries, preventing unbounded in-memory collection bloat, restructuring Cartesian SKU generation algorithms, and implementing database-level aggregation pipelines. In addition, multi-tier authorization controls and strict mime-type validation were enforced to harden file upload workflows and prevent unauthorized operational access.",
    problem:
      "A live multi-vendor marketplace suffered from performance bottlenecks, memory exhaustion under heavy catalog loads, and security weaknesses in form requests and uploads. It needed an audit and targeted refactoring to stabilize core APIs and database access.",
    architecture: [
      "Layered Service-Repository Architecture: Strict separation between HTTP routing/controllers, business domain services (e.g. ProductService, ProductVariationService), and Eloquent repositories to isolate database interactions.",
      "Pipeline-Based Filtering & Query Optimization: Multi-stage query pipelines replacing monolithic conditional chains in repositories, paired with database-level aggregations (GROUP BY, selectRaw, withCount) rather than in-memory PHP collection slicing.",
      "Multi-Actor REST & Web Routing: Domain-segregated controllers and middleware dividing administrative control, multi-vendor seller operations, delivery agent workflows, and customer-facing interactions across API versions (v1, v2, v3) and Blade web portals.",
      "Optimized Multi-Tier Caching & Aggregation: Memory-bounded caching using CacheManagerTrait to store precomputed reviews, category trees, and badge counts without hydrating bloated model relations into RAM.",
    ],
    stackByCategory: {
      Backend: ["PHP 8.1", "Laravel 10", "Eloquent ORM"],
      Database: ["MySQL 8.0"],
      Frontend: ["Blade"],
    },
    features: [
      "SQL-level aggregation (COUNT, SUM, GROUP BY) replacing in-memory counts and slicing on admin dashboards and APIs.",
      "Mobile product endpoints slimmed by scrubbing unneeded relations and bounding review pagination, without breaking the mobile app's JSON contract.",
      "Cache layer restructured to store keyed aggregate arrays instead of serialized model graphs.",
      "Static memoization in helper formatters removing repeated queries inside loops.",
      "Memory-efficient rewrite of the product-variation (Cartesian SKU) generator.",
      "Upload validation and request authorization hardened across admin and seller modules.",
    ],
    challenges: [
      {
        title:
          "Eliminating Severe Memory Leaks and Unbounded Collection Hydration",
        detail:
          "Endpoints and dashboard aggregations loaded full record sets into PHP memory to count, sum, or paginate them, risking memory exhaustion. Unbounded Eloquent fetches were replaced with SQL-level aggregates (COUNT, SUM, GROUP BY) and query-level pagination limits across admin and API controllers.",
      },
      {
        title:
          "Mobile API Payload Hyper-Optimization and Contract Preservation",
        detail:
          "Mobile product endpoints previously loaded nested relations, full-text descriptions, and unlimited reviews, causing response payloads to balloon up to 130MB. By implementing strict payload scrubbing and stripping unneeded relations while maintaining empty structural JSON keys, API responses were reduced to lightweight payloads without breaking mobile client deserialization schemas.",
      },
      {
        title: "Cache Hydration Optimization & Static Memory Memoization",
        detail:
          "The home page and vendor rating systems suffered from catastrophic serialization bottlenecks caused by caching full model collections with deeply nested relations. This was resolved by restructuring cache handlers in CacheManagerTrait to store lightweight, keyed aggregation arrays, and introducing static memoization in helper formatters to eliminate repeated database queries within loops.",
      },
      {
        title: "Hardening Uploads and Request Authorization",
        detail:
          "Upload validation moved to strict type whitelists with size limits, and explicit multi-guard authorization checks were added to admin and seller form requests.",
      },
    ],
  },
  mawashi: {
    title: "Mawashi Shipment Tracking & Logistics Management Portal",
    tagline:
      "A logistics tracking portal featuring automated milestone scheduling, QR scanning, and dynamic admin workflows.",
    role: "Freelance",
    img: "image/mawashi-cover.png",
    gallery: [],
    live: "#",
    code: "https://github.com/FadyASadek/mawashi",
    overview:
      "Mawashi is a logistics and shipment tracking platform built for end-to-end package monitoring and administrative order fulfillment. Developed in PHP and backed by MySQL via PDO, the application provides a public portal where customers track shipments by tracking number, barcode, or customer name across an interactive timeline. An administrative portal enables single and sequential bulk order creation, automated tracking number sequencing, printable QR code rendering, and bulk status updates wrapped in atomic transactions. The system incorporates an automated cron scheduler that evaluates timestamped milestone dates and advances order statuses monotonically while maintaining audit logs. In addition, the management suite includes date-range reporting with Chart.js status distribution visualizations and a centralized content and status workflow management interface.",
    problem:
      "Logistics providers face operational bottlenecks and frequent status inquiries when shipment milestones must be manually tracked and communicated across multi-stage fulfillment lifecycles. Mawashi solves this by providing automated time-based status progression along with self-service public tracking powered by camera-based barcode and QR scanning.",
    architecture: [
      "Server-Rendered PHP Architecture: Modular PHP pages handle routing, authentication, and view rendering, leveraging PHP Data Objects (PDO) with parameterized prepared statements for SQL injection prevention.",
      "Relational Schema & Transactional Integrity: Normalized MySQL schema linking orders, customizable order statuses, scheduled status milestones, and audit history, utilizing atomic PDO transactions for bulk deletions and multi-order updates.",
      "Automated Background Milestone Processing: Scheduled cron script (update_status_cron.php) polls timestamped milestones against NOW() and executes monotonic status advancements according to defined status display orders.",
      "Client-Side Verification & Visualization: Integrates html5-qrcode for live camera-based QR/barcode scanning and auto-lookup, qrcodejs for generating downloadable PNG codes, and Chart.js for order distribution metrics.",
      "Session-Based Authentication & Access Control: Restricted administrative control panel utilizing bcrypt password hashing, session state verification, and CSRF token generation on login.",
    ],
    stackByCategory: {
      Backend: ["PHP", "PDO"],
      Database: ["MySQL"],
      "DevOps / Infra": ["Cron"],
      Frontend: ["Bootstrap 5", "JavaScript", "Chart.js"],
    },
    features: [
      "Public Multi-Field Shipment Tracking: Enables customers to track parcels via tracking number, barcode, or recipient name, rendering a progress timeline.",
      "In-Browser QR & Barcode Scanning: Leverages device camera scanning via html5-qrcode to scan physical codes with automatic query parameter extraction and page redirection.",
      "Automated Milestone Scheduler: Periodically checks expected status dates via cron, advancing shipment statuses sequentially and recording history events.",
      "Batch Order Creation & Sequence Generation: Supports bulk order generation with automatic alphanumeric tracking number sequence extrapolation and QR code generation.",
      "Bulk Status Updates & Deletions: Administrative batch operations wrapped in database transactions to safely cascade updates and deletions across history and schedule tables.",
      "Dynamic Status & CMS Configuration: Administrative module allowing real-time customization of status keys, colors, icons, display order, and public site copy.",
    ],
    challenges: [
      {
        title:
          "Automated Milestone Scheduling with Monotonic State Progression",
        detail:
          "To prevent shipments from regressing to prior stages or skipping milestones when cron execution occurs, update_status_cron.php compares scheduled dates against NOW() and requires the new status display_order to exceed the current order before applying changes and logging audit records.",
      },
      {
        title: "Atomic Multi-Table Batch Transactions",
        detail:
          "Bulk operations on multiple orders require simultaneous operations on orders, order_status_dates, and order_history. The application orchestrates these within explicit PDO transactions with rollback on exceptions to prevent orphaned records and schema inconsistency.",
      },
      {
        title: "Dynamic Alphanumeric Sequence Extrapolation",
        detail:
          "To support bulk parcel intake without collisions, the order form parses the base tracking number with a regular expression into prefix and numeric parts and zero-pads consecutive numbers in the browser before the batch is submitted.",
      },
    ],
  },
  root2route: {
    title: "Root2Route - Agricultural B2B Marketplace & Auction Platform",
    tagline:
      "Multi-tenant agricultural marketplace with live auctions and AI plant diagnosis.",
    role: "Graduation project · Team of three engineers",
    img: "image/root2route-cover.png",
    gallery: [
      "image/root2route-01.png",
      "image/root2route-02.png",
      "image/root2route-03.png",
      "image/root2route-04.png",
      "image/root2route-05.png",
    ],
    live: "https://root2-route-front.vercel.app/auth/login",
    code: "#",
    overview:
      "A multi-tenant agricultural B2B platform built as a university graduation project by a team of three engineers, connecting farming organizations, producers, and buyers to trade plant products and run live auctions. The backend is ASP.NET Core on .NET 10, structured with Clean Architecture and CQRS via MediatR across 21 feature slices, with Entity Framework Core over SQL Server and FluentValidation on every command. Tenant isolation and granular per-organization RBAC are enforced by a custom permission authorization filter reading an X-Organization-Id header, rather than global roles. Live bidding, notifications, and buyer-seller chat run over ASP.NET Core SignalR hubs. Plant disease diagnosis uses a hybrid pipeline: an external Python image-classification service called through Refit, with Google Gemini generating structured Arabic treatment guidance from the result. Payments, HMAC-signed gateway callbacks, and seller withdrawals are integrated end to end through PayTabs. The Angular 21 frontend is deployed on Vercel.",
    problem:
      "Agricultural producers and buyers lack a unified, secure platform to trade plant products, run real-time auctions, and obtain reliable disease diagnosis with treatment guidance.",
    architecture: [
      "Clean Architecture and CQRS with MediatR across 21 feature slices on ASP.NET Core (.NET 10).",
      "Tenant isolation and granular per-organization RBAC enforced through a custom authorization filter reading the X-Organization-Id header.",
      "Entity Framework Core over SQL Server with command validation using FluentValidation.",
      "Real-time live bidding, notifications, and buyer-seller chat powered by ASP.NET Core SignalR hubs.",
      "Hybrid AI pipeline integrating an external Python image-classification service via Refit and Google Gemini for Arabic treatment guidance.",
    ],
    stackByCategory: {
      Backend: [".NET 10", "CQRS (MediatR)", "SignalR", "EF Core"],
      Frontend: ["Angular 21"],
      Database: ["SQL Server"],
      Integrations: ["PayTabs", "Google Gemini"],
    },
    features: [
      "Multi-tenant B2B marketplace for trading agricultural plant products.",
      "Live bidding and auctions with real-time updates.",
      "Real-time buyer-seller chat and system notifications.",
      "Plant disease diagnosis with AI-generated Arabic treatment guidance.",
      "End-to-end payment processing, HMAC-signed gateway callbacks, and seller withdrawals via PayTabs.",
    ],
    challenges: [
      {
        title: "Tenant Isolation & Header-Based RBAC",
        detail:
          "Enforcing strict tenant isolation and granular per-organization permissions through a custom authorization filter reading X-Organization-Id headers instead of global roles.",
      },
      {
        title: "Real-Time Bidding & Messaging",
        detail:
          "Coordinating synchronized live bidding, auction updates, notifications, and buyer-seller chat using ASP.NET Core SignalR hubs.",
      },
      {
        title: "Hybrid Image Classification & AI Pipeline",
        detail:
          "Bridging an external Python classification service via Refit with Google Gemini to produce structured Arabic treatment recommendations.",
      },
      {
        title: "Secure Payment Callbacks & Withdrawals",
        detail:
          "Integrating PayTabs for payment processing, seller withdrawals, and validating HMAC-signed gateway callbacks.",
      },
    ],
  },
  activ: {
    title: "Activ - Sports Academy Management & AI Player Assessment Platform",
    tagline:
      "Bilingual academy booking platform with AI-generated player assessments.",
    role: "Freelance · Full-Stack Software Engineer",
    img: "image/activ-cover.png",
    gallery: [
      "image/activ-01.png",
      "image/activ-02.png",
      "image/activ-03.png",
      "image/activ-05.png",
    ],
    live: "#",
    code: "https://github.com/FadyASadek/activ",
    overview:
      "A bilingual sports academy platform, delivered as a freelance project, that serves trainees, parents, coaches, and academy administrators. The backend is an Express 5 REST API on Node.js with MongoDB through Mongoose 9, JWT authentication, and admin-only routes enforced by middleware, packaged with Docker Compose. The Next.js 14 frontend uses the App Router with next-intl for Arabic-first localization and full RTL/LTR switching. Bookings follow a localized manual payment flow (academy receipt, InstaPay, or mobile wallet) in which members upload proof of payment and administrators approve it and set the final price. An AI Coach Analyst parses trainee assessment sheets from Word documents with Mammoth and uses Google Gemini to generate nutritional, medical, and psychological reports that can be exported as PDF.",
    problem:
      "Sports academies need a centralized management platform to coordinate diverse user roles, support regional manual payment workflows, and automate player assessment evaluations.",
    architecture: [
      "Express 5 REST API on Node.js containerized with Docker Compose.",
      "Document data modeling with MongoDB and Mongoose 9 schemas.",
      "JWT-based authentication with role-protecting middleware for administrative routes.",
      "Next.js 14 App Router architecture with next-intl providing Arabic-first localization and RTL/LTR switching.",
    ],
    stackByCategory: {
      Backend: ["Express 5"],
      Frontend: ["Next.js 14", "next-intl", "Tailwind CSS"],
      Database: ["MongoDB", "Mongoose 9"],
      "DevOps / Infra": ["Docker Compose"],
      Integrations: ["Google Gemini"],
    },
    features: [
      "Role-based platform serving trainees, parents, coaches, and administrators.",
      "Bilingual interface with full Arabic RTL and English LTR localization.",
      "Manual payment verification flow supporting academy receipts, InstaPay, and mobile wallets.",
      "Payment proof upload and administrative price confirmation.",
      "AI Coach Analyst parsing Word document assessment sheets with Mammoth.",
      "Nutritional, medical, and psychological report generation using Google Gemini with PDF export.",
    ],
    challenges: [
      {
        title: "Document Parsing & AI Assessment Pipeline",
        detail:
          "Extracting structured data from Word assessment sheets using Mammoth and prompting Google Gemini to generate comprehensive reports exportable to PDF.",
      },
      {
        title: "Localized Payment Verification Lifecycle",
        detail:
          "Implementing a multi-step manual workflow for uploading payment proofs across InstaPay, receipts, or mobile wallets with admin review and approval.",
      },
    ],
  },
  sales_system: {
    title: "Sales & Installment Management System",
    tagline:
      "Installment scheduling, waterfall payment allocation, and collection analytics.",
    img: "image/sales_system-cover.png",
    gallery: [],
    live: "https://fadyashrafsadek.runasp.net/Account/Login?ReturnUrl=%2F",
    code: "#",
    overview:
      "A financial web application built with ASP.NET Core MVC on .NET 8 to manage customer credit sales and installment plans. It automates installment scheduling, enforces customer credit limits, and recalculates schedules when a new sale is added while preserving overdue ledgers. Payments are allocated by a chronological waterfall across monthly ledgers and contract schedules, with optimistic concurrency handling. The system supports early settlements with configurable discounts, a formal dispute lifecycle with traceable audit adjustments, and Excel report exports via ClosedXML. A Chart.js analytics dashboard tracks collection rates, portfolio health, debt aging, and cash-flow projections. It follows a 3-tier architecture with Repository, Unit of Work, and the Result Pattern, and ships a bilingual English/Arabic interface with RTL support. Unit, DAL, and integration test suites (xUnit, Moq, FluentAssertions, Respawn) run in GitHub Actions CI.",
    problem:
      "Managing customer credit sales requires accurate installment scheduling, strict credit limit enforcement, and deterministic payment allocation across complex debt ledgers.",
    architecture: [
      "3-tier architecture with ASP.NET Core MVC on .NET 8 employing Repository and Unit of Work patterns.",
      "Entity Framework Core data layer over SQL Server with optimistic concurrency handling.",
      "Result Pattern implemented across services for structured business outcomes and error handling.",
      "Automated CI testing pipeline in GitHub Actions using xUnit, Moq, FluentAssertions, and Respawn.",
    ],
    stackByCategory: {
      Backend: [".NET 8", "ASP.NET Core MVC", "EF Core", "ClosedXML"],
      Frontend: ["Chart.js", "Tailwind CSS"],
      Database: ["SQL Server"],
      Testing: ["xUnit"],
    },
    features: [
      "Automated installment schedule generation and customer credit limit enforcement.",
      "Chronological waterfall payment allocation across monthly ledgers and contract schedules.",
      "Schedule recalculation for new sales while preserving overdue balances.",
      "Early settlement calculation with configurable discount structures.",
      "Traceable dispute resolution lifecycle with audit adjustments.",
      "Collection analytics dashboard tracking portfolio health, debt aging, and cash-flow projections with Chart.js.",
      "Excel reporting via ClosedXML and bilingual English/Arabic UI with RTL support.",
    ],
    challenges: [
      {
        title: "Waterfall Payment Allocation & Ledger Recalculation",
        detail:
          "Distributing payments chronologically across multiple overdue ledgers and contract schedules while preserving financial accuracy with optimistic concurrency.",
      },
      {
        title: "Auditable Dispute & Settlement Lifecycle",
        detail:
          "Implementing a formal dispute lifecycle with traceable financial adjustments and dynamic early settlement discount calculations.",
      },
    ],
  },
  icpc_natu: {
    title: "ICPC NATU Community Platform",
    tagline:
      "Automated training & scoring system with Codeforces API integration.",
    img: "image/s8.png",
    gallery: ["image/Screenshot 2026-02-14 172847.png"],
    live: "https://icpcnatu.runasp.net/",
    code: "#",
    overview:
      "An automated educational ecosystem designed to streamline competitive programming training. The platform integrates directly with the Codeforces API via a custom .NET Core Background Service (IHostedService) that monitors member submissions using secure SHA512 hashing. It features a real-time leaderboard, educational roadmaps, and a multi-role management system (Admin, HR, Content), all built on Clean Architecture (3-Tier) principles to ensure maximum scalability and performance.",
    problem:
      "Competitive programming clubs need automated submission tracking and leaderboard scoring to monitor student progress without manual administrative overhead.",
    architecture: [
      "Clean Architecture (3-Tier) on ASP.NET Core separating presentation, business logic, and persistence.",
      "Custom .NET Core Background Service (IHostedService) for continuous asynchronous background monitoring.",
      "ASP.NET Core Identity for role-based access management across Admin, HR, and Content coordinators.",
    ],
    stackByCategory: {
      Backend: [
        "ASP.NET Core",
        "Background Service",
        "Clean Architecture",
        "Identity",
      ],
      Integrations: ["Codeforces API"],
    },
    features: [
      "Automated member submission tracking via Codeforces API integration.",
      "Submission monitoring secured with SHA512 hashing.",
      "Real-time competitive programming leaderboard.",
      "Structured educational training roadmaps.",
      "Multi-role administration system for Admin, HR, and Content managers.",
    ],
    challenges: [
      {
        title: "Continuous Submission Monitoring",
        detail:
          "Managing background polling of member contest submissions via Codeforces API using an IHostedService background worker and SHA512 hashing.",
      },
    ],
  },
  clinic_api: {
    title: "Clinic Booking System - RESTful API",
    tagline: "RESTful API with dynamic scheduling and Clean Architecture.",
    img: "image/api-icon-flat-style-software-integration-vector-illustration-isolated-background-algorithm-programming-sign-business-concept_157943-13795.avif",
    gallery: [],
    live: "#",
    code: "https://github.com/FadyASadek/Clinic-System-API.git",
    overview:
      "A high-performance RESTful API engineered for modern healthcare management. It features a dynamic scheduling engine, a complete appointment lifecycle, and a patient review system. The backend follows Clean Architecture principles with a focus on security through JWT-based Role-Based Access Control (Admin, Doctor, Patient). Performance is optimized using server-side filtering, sorting, and pagination, while the Result Pattern ensures consistent and robust error responses.",
    problem:
      "Healthcare clinics require a scalable, secure backend API to coordinate complex doctor schedules, appointment lifecycles, and patient feedback.",
    architecture: [
      "Clean Architecture on C# and .NET 8 WebAPI.",
      "JWT-based Role-Based Access Control enforcing permissions across Admin, Doctor, and Patient roles.",
      "Entity Framework Core data layer optimized with server-side filtering, sorting, and pagination.",
      "Result Pattern implementation across endpoints for consistent responses and error handling.",
    ],
    stackByCategory: {
      Backend: [
        "C#",
        ".NET 8 WebAPI",
        "JWT Auth",
        "Clean Architecture",
        "EF Core",
      ],
    },
    features: [
      "Dynamic scheduling engine for appointments.",
      "Complete appointment lifecycle management from booking to completion.",
      "Patient review system.",
      "Optimized data querying with server-side filtering, sorting, and pagination.",
    ],
    challenges: [
      {
        title: "Dynamic Appointment Lifecycle Scheduling",
        detail:
          "A dynamic scheduling engine driving the complete appointment lifecycle, behind JWT-based role access for Admins, Doctors, and Patients.",
      },
    ],
  },
  ecommerce_market: {
    title: "Multi-Vendor E-commerce Marketplace",
    tagline: "Multi-vendor platform with specialized dashboards and AJAX cart.",
    img: "image/OIP.webp",
    gallery: [],
    live: "#",
    code: "https://github.com/FadyASadek/E-commerce-Marketplace.git",
    overview:
      "A full-scale e-commerce solution supporting multiple vendors with dedicated dashboards for Admins, Sellers, and Customers. The project implements a robust shopping cart system powered by AJAX for real-time updates without page reloads. Architected using the Repository pattern and ASP.NET Core Identity, the system provides a clean, maintainable codebase capable of handling product management, order processing, and secure user transactions.",
    problem:
      "Operating a multi-vendor retail store requires coordinating separate vendor product catalogs and customer orders while delivering responsive cart interactions.",
    architecture: [
      "ASP.NET Core MVC layered with the Repository pattern for data access decoupling.",
      "Entity Framework with SQL Server for relational persistence of multi-vendor product and order data.",
      "ASP.NET Core Identity securing access control across Admins, Sellers, and Customers.",
    ],
    stackByCategory: {
      Backend: ["ASP.NET Core MVC", "Entity Framework", "Identity"],
      Frontend: ["AJAX"],
      Database: ["SQL Server"],
    },
    features: [
      "Dedicated management portals for Admins, Sellers, and Customers.",
      "Multi-vendor product catalog management and order processing.",
      "AJAX-powered shopping cart with real-time updates without page reloading.",
      "Secure user transaction and account management.",
    ],
    challenges: [
      {
        title: "Multi-Role Dashboards & Cart Synchronization",
        detail:
          "Coordinating distinct dashboard operations across Admins, Sellers, and Customers alongside real-time AJAX shopping cart updates.",
      },
    ],
  },
  student_mgmt: {
    title: "Student Management System",
    tagline: "Fullstack CRUD application with modern Angular frontend.",
    img: "image/230325905-16c648bb-b364-4f1e-a755-426615f5ec54.png",
    gallery: [],
    live: "#",
    code: "https://github.com/FadyASadek/Student-Management-System.git",
    overview:
      "A modern full-stack application designed for educational data management. It leverages an Angular frontend for a highly responsive user experience and a RESTful .NET Core Web API for the backend. The UI is built with Tailwind CSS to provide a clean, contemporary interface, while the backend ensures efficient CRUD operations and data integrity through SQL Server.",
    problem:
      "Academic administrators require a responsive, straightforward interface to perform day-to-day student records management with strong backend data integrity.",
    architecture: [
      "Decoupled client-server architecture with an Angular SPA and a RESTful .NET API backend.",
      "SQL Server relational database ensuring data consistency and integrity.",
    ],
    stackByCategory: {
      Backend: [".NET API"],
      Frontend: ["Angular", "Tailwind CSS", "TypeScript"],
      Database: ["SQL Server"],
    },
    features: [
      "Comprehensive CRUD operations for student records.",
      "Modern, responsive user interface styled with Tailwind CSS.",
      "RESTful API communication between Angular client and .NET backend.",
    ],
    challenges: [
      {
        title: "Client-Server Data Integrity",
        detail:
          "Maintaining seamless CRUD operations and validating data consistency across the Angular frontend and SQL Server backend.",
      },
    ],
  },
  jwt_auth: {
    title: "JWT-Authentication & Security Project",
    tagline:
      "Secure full-stack auth system with JWT protection for API endpoints.",
    img: "image/Screenshot 2026-02-14 190946.png",
    gallery: [],
    live: "#",
    code: "https://github.com/FadyASadek/JWT-Authentication-.Net-Angular.git",
    overview:
      "A deep dive into modern web security, this project implements a full-stack authentication and authorization flow. It demonstrates how to secure API endpoints using JSON Web Tokens (JWT) in a .NET backend and manage user state in an Angular frontend, focusing on best practices for protecting sensitive data and preventing unauthorized access.",
    problem:
      "Web applications need standardized token authentication to guard backend API endpoints while maintaining persistent user authentication state in a single-page app.",
    architecture: [
      "Token-based authorization architecture using JSON Web Tokens (JWT) in .NET Web API.",
      "Client-side session and authentication state handling within Angular.",
    ],
    stackByCategory: {
      Backend: [".NET Web API", "JWT", "Security Best Practices"],
      Frontend: ["Angular"],
    },
    features: [
      "Full-stack authentication and authorization flow.",
      "Protected .NET API endpoints requiring valid JWT tokens.",
      "Angular client state management for authenticated sessions.",
      "Implementation of security best practices to safeguard sensitive endpoints.",
    ],
    challenges: [
      {
        title: "Endpoint Protection & Client Auth State",
        detail:
          "Securing API endpoints against unauthorized access while synchronizing client-side authentication state in Angular.",
      },
    ],
  },
  qr_maker: {
    title: "QR Code Generator Service",
    tagline: "Responsive generator with real-time DOM manipulation.",
    img: "image/Screenshot 2026-02-14 191914.png",
    gallery: [],
    live: "https://fadyasadek.github.io/QR-code-maker/",
    code: "https://github.com/FadyASadek/QR-code-maker.git",
    overview:
      "A lightweight, responsive web tool developed to create custom QR codes on the fly. Built with pure JavaScript, it interacts with third-party APIs and utilizes real-time DOM manipulation to allow users to generate, customize, and download QR codes instantly with a focus on speed and ease of use.",
    problem:
      "Users need a lightweight browser tool to generate and download customized QR codes instantly without software installation.",
    architecture: [],
    stackByCategory: {
      Frontend: ["JavaScript", "DOM Manipulation", "Responsive UI"],
      Integrations: ["External API"],
    },
    features: [
      "Instant on-the-fly QR code generation.",
      "Real-time DOM updates responding immediately to user inputs.",
      "Direct download of generated QR codes.",
      "Integration with third-party APIs.",
    ],
    challenges: [],
  },
  memory_game: {
    title: "Interactive Memory Blocks Game",
    tagline:
      "Interactive card-matching game built with pure vanilla JavaScript.",
    img: "image/game.png",
    gallery: [],
    live: "https://fadyasadek.github.io/Memory-Blocks-Game/",
    code: "https://github.com/FadyASadek/Memory-Blocks-Game.git",
    overview:
      "A front-end challenge that focuses on complex state management and game logic. This interactive card-matching game was built from scratch using pure vanilla JavaScript, featuring custom animations, scoring logic, and difficulty levels to demonstrate proficiency in core programming concepts and UI interactions.",
    problem:
      "Building an interactive card-matching memory game requires maintaining game state, flip logic, and score tracking using pure vanilla JavaScript.",
    architecture: [],
    stackByCategory: {
      Frontend: ["JavaScript", "HTML5", "CSS3 Animations", "Game Logic"],
    },
    features: [
      "Interactive card-matching gameplay built from scratch.",
      "Custom CSS animations for fluid card-flipping interactions.",
      "Dynamic score tracking and multiple difficulty levels.",
    ],
    challenges: [
      {
        title: "State Management in Pure JavaScript",
        detail:
          "Coordinating card states, match validation, scoring, and difficulty levels without external frameworks or state libraries.",
      },
    ],
  },
  qasr_alsalam: {
    title: "Qasr Al-Salam Restaurant Digital Menu",
    tagline:
      "Responsive restaurant menu with interactive categories and modern UI.",
    img: "image/قصر السلام.png",
    gallery: [],
    live: "https://qasr-el-salam.runasp.net/",
    code: "#",
    overview:
      "A premium digital menu developed for 'Qasr Al-Salam' restaurant, focusing on visual appeal and seamless mobile interaction. The project uses HTML, CSS, and JS to create a multi-category menu with smooth transitions, responsive layouts for all device sizes, and an intuitive interface that mimics a physical menu's ease of navigation.",
    problem:
      "Restaurant patrons on mobile devices need an intuitive, visually appealing digital menu that provides seamless browsing across categories.",
    architecture: [],
    stackByCategory: {
      Frontend: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "UI/UX"],
    },
    features: [
      "Multi-category digital menu browsing.",
      "Smooth UI transitions designed to mimic physical menu navigation.",
      "Responsive layout optimized for mobile and desktop screens.",
    ],
    challenges: [],
  },
};
