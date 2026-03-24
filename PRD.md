☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 1 of 26 • www.alnooracademy.com
☪ Al-NOOR Online Quran & Hadees Academy ☪
ننننن • Knowledge of Light • ننننن ننن
World's First Complete Islamic Knowledge Web App
PRODUCT REQUIREMENTS DOCUMENT
Document Version v2.0 — Complete Edition
Prepared By Al-NOOR Academy Product Team
Scholar Supervisor Dr. Noor Ur Rahman Hazarvi (ḥāfiẓahūllāh)
Date June 2025
Status 🟢 Approved & Active
Classification 🟢 CONFIDENTIAL
Platform Web Application (Desktop & Mobile Responsive)
Technology Stack React · Node.js · Supabase · Tailwind CSS
Languages English · Arabic (RTL) · Urdu (RTL)
Themes Green Islamic (Default) · Light Mode · Dark Mode
Total Courses 24 Structured Courses across 5 Disciplines
Arabic/Urdu Fonts Amiri, Noto Naskh Arabic, Scheherazade New, Traditional Arabic, Arial, sansserif
ِم ☪
ِس ْ
ِللا ب

ن
ٰ
م
ْ
ح
َّ
ِم الر
ْ
ِحي
َّ
الر
"In the name of Allah, the Most Gracious, the Most Merciful"
"Read! In the name of your Lord who created." — Surah Al-Alaq 96:1
"Allah will exalt those who believe among you, and those who have knowledge, to high ranks." — Surah AlMujadila 58:11
◆ ◆ ◆
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 2 of 26 • www.alnooracademy.com
 1. Executive Summary
Al-NOOR Online Quran & Hadees Academy is a world-class Islamic education web application providing complete and
structured Islamic knowledge from the foundational level to advanced scholarly specialization. Under the scholarly
supervision of Dr. Noor Ur Rahman Hazarvi (ḥāfiẓahūllāh) — PhD from International Islamic University Islamabad, Khārij of
Jamia Banori Town, and Daktūra fī ʿUlūm as-Sunnah — the academy offers an authentic and continuous learning journey
starting from Noorani Qaida, progressing through Qur'an Nazra, Tajweed, Hifz-ul-Qur'an, Tarjuma & Tafseer, Balaghat, Ilmus-Sarf, Ilm-un-Nahw, Spoken & Advanced Arabic, and advancing into Fiqh, Usool-ul-Fiqh, Hadith sciences, culminating in
Takhassus fil Hadees.
This unified platform is designed for students worldwide seeking authentic Islamic education online with a clear roadmap,
certifications, and scholar-led instruction. The system encompasses four tightly integrated panels — Public, Admin, Student,
and Teacher — powered by a modern, scalable technology stack (React, Node.js, Supabase).
Core Objectives
▸ Deliver a professional, globally accessible Islamic learning platform
▸ Enable seamless management of admissions, courses, payments, and attendance
▸ Support multi-language (EN / AR / UR) and multi-theme accessibility for diverse learners
▸ Provide one-to-one live classes with qualified scholars via an intuitive interface
▸ Ensure platform security (Supabase RLS + JWT), scalability, and full mobile responsiveness
▸ Build a strong SEO-optimized public presence for organic global reach
▸ Complete Islamic syllabus from beginner to specialization — all in one platform
 2. Product Overview
Product Name Al-NOOR Online Quran & Hadees Academy
Platform Web — Desktop & Mobile Responsive (320px and above)
Target Audience Students of all ages — children & adults — globally
Languages English, Arabic (RTL), Urdu (RTL)
Theme System Green Islamic (Default) · Light Mode · Dark Mode
Courses Offered 24 structured courses across 5 disciplines
Live Class Format One-to-One with qualified scholars via video call
Certificates PDF completion certificates for every course
Scholar Supervisor Dr. Noor Ur Rahman Hazarvi (ḥāfiẓahūllāh)
 2.1 Panel Architecture
Panel Primary Purpose Primary Users
Public Panel Marketing site — homepage, courses, admissions, about All Visitors
Admin Panel Full system management — students, teachers, courses,
payments Academy Admins
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 3 of 26 • www.alnooracademy.com
Panel Primary Purpose Primary Users
Student Panel Personal learning space — courses, progress, certificates Enrolled Students
Teacher Panel Class management — students, attendance, sessions Assigned Teachers
 3. SEO Strategy — Complete Specification
 3.1 SEO Meta Tags
Meta Title (58–60 chars) Al-NOOR Online Quran & Hadees Academy | Complete Islamic Knowledge
Web App
Meta Description (155–160 chars) Learn complete Islamic knowledge online with Al-NOOR Online Quran &
Hadees Academy—from Noorani Qaida, Hifz-ul-Qur’an, Tafseer, Arabic
language, Fiqh, Hadith, to Takhassus fil Hadees under qualified scholars.
SEO Slug / URL /online-quran-hadees-academy
Open Graph og:title Al-NOOR Online Quran & Hadees Academy | Complete Islamic Knowledge
Web App
Open Graph og:type website
Open Graph og:image alt Online Quran and Hadees learning at Al-NOOR Academy
Canonical Tag https://www.alnooracademy.com/online-quran-hadees-academy
 3.2 Heading Hierarchy
Tag Content
H1 (Main Heading) World's First Complete Islamic Knowledge Web App
H2 (Secondary Heading) From Noorani Qaida to Takhassus fil Hadees — All in One Platform
H3 (Supportive Section) Why Choose Al-NOOR Online Quran & Hadees Academy?
H3 (Courses) Complete 24-Course Islamic Curriculum
H3 (Scholar) Scholarly Supervision by Dr. Noor Ur Rahman Hazarvi
H3 (Admission) Simple Online Admission & Approval System
 3.3 Primary & Secondary Keywords
Primary Focus Keywords
▸ Online Quran Academy
▸ Online Hadees Academy
▸ Islamic Knowledge Web App
▸ Noorani Qaida Online
▸ Hifz-ul-Quran Online
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 4 of 26 • www.alnooracademy.com
▸ Tafseer Quran Course
▸ Arabic Language Online
▸ Ilm-us-Sarf & Nahw
▸ Fiqh and Usool-ul-Fiqh
▸ Hadith Studies Online
▸ Takhassus fil Hadees
▸ Islamic Studies Online
Secondary & Long-tail Keywords
▸ One-to-one online Quran classes
▸ Online Tajweed course with certification
▸ Dars-e-Nizami online program
▸ Advanced Balaghat Arabic course online
▸ Ilm-us-Sigha and Al-Kafia online
▸ Sharah al-Jami advanced Arabic grammar
▸ Sahih Bukhari online study
▸ Usool Fiqh Noor-ul-Anwar online
▸ Islamic certificate courses online
▸ Qualified scholar-supervised online Quran
 3.4 SEO Above-the-Fold Paragraph
