import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { headers } from 'next/headers';

// Supabase admin client
const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
};

// Input sanitization to prevent injection attacks
const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

// Email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation
const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password validation
const isValidPassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password must contain at least one uppercase letter' };
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Password must contain at least one lowercase letter' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Password must contain at least one number' };
  return { valid: true };
};

// Fraud detection: Check for duplicate submissions
const checkFraudDetection = async (
  supabase: ReturnType<typeof getSupabaseAdmin>,
  email: string,
  phone: string,
  ipAddress: string
): Promise<{ isSuspicious: boolean; reason?: string }> => {
  try {
    // Check for existing email in users table
    const { data: existingEmail } = await supabase
      .from('students')
      .select('id')
      .eq('email', email)
      .single();

    if (existingEmail) {
      return { isSuspicious: true, reason: 'Email already registered' };
    }

    // Check fraud detection logs
    const { data: fraudLogs } = await supabase
      .from('fraud_detection_logs')
      .select('*')
      .or(`email.eq.${email},phone.eq.${phone},ip_address.eq.${ipAddress}`)
      .order('submission_count', { ascending: false });

    if (fraudLogs && fraudLogs.length > 0) {
      const highestCount = fraudLogs[0].submission_count;
      
      if (highestCount >= 3) {
        return { isSuspicious: true, reason: `Multiple submissions detected (${highestCount} attempts)` };
      }
    }

    // Check for suspicious patterns in email
    const suspiciousPatterns = [
      /tempmail/i,
      /guerrillamail/i,
      /throwaway/i,
      /fake/i,
      /test\d+@/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(email)) {
        return { isSuspicious: true, reason: 'Suspicious email pattern detected' };
      }
    }

    return { isSuspicious: false };
  } catch (error) {
    console.error('Fraud detection error:', error);
    return { isSuspicious: false }; // Allow on error
  }
};

// Update fraud detection log
const updateFraudLog = async (
  supabase: ReturnType<typeof getSupabaseAdmin>,
  email: string,
  phone: string,
  ipAddress: string
) => {
  try {
    const { data: existingLog } = await supabase
      .from('fraud_detection_logs')
      .select('*')
      .or(`email.eq.${email},phone.eq.${phone},ip_address.eq.${ipAddress}`)
      .single();

    if (existingLog) {
      await supabase
        .from('fraud_detection_logs')
        .update({
          submission_count: existingLog.submission_count + 1,
          last_submission_at: new Date().toISOString(),
        })
        .eq('id', existingLog.id);
    } else {
      await supabase.from('fraud_detection_logs').insert({
        email,
        phone,
        ip_address: ipAddress,
        submission_count: 1,
      });
    }
  } catch (error) {
    console.error('Error updating fraud log:', error);
  }
};

