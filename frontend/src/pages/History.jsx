import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Trash2, ArrowRight, Eye, Calendar, 
  Search, Landmark, AlertCircle, Sparkles, Download
} from 'lucide-react';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      setError(err.message || 'Failed to fetch history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this analysis report?')) return;
    try {
      await api.delete(`/history/${id}`);
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete report.');
    }
  };

  const filteredHistory = history.filter(item => {
    const filename = item.resume?.filename.toLowerCase() || '';
    const company = item.company_name?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return filename.includes(query) || company.includes(query);
  });

  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-55 dark:bg-emerald-950/20 border-emerald-200/50';
    if (score >= 60) return 'text-amber-600 bg-amber-55 dark:bg-amber-950/20 border-amber-200/50';
    return 'text-rose-600 bg-rose-55 dark:bg-rose-950/20 border-rose-200/50';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Analysis History</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Access previous resume scores, missing keyword audits, and cover letters.
            </p>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold shadow-md transition-all text-sm cursor-pointer"
          >
            <span>Scan New Resume</span>
          </Link>
        </div>

        {/* Filter input bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-premium flex items-center mb-6">
          <Search className="w-5 h-5 text-slate-450 shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Search by filename or target company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white placeholder-slate-450"
          />
        </div>

        {/* Lists Past Scans */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-premium overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center text-rose-500 flex items-center justify-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-16 text-center text-slate-455">
              <FileText className="w-14 h-14 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
              <p className="font-extrabold text-slate-700 dark:text-slate-350">No reports found</p>
              <p className="text-xs text-slate-450 mt-1">
                {searchQuery ? 'Adjust your query criteria and try again.' : 'Upload a PDF and run calculations.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-850">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 hover:bg-slate-50/50 dark:hover:bg-slate-850/10 transition-colors gap-4"
                >
                  <div className="min-w-0 flex-grow">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-bold text-slate-950 dark:text-white truncate block">
                        {item.resume?.filename || 'Resume_Upload.pdf'}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-450">
                      <span className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(item.created_at).toLocaleString()}</span>
                      </span>
                      {item.company_name && (
                        <span className="flex items-center space-x-1.5">
                          <Landmark className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{item.company_name}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getScoreBadgeColor(item.ats_score)}`}>
                      {item.ats_score} ATS
                    </span>

                    <Link
                      to={`/analysis/${item.id}`}
                      className="p-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-xl transition-colors shadow-sm"
                      title="View Report Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 border border-rose-200/50 dark:border-rose-950 bg-rose-50/20 text-rose-550 hover:text-rose-650 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors shadow-sm"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
