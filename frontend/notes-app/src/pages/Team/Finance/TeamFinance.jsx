import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { PageHeader, Card, Button, Badge, StatsGrid, LoadingSpinner, EmptyState } from '../../../components/UI/DesignSystem';
import { 
  FaPlus, 
  FaDownload, 
  FaTrash, 
  FaEdit, 
  FaFilter,
  FaEye,
  FaEuroSign,
  FaArrowUp,
  FaArrowDown,
  FaFileInvoice,
  FaCalendarAlt,
  FaSearch
} from 'react-icons/fa';
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
  // Mock-Daten für Statistiken
  const financeStats = [
    {
      label: 'Einnahmen',
      value: formatCurrency(summary.totalIncome),
      trend: '+12%',
      icon: FaArrowUp,
      color: 'green'
    },
    {
      label: 'Ausgaben',  
      value: formatCurrency(summary.totalExpenses),
      trend: '-8%',
      icon: FaArrowDown,
      color: 'red'
    },
    {
      label: 'Saldo',
      value: formatCurrency(summary.balance),
      trend: summary.balance >= 0 ? '+' : '-',
      icon: FaEuroSign,
      color: summary.balance >= 0 ? 'green' : 'red'
    },
    {
      label: 'Einträge',
      value: summary.totalEntries.toString(),
      trend: `${financeEntries.length} total`,
      icon: FaFileInvoice,
      color: 'blue'
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <PageHeader
          title="Mannschaftskasse"
          subtitle="Verwalte die Finanzen deines Teams transparent und übersichtlich"
          icon={FaEuroSign}
          actions={
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                icon={FaDownload}
              >
                Export
              </Button>
              <Button 
                variant="primary" 
                icon={FaPlus}
                onClick={() => {
                  setSelectedEntry(null);
                  setShowAddEditModal(true);
                }}
              >
                Neuer Eintrag
              </Button>
            </div>
          }
        />

        {/* Finanz-Statistiken */}
        <StatsGrid stats={financeStats} />

        {/* Filter-Leiste */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700">Typ:</span>
              <Button
                variant={filters.type === '' ? "primary" : "ghost"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, type: '' }))}
              >
                Alle
              </Button>
              <Button
                variant={filters.type === 'income' ? "primary" : "ghost"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, type: 'income' }))}
              >
                Einnahmen
              </Button>
              <Button
                variant={filters.type === 'expense' ? "primary" : "ghost"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, type: 'expense' }))}
              >
                Ausgaben
              </Button>
            </div>
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Durchsuchen..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Finanz-Einträge */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaFileInvoice className="text-blue-500" />
            Finanz-Einträge
          </h3>
          
          {financeEntries.length === 0 ? (
            <EmptyState
              icon={FaEuroSign}
              title="Keine Einträge gefunden"
              description="Erstelle deinen ersten Finanz-Eintrag für dein Team"
              action={
                <Button 
                  variant="primary" 
                  icon={FaPlus}
                  onClick={() => {
                    setSelectedEntry(null);
                    setShowAddEditModal(true);
                  }}
                >
                  Ersten Eintrag erstellen
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Datum</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Beschreibung</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Kategorie</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Typ</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Betrag</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {financeEntries.map((entry, index) => (
                    <tr key={entry.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-900">
                          {new Date(entry.date).toLocaleDateString('de-DE')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">{entry.description}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary">{categories[entry.category]}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={entry.type === 'income' ? 'success' : 'danger'}>
                          {types[entry.type]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-bold ${
                          entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-1 justify-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={FaEye}
                            onClick={() => {
                              setSelectedEntry(entry);
                              setShowDetailModal(true);
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={FaEdit}
                            onClick={() => {
                              setSelectedEntry(entry);
                              setShowAddEditModal(true);
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={FaTrash}
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(entry.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Existing Modal Components */}
        {/* ...existing code... */}
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
