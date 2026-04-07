import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--background)' }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-16"
        style={{ background: 'var(--surface-container-low)' }}
      >
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--on-surface)' }}>The Ledger</h1>
          <p className="text-label-md mt-1" style={{ color: 'var(--secondary)' }}>PREMIUM WEALTH MANAGEMENT</p>
        </div>
        <div>
          <p className="font-display text-display-md leading-tight" style={{ color: 'var(--on-surface)' }}>
            Your financial<br />narrative,<br />
            <span style={{ color: 'var(--primary)' }}>precisely told.</span>
          </p>
          <p className="mt-6 text-sm leading-relaxed max-w-xs" style={{ color: 'var(--secondary)' }}>
            The Architectural Ledger transforms raw financial data into a narrative of growth.
            Authoritative. Airy. Impeccably organized.
          </p>
        </div>
        <div className="flex gap-4">
          {['$142k', '12.4%', '3 Goals'].map((stat, i) => (
            <div key={i} className="card-surface px-4 py-3 text-center">
              <p className="font-display font-bold text-lg" style={{ color: 'var(--primary)' }}>{stat}</p>
              <p className="text-label-md mt-0.5" style={{ color: 'var(--secondary)', fontSize: '0.6rem' }}>
                {['LIQUIDITY', 'MONTHLY GROWTH', 'ACTIVE'][i]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm animate-fade-in-up">
          <div className="mb-10">
            <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--on-surface)' }}>
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--secondary)' }}>
              {isLogin ? 'Sign in to your private ledger' : 'Begin your wealth journey'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-label-md block mb-1.5" style={{ color: 'var(--on-surface-variant)' }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'var(--surface-container-low)',
                    color: 'var(--on-surface)',
                    border: '2px solid transparent',
                  }}
                  placeholder="Alex Sterling"
                  required={!isLogin}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(0,64,161,0.4)'}
                  onBlur={(e) => e.target.style.borderColor = 'transparent'}
                />
              </div>
            )}
            <div>
              <label className="text-label-md block mb-1.5" style={{ color: 'var(--on-surface-variant)' }}>
                EMAIL
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--surface-container-low)',
                  color: 'var(--on-surface)',
                  border: '2px solid transparent',
                }}
                placeholder="alex@theledger.com"
                required
                onFocus={(e) => e.target.style.borderColor = 'rgba(0,64,161,0.4)'}
                onBlur={(e) => e.target.style.borderColor = 'transparent'}
              />
            </div>
            <div>
              <label className="text-label-md block mb-1.5" style={{ color: 'var(--on-surface-variant)' }}>
                PASSWORD
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--surface-container-low)',
                  color: 'var(--on-surface)',
                  border: '2px solid transparent',
                }}
                placeholder="••••••••"
                required
                onFocus={(e) => e.target.style.borderColor = 'rgba(0,64,161,0.4)'}
                onBlur={(e) => e.target.style.borderColor = 'transparent'}
              />
            </div>

            {error && (
              <p className="text-sm px-4 py-3 rounded-xl" style={{ background: 'rgba(186,26,26,0.08)', color: 'var(--error)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold font-display gradient-primary transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 mt-2"
            >
              {loading ? 'Processing...' : isLogin ? 'Access Ledger' : 'Create Account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm" style={{ color: 'var(--secondary)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="font-semibold transition-colors"
              style={{ color: 'var(--primary)' }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {isLogin && (
            <p className="mt-4 text-center text-xs" style={{ color: 'var(--outline-variant)' }}>
              Demo: alex@theledger.com / password123
            </p>
          )}
        </div>
      </div>
    </div>
  );
}