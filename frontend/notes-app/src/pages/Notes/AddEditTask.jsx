import React, { useState, useEffect } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AddEditTask = ({ taskData, type, getAllTasks, onClose, showToastMessage }) => {
  // Form state
  const [title, setTitle] = useState(taskData?.title || "");
  const [description, setDescription] = useState(taskData?.description || "");
  const [tags, setTags] = useState(taskData?.tags || []);
  const [dueDate, setDueDate] = useState(taskData?.dueDate ? new Date(taskData.dueDate) : null);
  const [priority, setPriority] = useState(taskData?.priority || "medium");
  const [status, setStatus] = useState(taskData?.status || "pending");
  const [category, setCategory] = useState(taskData?.category || "training");
  const [assignedTo, setAssignedTo] = useState(taskData?.assignedTo || []);
  
  // New assignee input
  const [newAssignee, setNewAssignee] = useState("");
  
  // Available players (should be fetched from API)
  const [availablePlayers, setAvailablePlayers] = useState([]);
  
  // Error state
  const [error, setError] = useState(null);
  
  // Fetch available players when component mounts
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axiosInstance.get("/get-all-players");
        if (response.data && response.data.players) {
          setAvailablePlayers(response.data.players);
        }
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    
    fetchPlayers();
  }, []);
  
  // Add a new assignee to the list
  const handleAddAssignee = () => {
    if (newAssignee && !assignedTo.includes(newAssignee)) {
      setAssignedTo([...assignedTo, newAssignee]);
      setNewAssignee("");
    }
  };
  
  // Remove an assignee from the list
  const handleRemoveAssignee = (assignee) => {
    setAssignedTo(assignedTo.filter(a => a !== assignee));
  };

  // Add a new task
  const addNewTask = async () => {
    try {
      const response = await axiosInstance.post("/add-task", {
        title,
        description,
        tags,
        dueDate,
        priority,
        status,
        category,
        assignedTo
      });

      if (response.data && response.data.task) {
        showToastMessage("Task Added Successfully");
        getAllTasks();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  // Edit an existing task
  const editTask = async () => {
    const taskId = taskData._id;

    try {
      const response = await axiosInstance.put(`/edit-task/${taskId}`, {
        title,
        description,
        tags,
        dueDate,
        priority,
        status,
        category,
        assignedTo
      });

      if (response.data && response.data.task) {
        showToastMessage("Task Updated Successfully");
        getAllTasks();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate required fields
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!description) {
      setError("Please enter the description");
      return;
    }

    setError("");

    if (type === "edit") {
      editTask();
    } else {
      addNewTask();
    }
  };

  return (
    <div className="relative">
      {/* Close button */}
      <button 
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50 z-10" 
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <h2 className="text-2xl font-bold text-blue-600 mb-4">
        {type === 'edit' ? 'Edit Task' : 'Add New Task'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title field */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">TITLE</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        {/* Description field */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">DESCRIPTION</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Task description"
            rows={5}
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
        </div>

        {/* Due date picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">DUE DATE</label>
          <DatePicker
            selected={dueDate}
            onChange={date => setDueDate(date)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholderText="Select due date"
            dateFormat="dd/MM/yyyy"
            isClearable
          />
        </div>

        {/* Priority dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PRIORITY</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={priority}
            onChange={({ target }) => setPriority(target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Status dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">STATUS</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={({ target }) => setStatus(target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Category dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CATEGORY</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={({ target }) => setCategory(target.value)}
          >
            <option value="training">Training</option>
            <option value="match">Match</option>
            <option value="administrative">Administrative</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Tags */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">TAGS</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        {/* Assignees */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">ASSIGN TO PLAYERS</label>
          <div className="flex items-center gap-2 mb-2">
            <select
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newAssignee}
              onChange={({ target }) => setNewAssignee(target.value)}
            >
              <option value="">Select a player</option>
              {availablePlayers.map(player => (
                <option key={player._id} value={player.name}>{player.name}</option>
              ))}
            </select>
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={handleAddAssignee}
            >
              Add
            </button>
          </div>
          
          {/* Display assigned players */}
          <div className="flex flex-wrap gap-2 mt-2">
            {assignedTo.map((assignee, index) => (
              <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <span>{assignee}</span>
                <button
                  type="button"
                  className="ml-2 text-blue-600 hover:text-blue-800"
                  onClick={() => handleRemoveAssignee(assignee)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

      {/* Submit button */}
      <button
        className="mt-6 w-full px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
        onClick={handleSubmit}
      >
        {type === 'edit' ? 'UPDATE TASK' : 'CREATE TASK'}
      </button>
    </div>
  );
};

export default AddEditTask;
