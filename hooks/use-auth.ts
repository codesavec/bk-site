import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UserSession {
  _id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  balance: number;
  accountNumber: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from localStorage');
      }
    } else {
        // Only redirect if not on login page
        if (window.location.pathname !== '/login') {
            router.push('/login');
        }
    }
    setLoading(false);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  return { user, loading, logout };
}
