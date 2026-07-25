import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Construction } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-grow flex items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-premium"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 mb-6">
            <Construction className="h-8 w-8" />
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-none">404</h1>
          <h2 className="mt-3 text-xl font-bold text-slate-800 dark:text-slate-200">Page Not Found</h2>
          
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-450 leading-relaxed">
            The page you are looking for does not exist or has been relocated to another workspace directory.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              to="/dashboard"
              className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg hover:shadow-xl font-semibold transition-all text-sm cursor-pointer"
            >
              <span>Go to Dashboard</span>
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center space-x-1.5 px-6 py-3 text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors text-sm font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};
