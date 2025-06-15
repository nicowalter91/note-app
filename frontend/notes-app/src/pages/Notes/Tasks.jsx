import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TaskCard from '../../components/Cards/TaskCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import { 
  MdAdd, 
  MdChevronLeft, 
  MdChevronRight, 
  MdFilterList, 
  MdOutlinePushPin,
  MdPriorityHigh,
  MdOutlineCategory,
  MdDateRange,
  MdSearch,
  MdClose
} from 'react-icons/md';
import { 
  FaCheck, 
  FaSpinner, 
  FaBan, 
  FaTimes, 
  FaExclamation, 
  FaTrashAlt,
  FaPen,
  FaFilter,
  FaSort,
  FaSortDown,
  FaSortUp,
  FaListUl,
  FaFutbol,
  FaCalendarCheck,
  FaClipboardList,
  FaWrench,
  FaSearch
} from 'react-icons/fa';
import AddEditTask from './AddEditTask';
import Modal from "react-modal";
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddTaskImg from '../../assets/img/addData.png';
import NoDataImg from '../../assets/img/noData.png';
import Layout from '../../components/Layout/Layout';
import moment from 'moment';

const Tasks = () => {
  // State variables
  const [allTasks, setAllTasks] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [taskStats, setTaskStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tasksPerPage = 9;

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    sortBy: 'dueDate',
    sortOrder: 'asc'
  });
  
  // Show filters panel
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  // Modal state
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  // Toast message state
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: null,
  });

  // Pagination
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = allTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(allTasks.length / tasksPerPage);

  // Navigation functions
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get task statistics
  const getTaskStats = async () => {
    try {
      const response = await axiosInstance.get("/get-task-stats");
      if (response.data && response.data.stats) {
        setTaskStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching task stats:", error);
    }
  };
  // Get all tasks
  const getAllTasks = async () => {
    try {
      setLoading(true);
      // Build query parameters
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.category) params.category = filters.category;
      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
        params.sortOrder = filters.sortOrder;
      }
      
      const response = await axiosInstance.get("/get-all-tasks", { params });
      if (response.data && response.data.tasks) {
        setAllTasks(response.data.tasks);
        setError(null);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Error loading tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle task edit
  const handleEdit = (taskDetails) => {
    setOpenAddEditModal({ isShown: true, data: taskDetails, type: "edit" });
  };
  // Delete a task
  const deleteTask = async (taskData) => {
    try {
      if (window.confirm('Are you sure you want to delete this task?')) {
        setLoading(true);
        const response = await axiosInstance.delete(`/delete-task/${taskData._id}`);
        if (response.data && !response.data.error) {
          showToastMessage("Task deleted successfully", "delete");
          getAllTasks();
          getTaskStats();
        }
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Error deleting task. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  // Search for tasks
  const onSearchTask = async () => {
    if (!searchQuery.trim()) {
      setIsSearch(false);
      getAllTasks();
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get("/search-tasks", {
        params: { 
          query: searchQuery,
          ...filters 
        },
      });
      
      if (response.data && response.data.tasks) {
        setIsSearch(true);
        setAllTasks(response.data.tasks);
      }
    } catch (error) {
      console.error("Error searching tasks:", error);
      setError("Error searching tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update the pinned status of a task
  const updateIsPinned = async (taskData) => {
    const taskId = taskData._id;
    try {
      const response = await axiosInstance.put(
        `/update-task-pinned/${taskId}`,
        { isPinned: !taskData.isPinned }
      );
      
      if (response.data && response.data.task) {
        showToastMessage("Task Updated Successfully");
        getAllTasks();
      }
    } catch (error) {
      console.error("Error updating pinned status:", error);
    }
  };

  // Update the status of a task
  const updateTaskStatus = async (taskData, newStatus) => {
    const taskId = taskData._id;
    try {
      const response = await axiosInstance.put(
        `/update-task-status/${taskId}`,
        { status: newStatus }
      );
      
      if (response.data && response.data.task) {
        showToastMessage(`Task marked as ${newStatus}`);
        getAllTasks();
        getTaskStats();
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Show toast message
  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  // Close toast
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
      type: null,
    });
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearch(false);
    getAllTasks();
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value
    });
  };
  
  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    getAllTasks();
    setShowFilters(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      sortBy: 'dueDate',
      sortOrder: 'asc'
    });
    setCurrentPage(1);
    getAllTasks();
  };
  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'in-progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaExclamation className="text-yellow-500" />;
      case 'in-progress': return <FaSpinner className="text-blue-500" />;
      case 'completed': return <FaCheck className="text-emerald-500" />;
      case 'cancelled': return <FaBan className="text-gray-500" />;
      default: return null;
    }
  };

  // Helper function to get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'medium': return 'bg-green-50 text-green-700 border-green-200';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'urgent': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Helper function to get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'training': return <FaFutbol className="text-blue-500" />;
      case 'match': return <FaCalendarCheck className="text-green-500" />;
      case 'administrative': return <FaClipboardList className="text-purple-500" />;
      default: return <FaWrench className="text-gray-500" />;
    }
  };

  // Initial data loading
  useEffect(() => {
    getUserInfo();
    getAllTasks();
    getTaskStats();
  }, []);
  return (
    <Layout
      userInfo={userInfo}
      onLogout={() => { localStorage.clear(); navigate("/login"); }}
    >
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Task Management</h1>
          <button
            onClick={() => {
              setOpenAddEditModal({ isShown: true, type: "add", data: null });
            }}
            className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <MdAdd /> Add Task
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center">
            <FaExclamation className="mr-2" />
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-gray-700">Loading tasks...</span>
          </div>
        )}        {/* Task Statistics */}
        {taskStats && !loading && (
          <div className="bg-white shadow-sm rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaClipboardList className="mr-2 text-gray-600" />
              Task Overview
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100 transition-transform hover:scale-105">
                <div className="flex items-center gap-2 text-yellow-700 mb-1">
                  <FaExclamation />
                  <span className="font-medium">Pending</span>
                </div>
                <p className="text-2xl font-bold text-yellow-800">
                  {taskStats.byStatus.find(s => s._id === 'pending')?.count || 0}
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 transition-transform hover:scale-105">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <FaSpinner />
                  <span className="font-medium">In Progress</span>
                </div>
                <p className="text-2xl font-bold text-blue-800">
                  {taskStats.byStatus.find(s => s._id === 'in-progress')?.count || 0}
                </p>
              </div>
              
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 transition-transform hover:scale-105">
                <div className="flex items-center gap-2 text-emerald-700 mb-1">
                  <FaCheck />
                  <span className="font-medium">Completed</span>
                </div>
                <p className="text-2xl font-bold text-emerald-800">
                  {taskStats.byStatus.find(s => s._id === 'completed')?.count || 0}
                </p>
              </div>
              
              {taskStats.overdue > 0 && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-100 transition-transform hover:scale-105">
                  <div className="flex items-center gap-2 text-red-700 mb-1">
                    <FaExclamation />
                    <span className="font-medium">Overdue</span>
                  </div>
                  <p className="text-2xl font-bold text-red-800">
                    {taskStats.overdue}
                  </p>
                </div>
              )}
              
              {taskStats.dueToday > 0 && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100 transition-transform hover:scale-105">
                  <div className="flex items-center gap-2 text-orange-700 mb-1">
                    <MdDateRange />
                    <span className="font-medium">Due Today</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-800">
                    {taskStats.dueToday}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}{/* Search and Filter */}
        <div className="bg-white shadow-sm rounded-xl p-4 mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            handleSearch={() => onSearchTask(searchQuery)}
            onClearSearch={handleClearSearch}
            placeholder="Search tasks..."
          />
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2">Filter:</span>
            <button 
              onClick={() => {
                setFilters({...filters, status: ''});
                setCurrentPage(1);
                getAllTasks();
              }}
              className={`px-3 py-1 text-xs rounded-full ${filters.status === '' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
            >
              All
            </button>
            <button 
              onClick={() => {
                setFilters({...filters, status: 'pending'});
                setCurrentPage(1);
                getAllTasks();
              }}
              className={`px-3 py-1 text-xs rounded-full ${filters.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => {
                setFilters({...filters, status: 'in-progress'});
                setCurrentPage(1);
                getAllTasks();
              }}
              className={`px-3 py-1 text-xs rounded-full ${filters.status === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-800 hover:bg-blue-100'}`}
            >
              In Progress
            </button>
            <button 
              onClick={() => {
                setFilters({...filters, status: 'completed'});
                setCurrentPage(1);
                getAllTasks();
              }}
              className={`px-3 py-1 text-xs rounded-full ${filters.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'}`}
            >
              Completed
            </button>
            <button 
              onClick={() => {
                setFilters({...filters, status: 'cancelled'});
                setCurrentPage(1);
                getAllTasks();
              }}
              className={`px-3 py-1 text-xs rounded-full ${filters.status === 'cancelled' ? 'bg-gray-500 text-white' : 'bg-gray-50 text-gray-800 hover:bg-gray-100'}`}
            >
              Cancelled
            </button>
            <button
              className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-800 hover:bg-blue-100 ml-auto flex items-center gap-1"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter size={10} /> More Filters
            </button>
          </div>
        </div>        {/* Filters panel */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200 animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Advanced Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Priority filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Category filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="training">Training</option>
                  <option value="match">Match</option>
                  <option value="administrative">Administrative</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Sort by filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                    <option value="createdOn">Created Date</option>
                    <option value="title">Title</option>
                  </select>                  <button
                    onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    title={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  >
                    {filters.sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
                onClick={resetFilters}
              >
                Reset
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}{/* Task cards grid */}
        {currentTasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {currentTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={() => handleEdit(task)}
                onDelete={() => deleteTask(task)}
                onPinNote={() => updateIsPinned(task)}
                onStatusChange={updateTaskStatus}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-10 flex flex-col items-center justify-center shadow-sm mt-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaSearch className="text-gray-400" size={24} />
            </div>
            <h3 className="text-xl font-medium text-gray-700">No tasks found</h3>
            <p className="text-gray-500 text-center mt-2">
              {isSearch
                ? "Try adjusting your search query or filters."
                : "Start creating tasks to manage your activities. Click the 'Add Task' button to get started!"}
            </p>
          </div>
        )}        {/* Pagination */}
        {allTasks.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-2 text-blue-600 disabled:text-gray-300 hover:bg-blue-50 rounded-full transition-colors"
              >
                <MdChevronLeft size={24} />
              </button>

              <span className="text-md font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-2 text-blue-600 disabled:text-gray-300 hover:bg-blue-50 rounded-full transition-colors"
              >                <MdChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        {/* Modal for adding/editing tasks */}
        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          style={{
            overlay: { 
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            },
            content: {
              position: 'relative',
              width: '95%',
              maxWidth: '650px',
              height: 'auto',
              maxHeight: '90vh',
              margin: '0 auto',
              borderRadius: '12px',
              padding: '0',
              border: 'none',
              overflow: 'auto',
              inset: 'auto',
              zIndex: 10000
            },
          }}
          contentLabel="Task Form"
        >
          <div className="bg-gray-50 p-6 border-b border-gray-200 sticky top-0 z-10">
            <h2 className="text-2xl font-semibold text-gray-800">
              {openAddEditModal.type === "edit" ? "Edit Task" : "Add New Task"}
            </h2>
          </div>
          <AddEditTask
            type={openAddEditModal.type}
            taskData={openAddEditModal.data}
            onClose={() => {
              setOpenAddEditModal({ isShown: false, type: "add", data: null });
            }}
            getAllTasks={() => {
              getAllTasks();
              getTaskStats();
            }}
            showToastMessage={showToastMessage}
          />
        </Modal>

        {/* Toast notifications */}
        <Toast
          isShown={showToastMsg.isShown}
          message={showToastMsg.message}
          type={showToastMsg.type}
          onClose={handleCloseToast}
        />
      </div>
    </Layout>
  );
};

export default Tasks;
