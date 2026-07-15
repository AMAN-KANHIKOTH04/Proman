'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }

      const user = await res.json();
      localStorage.setItem('proman_user_id', user.id);
      localStorage.setItem('proman_user_name', user.name);
      
      toast.success('Successfully logged in!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.75rem' }}>
          Welcome to Proman
        </h1>
        
        <form onSubmit={handleLogin}>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)' }}>Email</label>
          <input
            type="email"
            required
            className="input-field"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--muted)' }}>Name (for new users)</label>
          <input
            type="text"
            className="input-field"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {error && <span className="error-text">{error}</span>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In / Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
