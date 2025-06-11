import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', date: '', type: '' });

  const handleAddTask = () => {
    setTasks([...tasks, newTask]);
    setNewTask({ title: '', date: '', type: '' });
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Aufgaben und Termine</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">Neue Aufgabe hinzufügen</h2>
          <input
            type="text"
            placeholder="Titel"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm mb-4"
          />
          <input
            type="date"
            value={newTask.date}
            onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm mb-4"
          />
          <select
            value={newTask.type}
            onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm mb-4"
          >
            <option value="">Typ auswählen</option>
            <option value="Training">Training</option>
            <option value="Spiel">Spiel</option>
            <option value="Event">Event</option>
          </select>
          <button
            onClick={handleAddTask}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Aufgabe hinzufügen
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700">Aufgabenliste</h2>
          <ul className="mt-4">
            {tasks.map((task, index) => (
              <li key={index} className="bg-white shadow-md rounded-md p-4 mb-2">
                <p className="text-gray-800 font-medium">{task.title}</p>
                <p className="text-gray-600">Datum: {task.date}</p>
                <p className="text-gray-600">Typ: {task.type}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Tasks;
