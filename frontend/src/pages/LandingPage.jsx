import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, Shield, LineChart, Award, FileSignature, 
  ArrowRight, Check, HelpCircle, ChevronDown, Sparkles 
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

export const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    {
      icon: Award,
      title: 'Instant ATS Scoring',
      desc: 'Receive an immediate score out of 100 on how your resume performs against top applicant tracking systems.'
    },
    {
      icon: LineChart,
      title: 'Keyword Gap Analysis',
      desc: 'Compare your resume against a specific job description and identify key industry terms you need to include.'
    },
    {
      icon: FileSignature,
      title: 'AI Cover Letter Generator',
      desc: 'Create highly professional, tailored cover letters matching your skills with target roles in seconds.'
    },
    {
      icon: FileText,
      title: 'Deep Grammar & Formatting Audit',
      desc: 'Catch hidden typos, passive voice issues, formatting mistakes, and get AI-driven bullet-point rewrites.'
    }
  ];

  const steps = [
    { num: '1', title: 'Upload PDF', desc: 'Drag and drop your resume in PDF format.' },
    { num: '2', title: 'Paste Job Details', desc: 'Paste the target job description and company name.' },
    { num: '3', title: 'Review Analysis', desc: 'Get circular scores, missing keywords, and formatting feedback.' },
    { num: '4', title: 'Export Results', desc: 'Download a clean improvement PDF report and a custom cover letter.' }
  ];

  const faqs = [
    {
      q: 'What is an ATS and why does it matter?',
      a: 'An Applicant Tracking System (ATS) is software recruiters use to filter, screen, and rank resumes. Over 75% of resumes are weeded out by an ATS before a human ever looks at them. ResQAI parses your resume just like an ATS to ensure you match target keywords.'
    },
    {
      q: 'How does the AI Resume suggestions work?',
      a: 'We leverage Google Gemini LLM technology to analyze your resume structure, syntax, and skills list. It evaluates standard engineering best practices, highlights structural issues, and drafts tailored rewrites.'
    },
    {
      q: 'Is my data secure on ResQAI?',
      a: 'Absolutely. Resumes are stored securely in a local database and files are protected. We only transmit text content to Gemini APIs securely. You can delete your history and files from our database at any time.'
    },
    {
      q: 'Can I use this service for free?',
      a: 'Yes! The application runs completely in Demo Mode. You get full resume analyses, keyword matching, and cover letter generators for free.'
    }
  ];

  const testimonials = [
    {
      name: 'Sneha Rao',
      role: 'Incoming SDE Intern at Amazon',
      text: 'ResQAI helped me identify that I was missing TypeScript and Docker from my skills list. Once I added them, my response rate from applications skyrocketed!',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha'
    },
    {
      name: 'Rohit Sharma',
      role: 'Computer Engineering Student',
      text: 'The cover letter generator is a lifesaver. It maps project details from my resume right into the letter, saving me hours of manual cover letter drafting.',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
        {/* Animated Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow"></div>

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 text-xs font-semibold tracking-wide uppercase mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Career Optimization</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] max-w-4xl mx-auto"
          >
            Optimize Your Resume with AI &{' '}
            <span className="text-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text">
              Improve Your ATS Score
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            Scan your resume against target job descriptions, uncover skill gaps, and generate premium cover letters to land your dream tech internship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/signup"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-4 text-base font-semibold text-slate-700 hover:text-slate-900 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition-all"
            >
              <span>Analyze Resume</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/50 dark:border-slate-800/30 transition-colors duration-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Packed with features for job hunters
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Built specifically to answer the core bottlenecks of early career placement processes.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group relative flex flex-col p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-premium hover:shadow-lg transition-all"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 w-fit mb-5 group-hover:scale-110 transition-transform">
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 transition-colors duration-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Four steps to optimization
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Go from a blank page or low ATS visibility to a tailored portfolio resume in minutes.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-4 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center p-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-lg shadow-md mb-6 z-10">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{step.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-slate-200 dark:border-slate-800 -z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200/50 dark:border-slate-800/30 transition-colors duration-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Loved by college students and job seekers
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Here is how candidates are landing offers with optimized applications.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {testimonials.map((test, idx) => (
              <div key={idx} className="flex flex-col p-8 bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-sm">
                <p className="italic text-slate-600 dark:text-slate-300 leading-relaxed flex-grow">
                  "{test.text}"
                </p>
                <div className="mt-6 flex items-center space-x-3">
                  <img src={test.img} alt={test.name} className="w-10 h-10 rounded-full bg-slate-200" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white">{test.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 transition-colors duration-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              No subscription contracts, no hidden charges. Use the application in full local sandbox mode.
            </p>
          </div>

          <div className="mt-16 max-w-lg mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-premium overflow-hidden">
            <div className="p-8 text-center border-b border-slate-200 dark:border-slate-800">
              <span className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
                Demo Sandbox Plan
              </span>
              <div className="mt-4 flex items-center justify-center">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">$0</span>
                <span className="ml-2 text-slate-500">/ forever</span>
              </div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Perfect for engineering students preparing placement files.
              </p>
            </div>
            <div className="p-8 bg-slate-50/50 dark:bg-slate-900/50">
              <ul className="space-y-4">
                {[
                  'Unlimited resume PDF text parsing',
                  'Google Gemini analysis algorithms fallback',
                  'Job Description matching & analysis charts',
                  'Grammar audit & suggestions panel',
                  'Instant PDF cover letter drafts',
                  'History tracking & admin user management'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm text-slate-600 dark:text-slate-300">
                    <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-6 py-3.5 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-md transition-all"
                >
                  Start Analyzing For Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/30 transition-colors duration-200">
        <div className="px-4 mx-auto max-w-4xl sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                
                {activeFaq === idx && (
                  <div className="px-6 pb-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4 bg-slate-50/50 dark:bg-slate-900/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
