import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Sparkles, Mail, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // Simulate API request latency
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-10 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-premium"
        >
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              We'll send you instructions to reset your password
            </p>
          </div>

          {isSubmitted ? (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="space-y-6 text-center"
            >
              <div className="flex items-center space-x-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-200/50 dark:border-emerald-900/30">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Password reset link sent! Check your inbox.</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                We've sent a simulated password recovery email. In production, this integrates with SMTP services to securely reset your credentials.
              </p>
              <Link
                to="/login"
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl transition-all font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </motion.div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                {/* Email field */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                      <Mail className="w-5 h-5" />
                    </span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50/50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all ${
                        errors.email
                          ? 'border-rose-400 focus:border-rose-500 shadow-[0_0_0_2px_rgba(244,63,94,0.15)]'
                          : 'border-slate-200 dark:border-slate-800 focus:border-primary focus:shadow-[0_0_0_2px_rgba(37,99,235,0.15)]'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{isSubmitting ? 'Sending instructions...' : 'Send Reset Link'}</span>
              </button>
            </form>
          )}

          {!isSubmitted && (
            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to login</span>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
