import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase/config';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const generateToken = (uid: string): string => {
  const payload = {
    uid,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 horas
    iat: Math.floor(Date.now() / 1000),
  };
  
  const token = btoa(JSON.stringify(payload));
  return token;
};

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    const decoded = JSON.parse(atob(token));
    const now = Math.floor(Date.now() / 1000);
    
    if (decoded.exp < now) {
      console.log('Token expirado');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return false;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth(app);

  const initializeAuth = useCallback(() => {
    setIsLoading(true);
    
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && isTokenValid(storedToken) && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
      } catch (error) {
        console.error('Erro ao recuperar usuário:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;
      
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
      };
      
      const newToken = generateToken(firebaseUser.uid);
      
      setUser(userData);
      setToken(newToken);
      
      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      
      return true;
    } catch (error: any) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setToken(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const refreshToken = async (): Promise<string | null> => {
    if (!user) return null;
    
    const newToken = generateToken(user.uid);
    setToken(newToken);
    localStorage.setItem('auth_token', newToken);
    
    return newToken;
  };

  useEffect(() => {
    const checkTokenInterval = setInterval(() => {
      if (token && !isTokenValid(token)) {
        console.log('Token expirado, fazendo logout...');
        logout();
      }
    }, 60000);

    return () => clearInterval(checkTokenInterval);
  }, [token]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        };
        
        const currentToken = localStorage.getItem('auth_token');
        if (!currentToken || !isTokenValid(currentToken)) {
          const newToken = generateToken(firebaseUser.uid);
          setToken(newToken);
          localStorage.setItem('auth_token', newToken);
        }
        
        setUser(userData);
        localStorage.setItem('auth_user', JSON.stringify(userData));
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const value = {
    user,
    token,
    isAuthenticated: !!user && !!token && isTokenValid(token),
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};