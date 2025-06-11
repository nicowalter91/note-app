import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import deDE from 'date-fns/locale/de';
import { useNavigate } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Events.css';
import Layout from '../../components/Layout/Layout';
import axiosInstance from '../../utils/axiosInstance';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import Toast from '../../components/ToastMessage/Toast';

const locales = {
  'de': deDE,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [view, setView] = useState('calendar');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
    location: '',
    participants: []
  });

  useEffect(() => {
    getEvents();
    getPlayers();
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getEvents = async () => {
    try {
      const response = await axiosInstance.get('/events');
      const formattedEvents = response.data.map(event => ({
        ...event,
        start: new Date(event.date + 'T' + event.time),
        end: new Date(event.date + 'T' + event.time),
        title: `${event.title} (${event.type})`
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error loading events:', error);
      setMessage({ type: 'error', text: 'Fehler beim Laden der Events' });
    }
  };

  const getPlayers = async () => {
    try {
      const response = await axiosInstance.get('/get-all-players');
      if (response.data?.players) {
        setPlayers(response.data.players);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Laden der Spieler' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.date || !formData.time || !formData.location) {
      setMessage({ type: 'error', text: 'Bitte füllen Sie alle Pflichtfelder aus.' });
      return;
    }

    try {
      if (editingEvent) {
        await axiosInstance.put(`/events/${editingEvent._id}`, formData);
        setMessage({ type: 'success', text: 'Event erfolgreich aktualisiert' });
      } else {
        await axiosInstance.post('/events', formData);
        setMessage({ type: 'success', text: 'Event erfolgreich erstellt' });
      }
      getEvents();
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      setMessage({ 
        type: 'error', 
        text: 'Fehler beim Speichern: ' + (error.response?.data?.message || error.message)
      });
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Möchten Sie dieses Event wirklich löschen?')) {
      try {
        await axiosInstance.delete(`/events/${eventId}`);
        setMessage({ type: 'success', text: 'Event erfolgreich gelöscht' });
        getEvents();
      } catch (error) {
        setMessage({ type: 'error', text: 'Fehler beim Löschen des Events' });
      }
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      type: event.type,
      date: event.date.split('T')[0],
      time: event.time,
      location: event.location,
      participants: event.participants.map(p => p._id)
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
      location: '',
      participants: []
    });
    setShowForm(false);
    setEditingEvent(null);
  };

  const getEventStyle = (event) => {
    switch (event.type) {
      case 'Spiel':
        return { className: 'event-Spiel' };
      case 'Training':
        return { className: 'event-Training' };
      default:
        return { className: 'event-Event' };
    }
  };

  return (
    <Layout userInfo={userInfo}>
      {message.text && (
        <Toast type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />
      )}
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800">Events</h1>
              <div className="flex gap-4">
                <button
                  onClick={() => setView(view === 'calendar' ? 'list' : 'calendar')}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  {view === 'calendar' ? 'Listenansicht' : 'Kalenderansicht'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    if (!showForm) {
                      setEditingEvent(null);
                      resetForm();
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <FaPlus />
                  {showForm ? 'Abbrechen' : 'Neues Event'}
                </button>
              </div>
            </div>

            {/* Event-Legende */}
            <div className="flex gap-4 mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-blue-600 mr-2"></div>
                <span>Spiel</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-green-600 mr-2"></div>
                <span>Training</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded bg-purple-600 mr-2"></div>
                <span>Event</span>
              </div>
            </div>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editingEvent ? 'Event bearbeiten' : 'Neues Event erstellen'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titel</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Typ</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Bitte wählen</option>
                    <option value="Spiel">Spiel</option>
                    <option value="Training">Training</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Datum</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Uhrzeit</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Ort</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Teilnehmer</label>
                  <select
                    multiple
                    value={formData.participants}
                    onChange={(e) => setFormData({
                      ...formData,
                      participants: Array.from(e.target.selectedOptions, option => option.value)
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    {players.map(player => (
                      <option key={player._id} value={player._id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {editingEvent ? 'Aktualisieren' : 'Erstellen'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {view === 'calendar' ? (
            <div className="bg-white rounded-lg shadow-md p-6" style={{ height: '700px' }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={getEventStyle}
                messages={{
                  next: "Weiter",
                  previous: "Zurück",
                  today: "Heute",
                  month: "Monat",
                  week: "Woche",
                  day: "Tag"
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {event.type}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-yellow-600 hover:text-yellow-700"
                        title="Bearbeiten"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-red-600 hover:text-red-700"
                        title="Löschen"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {event.description && (
                    <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {event.participants?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">Teilnehmer:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {event.participants.map((player) => (
                          <span
                            key={player._id}
                            className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                          >
                            {player.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Events;
