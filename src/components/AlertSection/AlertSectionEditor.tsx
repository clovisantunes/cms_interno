import React from 'react';
import styles from './styles.module.scss';

interface AlertSectionEditorProps {
  section: {
    id: string;
    type: 'title' | 'warning' | 'info' | 'procedure' | 'important' | 'note';
    title: string;
    content: string;
    backgroundColor: string;
    textColor: string;
    icon?: string;
    bulletColor?: string;
  };
  onChange: (section: any) => void;
  onRemove: () => void;
}

export const AlertSectionEditor: React.FC<AlertSectionEditorProps> = ({
  section,
  onChange,
  onRemove
}) => {
  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'title': return '🏷️';
      case 'warning': return '⚠️';
      case 'info': return '📢';
      case 'procedure': return '📋';
      case 'important': return '❗';
      case 'note': return '💡';
      default: return '📝';
    }
  };

  const getSectionLabel = (type: string) => {
    switch (type) {
      case 'title': return 'Título Principal';
      case 'warning': return 'Aviso Urgente';
      case 'info': return 'Informação';
      case 'procedure': return 'Procedimento';
      case 'important': return 'Importante';
      case 'note': return 'Observação';
      default: return 'Seção';
    }
  };

  return (
    <div className={styles.sectionEditor}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionType}>
          <span className={styles.typeIcon}>{getSectionIcon(section.type)}</span>
          <span className={styles.typeLabel}>{getSectionLabel(section.type)}</span>
        </div>
        <button
          onClick={onRemove}
          className={styles.removeButton}
          type="button"
        >
          ✕
        </button>
      </div>

      <div className={styles.sectionContent}>
        <div className={styles.formGroup}>
          <label>Título da Seção</label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => onChange({ ...section, title: e.target.value })}
            placeholder="Digite o título desta seção..."
            className={styles.titleInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Conteúdo</label>
          <textarea
            value={section.content}
            onChange={(e) => onChange({ ...section, content: e.target.value })}
            placeholder="Digite o conteúdo desta seção..."
            rows={4}
            className={styles.contentTextarea}
          />
          <small className={styles.hint}>
            Use **texto** para negrito e *texto* para itálico
          </small>
        </div>

        <div className={styles.colorOptions}>
          <div className={styles.colorPicker}>
            <label>Cor de Fundo</label>
            <div className={styles.colorInputGroup}>
              <input
                type="color"
                value={section.backgroundColor}
                onChange={(e) => onChange({ ...section, backgroundColor: e.target.value })}
                className={styles.colorInput}
              />
              <input
                type="text"
                value={section.backgroundColor}
                onChange={(e) => onChange({ ...section, backgroundColor: e.target.value })}
                placeholder="#FFFFFF"
                className={styles.colorText}
              />
            </div>
          </div>

          <div className={styles.colorPicker}>
            <label>Cor do Texto</label>
            <div className={styles.colorInputGroup}>
              <input
                type="color"
                value={section.textColor}
                onChange={(e) => onChange({ ...section, textColor: e.target.value })}
                className={styles.colorInput}
              />
              <input
                type="text"
                value={section.textColor}
                onChange={(e) => onChange({ ...section, textColor: e.target.value })}
                placeholder="#000000"
                className={styles.colorText}
              />
            </div>
          </div>

          {section.type === 'procedure' && (
            <div className={styles.colorPicker}>
              <label>Cor dos Marcadores</label>
              <div className={styles.colorInputGroup}>
                <input
                  type="color"
                  value={section.bulletColor || '#000000'}
                  onChange={(e) => onChange({ ...section, bulletColor: e.target.value })}
                  className={styles.colorInput}
                />
                <input
                  type="text"
                  value={section.bulletColor || '#000000'}
                  onChange={(e) => onChange({ ...section, bulletColor: e.target.value })}
                  placeholder="#000000"
                  className={styles.colorText}
                />
              </div>
            </div>
          )}
        </div>

        {section.type === 'procedure' && (
          <div className={styles.formattingHint}>
            <small>
              Para criar uma lista, use uma linha por item
            </small>
          </div>
        )}
      </div>
    </div>
  );
};