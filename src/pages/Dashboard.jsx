import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // ✅ get logged-in user
import "./Dashboard.css";

function Dashboard() {
  const { user: authUser } = useAuth(); // Logged-in user
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authUser?.id) {
      axios
        .get(`http://localhost:8081/api/users/profile/${authUser.id}`) // ✅ correct backend URL
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("Profile fetch error:", err);
          setError("Failed to load profile.");
        });
    }
  }, [authUser]);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name} to Your Fitness Dashboard 🏋️</h1>
      <p>Track workouts, set goals, and monitor progress easily.</p>

      <div className="user-info">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Weight:</strong> {user.weight}</p>
        <p><strong>Goal:</strong> {user.goal}</p>
      </div>

      <div className="dashboard-cards">
        <Link to="/workouts" className="card">
          <h2>Workouts</h2>
          <p>Log your exercises and track calories burned.</p>
        </Link>

        <Link to="/profile" className="card">
          <h2>Profile</h2>
          <p>View and update your personal details.</p>
        </Link>

        <Link to="/goals" className="card">
          <h2>Goals</h2>
          <p>Set and manage your fitness goals.</p>
        </Link>

        <Link to="/progress" className="card">
          <h2>Progress</h2>
          <p>See charts of your performance over time.</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
