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
      {tasks.map((task) => {
  console.log("Rendering task:", task);
  return (
    <li key={task.id}>
      {task.title} <button onClick={() => deleteTask(task.id)}>❌</button>
    </li>
  );
})}

      </ul>

    </div>
  );
}

export default App;
