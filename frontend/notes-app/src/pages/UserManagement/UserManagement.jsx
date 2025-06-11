import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import { FaEdit, FaTrash } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]); // Ensure users is initialized as an array
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    // Fetch users from the backend
    axios
      .get('/api/users')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setUsers([]); // Fallback to an empty array
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setUsers([]); // Fallback to an empty array
      });
  }, []);

  const handleAddUser = () => {
    if (editingUser) {
      // Update user in the backend
      axios
        .put(`/api/users/${editingUser.id}`, newUser)
        .then(() => {
          setUsers(users.map((user) => (user.id === editingUser.id ? newUser : user)));
          setEditingUser(null);
          setNewUser({ name: '', email: '', role: '' });
        })
        .catch((error) => console.error('Error updating user:', error));
    } else {
      // Add new user to the backend
      axios
        .post('/api/users', newUser)
        .then((response) => {
          setUsers([...users, response.data]);
          setNewUser({ name: '', email: '', role: '' });
        })
        .catch((error) => console.error('Error adding user:', error));
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setNewUser(user);
  };

  const handleDeleteUser = (userToDelete) => {
    // Delete user from the backend
    axios
      .delete(`/api/users/${userToDelete.id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== userToDelete.id));
      })
      .catch((error) => console.error('Error deleting user:', error));
  };

  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Benutzerverwaltung</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700">{editingUser ? 'Benutzer bearbeiten' : 'Neuen Benutzer hinzufügen'}</h2>
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm mb-4"
          />
          <input
            type="email"
            placeholder="E-Mail"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm mb-4"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm mb-4"
          >
            <option value="">Rolle auswählen</option>
            <option value="Admin">Admin</option>
            <option value="Trainer">Trainer</option>
            <option value="Spieler">Spieler</option>
          </select>
          <button
            onClick={handleAddUser}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingUser ? 'Änderungen speichern' : 'Benutzer hinzufügen'}
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700">Benutzerliste</h2>
          <ul className="mt-4">
            {users.map((user, index) => (
              <li key={index} className="bg-white shadow-md rounded-md p-4 mb-2 flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">{user.name}</p>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-gray-600">Rolle: {user.role}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 flex items-center justify-center"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center justify-center"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
