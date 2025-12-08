import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAlert } from '../../services/firebaseService';
import { AlertSectionEditor } from '../../components/AlertSection/AlertSectionEditor';
import styles from './styles.module.scss';
import { app } from '../../firebase/config';
import { getAuth } from 'firebase/auth';
import CompactAlertManagement from '../../components/AlertManagement';
const CreateAlert: React.FC = () => {
  const navigate = useNavigate();
  
  const [mainTitle, setMainTitle] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [expirationDate, setExpirationDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [gratitudeMessage, setGratitudeMessage] = useState('Obrigado pela atenção e colaboração de todos.');
  const auth = getAuth(app);
const user = auth.currentUser;
  
  const FIXED_COLORS = {
    WARNING_BG: '#fff3e0',
    PROCEDURE_BG: '#e8f5e9',
    URGENT_BG: '#ffebee',
    BORDER_COLOR: '#ff9800',
    RED_TEXT: '#d32f2f',
    GREEN_TEXT: '#2e7d32',
    YELLOW_TEXT: '#f57c00',
    GRAY_TEXT: '#616161',
    BLACK_TEXT: '#000000',
    WHITE_BG: '#FFFFFF'
  };

  const SECTION_TYPES = [
    { 
      id: 'warning', 
      label: 'Aviso', 
      icon: '⚠️',
      defaultTitle: 'Aviso Importante'
    },
    { 
      id: 'procedure', 
      label: 'Procedimento', 
      icon: '📋',
      defaultTitle: 'Procedimento Correto'
    },
    { 
      id: 'urgent', 
      label: 'Urgente', 
      icon: '🚨',
      defaultTitle: 'Atenção Urgente'
    },
    { 
      id: 'note', 
      label: 'Observação', 
      icon: '💡',
      defaultTitle: 'Observações'
    }
  ];

  const [sections, setSections] = useState<any[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Aviso Importante',
      content: 'Este é um aviso importante sobre o procedimento.\n**Atenção**: Use equipamentos de segurança.',
      backgroundColor: FIXED_COLORS.WARNING_BG,
      textColor: FIXED_COLORS.BLACK_TEXT,
      icon: '⚠️'
    },
    {
      id: '2',
      type: 'procedure',
      title: 'Procedimento Correto',
      content: '1. Verifique todos os equipamentos\n2. Use os EPIs necessários\n3. Siga as instruções passo a passo\n4. Reporte qualquer anomalia',
      backgroundColor: FIXED_COLORS.PROCEDURE_BG,
      textColor: FIXED_COLORS.BLACK_TEXT,
      bulletColor: FIXED_COLORS.BLACK_TEXT,
      icon: '📋'
    }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getFixedBackgroundColor = (type: string) => {
    switch (type) {
      case 'warning': return FIXED_COLORS.WARNING_BG;
      case 'procedure': return FIXED_COLORS.PROCEDURE_BG;
      case 'urgent': return FIXED_COLORS.URGENT_BG;
      case 'note': return FIXED_COLORS.WHITE_BG;
      default: return FIXED_COLORS.WHITE_BG;
    }
  };

  const getFixedTextColor = (type: string) => {
    switch (type) {
      case 'urgent': return FIXED_COLORS.RED_TEXT;
      case 'note': return FIXED_COLORS.GRAY_TEXT;
      default: return FIXED_COLORS.BLACK_TEXT;
    }
  };

  const handleSectionChange = (index: number, updatedSection: any) => {
    const newSections = [...sections];
    
    updatedSection = {
      ...updatedSection,
      backgroundColor: getFixedBackgroundColor(updatedSection.type),
      textColor: getFixedTextColor(updatedSection.type),
      bulletColor: FIXED_COLORS.BLACK_TEXT
    };
    
    newSections[index] = updatedSection;
    setSections(newSections);
  };

  const handleAddSection = (type: string) => {
    const typeConfig = SECTION_TYPES.find(t => t.id === type);
    const newSection = {
      id: Date.now().toString(),
      type,
      title: typeConfig?.defaultTitle || 'Nova Seção',
      content: '',
      backgroundColor: getFixedBackgroundColor(type),
      textColor: getFixedTextColor(type),
      bulletColor: FIXED_COLORS.BLACK_TEXT,
      icon: typeConfig?.icon || '📝'
    };
    setSections([...sections, newSection]);
  };

  const handleRemoveSection = (index: number) => {
    if (sections.length > 1) {
      const newSections = sections.filter((_, i) => i !== index);
      setSections(newSections);
    }
  };

  const parseContent = (content: string) => {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    return lines.map(line => {
      let processedLine = line
        .replace(/\[vermelho\](.*?)\[\/vermelho\]/g, `<span style="color: ${FIXED_COLORS.RED_TEXT}; font-weight: 500;">$1</span>`)
        .replace(/\[verde\](.*?)\[\/verde\]/g, `<span style="color: ${FIXED_COLORS.GREEN_TEXT}; font-weight: 500;">$1</span>`)
        .replace(/\[amarelo\](.*?)\[\/amarelo\]/g, `<span style="color: ${FIXED_COLORS.YELLOW_TEXT}; font-weight: 500;">$1</span>`)
        .replace(/\[cinza\](.*?)\[\/cinza\]/g, `<span style="color: ${FIXED_COLORS.GRAY_TEXT}">$1</span>`);
      
      processedLine = processedLine
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/~~(.*?)~~/g, '<del>$1</del>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
      
      return processedLine;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const auth = getAuth(app);
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      const alertData = {
        mainTitle,
        sections,
        urgency,
        expirationDate: expirationDate || null,
        isActive,
        gratitudeMessage,
      };

      console.log('Criando alerta para usuário:', user.uid);
      
      await createAlert(user.uid, alertData);
      
      setSuccessMessage('✅ Alerta criado com sucesso!');
      
      setTimeout(() => {
        setMainTitle('');
        setGratitudeMessage('Obrigado pela atenção e colaboração de todos.');
        setSections([
          {
            id: '1',
            type: 'warning',
            title: 'Aviso Importante',
            content: '',
            backgroundColor: FIXED_COLORS.WARNING_BG,
            textColor: FIXED_COLORS.BLACK_TEXT,
            icon: '⚠️'
          }
        ]);
      }, 2000);
      
    } catch (error: any) {
      console.error('Erro ao criar alerta:', error);
      
      if (error.code === 'permission-denied') {
        setErrorMessage('❌ Permissão negada. Verifique as regras do Firestore.');
      } else if (error.message.includes('não autenticado')) {
        setErrorMessage('❌ Você precisa estar logado para criar alertas.');
      } else {
        setErrorMessage(`❌ Erro ao criar alerta: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCancel = () => {
    if (mainTitle.trim() || sections.some(s => s.content.trim())) {
      if (window.confirm('Tem certeza que deseja cancelar? As alterações não salvas serão perdidas.')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  const renderPreview = () => {
    return (
      <div className={styles.singleAlertPreview}>
        <div className={styles.alertHeader}>
          <div className={styles.headerGradient}>
            <div className={styles.headerContent}>
              <div className={styles.urgencyIndicator} data-urgency={urgency}>
                <span className={styles.urgencyDot}></span>
                <span className={styles.urgencyText}>
                  {urgency === 'critical' && 'CRÍTICO'}
                  {urgency === 'high' && 'ALTA URGÊNCIA'}
                  {urgency === 'medium' && 'MÉDIA URGÊNCIA'}
                  {urgency === 'low' && 'BAIXA URGÊNCIA'}
                </span>
              </div>
              
              <h3 className={styles.alertMainTitle}>{mainTitle || 'Título do Alerta'}</h3>
              
              <div className={styles.alertMetadata}>
                <div className={styles.metadataGrid}>
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataIcon}>📅</span>
                    <span className={styles.metadataText}>
                      <strong>Data:</strong> {new Date().toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className={styles.metadataItem}>
                    <span className={styles.metadataIcon}>👤</span>
                    <span className={styles.metadataText}>
                      <strong>Autor:</strong> Sistema
                    </span>
                  </div>
                  {expirationDate && (
                    <div className={styles.metadataItem}>
                      <span className={styles.metadataIcon}>⏰</span>
                      <span className={styles.metadataText}>
                        <strong>Expira:</strong> {new Date(expirationDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.alertBody}>
          {sections.map((section, index) => {
            const contentLines = parseContent(section.content);
            const isLast = index === sections.length - 1;
            
            return (
              <div
                key={section.id}
                className={`${styles.alertSection} ${isLast ? styles.lastSection : ''}`}
                style={{
                  backgroundColor: section.backgroundColor,
                  color: section.textColor
                }}
              >
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitleWrapper}>
                    <h4 className={styles.sectionTitle}>{section.title}</h4>
                  
                  </div>
                </div>
                
                <div className={styles.sectionContent}>
                  {section.type === 'procedure' ? (
                    <div className={styles.procedureContent}>
                      {contentLines.map((line, i) => (
                        <div key={i} className={styles.procedureStep}>
                          <span className={styles.stepNumber}>{i + 1}</span>
                          <div 
                            className={styles.stepContent}
                            dangerouslySetInnerHTML={{ __html: line }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={styles.textContent}>
                      {contentLines.map((line, i) => (
                        <div 
                          key={i} 
                          className={styles.textParagraph}
                          dangerouslySetInnerHTML={{ __html: line }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {gratitudeMessage && (
            <div className={styles.gratitudeSection}>
              <div className={styles.gratitudeContent}>
                <span className={styles.gratitudeIcon}>🙏</span>
                <p className={styles.gratitudeText}>{gratitudeMessage}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.createAlertContainer}>
      <div className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <button 
            onClick={() => navigate('/')}
            className={styles.backButton}
            disabled={isSubmitting}
          >
            <span className={styles.backIcon}>←</span>
            Voltar para Início
          </button>
          <h1>Criar Alerta Avançado</h1>
          <p>Crie alertas com múltiplas seções e formatação personalizada</p>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.formSection}>
            <div className={styles.generalSettings}>
              <h2>⚙️ Configurações Gerais</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="mainTitle">
                  Título Principal do Alerta *
                  <span className={styles.required}> *</span>
                </label>
                <input
                  id="mainTitle"
                  type="text"
                  value={mainTitle}
                  onChange={(e) => setMainTitle(e.target.value)}
                  placeholder="Digite o título principal do alerta..."
                  required
                  maxLength={100}
                  className={styles.titleInput}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="urgency">Nível de Urgência</label>
                  <select
                    id="urgency"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className={styles.urgencySelect}
                    disabled={isSubmitting}
                  >
                    <option value="low">🟢 Baixa</option>
                    <option value="medium">🟡 Média</option>
                    <option value="high">🟠 Alta</option>
                    <option value="critical">🔴 Crítica</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="expirationDate">Data de Expiração (Opcional)</label>
                  <input
                    id="expirationDate"
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className={styles.dateInput}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="gratitudeMessage">
                  Mensagem de Agradecimento
                  <span className={styles.optional}> (Opcional)</span>
                </label>
                <input
                  id="gratitudeMessage"
                  type="text"
                  value={gratitudeMessage}
                  onChange={(e) => setGratitudeMessage(e.target.value)}
                  placeholder="Digite uma mensagem de agradecimento..."
                  maxLength={150}
                  className={styles.titleInput}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className={styles.checkboxInput}
                    disabled={isSubmitting}
                  />
                  <span className={styles.checkboxCustom}></span>
                  Ativar alerta imediatamente
                </label>
              </div>
            </div>

            <div className={styles.sectionsEditor}>
              <div className={styles.sectionsHeader}>
                <h2>📋 Seções do Alerta</h2>
                <div className={styles.addSectionButtons}>
                  {SECTION_TYPES.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleAddSection(type.id)}
                      className={`${styles.addButton} ${styles[`${type.id}Button`]}`}
                      disabled={isSubmitting}
                    >
                      + {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {sections.map((section, index) => (
                <AlertSectionEditor
                  key={section.id}
                  section={section}
                  onChange={(updated) => handleSectionChange(index, updated)}
                  onRemove={() => handleRemoveSection(index)}
                />
              ))}

              <div className={styles.formattingHelp}>
                <div className={styles.formattingExamples}>
                  <h4>🎨 Formatação Rápida:</h4>
                  <div className={styles.formattingGrid}>
                    <div className={styles.formattingExample}>
                      <strong>Negrito</strong>
                      <code>**texto**</code>
                      <span className={styles.exampleResult}><strong>texto</strong></span>
                    </div>
                    <div className={styles.formattingExample}>
                      <strong>Itálico</strong>
                      <code>*texto*</code>
                      <span className={styles.exampleResult}><em>texto</em></span>
                    </div>
                    <div className={styles.formattingExample}>
                      <strong>Vermelho</strong>
                      <code>[vermelho]texto[/vermelho]</code>
                      <span className={styles.exampleResult} style={{ color: FIXED_COLORS.RED_TEXT, fontWeight: 500 }}>texto</span>
                    </div>
                    <div className={styles.formattingExample}>
                      <strong>Verde</strong>
                      <code>[verde]texto[/verde]</code>
                      <span className={styles.exampleResult} style={{ color: FIXED_COLORS.GREEN_TEXT, fontWeight: 500 }}>texto</span>
                    </div>
                    <div className={styles.formattingExample}>
                      <strong>Amarelo</strong>
                      <code>[amarelo]texto[/amarelo]</code>
                      <span className={styles.exampleResult} style={{ color: FIXED_COLORS.YELLOW_TEXT, fontWeight: 500 }}>texto</span>
                    </div>
                    <div className={styles.formattingExample}>
                      <strong>Cinza</strong>
                      <code>[cinza]texto[/cinza]</code>
                      <span className={styles.exampleResult} style={{ color: FIXED_COLORS.GRAY_TEXT }}>texto</span>
                    </div>
                  </div>
                  <div className={styles.formattingTip}>
                    <p><strong>💡 Dica:</strong> Use uma linha por item para criar listas automaticamente</p>
                  </div>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className={styles.errorMessage}>
                <span className={styles.errorIcon}>❌</span>
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className={styles.successMessage}>
                <span className={styles.successIcon}>✅</span>
                {successMessage}
              </div>
            )}

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className={styles.submitButton}
                disabled={isSubmitting || !mainTitle.trim() || sections.every(s => !s.content.trim())}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.buttonSpinner}></span>
                    Criando Alerta...
                  </>
                ) : (
                  'Criar Alerta Avançado'
                )}
              </button>
            </div>
          </div>

          <div className={styles.previewSection}>
            <div className={styles.previewHeader}>
              <h2>👁️ Visualização do Alerta</h2>
              <div className={styles.previewInfo}>
                <span className={styles.urgencyBadge} data-urgency={urgency}>
                  {urgency === 'low' && '🟢 Baixa'}
                  {urgency === 'medium' && '🟡 Média'}
                  {urgency === 'high' && '🟠 Alta'}
                  {urgency === 'critical' && '🔴 Crítica'}
                </span>
              </div>
            </div>

            <div className={styles.previewContainer}>
              {mainTitle || sections.some(s => s.content.trim()) ? (
                renderPreview()
              ) : (
                <div className={styles.emptyPreview}>
                  <p>Comece a adicionar conteúdo para visualizar o alerta</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CompactAlertManagement currentUser={user} />
    </div>
  );
};

export default CreateAlert;