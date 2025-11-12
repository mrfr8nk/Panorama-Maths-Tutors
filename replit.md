# Panorama Maths Tutors Platform

## Overview

Panorama Maths Tutors is an educational platform for mathematics tutoring serving students in Zimbabwe and internationally. The platform supports ZIMSEC, Cambridge, and Tertiary level mathematics education through various delivery modes including online tutorials, evening sessions, one-on-one tutoring, and home visits.

The application is built as a full-stack web platform with a React frontend using modern UI components and a Node.js/Express backend. It features role-based access control (student, tutor, admin), course management, mobile payment integration, and file hosting capabilities.

**Contact:** panoramac215@gmail.com

## Recent Changes (November 2025)

### Latest Updates (November 12, 2025)
- **Enhanced Course Management:**
  - Added `coverPhotoUrl` field to Course model for optional cover images during upload
  - Added `uploadedAt` timestamp to automatically track when content was uploaded
  - UploadModal now supports optional cover photo upload with progress tracking
  - ContentGallery component displays courses with framer-motion animations, premium badges, and upload timestamps
  - Cover photos now display on course cards, falling back to type-based images when not available
  
- **Course Access Functionality:**
  - "Access Now" button on free courses now properly opens catbox media links in new tab
  - CourseCard refactored to presentational component with onEnroll and onAccess callbacks
  - Free courses with fileUrl open directly when accessed
  - Premium courses trigger Paynow payment flow through enrollment process
  
- **Student Profile Expansion:**
  - Extended User model with additional fields: `phoneNumber`, `address`, `school`, `gradeLevel`, `guardianName`, `guardianContact`
  - StudentDashboard profile section now includes comprehensive personal data form
  - All new fields are optional and backward compatible with existing user data
  
- **Premium Content Protection & Access:**
  - Resources page now displays all available courses with visual differentiation
  - Free courses show immediate download modal after enrollment
  - Premium courses display PRO badge and redirect to Paynow payment flow
  - Fixed free course access issue - users can now properly access free content without payment
  - Premium content is gated behind successful Paynow payment confirmation
  
- **Smart Content Recommendations:**
  - Created SuggestedContent component with "You May Also Like" feature
  - Recommendation algorithm prioritizes courses by: same type → same resource type → enrollment popularity
  - Uses intelligent deduplication and random sampling for variety
  - Smooth animations using framer-motion for card transitions
  
- **Admin Payment Tracking:**
  - New PaymentTracker component showing comprehensive transaction history
  - Displays payment status (pending/processing/success/failed) with visual indicators
  - Shows summary statistics: total transactions, successful payments, pending count, total revenue
  - Backend `/api/payments` endpoint returns last 100 transactions with user and course details
  - Admin dashboard payments section replaced with full PaymentTracker integration
  
- **UI/UX Enhancements:**
  - CourseCard component now supports all resource types: PDF, Video, Image, Audio, Lesson
  - Animated content displays with hover effects and smooth transitions
  - Premium badges and status indicators for better content visibility
  - Upload timestamps displayed with relative time formatting (e.g., "2 hours ago")

### Earlier Updates (November 9, 2025)
- **File Upload System Improvements:**
  - Increased file size limit to 200MB with proper Multer configuration
  - Created FileUpload MongoDB model to persist upload metadata (fileId, originalName, customName, mimeType, size, catboxUrl, uploadedBy, uploadedAt)
  - Upload route now saves metadata to MongoDB and returns enriched response data
  - Implemented proper error handling with 413 status code for oversized files
  - CATBOX_USERHASH secret configured for secure CDN uploads
  
- **Admin Route Protection:**
  - AdminDashboard now automatically redirects unauthenticated users to /auth
  - Students attempting to access /admin are redirected to /student dashboard
  - Both admin and tutor roles can access the admin panel
  - Protection implemented using wouter's useLocation hook
  
- **Visitor Tracking System:**
  - Created Visitor MongoDB model tracking ipAddress, userAgent, visitedAt, page
  - Middleware automatically tracks all non-API GET requests for analytics
  - Analytics endpoint expanded to include comprehensive traffic data:
    * Total visitors and unique visitors (by IP address)
    * Recent visitors (last 30 days) and today's visitor count
    * Top 5 most visited pages
    * Total file uploads and storage usage in MB
    
- **Dashboard Analytics Enhancements:**
  - Expanded dashboard from 6 to 8 metric cards with real database data
  - Added new cards: Website Visitors, Today's Traffic, Files Uploaded
  - Removed all fake/mock revenue data - all metrics now sourced from MongoDB
  - Properly typed analytics responses with TypeScript interfaces
  
- **Home Page Navigation:**
  - Fixed CoursesOfferedSection to accept onViewCourses prop
  - Both "View Courses" and "Get Started" buttons properly navigate to /courses
  - Added data-testid attributes for automated testing

### Earlier Updates (November 2025)
- **Branding Update:** All references changed to "Panorama", contact email is panoramac215@gmail.com
- **Database Migration:** Removed PostgreSQL/Drizzle artifacts, fully implemented MongoDB with Mongoose
- **Authentication Improvements:** 
  - Removed role selection from registration (defaults to 'student')
  - Added optional educationLevel field (Ordinary Level, Advanced Level, Tertiary)
  - Admin credentials: admin@gmail.com / admin123
  - Implemented logout functionality
- **Payment Status Standardization:** All payment statuses consistently use 'completed' for successful transactions
- **Dashboard Enhancements:**
  - Student dashboard displays only enrolled courses from authenticated user
  - Admin dashboard shows real-time statistics from database
  - Analytics endpoint returns totalUsers, totalCourses, totalPayments, pendingPayments, totalRevenue, totalEnrollments
