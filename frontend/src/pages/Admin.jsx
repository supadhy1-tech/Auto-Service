import { useEffect, useState } from "react";
import "./Admin.css";

export default function Admin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE ;
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        // Sort by date & time
        data.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA - dateB;
        });

        setItems(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Update status
 async function updateStatus(id, newStatus) {
  try {
    const res = await fetch(`${API_BASE}/api/bookings/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    const updated = await res.json();

    if (newStatus === "cancelled") {
      // Remove from state
      setItems(prev => prev.filter(b => b._id !== id));
    } else {
      // Update status in state
      setItems(prev =>
        prev.map(b => (b._id === id ? updated : b))
      );
    }
  } catch (err) {
    console.error(err);
  }
}


  function StatusBadge({ status }) {
    return (
      <span className={`badge ${status}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Dashboard</h1>
     

      {loading ? (
        <p className="loading">Loading appointments...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((b) => (
              <tr key={b._id}>
                <td>{b.name}</td>
                <td>{b.service}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td>{b.email}</td>
                <td>{b.phone}</td>

                <td>
                  <StatusBadge status={b.status} />
                </td>

                <td className="actions">
                  {b.status === "pending" && (
                    <>
                      <button
                        className="btn confirm"
                        onClick={() => updateStatus(b._id, "confirmed")}
                      >
                        Confirm
                      </button>
                      <button
                        className="btn cancel"
                        onClick={() => updateStatus(b._id, "cancelled")}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {b.status === "confirmed" && (
                    <>
                      <button
                        className="btn complete"
                        onClick={() => updateStatus(b._id, "completed")}
                      >
                        Complete
                      </button>
                      <button
                        className="btn cancel"
                        onClick={() => updateStatus(b._id, "cancelled")}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {b.status === "completed" && (
                    <span className="done">✔ Done</span>
                  )}

                  {b.status === "cancelled" && (
                    <span className="cancelled">✖ Cancelled</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
