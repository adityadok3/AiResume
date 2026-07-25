import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, Sparkles, CheckCircle2, XCircle, AlertTriangle, 
  ArrowLeft, Download, RefreshCw, FileSignature, Trash2,
  FileBadge, LayoutGrid, Type, BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const AnalysisResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('audit');

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/analysis/${id}`);
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load analysis details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this analysis report?')) return;
    try {
      await api.delete(`/history/${id}`);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Failed to delete analysis.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 animate-pulse">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">Loading analysis reports...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <XCircle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Failed to load report</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">{error || 'Report could not be retrieved.'}</p>
          <Link to="/dashboard" className="mt-6 inline-flex px-5 py-2.5 bg-primary text-white rounded-xl font-semibold shadow-md">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { feedback, ats_score, company_name, job_description, filename, created_at, cover_letter, resume_id } = data;
  const score = ats_score || 0;

  // Compute colors based on ATS score
  const getProgressColor = () => {
    if (score >= 80) return 'stroke-emerald-500 text-emerald-500';
    if (score >= 60) return 'stroke-amber-500 text-amber-500';
    return 'stroke-rose-500 text-rose-500';
  };

  const getScoreBadgeColor = () => {
    if (score >= 80) return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/50';
    if (score >= 60) return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200/50';
    return 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-200/50';
  };

  // Safe helper arrays from feedback
  const strengths = feedback?.strength ? [feedback.strength] : [];
  const weaknesses = feedback?.weaknesses || [];
  const matchKeywords = feedback?.matching_keywords || [];
  const missKeywords = feedback?.missing_keywords || [];
  const formatting = feedback?.formatting_suggestions || [];
  const grammar = feedback?.grammar_suggestions || [];
  const suggestions = feedback?.suggestions || {};
  const skills = feedback?.skills || [];
  const skillGap = feedback?.skill_gap || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200 print:bg-white print:text-black">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full print:py-0 print:px-0">
        {/* Back Link and Quick Controls */}
        <div className="flex items-center justify-between print:hidden">
          <Link to="/dashboard" className="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-sm transition-all"
              title="Print / Save Report"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2.5 rounded-xl border border-rose-200/55 dark:border-rose-950 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-sm transition-all"
              title="Delete Report"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Score & Header Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 mt-6 shadow-premium relative overflow-hidden flex flex-col md:flex-row items-center gap-8 print:border-none print:shadow-none">
          {/* Background overlay sparkles */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent blur-2xl pointer-events-none"></div>

          {/* SVG Circular score */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle cx="72" cy="72" r="64" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="8" fill="transparent" />
              <circle
                cx="72"
                cy="72"
                r="64"
                stroke="currentColor"
                className={getProgressColor()}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="402"
                strokeDashoffset={402 - (402 * score) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white leading-none">{score}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-1">ATS Score</span>
            </div>
          </div>

          {/* Summary Text Details */}
          <div className="flex-grow space-y-4 text-center md:text-left min-w-0">
            <div className="space-y-1">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getScoreBadgeColor()}`}>
                {score >= 80 ? 'Excellent Match' : score >= 60 ? 'Needs Tweaks' : 'Critical Improvements Required'}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white truncate block">
                {filename || 'Resume Report'}
              </h2>
            </div>
            
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 text-xs text-slate-500 dark:text-slate-400">
              <div>
                <p className="font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Analysis Date</p>
                <p className="mt-1 font-bold text-slate-700 dark:text-slate-200">{new Date(created_at).toLocaleDateString()}</p>
              </div>
              {company_name && (
                <div>
                  <p className="font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Target Company</p>
                  <p className="mt-1 font-bold text-slate-700 dark:text-slate-200 truncate">{company_name}</p>
                </div>
              )}
              <div className="col-span-2 sm:col-span-1">
                <p className="font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Skills Scanned</p>
                <p className="mt-1 font-bold text-slate-700 dark:text-slate-200">{skills.length} skills</p>
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="shrink-0 w-full md:w-auto flex flex-col gap-2 print:hidden">
            <Link
              to={cover_letter ? "/cover-letter" : `/cover-letter?resume_id=${resume_id}&company=${company_name || ''}`}
              className="flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold shadow-md transition-all text-sm cursor-pointer"
            >
              <FileSignature className="w-4 h-4" />
              <span>{cover_letter ? 'View Cover Letter' : 'Draft Cover Letter'}</span>
            </Link>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mt-10 print:hidden overflow-x-auto whitespace-nowrap scrollbar-none">
          {[
            { id: 'audit', label: 'Resume Audit', icon: FileBadge },
            { id: 'keywords', label: 'Keyword Matching', icon: LayoutGrid },
            { id: 'suggestions', label: 'AI Improvement Suggestions', icon: Sparkles }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-semibold text-sm transition-all focus:outline-none cursor-pointer ${
                activeTab === tab.id
                  ? 'border-primary text-primary dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="mt-8">
          {/* TAB 1: Audit */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              {/* Strength and Weakness */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span>Resume Strengths</span>
                  </h3>
                  {strengths.length > 0 ? (
                    <ul className="space-y-3">
                      {strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 shrink-0"></span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">No specific strengths highlighted.</p>
                  )}
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-rose-500" />
                    <span>Areas of Weakness</span>
                  </h3>
                  {weaknesses.length > 0 ? (
                    <ul className="space-y-3">
                      {weaknesses.map((weak, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-2 shrink-0"></span>
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">No specific weaknesses detected.</p>
                  )}
                </div>
              </div>

              {/* Formatting & Grammar suggestions */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
                    <Type className="w-5 h-5 text-purple-500" />
                    <span>Formatting Suggestions</span>
                  </h3>
                  {formatting.length > 0 ? (
                    <ul className="space-y-3">
                      {formatting.map((fmt, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 shrink-0"></span>
                          <span>{fmt}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">Formatting layout is clean.</p>
                  )}
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-cyan-500" />
                    <span>Grammar suggestions</span>
                  </h3>
                  {grammar.length > 0 ? (
                    <ul className="space-y-3">
                      {grammar.map((gram, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2 shrink-0"></span>
                          <span>{gram}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">No grammar errors detected.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Keywords */}
          {activeTab === 'keywords' && (
            <div className="space-y-6">
              {!job_description ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 shadow-premium text-center">
                  <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Job Description Provided</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    To access deep keyword match ratios and identify specific skill gaps, re-run analysis with a target job description pasted.
                  </p>
                  <Link to="/upload" className="mt-5 inline-flex px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold transition-all">
                    Re-run with Job Description
                  </Link>
                </div>
              ) : (
                <>
                  {/* Matching and Missing keywords */}
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span>Matching Keywords ({matchKeywords.length})</span>
                      </h3>
                      {matchKeywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {matchKeywords.map((kw, idx) => (
                            <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900/30 text-xs font-semibold">
                              {kw}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400 dark:text-slate-500 italic">No matching keywords found.</p>
                      )}
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
                        <XCircle className="w-5 h-5 text-rose-500" />
                        <span>Missing Keywords ({missKeywords.length})</span>
                      </h3>
                      {missKeywords.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {missKeywords.map((kw, idx) => (
                            <span key={idx} className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-250 dark:border-rose-900/30 text-xs font-semibold">
                              {kw}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-slate-450 dark:text-slate-500 italic">Excellent! No key terms are missing.</p>
                      )}
                    </div>
                  </div>

                  {/* Skill Gap card */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Skill Gap Diagnosis</h3>
                    <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mb-4">
                      Based on the comparison between your resume and the target role description, these represent the primary skill domains/technologies you lack.
                    </p>
                    {skillGap.length > 0 ? (
                      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        {skillGap.map((gap, idx) => (
                          <div key={idx} className="p-4 border border-rose-200/50 dark:border-rose-900/20 bg-rose-50/10 dark:bg-rose-950/10 rounded-2xl flex items-center space-x-2.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{gap}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-450 dark:text-slate-500 italic">No significant skill gaps found.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: Suggestions */}
          {activeTab === 'suggestions' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/15 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl flex space-x-3 text-xs text-slate-700 dark:text-slate-300 mb-6">
                <Sparkles className="w-5 h-5 text-primary shrink-0 animate-pulse" />
                <span>
                  <strong>AI Generated Recommendations:</strong> Read our generative summaries, project updates, and layout optimization hints tailored specifically to bypass recruiter screening.
                </span>
              </div>

              {/* Summary rewrite */}
              {suggestions.summary && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Tailored Professional Summary</h3>
                  <p className="text-xs text-slate-500 mb-4">Draft a strong top-fold description mapping matching keywords.</p>
                  <blockquote className="p-4 border-l-4 border-primary bg-slate-50 dark:bg-slate-950 rounded-r-2xl font-medium text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    "{suggestions.summary}"
                  </blockquote>
                </div>
              )}

              {/* Suggestions grid for experience and projects */}
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {suggestions.experience && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Optimized Experience Bullet Points</h3>
                    <p className="text-xs text-slate-500 mb-4">Adding action verbs and metrics-driven statements.</p>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl text-sm text-slate-700 dark:text-slate-350 leading-relaxed font-medium whitespace-pre-line">
                      {suggestions.experience}
                    </div>
                  </div>
                )}

                {suggestions.projects && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Optimized Project Descriptions</h3>
                    <p className="text-xs text-slate-500 mb-4">Map tools used to outcomes clearly.</p>
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl text-sm text-slate-700 dark:text-slate-350 leading-relaxed font-medium whitespace-pre-line">
                      {suggestions.projects}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
