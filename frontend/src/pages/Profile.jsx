import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  User, Mail, Lock, ShieldAlert, CheckCircle, 
  AlertCircle, Sparkles, ArrowLeft, Camera, RefreshCw 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState(user?.name || 'seed');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    
    // Prepare payload, omitting empty fields
    const payload = {};
    if (data.name) payload.name = data.name;
    if (data.email) payload.email = data.email;
    if (data.password) payload.password = data.password;
    
    // If seed was refreshed, pass new avatar URL
    if (avatarSeed !== user?.name) {
      payload.profile_pic = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;
    }

    try {
      await updateProfile(payload);
      setSuccess(true);
      reset({ name: data.name, email: data.email, password: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile settings.');
    } finally {
      setLoading(false);
    }
  };

  const rollAvatar = () => {
    // Generate random seed for avatar simulation
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const avatarUrl = avatarSeed === user?.name && user?.profile_pic
    ? user.profile_pic
    : `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Header Block */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <User className="w-3.5 h-3.5" />
            <span>Profile Settings</span>
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Manage Profile
          </h1>
          <p className="mt-2 text-slate-550 dark:text-slate-400">
            Customize your personal identity, login credentials, and portfolio details.
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
          {/* Card left: Summary Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium text-center relative overflow-hidden">
              {/* Badge for role */}
              <div className="absolute top-4 right-4">
                {user?.is_admin ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-250 dark:border-rose-900/30 text-[10px] font-bold uppercase tracking-wider">
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-450 border border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider">
                    Candidate
                  </span>
                )}
              </div>

              {/* Avatar Wrapper */}
              <div className="relative w-28 h-28 mx-auto mt-4 group">
                <img
                  src={avatarUrl}
                  alt={user?.name || 'Profile'}
                  className="w-full h-full rounded-full object-cover bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-md"
                />
                <button
                  type="button"
                  onClick={rollAvatar}
                  className="absolute bottom-1 right-1 p-2 rounded-full bg-primary hover:bg-primary-dark text-white shadow hover:scale-105 transition-all cursor-pointer"
                  title="Generate New Avatar"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-6 space-y-1">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-tight">{user?.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-850 text-left text-xs text-slate-400 space-y-2.5">
                <div className="flex justify-between">
                  <span>Joined Date:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Account State:</span>
                  <span className="font-bold text-emerald-500">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form edit details */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-premium">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-6">Security & Contact Settings</h3>

            {success && (
              <div className="mb-6 flex items-center space-x-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-200/50 dark:border-emerald-900/30">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>Profile details updated successfully!</span>
              </div>
            )}

            {error && (
              <div className="mb-6 flex items-center space-x-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-sm font-medium border border-rose-200/50 dark:border-rose-900/30">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full name input */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Update Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-450 outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(37,99,235,0.15)] transition-all text-xs font-medium"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-[10px] text-rose-500 font-semibold">{errors.name.message}</p>
                )}
              </div>

              {/* Email input */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Update Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-450 outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(37,99,235,0.15)] transition-all text-xs font-medium"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[10px] text-rose-500 font-semibold">{errors.email.message}</p>
                )}
              </div>

              {/* Password input */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Change Password (Optional)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    {...register('password', {
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters long',
                      },
                    })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(37,99,235,0.15)] transition-all text-xs font-medium"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-[10px] text-rose-500 font-semibold">{errors.password.message}</p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold shadow-md transition-all text-xs cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving changes...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
