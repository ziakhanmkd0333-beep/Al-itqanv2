import { Course } from "@/types";

export const courses: Course[] = [
  // Quran Courses (7)
  {
    id: "1",
    code: "QRN-101",
    title: "Noorani Qaida Course",
    slug: "noorani-qaida",
    level: "Beginner",
    category: "Quran",
    duration: "2–3 Months",
    schedule: "3–5 days/week · 30 min (children) / 45 min (adults)",
    feeMin: 20,
    feeMax: 30,
    feeCurrency: "USD",
    prerequisites: "None",
    nextCourse: "Nazra Quran / Quran with Tajweed",
    description: "A beginner-level course designed for students who want to start learning how to read the Holy Quran correctly. Focuses on basic Arabic alphabet, correct pronunciation (Makharij), joining letters, and simple reading rules. Suitable for children, beginners, and new learners with no prior Arabic knowledge.",
    learningOutcomes: [
      "Identify all Arabic letters",
      "Read joined letters and words",
      "Apply basic pronunciation rules",
      "Prepare for Quran Reading with Tajweed"
    ],
    coreBooks: ["Noorani Qaida"],
    image: "/images/noorani_qaida_1769312153641.png",
    status: "published",
    order: 1
  },
  {
    id: "2",
    code: "QRN-102",
    title: "Nazra Quran (Quran Reading Course)",
    slug: "nazra-quran",
    level: "Beginner",
    category: "Quran",
    duration: "3–4 Months",
    schedule: "3–5 days/week · 30 min (children) / 45 min (adults)",
    feeMin: 25,
    feeMax: 35,
    feeCurrency: "USD",
    prerequisites: "Noorani Qaida or basic Arabic letters knowledge",
    nextCourse: "Quran with Tajweed",
    description: "Designed for students who know basic Arabic letters and want to read the Holy Quran fluently and correctly. Focuses on reading speed, accuracy, and confidence while applying basic Tajweed rules.",
    learningOutcomes: [
      "Read the Holy Quran confidently",
      "Recognize common Tajweed rules",
      "Prepare for advanced Tajweed learning"
    ],
    coreBooks: ["Quran Kareem"],
    image: "/images/Nazra-Quran-Kareem.jpg",
    status: "published",
    order: 2
  },
  {
    id: "3",
    code: "QRN-201",
    title: "Quran with Tajweed Course",
    slug: "quran-with-tajweed",
    level: "Intermediate",
    category: "Quran",
    duration: "4–6 Months",
    schedule: "3–5 days/week · 30 min (children) / 45 min (adults)",
    feeMin: 30,
    feeMax: 40,
    feeCurrency: "USD",
    prerequisites: "Nazra Quran or ability to read the Quran",
    nextCourse: "Hifz-ul-Quran or Tafseer-ul-Quran",
    description: "Advanced Quran recitation course for students who can read the Quran but want to perfect recitation by mastering complete Tajweed rules — Makharij, Sifaat, Ikhfa, Idgham, Iqlab, Qalqalah, Madd rules, and Waqf/Ibtida.",
    learningOutcomes: [
      "Recite the Holy Quran clearly, confidently, and according to proper Tajweed rules"
    ],
    coreBooks: ["Tajweed Rules Reference"],
    image: "/images/tajweed ul Qur aan.jpg",
    status: "published",
    order: 3
  },
  {
    id: "4",
    code: "QRN-301",
    title: "Advanced Tajweed Program",
    slug: "advanced-tajweed",
    level: "Advanced",
    category: "Quran",
    duration: "1 Year",
    schedule: "3–5 days/week · 30–45 min per session",
    feeMin: 35,
    feeMax: 50,
    feeCurrency: "USD",
    prerequisites: "Quran with Tajweed Course",
    nextCourse: "Hifz-ul-Quran or Tafseer",
    description: "Complete one-year advanced Tajweed training program covering both theoretical and practical Tajweed. Topics include Makharij, Sifaat, Noon Saakinah/Meem Saakinah rules, Ikhfa, Idgham, Iqlab, Qalqalah, Madd rules, Waqf/Ibtida, and advanced recitation techniques.",
    learningOutcomes: [
      "Develop strong theoretical Tajweed knowledge",
      "Recite the Holy Quran fluently and accurately according to authentic Tajweed rules",
      "Prepare for high-level Quran recitation and further Islamic studies"
    ],
    coreBooks: ["Jamal ul-Quran", "Khulasat ut-Tajweed", "Fawaid Makkiyah", "Al-Jazariyyah"],
    image: "/images/tajweed ul Qur aan.jpg",
    status: "published",
    order: 4
  },
  {
    id: "5",
    code: "QRN-401",
    title: "Hifz-ul-Quran (Quran Memorization Program)",
    slug: "hifz-ul-quran",
    level: "Specialized",
    category: "Quran",
    duration: "2.5–3 Years (Complete Hifz) / 6 Months–1 Year (Partial)",
    schedule: "5 days/week · 45–60 min per session",
    feeMin: 40,
    feeMax: 60,
    feeCurrency: "USD",
    prerequisites: "Ability to read Quran correctly with Tajweed",
    nextCourse: "Tarjamat-ul-Quran",
    description: "Specialized memorization course for students wishing to memorize the Holy Quran completely or partially under qualified Huffaz supervision. Focuses on systematic memorization, daily revision (Muraja'ah), and correct recitation with Tajweed.",
    learningOutcomes: [
      "Complete or partial Quran memorization with Tajweed",
      "Lifelong retention through structured revision methodology"
    ],
    coreBooks: ["Quran Kareem (Hifz Methodology)"],
    image: "/images/hifz_quran_image_1769312185137.png",
    status: "published",
    order: 5
  },
  {
    id: "6",
    code: "QRN-202",
    title: "Tarjamat-ul-Quran Course",
    slug: "tarjumat-ul-quran",
    level: "Intermediate",
    category: "Quran",
    duration: "1 Year",
    schedule: "3–5 days/week · 45–60 min per session",
    feeMin: 30,
    feeMax: 45,
    feeCurrency: "USD",
    prerequisites: "Basic Quran reading or Tajweed completion",
    nextCourse: "Advanced Tafseer-ul-Quran",
    description: "Comprehensive program for students wanting to understand the meanings and translation of the Holy Quran. Focuses on Quranic verse interpretation, translation (Tafsir in simple language), key themes, moral guidance, rules, and lessons.",
    learningOutcomes: [
      "Read Quranic verses and understand their translation accurately",
      "Explain lessons and guidance contained in the Quran",
      "Prepare for advanced Islamic studies"
    ],
    coreBooks: ["Quran Translation & Tafsir"],
    image: "/images/quran_study_scene_1769312205837.png",
    status: "published",
    order: 6
  },
  {
    id: "7",
    code: "QRN-302",
    title: "Advanced Tafseer-ul-Quran Course",
    slug: "advanced-tafseer",
    level: "Advanced",
    category: "Quran",
    duration: "2 Years",
    schedule: "3–5 days/week · 45–60 min per session",
    feeMin: 40,
    feeMax: 60,
    feeCurrency: "USD",
    prerequisites: "Tarjamat-ul-Quran or equivalent",
    nextCourse: "Advanced Islamic Studies",
    description: "Specialized two-year program for deep understanding of the Holy Quran — meanings, context, and rulings. Goes beyond basic translation to comprehensive analysis including linguistic, grammatical, jurisprudential, and historical contexts.",
    learningOutcomes: [
      "Understand the Quran in depth",
      "Explain complex verses",
      "Derive rulings",
      "Teach Tafseer to others",
      "Prepare for higher Islamic scholarship"
    ],
    coreBooks: ["Tafseer Ibn Kathir", "Tafseer Al-Jalalayn", "Tafseer Al-Tabari"],
    image: "/images/Tafaseer.jpeg",
    status: "published",
    order: 7
  },

  // Arabic Language Courses (4)
  {
    id: "8",
    code: "ARB-101",
    title: "Beginner Arabic Course",
    slug: "beginner-arabic",
    level: "Beginner",
    category: "Arabic Language",
    duration: "3 Months",
    schedule: "3–5 days/week · 30–45 min per session",
    feeMin: 20,
    feeMax: 30,
    feeCurrency: "USD",
    prerequisites: "None",
    nextCourse: "Intermediate Arabic",
    description: "Designed for students with no prior Arabic knowledge. Builds a strong foundation in Arabic reading, writing, and comprehension covering the Arabic alphabet, pronunciation (Makharij), basic vocabulary, simple sentence structure, and Quranic word recognition.",
    learningOutcomes: [
      "Read Arabic words",
      "Understand simple phrases",
      "Write basic sentences",
      "Recognize Quranic words for further studies"
    ],
    coreBooks: ["Al-Arabiyyah Bayna Yadayk", "Arabic for Beginners"],
    image: "/images/Arabic language.jpeg",
    status: "published",
    order: 8
  },
  {
    id: "9",
    code: "ARB-201",
    title: "Intermediate Arabic Course",
    slug: "intermediate-arabic",
    level: "Intermediate",
    category: "Arabic Language",
    duration: "6 Months",
    schedule: "3–5 days/week · 45–60 min per session",
    feeMin: 25,
    feeMax: 40,
    feeCurrency: "USD",
    prerequisites: "Beginner Arabic Course or basic Arabic knowledge",
    nextCourse: "Advanced Spoken Arabic",
    description: "Builds on beginner foundations with intermediate grammar (nouns, verbs, tenses, gender, sentence structure), expanded vocabulary, reading short paragraphs, writing simple sentences, and basic conversational skills.",
    learningOutcomes: [
      "Read and understand intermediate Arabic texts",
      "Write simple paragraphs",
      "Communicate in basic conversation",
      "Prepare for Advanced Spoken Arabic"
    ],
    coreBooks: ["Al-Kitaab fii Ta'allum al-'Arabiyya (Parts 1 & 2)", "Arabic Grammar Made Easy"],
    image: "/images/Arabic language.jpeg",
    status: "published",
    order: 9
  },
  {
    id: "10",
    code: "ARB-301",
    title: "Advanced Spoken Arabic Course",
    slug: "advanced-spoken-arabic",
    level: "Advanced",
    category: "Arabic Language",
    duration: "1 Year",
    schedule: "3–5 days/week · 45–60 min per session",
    feeMin: 35,
    feeMax: 50,
    feeCurrency: "USD",
    prerequisites: "Intermediate Arabic Course",
    nextCourse: "Advanced Ilm-e-Balaghat",
    description: "For students who have completed Intermediate level and want to achieve fluency in Arabic speaking, reading, writing, and comprehension. Covers advanced grammar, complex sentence structures, advanced vocabulary for daily and Islamic contexts.",
    learningOutcomes: [
      "Speak Arabic fluently",
      "Understand classical and Quranic Arabic",
      "Write advanced texts",
      "Engage confidently in conversation",
      "Prepare for higher Islamic studies or teaching Arabic"
    ],
    coreBooks: ["Al-Mawrid (Arabic-English Dictionary)", "Fus'ha Arabic for Advanced Learners", "Arabic Conversation Made Easy"],
    image: "/images/Arabic language.jpeg",
    status: "published",
    order: 10
  },
  {
    id: "11",
    code: "ARB-302",
    title: "Advanced Ilm-e-Balaghat Course",
    slug: "advanced-balaghat",
    level: "Advanced",
    category: "Arabic Language",
    duration: "1 Year",
    schedule: "3–5 days/week · 45–60 min per session",
    feeMin: 40,
    feeMax: 60,
    feeCurrency: "USD",
    prerequisites: "Advanced Arabic or equivalent",
    nextCourse: "Advanced Islamic Studies",
    description: "Designed for students wanting to master Arabic eloquence (Balagha), the art of rhetoric, literary analysis, and stylistic excellence. Covers Ilm al-Ma'ani (Science of Meanings), Ilm al-Bayan (Science of Clarity), and Ilm al-Badi' (Science of Literary Ornamentation).",
    learningOutcomes: [
      "Analyze Quranic verses and Hadith using Balagha principles",
      "Recognize and apply advanced rhetorical devices",
      "Compose eloquent Arabic texts",
      "Prepare for advanced Tafseer, Hadith analysis, and Arabic literature scholarship"
    ],
    coreBooks: ["Balaghat-ul-Quran", "Al-Balagha al-Wadihah", "Al-Bayan wa al-Tabyin", "Al-Badi' fi al-Adab"],
    image: "/images/Balaghat.jpg",
    status: "published",
    order: 11
  },

  // Fiqh Courses (6)
  {
    id: "12",
    code: "FQH-101",
    title: "Basic Fiqh Course",
    slug: "basic-fiqh",
    level: "Beginner",
    category: "Fiqh",
    duration: "2–3 Months",
    schedule: "3–5 days/week · 45 min per session",
    feeMin: 20,
    feeMax: 30,
    feeCurrency: "USD",
    prerequisites: "None",
    nextCourse: "Intermediate Fiqh (Kanz)",
    description: "Introduces fundamentals of Islamic jurisprudence in a simple, accessible manner. Covers acts of worship (Ibadat) — Salah, Sawm, Zakat, Hajj — and personal/social conduct (Mu'amalat) including cleanliness, eating etiquettes, and family interactions.",
    learningOutcomes: [
      "Recognize and apply basic fiqh rulings in worship and daily activities",
      "Perform Salah, fasting, Zakat, and Hajj correctly",
      "Build foundation for Intermediate Fiqh"
    ],
    coreBooks: ["Mukhtasar al-Qudoori"],
    image: "/images/Figha.jpeg",
    status: "published",
    order: 12
  },
  {
    id: "13",
    code: "FQH-201",
    title: "Intermediate Fiqh Course",
    slug: "intermediate-fiqh",
    level: "Intermediate",
    category: "Fiqh",
    duration: "6 Months",
    schedule: "3–4 days/week · 60 min per session",
    feeMin: 25,
    feeMax: 35,
    feeCurrency: "USD",
    prerequisites: "Basic Fiqh (Qudoori)",
    nextCourse: "Advanced Fiqh (Hidaya)",
    description: "Builds on basic Fiqh with more detailed rulings and practical applications. Advanced worship topics include missed/combined prayers, special fasting cases, detailed zakat calculation, and Hajj/Umrah rituals.",
    learningOutcomes: [
      "Apply fiqh rulings to complex worship and social situations",
      "Understand reasoning behind Islamic laws",
      "Prepare for Advanced Fiqh and scholarly discussions"
    ],
    coreBooks: ["Kanz ud-Daqaiq"],
    image: "/images/Figha.jpeg",
    status: "published",
    order: 13
  },
  {
    id: "14",
    code: "FQH-301",
    title: "Advanced Fiqh Course",
    slug: "advanced-fiqh",
    level: "Advanced",
    category: "Fiqh",
    duration: "12 Months",
    schedule: "3–4 days/week · 60–90 min per session",
    feeMin: 35,
    feeMax: 50,
    feeCurrency: "USD",
    prerequisites: "Intermediate Fiqh (Kanz)",
    nextCourse: "Advanced Usool Fiqh",
    description: "Designed for students seeking mastery in Islamic jurisprudence. Using the classical text Al-Hidaya, students explore in-depth rulings for all acts of worship, complex social dealings, inheritance, criminal laws, and contemporary challenges.",
    learningOutcomes: [
      "Master classical fiqh texts",
      "Apply Islamic law to contemporary scenarios",
      "Conduct scholarly research",
      "Issue informed fiqh guidance",
      "Develop expertise for teaching or issuing fatawa"
    ],
    coreBooks: ["Al-Hidaya (Imam al-Marghinani)"],
    image: "/images/Figha.jpeg",
    status: "published",
    order: 14
  },
  {
    id: "15",
    code: "FQH-102",
    title: "Basic Usool Fiqh Course",
    slug: "basic-usool-fiqh",
    level: "Beginner",
    category: "Fiqh",
    duration: "3 Months",
    schedule: "3–5 days/week · 45 min per session",
    feeMin: 20,
    feeMax: 30,
    feeCurrency: "USD",
    prerequisites: "None",
    nextCourse: "Intermediate Usool Fiqh (Noor-ul-Anwar)",
    description: "Designed for students new to the principles of Islamic jurisprudence. Using Usool Shashi, students learn foundational rules and terminology for deriving Islamic rulings from the Quran and Sunnah.",
    learningOutcomes: [
      "Understand basic principles of Islamic law and legal derivation",
      "Learn key fiqh terminology and concepts",
      "Prepare for Intermediate Usool Fiqh"
    ],
    coreBooks: ["Usool Shashi"],
    image: "/images/Usool Fiqha.jpeg",
    status: "published",
    order: 15
  },
  {
    id: "16",
    code: "FQH-202",
    title: "Intermediate Usool Fiqh Course",
    slug: "intermediate-usool-fiqh",
    level: "Intermediate",
    category: "Fiqh",
    duration: "6 Months",
    schedule: "3–4 days/week · 60 min per session",
    feeMin: 25,
    feeMax: 35,
    feeCurrency: "USD",
    prerequisites: "Basic Usool Fiqh (Shashi)",
    nextCourse: "Advanced Usool Fiqh",
    description: "Builds on Shashi foundations using Noor-ul-Anwar to guide students through intermediate principles of Islamic jurisprudence — Ijtihad, Qiyas, Ijma, definitive vs. speculative texts, and masalih al-mursalah.",
    learningOutcomes: [
      "Apply Usool Fiqh principles up to Qiyas",
      "Understand reasoning behind juristic differences",
      "Analyze real-life fiqh issues using scholarly methodology"
    ],
    coreBooks: ["Noor-ul-Anwar (up to Qiyas)"],
    image: "/images/Usool Fiqha.jpeg",
    status: "published",
    order: 16
  },
  {
    id: "17",
    code: "FQH-302",
    title: "Advanced Usool Fiqh Course",
    slug: "advanced-usool-fiqh",
    level: "Advanced",
    category: "Fiqh",
    duration: "12 Months",
    schedule: "3–4 days/week · 60–90 min per session",
    feeMin: 35,
    feeMax: 50,
    feeCurrency: "USD",
    prerequisites: "Intermediate Usool Fiqh",
    nextCourse: "Specialization in Islamic Law",
    description: "For students aiming to achieve mastery in Islamic legal theory. Studies the later sections of Noor-ul-Anwar along with Husami, Taozi, and Talwe to explore advanced principles, abrogation (Naskh), and speculative vs. definitive texts.",
    learningOutcomes: [
      "Master advanced Islamic jurisprudence principles",
      "Analyze and evaluate differing juristic opinions",
      "Conduct research in classical and contemporary fiqh",
      "Apply Usool Fiqh methodology to modern legal and ethical issues"
    ],
    coreBooks: ["Noor-ul-Anwar (Qiyas to end)", "Husami", "Taozi", "Talwe"],
    image: "/images/Usool Fiqha.jpeg",
    status: "published",
    order: 17
  },

  // Sarf & Nahw Courses (3)
  {
    id: "18",
    code: "SN-101",
    title: "Basic Sarf & Nahw Course",
    slug: "basic-sarf-nahw",
    level: "Beginner",
    category: "Sarf & Nahw",
    duration: "6 Months",
    schedule: "3–5 days/week · 45–60 min per session",
    feeMin: 20,
    feeMax: 30,
    feeCurrency: "USD",
    prerequisites: "None",
    nextCourse: "Intermediate Sarf & Nahw",
    description: "For students starting Arabic grammar and morphology from scratch. Covers Arabic letters, vowels (Harakat), simple nouns and verbs (singular, dual, plural), basic sentence structures, and practical exercises using Quranic verses.",
    learningOutcomes: [
      "Read and understand basic Arabic sentences",
      "Recognize and conjugate simple nouns and verbs",
      "Apply fundamental grammatical rules in Quranic reading",
      "Prepare for Intermediate Sarf & Nahw"
    ],
    coreBooks: ["Irshad-us-Sarf", "Nahw-e-Meer with Ijra"],
    image: "/images/Nahwa Sarsf.jpeg",
    status: "published",
    order: 18
  },
  {
    id: "19",
    code: "SN-201",
    title: "Intermediate Sarf & Nahw Course",
    slug: "intermediate-sarf-nahw",
    level: "Intermediate",
    category: "Sarf & Nahw",
    duration: "10 Months",
    schedule: "3–4 days/week · 60 min per session",
    feeMin: 25,
    feeMax: 35,
    feeCurrency: "USD",
    prerequisites: "Basic Sarf & Nahw",
    nextCourse: "Advanced Sarf & Nahw",
    description: "Provides deeper understanding of Arabic morphology and sentence structures. Covers detailed verb forms, complex noun forms and pluralization, grammatical cases, sentence analysis, and application of rules to Quranic verses.",
    learningOutcomes: [
      "Analyze and construct complex Arabic sentences",
      "Conjugate verbs and nouns accurately",
      "Apply grammar rules to Quranic and classical Arabic texts",
      "Prepare for Advanced Sarf & Nahw"
    ],
    coreBooks: ["Ilm-us-Sigha", "Al-Kafia"],
    image: "/images/Nahwa Sarsf.jpeg",
    status: "published",
    order: 19
  },
  {
    id: "20",
    code: "SN-301",
    title: "Advanced Sarf & Nahw Course",
    slug: "advanced-sarf-nahw",
    level: "Advanced",
    category: "Sarf & Nahw",
    duration: "8 Months",
    schedule: "3–4 days/week · 60–90 min per session",
    feeMin: 35,
    feeMax: 50,
    feeCurrency: "USD",
    prerequisites: "Intermediate Sarf & Nahw",
    nextCourse: "Advanced Islamic Studies",
    description: "For students aiming for mastery in Arabic grammar and morphology. Using Sharah al-Jami, covers advanced verb forms and derivatives, irregular verbs, complex sentence structures, advanced noun forms and exceptions, and syntax analysis.",
    learningOutcomes: [
      "Master complex Arabic grammar and sentence structures",
      "Analyze classical and Quranic texts accurately",
      "Prepare for advanced Islamic studies in Tafseer, Hadith, and Fiqh"
    ],
    coreBooks: ["Sharah al-Jami"],
    image: "/images/Nahwa Sarsf.jpeg",
    status: "published",
    order: 20
  },

  // Hadith Courses (4)
  {
    id: "21",
    code: "HDT-101",
    title: "Basic Hadith Course",
    slug: "basic-hadith",
    level: "Beginner",
    category: "Hadith",
    duration: "4 Months",
    schedule: "3–5 days/week · 45 min per session",
    feeMin: 20,
    feeMax: 30,
    feeCurrency: "USD",
    prerequisites: "None",
    nextCourse: "Intermediate Hadith",
    description: "Introduces students to the sayings, actions, and approvals of Prophet Muhammad (PBUH). Covers fundamentals of Hadith sciences, basic classification of Hadith, selected Hadiths on daily life, morals, and worship.",
    learningOutcomes: [
      "Understand basic Hadith classifications and importance",
      "Memorize and explain selected Hadiths",
      "Apply basic Hadith teachings to daily life",
      "Prepare for Intermediate Hadith studies"
    ],
    coreBooks: ["Riyadh-us-Saliheen (selected sections)"],
    image: "/images/Hadees.jpeg",
    status: "published",
    order: 21
  },
  {
    id: "22",
    code: "HDT-201",
    title: "Intermediate Hadith Course",
    slug: "intermediate-hadith",
    level: "Intermediate",
    category: "Hadith",
    duration: "6 Months",
    schedule: "3–4 days/week · 60 min per session",
    feeMin: 25,
    feeMax: 35,
    feeCurrency: "USD",
    prerequisites: "Basic Hadith Course",
    nextCourse: "Advanced Hadith",
    description: "Provides deeper understanding of Hadith with contextual analysis. Covers detailed Hadith collections, the chain of narrators (Isnad) and Hadith terminology, practical application in daily life, and comparison and analysis of Hadiths.",
    learningOutcomes: [
      "Analyze Hadith texts with context and reasoning",
      "Identify authentic Hadiths",
      "Apply Hadith teachings to contemporary situations",
      "Prepare for Advanced Hadith studies"
    ],
    coreBooks: ["Mishkat al-Masabih"],
    image: "/images/Hadees.jpeg",
    status: "published",
    order: 22
  },
  {
    id: "23",
    code: "HDT-301",
    title: "Advanced Hadith Course",
    slug: "advanced-hadith",
    level: "Advanced",
    category: "Hadith",
    duration: "2 Years",
    schedule: "3–4 days/week · 60–90 min per session",
    feeMin: 35,
    feeMax: 50,
    feeCurrency: "USD",
    prerequisites: "Intermediate Hadith Course",
    nextCourse: "Takhassus fil Hadith",
    description: "For students aiming for mastery in Hadith studies. In-depth analysis of Sahih al-Bukhari, Sahih Muslim, and other major collections; detailed study of Isnad and Matn; advanced authentication methods.",
    learningOutcomes: [
      "Master major Hadith collections and their explanations",
      "Authenticate and critically analyze Hadith using classical methods",
      "Apply Hadith knowledge to Fiqh, Tafseer, and modern issues",
      "Prepare for teaching, research, or scholarly work in Hadith sciences"
    ],
    coreBooks: ["Sahih al-Bukhari", "Sahih Muslim", "Sharah of Major Hadith Collections"],
    image: "/images/Hadees.jpeg",
    status: "published",
    order: 23
  },
  {
    id: "24",
    code: "HDT-401",
    title: "Takhassus fil Hadith (Specialization in Hadith Sciences)",
    slug: "takhassus-fil-hadith",
    level: "Advanced",
    category: "Hadith",
    duration: "2 Years",
    schedule: "3–5 days/week · 90 min per session",
    feeMin: 50,
    feeMax: 70,
    feeCurrency: "USD",
    prerequisites: "Basic → Intermediate → Advanced Hadith completion (all three levels)",
    nextCourse: "None - Highest Level",
    description: "The highest level of Hadith education — an advanced specialization for students who have completed all three Hadith levels and want to master Hadith sciences. Focuses on in-depth study of all six major Hadith collections.",
    learningOutcomes: [
      "Master classical Hadith texts and commentaries",
      "Analyze chains of narrators and authenticate narrations accurately",
      "Interpret complex Hadiths and resolve scholarly differences",
      "Conduct research, write scholarly articles, and teach Hadith at an advanced level"
    ],
    coreBooks: ["Sahih al-Bukhari", "Sahih Muslim", "Sunan Abu Dawood", "Tirmidhi", "Nasa'i", "Ibn Majah", "Musnad Collections"],
    image: "/images/Hadees.jpeg",
    status: "published",
    order: 24
  }
];

export const getCourseBySlug = (slug: string): Course | undefined => {
  return courses.find(course => course.slug === slug);
};

export const getCoursesByCategory = (category: Course["category"]): Course[] => {
  return courses.filter(course => course.category === category);
};

export const getCoursesByLevel = (level: Course["level"]): Course[] => {
  return courses.filter(course => course.level === level);
};

export const getFeaturedCourses = (): Course[] => {
  return courses.filter(course => ["1", "3", "5", "8", "12", "14", "18", "21"].includes(course.id));
};

export const categories = [
  { id: "quran", name: "Quran", count: 7, color: "#1A7A4A" },
  { id: "arabic", name: "Arabic Language", count: 4, color: "#27A862" },
  { id: "fiqh", name: "Fiqh", count: 6, color: "#C9A84C" },
  { id: "sarf-nahw", name: "Sarf & Nahw", count: 3, color: "#4A6B58" },
  { id: "hadith", name: "Hadith", count: 4, color: "#0D4D2F" }
] as const;
