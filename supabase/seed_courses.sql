-- Al-NOOR Academy - Complete 24 Courses Seed Data
-- Run this in Supabase SQL Editor to populate all courses
-- Based on PRD v2.0 specifications

-- Clear existing courses (optional - use with caution)
-- DELETE FROM courses WHERE id IS NOT NULL;

-- Insert all 24 courses as per PRD
INSERT INTO courses (title, slug, level, category, description, duration, schedule, fee_min, fee_max, prerequisites, next_course, learning_outcomes, core_books, image_url, status, "order") VALUES

-- Quran Courses (7)
('Noorani Qaida Course', 'noorani-qaida', 'Beginner', 'Quran', 
 'A beginner-level course designed for students who want to start learning how to read the Holy Quran correctly. Focuses on basic Arabic alphabet, correct pronunciation (Makharij), joining letters, and simple reading rules. Suitable for children, beginners, and new learners with no prior Arabic knowledge. Students learn to recognize Arabic letters, pronounce from correct articulation points, combine letters into words, and read short Quranic phrases accurately.',
 '2–3 Months', '3–5 days/week · 30 min (children) / 45 min (adults)', 20, 30, 'None', 'Nazra Quran / Quran with Tajweed',
 ARRAY['Identify all Arabic letters', 'Read joined letters and words', 'Apply basic pronunciation rules', 'Prepare for Quran Reading with Tajweed'],
 ARRAY['Noorani Qaida'],
 '/images/noorani_qaida_1769312153641.png', 'published', 1),

('Nazra Quran (Quran Reading Course)', 'nazra-quran', 'Beginner', 'Quran',
 'Designed for students who know basic Arabic letters and want to read the Holy Quran fluently and correctly. Focuses on reading speed, accuracy, and confidence while applying basic Tajweed rules. Regular recitation practice, listening exercises, and correction sessions develop proper Quran reading skills.',
 '3–4 Months', '3–5 days/week · 30 min (children) / 45 min (adults)', 25, 35, 'Noorani Qaida or basic Arabic letters knowledge', 'Quran with Tajweed',
 ARRAY['Read the Holy Quran confidently', 'Recognize common Tajweed rules', 'Prepare for advanced Tajweed learning'],
 ARRAY['Quran Kareem'],
 '/images/Nazra-Quran-Kareem.jpg', 'published', 2),

('Quran with Tajweed Course', 'quran-with-tajweed', 'Intermediate', 'Quran',
 'Advanced Quran recitation course for students who can read the Quran but want to perfect recitation by mastering complete Tajweed rules — Makharij, Sifaat, Ikhfa, Idgham, Iqlab, Qalqalah, Madd rules, and Waqf/Ibtida. Teachers guide step-by-step through Quranic verse recitation with live correction.',
 '4–6 Months', '3–5 days/week · 30 min (children) / 45 min (adults)', 30, 40, 'Nazra Quran or ability to read the Quran', 'Hifz-ul-Quran or Tafseer-ul-Quran',
 ARRAY['Recite the Holy Quran clearly, confidently, and according to proper Tajweed rules'],
 ARRAY['Tajweed Rules Reference'],
 '/images/tajweed ul Qur aan.jpg', 'published', 3),

('Advanced Tajweed Program', 'advanced-tajweed', 'Advanced', 'Quran',
 'Complete one-year advanced Tajweed training program covering both theoretical and practical Tajweed. Topics include Makharij, Sifaat, Noon Saakinah/Meem Saakinah rules, Ikhfa, Idgham, Iqlab, Qalqalah, Madd rules, Waqf/Ibtida, and advanced recitation techniques. Students study from classical and recognized Tajweed books under qualified teacher supervision.',
 '1 Year', '3–5 days/week · 30–45 min per session', 35, 50, 'Quran with Tajweed Course', 'Hifz-ul-Quran or Tafseer',
 ARRAY['Develop strong theoretical Tajweed knowledge', 'Recite the Holy Quran fluently and accurately according to authentic Tajweed rules', 'Prepare for high-level Quran recitation and further Islamic studies'],
 ARRAY['Jamal ul-Quran', 'Khulasat ut-Tajweed', 'Fawaid Makkiyah', 'Al-Jazariyyah'],
 '/images/tajweed ul Qur aan.jpg', 'published', 4),

