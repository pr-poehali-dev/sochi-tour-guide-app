import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  getAllUsers: () => StoredUser[];
  switchUser: (userId: string) => void;
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
    
    const users: StoredUser[] = JSON.parse(localStorage.getItem('sochi-users') || '[]');
    const foundUser = users.find((u: StoredUser) => u.email === email);
    
    if (!foundUser) {
      throw new Error('Пользователь не найден');
    }
    
    if (foundUser.password !== password) {
      throw new Error('Неверный пароль');
    }
    
    const userData: User = {
      id: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      phone: foundUser.phone,
      avatar: foundUser.avatar,
      preferences: foundUser.preferences,
      createdAt: foundUser.createdAt,
    };
    
    setUser(userData);
    localStorage.setItem('sochi-user', JSON.stringify(userData));
  };

  const register = async (email: string, password: string, name: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users: StoredUser[] = JSON.parse(localStorage.getItem('sochi-users') || '[]');
    
    if (users.find((u: StoredUser) => u.email === email)) {
      throw new Error('Пользователь с таким email уже существует');
    }
    
    const newStoredUser: StoredUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      password,
      createdAt: new Date().toISOString(),
      preferences: {
        activities: [],
        budget: 'medium',
        travelStyle: 'relaxing',
      },
    };
    
    users.push(newStoredUser);
    localStorage.setItem('sochi-users', JSON.stringify(users));
    
    const newUser: User = {
      id: newStoredUser.id,
      email: newStoredUser.email,
      name: newStoredUser.name,
      createdAt: newStoredUser.createdAt,
      preferences: newStoredUser.preferences,
    };
    
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
    
    const users: StoredUser[] = JSON.parse(localStorage.getItem('sochi-users') || '[]');
    const updatedUsers = users.map((u: StoredUser) => 
      u.id === user.id ? { ...u, ...updates } : u
    );
    localStorage.setItem('sochi-users', JSON.stringify(updatedUsers));
  };

  const getAllUsers = (): StoredUser[] => {
    return JSON.parse(localStorage.getItem('sochi-users') || '[]');
  };

  const switchUser = (userId: string) => {
    const users: StoredUser[] = JSON.parse(localStorage.getItem('sochi-users') || '[]');
    const foundUser = users.find(u => u.id === userId);
    
    if (foundUser) {
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        phone: foundUser.phone,
        avatar: foundUser.avatar,
        preferences: foundUser.preferences,
        createdAt: foundUser.createdAt,
      };
      
      setUser(userData);
      localStorage.setItem('sochi-user', JSON.stringify(userData));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, getAllUsers, switchUser }}>
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