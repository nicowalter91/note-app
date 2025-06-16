import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { 
  HiPlus, 
  HiDownload, 
  HiTrash, 
  HiPencil, 
  HiFilter,
  HiEye,
  HiCurrencyEuro,
  HiTrendingUp,
  HiTrendingDown,
  HiDocumentText,
  HiCalendar,
  HiSearch
} from 'react-icons/hi';
import axiosInstance from '../../../utils/axiosInstance';
import Toast from '../../../components/ToastMessage/Toast';
import AddEditFinanceModal from './AddEditFinanceModal';
import FinanceDetailModal from './FinanceDetailModal';

const TeamFinance = () => {
  const [financeEntries, setFinanceEntries] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    totalEntries: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  // Filter states
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEntries: 0,
    entriesPerPage: 20
  });

  const categories = {
    equipment: 'Ausrüstung',
    travel: 'Reisen',
    tournament: 'Turniere',
    training: 'Training',
    maintenance: 'Wartung',
    fees: 'Gebühren',
    sponsorship: 'Sponsoring',
    donations: 'Spenden',
    fundraising: 'Fundraising',
    other: 'Sonstiges'
  };

  const types = {
    income: 'Einnahme',
    expense: 'Ausgabe'
  };

  useEffect(() => {
    fetchFinanceEntries();
  }, [filters, pagination.currentPage]);

  const fetchFinanceEntries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('page', pagination.currentPage);
      params.append('limit', pagination.entriesPerPage);

      const response = await axiosInstance.get(`/team-finance?${params.toString()}`);
      
      if (response.data && !response.data.error) {
        setFinanceEntries(response.data.entries);
        setSummary(response.data.summary);
        setPagination(prev => ({
          ...prev,
          ...response.data.pagination
        }));
      }
    } catch (error) {
      console.error('Error fetching finance entries:', error);
      showToast('Fehler beim Laden der Einträge', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entryId) => {
    if (!window.confirm('Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/team-finance/${entryId}`);
      
      if (response.data && !response.data.error) {
        showToast('Eintrag erfolgreich gelöscht', 'success');
        fetchFinanceEntries();
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      showToast('Fehler beim Löschen des Eintrags', 'error');
    }
  };

  const handleEdit = (entry) => {
    setSelectedEntry(entry);
    setShowAddEditModal(true);
  };

  const handleView = (entry) => {
    setSelectedEntry(entry);
    setShowDetailModal(true);
  };

  const handleDownloadReceipt = async (entryId) => {
    try {
      const response = await axiosInstance.get(`/team-finance/${entryId}/receipt`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'beleg.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      showToast('Fehler beim Herunterladen des Belegs', 'error');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      category: '',
      startDate: '',
      endDate: '',
      search: ''
    });
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('de-DE');
  };

  const filteredEntries = financeEntries.filter(entry => {
    if (!filters.search) return true;
    const searchTerm = filters.search.toLowerCase();
    return (
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.description.toLowerCase().includes(searchTerm) ||
      categories[entry.category].toLowerCase().includes(searchTerm)
    );
  });

  return (
    <Layout>
      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mannschaftskasse</h1>
            <p className="text-gray-600">Verwalten Sie die Finanzen Ihrer Mannschaft</p>
          </div>
          <button
            onClick={() => {
              setSelectedEntry(null);
              setShowAddEditModal(true);
            }}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <HiPlus className="text-lg" />
            Neuer Eintrag
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Einnahmen</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.totalIncome)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <HiTrendingUp className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ausgaben</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(summary.totalExpenses)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <HiTrendingDown className="text-red-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summary.balance)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <HiCurrencyEuro className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Einträge</p>
                <p className="text-2xl font-bold text-gray-900">
                  {summary.totalEntries}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <HiDocumentText className="text-gray-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <HiFilter className="text-gray-600" />
            <h3 className="text-lg font-medium text-gray-900">Filter</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Suche
              </label>
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Titel, Beschreibung..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typ
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Alle</option>
                <option value="income">Einnahmen</option>
                <option value="expense">Ausgaben</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategorie
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Alle</option>
                {Object.entries(categories).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Von Datum
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bis Datum
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Filter zurücksetzen
          </button>
        </div>

        {/* Entries Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Typ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Betrag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beleg
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      Lade Einträge...
                    </td>
                  </tr>
                ) : filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      Keine Einträge gefunden
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
                    <tr key={entry._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(entry.date)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {entry.title}
                          </div>
                          {entry.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {entry.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {categories[entry.category]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          entry.type === 'income' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {types[entry.type]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={entry.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                          {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.receipt ? (
                          <button
                            onClick={() => handleDownloadReceipt(entry._id)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <HiDownload className="text-sm" />
                            Beleg
                          </button>
                        ) : (
                          <span className="text-gray-400">Kein Beleg</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(entry)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Anzeigen"
                          >
                            <HiEye className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleEdit(entry)}
                            className="text-yellow-600 hover:text-yellow-800 p-1"
                            title="Bearbeiten"
                          >
                            <HiPencil className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry._id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Löschen"
                          >
                            <HiTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Zeige {((pagination.currentPage - 1) * pagination.entriesPerPage) + 1} bis{' '}
                {Math.min(pagination.currentPage * pagination.entriesPerPage, pagination.totalEntries)} von{' '}
                {pagination.totalEntries} Einträgen
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Zurück
                </button>
                <span className="text-sm text-gray-700">
                  Seite {pagination.currentPage} von {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Weiter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddEditModal && (
        <AddEditFinanceModal
          entry={selectedEntry}
          onClose={() => {
            setShowAddEditModal(false);
            setSelectedEntry(null);
          }}
          onSave={() => {
            setShowAddEditModal(false);
            setSelectedEntry(null);
            fetchFinanceEntries();
          }}
          showToast={showToast}
        />
      )}

      {showDetailModal && selectedEntry && (
        <FinanceDetailModal
          entry={selectedEntry}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedEntry(null);
          }}
          onEdit={() => {
            setShowDetailModal(false);
            setShowAddEditModal(true);
          }}
          onDelete={(entryId) => {
            setShowDetailModal(false);
            setSelectedEntry(null);
            handleDelete(entryId);
          }}
          onDownloadReceipt={handleDownloadReceipt}
        />
      )}

      {/* Toast */}
      {toast.show && (
        <Toast
          isShown={toast.show}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </Layout>
  );
};

export default TeamFinance;
