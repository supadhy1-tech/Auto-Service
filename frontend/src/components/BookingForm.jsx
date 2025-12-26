import { useState, useEffect } from 'react';

const SERVICE_OPTIONS = [
  'Oil Change',
  'Brake Service',
  'Tire Rotation',
  'Battery Replacement',
  'Engine Diagnostics'
];

export default function BookingForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    service: SERVICE_OPTIONS[0], date: '', time: '', notes: ''
  });
  const [status, setStatus] = useState({ loading:false, success:null, error:null });
  const [availableTimes, setAvailableTimes] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE;

  // --- Handle form updates ---
  function update(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  // --- Utility: Get today's date (YYYY-MM-DD) to block past dates ---
  function getToday() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  // --- Fetch available times when date changes ---
  useEffect(() => {
    async function fetchTimes() {
      if (!form.date) return;
      try {
        const res = await fetch(`${API_BASE}/api/bookings/available-times?date=${form.date}`);
        if (!res.ok) throw new Error("Failed to load times");
        const data = await res.json();
        setAvailableTimes(data);  // expected: ["09:00","09:30",...]
      } catch (err) {
        console.error(err);
        setAvailableTimes([]);
      }
    }
    fetchTimes();
  }, [form.date]);

  // --- Submit booking ---
  async function submit(e) {
    e.preventDefault();
    setStatus({ loading:true, success:null, error:null });
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to submit');
      await res.json();
      setStatus({
        loading:false,
        success:'Request received! Check your email for confirmation.',
        error:null
      });
      setForm({ name:'', email:'', phone:'', service:SERVICE_OPTIONS[0], date:'', time:'', notes:'' });
      setAvailableTimes([]);
    } catch (err) {
      setStatus({ loading:false, success:null, error:'Something went wrong. Please try again.' });
    }
  }

  // --- Format "09:30" -> "9:30 AM" ---
  function formatTime(value) {
    let [hours, minutes] = value.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    const displayMin = minutes.toString().padStart(2, "0");
    return `${displayHour}:${displayMin} ${ampm}`;
  }

  return (
    <form onSubmit={submit}>
      <h1>Book an Appointment</h1>
      <p>Choose your service and preferred date/time. We’ll confirm shortly.</p>

      <input
        name="name"
        placeholder="Full name"
        value={form.name}
        onChange={update}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={update}
        required
      />
      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={update}
        required
      />

      <label>Service</label>
      <select name="service" value={form.service} onChange={update}>
        {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <div>
          <label>Date</label>
          <input
            name="date"
            type="date"
            min={getToday()}     // 🔒 disables past dates
            value={form.date}
            onChange={update}
            required
          />
        </div>

        <div>
          <label htmlFor="time">Time</label>
          <select
            id="time"
            name="time"
            value={form.time}
            onChange={update}
            required
            disabled={!form.date || availableTimes.length === 0}
          >
            <option value="">-- Select Time --</option>
            {availableTimes.map(time => (
              <option key={time} value={time}>{formatTime(time)}</option>
            ))}
          </select>

        </div>
      </div>

      <textarea
        name="notes"
        placeholder=" Please describe what things need to be done!!! "
        rows={4}
        value={form.notes}
        onChange={update}
        required
      />

      <button className="primary" disabled={status.loading}>
        {status.loading ? 'Submitting...' : 'Book Appointment'}
      </button>

      {status.success && (
        <div className="card" style={{borderColor:'#bbf7d0', background:'#f0fdf4'}}>
          {status.success}
        </div>
      )}
      {status.error && (
        <div className="card" style={{borderColor:'#fecaca', background:'#fef2f2'}}>
          {status.error}
        </div>
      )}
    </form>
  );
}
