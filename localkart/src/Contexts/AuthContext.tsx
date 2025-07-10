import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserInfo = {
  username: string;
  email: string;
  role: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  login: (user: UserInfo) => void;
  logout: () => void;
  userInfo: UserInfo | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const login = (user: UserInfo) => {
    setIsLoggedIn(true);
    setUserInfo(user);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userInfo', JSON.stringify(user));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
  };

  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    const storedUser = localStorage.getItem('userInfo');

    try {
      if (storedLogin === 'true' && storedUser && storedUser !== 'undefined') {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.username && parsedUser?.email) {
          setIsLoggedIn(true);
          setUserInfo(parsedUser);
        }
      }
    } catch (err) {
      console.error('Failed to parse user info from localStorage:', err);
      localStorage.removeItem('userInfo'); // cleanup
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
