import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Book from './pages/Book.jsx';
import Admin from './pages/Admin.jsx';
import Login from './pages/Login.jsx';
import Navbar from './components/Navbar.jsx';

export default function App() {
  // Track login state
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('token'));

  return (
    <div>
      <header>
        <div style={{ fontWeight: 700 }}>Saginaw Auto Specialist</div>
        <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/book" element={<Book />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />
        </Routes>
      </main>

      <footer>
        <div>
          © Shivashish Upadhyay {new Date().getFullYear()} Saginaw Auto Specialist • 3691 Fashion Square Blvd suite 6 • (989) 270-3447
        </div>
      </footer>
    </div>
  );
}
