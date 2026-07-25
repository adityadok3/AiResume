import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Sparkles, FileSignature, Copy, Check, Download, 
  ArrowLeft, FileText, Landmark, AlertCircle, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const CoverLetterGenerator = () => {
  const location = useLocation();
  const [resumes, setResumes] = useState([]);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const { register, handleSubmit, setValue } = useForm();

  // Extract query parameters if any
  useEffect(() => {
    fetchResumes();
    const query = new URLSearchParams(location.search);
    const resumeId = query.get('resume_id');
    const company = query.get('company');
    
    if (resumeId) setValue('resumeId', resumeId);
    if (company) setValue('companyName', company);
  }, [location.search]);

  const fetchResumes = async () => {
    setResumesLoading(true);
    try {
      // Get resumes list from history / analysis
      const history = await api.get('/history');
      // Deduplicate resumes
      const uniqueResumes = [];
      const seen = new Set();
      history.forEach(item => {
        if (item.resume && !seen.has(item.resume.id)) {
          seen.add(item.resume.id);
          uniqueResumes.push(item.resume);
        }
      });
      setResumes(uniqueResumes);
    } catch (err) {
      console.error('Failed to fetch resumes:', err);
    } finally {
      setResumesLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!data.resumeId) {
      setError('Please select a resume to reference.');
      return;
    }
    if (!data.companyName) {
      setError('Please provide a target company name.');
      return;
    }
    if (!data.jobDescription) {
      setError('Please paste the target job description.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/generate-cover-letter', {
        resume_id: parseInt(data.resumeId),
        job_description: data.jobDescription,
        company_name: data.companyName
      });
      setCoverLetter(res.cover_letter);
    } catch (err) {
      setError(err.message || 'Failed to generate cover letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "Cover_Letter.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Back navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
        </div>

        <div className="grid gap-8 grid-cols-1 lg:grid-cols-5">
          {/* Inputs Panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generative AI</span>
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Tailor Cover Letter</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                Construct an engaging application letter pairing resume bullet points with job demands.
              </p>

              {error && (
                <div className="mb-4 flex items-center space-x-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-medium border border-rose-200/50 dark:border-rose-900/30">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Resume Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                    Select Reference Resume
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <FileText className="w-4 h-4" />
                    </span>
                    <select
                      {...register('resumeId')}
                      disabled={resumesLoading}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(37,99,235,0.15)] transition-all text-xs font-semibold appearance-none"
                    >
                      <option value="">-- Choose Resume --</option>
                      {resumes.map((res) => (
                        <option key={res.id} value={res.id}>
                          {res.filename}
                        </option>
                      ))}
                    </select>
                  </div>
                  {resumes.length === 0 && !resumesLoading && (
                    <p className="mt-1 text-[10px] text-slate-400">
                      No resumes found. <Link to="/upload" className="text-primary hover:underline">Upload one first.</Link>
                    </p>
                  )}
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                    Company Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                      <Landmark className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Stripe, Razorpay"
                      {...register('companyName')}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(37,99,235,0.15)] transition-all text-xs"
                    />
                  </div>
                </div>

                {/* Job Description Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                    Job Description Requirements
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Paste target job requirements and key terms..."
                    {...register('jobDescription')}
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(37,99,235,0.15)] transition-all text-xs resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold shadow-md transition-all text-sm cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Writing Cover Letter...</span>
                    </>
                  ) : (
                    <>
                      <FileSignature className="w-4 h-4" />
                      <span>Draft Cover Letter</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Letter Output Panel */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-premium min-h-[450px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-6">
                  <h3 className="font-extrabold text-slate-900 dark:text-white">Generated Letter Preview</h3>
                  {coverLetter && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center space-x-1 text-xs font-semibold border border-slate-200 dark:border-slate-800"
                        title="Copy to Clipboard"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center space-x-1 text-xs font-semibold border border-slate-200 dark:border-slate-800"
                        title="Download .txt File"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  )}
                </div>

                {coverLetter ? (
                  <div className="p-6 border border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl font-serif text-slate-850 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line select-text max-h-[500px] overflow-y-auto">
                    {coverLetter}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-12 text-slate-400 dark:text-slate-500 min-h-[300px]">
                    <FileSignature className="w-16 h-16 text-slate-200 dark:text-slate-800 mb-4 animate-bounce" />
                    <p className="font-semibold text-slate-500 dark:text-slate-400 mb-1">No cover letter drafted yet</p>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      Select reference resume, enter target details and click draft to compile.
                    </p>
                  </div>
                )}
              </div>

              {coverLetter && (
                <div className="mt-6 border-t border-slate-100 dark:border-slate-850 pt-4 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Note: Standard PDF exports can also be achieved by using the browser print layout (Ctrl + P).</span>
                  <span>ResQAI Writer v1.0</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
