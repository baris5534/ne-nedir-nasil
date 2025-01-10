import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Eğer zaten giriş yapılmışsa admin paneline yönlendir
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    if (isAuthenticated) {
      navigate('/adminbeyegidelim');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

      if (password === correctPassword) {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        
        // Eğer başka bir sayfadan yönlendirme varsa oraya git
        const from = location.state?.from || '/adminbeyegidelim';
        navigate(from);
      } else {
        setError('Geçersiz şifre');
        // Yanlış şifre denemelerinde kısa bir bekleme süresi
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      setError('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <form onSubmit={handleSubmit} className="bg-gray-800/50 p-8 rounded-xl shadow-xl border border-blue-500/20">
          <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Admin Girişi
          </h2>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-400/80 mb-1">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-blue-500/20 rounded-lg 
                         focus:outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/20
                         text-blue-100 placeholder-blue-400/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg transition-all duration-300 relative group
                ${loading 
                  ? 'bg-blue-500/50 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/30 to-blue-400/0 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
} 