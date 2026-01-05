import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('sochi-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('sochi-users') || '[]');
    const foundUser = users.find((u: User) => u.email === email);
    
    if (!foundUser) {
      throw new Error('Пользователь не найден');
    }
    
    const userData: User = {
      ...foundUser,
    };
    
    setUser(userData);
    localStorage.setItem('sochi-user', JSON.stringify(userData));
  };

  const register = async (email: string, password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('sochi-users') || '[]');
    
    if (users.find((u: User) => u.email === email)) {
      throw new Error('Пользователь с таким email уже существует');
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      createdAt: new Date().toISOString(),
      preferences: {
        activities: [],
        budget: 'medium',
        travelStyle: 'relaxing',
      },
    };
    
    users.push(newUser);
    localStorage.setItem('sochi-users', JSON.stringify(users));
    
    setUser(newUser);
    localStorage.setItem('sochi-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sochi-user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('sochi-user', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('sochi-users') || '[]');
    const updatedUsers = users.map((u: User) => 
      u.id === user.id ? updatedUser : u
    );
    localStorage.setItem('sochi-users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
