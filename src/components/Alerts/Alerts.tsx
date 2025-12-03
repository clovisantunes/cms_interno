import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getActiveAlerts } from '../../services/firebaseService';
import styles from './styles.module.scss';

interface AlertSection {
  id: string;
  type: 'title' | 'warning' | 'info' | 'procedure' | 'important' | 'note';
  title: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  icon?: string;
  bulletColor?: string;
}

interface AlertData {
  id?: string;
  sections: AlertSection[];
  mainTitle: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  expirationDate: string | null;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date;
  createdBy: string;
  gratitudeMessage?: string;
}

interface AlertasProps {
  isVisible: boolean;
}

export const Alertas: React.FC<AlertasProps> = ({ isVisible }) => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const activeAlerts = await getActiveAlerts();
      setAlerts(activeAlerts);
      
      if (activeAlerts.length === 0) {
        setError('Nenhum alerta ativo no momento.');
      }
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      setError('Erro ao carregar alertas. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      fetchAlerts();
      const interval = setInterval(fetchAlerts, 30000);
      return () => clearInterval(interval);
    }
  }, [isVisible, fetchAlerts]);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isMobile) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      const minSwipeDistance = 50;
      const distance = touchStartX - touchEndX;

      if (Math.abs(distance) < minSwipeDistance) return;

      if (distance > 0 && alerts.length > 1) {
        setCurrentAlertIndex((prev) => (prev + 1) % alerts.length);
      } else if (distance < 0 && alerts.length > 1) {
        setCurrentAlertIndex((prev) => (prev - 1 + alerts.length) % alerts.length);
      }
    };

    const container = containerRef.current;
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, alerts.length]);

  const nextAlert = useCallback(() => {
    setCurrentAlertIndex((prev) => (prev + 1) % alerts.length);
  }, [alerts.length]);

  const prevAlert = useCallback(() => {
    setCurrentAlertIndex((prev) => (prev - 1 + alerts.length) % alerts.length);
  }, [alerts.length]);

  const goToAlert = (index: number) => {
    setCurrentAlertIndex(index);
  };

  const parseContent = useCallback((content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[vermelho\](.*?)\[\/vermelho\]/g, '<span class="red-text">$1</span>')
      .replace(/\[verde\](.*?)\[\/verde\]/g, '<span class="green-text">$1</span>')
      .replace(/\[amarelo\](.*?)\[\/amarelo\]/g, '<span class="yellow-text">$1</span>')
      .replace(/\[cinza\](.*?)\[\/cinza\]/g, '<span class="gray-text">$1</span>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  }, []);

 
  const calculateProgress = useCallback((createdAt: Date, expiresAt: Date) => {
    const now = new Date();
    const start = new Date(createdAt).getTime();
    const end = new Date(expiresAt).getTime();
    const current = now.getTime();
    
    if (current >= end) return 0;
    if (current <= start) return 100;
    
    const total = end - start;
    const elapsed = current - start;
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  }, []);

  const getAlertClass = useCallback((urgency: string) => {
    switch (urgency) {
      case 'critical':
        return styles.alertCritical;
      case 'high':
        return styles.alertWarning;
      case 'medium':
        return styles.alertWarning;
      case 'low':
        return styles.alertInfo;
      default:
        return styles.alertInfo;
    }
  }, []);

  const getUrgencyIcon = useCallback((urgency: string) => {
    switch (urgency) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '📢';
      case 'low':
        return 'ℹ️';
      default:
        return '📢';
    }
  }, []);

  const getUrgencyText = useCallback((urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'CRÍTICO';
      case 'high':
        return 'ALTA URGÊNCIA';
      case 'medium':
        return 'ATENÇÃO';
      case 'low':
        return 'INFORMAÇÃO';
      default:
        return 'INFORMAÇÃO';
    }
  }, []);

  const getAlertStyle = useCallback(() => {
    const maxHeight = viewportHeight * 0.85;
    return {
      maxHeight: `${maxHeight}px`,
      height: 'auto'
    };
  }, [viewportHeight]);

  if (!isVisible) return null;

  const currentAlert = alerts[currentAlertIndex];

  if (isLoading) {
    return (
      <div className={`${styles.alertasWrapper} ${styles.loadingState}`}>
        <div className={`${styles.alertasContainer} ${styles.loadingContainer}`}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Carregando alertas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.alertasWrapper} ${styles.errorState}`}>
        <div className={`${styles.alertasContainer} ${styles.errorContainer}`}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  if (!currentAlert) {
    return (
      <div className={`${styles.alertasWrapper} ${styles.emptyState}`}>
        <div className={`${styles.alertasContainer} ${styles.emptyContainer}`}>
          <span className={styles.emptyIcon}>📭</span>
          <p className={styles.emptyText}>Nenhum alerta disponível no momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.alertasWrapper}>
      <div 
        ref={containerRef}
        className={`${styles.alertasContainer} ${getAlertClass(currentAlert.urgency)}`}
        style={getAlertStyle()}
        role="alert"
        aria-live="polite"
        aria-label={`Alerta ${currentAlertIndex + 1} de ${alerts.length}: ${currentAlert.mainTitle}`}
      >
        <div className={styles.alertHeader}>
          <div className={styles.typeInfo}>
            <span className={styles.typeIcon} role="img" aria-label={getUrgencyText(currentAlert.urgency)}>
              {getUrgencyIcon(currentAlert.urgency)}
            </span>
            <span className={styles.alertTypeText}>
              {getUrgencyText(currentAlert.urgency)}
            </span>
          </div>
          
          {alerts.length > 1 && (
            <div className={styles.counterContainer}>
              <span className={styles.currentNumber}>{currentAlertIndex + 1}</span>
              <span className={styles.totalNumber}>/{alerts.length}</span>
            </div>
          )}
        </div>

        <h1 className={styles.mainTitle}>
          {currentAlert.mainTitle}
        </h1>

        <div className={styles.contentScroll}>
          <div className={styles.alertContent}>
            {currentAlert.sections.map((section, index) => (
              <div 
                key={`${section.id}-${index}`} 
                className={`${styles.section} ${styles[section.type]}`}
                style={{ 
                  backgroundColor: section.backgroundColor || 'transparent'
                }}
              >
                {section.title && section.title !== 'Título Principal' && (
                  <div className={styles.sectionHeader}>
                    {section.icon && (
                      <span className={styles.sectionIcon} role="img" aria-label="">
                        {section.icon}
                      </span>
                    )}
                    <h2 className={styles.sectionTitle}>{section.title}</h2>
                  </div>
                )}
                
                <div className={styles.sectionBody}>
                  {section.type === 'procedure' ? (
                    <ul className={styles.procedureList}>
                      {section.content.split('\n').map((line, i) => {
                        if (line.trim()) {
                          return (
                            <li key={i} className={styles.procedureItem}>
                              <span 
                                className={styles.bulletPoint}
                                style={{ color: section.bulletColor || section.textColor || '#333' }}
                              />
                              <span 
                                className={styles.procedureContent}
                                style={{ color: section.textColor || '#333' }}
                                dangerouslySetInnerHTML={{ __html: parseContent(line) }}
                              />
                            </li>
                          );
                        }
                        return null;
                      }).filter(Boolean)}
                    </ul>
                  ) : (
                    <div className={styles.textContent}>
                      {section.content.split('\n').map((line, i) => {
                        if (line.trim()) {
                          return (
                            <p 
                              key={i} 
                              className={styles.textParagraph}
                              style={{ color: section.textColor || '#333' }}
                              dangerouslySetInnerHTML={{ __html: parseContent(line) }}
                            />
                          );
                        }
                        return null;
                      }).filter(Boolean)}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {currentAlert.gratitudeMessage && (
              <div className={styles.gratitudeSection}>
                <span className={styles.gratitudeIcon} role="img" aria-label="Agradecimento">🙏</span>
                <p className={styles.gratitudeMessage}>
                  <strong>{currentAlert.gratitudeMessage}</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.metadataContainer}>
          <div className={styles.metadataGrid}>
            <div className={styles.metadataItem}>
              <span className={styles.metadataIcon} role="img" aria-label="Data">📅</span>
              <span className={styles.metadataText}>
                {new Date(currentAlert.createdAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {currentAlert.expiresAt && (
          <div className={styles.progressWrapper}>
            <div 
              className={styles.progressBar}
              style={{
                width: `${calculateProgress(currentAlert.createdAt, currentAlert.expiresAt)}%`
              }}
              role="progressbar"
              aria-valuenow={calculateProgress(currentAlert.createdAt, currentAlert.expiresAt)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        )}

        {alerts.length > 1 && (
          <>
            <div className={styles.pageIndicators}>
              {alerts.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.pageDot} ${index === currentAlertIndex ? styles.activeDot : ''}`}
                  onClick={() => goToAlert(index)}
                  aria-label={`Ir para alerta ${index + 1}`}
                  aria-current={index === currentAlertIndex ? 'true' : 'false'}
                >
                  {index === currentAlertIndex && (
                    <div 
                      className={styles.dotProgress}
                      style={{
                        transform: `scaleX(${calculateProgress(alerts[index].createdAt, alerts[index].expiresAt) / 100})`
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className={styles.navControls}>
              <button
                className={`${styles.navButton} ${styles.prevButton}`}
                onClick={prevAlert}
                aria-label="Alerta anterior"
              >
                <span className={styles.navButtonIcon}>←</span>
                {!isMobile && <span className={styles.navButtonText}>Anterior</span>}
              </button>
              
              <div className={styles.navSpacer} />
              
              <button
                className={`${styles.navButton} ${styles.nextButton}`}
                onClick={nextAlert}
                aria-label="Próximo alerta"
              >
                {!isMobile && <span className={styles.navButtonText}>Próximo</span>}
                <span className={styles.navButtonIcon}>→</span>
              </button>
            </div>

            {isMobile && (
              <div className={styles.swipeIndicator}>
                <span className={styles.swipeIcon} role="img" aria-label="Deslize">↔️</span>
                <span className={styles.swipeText}>Deslize para navegar</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};