import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FileText, BarChart3, ShieldAlert, Trash2, 
  UserMinus, AlertCircle, RefreshCw, Star, Mail, Calendar 
} from 'lucide-react';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/admin/analytics');
      setAnalytics(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve admin analytics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await api.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('WARNING: Deleting this user will purge all their uploaded resumes, history reports, and cover letters. Proceed?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
      // Refresh analytics in background
      fetchAnalytics();
    } catch (err) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldAlert className="w-8 h-8 text-rose-500" />
              <span>Admin Console</span>
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              System monitoring, user analytics, and database records administration.
            </p>
          </div>
          <button
            onClick={() => { fetchAnalytics(); fetchUsers(); }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Analytics stats boxes */}
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-500 dark:text-rose-450 border border-rose-200/50 bg-rose-50/10 rounded-2xl flex items-center justify-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Total Members', val: analytics.total_users, desc: 'Registered accounts', icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
              { title: 'Resumes Scanned', val: analytics.total_resumes, desc: 'PDF file uploads', icon: FileText, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' },
              { title: 'Analysis Runs', val: analytics.total_analyses, desc: 'Total runs generated', icon: BarChart3, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/20' },
              { title: 'Average ATS Score', val: `${Math.round(analytics.average_ats_score)}/100`, desc: 'System-wide average', icon: Star, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' }
            ].map((box, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-premium">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{box.title}</span>
                  <div className={`p-2 rounded-xl ${box.color}`}>
                    <box.icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{box.val}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{box.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Content Section: Users list & Tech Skills */}
        <div className="grid gap-8 mt-10 grid-cols-1 lg:grid-cols-3">
          {/* User management table */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-premium overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-850">
              <h3 className="font-extrabold text-slate-900 dark:text-white">Registered Users</h3>
            </div>

            {usersLoading ? (
              <div className="p-6 space-y-4 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-slate-455">
                No users found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-950/20 text-slate-400 border-b border-slate-100 dark:border-slate-850 uppercase font-bold tracking-wider">
                      <th className="p-4 pl-6">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Created Date</th>
                      <th className="p-4 text-center">Admin?</th>
                      <th className="p-4 pr-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20">
                        <td className="p-4 pl-6 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                          <img src={u.profile_pic} alt={u.name} className="w-6 h-6 rounded-full bg-slate-100 object-cover" />
                          <span>{u.name}</span>
                        </td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                        <td className="p-4 text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="p-4 text-center">
                          {u.is_admin ? (
                            <span className="inline-flex px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 font-bold border border-rose-200/50">Yes</span>
                          ) : (
                            <span className="text-slate-400">No</span>
                          )}
                        </td>
                        <td className="p-4 pr-6 text-center">
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            disabled={u.is_admin}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              u.is_admin
                                ? 'text-slate-300 border-slate-200 cursor-not-allowed dark:text-slate-700 dark:border-slate-800'
                                : 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-slate-200 dark:border-slate-800 hover:border-red-200/50'
                            }`}
                            title={u.is_admin ? "Cannot delete Admin account" : "Delete User"}
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Side: Top Skills Scan */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Detected Tech Skills</h3>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                ))}
              </div>
            ) : analytics?.skill_frequency?.length > 0 ? (
              <div className="space-y-4">
                {analytics.skill_frequency.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.skill}</span>
                      <span className="text-slate-400 font-semibold">{item.count} resumes</span>
                    </div>
                    {/* Tiny progress bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full"
                        style={{ width: `${(item.count / analytics.total_resumes) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-450 italic">No skills data parsed.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
