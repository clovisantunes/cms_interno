import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp,
  serverTimestamp, 
  getFirestore,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface AlertSection {
  id: string;
  type: 'title' | 'warning' | 'info' | 'procedure' | 'important' | 'note';
  title: string;
  content: string;
  backgroundColor: string;
  textColor: string;
  icon?: string;
  bulletColor?: string;
}

export interface AlertData {
  id?: string;
  sections: AlertSection[];
  mainTitle: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  expirationDate: string | null;
  isActive: boolean;
  createdAt: Date;
  expiresAt: Date;
  createdBy: string;
}

export const createAlert = async (
  userId: string,
  alertData: Omit<AlertData, 'id' | 'createdAt' | 'expiresAt' | 'createdBy'>
) => {
  try {
    const now = new Date();

    const expiresAt = alertData.expirationDate
      ? new Date(alertData.expirationDate)
      : new Date(now.getTime() + 72 * 60 * 60 * 1000); 

    const alertToSave = {
      ...alertData,
      createdAt: serverTimestamp(), 
      expiresAt: Timestamp.fromDate(expiresAt),
      createdBy: userId,
    };

    console.log('Tentando salvar alerta:', alertToSave);
    const docRef = await addDoc(collection(db, 'alerts'), alertToSave);
    console.log('Alerta criado com ID:', docRef.id);

    return {
      ...alertData,
      id: docRef.id,
      createdAt: now,
      expiresAt: expiresAt,
      createdBy: userId,
    };
  } catch (error) {
    console.error('Erro ao criar alerta:', error);
    throw error;
  }
};

   
 

export const getActiveAlerts = async (): Promise<AlertData[]> => {
  try {
    const db = getFirestore();
    const alertsCollection = collection(db, 'alerts');
    const queryRef = query(
      alertsCollection,
      where('isActive', '==', true),
      where('expiresAt', '>', new Date()), 
      orderBy('expiresAt', 'asc'),
      orderBy('createdAt', 'desc') 
    );
    
    const snapshot = await getDocs(queryRef);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        sections: data.sections || [],
        mainTitle: data.mainTitle || '',
        urgency: data.urgency || 'medium',
        expirationDate: data.expirationDate || null,
        isActive: data.isActive || false,
        createdAt: data.createdAt?.toDate() || new Date(),
        expiresAt: data.expiresAt?.toDate() || new Date(),
        createdBy: data.createdBy || '',
        gratitudeMessage: data.gratitudeMessage || ''
      };
    });
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    throw error;
  }
};



export const parseAlertContent = (content: string): string => {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
};

export const createDefaultSection = (type: AlertSection['type']): AlertSection => {
  const defaults = {
    title: {
      backgroundColor: '#2196F3',
      textColor: '#FFFFFF',
      icon: '🏷️',
    },
    warning: {
      backgroundColor: '#F44336',
      textColor: '#FFFFFF',
      icon: '⚠️',
    },
    info: {
      backgroundColor: '#2196F3',
      textColor: '#FFFFFF',
      icon: '📢',
    },
    procedure: {
      backgroundColor: '#4CAF50',
      textColor: '#FFFFFF',
      bulletColor: '#FFFFFF',
      icon: '📋',
    },
    important: {
      backgroundColor: '#FF9800',
      textColor: '#FFFFFF',
      icon: '❗',
    },
    note: {
      backgroundColor: '#9C27B0',
      textColor: '#FFFFFF',
      icon: '💡',
    },
  };

  const defaultData = defaults[type] || defaults.info;
  
  return {
    id: Date.now().toString(),
    type,
    title: type === 'title' ? 'Título Principal' : 
           type === 'warning' ? 'Aviso Urgente' :
           type === 'procedure' ? 'Procedimento Correto' :
           type === 'important' ? 'Importante' :
           type === 'note' ? 'Observações' : 'Informação',
    content: '',
    backgroundColor: defaultData.backgroundColor,
    textColor: defaultData.textColor,
    icon: defaultData.icon,
    bulletColor: (defaultData as any).bulletColor,
  };
};

export const getAlerts = async (userId: string) => {
  try {
    const alertsRef = collection(db, 'alerts');
    const q = query(alertsRef, where('createdBy', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar alertas:', error);
    throw error;
  }
};

export const deleteAlert = async ( alertId: string) => {
  try {
    const alertDoc = doc(db, 'alerts', alertId);
    await deleteDoc(alertDoc);
  } catch (error) {
    console.error('Erro ao excluir alerta:', error);
    throw error;
  }
};