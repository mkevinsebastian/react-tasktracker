import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/tasks")
      .then((res) => {
        console.log("Fetched tasks:", res.data);  // ✅ Debug log
        setTasks(res.data);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);
  
  
  

  const addTask = () => {
    const newTask = {
      title: newTaskTitle,
      completed: false,
    };
  
    axios.post("http://localhost:8000/tasks", newTask)
  .then((res) => {
    console.log("Task added:", res.data);
    setTasks([...tasks, res.data]);
    setNewTaskTitle("");
  })
  .catch((err) => {
    console.error("Error adding task:", err.message);
  });
  };
  
  
  const toggleComplete = (task) => {
    axios.patch(`http://localhost:8000/tasks/${task.id}`, {
      completed: !task.completed,
    }).then((res) => {
      setTasks(
        tasks.map((t) => (t.id === task.id ? res.data : t))
      );
    });
  };
  
  const deleteTask = (id) => {
    axios.delete(`http://localhost:8000/tasks/${id}`).then(() => {
      setTasks(tasks.filter((task) => task.id !== id));
    });
  };

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1>Task Tracker</h1>
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        placeholder="Enter a task"
      />
      <button className="btn-add" onClick={addTask}>Add Task</button>
      <ul>
  {[...tasks]
    .sort((a, b) => a.completed - b.completed) // false (0) dulu, true (1) di bawah
    .map((task) => {
      console.log("Rendering task:", task);
      return (
        <li key={task.id} style={{ opacity: task.completed ? 0.6 : 1 }}>
  <input
    type="checkbox"
    checked={task.completed}
    onChange={() => toggleComplete(task)}
    style={{ marginRight: 10 }}
    className="custom-checkbox"
  />
  <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
    {task.title}
  </span>
  <button onClick={() => deleteTask(task.id)} style={{ marginLeft: 10 }}>
    ❌
  </button>
</li>

      );
    })}
</ul>


    </div>
  );
}

export default App;
