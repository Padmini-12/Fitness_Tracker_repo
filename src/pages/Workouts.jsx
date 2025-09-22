import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Workouts.css";

function Workouts() {
  const { user } = useAuth(); 
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    duration: "",
    steps: "",
    date: "",
    notes: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:8081/api/users/workouts?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => setWorkouts(data))
      .catch((err) => console.error(err));
  }, [user]);

  const handleChange = (e) => {
    setNewWorkout({ ...newWorkout, [e.target.name]: e.target.value });
  };

  const handleAddWorkout = async () => {
    if (!newWorkout.name || !newWorkout.duration || !newWorkout.date) {
      setError("Name, Duration, and Date are required");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8081/api/users/workouts?userId=${user.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newWorkout,
            duration: parseInt(newWorkout.duration),
            steps: parseInt(newWorkout.steps) || 0,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setWorkouts([...workouts, data]);
        setNewWorkout({ name: "", duration: "", steps: "", date: "", notes: "" });
        setError("");
      } else {
        const msg = await res.text();
        setError(msg);
      }
    } catch (err) {
      setError("Error adding workout");
      console.error(err);
    }
  };

  const handleDeleteWorkout = async (id) => {
    try {
      const res = await fetch(`http://localhost:8081/api/users/workouts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setWorkouts(workouts.filter((w) => w.id !== id));
      } else {
        const msg = await res.text();
        setError(msg);
      }
    } catch (err) {
      setError("Error deleting workout");
      console.error(err);
    }
  };

  return (
    <div className="workouts-container">
      <h2 className="title">My Workouts</h2>
      {error && <p className="error">{error}</p>}

      <div className="form-card">
        <input
          type="text"
          placeholder="Workout Name"
          name="name"
          value={newWorkout.name}
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          name="duration"
          value={newWorkout.duration}
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Steps (optional)"
          name="steps"
          value={newWorkout.steps}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={newWorkout.date}
          onChange={handleChange}
        />
        <textarea
          placeholder="Notes"
          name="notes"
          value={newWorkout.notes}
          onChange={handleChange}
        />
        <button onClick={handleAddWorkout}>Add Workout</button>
      </div>

      <div className="list-container">
        {workouts.length === 0 ? (
          <p>No workouts added yet.</p>
        ) : (
          workouts.map((w) => (
            <div key={w.id} className="workout-card">
              <h3>{w.name}</h3>
              <p><strong>Duration:</strong> {w.duration} min</p>
              <p><strong>Steps:</strong> {w.steps}</p>
              <p><strong>Date:</strong> {w.date}</p>
              {w.notes && <p><strong>Notes:</strong> {w.notes}</p>}
              <button className="delete-btn" onClick={() => handleDeleteWorkout(w.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Workouts;
