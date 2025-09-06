import { createContext, useContext, useState } from 'react';
import { router } from 'expo-router';

export type UserRole = 'student' | 'parent' | 'ops' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  year?: string;
  studentId?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string, role: UserRole) => {
    // Simulate API call with mock data based on role
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUsers: Record<UserRole, User> = {
      student: {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@college.edu',
        role: 'student',
        department: 'Computer Science',
        year: 'Senior',
        studentId: 'CS2024001',
        phone: '+1 (555) 123-4567',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=150&h=150&fit=crop&crop=face',
      },
      parent: {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@email.com',
        role: 'parent',
        phone: '+1 (555) 987-6543',
        avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150&h=150&fit=crop&crop=face',
      },
      ops: {
        id: '3',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@college.edu',
        role: 'ops',
        department: 'Operations',
        phone: '+1 (555) 456-7890',
        avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?w=150&h=150&fit=crop&crop=face',
      },
      admin: {
        id: '4',
        name: 'Michael Johnson',
        email: 'michael.johnson@college.edu',
        role: 'admin',
        department: 'Administration',
        phone: '+1 (555) 234-5678',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=150&h=150&fit=crop&crop=face',
      },
    };

    const mockUser = mockUsers[role];
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    try {
      // Clear authentication state first
      setUser(null);
      setIsAuthenticated(false);
      
      // For web, use replace to clear navigation stack
      if (typeof window !== 'undefined') {
        router.replace('/(auth)/login');
      } else {
        // For mobile, push is fine
        router.push('/(auth)/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force navigation to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      } else {
        router.replace('/(auth)/login');
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