Homepage SEO Paragraph (Exact Text for H1 Section)
Al-NOOR Online Quran & Hadees Academy is a world-class Islamic education web app providing
complete and structured Islamic knowledge from the foundational level to advanced scholarly
specialization. Under the scholarly supervision of Dr. Noor Ur Rahman Hazarvi (ḥāfiẓahūllāh)—PhD
from International Islamic University Islamabad, Khārij of Jamia Banori Town, and Daktūra fī
ʿUlūm as-Sunnah—the academy offers an authentic and continuous learning journey starting from
Noorani Qaida, progressing through Qur’an Nazra, Tajweed, Hifz-ul-Qur’an, Tarjuma & Tafseer,
Balaghat, Ilm-us-Sarf, Ilm-un-Nahw, Spoken & Advanced Arabic, and advancing into Fiqh,
Usool-ul-Fiqh, Hadith sciences, culminating in Takhassus fil Hadees.
This unified platform is designed for students worldwide seeking authentic Islamic education
online with a clear roadmap, certifications, and scholar-led instruction.
 3.5 H3 Why Choose Al-NOOR Section
▸ Complete Islamic syllabus from beginner to specialization
▸ Qualified scholar supervision with traditional sanad-based learning
▸ One-to-one online classes & recorded lessons
▸ Structured curriculum with progress tracking
▸ Global access with multilingual support (Urdu, Arabic, English)
▸ Secure admission, approval, and payment system
 3.6 Schema & Technical SEO
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 5 of 26 • www.alnooracademy.com
Schema Type Implementation Details
Organization Schema Academy name, URL, logo, contact, sameAs (social profiles)
Person Schema Dr. Noor Ur Rahman Hazarvi — name, credentials, affiliation, jobTitle
Course Schema Implemented per each of the 24 courses: name, description, provider, price
FAQ Schema Admissions FAQ, class format FAQ, payment FAQ, language FAQ
BreadcrumbList Home > Courses > [Course Name] for all course pages
WebSite Schema Site name, URL, search action (sitelinks searchbox)
EducationalOrg Accreditation, hasCredential, teaches properties
Technical SEO Element Requirement / Target
XML Sitemap Auto-generated; all 24 course pages + main pages; submitted to GSC
Canonical Tags Self-referencing canonical on every page; no duplicate content
hreflang en, ar, ur language tags declared on all pages
Core Web Vitals LCP < 2.5s, FID < 100ms, CLS < 0.1 — monitored via Search Console
Image Alt Text "Online Quran and Hadees learning at Al-NOOR Academy" + course-specific alts
Robots.txt Allow all; disallow admin/student/teacher panel routes
HTTPS Enforced site-wide; HSTS header enabled
Structured Slugs /courses/noorani-qaida, /courses/hifz-ul-quran, /courses/takhassus-fil-hadees, etc.
Page Speed Lazy-load images; preload Amiri & Noto Naskh Arabic fonts; CDN-served assets
 4. Font System & Arabic/Urdu Typography
 4.1 Arabic & Urdu Font Stack (Complete CSS Declaration)
font-family: Amiri, "Noto Naskh Arabic", "Scheherazade New", "Traditional Arabic", Arial, sans-serif !important;
This complete font stack ensures maximum Arabic/Urdu rendering compatibility across all operating systems and browsers
worldwide. Each font serves as a graceful fallback in priority order.
Priority Font Name Role Loading Method
1 — Primary Amiri Main Arabic/Urdu display & body font;
classical beauty
Google Fonts CDN
(preload)
2 — Fallback Noto Naskh Arabic Google's comprehensive Naskh covering full
Unicode Arabic
Google Fonts CDN
(preload)
3 — Fallback Scheherazade New SIL International; excellent for extended
Arabic scripts Google Fonts CDN
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 6 of 26 • www.alnooracademy.com
Priority Font Name Role Loading Method
4 — System Traditional Arabic Windows built-in; ensures Windows user
coverage
System (built-in)
5 — Generic Arial Universal Latin/Arabic hybrid fallback System (built-in)
6 — Generic sans-serif Ultimate browser-default fallback Browser default
 4.2 Complete Font CSS Implementation
