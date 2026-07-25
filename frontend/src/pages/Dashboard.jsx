import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, Sparkles, TrendingUp, CheckCircle, Clock, Trash2, 
  ArrowRight, FileSpreadsheet, PlusCircle, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

// Chart.js imports and registration
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, 
  ArcElement, Title, Tooltip, Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export const Dashboard = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/history');
      setHistory(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch resume analysis history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this analysis report?')) return;
    try {
      await api.delete(`/history/${id}`);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete report.');
    }
  };

  // Compute stats
  const totalAnalyzed = history.length;
  const avgScore = totalAnalyzed > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.ats_score, 0) / totalAnalyzed) 
    : 0;
  
  const highScoring = history.filter(item => item.ats_score >= 80).length;
  
  // Prepare chart data
  const barChartData = {
    labels: [...history].reverse().slice(-5).map(item => item.resume?.filename.slice(0, 15) || 'Resume'),
    datasets: [
      {
        label: 'ATS Score',
        data: [...history].reverse().slice(-5).map(item => item.ats_score),
        backgroundColor: 'rgba(37, 99, 235, 0.75)',
        borderColor: 'rgb(37, 99, 235)',
        borderWidth: 1,
        borderRadius: 8,
      }
    ]
  };

  // Collect skills frequency for the current user
  const userSkillsMap = {};
  history.forEach(item => {
    try {
      const feedback = JSON.parse(item.feedback);
      const skills = feedback.skills || [];
      skills.forEach(s => {
        const standard = s.trim().title ? s.trim().title() : s.trim();
        userSkillsMap[standard] = (userSkillsMap[standard] || 0) + 1;
      });
    } catch (e) {}
  });

  const sortedUserSkills = Object.entries(userSkillsMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  
  const doughnutChartData = {
    labels: sortedUserSkills.map(x => x[0]),
    datasets: [
      {
        data: sortedUserSkills.map(x => x[1]),
        backgroundColor: [
          'rgba(37, 99, 235, 0.75)',
          'rgba(124, 58, 237, 0.75)',
          'rgba(6, 182, 212, 0.75)',
          'rgba(245, 158, 11, 0.75)',
          'rgba(16, 185, 129, 0.75)'
        ],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          color: localStorage.getItem('theme') === 'dark' ? '#f3f4f6' : '#1f2937'
        }
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/30';
    if (score >= 60) return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/30';
    return 'text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-900/30';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>Hi, {user?.name || 'Candidate'}</span>
              <span className="text-xl">👋</span>
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Welcome back to your AI Resume Optimization workspace.
            </p>
          </div>
          <div>
            <Link
              to="/upload"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Optimize New Resume</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Total Analyzed', val: totalAnalyzed, desc: 'Resumes uploaded', icon: FileText, color: 'text-blue-500' },
            { title: 'Average ATS Score', val: `${avgScore}/100`, desc: 'Across all uploads', icon: TrendingUp, color: 'text-purple-500' },
            { title: 'High-Scoring Resumes', val: highScoring, desc: 'ATS score >= 80%', icon: CheckCircle, color: 'text-emerald-500' },
            { title: 'Suggested Actions', val: totalAnalyzed > 0 ? 5 : 0, desc: 'Improvement actions', icon: Clock, color: 'text-cyan-500' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-premium relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.title}</span>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{stat.val}</span>
              </div>
              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{stat.desc}</p>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        {totalAnalyzed > 0 && (
          <div className="grid gap-6 mt-10 grid-cols-1 lg:grid-cols-3">
            {/* Bar chart */}
            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-premium lg:col-span-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">ATS Scoring History</h3>
              <div className="h-64">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>

            {/* Doughnut Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-premium">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Top Tech Skills Map</h3>
              <div className="h-64 flex items-center justify-center">
                {sortedUserSkills.length > 0 ? (
                  <Doughnut data={doughnutChartData} options={chartOptions} />
                ) : (
                  <div className="text-center text-slate-400 dark:text-slate-500 text-sm">
                    No skills data parsed yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="grid gap-8 mt-10 grid-cols-1 lg:grid-cols-3">
          {/* History / Recent Uploads Table */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-premium overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Recent Analyses</h3>
              <Link to="/history" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors inline-flex items-center space-x-1">
                <span>View all</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              // Loading Skeleton
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="space-y-2">
                      <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
                      <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800/50 rounded"></div>
                    </div>
                    <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-8 text-center text-rose-500 dark:text-rose-400 flex items-center justify-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            ) : history.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-4" />
                <p className="font-semibold text-base mb-1">No resumes analyzed yet</p>
                <p className="text-sm text-slate-400">Upload your resume PDF and match against a job description to get started.</p>
                <Link to="/upload" className="mt-5 inline-flex px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold text-sm transition-all shadow-sm">
                  Analyze Resume
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-850">
                {history.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    to={`/analysis/${item.id}`}
                    className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-900 dark:text-white truncate block">
                          {item.resume?.filename || 'Resume.pdf'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        {item.company_name && (
                          <>
                            <span>•</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[120px]">
                              {item.company_name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 shrink-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(item.ats_score)}`}>
                        {item.ats_score} ATS
                      </span>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                        title="Delete Analysis"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick AI tips */}
          <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-cyan-500/5 dark:from-primary/20 dark:via-secondary/10 dark:to-cyan-500/5 p-6 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-premium flex flex-col justify-between">
            <div>
              <div className="inline-flex p-2 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary dark:text-blue-400 mb-4">
                <Sparkles className="w-5 h-5 animate-pulse-slow" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">AI Quick Tips</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Applicant Tracking Systems filter candidates by looking for direct keyword matches found in their job descriptions. 
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  'Ensure your resume lists exact skill spellings.',
                  'Always use single-column layouts for ATS scanning.',
                  'Draft a tailored cover letter explaining missing keyword context.',
                  'Include metrics (e.g. percentages) in work bullet points.'
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="w-1.5 h-1.5 bg-primary dark:bg-blue-400 rounded-full mt-1.5 shrink-0"></span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Link
              to="/upload"
              className="mt-6 flex items-center justify-center space-x-2 w-full py-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
            >
              <span>Scan Resume now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
