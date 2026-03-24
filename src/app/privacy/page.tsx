"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPage() {
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
            <Shield className="w-16 h-16 text-[var(--primary)] mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Privacy Policy
            </h1>
            <p className="text-[var(--text-muted)]">
              Your privacy is important to us. Learn how we protect your data.
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
                <Database className="w-6 h-6 text-[var(--primary)]" />
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Information We Collect</h2>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed">
                We collect personal information including your name, email address, phone number, 
                and course preferences when you register. This information is necessary to provide 
                our educational services and communicate with you about your learning journey.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-[var(--primary)]" />
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">How We Protect Your Data</h2>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed">
                We implement industry-standard security measures including encryption, secure servers, 
                and regular security audits. Your data is stored securely and access is restricted 
                to authorized personnel only.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-[var(--primary)]" />
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">How We Use Your Information</h2>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Your information is used solely for educational purposes: scheduling classes, 
                tracking progress, communicating with teachers, and providing customer support. 
                We do not sell or share your personal information with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Contact Us</h2>
              <p className="text-[var(--text-muted)] leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:{" "}
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
