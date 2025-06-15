import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { MdOutlinePushPin, MdCreate, MdDelete, MdCheck, MdDateRange, MdPerson, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { 
  FaRegClock, 
  FaExclamationCircle, 
  FaRegCalendarAlt,
  FaFutbol,
  FaClipboardList,
  FaWrench,
  FaInfoCircle,
  FaPen,
  FaTrashAlt,
  FaCheck,
  FaStar,
  FaTasks
} from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';

// TaskCard component with modern styling and more functionality
const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  onPinNote, 
  onStatusChange 
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Toggle subtask completion
  const handleSubtaskToggle = async (subtaskId, isCompleted) => {
    if (updating) return;
    
    setUpdating(true);
    try {
      await axiosInstance.put(`/update-subtask/${task._id}/${subtaskId}`, {
        isCompleted: !isCompleted
      });
      
      // Update the task in the parent component
      onStatusChange({_id: task._id}, 'refresh');
    } catch (error) {
      console.error('Error toggling subtask:', error);
    } finally {
      setUpdating(false);
    }
  };
  
  // Get proper CSS class for the task's priority
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-green-100 text-green-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get proper CSS class for the task's status
  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get icon for the task's category
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'training': return <FaFutbol className="mr-1" />;
      case 'match': return <FaExclamationCircle className="mr-1" />;
      case 'administrative': return <FaClipboardList className="mr-1" />;
      default: return <FaWrench className="mr-1" />;
    }
  };
  
  // Format the due date and check if it's overdue
  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    
    const due = moment(dueDate);
    const now = moment();
    const isOverdue = due.isBefore(now) && task.status !== 'completed';
    
    return {
      formatted: due.format('DD.MM.YYYY'),
      isOverdue,
      relativeTime: due.fromNow()
    };
  };
  
  const dueInfo = formatDueDate(task.dueDate);
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header with priority indicator */}
      <div className="relative">
        {task.isPinned && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-blue-500 text-white p-1 rounded-full">
              <MdOutlinePushPin className="text-sm" />
            </div>
          </div>
        )}
        <div className={`h-2 w-full ${
          task.priority === 'urgent' ? 'bg-red-500' : 
          task.priority === 'high' ? 'bg-orange-500' : 
          task.priority === 'medium' ? 'bg-green-500' : 
          'bg-blue-500'
        }`}></div>
      </div>
      
      {/* Task content */}
      <div className="p-5">
        <h3 className={`text-lg font-semibold text-gray-800 mb-2 ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </h3>
        
        <div className="flex flex-wrap gap-2 mt-3 mb-4">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusClass(task.status)}`}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
          </span>
          
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityClass(task.priority)}`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
          
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-purple-100 text-purple-800 flex items-center">
            {getCategoryIcon(task.category)}
            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </span>
        </div>
        
        {/* Task description - shorter for cleaner cards */}
        <p className="text-sm text-gray-600 mb-3">
          {task.description?.slice(0, 100)}
          {task.description?.length > 100 ? '...' : ''}
        </p>
        
        {/* Subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mb-3">
            <div
              className="flex items-center text-sm text-blue-600 font-medium cursor-pointer mb-1"
              onClick={() => setShowSubtasks(!showSubtasks)}
            >
              <FaTasks className="mr-1" />
              <span>{task.subtasks.length} Subtask{task.subtasks.length !== 1 ? 's' : ''}</span>
              {showSubtasks ? <MdExpandLess className="ml-1" /> : <MdExpandMore className="ml-1" />}
            </div>
            
            {showSubtasks && (
              <div className="mt-2 border border-gray-200 rounded-md divide-y bg-gray-50">
                {task.subtasks.map((subtask) => (
                  <div key={subtask._id} className="flex items-center p-2 hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={subtask.isCompleted}
                      onChange={() => handleSubtaskToggle(subtask._id, subtask.isCompleted)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                      disabled={updating}
                    />
                    <span className={`text-xs ${subtask.isCompleted ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {subtask.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Due date */}
        {dueInfo && (
          <div className={`text-xs mb-2 flex items-center ${dueInfo.isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
            <MdDateRange className="mr-1" />
            Due: {dueInfo.formatted}
            {dueInfo.isOverdue && (
              <span className="ml-1 font-bold">({dueInfo.relativeTime})</span>
            )}
          </div>
        )}
        
        {/* Assignees */}
        {task.assignedTo?.length > 0 && (
          <div className="text-xs text-gray-600 flex items-center mb-2">
            <MdPerson className="mr-1" />
            Assigned to: {task.assignedTo.join(', ')}
          </div>
        )}
        
        {/* Created date */}
        <div className="text-xs text-gray-500 mb-4">
          <FaRegCalendarAlt className="inline mr-1" />
          Created {moment(task.createdOn).format('DD.MM.YYYY')}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className='text-xs text-gray-500'>
            {task.tags?.map((tag, index) => (
              <span key={index} className="mr-1">#{tag}</span>
            ))}
          </div>
          
          <div className="flex gap-1">
            {task.status !== 'completed' && (
              <button 
                onClick={() => onStatusChange(task, 'completed')}
                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full"
                title="Mark as completed"
              >
                <FaCheck size={14} />
              </button>
            )}
            
            <button 
              onClick={() => onEdit(task)}
              className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-full"
              title="Edit task"
            >
              <FaPen size={14} />
            </button>
            
            <button 
              onClick={() => onDelete(task)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
              title="Delete task"
            >
              <FaTrashAlt size={14} />
            </button>
            
            <button 
              onClick={() => onPinNote(task)}
              className={`p-2 rounded-full ${task.isPinned ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'}`}
              title={task.isPinned ? "Unpin task" : "Pin task"}
            >
              <FaStar size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
