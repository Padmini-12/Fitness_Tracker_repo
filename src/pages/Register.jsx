import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Register.css"; // ✅ custom CSS

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Name, Email and Password are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, age, weight, goal }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Registration successful:", data);

        login(data);
        navigate("/dashboard");
      } else {
        const msg = await res.text();
        setError(msg);
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
          <input type="number" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)} />
          <input type="text" placeholder="Fitness Goal" value={goal} onChange={e => setGoal(e.target.value)} />

          <button type="submit">Register</button>
          {error && <p className="error-text">{error}</p>}
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
