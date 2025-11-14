import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './styles.module.scss';
import logo from '../../assets/logo-CMS-site.png';

import manualAtendimento from '../../assets/Files/1.pdf';
import manualParaAtendimentoPCMSO from '../../assets/Files/2.pdf';
import manualOnradRaioX from '../../assets/Files/3.pdf';
import manualRec from '../../assets/Files/REC/1.pdf';
import manualRec1 from '../../assets/Files/REC/3.pdf';
import manualRec2 from '../../assets/Files/REC/4.pdf';
import manualRec3 from '../../assets/Files/REC/5.pdf';
import manualRec4 from '../../assets/Files/REC/6.pdf';
import manualRec5 from '../../assets/Files/4.pdf'

import {
  MdLocalHospital,
  MdWork,
  MdBusiness,
  MdWhatsapp,
  MdAssignment,
  MdFileDownload,
  MdMenuBook,
  MdOpenInNew,
  MdExpandMore,
  MdExpandLess,
  MdHome,
  MdHealthAndSafety
} from 'react-icons/md';
import { FaFileMedicalAlt } from "react-icons/fa";

interface SidebarProps {
  onSelectManual: (fileUrl: string | null) => void;
}

export const Sidebar = ({ onSelectManual }: SidebarProps) => {
  const location = useLocation();
  const isRecRoute = location.pathname === '/rec';
  const isExpanded = true
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [openOperadoras, setOpenOperadoras] = useState(false);
  const [openLaudos, setOpenLaudos] = useState(false);
  const [openManuaisGeral, setOpenManuaisGeral] = useState(false);
  const [openManuaisMedicos, setOpenManuaisMedicos] = useState(false);

  const handleItemClick = (file: string | null, label: string) => {
    setActiveItem(label);
    onSelectManual(file);
  };

  const handleNavigation = (link: string, external = false, label: string) => {
    setActiveItem(label);
    if (external) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = link;
    }
  };


  const iconColors = {
    primary: '#B62D36', 
    secondary: '#4A90E2', 
    tertiary: '#50C878',
    accent: '#FF6B35', 
    neutral: '#6C757D'
  };

  const getIconWithColor = (icon: React.ReactElement, color: keyof typeof iconColors = 'primary') => {
    return <span style={{ color: iconColors[color] }}>{icon}</span>;
  };

  const quickAccessItems = isRecRoute
    ? [
      {
        label: 'Medicina Assistencial',
        icon: getIconWithColor(<MdLocalHospital />, 'primary'),
        action: () => handleNavigation('https://cms.4up.io/', true, 'Medicina Assistencial'),
        extern: true
      },
      {
        label: 'Medicina do Trabalho',
        icon: getIconWithColor(<MdWork />, 'secondary'),
        action: () => handleNavigation('https://centroms.agilework.com.br/Agile.MainApp/', true, 'Medicina do Trabalho'),
        extern: true
      },
      {
        label: 'WhatsApp',
        icon: getIconWithColor(<MdWhatsapp />, 'tertiary'),
        action: () => handleNavigation('https://centroms.sz.chat/static/signin?action=session_expired', true, 'WhatsApp'),
        extern: true
      },
      {
        label: 'Operadoras',
        icon: getIconWithColor(<MdBusiness />, 'neutral'),
        expandable: true,
        expanded: openOperadoras,
        toggle: () => setOpenOperadoras((prev) => !prev),
        children: [
          {
            label: 'Doctor Clin',
            action: () => handleNavigation('https://app2.goclin.com/', true, 'Doctor Clin'),
          },
          {
            label: 'CCG',
            action: () => handleNavigation('https://saviatendimento.com.br/saviatendimento/login.faces', true, 'CCG'),
          },
          {
            label: 'CASSI',
            action: () => handleNavigation('https://polimed.com.br/autenticadorOrizon/loginAutenticador', true, 'CASSI'),
          },
          {
            label: 'Cabergs',
            action: () => handleNavigation('https://portal.cabergs.org.br/autenticacao/', true, 'Cabergs'),
          },
        ],
      },
      {
        label: 'Laudos',
        icon: getIconWithColor(<MdAssignment />, 'secondary'),
        expandable: true,
        expanded: openLaudos,
        toggle: () => setOpenLaudos((prev) => !prev),
        children: [
          {
            label: 'Laboratório Pagel',
            action: () => handleNavigation('https://201.56.72.83:9997/#/login-geral', true, 'Laboratório Pagel'),
          },
          {
            label: 'Eletrocardiograma - Micromed',
            action: () => handleNavigation('https://coreum.health/classic/autenticacao/codigo-acesso', true, 'Eletrocardiograma - Micromed'),
          },
          {
            label: 'Laudo Pronto',
            action: () => handleNavigation('https://laudopronto.com.br/', true, 'Laudo Pronto'),
          },
          {
            label: 'Raio X',
            action: () => handleNavigation('https://icrx.onrad.com.br/', true, 'Raio X'),
          },
        ],
      },
    ]
    : [
      {
        label: 'Medicina Assistencial',
        icon: getIconWithColor(<MdLocalHospital />, 'primary'),
        action: () => handleNavigation('https://cms.4up.io/', true, 'Medicina Assistencial'),
        extern: true
      },
      {
        label: 'Medicina do Trabalho',
        icon: getIconWithColor(<MdWork />, 'secondary'),
        action: () => handleNavigation('https://centroms.agilework.com.br/Agile.MainApp/', true, 'Medicina do Trabalho'),
        extern: true
      },
      {
        label: 'Raio X CMS',
        icon: getIconWithColor(<FaFileMedicalAlt />, 'accent'),
        action: () => handleNavigation('https://icrx.onrad.com.br/', true, 'Raio X CMS'),
        extern: true
      },
      {
        label: 'Raio X Hospital',
        icon: getIconWithColor(<MdHealthAndSafety />, 'tertiary'),
        action: () => handleNavigation('https://www.optixone.com.br/dist/home.html', true, 'Raio X Hospital'),
        extern: true
      },  
      {
        label: 'WhatsApp',
        icon: getIconWithColor(<MdWhatsapp />, 'tertiary'),
        action: () => handleNavigation('https://centroms.sz.chat/static/signin?action=session_expired', true, 'WhatsApp'),
        extern: true
      },
      {
        label: 'Drive',
        icon: getIconWithColor(<MdFileDownload />, 'neutral'),
        action: () => handleNavigation('https://drive.google.com/', true, 'Drive'),
        extern: true
      }
    ];

  type ManualChild = {
    label: string;
    file?: string;
    action?: () => void;
  };

  const manualsRecGeral = {
    label: 'Manuais Gerais',
    icon: getIconWithColor(<MdFileDownload />, 'primary'),
    expandable: true,
    expanded: openManuaisGeral,
    toggle: () => setOpenManuaisGeral((prev) => !prev),
    children: [
      { 
        label: 'Medicina Assistêncial', 
        file: manualRec,
      },
      { 
       label: 'Emissão de Notas | Mais de um pagamento', 
       file: manualRec5,
     },
      { 
        label: 'Raio X', 
        file: manualRec1,
      },
    ] as ManualChild[],
  };

  const manualsRecMedicos = {
    label: 'Manuais Médicos',
    icon: getIconWithColor(<MdMenuBook />, 'secondary'),
    expandable: true,
    expanded: openManuaisMedicos,
    toggle: () => setOpenManuaisMedicos((prev) => !prev),
    children: [
      { 
        label: 'Manual Assistêncial', 
        file: manualRec2,
      },
      { 
        label: 'Medicina do Trabalho', 
        file: manualRec3,
      },
      { 
        label: 'Raio X', 
        file: manualRec4,
      },
      
    ] as ManualChild[],
  };

  const manualsDefault = {
    label: 'Manuais',
    icon: getIconWithColor(<MdMenuBook />, 'primary'),
    children: [
      { 
        label: 'Manual de Atendimento', 
        file: manualAtendimento,
      },
      { 
        label: 'Atendimento PCMSO', 
        file: manualParaAtendimentoPCMSO,
      },
      { 
        label: 'ONRAD RAIO X INTER', 
        file: manualOnradRaioX,
      },
      { 
        label: 'Emissão de Notas | Mais de um pagamento', 
        file: manualRec5,
      },
    ],
  };
  const homeItem = {
    label: 'Início',
    icon: getIconWithColor(<MdHome />, 'primary'),
    action: () => handleNavigation('/', false, 'Início'),
  };
 

 const recItem = {
    label: 'Recepção',
    icon: getIconWithColor(<MdHealthAndSafety />, 'tertiary'),
    action: () => handleNavigation('/rec', false, 'REC'),
  };

  return (
    <div className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      <div className={styles.topSection}>
        <div className={styles.logoContainer}>
          {isExpanded && <img src={logo} alt="Logo CMS" className={styles.logoImg} />}
        </div>
      </div>

      <div className={styles.scrollContainer}>
        <div className={styles.section}>
          {isExpanded && <p className={styles.sectionTitle}>Navegação</p>}
          <ul className={styles.menu}>
            <li 
              className={`${styles.menuItem} ${activeItem === 'Início' ? styles.active : ''}`}
              onClick={() => homeItem.action()}
            >
           
              <div className={styles.menuItemContent}>
                {homeItem.icon}
                {isExpanded && <span>{homeItem.label}</span>}
              </div>
            </li>
            <li
              className={`${styles.menuItem} ${activeItem === 'REC' ? styles.active : ''}`}
              onClick={() => recItem.action()}
            >
              <div className={styles.menuItemContent}>
                {recItem.icon}
                {isExpanded && <span>{recItem.label}</span>}
              </div>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          {isExpanded && <p className={styles.sectionTitle}>Acesso Rápido</p>}
          <ul className={styles.menu}>
            {quickAccessItems.map((item, index) => (
              <li 
                key={item.label} 
                className={`${styles.menuItem} ${activeItem === item.label ? styles.active : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={styles.menuItemContent}
                  onClick={item.expandable ? item.toggle : () => item.action && item.action()}
                >
                  {item.icon}
                  {isExpanded && (
                    <>
                      <span>{item.label}</span>
                      {item.extern && <MdOpenInNew className={styles.externalIcon} />}
                      {item.expandable && (item.expanded ? <MdExpandLess /> : <MdExpandMore />)}
                    </>
                  )}
                </div>
                {item.expandable && item.expanded && (
                  <ul className={styles.submenu}>
                    {item.children.map((child, childIndex) => (
                      <li
                        key={child.label}
                        className={styles.submenuItem}
                        onClick={() => child.action()}
                        style={{ animationDelay: `${childIndex * 0.03}s` }}
                      >
                        {isExpanded && <span>{child.label}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Seção de Manuais */}
        <div className={styles.section}>
          {isExpanded && <p className={styles.sectionTitle}>Documentação</p>}
          <ul className={styles.menu}>
            {isRecRoute ? (
              <>
                {[manualsRecGeral, manualsRecMedicos].map((manualGroup, groupIndex) => (
                  <li 
                    key={manualGroup.label} 
                    className={styles.menuItem}
                    style={{ animationDelay: `${groupIndex * 0.05}s` }}
                  >
                    <div className={styles.menuItemContent} onClick={manualGroup.toggle}>
                      {manualGroup.icon}
                      {isExpanded && (
                        <>
                          <span>{manualGroup.label}</span>
                          {manualGroup.expanded ? <MdExpandLess /> : <MdExpandMore />}
                        </>
                      )}
                    </div>
                    {manualGroup.expanded && (
                      <ul className={styles.submenu}>
                        {manualGroup.children.map((manual, manualIndex) => (
                          <li
                            key={manual.label}
                            className={styles.submenuItem}
                            onClick={() => {
                              if (manual.action) {
                                manual.action();
                              } else if (manual.file) {
                                handleItemClick(manual.file, manual.label);
                              }
                            }}
                            style={{ animationDelay: `${manualIndex * 0.03}s` }}
                          >
                            {isExpanded && <span>{manual.label}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </>
            ) : (
              manualsDefault.children.map((manual, index) => (
                <li
                  key={manual.label}
                  className={`${styles.menuItem} ${activeItem === manual.label ? styles.active : ''}`}
                  onClick={() => handleItemClick(manual.file, manual.label)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={styles.menuItemContent}>
                    {manualsDefault.icon}
                    {isExpanded && <span>{manual.label}</span>}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      
    </div>
  );
};