- **Course Management:** Full CRUD operations (create, read, update, delete) implemented for admin users

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing (replacing React Router)
- TanStack Query (React Query) for server state management
- Tailwind CSS for utility-first styling
- shadcn/ui component library with Radix UI primitives

**Design System:**
- Glassmorphism-based aesthetic with frosted glass panels, backdrop blur effects, and semi-transparent overlays
- Blue gradient primary colors with yellow/gold accents
- Custom Tailwind configuration with CSS variables for theming
- Dark/light theme support with system preference detection
- Inter and Poppins fonts for modern typography
- Consistent spacing scale using Tailwind units (4, 6, 8, 12, 16, 20, 24)

**State Management Approach:**
- React Context API for authentication state (AuthContext)
- TanStack Query for API data fetching, caching, and synchronization
- Local component state for UI interactions
- LocalStorage for authentication token persistence and theme preferences

**Component Architecture:**
- Atomic design pattern with reusable UI components in `/components/ui/`
- Feature components in `/components/` (forms, cards, sections)
- Page-level components in `/pages/`
- Path aliases configured for clean imports (@, @shared, @assets)

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js framework
- TypeScript for type safety across frontend and backend
- MongoDB with Mongoose ODM for data persistence
- JWT-based authentication with bcrypt password hashing

**Database Choice Rationale:**
- MongoDB was chosen for flexible schema design suitable for educational content
- Mongoose provides schema validation and relationship modeling
- Document-based storage works well for course materials with varying structures

**API Design:**
- RESTful API structure with `/api` prefix
- Route organization in `server/routes.ts`
- Middleware-based authentication (JWT token verification)
- Role-based authorization middleware (requireAdmin, requireTutorOrAdmin)
- Request validation using Zod schemas

**Authentication & Authorization:**
- JWT tokens with 7-day expiration
- Three user roles: student, tutor, admin
- Token stored in localStorage on client, sent via Authorization header
- Protected routes enforced by middleware on backend
- Password hashing using bcryptjs with salt rounds

**File Upload Strategy:**
- Multer middleware for multipart/form-data handling with 200MB file size limit
- In-memory storage buffer (no local disk usage)
- External file hosting via Catbox.moe API using CATBOX_USERHASH secret
- FileUpload MongoDB model stores metadata: fileId, originalName, customName, mimeType, size, catboxUrl, uploadedBy, uploadedAt
- Error handling returns 413 status for files exceeding size limit
- PDF and video file support for course materials
- Upload route saves metadata to MongoDB and returns enriched response with CDN URL

**Visitor Tracking:**
- Visitor MongoDB model tracks all page visits: ipAddress, userAgent, visitedAt, page
- Middleware automatically logs non-API GET requests for analytics
- Analytics aggregation provides visitor counts (total, unique by IP, recent, today)
- Top pages tracking identifies most popular content
- Used for dashboard traffic insights and platform usage metrics

### External Dependencies

**Payment Processing:**
- Paynow integration for Zimbabwe mobile money (EcoCash)
- Environment variables: PAYNOW_INTEGRATION_ID, PAYNOW_INTEGRATION_KEY
- Webhook support for payment status updates (result URL and return URL)
- Payment status polling mechanism for transaction verification

**File Hosting:**
- Catbox.moe file hosting service (200MB per file)
- CATBOX_USERHASH secret required for uploads
- Returns direct file URLs for storage in database
- Used for course PDFs, video files, and other downloadable materials
- Upload metadata persisted to MongoDB FileUpload collection

**Database:**
- MongoDB connection via MONGODB_URI environment variable
- Mongoose for ODM with schema validation
- Connection managed in `server/db.ts` with error handling and auto-exit on failure

**UI Component Libraries:**
- Radix UI primitives for accessible, unstyled components
- shadcn/ui pre-built components following design system
- Lucide React for consistent iconography
- React Icons (specifically react-icons/si for brand icons like WhatsApp)
- Framer Motion for animations (specified in design guidelines)

**Development Tools:**
- Replit-specific plugins for development environment
- ESBuild for production server bundling
- Drizzle Kit configuration present but MongoDB in use (potential migration path)

**Environment Configuration:**
- JWT_SECRET for token signing
- MONGODB_URI for database connection
- CATBOX_USERHASH for file uploads to Catbox CDN
- PAYNOW_INTEGRATION_ID and PAYNOW_INTEGRATION_KEY for payments
- PAYNOW_RESULT_URL and PAYNOW_RETURN_URL for payment callbacks

**MongoDB Collections:**
- **User:** Stores user accounts with role-based access (student, tutor, admin), enrolledCourses array
- **Course:** Course content with type (ZIMSEC, Cambridge, Tertiary), status (Free/Premium), resourceType, fileUrl
- **Payment:** Payment transactions with status tracking, amount, Paynow integration references
- **FileUpload:** Upload metadata tracking fileId, size, mimeType, catboxUrl, uploadedBy for audit trail
- **Visitor:** Page visit tracking with ipAddress, userAgent, visitedAt, page for analytics

**Note on Database Configuration:**
The repository includes Drizzle configuration (`drizzle.config.ts`) pointing to PostgreSQL, but the active implementation uses MongoDB with Mongoose. This suggests either a planned migration or legacy configuration. The code agent should be aware that adding PostgreSQL support would require implementing the Drizzle schema migrations and updating the data layer.