/* Global Arabic/Urdu font applied when lang=ar or lang=ur */ [lang="ar"], [lang="ur"], [dir="rtl"] { font-family: Amiri, "Noto Naskh
Arabic", "Scheherazade New", "Traditional Arabic", Arial, sans-serif !important; line-height: 2.0; letter-spacing: 0; } /* Google
Fonts Import */ @import
url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Naskh+Arabic:wght@400;50
0;600;700&family=Scheherazade+New:wght@400;500;600;700&display=swap'); /* English Display Fonts */ font-family:
"Cormorant Garamond", "Cinzel", Calibri, serif; /* Hero headings */ font-family: Calibri, "Segoe UI", sans-serif; /* Body & UI
elements */
 4.3 Complete Font Reference Table
Font Language Weight Options Usage in App
Amiri Arabic/Urdu 400, 700 (+ italic variants) All AR/UR body text, Bismillah, headings,
navigation
Noto Naskh Arabic Arabic 400, 500, 600, 700 Fallback Arabic rendering; Quranic text
display
Scheherazade New Arabic 400, 500, 600, 700 Extended Arabic scripts; specialized Quranic
display
Traditional Arabic Arabic Regular Windows OS system fallback
Arial Universal Regular, Bold Cross-platform generic fallback
Cormorant Garamond English 300, 400, 500, 600, 700 English hero headings & hero text
Cinzel English 400, 600, 700 Splash screen title, brand name
Calibri English 400, 700 Body text, forms, admin/student panels
 5. Functional Requirements
 5.1 Public Panel
Responsive Navbar
▸ Academy round logo with animated glow and pulse effect on load
▸ Academy name: Al-NOOR Online Quran & Hadees Academy (responsive; truncates on mobile)
▸ Navigation links: Home | Courses | About Us | Admission | Contact
▸ Language switcher: English (EN) | Arabic (AR) | Urdu (UR) with flag icons
▸ Theme toggler: Green Islamic / Light / Dark with smooth CSS transition
▸ Login button (secondary) and Apply Now button (primary gold CTA)
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 7 of 26 • www.alnooracademy.com
▸ Mobile hamburger menu — fully collapsible with slide-in animation
Hero Section
▸ HTML5 video background with compressed MP4/WebM; poster image fallback on mobile
▸ Bismillah Arabic calligraphy overlay using Amiri font with fade-in animation
▸ H1 tag: World's First Complete Islamic Knowledge Web App
▸ H2 tag: From Noorani Qaida to Takhassus fil Hadees — All in One Platform
▸ Dual CTAs: Explore Courses (primary gold) & Apply Now (secondary)
▸ Animated Islamic geometric pattern overlay (CSS SVG)
▸ Scroll-down indicator with smooth bounce animation
Course Preview Section (Condensed)
▸ 8 featured courses displayed with course images, titles, levels, duration, and fees
▸ CTA buttons: View Course Details and View All 24 Courses
▸ Animated card hover: lift effect, gold border, shadow transition
Courses Page — All 24 Courses
▸ Full listing of all 24 courses with cover image, title, level, category, duration, fee
▸ Filter bar: by Category (Quran / Arabic / Fiqh / Sarf & Nahw / Hadith) and Level
▸ Progression path clearly shown per discipline (e.g., Basic > Intermediate > Advanced)
▸ Enrollment CTA per course linking to Admission form with pre-selected course
Admission Page
▸ Fields: Full Name, Email, Phone, Country, Age, Language Preference
▸ Course selection dropdown (all 24 courses), preferred timing, guardian info (minors)
▸ Real-time form validation + success/error toast notifications
▸ Data persisted to Supabase admissions table with status: pending
About Us Page
▸ Academy mission, vision, and Islamic teaching philosophy
▸ Scholar profile: Dr. Noor Ur Rahman Hazarvi — photo, PhD credentials, Jamia Banori Town
▸ Teaching methodology — one-to-one live sessions, flexible timings, sanad-based learning
▸ Animated stats counters: students enrolled, courses, countries, years of excellence
Footer
▸ Contact details: email, phone, WhatsApp link
▸ Quick links: all main pages and social media icons
▸ Copyright notice and Islamic greeting
 5.2 Admin Panel
Dashboard
▸ KPI cards: Total Students, Active Teachers, Active Courses, Pending Admissions
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 8 of 26 • www.alnooracademy.com
▸ Recent enrollments list and payment charts (bar + pie)
▸ Quick actions: Add Student, Add Teacher, Review Admissions
Student Management
▸ Paginated, searchable, filterable table of all students
▸ Add / Edit / Deactivate student records and profiles
▸ Per-student view: enrolled courses, payment history, attendance log
Teacher / Scholar Management
▸ Add, edit, and manage teacher/scholar profiles and specializations
▸ Assign teachers to courses with one-click assignment
▸ View teacher's assigned students and session schedule
Course Management
▸ Create, update, publish, and archive all 24 courses with progression paths
▸ Set: title, level, category, description, fee, image, core books, prerequisites, teacher
▸ Upload course materials and resources to Supabase Storage
Admission Management
▸ Review pending applications with full student details
▸ Approve / Reject / Defer with one-click action and admin notes
▸ Auto-assign teacher upon approval; auto-notify student via email
Payment Management
▸ Track fees, payment status (paid / pending / overdue) per student
▸ Per-student payment timeline and receipt PDF generation
▸ Export payment reports as CSV and PDF
 5.3 Student Panel
▸ Personal dashboard: enrolled courses, animated progress bars, upcoming sessions
▸ Assigned teacher profile with credentials and contact/WhatsApp link
▸ Course access: structured lessons, downloadable materials, recorded sessions
▸ Course progression path display: current course and next recommended course
▸ Attendance history: per-session attendance with date and status
▸ Certificate page: view and download PDF completion certificate per course
▸ Profile management: update personal info, avatar, change password
 5.4 Teacher Panel
▸ Dashboard: assigned courses count, total students, upcoming session schedule
▸ Student list per course with contact details, progress, last session date
▸ Attendance management: mark present / absent / late per session with date
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 9 of 26 • www.alnooracademy.com
▸ Session notes and material upload per class
▸ Direct communication link to contact assigned students
 6. Complete Course Catalogue — All 24 Courses
Al-NOOR Online Quran & Hadees Academy offers 24 professionally structured courses across five disciplines, organized in
clear progression paths from foundational beginner level through to advanced specialization. Every course is supervised by
Dr. Noor Ur Rahman Hazarvi (ḥāfiẓahūllāh).
 6.1 Quran Courses — 7 Courses
Progression Path: Noorani Qaida → Nazra Quran → Quran with Tajweed → Advanced Tajweed → Hifz-ul-Quran →
Tarjamat-ul-Quran → Advanced Tafseer
 Course 1 — Noorani Qaida Course
Level Beginner
Category Quran
Duration 2–3 Months
Schedule 3–5 days/week · 30 min (children) / 45 min (adults)
Fee $20–$30/month (~PKR 5,500–8,500)
Prerequisites None
Next Course Nazra Quran / Quran with Tajweed
Description: A beginner-level course designed for students who want to start learning how to read the Holy Quran
correctly. Focuses on basic Arabic alphabet, correct pronunciation (Makharij), joining letters, and simple reading rules.
Suitable for children, beginners, and new learners with no prior Arabic knowledge. Students learn to recognize Arabic
letters, pronounce from correct articulation points, combine letters into words, and read short Quranic phrases accurately.
Learning Outcomes: Identify all Arabic letters · Read joined letters and words · Apply basic pronunciation rules · Prepare for
Quran Reading with Tajweed
 Course 2 — Nazra Quran (Quran Reading Course)
Level Beginner
Category Quran
Duration 3–4 Months
Schedule 3–5 days/week · 30 min (children) / 45 min (adults)
Fee $25–$35/month (~PKR 7,000–10,000)
Prerequisites Noorani Qaida or basic Arabic letters knowledge
Next Course Quran with Tajweed
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 10 of 26 • www.alnooracademy.com
Description: Designed for students who know basic Arabic letters and want to read the Holy Quran fluently and correctly.
Focuses on reading speed, accuracy, and confidence while applying basic Tajweed rules. Regular recitation practice,
listening exercises, and correction sessions develop proper Quran reading skills.
Learning Outcomes: Read the Holy Quran confidently · Recognize common Tajweed rules · Prepare for advanced Tajweed
learning
 Course 3 — Quran with Tajweed Course
Level Intermediate
Category Quran
Duration 4–6 Months
Schedule 3–5 days/week · 30 min (children) / 45 min (adults)
Fee $30–$40/month (~PKR 8,500–11,500)
Prerequisites Nazra Quran or ability to read the Quran
Next Course Hifz-ul-Quran or Tafseer-ul-Quran
Description: Advanced Quran recitation course for students who can read the Quran but want to perfect recitation by
mastering complete Tajweed rules — Makharij, Sifaat, Ikhfa, Idgham, Iqlab, Qalqalah, Madd rules, and Waqf/Ibtida.
Teachers guide step-by-step through Quranic verse recitation with live correction.
Learning Outcomes: Recite the Holy Quran clearly, confidently, and according to proper Tajweed rules
 Course 4 — Advanced Tajweed Program
Level Advanced
Category Quran
Duration 1 Year
Schedule 3–5 days/week · 30–45 min per session
Fee $35–$50/month (~PKR 10,000–14,000)
Prerequisites Quran with Tajweed Course
Core Books Jamal ul-Quran, Khulasat ut-Tajweed, Fawaid Makkiyah, Al-Jazariyyah (Ibn al-Jazari)
Description: Complete one-year advanced Tajweed training program covering both theoretical and practical Tajweed.
Topics include Makharij, Sifaat, Noon Saakinah/Meem Saakinah rules, Ikhfa, Idgham, Iqlab, Qalqalah, Madd rules,
Waqf/Ibtida, and advanced recitation techniques. Students study from classical and recognized Tajweed books under
qualified teacher supervision.
Learning Outcomes: Develop strong theoretical Tajweed knowledge · Recite the Holy Quran fluently and accurately
according to authentic Tajweed rules · Prepare for high-level Quran recitation and further Islamic studies
 Course 5 — Hifz-ul-Quran (Quran Memorization Program)
Level Specialized
Category Quran
Duration 2.5–3 Years (Complete Hifz) / 6 Months–1 Year (Partial)
Schedule 5 days/week · 45–60 min per session
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 11 of 26 • www.alnooracademy.com
Fee $40–$60/month (~PKR 11,000–17,000)
Prerequisites Ability to read Quran correctly with Tajweed
Certificate Certificate of Quran Memorization upon completion
Description: Specialized memorization course for students wishing to memorize the Holy Quran completely or partially
under qualified Huffaz supervision. Focuses on systematic memorization, daily revision (Muraja'ah), and correct recitation
with Tajweed. Students follow a structured daily routine of new lesson (Sabaq), recent revision (Sabaqi), and old revision
(Manzil) to strengthen memorization and maintain accuracy.
Learning Outcomes: Complete or partial Quran memorization with Tajweed · Lifelong retention through structured revision
methodology
 Course 6 — Tarjamat-ul-Quran Course
Level Intermediate
Category Quran
Duration 1 Year
Schedule 3–5 days/week · 45–60 min per session
Fee $30–$45/month (~PKR 8,500–12,000)
Language Options Arabic, Urdu, or English
Prerequisites Basic Quran reading or Tajweed completion
Description: Comprehensive program for students wanting to understand the meanings and translation of the Holy Quran.
Focuses on Quranic verse interpretation, translation (Tafsir in simple language), key themes, moral guidance, rules, and
lessons. Connects the Arabic text with meaning through lectures, interactive discussions, verse-by-verse explanation, and
real-life application examples.
Learning Outcomes: Read Quranic verses and understand their translation accurately · Explain lessons and guidance
contained in the Quran · Prepare for advanced Islamic studies
 Course 7 — Advanced Tafseer-ul-Quran Course
Level Advanced
Category Quran
Duration 2 Years
Schedule 3–5 days/week · 45–60 min per session
Fee $40–$60/month (~PKR 11,000–17,000)
Core Texts Tafseer Ibn Kathir, Tafseer Al-Jalalayn, Tafseer Al-Tabari
Prerequisites Tarjamat-ul-Quran or equivalent
Description: Specialized two-year program for deep understanding of the Holy Quran — meanings, context, and rulings.
Goes beyond basic translation to comprehensive analysis including linguistic, grammatical, jurisprudential, and historical
contexts. Covers Usul al-Tafseer, Ta'wil and Tafsir, Asbab al-Nuzul, Ahkam al-Quran, Naskh (abrogation), and crossreferencing with Hadith and Sunnah.
Learning Outcomes: Understand the Quran in depth · Explain complex verses · Derive rulings · Teach Tafseer to others ·
Prepare for higher Islamic scholarship
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 12 of 26 • www.alnooracademy.com
 6.2 Arabic Language Courses — 4 Courses
Progression Path: Beginner Arabic → Intermediate Arabic → Advanced Spoken Arabic → Advanced Ilm-e-Balaghat
 Course 8 — Beginner Arabic Course
Level Beginner
Category Arabic Language
Duration 3 Months
Schedule 3–5 days/week · 30–45 min per session
Fee $20–$30/month (~PKR 5,500–8,500)
Core Books Al-Arabiyyah Bayna Yadayk, Arabic for Beginners
Prerequisites None
Description: Designed for students with no prior Arabic knowledge. Builds a strong foundation in Arabic reading, writing,
and comprehension covering the Arabic alphabet, pronunciation (Makharij), basic vocabulary, simple sentence structure,
Quranic word recognition, and essential phrases for daily use. Uses interactive teaching methods including practice
exercises, reading drills, and pronunciation correction.
Learning Outcomes: Read Arabic words · Understand simple phrases · Write basic sentences · Recognize Quranic words for
further studies
 Course 9 — Intermediate Arabic Course
Level Intermediate
Category Arabic Language
Duration 6 Months
Schedule 3–5 days/week · 45–60 min per session
Fee $25–$40/month (~PKR 7,000–11,000)
Core Books Al-Kitaab fii Ta'allum al-'Arabiyya (Parts 1 & 2), Arabic Grammar Made Easy
Prerequisites Beginner Arabic Course or basic Arabic knowledge
Description: Builds on beginner foundations with intermediate grammar (nouns, verbs, tenses, gender, sentence structure),
expanded vocabulary, reading short paragraphs, writing simple sentences, and basic conversational skills. Includes reading
exercises, conversation practice, writing short paragraphs, and comprehension drills. Also addresses Quranic phrase
comprehension for practical Islamic learning.
Learning Outcomes: Read and understand intermediate Arabic texts · Write simple paragraphs · Communicate in basic
conversation · Prepare for Advanced Spoken Arabic
 Course 10 — Advanced Spoken Arabic Course
Level Advanced
Category Arabic Language
Duration 1 Year
Schedule 3–5 days/week · 45–60 min per session
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 13 of 26 • www.alnooracademy.com
Fee $35–$50/month (~PKR 10,000–14,000)
Core Books Al-Mawrid (Arabic-English Dictionary), Fus'ha Arabic for Advanced Learners, Arabic
Conversation Made Easy
Prerequisites Intermediate Arabic Course
Description: For students who have completed Intermediate level and want to achieve fluency in Arabic speaking, reading,
writing, and comprehension. Covers advanced grammar, complex sentence structures, advanced vocabulary for daily and
Islamic contexts, fluent conversation, Quranic and Hadith Arabic comprehension, essay writing, and listening skills. Teaching
methods include role-playing, conversation drills, listening comprehension, essay writing, Quranic text analysis, and
interactive discussions.
Learning Outcomes: Speak Arabic fluently · Understand classical and Quranic Arabic · Write advanced texts · Engage
confidently in conversation · Prepare for higher Islamic studies or teaching Arabic
 Course 11 — Advanced Ilm-e-Balaghat Course (Arabic Eloquence & Rhetoric)
Level Advanced
Category Arabic Language
Duration 1 Year
Schedule 3–5 days/week · 45–60 min per session
Fee $40–$60/month (~PKR 11,000–17,000)
Core Books Balaghat-ul-Quran, Al-Balagha al-Wadihah, Al-Bayan wa al-Tabyin (Al-Jahiz), Al-Badi’ fi al-Adab
Optional Miftah al-Balagha
Prerequisites Advanced Arabic or equivalent
Description: Designed for students wanting to master Arabic eloquence (Balagha), the art of rhetoric, literary analysis, and
stylistic excellence. Covers Ilm al-Ma'ani (Science of Meanings), Ilm al-Bayan (Science of Clarity — metaphors, similes,
allegories, metonymy), and Ilm al-Badi' (Science of Literary Ornamentation — figures of speech). Includes practical Quranic
and Hadith analysis, classical Arabic poetry analysis, and stylistic writing exercises.
Learning Outcomes: Analyze Quranic verses and Hadith using Balagha principles · Recognize and apply advanced rhetorical
devices · Compose eloquent Arabic texts · Prepare for advanced Tafseer, Hadith analysis, and Arabic literature scholarship
 6.3 Fiqh Courses — 6 Courses
Fiqh Progression: Basic Fiqh (Qudoori) → Intermediate Fiqh (Kanz) → Advanced Fiqh (Hidaya)
Usool Fiqh Progression: Basic (Shashi) → Intermediate (Noor-ul-Anwar to Qiyas) → Advanced (Noor-ul-Anwar Qiyas
onwards + Husami, Taozi, Talwe)
 Course 12 — Basic Fiqh Course
Level Beginner
Category Fiqh
Duration 2–3 Months
Schedule 3–5 days/week · 45 min per session
Fee $20–$30/month (~PKR 5,500–8,500)
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 14 of 26 • www.alnooracademy.com
Main Book Mukhtasar al-Qudoori
Next Course Intermediate Fiqh (Kanz)
Description: Introduces fundamentals of Islamic jurisprudence in a simple, accessible manner. Covers acts of worship
(Ibadat) — Salah, Sawm, Zakat, Hajj — and personal/social conduct (Mu'amalat) including cleanliness, eating etiquettes,
and family interactions. Students learn to distinguish between Wajib, Mustahab, Mubah, Makruh, and Haram. Step-by-step
lessons with interactive practice and exercises.
Learning Outcomes: Recognize and apply basic fiqh rulings in worship and daily activities · Perform Salah, fasting, Zakat,
and Hajj correctly · Build foundation for Intermediate Fiqh
 Course 13 — Intermediate Fiqh Course
Level Intermediate
Category Fiqh
Duration 6 Months
Schedule 3–4 days/week · 60 min per session
Fee $25–$35/month (~PKR 7,000–10,000)
Main Book Kanz ud-Daqaiq
Prerequisites Basic Fiqh (Qudoori)
Next Course Advanced Fiqh (Hidaya)
Description: Builds on basic Fiqh with more detailed rulings and practical applications. Advanced worship topics include
missed/combined prayers, special fasting cases, detailed zakat calculation, and Hajj/Umrah rituals. Social and financial
matters — marriage, divorce, inheritance basics, contracts, and business transactions — are studied in greater depth. Reallife examples and teacher-led discussions strengthen understanding.
Learning Outcomes: Apply fiqh rulings to complex worship and social situations · Understand reasoning behind Islamic laws
· Prepare for Advanced Fiqh and scholarly discussions
 Course 14 — Advanced Fiqh Course
Level Advanced
Category Fiqh
Duration 12 Months (1 Year)
Schedule 3–4 days/week · 60–90 min per session
Fee $35–$50/month (~PKR 10,000–15,000)
Main Book Al-Hidaya (Imam al-Marghinani)
Prerequisites Intermediate Fiqh (Kanz)
Description: Designed for students seeking mastery in Islamic jurisprudence. Using the classical text Al-Hidaya, students
explore in-depth rulings for all acts of worship, complex social dealings, inheritance, criminal laws, and contemporary
challenges. Emphasizes research skills, analytical thinking, and the ability to apply fiqh principles to modern situations.
Prepares students for scholarly work, teaching, or advanced fiqh research, including skills to issue informed rulings (Ifta).
Learning Outcomes: Master classical fiqh texts · Apply Islamic law to contemporary scenarios · Conduct scholarly research ·
Issue informed fiqh guidance · Develop expertise for teaching or issuing fatawa
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 15 of 26 • www.alnooracademy.com
 Course 15 — Basic Usool Fiqh Course
Level Beginner
Category Fiqh
Duration 3 Months
Schedule 3–5 days/week · 45 min per session
Fee $20–$30/month (~PKR 5,500–8,500)
Main Book Usool Shashi
Next Course Intermediate Usool Fiqh (Noor-ul-Anwar)
Description: Designed for students new to the principles of Islamic jurisprudence. Using Usool Shashi, students learn
foundational rules and terminology for deriving Islamic rulings from the Quran and Sunnah. Topics include primary Shariah
sources (Quran, Sunnah, Ijma, Qiyas), basic types of evidence, and understanding obligatory, recommended, and
permissible actions. A simple and practical approach to understanding how jurists make legal decisions.
Learning Outcomes: Understand basic principles of Islamic law and legal derivation · Learn key fiqh terminology and
concepts · Prepare for Intermediate Usool Fiqh
 Course 16 — Intermediate Usool Fiqh Course
Level Intermediate
Category Fiqh
Duration 6 Months
Schedule 3–4 days/week · 60 min per session
Fee $25–$35/month (~PKR 7,000–10,000)
Main Book Noor-ul-Anwar (up to Qiyas)
Prerequisites Basic Usool Fiqh (Shashi)
Description: Builds on Shashi foundations using Noor-ul-Anwar to guide students through intermediate principles of Islamic
jurisprudence — Ijtihad, Qiyas, Ijma, definitive vs. speculative texts, and masalih al-mursalah (public interest). Emphasizes
applying principles to real-life fiqh cases and preparing students for advanced classical text study.
Learning Outcomes: Apply Usool Fiqh principles up to Qiyas · Understand reasoning behind juristic differences · Analyze reallife fiqh issues using scholarly methodology
 Course 17 — Advanced Usool Fiqh Course
Level Advanced
Category Fiqh
Duration 12 Months (1 Year)
Schedule 3–4 days/week · 60–90 min per session
Fee $35–$50/month (~PKR 10,000–15,000)
Main Books Noor-ul-Anwar (Qiyas to end), Husami, Taozi, Talwe
Prerequisites Intermediate Usool Fiqh
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 16 of 26 • www.alnooracademy.com
Description: For students aiming to achieve mastery in Islamic legal theory. Studies the later sections of Noor-ul-Anwar
along with Husami, Taozi, and Talwe to explore advanced principles, abrogation (Naskh), speculative vs. definitive texts,
contemporary legal issues, and juristic reasoning in complex scenarios. Focus on analytical thinking, case studies, research
exercises, and application of fiqh principles to modern situations.
Learning Outcomes: Master advanced Islamic jurisprudence principles · Analyze and evaluate differing juristic opinions ·
Conduct research in classical and contemporary fiqh · Apply Usool Fiqh methodology to modern legal and ethical issues
 6.4 Sarf & Nahw Courses — 3 Courses
Sarf & Nahw Progression: Basic (Irshad-us-Sarf, Nahw-e-Meer with Ijra) → Intermediate (Ilm-us-Sigha, Al-Kafia) → Advanced
(Sharah al-Jami)
 Course 18 — Basic Sarf & Nahw Course
Level Beginner
Category Sarf & Nahw (Arabic Grammar)
Duration 6 Months
Schedule 3–5 days/week · 45–60 min per session
Fee $20–$30/month (~PKR 5,500–8,500)
Main Books Irshad-us-Sarf, Nahw-e-Meer with Ijra
Next Course Intermediate Sarf & Nahw
Description: For students starting Arabic grammar and morphology from scratch. Covers Arabic letters, vowels (Harakat),
simple nouns and verbs (singular, dual, plural), basic sentence structures (subject, predicate, object), and practical exercises
using Quranic verses. Includes recitation practice (Ijra) to improve fluency and pronunciation. Emphasizes understanding
and applying basic grammatical rules in reading and writing Arabic.
Learning Outcomes: Read and understand basic Arabic sentences · Recognize and conjugate simple nouns and verbs · Apply
fundamental grammatical rules in Quranic reading · Prepare for Intermediate Sarf & Nahw
 Course 19 — Intermediate Sarf & Nahw Course
Level Intermediate
Category Sarf & Nahw (Arabic Grammar)
Duration 10 Months
Schedule 3–4 days/week · 60 min per session
Fee $25–$35/month (~PKR 7,000–10,000)
Main Books Ilm-us-Sigha, Al-Kafia
Prerequisites Basic Sarf & Nahw
Description: Provides deeper understanding of Arabic morphology and sentence structures. Covers detailed verb forms
(past, present, imperative) and derivatives, complex noun forms and pluralization, grammatical cases (Marfu', Mansub,
Majrur), sentence analysis (prepositions, pronouns, conjunctions), and application of rules to Quranic verses and classical
Arabic texts. Emphasizes reading comprehension and analytical skills.
Learning Outcomes: Analyze and construct complex Arabic sentences · Conjugate verbs and nouns accurately · Apply
grammar rules to Quranic and classical Arabic texts · Prepare for Advanced Sarf & Nahw
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 17 of 26 • www.alnooracademy.com
 Course 20 — Advanced Sarf & Nahw Course
Level Advanced
Category Sarf & Nahw (Arabic Grammar)
Duration 8 Months
Schedule 3–4 days/week · 60–90 min per session
Fee $35–$50/month (~PKR 10,000–15,000)
Main Book Sharah al-Jami
Prerequisites Intermediate Sarf & Nahw
Description: For students aiming for mastery in Arabic grammar and morphology. Using Sharah al-Jami, covers advanced
verb forms and derivatives, irregular verbs, complex sentence structures (conditional, negation, emphasis), advanced noun
forms and exceptions, syntax analysis of Quranic verses and Hadith, and application of grammar in advanced writing,
Tafseer, and scholarly interpretation.
Learning Outcomes: Master complex Arabic grammar and sentence structures · Analyze classical and Quranic texts
accurately · Prepare for advanced Islamic studies in Tafseer, Hadith, and Fiqh
 6.5 Hadith Courses — 4 Courses
Hadith Progression: Basic (Riyadh-us-Saliheen) → Intermediate (Mishkat al-Masabih) → Advanced (Sahih Bukhari, Sahih
Muslim, Sharah) → Takhassus fil Hadith
 Course 21 — Basic Hadith Course
Level Beginner
Category Hadith
Duration 4 Months
Schedule 3–5 days/week · 45 min per session
Fee $20–$30/month (~PKR 5,500–8,500)
Main Books Riyadh-us-Saliheen (selected sections) / Basic Hadith Notes
Next Course Intermediate Hadith
Description: Introduces students to the sayings, actions, and approvals of Prophet Muhammad (PBUH). Covers
fundamentals of Hadith sciences (Ilm al-Hadith), basic classification of Hadith (Sahih, Hasan, Da'if), selected Hadiths on daily
life, morals, and worship, and correct reading and basic Arabic understanding for Hadith. Focuses on practical application
and understanding how Hadith guides daily conduct and spiritual life.
Learning Outcomes: Understand basic Hadith classifications and importance · Memorize and explain selected Hadiths ·
Apply basic Hadith teachings to daily life · Prepare for Intermediate Hadith studies
 Course 22 — Intermediate Hadith Course
Level Intermediate
Category Hadith
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 18 of 26 • www.alnooracademy.com
Duration 6 Months
Schedule 3–4 days/week · 60 min per session
Fee $25–$35/month (~PKR 7,000–10,000)
Main Books Mishkat al-Masabih / Selected Hadith Collections
Prerequisites Basic Hadith Course
Description: Provides deeper understanding of Hadith with contextual analysis. Covers detailed Hadith collections
(meanings and context), the chain of narrators (Isnad) and Hadith terminology, practical application in daily life, and
comparison and analysis of Hadiths to resolve apparent contradictions. Bridges memorization and analytical understanding.
Learning Outcomes: Analyze Hadith texts with context and reasoning · Identify authentic Hadiths · Apply Hadith teachings
to contemporary situations · Prepare for Advanced Hadith studies
 Course 23 — Advanced Hadith Course
Level Advanced
Category Hadith
Duration 2 Years
Schedule 3–4 days/week · 60–90 min per session
Fee $35–$50/month (~PKR 10,000–15,000)
Main Books Sahih al-Bukhari, Sahih Muslim, Sharah of Major Hadith Collections
Prerequisites Intermediate Hadith Course
Description: For students aiming for mastery in Hadith studies. In-depth analysis of Sahih al-Bukhari, Sahih Muslim, and
other major collections; detailed study of Isnad and Matn; advanced authentication methods (Ilm al-Rijal, Ilm al-Jarh wa alTa'dil); application of Hadith in Fiqh, Tafseer, and contemporary Islamic issues; and Sharah (explanation) of complex Hadiths
and scholarly interpretations.
Learning Outcomes: Master major Hadith collections and their explanations · Authenticate and critically analyze Hadith
using classical methods · Apply Hadith knowledge to Fiqh, Tafseer, and modern issues · Prepare for teaching, research, or
scholarly work in Hadith sciences
 Course 24 — Takhassus fil Hadith (Specialization in Hadith Sciences)
Level Advanced / Specialization
Category Hadith
Duration 2 Years
Schedule 3–5 days/week · 90 min per session
Fee $50–$70/month (~PKR 15,000–22,000)
Main Books Sahih al-Bukhari, Sahih Muslim, Sunan Abu Dawood, Tirmidhi, Nasa’i, Ibn Majah, Musnad
Collections, Classical Commentaries
Prerequisites Basic → Intermediate → Advanced Hadith completion (all three levels)
Certificate Advanced Specialization Certificate in Hadith Sciences
Description: The highest level of Hadith education — an advanced specialization for students who have completed all three
Hadith levels and want to master Hadith sciences. Focuses on in-depth study of all six major Hadith collections, advanced
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 19 of 26 • www.alnooracademy.com
Sharah of complex Hadiths, detailed Isnad and Matn analysis, advanced authentication methodologies, resolving
contradictions and understanding narration variations, application to Fiqh and Tafseer, and guidance on teaching, scholarly
writing, and issuing fatawa.
Learning Outcomes: Master classical Hadith texts and commentaries · Analyze chains of narrators and authenticate
narrations accurately · Interpret complex Hadiths and resolve scholarly differences · Conduct research, write scholarly
articles, and teach Hadith at an advanced level
 6.6 Complete Course Catalog Summary Table
# Course Name Category Level Duration Monthly Fee (USD)
1 Noorani Qaida Quran Beginner 2–3 mo $20–$30
2 Nazra Quran Quran Beginner 3–4 mo $25–$35
3 Quran with Tajweed Quran Intermediate 4–6 mo $30–$40
4 Advanced Tajweed Program Quran Advanced 1 Year $35–$50
5 Hifz-ul-Quran Quran Specialized 2.5–3
Years $40–$60
6 Tarjamat-ul-Quran Quran Intermediate 1 Year $30–$45
7 Advanced Tafseer-ul-Quran Quran Advanced 2 Years $40–$60
8 Beginner Arabic Arabic Language Beginner 3 mo $20–$30
9 Intermediate Arabic Arabic Language Intermediate 6 mo $25–$40
10 Advanced Spoken Arabic Arabic Language Advanced 1 Year $35–$50
11 Advanced Ilm-e-Balaghat Arabic Language Advanced 1 Year $40–$60
12 Basic Fiqh (Qudoori) Fiqh Beginner 2–3 mo $20–$30
13 Intermediate Fiqh (Kanz) Fiqh Intermediate 6 mo $25–$35
14 Advanced Fiqh (Hidaya) Fiqh Advanced 1 Year $35–$50
15 Basic Usool Fiqh (Shashi) Fiqh Beginner 3 mo $20–$30
16 Intermediate Usool Fiqh Fiqh Intermediate 6 mo $25–$35
17 Advanced Usool Fiqh Fiqh Advanced 1 Year $35–$50
18 Basic Sarf & Nahw Sarf & Nahw Beginner 6 mo $20–$30
19 Intermediate Sarf & Nahw Sarf & Nahw Intermediate 10 mo $25–$35
20 Advanced Sarf & Nahw Sarf & Nahw Advanced 8 mo $35–$50
21 Basic Hadith Hadith Beginner 4 mo $20–$30
22 Intermediate Hadith Hadith Intermediate 6 mo $25–$35
23 Advanced Hadith Hadith Advanced 2 Years $35–$50
24 Takhassus fil Hadith Hadith Specialization 2 Years $50–$70
 7. Non-Functional Requirements
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 20 of 26 • www.alnooracademy.com
Category Requirement Target / Standard
Performance Page load time on standard broadband ≤ 2 seconds
Responsiveness Mobile-first layout breakpoints 320px, 480px, 768px, 1024px, 1440px+
Security Authentication method Supabase JWT + Row-Level Security (RLS)
Security Data transmission HTTPS enforced site-wide; HSTS header
Security Payment data Encrypted; no raw card data; Stripe PCIcompliant
Scalability Concurrent users 10,000+ without architecture redesign
Availability Uptime target 99.9% with CDN-enabled cloud hosting
Accessibility Compliance standard WCAG 2.1 AA — ARIA roles + keyboard
navigation
SEO Technical requirements Structured data, sitemap, canonical, Core Web
Vitals
Internationalization Language support English (LTR) · Arabic (RTL) · Urdu (RTL)
Arabic/Urdu Font Full CSS font-family stack Amiri, 'Noto Naskh Arabic', 'Scheherazade New',
'Traditional Arabic', Arial, sans-serif !important
RTL Support Layout direction dir="rtl" on <html>; all text, forms, tables flip
 8. Technology Stack
Layer Technology Purpose
Frontend React + HTML5 Dynamic UI, routing, component architecture
Styling Tailwind CSS Responsive, utility-first Islamic-themed design
Arabic Font #1 Amiri (Google Fonts) Primary Arabic/Urdu font — classical Naskh beauty
Arabic Font #2 Noto Naskh Arabic Full Unicode Arabic coverage fallback
Arabic Font #3 Scheherazade New (SIL) Extended Arabic scripts fallback
Arabic Font #4 Traditional Arabic Windows built-in system fallback
English Font #1 Cormorant Garamond English hero headings — elegant classical serif
English Font #2 Cinzel Splash screen title, brand name
Backend / API Node.js + Express Server-side logic and REST API handling
BaaS Supabase Auth, real-time DB, file storage, RLS policies
Database PostgreSQL (via Supabase) Structured data: students, courses, payments
Animation CSS3 / Framer Motion Splash screen, transitions, scroll animations
PDF Generation jsPDF / html2pdf Certificate PDF download generation
Deployment Vercel / AWS CloudFront CDN-enabled, auto-scaling infrastructure
Version Control Git + GitHub Source code management and CI/CD pipelines
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 21 of 26 • www.alnooracademy.com
 9. UI / UX Design Specifications
 9.1 Advanced Splash Screen
▸ Full-screen radial gradient background: deep green (#0D4D2F) to near-black (#071410)
▸ Rotating Islamic geometric hexagonal SVG pattern overlay (30s CSS animation loop)
▸ Four concentric gold rings pulsing outward with staggered animation delays
▸ Central round logo: Al-NOOR Arabic calligraphy in Amiri font, 140×140px, border-radius: 50%
▸ Logo: border: 3px solid #C9A84C; box-shadow: 0 0 60px rgba(201,168,76,.4), 0 0 120px rgba(26,122,74,.3), inset 0
0 30px rgba(201,168,76,.1)
▸ Academy name in Amiri Arabic font fading up (0.8s ease)
▸ English tagline in Cinzel font with letter-spacing animation
▸ Gold loading dots animated beneath with staggered 1.7s delay
▸ Auto-transition to homepage after 3.5 seconds with smooth fade-out
 9.2 Theme System
Theme Primary Background Accent Use Case
Green Islamic (Default) #1A7A4A Soft green #D6EEE1 #C9A84C Gold Standard Islamic
identity
Light Mode #1A7A4A White / #F5FDF8 #C9A84C Gold Daytime comfortable
reading
Dark Mode #27A862 Charcoal #071410 #C9A84C Gold Low-light / night
sessions
 9.3 Multi-Language System
▸ Language switcher in navbar: EN | AR | UR with respective flag icons
▸ Dynamic re-render of all UI content on language change (React state-based i18n)
▸ Arabic and Urdu: dir="rtl" applied to <html> element automatically
▸ Font: font-family: Amiri, 'Noto Naskh Arabic', 'Scheherazade New', 'Traditional Arabic', Arial, sans-serif !important;
▸ Navigation links order reverses in RTL; icons flip appropriately
▸ All form fields, tables, and text elements support RTL alignment
▸ Language preference saved to localStorage and Supabase user profile
 10. Database Schema — Core Tables
All data is stored in PostgreSQL via Supabase with Row-Level Security (RLS) policies enforced on every table. JWT
authentication ensures users can only access authorized data.
 10.1 Students
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 22 of 26 • www.alnooracademy.com
Column Type Description
id UUID (PK) Unique identifier — auto-generated
full_name VARCHAR(255) Student's full legal name
email VARCHAR(255) Unique email — used for login
phone VARCHAR(20) Contact phone with country code
language ENUM(en,ar,ur) Preferred UI language
enrolled_courses UUID[] Array of enrolled course IDs
status ENUM(active,inactive,suspended) Account status
created_at TIMESTAMP Account creation datetime
 10.2 Teachers
Column Type Description
id UUID (PK) Unique identifier
full_name VARCHAR(255) Teacher's full name
email VARCHAR(255) Login email address
specialization VARCHAR(255) e.g., Tajweed, Hifz, Hadith, Fiqh
assigned_courses UUID[] Array of assigned course IDs
status ENUM(active,inactive) Account status
 10.3 Courses
Column Type Description
id UUID (PK) Unique course identifier
title VARCHAR(255) Course full name
level VARCHAR(50) Beginner / Intermediate / Advanced / Specialized
category VARCHAR(100) Quran / Arabic / Fiqh / Sarf & Nahw / Hadith
description TEXT Full course description
fee_min DECIMAL(10,2) Minimum monthly fee in USD
fee_max DECIMAL(10,2) Maximum monthly fee in USD
duration VARCHAR(100) e.g., 3 Months, 1 Year, 2 Years
schedule VARCHAR(255) Days per week and session duration
prerequisites TEXT Required prior courses or knowledge
core_books TEXT Core textbooks for the course
next_course VARCHAR(255) Recommended progression course
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 23 of 26 • www.alnooracademy.com
Column Type Description
status ENUM(draft,published,archived) Course visibility
teacher_id UUID (FK) Reference to teachers.id
image_url TEXT Supabase Storage URL for course image
 10.4 Admissions
Column Type Description
id UUID (PK) Unique admission record
student_id UUID (FK) Reference to students.id
course_id UUID (FK) Reference to courses.id
status ENUM(pending,approved,rejected) Application status
applied_at TIMESTAMP Application submission datetime
reviewed_by UUID (FK) Admin who reviewed the application
notes TEXT Admin notes on the application
 10.5 Payments
Column Type Description
id UUID (PK) Unique payment record
student_id UUID (FK) Reference to students.id
amount DECIMAL(10,2) Payment amount in USD
method VARCHAR(50) e.g., Stripe, PayPal, Bank Transfer
status ENUM(paid,pending,failed,overdue) Payment status
transaction_id VARCHAR(255) External payment gateway reference
paid_at TIMESTAMP Payment completion datetime
 10.6 Attendance
Column Type Description
id UUID (PK) Unique attendance record
teacher_id UUID (FK) Teacher who marked attendance
student_id UUID (FK) Attending student
course_id UUID (FK) Related course
date DATE Session date
status ENUM(present,absent,late) Attendance outcome
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 24 of 26 • www.alnooracademy.com
Column Type Description
notes TEXT Optional session notes
 10.7 Certificates
Column Type Description
id UUID (PK) Unique certificate record
student_id UUID (FK) Reference to students.id
course_id UUID (FK) Completed course reference
issued_at TIMESTAMP Certificate issue datetime
download_url TEXT Supabase Storage URL for PDF certificate
 11. Project Milestones & Timeline
# Milestone Key Deliverables Timeline Status
1 Project Setup & Design Figma wireframes, color system, Islamic
component library Week 1–2 🟢 In Progress
2 Public Panel Homepage, Courses, Admission, About —
fully responsive Week 3–5 🟢 Planned
3 Auth & Database Supabase auth, all 7 SQL tables, RLS
policies, storage Week 4–5 🟢 Planned
4 Admin Panel Dashboard + all 5 admin management
modules Week 6–8 🟢 Planned
5
Student & Teacher
Panels
Both panels fully functional with real-time
data Week 9–11 🟢 Planned
6
Multi-language &
Themes
AR/UR/EN switcher, 3 themes, full RTL +
Amiri font stack Week 12 🟢 Planned
7 Testing & QA Cross-browser, mobile, security
penetration testing Week 13–14 🟢 Planned
8 SEO & Launch SEO audit, Core Web Vitals, schema
markup, production deploy Week 15 🟢 Planned
 12. Risks & Mitigations
Risk Probability Impact Mitigation Strategy
RTL layout issues (Arabic/Urdu) Medium High Tailwind RTL plugin + Amiri/Noto Naskh font stack; crossbrowser testing on real devices
Supabase downtime / API limits Low High Redis caching layer; Supabase status alerts; fallback API
responses
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 25 of 26 • www.alnooracademy.com
Risk Probability Impact Mitigation Strategy
Video background perf on
mobile High Medium Compressed WebM/MP4; poster image fallback; lazy-load
attribute
Payment data security Low Critical Supabase RLS + encrypted storage; Stripe PCI-compliant;
no raw card data stored
Scope creep Medium Medium Strict milestone gating; formal change request process
with sign-off
Scholar/teacher availability Medium High Pre-vetted scholar pool; backup teacher assignment
system in admin panel
Amiri/Noto Naskh font loading Medium Low Google Fonts CDN preload; font-display: swap; Traditional
Arabic system fallback
24-course management
complexity Medium Medium Structured course builder in admin; progression path
validation; bulk import tool
 13. Appendices
 13.1 Complete Arabic/Urdu Font CSS Declaration
/* ===== COMPLETE ARABIC & URDU FONT STACK ===== */ [lang="ar"], [lang="ur"], [dir="rtl"], .arabic-text, .urdu-text, .quran-text {
font-family: Amiri, "Noto Naskh Arabic", "Scheherazade New", "Traditional Arabic", Arial, sans-serif !important; direction:
rtl; text-align: right; line-height: 2.2; letter-spacing: 0.01em; font-size: 1.1rem; } /* Google Fonts Import */ @import
url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Naskh+Arabic:wght@400;50
0;600;700&family=Scheherazade+New:wght@400;500;600;700&display=swap');
 13.2 Supabase RLS Policies
students: USING (auth.uid() = id) -- students see only their own record attendance: USING (teacher_id = auth.uid() OR
student_id = auth.uid()) payments: USING (student_id = auth.uid()) -- own payments only courses: FOR SELECT
USING (status = 'published') -- public read admissions: Admin bypasses RLS via service_role key (server-side only)
certificates: USING (student_id = auth.uid()) -- own certificates only
 13.3 Color Palette Reference
Token Hex Value Usage
--primary #1A7A4A Primary green — buttons, headings, active borders
--primary-dark #0D4D2F Dark green — navbar, splash background, section headers
--primary-light #27A862 Light green — hover states, icons, badges
--gold #C9A84C Gold accent — CTA buttons, highlights, logo border, ornaments
--gold-light #FDF6E3 Gold tint — info box backgrounds
--bg-green #D6EEE1 Background tint — card and section fills
--bg-dark #071410 Dark mode background
☪ Al-NOOR Online Quran & Hadees Academy — Product Requirements Document ☪
© 2025 Al-NOOR Online Quran & Hadees Academy • CONFIDENTIAL • Page 26 of 26 • www.alnooracademy.com
Token Hex Value Usage
--text-dark #0D1F15 Primary body text
--text-muted #4A6B58 Secondary / caption text
--gray-light #F4F8F5 Alternating table row fill
--border #D0DDD6 Standard border color
 13.4 Discipline Progression Summary
Discipline Progression Path Courses
Quran Noorani Qaida → Nazra → Tajweed → Adv. Tajweed → Hifz → Tarjama →
Tafseer 7
Arabic Language Beginner → Intermediate → Advanced Spoken → Balaghat 4
Fiqh Basic (Qudoori) → Int. (Kanz) → Adv. (Hidaya) | Basic (Shashi) → Int. → Adv.
Usool 6
Sarf & Nahw Irshad-us-Sarf/Nahw-e-Meer → Ilm-us-Sigha/Al-Kafia → Sharah al-Jami 3
Hadith Riyadh-us-Saliheen → Mishkat → Bukhari/Muslim → Takhassus fil Hadith 4
☪ Al-NOOR Online Quran & Hadees Academy ☪
Product Requirements Document • Version 2.0 • Complete Edition • CONFIDENTIAL
© 2025 Al-NOOR Online Quran & Hadees Academy • All Rights Reserved
◆ ◆ ◆