('Hifz-ul-Quran (Quran Memorization Program)', 'hifz-ul-quran', 'Specialized', 'Quran',
 'Specialized memorization course for students wishing to memorize the Holy Quran completely or partially under qualified Huffaz supervision. Focuses on systematic memorization, daily revision (Muraja''ah), and correct recitation with Tajweed. Students follow a structured daily routine of new lesson (Sabaq), recent revision (Sabaqi), and old revision (Manzil) to strengthen memorization and maintain accuracy.',
 '2.5–3 Years (Complete Hifz) / 6 Months–1 Year (Partial)', '5 days/week · 45–60 min per session', 40, 60, 'Ability to read Quran correctly with Tajweed', 'Tarjamat-ul-Quran',
 ARRAY['Complete or partial Quran memorization with Tajweed', 'Lifelong retention through structured revision methodology'],
 ARRAY['Quran Kareem (Hifz Methodology)'],
 '/images/hifz_quran_image_1769312185137.png', 'published', 5),

('Tarjamat-ul-Quran Course', 'tarjumat-ul-quran', 'Intermediate', 'Quran',
 'Comprehensive program for students wanting to understand the meanings and translation of the Holy Quran. Focuses on Quranic verse interpretation, translation (Tafsir in simple language), key themes, moral guidance, rules, and lessons. Connects the Arabic text with meaning through lectures, interactive discussions, verse-by-verse explanation, and real-life application examples.',
 '1 Year', '3–5 days/week · 45–60 min per session', 30, 45, 'Basic Quran reading or Tajweed completion', 'Advanced Tafseer-ul-Quran',
 ARRAY['Read Quranic verses and understand their translation accurately', 'Explain lessons and guidance contained in the Quran', 'Prepare for advanced Islamic studies'],
 ARRAY['Quran Translation & Tafsir'],
 '/images/quran_study_scene_1769312205837.png', 'published', 6),

('Advanced Tafseer-ul-Quran Course', 'advanced-tafseer', 'Advanced', 'Quran',
 'Specialized two-year program for deep understanding of the Holy Quran — meanings, context, and rulings. Goes beyond basic translation to comprehensive analysis including linguistic, grammatical, jurisprudential, and historical contexts. Covers Usul al-Tafseer, Ta''wil and Tafsir, Asbab al-Nuzul, Ahkam al-Quran, Naskh (abrogation), and cross-referencing with Hadith and Sunnah.',
 '2 Years', '3–5 days/week · 45–60 min per session', 40, 60, 'Tarjamat-ul-Quran or equivalent', 'Advanced Islamic Studies',
 ARRAY['Understand the Quran in depth', 'Explain complex verses', 'Derive rulings', 'Teach Tafseer to others', 'Prepare for higher Islamic scholarship'],
 ARRAY['Tafseer Ibn Kathir', 'Tafseer Al-Jalalayn', 'Tafseer Al-Tabari'],
 '/images/Tafaseer.jpeg', 'published', 7),

-- Arabic Language Courses (4)
('Beginner Arabic Course', 'beginner-arabic', 'Beginner', 'Arabic Language',
 'Designed for students with no prior Arabic knowledge. Builds a strong foundation in Arabic reading, writing, and comprehension covering the Arabic alphabet, pronunciation (Makharij), basic vocabulary, simple sentence structure, Quranic word recognition, and essential phrases for daily use. Uses interactive teaching methods including practice exercises, reading drills, and pronunciation correction.',
 '3 Months', '3–5 days/week · 30–45 min per session', 20, 30, 'None', 'Intermediate Arabic',
 ARRAY['Read Arabic words', 'Understand simple phrases', 'Write basic sentences', 'Recognize Quranic words for further studies'],
 ARRAY['Al-Arabiyyah Bayna Yadayk', 'Arabic for Beginners'],
 '/images/Arabic language.jpeg', 'published', 8),