// File upload handler (placeholder - implement with your storage solution)
const uploadFile = async (
  supabase: ReturnType<typeof getSupabaseAdmin>,
  file: File,
  folder: string,
  userId: string
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${userId}/${Date.now()}.${fileExt}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('admission-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('File upload error:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('admission-documents')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    return null;
  }
};

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Get client IP address
    const headersList = headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ipAddress = forwardedFor?.split(',')[0] || headersList.get('x-real-ip') || 'unknown';

    // Parse form data
    const formData = await request.formData();

    // Extract and sanitize fields
    const fullName = sanitizeInput(formData.get('fullName') as string);
    const email = sanitizeInput(formData.get('email') as string).toLowerCase();
    const phone = sanitizeInput(formData.get('phone') as string);
    const country = sanitizeInput(formData.get('country') as string);
    const city = sanitizeInput(formData.get('city') as string);
    const fullAddress = sanitizeInput(formData.get('fullAddress') as string);
    const role = sanitizeInput(formData.get('role') as string);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const guardianName = sanitizeInput(formData.get('guardianName') as string);
    const guardianPhone = sanitizeInput(formData.get('guardianPhone') as string);
    const message = sanitizeInput(formData.get('message') as string);

    // Parse JSON fields
    const nazira = JSON.parse(formData.get('nazira') as string || '{}');
    const hifz = JSON.parse(formData.get('hifz') as string || '{}');
    const tarjama = JSON.parse(formData.get('tarjama') as string || '{}');
    const tafseer = JSON.parse(formData.get('tafseer') as string || '{}');
    const previousEducation = JSON.parse(formData.get('previousEducation') as string || '[]');

    // Get files
    const profilePicture = formData.get('profilePicture') as File | null;

    // ===== VALIDATION =====
    const errors: Record<string, string> = {};

    // Personal Info Validation
    if (!fullName) errors.fullName = 'Full name is required';
    if (!email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Invalid email format';
    }
    if (!phone) {
      errors.phone = 'Phone number is required';
    } else if (!isValidPhone(phone)) {
      errors.phone = 'Invalid phone number format';
    }
    if (!country) errors.country = 'Country is required';
    if (!city) errors.city = 'City is required';
    if (!fullAddress) errors.fullAddress = 'Full address is required';
    if (!profilePicture) errors.profilePicture = 'Profile picture is required';

    // Role Validation
    if (!role) errors.role = 'Role is required';
    if (!['student', 'teacher', 'imam', 'mudarris'].includes(role)) {
      errors.role = 'Invalid role selected';
    }

    // Password Validation
    if (!password) {
      errors.password = 'Password is required';
    } else {
      const passwordCheck = isValidPassword(password);
      if (!passwordCheck.valid) {
        errors.password = passwordCheck.message || 'Invalid password';
      }
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Islamic Qualifications Validation
    const hasQualification = nazira.enabled || hifz.enabled || tarjama.enabled || tafseer.enabled;
    if (!hasQualification) {
      errors.qualifications = 'At least one Islamic education qualification is required';
    }
    if (nazira.enabled && !nazira.details?.trim()) {
      errors.naziraDetails = 'Nazira details are required';
    }
    if (hifz.enabled && !hifz.details?.trim()) {
      errors.hifzDetails = 'Hifz details are required';
    }
    if (tarjama.enabled && !tarjama.details?.trim()) {
      errors.tarjamaDetails = 'Tarjama details are required';
    }
    if (tafseer.enabled && !tafseer.details?.trim()) {
      errors.tafseerDetails = 'Tafseer details are required';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }

    // ===== FRAUD DETECTION =====
    const fraudCheck = await checkFraudDetection(supabaseAdmin, email, phone, ipAddress);
    
    // Update fraud log regardless of result
    await updateFraudLog(supabaseAdmin, email, phone, ipAddress);

    // ===== CREATE AUTH USER =====
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Require email verification
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message || 'Failed to create user account' },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    try {
      // ===== UPLOAD PROFILE PICTURE =====
      let profilePictureUrl: string | null = null;
      if (profilePicture) {
        profilePictureUrl = await uploadFile(supabaseAdmin, profilePicture, 'profiles', userId);
      }

      // ===== HASH PASSWORD =====
      const passwordHash = await bcrypt.hash(password, 10);

      // ===== CREATE USER RECORD =====
      const { error: userError } = await supabaseAdmin.from('users').insert({
        id: userId,
        email,
        full_name: fullName,
        role: role === 'teacher' || role === 'imam' || role === 'mudarris' ? 'teacher' : 'student',
        password_hash: passwordHash,
        is_active: !fraudCheck.isSuspicious, // Deactivate if suspicious
        is_approved: false, // Always require admin approval
        created_at: new Date().toISOString(),
      });

      if (userError) {
        throw new Error(userError.message || 'Failed to create user record');
      }

      // ===== CREATE STUDENT/TEACHER RECORD =====
      let recordId: string;

      if (role === 'student') {
        const currentClassGrade = sanitizeInput(formData.get('currentClassGrade') as string);
        const courseApplyingFor = sanitizeInput(formData.get('courseApplyingFor') as string);
        const schoolInstituteName = sanitizeInput(formData.get('schoolInstituteName') as string);
        const academicDetails = sanitizeInput(formData.get('academicDetails') as string);

        const { data: student, error: studentError } = await supabaseAdmin
          .from('students')
          .insert({
            user_id: userId,
            full_name: fullName,
            email,
            phone,
            country,
            city,
            full_address: fullAddress,
            profile_picture_url: profilePictureUrl,
            role,
            status: fraudCheck.isSuspicious ? 'flagged' : 'pending',
            is_approved: false,
            is_flagged: fraudCheck.isSuspicious,
            flag_reason: fraudCheck.reason,
            submitted_from_ip: ipAddress,
            guardian_name: guardianName || null,
            guardian_phone: guardianPhone || null,
            current_class_grade: currentClassGrade || null,
            school_institute_name: schoolInstituteName || null,
            academic_details: academicDetails || null,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (studentError) {
          throw new Error(studentError.message || 'Failed to create student record');
        }

        recordId = student.id;

        // Create admission record if course selected
        if (courseApplyingFor) {
          await supabaseAdmin.from('admissions').insert({
            student_id: recordId,
            course_id: courseApplyingFor,
            status: 'pending',
            applied_at: new Date().toISOString(),
          });
        }
      } else {
        // Teacher, Imam, or Mudarris
        const teacherData: Record<string, unknown> = {
          user_id: userId,
          full_name: fullName,
          email,
          phone,
          country,
          city,
          full_address: fullAddress,
          profile_picture_url: profilePictureUrl,
          role,
          status: fraudCheck.isSuspicious ? 'flagged' : 'pending',
          is_approved: false,
          is_flagged: fraudCheck.isSuspicious,
          flag_reason: fraudCheck.reason,
          submitted_from_ip: ipAddress,
          created_at: new Date().toISOString(),
        };

        // Add role-specific fields
        if (role === 'teacher') {
          teacherData.school_name = sanitizeInput(formData.get('teacherSchoolName') as string) || null;
          teacherData.teaching_subject = sanitizeInput(formData.get('teachingSubject') as string) || null;
          teacherData.years_of_experience = sanitizeInput(formData.get('teacherYearsOfExperience') as string) || null;
          teacherData.school_city = sanitizeInput(formData.get('teacherSchoolCity') as string) || null;
          teacherData.school_address = sanitizeInput(formData.get('teacherSchoolAddress') as string) || null;
        } else if (role === 'imam') {
          teacherData.mosque_name = sanitizeInput(formData.get('mosqueName') as string) || null;
          teacherData.mosque_city = sanitizeInput(formData.get('mosqueCity') as string) || null;
          teacherData.mosque_address = sanitizeInput(formData.get('mosqueAddress') as string) || null;
          teacherData.years_serving = sanitizeInput(formData.get('yearsServingAsImam') as string) || null;
        } else if (role === 'mudarris') {
          teacherData.madrasa_name = sanitizeInput(formData.get('madrasaName') as string) || null;
          teacherData.madrasa_city = sanitizeInput(formData.get('madrasaCity') as string) || null;
          teacherData.madrasa_address = sanitizeInput(formData.get('madrasaAddress') as string) || null;
          teacherData.mudarris_years_experience = sanitizeInput(formData.get('mudarrisYearsOfExperience') as string) || null;
          const subjectsTeaching = JSON.parse(formData.get('subjectsTeaching') as string || '[]');
          teacherData.subjects_teaching = subjectsTeaching;
        }

        const { data: teacher, error: teacherError } = await supabaseAdmin
          .from('teachers')
          .insert(teacherData)
          .select()
          .single();

        if (teacherError) {
          throw new Error(teacherError.message || 'Failed to create teacher record');
        }

        recordId = teacher.id;
      }

      // ===== CREATE ISLAMIC EDUCATION QUALIFICATIONS =====
      await supabaseAdmin.from('islamic_education_qualifications').insert({
        student_id: recordId,
        nazira_enabled: nazira.enabled || false,
        nazira_details: nazira.details || null,
        nazira_institution: nazira.institution || null,
        nazira_completion_year: nazira.completionYear ? parseInt(nazira.completionYear) : null,
        hifz_enabled: hifz.enabled || false,
        hifz_details: hifz.details || null,
        hifz_institution: hifz.institution || null,
        hifz_completion_year: hifz.completionYear ? parseInt(hifz.completionYear) : null,
        hifz_juz_count: hifz.juzCount ? parseInt(hifz.juzCount) : null,
        tarjama_enabled: tarjama.enabled || false,
        tarjama_details: tarjama.details || null,
        tarjama_institution: tarjama.institution || null,
        tarjama_completion_year: tarjama.completionYear ? parseInt(tarjama.completionYear) : null,
        tafseer_enabled: tafseer.enabled || false,
        tafseer_details: tafseer.details || null,
        tafseer_institution: tafseer.institution || null,
        tafseer_completion_year: tafseer.completionYear ? parseInt(tafseer.completionYear) : null,
      });

      // ===== CREATE PREVIOUS EDUCATION RECORDS =====
      if (previousEducation && previousEducation.length > 0) {
        for (const edu of previousEducation) {
          if (edu.institutionName) {
            await supabaseAdmin.from('previous_education').insert({
              student_id: recordId,
              education_type: edu.educationType || 'general',
              institution_name: sanitizeInput(edu.institutionName),
              degree_title: sanitizeInput(edu.degreeTitle) || null,
              completion_year: edu.completionYear ? parseInt(edu.completionYear) : null,
            });
          }
        }
      }

      // ===== CREATE ROLE-SPECIFIC INFO =====
      const roleSpecificData: Record<string, unknown> = {
        user_id: userId,
        role,
      };

      if (role === 'student') {
        roleSpecificData.current_class_grade = sanitizeInput(formData.get('currentClassGrade') as string) || null;
        roleSpecificData.school_institute_name = sanitizeInput(formData.get('schoolInstituteName') as string) || null;
      } else if (role === 'teacher') {
        roleSpecificData.school_name = sanitizeInput(formData.get('teacherSchoolName') as string) || null;
        roleSpecificData.teaching_subject = sanitizeInput(formData.get('teachingSubject') as string) || null;
        roleSpecificData.years_of_experience = sanitizeInput(formData.get('teacherYearsOfExperience') as string) || null;
        roleSpecificData.school_city = sanitizeInput(formData.get('teacherSchoolCity') as string) || null;
        roleSpecificData.school_address = sanitizeInput(formData.get('teacherSchoolAddress') as string) || null;
      } else if (role === 'imam') {
        roleSpecificData.mosque_name = sanitizeInput(formData.get('mosqueName') as string) || null;
        roleSpecificData.mosque_city = sanitizeInput(formData.get('mosqueCity') as string) || null;
        roleSpecificData.mosque_address = sanitizeInput(formData.get('mosqueAddress') as string) || null;
        roleSpecificData.years_serving = sanitizeInput(formData.get('yearsServingAsImam') as string) || null;
      } else if (role === 'mudarris') {
        roleSpecificData.madrasa_name = sanitizeInput(formData.get('madrasaName') as string) || null;
        roleSpecificData.madrasa_city = sanitizeInput(formData.get('madrasaCity') as string) || null;
        roleSpecificData.madrasa_address = sanitizeInput(formData.get('madrasaAddress') as string) || null;
        const subjectsTeaching = JSON.parse(formData.get('subjectsTeaching') as string || '[]');
        roleSpecificData.subjects_teaching = subjectsTeaching;
        roleSpecificData.years_of_experience = sanitizeInput(formData.get('mudarrisYearsOfExperience') as string) || null;
      }

      await supabaseAdmin.from('role_specific_info').insert(roleSpecificData);

      return NextResponse.json({
        success: true,
        message: fraudCheck.isSuspicious
          ? 'Application submitted but flagged for review. You will be contacted by admin.'
          : 'Application submitted successfully. Pending admin approval.',
        data: {
          userId,
          recordId,
          role,
          isFlagged: fraudCheck.isSuspicious,
          flagReason: fraudCheck.reason,
          requiresApproval: true,
        },
      });

    } catch (error: unknown) {
      // Rollback: Delete auth user if any step failed
      await supabaseAdmin.auth.admin.deleteUser(userId);
      await supabaseAdmin.from('users').delete().eq('id', userId);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user record';
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error('Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
