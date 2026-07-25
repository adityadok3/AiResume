import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, Mail, User } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo and Tagline */}
          <div className="space-y-4 xl:col-span-1">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
              <Sparkles className="w-6 h-6 text-primary" />
              <span>ResQAI</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              Optimize your resume with AI, perform deep keyword matching against target job descriptions, and generate cover letters instantly.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                <span className="sr-only">Twitter</span>
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                <span className="sr-only">GitHub</span>
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                <span className="sr-only">LinkedIn</span>
                <User className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white tracking-wider uppercase">Features</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/upload" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    Resume Upload
                  </Link>
                </li>
                <li>
                  <Link to="/upload" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    ATS Scoring
                  </Link>
                </li>
                <li>
                  <Link to="/cover-letter" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    Cover Letter Generator
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white tracking-wider uppercase">Resources</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#faq" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white tracking-wider uppercase">Contact</h3>
              <ul className="mt-4 space-y-2">
                <li className="text-sm text-slate-500 dark:text-slate-400">
                  support@resqai.com
                </li>
                <li className="text-sm text-slate-500 dark:text-slate-400">
                  1-800-RESQAI-HELP
                </li>
                <li className="text-sm text-slate-500 dark:text-slate-400">
                  Bengaluru, India
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} ResQAI Inc. All rights reserved. Built as a Computer Engineering Portfolio Project.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-xs text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="text-xs text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
