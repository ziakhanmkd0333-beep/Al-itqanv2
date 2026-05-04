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
    // Check for existing email in students table
    const { data: existingEmail } = await supabase
      .from('students')
      .select('id')
      .eq('email', email)
      .maybeSingle();

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
      .maybeSingle();

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



export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    console.log('[API /register/enhanced] Received POST request');
    
    const supabaseAdmin = getSupabaseAdmin();
    
    // Get client IP address
    const headersList = await headers();
    const forwardedFor = headersList.get('x-forwarded-for');
    const ipAddress = forwardedFor?.split(',')[0] || headersList.get('x-real-ip') || 'unknown';

    // Parse form data
    const formData = await request.formData();
    console.log('[API /register/enhanced] Form data received, email:', formData.get('email'));

    // Extract and sanitize fields
    const fullName = sanitizeInput(formData.get('fullName') as string);
    const email = sanitizeInput(formData.get('email') as string).toLowerCase();
    const phone = sanitizeInput(formData.get('phone') as string);
    const country = sanitizeInput(formData.get('country') as string);
    const city = sanitizeInput(formData.get('city') as string);
    const address = sanitizeInput(formData.get('address') as string);
    const fullAddress = address; // Map address to fullAddress for compatibility
    const role = sanitizeInput(formData.get('role') as string);
    const password = formData.get('password') as string;
    // confirmPassword is validated on frontend before submission
    const guardianName = sanitizeInput(formData.get('guardianName') as string);
    const guardianPhone = sanitizeInput(formData.get('guardianPhone') as string);
    const age = sanitizeInput(formData.get('age') as string);
    const language = sanitizeInput(formData.get('language') as string);
    const courseId = sanitizeInput(formData.get('courseId') as string);
    const preferredTiming = sanitizeInput(formData.get('preferredTiming') as string);
    const startDate = sanitizeInput(formData.get('startDate') as string);
    const message = sanitizeInput(formData.get('message') as string);

    // Parse JSON fields
    const previousEducation = JSON.parse(formData.get('previousEducation') as string || '[]');

    // Get Supabase URLs
    const profilePictureUrl = formData.get('profilePictureUrl') as string | null;
    const certificateUrls = JSON.parse(formData.get('certificateUrls') as string || '[]');
    
    // Islamic qualifications type definition
    interface IslamicQualification {
      enabled: boolean;
      details?: string | null;
      institution?: string | null;
      completionYear?: string | number | null;
      juzCount?: string | number | null;
    }

    // Helper function to safely parse year values
    const parseYear = (value: string | number | null | undefined): number | null => {
      if (value === null || value === undefined) return null;
      if (typeof value === 'number') return isNaN(value) ? null : value;
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? null : parsed;
    };

    // Mock Islamic qualifications (not collected in frontend)
    const nazira: IslamicQualification = { enabled: false, details: null, institution: null, completionYear: null };
    const hifz: IslamicQualification = { enabled: false, details: null, institution: null, completionYear: null, juzCount: null };
    const tarjama: IslamicQualification = { enabled: false, details: null, institution: null, completionYear: null };
    const tafseer: IslamicQualification = { enabled: false, details: null, institution: null, completionYear: null };

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
    if (!address) errors.address = 'Address is required';
    if (!age) errors.age = 'Age is required';
    if (!profilePictureUrl) errors.profilePicture = 'Profile picture is required';

    // Role Validation
    if (!role) errors.role = 'Role is required';
    if (!['Student', 'Teacher'].includes(role)) {
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
    
    // Course validation
    if (!courseId) errors.courseId = 'Please select a course';

    if (Object.keys(errors).length > 0) {
      console.log('[API /register/enhanced] Validation failed:', errors);
      return NextResponse.json({ error: 'Validation failed', errors }, { status: 400 });
    }
    
    console.log('[API /register/enhanced] Validation passed, proceeding with registration');

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

      if (role === 'Student') {
        const currentClassGrade = sanitizeInput(formData.get('currentClassGrade') as string);
        const courseApplyingFor = courseId;
        const schoolInstituteName = sanitizeInput(formData.get('schoolInstituteName') as string);
        // academicDetails is mapped to message field

        // Build insert data with only essential columns
        const studentData: Record<string, unknown> = {
          user_id: userId,
          full_name: fullName,
          email,
          phone,
          country,
          city,
          full_address: fullAddress,
          profile_picture_url: profilePictureUrl,
          academic_details: message || null,
          role: 'student',
          status: fraudCheck.isSuspicious ? 'flagged' : 'pending',
          is_approved: false,
          is_flagged: fraudCheck.isSuspicious,
          flag_reason: fraudCheck.reason,
          submitted_from_ip: ipAddress,
          created_at: new Date().toISOString(),
        };
        
        // Add optional fields only if provided
        if (guardianName) studentData.guardian_name = guardianName;
        if (guardianPhone) studentData.guardian_phone = guardianPhone;
        if (age) studentData.age = parseInt(age);
        if (language) studentData.language = language;
        if (preferredTiming) studentData.preferred_timing = preferredTiming;
        if (startDate) studentData.start_date = startDate;
        if (currentClassGrade) studentData.current_class_grade = currentClassGrade;
        if (schoolInstituteName) studentData.school_institute_name = schoolInstituteName;
        
        console.log('[API] Inserting student with data:', Object.keys(studentData));
        
        const { data: student, error: studentError } = await supabaseAdmin
          .from('students')
          .insert(studentData)
          .select()
          .single();

        if (studentError) {
          console.error('[API] Student insert error:', studentError);
          throw new Error(studentError.message || 'Failed to create student record');
        }
        
        console.log('[API] Student created successfully:', student.id);

        recordId = student.id;

        // Create admission record if course selected
        if (courseApplyingFor) {
          try {
            await supabaseAdmin.from('admissions').insert({
              student_id: recordId,
              course_id: courseApplyingFor,
              status: 'pending',
              applied_at: new Date().toISOString(),
            });
            console.log('[API] Admission record created');
          } catch (err) {
            console.log('[API] Admissions table not available, skipping');
          }
        }
      } else {
        throw new Error('Invalid role. Only Student applications are supported via this endpoint.');
      }

      // ===== CREATE ISLAMIC EDUCATION QUALIFICATIONS (optional) =====
      try {
        await supabaseAdmin.from('islamic_education_qualifications').insert({
          student_id: recordId,
          nazira_enabled: nazira.enabled || false,
          nazira_details: nazira.details || null,
          nazira_institution: nazira.institution || null,
          nazira_completion_year: parseYear(nazira.completionYear),
          hifz_enabled: hifz.enabled || false,
          hifz_details: hifz.details || null,
          hifz_institution: hifz.institution || null,
          hifz_completion_year: parseYear(hifz.completionYear),
          hifz_juz_count: parseYear(hifz.juzCount),
          tarjama_enabled: tarjama.enabled || false,
          tarjama_details: tarjama.details || null,
          tarjama_institution: tarjama.institution || null,
          tarjama_completion_year: parseYear(tarjama.completionYear),
          tafseer_enabled: tafseer.enabled || false,
          tafseer_details: tafseer.details || null,
          tafseer_institution: tafseer.institution || null,
          tafseer_completion_year: parseYear(tafseer.completionYear),
        });
      } catch (_err) {
        console.log('[API] Islamic education qualifications table not available, skipping');
      }

      // ===== CREATE PREVIOUS EDUCATION RECORDS (optional) =====
      if (previousEducation && previousEducation.length > 0) {
        try {
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
        } catch (_err) {
          console.log('[API] Previous education table not available, skipping');
        }
      }

      // ===== STORE CERTIFICATE URLS (optional) =====
      if (certificateUrls && certificateUrls.length > 0) {
        try {
          for (const url of certificateUrls) {
            await supabaseAdmin.from('certificates').insert({
              user_id: userId,
              file_url: url,
              uploaded_at: new Date().toISOString(),
            });
          }
        } catch (_err) {
          console.log('[API] Certificates table not available, skipping');
        }
      }

      // CREATE ROLE-SPECIFIC INFO =====
      // Skipped for student applications - info stored in students table

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
      // Rollback: Delete auth user if any step failed (but only if userId was created)
      if (userId) {
        try {
          await supabaseAdmin.auth.admin.deleteUser(userId);
          await supabaseAdmin.from('users').delete().eq('id', userId);
        } catch (rollbackError) {
          console.error('Rollback error:', rollbackError);
        }
      }
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user record';
      return NextResponse.json(
        { error: errorMessage, step: 'transaction_failed' },
        { status: 500 }
      );
    }

  } catch (error: unknown) {
    console.error('[API] Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const errorDetails = error instanceof Error ? { stack: error.stack, name: error.name } : null;
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
