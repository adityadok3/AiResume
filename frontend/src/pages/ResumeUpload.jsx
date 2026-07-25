import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, X, AlertCircle, Sparkles, 
  ArrowRight, Landmark, FileQuestion, ChevronRight 
} from 'lucide-react';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const ResumeUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);
  const { register, handleSubmit, watch } = useForm();
  
  const jobDescription = watch('jobDescription');
  const companyName = watch('companyName');

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setError(null);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    setError(null);
    const files = e.target.files;
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (fileObj) => {
    if (fileObj.type !== 'application/pdf' && !fileObj.name.endsWith('.pdf')) {
      setError('Only PDF documents are supported.');
      return;
    }
    if (fileObj.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File is too large. Max size is 5MB.');
      return;
    }
    setFile(fileObj);
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const onSubmit = async (data) => {
    if (!file) {
      setError('Please select or upload a resume PDF.');
      return;
    }

    setUploading(true);
    setUploadProgress(20);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    if (data.jobDescription) {
      formData.append('job_description', data.jobDescription);
    }
    if (data.companyName) {
      formData.append('company_name', data.companyName);
    }

    try {
      setUploadProgress(50);
      const res = await api.post('/upload', formData, true);
      setUploadProgress(90);
      // Brief delay to show completion state
      setTimeout(() => {
        navigate(`/analysis/${res.analysis_id}`);
      }, 800);
    } catch (err) {
      setError(err.message || 'Failed to analyze resume. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Loading Overlay */}
        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 text-center"
            >
              <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-premium space-y-6">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Parsing & Analyzing...</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Our AI models are extracting contact info, comparing tech skills, matching keywords, and formatting suggestions.
                  </p>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-primary to-secondary h-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  Analyzing contents... {uploadProgress}%
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mb-10">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" />
            <span>AI Resume Optimizer</span>
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Upload & Compare Resume
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            For best results, upload a PDF resume and paste the description of your target job role.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 grid-cols-1 md:grid-cols-2">
          {/* File Uploader Container */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">1. Select Resume Document</h3>
              
              {error && (
                <div className="mb-4 flex items-center space-x-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-200/50 dark:border-rose-900/30">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="hidden"
              />

              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileInput}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                    dragOver
                      ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-lg'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-950'
                  }`}
                >
                  <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    Drag and drop your resume here
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                    or click to browse local files (PDF only, max 5MB)
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 pr-4">
                    <div className="p-3 bg-red-100 dark:bg-red-950/30 rounded-xl text-red-600 dark:text-red-400 shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate block">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Quick benefits badge */}
            <div className="p-5 border border-primary/20 bg-primary/5 rounded-2xl flex space-x-3 text-xs text-slate-600 dark:text-slate-300">
              <Sparkles className="w-5 h-5 text-primary shrink-0 animate-pulse" />
              <span>
                <strong>Why match with JD?</strong> Providing a job description lets AI identify missing tech stack keywords and calculate your tailored match percentage.
              </span>
            </div>
          </div>

          {/* Job Details Form Container */}
          <div className="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
              <span>2. Match with Job Description (Optional)</span>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Recommended</span>
            </h3>

            <div className="space-y-4">
              {/* Company name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Company Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Landmark className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Google, Stripe"
                    {...register('companyName')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(37,99,235,0.15)] transition-all text-sm"
                  />
                </div>
              </div>

              {/* Job Description Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Job Description Text
                </label>
                <textarea
                  rows={6}
                  placeholder="Paste the key responsibilities, requirements, and tech stacks required for this role..."
                  {...register('jobDescription')}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(37,99,235,0.15)] transition-all text-sm resize-none"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3.5 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Analyze Resume</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};
