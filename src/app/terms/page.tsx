"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FileText, Scale, BookOpen, AlertCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Scale className="w-16 h-16 text-[var(--primary)] mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Terms of Service
            </h1>
            <p className="text-[var(--text-muted)]">
              Please read these terms carefully before using our services.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 shadow-lg border border-[var(--border)] space-y-8"
          >
            <section>
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-[var(--primary)]" />
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Educational Services</h2>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Al-NOOR Online Quran & Hadees Academy provides online Islamic education services. 
                By enrolling in our courses, you agree to participate actively, complete assignments, 
                and follow the guidance of our qualified teachers.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-[var(--primary)]" />
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Registration & Accounts</h2>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed">
                You must provide accurate information during registration. You are responsible for 
                maintaining the confidentiality of your account credentials and for all activities 
                that occur under your account.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-[var(--primary)]" />
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Code of Conduct</h2>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Students are expected to maintain respectful behavior during classes, be punctual, 
                and adhere to Islamic etiquette. Any inappropriate behavior may result in suspension 
                or termination of enrollment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Contact Us</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                For questions about these Terms of Service, please contact us at:{" "}
                <a href="mailto:waqas@alnooronlineacademy.com" className="text-[var(--primary)] hover:underline">
                  waqas@alnooronlineacademy.com
                </a>
              </p>
            </section>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