('Intermediate Arabic Course', 'intermediate-arabic', 'Intermediate', 'Arabic Language',
 'Builds on beginner foundations with intermediate grammar (nouns, verbs, tenses, gender, sentence structure), expanded vocabulary, reading short paragraphs, writing simple sentences, and basic conversational skills. Includes reading exercises, conversation practice, writing short paragraphs, and comprehension drills. Also addresses Quranic phrase comprehension for practical Islamic learning.',
 '6 Months', '3–5 days/week · 45–60 min per session', 25, 40, 'Beginner Arabic Course or basic Arabic knowledge', 'Advanced Spoken Arabic',
 ARRAY['Read and understand intermediate Arabic texts', 'Write simple paragraphs', 'Communicate in basic conversation', 'Prepare for Advanced Spoken Arabic'],
 ARRAY['Al-Kitaab fii Ta''allum al-''Arabiyya (Parts 1 & 2)', 'Arabic Grammar Made Easy'],
 '/images/Arabic language.jpeg', 'published', 9),

('Advanced Spoken Arabic Course', 'advanced-spoken-arabic', 'Advanced', 'Arabic Language',
 'For students who have completed Intermediate level and want to achieve fluency in Arabic speaking, reading, writing, and comprehension. Covers advanced grammar, complex sentence structures, advanced vocabulary for daily and Islamic contexts, fluent conversation, Quranic and Hadith Arabic comprehension, essay writing, and listening skills.',
 '1 Year', '3–5 days/week · 45–60 min per session', 35, 50, 'Intermediate Arabic Course', 'Advanced Ilm-e-Balaghat',
 ARRAY['Speak Arabic fluently', 'Understand classical and Quranic Arabic', 'Write advanced texts', 'Engage confidently in conversation', 'Prepare for higher Islamic studies or teaching Arabic'],
 ARRAY['Al-Mawrid (Arabic-English Dictionary)', 'Fus''ha Arabic for Advanced Learners', 'Arabic Conversation Made Easy'],
 '/images/Arabic language.jpeg', 'published', 10),

('Advanced Ilm-e-Balaghat Course', 'advanced-balaghat', 'Advanced', 'Arabic Language',
 'Designed for students wanting to master Arabic eloquence (Balagha), the art of rhetoric, literary analysis, and stylistic excellence. Covers Ilm al-Ma''ani (Science of Meanings), Ilm al-Bayan (Science of Clarity — metaphors, similes, allegories, metonymy), and Ilm al-Badi'' (Science of Literary Ornamentation — figures of speech). Includes practical Quranic and Hadith analysis, classical Arabic poetry analysis, and stylistic writing exercises.',
 '1 Year', '3–5 days/week · 45–60 min per session', 40, 60, 'Advanced Arabic or equivalent', 'Advanced Islamic Studies',
 ARRAY['Analyze Quranic verses and Hadith using Balagha principles', 'Recognize and apply advanced rhetorical devices', 'Compose eloquent Arabic texts', 'Prepare for advanced Tafseer, Hadith analysis, and Arabic literature scholarship'],
 ARRAY['Balaghat-ul-Quran', 'Al-Balagha al-Wadihah', 'Al-Bayan wa al-Tabyin', 'Al-Badi'' fi al-Adab'],
 '/images/Balaghat.jpg', 'published', 11),

-- Fiqh Courses (6)
('Basic Fiqh Course', 'basic-fiqh', 'Beginner', 'Fiqh',
 'Introduces fundamentals of Islamic jurisprudence in a simple, accessible manner. Covers acts of worship (Ibadat) — Salah, Sawm, Zakat, Hajj — and personal/social conduct (Mu''amalat) including cleanliness, eating etiquettes, and family interactions. Students learn to distinguish between Wajib, Mustahab, Mubah, Makruh, and Haram. Step-by-step lessons with interactive practice and exercises.',
 '2–3 Months', '3–5 days/week · 45 min per session', 20, 30, 'None', 'Intermediate Fiqh (Kanz)',
 ARRAY['Recognize and apply basic fiqh rulings in worship and daily activities', 'Perform Salah, fasting, Zakat, and Hajj correctly', 'Build foundation for Intermediate Fiqh'],
 ARRAY['Mukhtasar al-Qudoori'],
 '/images/Figha.jpeg', 'published', 12),

