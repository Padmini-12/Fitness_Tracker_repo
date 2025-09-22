// src/api/workoutApi.js
import axios from "axios";

const API_BASE_URL  = "http://localhost:8081/api";
;

export const addWorkout = async (workout) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/workouts`, workout);
    return response.data;
  } catch (error) {
    console.error("Error adding workout:", error);
    throw error;
  }
};

export const getWorkouts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/workouts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching workouts:", error);
    throw error;
  }
};
