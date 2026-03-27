Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 1
والعربية اإلسالمية للدراسات اإلتقان
Al-Itqan Institute for Islamic & Arabic Studies
PRODUCT REQUIREMENTS DOCUMENT
Full-Stack Islamic LMS Platform — v2.0
March 2026 | CONFIDENTIAL | Production Ready
https://itqaninstitute.com
Production Domain
Scholar: Dr. Noor Ur Rahman Hazarvi (Hafizahullah)
Tech Stack: React 18 + Vite + Node.js/Express + Supabase (PostgreSQL)
Project Type: Islamic LMS — Multi-Role Web Application
Target Users: Students · Teachers · Administrators (Global)
Languages: Arabic (RTL) · Urdu (RTL) · English (LTR)
Total Courses: 24 (Auto-seeded at launch)
Status: APPROVED — Ready for Development
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 2
1. Executive Summary
Al-Itqan Institute for Islamic & Arabic Studies is a world-class online Islamic education platform under
the scholarly supervision of Dr. Noor Ur Rahman Hazarvi (Hafizahullah) — PhD, International Islamic
University Islamabad, and Head of Hadith Specialization at Jamia Al-Rashid Karachi.
This PRD defines the complete requirements for a production-grade Islamic Learning Management
System (LMS) built on React 18 + Node.js/Express + Supabase (PostgreSQL). The platform delivers
24 structured courses, serves a global audience in Arabic, Urdu and English, and features role-based
access for Admins, Teachers and Students.
1.1 Core Mission
• Deliver authentic, structured Islamic and Arabic education from beginner to advanced
specialization
• Provide scholar-led content supervised by Dr. Noor Ur Rahman Hazarvi
• Serve a global Muslim audience with multi-language, RTL-capable, mobile-first interface
• Build a secure, scalable platform using Supabase + Node.js + React
1.2 Platform at a Glance
Metric Value
Total Courses 24 (auto-seeded at launch)
Course Categories Quran · Arabic · Fiqh · Sarf & Nahw · Hadith
User Roles Super Admin · Admin · Teacher · Student
Supported Languages Arabic (RTL) · Urdu (RTL) · English (LTR)
Auth System Supabase Auth + JWT + Row Level Security (RLS)
Real-Time Supabase Realtime (WebSocket channels)
File Storage Supabase Storage (CVs, certificates, images)
Database PostgreSQL via Supabase
Backend Node.js + Express.js (REST API)
Frontend React 18 + Vite + TailwindCSS + React Router v6
WhatsApp Contact +923434487450
Email info@itqaninstitute.com
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 3
2. Technology Stack — Complete Specification
2.1 Frontend Stack
Technology Version Purpose
React 18.x Core UI framework (SPA)
Vite 5.x Build tool & dev server (fast HMR)
React Router v6 Client-side routing & protected routes
TailwindCSS 3.x Utility-first responsive styling
Framer Motion 10.x Animations & page transitions
Zustand 4.x Lightweight global state management
TanStack Query 5.x Server state, caching, real-time sync
Axios 1.x HTTP client for REST API calls
React Hook Form 7.x Form handling & validation
Zod 3.x Schema validation (shared frontend/backend)
i18next + react-i18next 23.x Multi-language internationalization
Recharts 2.x Dashboard analytics charts
TipTap 2.x Rich text editor for blogs
React Dropzone latest File upload UI (CV, images)
React Hot Toast latest Toast notification system
Amiri (Google Font) — Arabic typography (Quranic text)
Poppins (Google Font) — English UI typography
2.2 Backend Stack
Technology Version Purpose
Node.js 20 LTS Runtime environment
Express.js 4.x REST API framework
@supabase/supabase-js 2.x DB, Auth, Storage, Realtime SDK
Helmet.js 7.x HTTP security headers (15 headers set)
express-rate-limit 7.x API rate limiting (DDoS protection)
xss-clean 0.x XSS sanitization middleware
express-validator 7.x Input validation per route
bcryptjs 2.x Password hashing (12 salt rounds)
jsonwebtoken 9.x JWT access + refresh tokens
Multer 1.x Multipart file upload handling
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 4
Technology Version Purpose
Morgan 1.x HTTP request logging
Winston 3.x Structured application logging
Joi 17.x Server-side schema validation
node-cron 3.x Daily Hadith/Ayah scheduler
compression 1.x Gzip response compression
hpp 0.x HTTP Parameter Pollution prevention
2.3 Supabase Services Used
Supabase Service Usage in Project
Supabase Auth User registration, login, JWT refresh, email confirm
PostgreSQL Database All relational data: users, courses, students, teachers, blogs, admissions
Row Level Security (RLS) Per-row access policies for each user role
Supabase Realtime Live notifications, admission status, course count sync
Supabase Storage Profile photos, CV/resume PDFs, course images, certificates
Supabase Edge Functions Daily Hadith/Ayah scheduler, email notification triggers
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 5
3. Database Schema — PostgreSQL via Supabase
All tables use UUID primary keys and timestamptz for dates. Row Level Security (RLS) is enabled on
every table. No anonymous access to protected data is possible without a valid JWT.
3.1 profiles (extends Supabase auth.users)
Column Type Constraints Description
id UUID PK, DEFAULT gen_random_uuid() Primary key
user_id UUID FK auth.users(id), UNIQUE, NOT
NULL
Supabase auth
reference
full_name TEXT NOT NULL Full display name
email TEXT UNIQUE, NOT NULL Login email
role TEXT CHECK IN
(super_admin,admin,teacher,student)
Access role
status TEXT DEFAULT active, CHECK IN
(active,banned,suspended)
Account status
avatar_url TEXT NULL Supabase Storage
URL
preferred_language TEXT DEFAULT en, CHECK IN (en,ar,ur) UI language
theme TEXT DEFAULT light, CHECK IN
(light,dark,green)
Theme preference
created_at TIMESTAMPTZ DEFAULT NOW() Registration date
updated_at TIMESTAMPTZ DEFAULT NOW() Last update
3.2 students
Column Type Constraints Description
id UUID PK Primary key
user_id UUID FK profiles(user_id), NOT NULL Linked profile
father_name TEXT NOT NULL Father's full name
whatsapp TEXT NOT NULL WhatsApp with
country code
country TEXT NOT NULL Country of residence
city TEXT NULL City
gender TEXT CHECK IN (male,female) Gender
date_of_birth DATE NULL Date of birth
course_id UUID FK courses(id) Primary enrolled
course
study_mode TEXT CHECK IN (one_to_one,group) Learning mode
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 6
Column Type Constraints Description
preferred_time TEXT CHECK IN
(morning,afternoon,evening,night)
Time preference
weekly_days TEXT[] DEFAULT '{}' Available days array
applied_for TEXT CHECK IN
(nazra,tajweed,hifz,arabic,fiqh,hadith)
Application type
additional_message TEXT NULL Optional message
created_at TIMESTAMPTZ DEFAULT NOW() Creation date
3.3 teachers
Column Type Constraints Description
id UUID PK Primary key
user_id UUID FK profiles(user_id),
NOT NULL
Linked profile
phone TEXT NOT NULL Phone number
country TEXT NOT NULL Country
highest_qualification TEXT NOT NULL Degree level
field_of_study TEXT NOT NULL Academic field
institution_name TEXT NOT NULL University/Institute
year_of_completion INT NOT NULL Graduation year
total_experience TEXT CHECK IN
(1yr,2_3yr,5plus,10plus)
Teaching experience
teaching_type TEXT CHECK IN
(online,physical,both)
Mode
subjects_taught TEXT[] DEFAULT '{}' Previously taught subjects
primary_specialization TEXT NOT NULL Main specialization
languages_known TEXT[] DEFAULT '{}' Languages array
preferred_teaching_language TEXT NOT NULL Primary language
available_days TEXT[] DEFAULT '{}' Available days
available_slots TEXT[] DEFAULT '{}' Morning/Afternoon/Evening/Night
device_type TEXT CHECK IN
(mobile,laptop,tablet)
Device used
internet_quality TEXT CHECK IN
(excellent,good,average)
Connection quality
cv_url TEXT NULL Supabase Storage CV path
certifications_url TEXT[] DEFAULT '{}' Certification files
why_teach TEXT NULL Motivation statement
short_bio TEXT NULL Biography
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 7
Column Type Constraints Description
created_at TIMESTAMPTZ DEFAULT NOW() Application date
3.4 courses
Column Type Constraints Description
id UUID PK Primary key
title TEXT NOT NULL Course full
name
title_ar TEXT NULL Arabic title
title_ur TEXT NULL Urdu title
category TEXT CHECK IN
(quran,arabic,fiqh,sarf_nahw,hadith)
Category
level TEXT CHECK IN
(beginner,intermediate,advanced,specialized)
Level
duration TEXT NOT NULL e.g. 4-6
Months
fee_usd_min NUMERIC(8,2) NOT NULL Min monthly
fee USD
fee_usd_max NUMERIC(8,2) NOT NULL Max monthly
fee USD
fee_pkr_min NUMERIC(10,0) NULL Min fee PKR
fee_pkr_max NUMERIC(10,0) NULL Max fee PKR
prerequisites TEXT NULL Required prior
knowledge
core_books TEXT NULL Main textbooks
description TEXT NOT NULL Full description
learning_outcomes TEXT[] DEFAULT '{}' Array of
outcomes
image_url TEXT NULL Course
thumbnail URL
teacher_id UUID FK teachers(id), NULL Assigned
teacher
students_count INT DEFAULT 0 Enrolled count
status TEXT DEFAULT active, CHECK IN
(active,draft,archived)
Visibility
schedule TEXT NULL e.g. 3-5
days/week · 45
min
sort_order INT DEFAULT 0 Display order
created_at TIMESTAMPTZ DEFAULT NOW() Creation date
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 8
Column Type Constraints Description
updated_at TIMESTAMPTZ DEFAULT NOW() Last modified
3.5 admissions
Column Type Constraints Description
id UUID PK Primary key
type TEXT NOT NULL, CHECK IN
(student,teacher)
Application type
applicant_user_id UUID FK profiles(user_id), NULL Linked if registered
data JSONB NOT NULL Full application payload
status TEXT DEFAULT pending, CHECK IN
(pending,approved,rejected,waitlisted)
Status
reviewed_by UUID FK profiles(user_id), NULL Admin reviewer
review_note TEXT NULL Admin's internal note
reviewed_at TIMESTAMPTZ NULL Review timestamp
created_at TIMESTAMPTZ DEFAULT NOW() Submission date
3.6 blogs
Column Type Constraints Description
id UUID PK Primary key
title TEXT NOT NULL Blog post title
slug TEXT UNIQUE, NOT NULL URL-friendly identifier
excerpt TEXT NULL Short preview (2-3
lines)
content TEXT NOT NULL Full HTML/Markdown
content
image_url TEXT NULL Featured image URL
author_id UUID FK profiles(user_id) Author reference
category TEXT CHECK IN
(quran,hadith,fiqh,arabic,spirituality,general)
Category
tags TEXT[] DEFAULT '{}' Searchable tags
views INT DEFAULT 0 View counter
is_featured BOOLEAN DEFAULT FALSE Featured post flag
status TEXT DEFAULT draft, CHECK IN
(draft,published,archived)
Status
published_at TIMESTAMPTZ NULL Publication timestamp
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 9
Column Type Constraints Description
created_at TIMESTAMPTZ DEFAULT NOW() Creation date
3.7 enrollments
Column Type Constraints Description
id UUID PK Primary key
student_id UUID FK students(id) Student reference
course_id UUID FK courses(id) Course reference
status TEXT DEFAULT active, CHECK IN
(active,completed,dropped)
Status
progress_percent INT DEFAULT 0, CHECK (0-100) Completion %
enrolled_at TIMESTAMPTZ DEFAULT NOW() Enrollment date
completed_at TIMESTAMPTZ NULL Completion date
3.8 notifications
Column Type Constraints Description
id UUID PK Primary key
title TEXT NOT NULL Notification
headline
message TEXT NOT NULL Body text
type TEXT CHECK IN
(ayah,hadith,course_update,admission_status,broadcast,syste
m)
Type
target_role TEXT NULL, CHECK IN (all,student,teacher,admin) Audience
target_user_i
d
UUID NULL Specific user
(null=broadcast
)
is_read BOOLEAN DEFAULT FALSE Read status
metadata JSONB NULL Extra data
(links, IDs)
created_at TIMESTAMPT
Z
DEFAULT NOW() Send time
3.9 Other Tables
Table Key Columns Purpose
contact_messages full_name, email, whatsapp, subject,
message, status
Contact form submissions inbox
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 10
Table Key Columns Purpose
daily_content type(ayah/hadith), content_ar, content_en,
content_ur, display_date
Daily Quran verse + Hadith
system
certificates student_id, course_id, certificate_url,
issued_by, issued_at
Downloadable course completion
certificates
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 11
4. Row Level Security (RLS) Policies
All Supabase tables have RLS enabled. No data is accessible without a valid authenticated JWT.
Policies enforce role-based access at the database layer — independent of API logic.
SECURITY MANDATE: Admin email pass93630@gmail.com is seeded as SUPER_ADMIN
with bcrypt-hashed password (12 salt rounds). Raw password NEVER stored in any table,
log, or API response.
Table Role SELECT INSERT UPDATE DELETE
profiles own user own row on
register
own row X
profiles admin/super_admin ALL YES ALL YES
students student own row on
admission
own row X
students admin ALL YES ALL YES
teachers teacher own row on
admission
own row X
teachers admin ALL YES ALL YES
courses public/student active only X X X
courses teacher assigned X assigned X
courses admin ALL YES ALL YES
admissions student/teacher own on apply X X
admissions admin ALL YES ALL YES
blogs public published X X X
blogs admin ALL YES ALL YES
enrollments student own X X X
enrollments admin ALL YES ALL YES
notifications any auth own+broadcast X own
is_read
X
notifications admin ALL YES ALL YES
contact_messages public X YES (rate
limit)
X X
contact_messages admin ALL YES ALL YES
certificates student own X X X
certificates admin ALL YES ALL YES
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 12
5. REST API Endpoints — Complete Specification
Base URL: https://itqaninstitute.com/api/v1 | All responses are JSON. Auth via Bearer JWT. Rate limit:
100 req/15min public, 500 req/15min authenticated. IP blocked after 5 failed login attempts.
5.1 Authentication
Method Endpoint Auth Description
POST /auth/register Public Register (blocks temp emails, validates password
strength)
POST /auth/login Public Login → access_token + refresh_token (HttpOnly
cookie)
POST /auth/logout Bearer
JWT
Invalidate Supabase session
POST /auth/refresh Refresh
Token
Get new access token
POST /auth/forgot-password Public Send password reset email
POST /auth/reset-password Reset
Token
Set new password
GET /auth/me Bearer
JWT
Current authenticated user profile
5.2 Courses
Method Endpoint Auth Description
GET /courses Public List active courses
(?category=&level=&search=&sort=)
GET /courses/:id Public Single course detail with full metadata
POST /courses Admin Create course (multipart: image upload to Supabase
Storage)
PUT /courses/:id Admin Full course update
PATCH /courses/:id/status Admin Toggle active/draft/archived
DELETE /courses/:id Admin Soft-delete course
GET /courses/stats Admin Enrollment analytics by category/level
5.3 Admissions
Method Endpoint Auth Description
POST /admissions/student Public Submit student application (multipart form)
POST /admissions/teacher Public Submit teacher application (CV + certificates
upload)
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 13
Method Endpoint Auth Description
GET /admissions Admin List all admissions
(?type=&status=&page=&limit=)
GET /admissions/:id Admin Single admission full JSONB payload
PATCH /admissions/:id/status Admin Approve/Reject/Waitlist + send realtime
notification
GET /admissions/my Student/Teacher Own application status
5.4 Blogs
Method Endpoint Auth Description
GET /blogs Public List published blogs
(?category=&author=&sort=&page=)
GET /blogs/featured Public Get 1-2 featured posts
GET /blogs/:slug Public Single blog (increments views counter)
POST /blogs Admin Create blog with image upload
PUT /blogs/:id Admin Update blog content
PATCH /blogs/:id/publish Admin Publish/unpublish toggle
PATCH /blogs/:id/feature Admin Toggle featured status
DELETE /blogs/:id Admin Delete blog
5.5 Users & Profiles
Method Endpoint Auth Description
GET /admin/users Admin All users (?role=&status=&page=)
GET /admin/users/:id Admin Single user + linked student/teacher data
PATCH /admin/users/:id/status Admin Ban/activate/suspend user
PATCH /admin/users/:id/role Super
Admin
Change user role
PUT /profile Any Auth Update own profile (name, photo, language, theme)
POST /profile/avatar Any Auth Upload profile photo to Supabase Storage
5.6 Notifications, Contact & Dashboard
Method Endpoint Auth Description
GET /notifications Any Auth Own notifications (unread first)
PATCH /notifications/:id/read Any Auth Mark as read
PATCH /notifications/read-all Any Auth Mark all as read
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 14
Method Endpoint Auth Description
POST /notifications/broadcast Admin Broadcast to role (all/student/teacher)
GET /daily-content/today Public Today's Ayah + Hadith
POST /contact Public
(rate
limited)
Submit contact form message
GET /contact/messages Admin Contact messages inbox
PATCH /contact/messages/:id/status Admin Update message status
GET /admin/dashboard Admin Platform stats (students, teachers, courses,
admissions)
GET /admin/stats/analytics Admin Traffic, enrollment trends, top courses
5.7 Enrollments & Certificates
Method Endpoint Auth Description
POST /enrollments Admin Enroll student in course
GET /enrollments/my Student Own enrolled courses with progress
PATCH /enrollments/:id/progress Teacher/Admin Update student progress %
POST /certificates Admin Issue certificate (PDF stored in Supabase
Storage)
GET /certificates/my Student Download own certificates
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 15
6. Security Specification
6.1 Admin Credentials — SUPER_ADMIN Seed
CONFIDENTIAL — Do NOT expose in frontend code, git repos, or logs
Admin Email: pass93630@gmail.com
Admin Password: WAQASkhan@5713079
Role: SUPER_ADMIN
Storage: bcrypt hashed (12 salt rounds) via Supabase Auth — NEVER stored as plaintext
Seeding: scripts/seed-admin.js runs once on first deploy. Admin can only be re-seeded by
Super Admin.
6.2 Password Security Rules
• Minimum 8 characters
• At least 1 uppercase letter (A-Z)
• At least 1 number (0-9)
• At least 1 special character (!@#$%^&*)
• bcryptjs hashing — 12 salt rounds
• Passwords never returned in any API response
• Password strength meter shown in all signup/registration forms
6.3 Blocked Disposable Email Domains
At registration, email domain is checked against a blocklist. HTTP 422 returned with message:
'Disposable email addresses are not permitted.' Blocked domains include:
• mailinator.com, tempmail.com, guerrillamail.com
• 10minutemail.com, yopmail.com, throwam.com
• sharklasers.com, guerrillamailblock.com, grr.la, trashmail.com
6.4 Security Middleware Stack (Express)
Middleware Purpose Configuration
helmet() Sets 15 HTTP security headers Default + custom CSP for Supabase/fonts
cors() Cross-origin control Whitelist: itqaninstitute.com, localhost:5173
express-rate-limit Brute force + DDoS protection 100/15min public; lockout after 5 failed logins
xss-clean XSS sanitization on
req.body/query
Applied globally before all routes
express-validator Input validation per route Custom error messages with field context
hpp() HTTP Parameter Pollution
prevention
Whitelist safe repeated params
compression() Gzip all API responses threshold: 1024 bytes
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 16
6.5 JWT & Session Strategy
• Access Token: 15-minute expiry (short-lived Bearer token)
• Refresh Token: 7-day expiry stored in HttpOnly, Secure, SameSite=Strict cookie
• Role claim embedded in JWT payload → verified server-side on every protected route
• Token invalidation on logout via Supabase signOut() — revokes session server-side
• SUPER_ADMIN routes: role also re-checked against DB (not just JWT claim)
6.6 Role-Based Access Control (RBAC)
Role Access Level Capabilities
SUPER_ADMIN Full platform control All admin capabilities + change roles, manage admins,
system settings
ADMIN Platform management Course CRUD, blog management, approve admissions,
view messages, broadcast notifications
TEACHER Course-level access View assigned courses, upload materials, track student
progress, manage schedule
STUDENT Personal learning View/enroll courses, track own progress, download own
certificates, view own notifications
6.7 Supabase Storage Security
• All buckets are private — no public access without signed URLs
• Signed URLs generated server-side, expire in 1 hour
• File type validation: PDFs only for CVs, images only for photos (MIME check)
• Max sizes: profile photos 2MB, CVs 10MB, certificates 5MB, course images 5MB
• Storage bucket names: avatars, course-images, cvs, certificates, blog-images
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 17
7. Frontend — Pages, Routes & Components
7.1 Public Pages
Route Page Key Sections
/ Homepage Video hero, Daily Ayah+Hadith, Notification bar, Courses grid, Why
Choose Us, Footer
/courses Courses Page Hero, Search+Filter bar, Courses grid (dynamic), Why Study With Us
/blogs Blogs Page Hero, Featured blog banner, Blog grid (search/filter), Pagination
/blogs/:slug Blog Detail Full article, Author card, Related blogs, Share buttons
/about About Us Hero, Scholar profile (Dr. Hazarvi), Biography accordion, Expertise
badges, Publications
/admission Admission Tab: Student | Teacher. Multi-step form with progress bar
/contact Contact Us Hero, Contact cards (WhatsApp/Email), Form, Quick support, FAQ
accordion
/login Login Email + password, Forgot password, Role-based redirect after login
/signup Signup Basic registration → redirects to admission form for full profile
7.2 Dashboard Routes (Role-Protected)
Route Role Description
/admin/dashboard Admin/Super
Admin
Analytics: students, teachers, admissions, courses, traffic
charts
/admin/courses Admin Course CRUD table with Add/Edit/Delete modals
/admin/blogs Admin Blog management with TipTap rich text editor
/admin/admissions Admin Applications with approve/reject + notes
/admin/users Admin All users with ban/activate/role controls
/admin/messages Admin Contact messages inbox
/admin/notifications Admin Broadcast notification composer
/admin/settings Super Admin Theme, language, site config
/student/dashboard Student Enrolled courses, progress, schedule view
/student/courses Student My courses with continue button and progress bar
/student/certificates Student Certificate download gallery
/student/profile Student Edit personal info, avatar, language preference
/teacher/dashboard Teacher Assigned courses overview, student count
/teacher/courses Teacher Course content management, upload materials
/teacher/students Teacher Enrolled students, attendance, progress
/teacher/profile Teacher Edit professional profile, specialization
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 18
7.3 Core Components Library
Component Description
<Navbar /> Sticky glassmorphism nav, logo, links, language switcher, theme switcher,
auth buttons
<Footer /> Logo, description, WhatsApp link, email, quick links, social icons
<Hero /> Configurable with video/image background, gradient overlay, animated CTA
buttons
<CourseCard /> Thumbnail, title, excerpt, duration, level badge, students count, enroll button
<BlogCard /> Image, title, excerpt, author, date, category tag, read more link
<ScholarCard /> Dr. Hazarvi full profile with qualifications, positions, expertise badges
<ThemeSwitcher /> Light/Dark/Islamic Green 3-way toggle with localStorage persistence
<LanguageSwitcher /> Flag icons EN/AR/UR with i18n integration and RTL auto-toggle
<NotificationBell /> Badge counter, dropdown list, mark-read, clear all
<DailyContent /> Today's Ayah and Hadith cards with Amiri Arabic font
<SkeletonLoader /> Configurable skeleton for courses, blogs, and table rows
<MultiStepForm /> Progress bar, step validation, back/next navigation, success popup
<PasswordStrengthMeter
/>
Visual strength bar: weak/medium/strong with rules checklist
<FileUploadDropzone /> Drag-and-drop with preview, type/size validation
<RichTextEditor /> TipTap-based editor for blog creation with formatting toolbar
<ProtectedRoute /> HOC checking auth + role, redirects unauthorized users to login
<RTLProvider /> Wraps app — sets dir attribute and font based on i18n.language
<ConfirmModal /> Reusable confirmation dialog for destructive actions
<ToastNotification /> React Hot Toast styled with Islamic green theme
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 19
8. Complete 24-Course Catalogue (Auto-Seed Data)
All 24 courses are seeded on first deployment via scripts/seed-courses.js. Each includes full
description, fee, duration, level, prerequisites, and learning outcomes.
8.1 Quran Courses — 7 Courses
Progression: Noorani Qaida → Nazra → Tajweed → Advanced Tajweed → Hifz → Tarjama →
Advanced Tafseer
# Course Title Level Duration Fee
(USD/mo)
Core Books
1 Noorani Qaida Course Beginner 2-3 Months $20-$30 Noorani Qaida
2 Nazra Quran (Reading) Beginner 3-4 Months $25-$35 Direct Quran text
3 Quran with Tajweed Intermediate 4-6 Months $30-$40 Tajweed rules texts
4 Advanced Tajweed
Program
Advanced 1 Year $35-$50 Al-Jazariyyah, Khulasat
ut-Tajweed
5 Hifz-ul-Quran
(Memorization)
Specialized 2.5-3
Years
$40-$60 Full Quran (Sabaq+Manzil
method)
6 Tarjamat-ul-Quran Intermediate 1 Year $30-$45 Translation texts
(AR/UR/EN options)
7 Advanced Tafseer-ul-Quran Advanced 2 Years $40-$60 Ibn Kathir, Al-Jalalayn, AlTabari
8.2 Arabic Language Courses — 4 Courses
Progression: Beginner Arabic → Intermediate → Advanced Spoken → Ilm-e-Balaghat
# Course Title Level Duration Fee
(USD/mo)
Core Books
8 Beginner Arabic Beginner 3 Months $20-$30 Al-Arabiyyah Bayna
Yadayk
9 Intermediate Arabic Intermediate 6 Months $25-$40 Al-Arabiyyah Bayna
Yadayk Vol 2-3
10 Advanced Spoken Arabic Advanced 1 Year $35-$50 Advanced conversation +
media texts
11 Advanced Ilm-e-Balaghat Advanced 1 Year $40-$60 Mukhatasar al-Maani,
classical texts
8.3 Fiqh Courses — 6 Courses
Progression: Basic Qudoori → Intermediate Kanz → Advanced Hidaya + Usool al-Fiqh track (3 levels)
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 20
# Course Title Level Duration Fee
(USD/mo)
Core Books
12 Basic Fiqh — Qudoori Beginner 2-3 Months $20-$30 Mukhtasar al-Qudoori
13 Intermediate Fiqh — Kanz Intermediate 6 Months $25-$35 Kanz al-Daqa'iq
14 Advanced Fiqh — AlHidaya
Advanced 1 Year $35-$50 Al-Hidaya (Al-Marghinani)
15 Basic Usool al-Fiqh —
Shashi
Beginner 3 Months $20-$30 Usool al-Shashi
16 Intermediate Usool al-Fiqh Intermediate 6 Months $25-$35 Nur al-Anwar
17 Advanced Usool al-Fiqh Advanced 1 Year $35-$50 Al-Tawdih wa al-Talwih
8.4 Sarf & Nahw (Grammar) — 3 Courses
Progression: Basic → Intermediate (Al-Kafia) → Advanced (Sharah al-Jami)
# Course Title Level Duration Fee
(USD/mo)
Core Books
18 Basic Sarf & Nahw Beginner 6 Months $20-$30 Ilm us-Sarf basics, Mizan
ul-Sarf
19 Intermediate Sarf & Nahw Intermediate 10 Months $25-$35 Ilm us-Sigha, Al-Kafia
20 Advanced Sarf & Nahw Advanced 8 Months $35-$50 Sharah al-Jami
8.5 Hadith Sciences — 4 Courses
Progression: Basic → Intermediate → Advanced → Takhassus fil Hadith (highest specialization)
# Course Title Level Duration Fee
(USD/mo)
Core Books
21 Basic Hadith Beginner 4 Months $20-$30 Riyadh-us-Saliheen
(selected)
22 Intermediate Hadith Intermediate 6 Months $25-$35 Mishkat al-Masabih
23 Advanced Hadith Advanced 2 Years $35-$50 Sahih al-Bukhari, Sahih
Muslim
24 Takhassus fil Hadith Specialization 2 Years $50-$70 All 6 major Hadith
collections + Sharah
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 21
9. Multi-Language System & Typography
9.1 Font Stack by Language
Language Font Family Usage Direction
Arabic (العربية (Amiri (Google Fonts) Quranic text, Arabic headings,
Islamic content, Hadith
RTL (dir=rtl)
Urdu (اردو (Jameel Noori Nastaleeq Urdu UI translations, course
content
RTL (dir=rtl)
English Poppins, Inter, Roboto
(fallback)
UI labels, admin panel, forms,
system content
LTR (dir=ltr)
9.2 i18n Implementation
• Translation files: /public/locales/en/translation.json, /ar/translation.json, /ur/translation.json
• Language detection order: localStorage → navigator.language → default 'en'
• RTL auto-toggle: <html dir='rtl'> set automatically on AR/UR selection
• Font auto-switch: CSS class on <body> (lang-ar, lang-ur, lang-en) changes font-family
• Hijri calendar display option alongside Gregorian for Islamic dates
9.3 Theme System
Theme Primary Accent Background Text CSS Variable
Light (default) #0F766E (teal-green) #FFFFFF #111827 data-theme='light'
Dark #10B981 (emerald) #0F172A #F1F5F9 data-theme='dark'
Islamic Green #065F46 (deep green) #ECFDF5 #1F2937 data-theme='green'
• Theme persisted in localStorage and synced to profiles.theme column in Supabase
• CSS custom properties (--color-primary, --color-bg, --color-text) switched via data-theme
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 22
10. Real-Time Features — Supabase Realtime
Supabase Realtime uses WebSocket channels (Phoenix-backed) to push DB changes to subscribed
clients. No separate Socket.io server is required.
Channel Trigger Subscribers UI Effect
courses:changes INSERT/UPDATE on
courses
Public (all visitors) Course count updates
live, new card appears
admissions:status UPDATE on
admissions.status
Authenticated
applicant
Toast: Your application
has been approved
notifications:user INSERT on notifications
for user
Authenticated user Bell badge count
increments, item added
notifications:broadcast INSERT where
target_role=all
All authenticated users Global notification
banner
blogs:published INSERT on blogs where
status=published
Public visitors New blog card appears
in listing
courses:count UPDATE on
courses.students_count
Public Card enrollment number
updates
10.1 Daily Content Scheduler
• node-cron job runs daily at 00:00 PKT
• Queries daily_content table for today's date
• Inserts notification records for all users (type: ayah, hadith)
• Supabase Realtime pushes to connected clients instantly
• Homepage displays today's Ayah + Hadith in dedicated cards with Arabic (Amiri) font
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 23
11. Featured Scholar — Dr. Noor Ur Rahman Hazarvi
The About Us page prominently features the founding scholar as primary scholarly authority and
supervisor of all Al-Itqan courses.
Dr. Noor Ur Rahman Hazarvi (Hafizahullah)
Head of Hadith Specialization — Jamia Al-Rashid Karachi
PhD: International Islamic University Islamabad (CGPA 4.0 —
Highest Grade)
MPhil: Hadith Sciences — IIUI (Highest Distinction)
MA Arabic: IIUI — Gold Medal
Alimiyyah: 1st Position Nationwide — Wafaq al-Madaris al-Arabiyyah
Pakistan
Kharij: Jamia Banori Town, Karachi
Daktūra: Ulum as-Sunnah — Advanced Specialization
Current Positions
• Head — Specialization in Hadith Department, Jamia Al-Rashid Karachi
• Member — Specialization in Hadith Department, Jamia Haqqania Akora Khattak
• Coordinator — MS Islamic Studies (Hadith), Al-Ghazali University Karachi
Previous Academic Positions
• Visiting Lecturer — University of Chakwal
• Visiting Lecturer — University of Peshawar
• Assistant Professor (Adjunct Faculty) — Al-Kawthar University Karachi
• Columnist — Wafaq al-Madaris (scholarly magazine, several years)
Areas of Scholarly Expertise
• Ilm al-Tafsir — Science of Quranic Exegesis
• Ilm al-Ilal — Science of Hidden Defects in Hadith
• Ilm al-Jarh wa al-Tadil — Narrator Criticism and Praise
• Ulum al-Hadith — Hadith Sciences (full spectrum)
• Usul al-Fiqh al-Hanafi with practical jurisprudential applications
• Ilm al-Balagha — Arabic Rhetoric and Literary Sciences
• Arabic Literature, Nahw (Syntax) and Sarf (Morphology)
• Mantiq (Logic) and other classical Islamic disciplines
Languages
• Arabic — Native scholarly fluency (oratory and writing)
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 24
• Urdu — Native
• English — Proficient
• Pashto — Proficient
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 25
12. SEO & Indexing Specification
Site URL: https://itqaninstitute.com
Meta Title: Al-Itqan | Islamic & Arabic Studies Institute
Meta
Description:
Al-Itqan Institute for Islamic & Arabic Studies is a premier online academy offering
structured learning from foundational Quran recitation to advanced Arabic, Fiqh, and
Hadith sciences.
OG Image: https://i.ibb.co/V0pRN6XT/logo.png
Favicon
ICO:
https://uksptkeroneiqfcqzsgh.supabase.co/storage/v1/object/public/assets/favicon.ico
Favicon
32px:
https://uksptkeroneiqfcqzsgh.supabase.co/storage/v1/object/public/assets/favicon32x32.png
Apple
Touch Icon:
https://uksptkeroneiqfcqzsgh.supabase.co/storage/v1/object/public/assets/appletouch-icon.png
12.1 robots.txt Configuration
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /student/
Disallow: /teacher/
Sitemap: https://itqaninstitute.com/sitemap.xml
12.2 sitemap.xml Pages
• https://itqaninstitute.com/ — Homepage
• https://itqaninstitute.com/courses — Courses
• https://itqaninstitute.com/blogs — Blogs
• https://itqaninstitute.com/admission — Admission
• https://itqaninstitute.com/about — About Us
• https://itqaninstitute.com/contact — Contact Us
• https://itqaninstitute.com/blogs/:slug — Dynamic blog pages (all published)
• https://itqaninstitute.com/courses/:id — Dynamic course detail pages
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 26
13. Project Folder Structure
13.1 Frontend — React + Vite
itqan-frontend/
├── public/
│ ├── locales/en/translation.json
│ ├── locales/ar/translation.json
│ ├── locales/ur/translation.json
│ ├── robots.txt & sitemap.xml
├── src/
│ ├── api/ # Axios instances + typed API call functions
│ ├── assets/ # Images, fonts, SVGs, icons
│ ├── components/
│ │ ├── layout/ # Navbar, Footer, RTLProvider, ThemeSwitcher
│ │ ├── ui/ # Button, Input, Modal, Toast, Skeleton, Badge
│ │ ├── forms/ # MultiStepForm, PasswordMeter, FileDropzone
│ │ └── cards/ # CourseCard, BlogCard, ScholarCard
│ ├── hooks/ # useAuth, useTheme, useLanguage, useNotifications
│ ├── i18n/ # i18next config + language detection
│ ├── pages/
│ │ ├── public/ # Home, Courses, Blogs, BlogDetail, About, Admission,
Contact
│ │ ├── admin/ # Dashboard, CourseMgmt, BlogMgmt, Admissions, Users,
Messages
│ │ ├── student/ # Dashboard, MyCourses, Certificates, Profile
│ │ └── teacher/ # Dashboard, Courses, Students, Profile
│ ├── router/ # React Router config + ProtectedRoute HOC
│ ├── store/ # Zustand stores: authStore, themeStore, langStore
│ ├── supabase/ # createClient() init file
│ └── utils/ # validators.js, formatters.js, constants.js
├── .env # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY,
VITE_API_BASE_URL
└── vite.config.js
13.2 Backend — Node.js + Express
itqan-backend/
├── src/
│ ├── config/ # supabaseClient.js, corsOptions.js, rateLimiter.js
│ ├── middleware/ # authenticate.js, roleGuard.js, validate.js,
errorHandler.js
│ ├── routes/ # auth.js, courses.js, blogs.js, admissions.js,
│ │ # notifications.js, contact.js, admin.js, enrollments.js
│ ├── controllers/ # One controller per route group (thin, delegates to
services)
│ ├── services/ # Business logic: supabase calls, storage ops, email
│ ├── validators/ # Joi/Zod schemas for each route group
│ └── utils/ # logger.js, tempEmailBlocklist.js, passwordHash.js
├── scripts/
│ ├── seed-admin.js # Seeds SUPER_ADMIN (run once on first deploy)
│ └── seed-courses.js# Seeds all 24 courses with full metadata
├── app.js # Express app: middleware stack + route mounting
├── server.js # HTTP server entry point (PORT=8080)
└── .env # SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, JWT_SECRET,
PORT
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 27
14. Contact & Communication Specification
WhatsApp Number: +923434487450
WhatsApp URL: https://wa.me/923434487450
Email: info@itqaninstitute.com
Website: https://itqaninstitute.com
Support Hours: 24/7 (global online institute)
Reach: Online — Global Access (no physical address)
14.1 WhatsApp Integration Points
• Homepage hero CTA — primary 'Chat on WhatsApp' button
• Contact page hero CTA — 'WhatsApp Chat' button
• Quick Support cards (Course Guidance, Admission Help, Technical Support)
• Footer WhatsApp icon + number hyperlink
• Mobile sticky floating WhatsApp button (bottom-right)
• Contact form submission success — option to follow up on WhatsApp
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 28
15. Development Phases & Milestones
Phase Sprint Deliverables Duration
Phase 1 —
Foundation
Sprint 1 Supabase setup, DB schema, RLS policies, seed
scripts
1 Week
Phase 1 —
Foundation
Sprint 2 Node.js backend skeleton, all API routes,
middleware stack
1 Week
Phase 2 — Public
Frontend
Sprint 3 Navbar, Footer, Theme system, i18n, Homepage
(full)
1 Week
Phase 2 — Public
Frontend
Sprint 4 Courses page, Blogs page, Blog detail,
Search+Filter
1 Week
Phase 2 — Public
Frontend
Sprint 5 About Us (Scholar profile), Admission multi-step
forms
1 Week
Phase 2 — Public
Frontend
Sprint 6 Contact Us page, FAQ accordion, form API
integration
3 Days
Phase 3 — Auth &
Roles
Sprint 7 Login/Signup, Protected routes, role-based
redirects
1 Week
Phase 4 — Admin
Panel
Sprint 8 Admin dashboard, Course CRUD, Blog manager
(TipTap)
1 Week
Phase 4 — Admin
Panel
Sprint 9 Admission manager, User management, Contact
inbox
1 Week
Phase 5 — Student
Panel
Sprint 10 Student dashboard, My Courses, Progress,
Certificates
1 Week
Phase 6 — Teacher
Panel
Sprint 11 Teacher dashboard, Assigned courses, Student
list
1 Week
Phase 7 — RealTime
Sprint 12 Supabase Realtime channels, Notifications, Daily
scheduler
1 Week
Phase 8 — SEO &
Launch
Sprint 13 SEO meta, sitemap, robots.txt, performance
audit
1 Week
Phase 8 — SEO &
Launch
Sprint 14 Production deploy, SSL, env config, smoke
testing
3 Days
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 29
16. Deployment & Environment Configuration
16.1 Frontend Environment (.env)
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-public-key]
VITE_API_BASE_URL=https://itqaninstitute.com/api/v1
VITE_WA_NUMBER=923434487450
16.2 Backend Environment (.env)
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[service-role-secret — KEEP PRIVATE]
JWT_SECRET=[random-64-char-string]
PORT=8080
NODE_ENV=production
FRONTEND_URL=https://itqaninstitute.com
16.3 Recommended Hosting Stack
Service Purpose Plan
Supabase (cloud) Database, Auth, Storage, Realtime Free tier → Pro ($25/mo) as scale grows
Vercel React frontend hosting (CDNbacked)
Free → Pro for custom domains + analytics
Railway / Render Node.js backend hosting Railway Starter ($5/mo) — persistent, easy
deploy
Cloudflare CDN, DNS management, DDoS
protection
Free plan covers DNS + CDN
GitHub Actions CI/CD — auto-deploy on push to
main
Free for public repos
Al-Itqan Institute for Islamic & Arabic Studies — PRD v2.0 | CONFIDENTIAL
https://itqaninstitute.com | info@itqaninstitute.com | Page 30
17. Document Control & Sign-Off
Document Version: 2.0 — Final Production PRD
Date: March 2026
Classification: CONFIDENTIAL — Internal Use Only
Institute: Al-Itqan Institute for Islamic & Arabic Studies
Scholar Authority: Dr. Noor Ur Rahman Hazarvi (Hafizahullah)
Website: https://itqaninstitute.com
Email: info@itqaninstitute.com
WhatsApp: https://wa.me/923434487450
Tech Stack: React 18 + Vite + TailwindCSS + Node.js/Express + Supabase
PostgreSQL
Total Sections: 17 sections covering all aspects from DB schema to
deployment
Total Courses: 24 courses (auto-seeded) across 5 Islamic disciplines
Al-Itqan Institute — Serving Authentic Islamic Knowledge Globally
https://itqaninstitute.com

animation

GLASSMORPHISM UI (ANIMATED & PREMIUM)