('Intermediate Fiqh Course', 'intermediate-fiqh', 'Intermediate', 'Fiqh',
 'Builds on basic Fiqh with more detailed rulings and practical applications. Advanced worship topics include missed/combined prayers, special fasting cases, detailed zakat calculation, and Hajj/Umrah rituals. Social and financial matters — marriage, divorce, inheritance basics, contracts, and business transactions — are studied in greater depth. Real-life examples and teacher-led discussions strengthen understanding.',
 '6 Months', '3–4 days/week · 60 min per session', 25, 35, 'Basic Fiqh (Qudoori)', 'Advanced Fiqh (Hidaya)',
 ARRAY['Apply fiqh rulings to complex worship and social situations', 'Understand reasoning behind Islamic laws', 'Prepare for Advanced Fiqh and scholarly discussions'],
 ARRAY['Kanz ud-Daqaiq'],
 '/images/Figha.jpeg', 'published', 13),

('Advanced Fiqh Course', 'advanced-fiqh', 'Advanced', 'Fiqh',
 'Designed for students seeking mastery in Islamic jurisprudence. Using the classical text Al-Hidaya, students explore in-depth rulings for all acts of worship, complex social dealings, inheritance, criminal laws, and contemporary challenges. Emphasizes research skills, analytical thinking, and the ability to apply fiqh principles to modern situations. Prepares students for scholarly work, teaching, or advanced fiqh research, including skills to issue informed rulings (Ifta).',
 '12 Months', '3–4 days/week · 60–90 min per session', 35, 50, 'Intermediate Fiqh (Kanz)', 'Advanced Usool Fiqh',
 ARRAY['Master classical fiqh texts', 'Apply Islamic law to contemporary scenarios', 'Conduct scholarly research', 'Issue informed fiqh guidance', 'Develop expertise for teaching or issuing fatawa'],
 ARRAY['Al-Hidaya (Imam al-Marghinani)'],
 '/images/Figha.jpeg', 'published', 14),

('Basic Usool Fiqh Course', 'basic-usool-fiqh', 'Beginner', 'Fiqh',
 'Designed for students new to the principles of Islamic jurisprudence. Using Usool Shashi, students learn foundational rules and terminology for deriving Islamic rulings from the Quran and Sunnah. Topics include primary Shariah sources (Quran, Sunnah, Ijma, Qiyas), basic types of evidence, and understanding obligatory, recommended, and permissible actions. A simple and practical approach to understanding how jurists make legal decisions.',
 '3 Months', '3–5 days/week · 45 min per session', 20, 30, 'None', 'Intermediate Usool Fiqh (Noor-ul-Anwar)',
 ARRAY['Understand basic principles of Islamic law and legal derivation', 'Learn key fiqh terminology and concepts', 'Prepare for Intermediate Usool Fiqh'],
 ARRAY['Usool Shashi'],
 '/images/Usool Fiqha.jpeg', 'published', 15),

('Intermediate Usool Fiqh Course', 'intermediate-usool-fiqh', 'Intermediate', 'Fiqh',
 'Builds on Shashi foundations using Noor-ul-Anwar to guide students through intermediate principles of Islamic jurisprudence — Ijtihad, Qiyas, Ijma, definitive vs. speculative texts, and masalih al-mursalah (public interest). Emphasizes applying principles to real-life fiqh cases and preparing students for advanced classical text study.',
 '6 Months', '3–4 days/week · 60 min per session', 25, 35, 'Basic Usool Fiqh (Shashi)', 'Advanced Usool Fiqh',
 ARRAY['Apply Usool Fiqh principles up to Qiyas', 'Understand reasoning behind juristic differences', 'Analyze real-life fiqh issues using scholarly methodology'],
 ARRAY['Noor-ul-Anwar (up to Qiyas)'],
 '/images/Usool Fiqha.jpeg', 'published', 16),

