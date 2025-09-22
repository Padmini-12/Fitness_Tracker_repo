import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [editingGoal, setEditingGoal] = useState(null);

  // ✅ Fetch goals
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:8081/api/goals?userId=${user.id}`)
        .then((res) => res.json())
        .then(setGoals)
        .catch((err) => console.error("Error fetching goals:", err));
    }
  }, [user]);

  // ✅ Add or Update Goal
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newGoal = { title, notes, targetDate };

    const url = editingGoal
      ? `http://localhost:8081/api/goals/${editingGoal.id}`
      : `http://localhost:8081/api/goals?userId=${user.id}`;

    const method = editingGoal ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGoal),
    });

    if (res.ok) {
      const saved = await res.json();
      if (editingGoal) {
        setGoals(goals.map((g) => (g.id === saved.id ? saved : g)));
        setEditingGoal(null);
      } else {
        setGoals([...goals, saved]);
      }
      setTitle("");
      setNotes("");
      setTargetDate("");
    }
  };

  // ✅ Delete Goal
  const handleDelete = async (id) => {
    await fetch(`http://localhost:8081/api/goals/${id}`, { method: "DELETE" });
    setGoals(goals.filter((g) => g.id !== id));
  };

  // ✅ Edit Goal
  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setTitle(goal.title);
    setNotes(goal.notes);
    setTargetDate(goal.targetDate);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Goals</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Goal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          required
        />
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
        <button type="submit">{editingGoal ? "Update Goal" : "Add Goal"}</button>
      </form>

      <ul>
        {goals.map((goal) => (
          <li key={goal.id}>
            <strong>{goal.title}</strong> ({goal.targetDate})
            <p>{goal.notes}</p>
            <button onClick={() => handleEdit(goal)}>Edit</button>
            <button onClick={() => handleDelete(goal.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Goals;
