# panoramac Maths Tutors Platform

## Overview

panoramac Maths Tutors is an educational platform for mathematics tutoring serving students in Zimbabwe and internationally. The platform supports ZIMSEC, Cambridge, and Tertiary level mathematics education through various delivery modes including online tutorials, evening sessions, one-on-one tutoring, and home visits.

The application is built as a full-stack web platform with a React frontend using modern UI components and a Node.js/Express backend. It features role-based access control (student, tutor, admin), course management, mobile payment integration, and file hosting capabilities.

**Contact:** panoramac215@gmail.com

## Recent Changes (November 2025)

- **Branding Update:** All references changed from "Panorama" to "panoramac", contact email updated to panoramac215@gmail.com
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
- Multer middleware for multipart/form-data handling
- In-memory storage buffer (no local disk usage)
- External file hosting via Catbox.moe API
- PDF and video file support for course materials

### External Dependencies

**Payment Processing:**
- Paynow integration for Zimbabwe mobile money (EcoCash)
- Environment variables: PAYNOW_INTEGRATION_ID, PAYNOW_INTEGRATION_KEY
- Webhook support for payment status updates (result URL and return URL)
- Payment status polling mechanism for transaction verification

**File Hosting:**
- Catbox.moe free file hosting service
- No API key required for uploads
- Returns direct file URLs for storage in database
- Used for course PDFs and other downloadable materials

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
- PAYNOW_INTEGRATION_ID and PAYNOW_INTEGRATION_KEY for payments
- PAYNOW_RESULT_URL and PAYNOW_RETURN_URL for payment callbacks

**Note on Database Configuration:**
The repository includes Drizzle configuration (`drizzle.config.ts`) pointing to PostgreSQL, but the active implementation uses MongoDB with Mongoose. This suggests either a planned migration or legacy configuration. The code agent should be aware that adding PostgreSQL support would require implementing the Drizzle schema migrations and updating the data layer.