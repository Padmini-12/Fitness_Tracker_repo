import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

function Progress() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:8081/api/users/workouts?userId=${user.id}`)
        .then(res => setWorkouts(res.data))
        .catch(err => {
          console.error("Workouts fetch error:", err);
          setError("Failed to load workouts");
        });
    }
  }, [user]);

  if (error) return <p>{error}</p>;
  if (!workouts.length) return <p>Loading workouts...</p>;

  // --- Daily Summary ---
  const dailyData = workouts.reduce((acc, w) => {
    const day = new Date(w.date).toLocaleDateString();
    if (!acc[day]) acc[day] = { day, duration: 0, steps: 0 };
    acc[day].duration += w.duration;
    acc[day].steps += w.steps;
    return acc;
  }, {});
  const dailyChartData = Object.values(dailyData);

  // --- Weekly Summary ---
  const weeklyData = workouts.reduce((acc, w) => {
    const date = new Date(w.date);
    const week = `${date.getFullYear()}-W${Math.ceil((date.getDate() + 6 - date.getDay()) / 7)}`;
    if (!acc[week]) acc[week] = { week, duration: 0, steps: 0 };
    acc[week].duration += w.duration;
    acc[week].steps += w.steps;
    return acc;
  }, {});
  const weeklyChartData = Object.values(weeklyData);

  // --- Monthly Summary ---
  const monthlyData = workouts.reduce((acc, w) => {
    const month = new Date(w.date).toLocaleString("default", { month: "short", year: "numeric" });
    if (!acc[month]) acc[month] = { month, duration: 0, steps: 0 };
    acc[month].duration += w.duration;
    acc[month].steps += w.steps;
    return acc;
  }, {});
  const monthlyChartData = Object.values(monthlyData);

  // --- Yearly Summary ---
  const yearlyData = workouts.reduce((acc, w) => {
    const year = new Date(w.date).getFullYear();
    if (!acc[year]) acc[year] = { year, duration: 0, steps: 0 };
    acc[year].duration += w.duration;
    acc[year].steps += w.steps;
    return acc;
  }, {});
  const yearlyChartData = Object.values(yearlyData);

  return (
    <div className="progress-page">
      <h2>Your Progress</h2>

      <h3>Daily Overview</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={dailyChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="duration" fill="#8884d8" name="Duration (min)" />
          <Bar dataKey="steps" fill="#82ca9d" name="Steps" />
        </BarChart>
      </ResponsiveContainer>

      <h3>Weekly Overview</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={weeklyChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="duration" stroke="#8884d8" name="Duration (min)" />
          <Line type="monotone" dataKey="steps" stroke="#82ca9d" name="Steps" />
        </LineChart>
      </ResponsiveContainer>

      <h3>Monthly Overview</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={monthlyChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="duration" stroke="#8884d8" name="Duration (min)" />
          <Line type="monotone" dataKey="steps" stroke="#82ca9d" name="Steps" />
        </LineChart>
      </ResponsiveContainer>

      <h3>Yearly Overview</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={yearlyChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="duration" stroke="#8884d8" name="Duration (min)" />
          <Line type="monotone" dataKey="steps" stroke="#82ca9d" name="Steps" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Progress;