('Advanced Usool Fiqh Course', 'advanced-usool-fiqh', 'Advanced', 'Fiqh',
 'For students aiming to achieve mastery in Islamic legal theory. Studies the later sections of Noor-ul-Anwar along with Husami, Taozi, and Talwe to explore advanced principles, abrogation (Naskh), speculative vs. definitive texts, contemporary legal issues, and juristic reasoning in complex scenarios. Focus on analytical thinking, case studies, research exercises, and application of fiqh principles to modern situations.',
 '12 Months', '3–4 days/week · 60–90 min per session', 35, 50, 'Intermediate Usool Fiqh', 'Specialization in Islamic Law',
 ARRAY['Master advanced Islamic jurisprudence principles', 'Analyze and evaluate differing juristic opinions', 'Conduct research in classical and contemporary fiqh', 'Apply Usool Fiqh methodology to modern legal and ethical issues'],
 ARRAY['Noor-ul-Anwar (Qiyas to end)', 'Husami', 'Taozi', 'Talwe'],
 '/images/Usool Fiqha.jpeg', 'published', 17),

-- Sarf & Nahw Courses (3)
('Basic Sarf & Nahw Course', 'basic-sarf-nahw', 'Beginner', 'Sarf & Nahw',
 'For students starting Arabic grammar and morphology from scratch. Covers Arabic letters, vowels (Harakat), simple nouns and verbs (singular, dual, plural), basic sentence structures (subject, predicate, object), and practical exercises using Quranic verses. Includes recitation practice (Ijra) to improve fluency and pronunciation. Emphasizes understanding and applying basic grammatical rules in reading and writing Arabic.',
 '6 Months', '3–5 days/week · 45–60 min per session', 20, 30, 'None', 'Intermediate Sarf & Nahw',
 ARRAY['Read and understand basic Arabic sentences', 'Recognize and conjugate simple nouns and verbs', 'Apply fundamental grammatical rules in Quranic reading', 'Prepare for Intermediate Sarf & Nahw'],
 ARRAY['Irshad-us-Sarf', 'Nahw-e-Meer with Ijra'],
 '/images/Nahwa Sarsf.jpeg', 'published', 18),

('Intermediate Sarf & Nahw Course', 'intermediate-sarf-nahw', 'Intermediate', 'Sarf & Nahw',
 'Provides deeper understanding of Arabic morphology and sentence structures. Covers detailed verb forms (past, present, imperative) and derivatives, complex noun forms and pluralization, grammatical cases (Marfu'', Mansub, Majrur), sentence analysis (prepositions, pronouns, conjunctions), and application of rules to Quranic verses and classical Arabic texts. Emphasizes reading comprehension and analytical skills.',
 '10 Months', '3–4 days/week · 60 min per session', 25, 35, 'Basic Sarf & Nahw', 'Advanced Sarf & Nahw',
 ARRAY['Analyze and construct complex Arabic sentences', 'Conjugate verbs and nouns accurately', 'Apply grammar rules to Quranic and classical Arabic texts', 'Prepare for Advanced Sarf & Nahw'],
 ARRAY['Ilm-us-Sigha', 'Al-Kafia'],
 '/images/Nahwa Sarsf.jpeg', 'published', 19),

('Advanced Sarf & Nahw Course', 'advanced-sarf-nahw', 'Advanced', 'Sarf & Nahw',
 'For students aiming for mastery in Arabic grammar and morphology. Using Sharah al-Jami, covers advanced verb forms and derivatives, irregular verbs, complex sentence structures (conditional, negation, emphasis), advanced noun forms and exceptions, syntax analysis of Quranic verses and Hadith, and application of grammar in advanced writing, Tafseer, and scholarly interpretation.',
 '8 Months', '3–4 days/week · 60–90 min per session', 35, 50, 'Intermediate Sarf & Nahw', 'Advanced Islamic Studies',
 ARRAY['Master complex Arabic grammar and sentence structures', 'Analyze classical and Quranic texts accurately', 'Prepare for advanced Islamic studies in Tafseer, Hadith, and Fiqh'],
 ARRAY['Sharah al-Jami'],
 '/images/Nahwa Sarsf.jpeg', 'published', 20),

