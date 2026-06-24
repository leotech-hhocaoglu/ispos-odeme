import { type FormEvent, useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/AuthContext';
import { ApiError } from '../types/api';

type AuthForm = {
  username: string;
  password: string;
};

type LocationState = {
  from?: {
    pathname?: string;
  };
};

const initialForm: AuthForm = {
  username: '',
  password: '',
};

export function AuthPage() {
  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = useMemo(() => {
    const state = location.state as LocationState | null;
    return state?.from?.pathname && state.from.pathname !== '/auth'
      ? state.from.pathname
      : '/payment';
  }, [location.state]);

  if (!isLoading && user) {
    return <Navigate to="/payment" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!form.username.trim() || !form.password) {
      setError('Kullanıcı adı ve şifre girin.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login({
        username: form.username.trim(),
        password: form.password,
      });
      navigate(redirectTo, { replace: true });
    } catch (cause) {
      if (cause instanceof ApiError && cause.status === 401) {
        setError('Kullanıcı adı veya şifre hatalı.');
      } else if (cause instanceof ApiError) {
        setError(cause.message);
      } else {
        setError('Kimlik doğrulama servisine ulaşılamıyor.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="screen auth-screen">
      <section className="auth-shell" aria-labelledby="auth-title">
        <div className="brand-block">
          <span className="brand-mark">FH</span>
          <div>
            <p className="eyebrow">FH Yıldız Tekstil</p>
            <h1 id="auth-title">Müşteri Girişi</h1>
          </div>
        </div>

        <form className="form-panel" onSubmit={handleSubmit}>
          <label className="field">
            <span>Kullanıcı adı veya e-posta</span>
            <input
              autoComplete="username"
              name="username"
              value={form.username}
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              placeholder="operator@example.com"
              type="text"
            />
          </label>

          <label className="field">
            <span>Şifre</span>
            <input
              autoComplete="current-password"
              name="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Şifreniz"
              type="password"
            />
          </label>

          {error ? (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          ) : null}

          <button className="primary-button" disabled={isSubmitting || isLoading} type="submit">
            {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş yap'}
          </button>
        </form>
      </section>
    </main>
  );
}
