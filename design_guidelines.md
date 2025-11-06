# Panorama Maths Tutors - Design Guidelines

## Design Approach
**Glassmorphism-based design system** featuring frosted glass panels, blurred backgrounds, transparent overlays with subtle borders, creating a modern, premium educational platform aesthetic.

## Color Palette
- **Primary**: Blue gradient (matching brand flyer)
- **Secondary**: Yellow/Gold accents
- **Base**: White and light grays
- **Glass effects**: Semi-transparent whites with backdrop blur
- **Text**: Dark charcoal on light backgrounds, white on dark/image overlays

## Typography
- **Headings**: Bold, modern sans-serif (Inter/Poppins recommended)
  - H1: 3xl-4xl, font-bold
  - H2: 2xl-3xl, font-semibold
  - H3: xl-2xl, font-medium
- **Body**: Regular weight, comfortable reading size (base to lg)
- **CTAs**: Medium-semibold weight for emphasis

## Layout System
**Spacing**: Use Tailwind spacing units: 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Section padding: py-16 to py-24
- Card padding: p-6 to p-8
- Component gaps: gap-4 to gap-8

## Core Components

### Navigation
- Sticky header with glassmorphic background (backdrop-blur-md)
- Logo left, navigation center/right
- Role-based menu items (Admin/Tutor/Student)
- Mobile hamburger menu with smooth slide-in drawer
- Dark/Light theme toggle icon

### Hero Section (Home Page)
- **Large hero image**: Mathematics-themed background (students studying, equations, geometric patterns)
- Glassmorphic overlay panel containing:
  - Bold headline: "Master Maths with Confidence"
  - Subtitle describing ZIMSEC, Cambridge, Tertiary offerings
  - Dual CTA buttons (blurred backgrounds when on image): "View Courses" (primary) + "Get Started" (secondary)
- Framer Motion: Fade-in + slide-up animation on load

### Course Cards
- Glassmorphic card design with:
  - Hover effect: slight scale (1.02) + enhanced shadow
  - Lucide icons: 📘 Book (PDF), 🎥 Video, 💡 Lesson
  - Course type badge (ZIMSEC/Cambridge/Tertiary)
  - Status indicator: "Free" (green) or "Premium" with lock icon
  - "Enroll" or "Access" button at bottom
- Grid layout: 3 columns desktop, 2 tablet, 1 mobile

### Dashboard Layouts

**Admin Dashboard**:
- Left sidebar (w-64) with glassmorphic background
  - Navigation icons + labels (Dashboard, Uploads, Courses, Payments, Users, Settings)
  - Active state: highlighted background + border accent
- Main content area with top stats cards (4-column grid)
- Content tables with glassmorphic containers
- Upload modal: centered overlay with blur backdrop

**Student Dashboard**:
- Welcome header with personalized greeting
- Tab navigation: My Courses, Resources, Payments, Profile
- Course grid showing enrolled courses with progress indicators
- Embedded video player for YouTube content (iframe with rounded corners)

**Tutor Dashboard**:
- Upload interface with drag-drop zone (dashed border, centered icon)
- Lesson management table with edit/delete actions
- Student engagement metrics (simple bar charts)

### Forms
- Glassmorphic input fields with subtle borders
- Floating labels on focus
- Error states: red border + error message below
- Success states: green checkmark icon
- Submit buttons with loading spinner states

### Payment Flow
- Modal overlay displaying:
  - Course details and price
  - Ecocash phone number input
  - Payment instructions
  - Status indicator (Pending → Processing → Success)
- Success animation: checkmark with scale + fade effect

### Images
- **Hero**: Full-width background image (mathematics classroom, tutoring session, or abstract math concepts)
- **About page**: Tutor profile photos in circular frames
- **Course thumbnails**: Relevant subject imagery (geometry, algebra, calculus visuals)
- **Buttons on images**: Always use blurred/frosted backgrounds for legibility

## Animations (Framer Motion)
- **Page transitions**: Fade + slide (200ms duration)
- **Card hover**: Scale 1.02, shadow enhancement (150ms)
- **Modal entry**: Scale from 0.95 + fade in (250ms)
- **List items**: Stagger children animations (50ms delay between items)
- **Scroll reveals**: Fade-in + slide-up for sections entering viewport
- Keep animations subtle and purposeful—avoid excessive motion

## Accessibility
- Minimum contrast ratio 4.5:1 for text
- Focus states with visible outlines
- ARIA labels for icon-only buttons
- Keyboard navigation for all interactive elements
- Alt text for all images

## Responsive Breakpoints
- Mobile: < 768px (single column, stacked navigation)
- Tablet: 768px - 1024px (2-column grids)
- Desktop: > 1024px (3+ column grids, full sidebar)

## Additional Pages

**Courses Page**: Filterable grid with dropdown/tabs for course type, animated transitions when filtering

**About Page**: Mission/Vision cards with motion reveals on scroll, tutor profile grid with glassmorphic cards

**Contact Page**: Split layout—form left, contact info/map right (single column mobile), animated success toast on submission

**Footer**: Multi-column layout with links, social icons, newsletter signup, glassmorphic styling consistent with site