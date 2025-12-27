import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ isAdmin, setIsAdmin }) {
  const isLicenseSet = !!localStorage.getItem("license");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);  // update React state
    navigate("/");       // redirect without reload
  };

  return (
    <nav style={{ display:"flex", gap:"20px", padding:"10px 20px", background:"#f0f0f0" }}>
      <Link to="/">Home</Link>
      <Link to="/book">Book</Link>

      {!isAdmin && isLicenseSet && <Link to="/login">Login</Link>}

      {isAdmin && (
        <>
          <Link to="/admin">Admin</Link>
          <button 
            onClick={handleLogout}
            style={{
              background:"#ff5858",
              color:"white",
              border:"none",
              padding:"6px 14px",
              borderRadius:"6px",
              cursor:"pointer"
            }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
