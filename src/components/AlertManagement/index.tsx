import React, { useState, useEffect } from 'react';
import { getAlerts, deleteAlert } from '../../services/firebaseService';
import styles from './styles.module.scss';

interface Alert {
  id: string;
  mainTitle: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
  isActive: boolean;
}

interface CompactAlertManagementProps {
  currentUser: any; 
}

const CompactAlertManagement: React.FC<CompactAlertManagementProps> = ({ currentUser }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadAlerts();
    }
  }, [currentUser]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      
      if (!currentUser) {
        setError('Usuário não autenticado');
        return;
      }

      const userAlerts = await getAlerts(currentUser.uid);
      
      const formattedAlerts: Alert[] = userAlerts.map(alert => ({
        id: alert.id,
        mainTitle: alert.data.mainTitle || 'Sem título',
        urgency: alert.data.urgency || 'medium',
        createdAt: alert.data.createdAt?.toDate() || new Date(),
        isActive: alert.data.isActive !== false,
      }));

      formattedAlerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      setAlerts(formattedAlerts);
      setError('');
    } catch (error: any) {
      console.error('Erro ao carregar alertas:', error);
      setError('Erro ao carregar alertas.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      if (!currentUser) {
        setError('Usuário não autenticado');
        return;
      }

      await deleteAlert(currentUser.uid);
      setAlerts(alerts.filter(alert => alert.id !== alertId));
      setSuccessMessage('Alerta excluído com sucesso!');
      setConfirmDelete(null);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      console.error('Erro ao excluir alerta:', error);
      setError('Erro ao excluir alerta.');
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <span className={styles.criticalBadge}>🔴 Crítico</span>;
      case 'high': return <span className={styles.highBadge}>🟠 Alta</span>;
      case 'medium': return <span className={styles.mediumBadge}>🟡 Média</span>;
      case 'low': return <span className={styles.lowBadge}>🟢 Baixa</span>;
      default: return <span className={styles.mediumBadge}>🟡 Média</span>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filteredAlerts = alerts.filter(alert => {
    if (searchTerm) {
      return alert.mainTitle.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const displayAlerts = showAll ? filteredAlerts : filteredAlerts.slice(0, 3);

  const handleRefresh = () => {
    if (currentUser) {
      loadAlerts();
    }
  };

  return (
    <div className={styles.compactAlertManagement}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3>📋 Meus Alertas</h3>
          <span className={styles.badge}>{alerts.length} alertas</span>
        </div>
        <div className={styles.headerRight}>
          <button 
            onClick={handleRefresh}
            className={styles.refreshButton}
            disabled={loading}
          >
            {loading ? '🔄' : '↻'}
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>❌</span>
          {error}
        </div>
      )}

      {successMessage && (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✅</span>
          {successMessage}
        </div>
      )}

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar alertas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <span className={styles.searchIcon}>🔍</span>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando alertas...</p>
        </div>
      ) : filteredAlerts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhum alerta encontrado</p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className={styles.clearSearchButton}
            >
              Limpar busca
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={styles.alertsList}>
            {displayAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`${styles.alertItem} ${!alert.isActive ? styles.inactive : ''}`}
              >
                <div className={styles.alertInfo}>
                  <div className={styles.alertTitle}>
                    {alert.mainTitle}
                  </div>
                  <div className={styles.alertMeta}>
                    {getUrgencyBadge(alert.urgency)}
                    <span className={styles.date}>
                      {formatDate(alert.createdAt)}
                    </span>
                    {!alert.isActive && (
                      <span className={styles.inactiveTag}>⏸️ Inativo</span>
                    )}
                  </div>
                </div>
                
                <div className={styles.alertActions}>
                  <button
                    onClick={() => setConfirmDelete(alert.id)}
                    className={styles.deleteButton}
                    title="Excluir alerta"
                  >
                    🗑️
                  </button>
                </div>

                {confirmDelete === alert.id && (
                  <div className={styles.confirmDelete}>
                    <p>Tem certeza que deseja excluir este alerta?</p>
                    <div className={styles.confirmButtons}>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className={styles.cancelButton}
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        className={styles.confirmDeleteButton}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredAlerts.length > 3 && (
            <div className={styles.showMoreContainer}>
              <button
                onClick={() => setShowAll(!showAll)}
                className={styles.showMoreButton}
              >
                {showAll ? 'Mostrar menos' : `Mostrar mais (${filteredAlerts.length - 3} restantes)`}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompactAlertManagement;