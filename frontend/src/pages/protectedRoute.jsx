import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAdmin = !!localStorage.getItem("adminToken"); // check if logged in

  if (!isAdmin) {
    // redirect to admin login if not logged in
    return <Navigate to="/admin" replace />;
  }

  return children; // render the protected component
}
