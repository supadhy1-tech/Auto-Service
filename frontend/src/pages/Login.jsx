import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE;

  function update(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('token', data.token);
      navigate('/admin');
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Admin Login</h1>
      <form onSubmit={submit}>
        <input name="username" placeholder="Username" value={form.username} onChange={update} />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={update} />
        <button className="primary">Login</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  )
}
