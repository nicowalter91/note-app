import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import axiosInstance from '../../utils/axiosInstance';
import { FaPlus, FaFileUpload, FaDownload, FaEye } from 'react-icons/fa';
import Toast from '../../components/ToastMessage/Toast';

const TeamCashBox = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    type: 'income', // 'income' or 'expense'
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    receipt: null
  });

  useEffect(() => {
    getUserInfo();
    getTransactions();
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const getTransactions = async () => {
    try {
      const response = await axiosInstance.get('/transactions');
      if (response.data?.transactions) {
        setTransactions(response.data.transactions);
        calculateBalance(response.data.transactions);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Laden der Transaktionen' });
    }
  };

  const calculateBalance = (transactions) => {
    const total = transactions.reduce((acc, transaction) => {
      return transaction.type === 'income' 
        ? acc + transaction.amount 
        : acc - transaction.amount;
    }, 0);
    setBalance(total);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    // Formular-Daten hinzufügen
    Object.keys(formData).forEach(key => {
      if (key === 'receipt' && formData[key]) {
        formDataToSend.append('receipt', formData[key]);
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });    try {
      // Verify token exists
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ type: 'error', text: 'Nicht eingeloggt. Bitte melden Sie sich erneut an.' });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }

      // Debug-Logs
      console.log('FormData entries:', [...formDataToSend.entries()]);
      console.log('Auth token:', token);
      
      const response = await axiosInstance.post('/transactions', formDataToSend);
      console.log('Server response:', response);
      
      if (response.data) {
        setTransactions(prevTransactions => [...prevTransactions, response.data.transaction]);
        calculateBalance([...transactions, response.data.transaction]);
        setMessage({ type: 'success', text: 'Transaktion erfolgreich hinzugefügt' });
        resetForm();
      }
    } catch (error) {
      console.error('Upload error:', error);      if (error.response) {
        if (error.response.status === 401) {
          setMessage({ type: 'error', text: 'Sitzung abgelaufen. Bitte melden Sie sich erneut an.' });
          setTimeout(() => {
            localStorage.clear();
            window.location.href = '/login';
          }, 2000);
        } else {
          setMessage({ type: 'error', text: error.response.data?.message || 'Fehler beim Hochladen. Bitte versuchen Sie es erneut.' });
        }
      } else if (error.request) {
        setMessage({ type: 'error', text: 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.' });
      } else {
        setMessage({ type: 'error', text: 'Ein unerwarteter Fehler ist aufgetreten.' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'income',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      receipt: null
    });
    setShowAddForm(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <Layout userInfo={userInfo}>
      {message.text && (
        <Toast type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />
      )}
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header mit Titel, Kontostand und Button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Mannschaftskasse</h1>
              <div className={`text-xl mt-2 font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Kontostand: {formatCurrency(balance)}
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FaPlus />
              {showAddForm ? 'Abbrechen' : 'Neue Transaktion'}
            </button>
          </div>

          {/* Formular für neue Transaktion */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Neue Transaktion
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Art der Transaktion</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="income">Einnahme</option>
                    <option value="expense">Ausgabe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Betrag (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
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
                  <label className="block text-sm font-medium text-gray-700">Beleg hochladen</label>
                  <input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, receipt: e.target.files[0] })}
                    className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Transaktion hinzufügen
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Transaktionsliste */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beschreibung
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Betrag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beleg
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr key={transaction._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.receipt ? (
                        <a
                          href={transaction.receipt}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <FaEye /> Beleg ansehen
                        </a>
                      ) : (
                        'Kein Beleg'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeamCashBox;