-- Hadith Courses (4)
('Basic Hadith Course', 'basic-hadith', 'Beginner', 'Hadith',
 'Introduces students to the sayings, actions, and approvals of Prophet Muhammad (PBUH). Covers fundamentals of Hadith sciences (Ilm al-Hadith), basic classification of Hadith (Sahih, Hasan, Da''if), selected Hadiths on daily life, morals, and worship, and correct reading and basic Arabic understanding for Hadith. Focuses on practical application and understanding how Hadith guides daily conduct and spiritual life.',
 '4 Months', '3–5 days/week · 45 min per session', 20, 30, 'None', 'Intermediate Hadith',
 ARRAY['Understand basic Hadith classifications and importance', 'Memorize and explain selected Hadiths', 'Apply basic Hadith teachings to daily life', 'Prepare for Intermediate Hadith studies'],
 ARRAY['Riyadh-us-Saliheen (selected sections)'],
 '/images/Hadees.jpeg', 'published', 21),

('Intermediate Hadith Course', 'intermediate-hadith', 'Intermediate', 'Hadith',
 'Provides deeper understanding of Hadith with contextual analysis. Covers detailed Hadith collections (meanings and context), the chain of narrators (Isnad) and Hadith terminology, practical application in daily life, and comparison and analysis of Hadiths to resolve apparent contradictions. Bridges memorization and analytical understanding.',
 '6 Months', '3–4 days/week · 60 min per session', 25, 35, 'Basic Hadith Course', 'Advanced Hadith',
 ARRAY['Analyze Hadith texts with context and reasoning', 'Identify authentic Hadiths', 'Apply Hadith teachings to contemporary situations', 'Prepare for Advanced Hadith studies'],
 ARRAY['Mishkat al-Masabih'],
 '/images/Hadees.jpeg', 'published', 22),

('Advanced Hadith Course', 'advanced-hadith', 'Advanced', 'Hadith',
 'For students aiming for mastery in Hadith studies. In-depth analysis of Sahih al-Bukhari, Sahih Muslim, and other major collections; detailed study of Isnad and Matn; advanced authentication methods (Ilm al-Rijal, Ilm al-Jarh wa al-Ta''dil); application of Hadith in Fiqh, Tafseer, and contemporary Islamic issues; and Sharah (explanation) of complex Hadiths and scholarly interpretations.',
 '2 Years', '3–4 days/week · 60–90 min per session', 35, 50, 'Intermediate Hadith Course', 'Takhassus fil Hadith',
 ARRAY['Master major Hadith collections and their explanations', 'Authenticate and critically analyze Hadith using classical methods', 'Apply Hadith knowledge to Fiqh, Tafseer, and modern issues', 'Prepare for teaching, research, or scholarly work in Hadith sciences'],
 ARRAY['Sahih al-Bukhari', 'Sahih Muslim', 'Sharah of Major Hadith Collections'],
 '/images/Hadees.jpeg', 'published', 23),

('Takhassus fil Hadith (Specialization in Hadith Sciences)', 'takhassus-fil-hadith', 'Specialized', 'Hadith',
 'The highest level of Hadith education — an advanced specialization for students who have completed all three Hadith levels and want to master Hadith sciences. Focuses on in-depth study of all six major Hadith collections, advanced Sharah of complex Hadiths, detailed Isnad and Matn analysis, advanced authentication methodologies, resolving contradictions and understanding narration variations, application to Fiqh and Tafseer, and guidance on teaching, scholarly writing, and issuing fatawa.',
 '2 Years', '3–5 days/week · 90 min per session', 50, 70, 'Basic → Intermediate → Advanced Hadith completion (all three levels)', 'None - Highest Level',
 ARRAY['Master classical Hadith texts and commentaries', 'Analyze chains of narrators and authenticate narrations accurately', 'Interpret complex Hadiths and resolve scholarly differences', 'Conduct research, write scholarly articles, and teach Hadith at an advanced level'],
 ARRAY['Sahih al-Bukhari', 'Sahih Muslim', 'Sunan Abu Dawood', 'Tirmidhi', 'Nasa''i', 'Ibn Majah', 'Musnad Collections'],
 '/images/Hadees.jpeg', 'published', 24);

-- Verify insertion
SELECT 'Total courses inserted: ' || COUNT(*) as result FROM courses;
