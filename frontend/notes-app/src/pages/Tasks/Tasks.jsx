import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TaskCard from '../../components/Cards/TaskCard';
import { 
  MdAdd, 
  MdChevronLeft, 
  MdChevronRight, 
  MdFilterList, 
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
  FaSortDown,
  FaSortUp,
  FaClipboardList,
  FaFutbol,
  FaCalendarCheck,
  FaWrench,
  FaSearch,
  FaPlus
} from 'react-icons/fa';
import AddEditTask from './AddEditTask';
import Modal from "react-modal";
import Toast from '../../components/ToastMessage/Toast';
import Layout from '../../components/Layout/Layout';
import moment from 'moment';

// Import Design System Components
import {
  PageHeader,
  Card,
  Button,
  Badge,
  PriorityBadge,
  StatusBadge,
  LoadingSpinner,
  EmptyState,
  ListSection,
  ListItem,
  QuickActionsGrid,
  StatsGrid
} from '../../components/UI/DesignSystem';

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
      setError("Fehler beim Laden der Aufgaben. Bitte versuchen Sie es später erneut.");
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
      if (window.confirm('Sind Sie sicher, dass Sie diese Aufgabe löschen möchten?')) {
        setLoading(true);
        const response = await axiosInstance.delete(`/delete-task/${taskData._id}`);
        if (response.data && !response.data.error) {
          showToastMessage("Aufgabe erfolgreich gelöscht", "delete");
          getAllTasks();
          getTaskStats();
        }
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Fehler beim Löschen der Aufgabe. Bitte versuchen Sie es erneut.");
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
      setError("Fehler bei der Suche. Bitte versuchen Sie es erneut.");
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
        showToastMessage("Aufgabe erfolgreich aktualisiert");
        getAllTasks();
      }
    } catch (error) {
      console.error("Error updating pinned status:", error);
    }
  };

  // Update the status of a task
  const updateTaskStatus = async (taskData, newStatus) => {
    if (newStatus === 'refresh') {
      getAllTasks();
      return;
    }
    
    const taskId = taskData._id;
    try {
      const response = await axiosInstance.put(
        `/update-task-status/${taskId}`,
        { status: newStatus }
      );
      
      if (response.data && response.data.task) {
        const statusLabels = {
          pending: 'ausstehend',
          'in-progress': 'in Bearbeitung',
          completed: 'abgeschlossen',
          cancelled: 'abgebrochen'
        };
        showToastMessage(`Aufgabe als ${statusLabels[newStatus]} markiert`);
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
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Page Header */}
        <PageHeader
          title="Aufgaben"
          subtitle="Verwalten Sie Ihre Tasks und bleiben Sie organisiert"
          icon={FaClipboardList}
          action={
            <Button
              onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
              variant="primary"
              icon={FaPlus}
              disabled={loading}
            >
              Neue Aufgabe
            </Button>
          }
        />

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <div className="flex items-center text-red-700">
              <FaExclamation className="mr-2" />
              {error}
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner text="Lade Aufgaben..." />}

        {/* Task Statistics */}
        {taskStats && !loading && (
          <div className="mb-6">
            <StatsGrid
              stats={[
                {
                  icon: FaExclamation,
                  value: taskStats.byStatus?.find(s => s._id === 'pending')?.count || 0,
                  label: 'Ausstehend'
                },
                {
                  icon: FaSpinner,
                  value: taskStats.byStatus?.find(s => s._id === 'in-progress')?.count || 0,
                  label: 'In Bearbeitung'
                },
                {
                  icon: FaCheck,
                  value: taskStats.byStatus?.find(s => s._id === 'completed')?.count || 0,
                  label: 'Abgeschlossen'
                },
                {
                  icon: MdDateRange,
                  value: taskStats.dueToday || 0,
                  label: 'Heute fällig'
                }
              ]}
            />
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Aufgaben durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && onSearchTask()}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 mr-2">Status:</span>
              {[
                { key: '', label: 'Alle', variant: 'secondary' },
                { key: 'pending', label: 'Ausstehend', variant: 'warning' },
                { key: 'in-progress', label: 'In Bearbeitung', variant: 'info' },
                { key: 'completed', label: 'Abgeschlossen', variant: 'success' },
                { key: 'cancelled', label: 'Abgebrochen', variant: 'secondary' }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => {
                    setFilters({...filters, status: filter.key});
                    setCurrentPage(1);
                    getAllTasks();
                  }}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filters.status === filter.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
              
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="secondary"
                size="sm"
                icon={FaFilter}
                className="ml-auto"
              >
                Erweiterte Filter
              </Button>
            </div>
          </div>
        </Card>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Erweiterte Filter</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MdClose size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priorität</label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Alle Prioritäten</option>
                  <option value="high">Hoch</option>
                  <option value="medium">Mittel</option>
                  <option value="low">Niedrig</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Alle Kategorien</option>
                  <option value="training">Training</option>
                  <option value="match">Spiel</option>
                  <option value="planning">Planung</option>
                  <option value="admin">Administration</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sortieren nach</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dueDate">Fälligkeitsdatum</option>
                  <option value="priority">Priorität</option>
                  <option value="createdOn">Erstellungsdatum</option>
                  <option value="title">Titel</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                  variant="secondary"
                  icon={filters.sortOrder === 'asc' ? FaSortUp : FaSortDown}
                  className="w-full"
                >
                  {filters.sortOrder === 'asc' ? 'Aufsteigend' : 'Absteigend'}
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={resetFilters}>
                Zurücksetzen
              </Button>
              <Button variant="primary" onClick={applyFilters}>
                Filter anwenden
              </Button>
            </div>
          </Card>
        )}

        {/* Tasks Grid */}
        {!loading && (
          <>
            {currentTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <EmptyState
                icon={FaSearch}
                title={isSearch ? "Keine Aufgaben gefunden" : "Noch keine Aufgaben vorhanden"}
                description={
                  isSearch
                    ? "Versuchen Sie andere Suchbegriffe oder passen Sie die Filter an."
                    : "Erstellen Sie Ihre erste Aufgabe, um organisiert zu bleiben."
                }
                action={
                  !isSearch && (
                    <Button
                      onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
                      variant="primary"
                      icon={FaPlus}
                    >
                      Erste Aufgabe erstellen
                    </Button>
                  )
                }
              />
            )}
          </>
        )}

        {/* Pagination */}
        {allTasks.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Card size="sm" className="flex items-center space-x-4">
              <Button
                onClick={prevPage}
                disabled={currentPage === 1}
                variant="secondary"
                size="sm"
                icon={MdChevronLeft}
              />
              
              <span className="text-sm font-medium text-gray-700">
                Seite {currentPage} von {totalPages}
              </span>
              
              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                variant="secondary"
                size="sm"
                icon={MdChevronRight}
              />
            </Card>
          </div>
        )}

        {/* Add/Edit Task Modal */}
        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
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
              maxWidth: '800px',
              height: 'auto',
              maxHeight: '85vh',
              margin: '0 auto',
              borderRadius: '12px',
              padding: '0',
              border: 'none',
              overflow: 'auto',
              inset: 'auto',
              zIndex: 10000
            },
          }}
          contentLabel="Aufgabe bearbeiten"
        >
          <div className="bg-gray-50 p-6 border-b border-gray-200 sticky top-0 z-10">
            <h2 className="text-2xl font-semibold text-gray-800">
              {openAddEditModal.type === "edit" ? "Aufgabe bearbeiten" : "Neue Aufgabe"}
            </h2>
          </div>
          <AddEditTask
            type={openAddEditModal.type}
            taskData={openAddEditModal.data}
            onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
            getAllTasks={() => {
              getAllTasks();
              getTaskStats();
            }}
            showToastMessage={showToastMessage}
          />
        </Modal>

        {/* Toast Messages */}
        <Toast
          isShown={showToastMsg.isShown}
          message={showToastMsg.message}
          type={showToastMsg.type}
          onClose={() => setShowToastMsg({ isShown: false, message: "", type: null })}
        />
      </div>
    </Layout>
  );
};

export default Tasks;
