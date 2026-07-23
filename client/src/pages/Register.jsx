import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdPerson, MdEmail, MdLock, MdArrowForward } from 'react-icons/md';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', Icon: MdPerson },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', Icon: MdEmail },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters', Icon: MdLock },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#07070f] p-4">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-3xl animated-gradient mx-auto flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-violet-500/40 glow-sm">
              A
            </div>
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-20 blur-md" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Create Account</h1>
          <p className="text-gray-500 mt-2 text-sm">Start tracking your attendance today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="rounded-3xl border border-white/10 p-8 space-y-5 noise"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(32px)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, type, placeholder, Icon }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="space-y-1.5"
              >
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block">{label}</label>
                <div className="relative group">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-violet-400 transition-colors" size={18} />
                  <input
                    type={type}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm text-white placeholder-gray-600 transition-all"
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    required
                  />
                </div>
              </motion.div>
            ))}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 animated-gradient shadow-xl shadow-violet-500/30 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <> Create Account <MdArrowForward size={18} /> </>
              )}
            </motion.button>
          </form>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600">Already have an account?</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <Link to="/login">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl font-semibold text-gray-400 border border-white/10 hover:border-violet-500/50 hover:text-white flex items-center justify-center gap-2 transition-all hover:bg-white/5 cursor-pointer"
            >
              Sign in instead
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
