'use client';

import React from "react"

import { BankLogo } from '@/components/BankLogo';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'john@example.com',
    password: 'hashed_password_1',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store user in localStorage for session management
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.error || 'Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">PT</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 text-primary">
            PTBank
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Secure Banking Platform
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Demo credentials:
            </p>
            <div className="space-y-1">
               <p className="text-[10px] text-muted-foreground font-mono">User: john@example.com / hashed_password_1</p>
               <p className="text-[10px] text-muted-foreground font-mono">Admin: admin@bank.com / admin_password</p>
            </div>
          </div>

          {/* Quick Login Buttons */}
          <div className="mt-6 space-y-2">
            <Button
              onClick={() => {
                setFormData({
                  email: 'john@example.com',
                  password: 'hashed_password_1',
                });
              }}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10"
            >
              Set John (User)
            </Button>
            <Button
              onClick={() => {
                setFormData({
                  email: 'admin@bank.com',
                  password: 'admin_password',
                });
              }}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10"
            >
              Set Admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
